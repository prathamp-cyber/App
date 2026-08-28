import React, { createContext, useContext, useState } from 'react';

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

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
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
  logout: () => void;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEMO_CLIENT); // Default logged in as demo client
  const [isAuthModalVisible, setAuthModalVisible] = useState(false);
  const [isProfileModalVisible, setProfileModalVisible] = useState(false);

  const login = async (email: string, password: string, role?: UserRole): Promise<{ success: boolean; error?: string }> => {
    if (!email || !password) {
      return { success: false, error: 'Please fill in both email and password.' };
    }

    if (password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (role === 'designer' || email.toLowerCase().includes('designer')) {
      setUser(DEMO_DESIGNER);
    } else {
      setUser({
        id: `user_${Date.now()}`,
        name: email.split('@')[0].replace('.', ' ').toUpperCase(),
        email: email.toLowerCase(),
        role: 'client',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop',
        memberSince: new Date().getFullYear().toString(),
        city: 'Gandhidham',
      });
    }

    setAuthModalVisible(false);
    return { success: true };
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

    if (params.password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    const newUser: User = {
      id: `user_${Date.now()}`,
      name: params.name.trim(),
      email: params.email.trim().toLowerCase(),
      role: params.role,
      phone: params.phone?.trim() || '+91 99000 00000',
      firmName: params.firmName?.trim(),
      avatar: params.role === 'designer'
        ? 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
      memberSince: new Date().getFullYear().toString(),
      city: params.city || 'Gandhidham',
    };

    setUser(newUser);
    setAuthModalVisible(false);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setProfileModalVisible(false);
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
        isAuthenticated: !!user,
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
