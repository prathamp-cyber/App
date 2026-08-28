import React, { createContext, useContext, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface AppContextType {
  savedIds: string[];
  comparedIds: string[];
  toggleSave: (id: string) => void;
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
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [city, setCity] = useState<string>('Gandhidham');
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  
  const systemScheme = useRNColorScheme();
  const resolvedTheme: 'light' | 'dark' =
    themeMode === 'system'
      ? (systemScheme === 'dark' ? 'dark' : 'light')
      : themeMode;

  const toggleThemeMode = () => {
    setThemeMode((prev) => (resolvedTheme === 'dark' ? 'light' : 'dark'));
  };

  const toggleSave = (id: string) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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

