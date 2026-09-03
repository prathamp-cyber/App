import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';

export type UserRole = 'client' | 'designer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  memberSince: string;
  firmName?: string;
  city?: string;
}

const ONBOARDING_STORAGE_KEY = '@dwellist_has_seen_onboarding';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasSeenOnboarding: boolean;
  completeOnboarding: () => Promise<void>;
  login: (email: string, password: string, role?: UserRole) => Promise<{ success: boolean; error?: string }>;
  signup: (params: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    firmName?: string;
    city?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void> | void;
  quickDemoLogin: (role: UserRole) => void;
  isAuthModalVisible: boolean;
  setAuthModalVisible: (visible: boolean) => void;
  isProfileModalVisible: boolean;
  setProfileModalVisible: (visible: boolean) => void;
  openAuthModal: () => void;
  openProfileModal: () => void;
}

const DEMO_CLIENT: User = {
  id: 'user_client_1',
  name: 'Darshan Vora',
  email: 'darshan.vora@example.com',
  role: 'client',
  phone: '+91 98250 12345',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
  memberSince: '2024',
  city: 'Gandhidham',
};

const DEMO_DESIGNER: User = {
  id: 'user_designer_1',
  name: 'Ar. Priya Sharma',
  email: 'priya@dwellist.in',
  role: 'designer',
  phone: '+91 98795 67890',
  firmName: 'Studio Form & Space',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop',
  memberSince: '2023',
  city: 'Ahmedabad',
};

const mapDbRowToUser = (dbRow: any, fallbackEmail?: string): User => {
  return {
    id: dbRow.id,
    name: dbRow.name || 'User',
    email: dbRow.email || fallbackEmail || '',
    role: (dbRow.role as UserRole) || 'client',
    phone: dbRow.phone || undefined,
    avatar:
      dbRow.avatar ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop',
    memberSince: dbRow.created_at
      ? new Date(dbRow.created_at).getFullYear().toString()
      : new Date().getFullYear().toString(),
    firmName: dbRow.firm_name || undefined,
    city: dbRow.city || 'Gandhidham',
  };
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);
  const [isAuthModalVisible, setAuthModalVisible] = useState(false);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);

  // Helper to fetch user profile row from `public.users` table
  const fetchUserProfile = async (userId: string, email?: string): Promise<User | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.warn('Error fetching user profile row from database:', error.message);
        return null;
      }

      if (data) {
        return mapDbRowToUser(data, email);
      }

      return null;
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      return null;
    }
  };

  // Restore onboarding state and session on app load
  useEffect(() => {
    let isMounted = true;

    const initializeAuthAndOnboarding = async () => {
      try {
        // 1. Read onboarding flag from AsyncStorage
        const seenFlag = await AsyncStorage.getItem(ONBOARDING_STORAGE_KEY);
        if (isMounted && seenFlag === 'true') {
          setHasSeenOnboarding(true);
        }

        // 2. Fetch stored session from Supabase / AsyncStorage
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user && isMounted) {
          const profile = await fetchUserProfile(session.user.id, session.user.email);
          if (profile) {
            setUser(profile);
          } else {
            // Fallback user object using auth metadata if DB row not found yet
            setUser({
              id: session.user.id,
              name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
              email: session.user.email || '',
              role: (session.user.user_metadata?.role as UserRole) || 'client',
              city: session.user.user_metadata?.city || 'Gandhidham',
              firmName: session.user.user_metadata?.firm_name,
              memberSince: new Date().getFullYear().toString(),
            });
          }
        }
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuthAndOnboarding();

    // 3. Listen to all relevant Supabase auth state events (INITIAL_SESSION, SIGNED_IN, TOKEN_REFRESHED)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (
        (event === 'SIGNED_IN' || event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED') &&
        session?.user &&
        isMounted
      ) {
        const profile = await fetchUserProfile(session.user.id, session.user.email);
        if (profile) {
          setUser(profile);
        }
        setIsLoading(false);
      } else if (event === 'SIGNED_OUT' && isMounted) {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    } catch (err) {
      console.error('Failed to save onboarding state:', err);
    } finally {
      setHasSeenOnboarding(true);
      if (!user) {
        setAuthModalVisible(true);
      }
    }
  };

  const login = async (
    email: string,
    password: string,
    role?: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    if (!email.trim() || !password.trim()) {
      return { success: false, error: 'Please fill in both email and password.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { success: false, error: 'Invalid email or password. Please check your credentials and try again.' };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profile = await fetchUserProfile(data.user.id, data.user.email);

        if (profile) {
          setUser(profile);
        } else {
          setUser({
            id: data.user.id,
            name: data.user.user_metadata?.name || email.split('@')[0],
            email: email.toLowerCase(),
            role: role || (data.user.user_metadata?.role as UserRole) || 'client',
            city: 'Gandhidham',
            memberSince: new Date().getFullYear().toString(),
          });
        }

        setAuthModalVisible(false);
        return { success: true };
      }

      return { success: false, error: 'Authentication failed. Please try again.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'An unexpected authentication error occurred.' };
    }
  };

  const signup = async (params: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    firmName?: string;
    city?: string;
  }): Promise<{ success: boolean; error?: string }> => {
    if (!params.name.trim() || !params.email.trim() || !params.password.trim()) {
      return { success: false, error: 'Please enter your name, email, and password.' };
    }

    if (params.password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    try {
      const cleanEmail = params.email.trim().toLowerCase();
      const cleanName = params.name.trim();

      // 1. Register with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: params.password,
        options: {
          data: {
            name: cleanName,
            role: params.role,
            city: params.city?.trim() || 'Gandhidham',
            firm_name: params.firmName?.trim(),
            phone: params.phone?.trim(),
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered')) {
          return { success: false, error: 'An account with this email address already exists.' };
        }
        return { success: false, error: error.message };
      }

      if (data.user) {
        const userRow = {
          id: data.user.id,
          name: cleanName,
          email: cleanEmail,
          role: params.role,
          phone: params.phone?.trim() || null,
          city: params.city?.trim() || 'Gandhidham',
          firm_name: params.firmName?.trim() || null,
          avatar:
            params.role === 'designer'
              ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop'
              : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
        };

        // 2. Insert profile record into public.users table
        const { error: dbError } = await supabase.from('users').upsert(userRow);

        if (dbError) {
          console.warn('Warning: Could not create public.users profile row:', dbError.message);
        }

        const newUser: User = {
          id: data.user.id,
          name: userRow.name,
          email: userRow.email,
          role: params.role,
          phone: userRow.phone || undefined,
          firmName: userRow.firm_name || undefined,
          avatar: userRow.avatar,
          city: userRow.city,
          memberSince: new Date().getFullYear().toString(),
        };

        setUser(newUser);
        setAuthModalVisible(false);
        return { success: true };
      }

      return { success: false, error: 'Registration failed. Please try again.' };
    } catch (err: any) {
      return { success: false, error: err.message || 'An unexpected registration error occurred.' };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setProfileModalVisible(false);
    }
  };

  const quickDemoLogin = (role: UserRole) => {
    setUser(role === 'designer' ? DEMO_DESIGNER : DEMO_CLIENT);
    setAuthModalVisible(false);
  };

  const openAuthModal = () => {
    setAuthModalVisible(true);
  };

  const openProfileModal = () => {
    if (user) {
      setProfileModalVisible(true);
    } else {
      setAuthModalVisible(true);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        hasSeenOnboarding,
        completeOnboarding,
        login,
        signup,
        logout,
        quickDemoLogin,
        isAuthModalVisible,
        setAuthModalVisible,
        isProfileModalVisible,
        setProfileModalVisible,
        openAuthModal,
        openProfileModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
