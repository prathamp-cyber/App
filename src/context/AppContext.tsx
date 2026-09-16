import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

export type ThemeMode = 'light' | 'dark' | 'system';

const THEME_STORAGE_KEY = '@dwellist_theme_mode';

interface AppContextType {
  savedIds: string[];
  comparedIds: string[];
  toggleSave: (id: string) => Promise<void> | void;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  isSaved: (id: string) => boolean;
  isCompared: (id: string) => boolean;
  city: string;
  setCity: (city: string) => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleThemeMode: () => void;
  resolvedTheme: 'light' | 'dark';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, openAuthModal } = useAuth();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [city, setCity] = useState<string>('Gandhidham');
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light');
  
  const systemScheme = useRNColorScheme();

  // Restore saved theme mode from AsyncStorage on app launch
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((stored) => {
        if (stored === 'light' || stored === 'dark' || stored === 'system') {
          setThemeModeState(stored as ThemeMode);
        }
      })
      .catch((err) => console.warn('Could not read theme mode from storage:', err));
  }, []);

  // Sync saved designers from Supabase database `saved_designers` table whenever user changes
  useEffect(() => {
    let isMounted = true;

    const fetchSavedDesignersFromDb = async () => {
      if (!user?.id) {
        if (isMounted) setSavedIds([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('saved_designers')
          .select('designer_id')
          .eq('user_id', user.id);

        if (error) {
          console.warn('[Dwellist Saved] Error fetching saved designers:', error.message);
          return;
        }

        if (data && isMounted) {
          const ids = data.map((row: any) => row.designer_id);
          setSavedIds(ids);
        }
      } catch (err) {
        console.error('[Dwellist Saved] Failed to load saved designers:', err);
      }
    };

    fetchSavedDesignersFromDb();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, mode).catch((err) =>
      console.warn('Could not persist theme mode to storage:', err)
    );
  };

  const resolvedTheme: 'light' | 'dark' =
    themeMode === 'system'
      ? (systemScheme === 'dark' ? 'dark' : 'light')
      : themeMode;

  const toggleThemeMode = () => {
    const nextMode = resolvedTheme === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
  };

  const toggleSave = async (id: string) => {
    // 5. Handle logged-out case: prompt login via openAuthModal()
    if (!user) {
      openAuthModal();
      return;
    }

    const currentlySaved = savedIds.includes(id);

    // Optimistic UI state update
    setSavedIds((prev) =>
      currentlySaved ? prev.filter((item) => item !== id) : [...prev, id]
    );

    if (currentlySaved) {
      // 3. Un-saving -> delete matching row from saved_designers table
      const { error } = await supabase
        .from('saved_designers')
        .delete()
        .eq('user_id', user.id)
        .eq('designer_id', id);

      if (error) {
        console.error('[Dwellist Saved] Error removing saved designer:', error.message);
        // Revert optimistic update on failure
        setSavedIds((prev) => [...prev, id]);
      }
    } else {
      // 2. Saving -> insert/upsert into saved_designers table
      const { error } = await supabase
        .from('saved_designers')
        .upsert(
          { user_id: user.id, designer_id: id },
          { onConflict: 'user_id, designer_id' }
        );

      if (error) {
        console.error('[Dwellist Saved] Error saving designer:', error.message);
        // Revert optimistic update on failure
        setSavedIds((prev) => prev.filter((item) => item !== id));
      }
    }
  };

  const toggleCompare = (id: string) => {
    setComparedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        // Limit to comparing 3 designers max for a neat UI layout
        if (prev.length >= 3) {
          alert("You can compare up to 3 designers at a time.");
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const clearCompare = () => {
    setComparedIds([]);
  };

  const isSaved = (id: string) => savedIds.includes(id);
  const isCompared = (id: string) => comparedIds.includes(id);

  return (
    <AppContext.Provider
      value={{
        savedIds,
        comparedIds,
        toggleSave,
        toggleCompare,
        clearCompare,
        isSaved,
        isCompared,
        city,
        setCity,
        themeMode,
        setThemeMode,
        toggleThemeMode,
        resolvedTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
