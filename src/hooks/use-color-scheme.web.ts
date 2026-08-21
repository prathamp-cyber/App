import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { useAppContext } from '@/context/AppContext';

export function useColorScheme() {
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  try {
    const { resolvedTheme } = useAppContext();
    return resolvedTheme;
  } catch {
    const colorScheme = useRNColorScheme();
    if (hasHydrated) {
      return colorScheme === 'dark' ? 'dark' : 'light';
    }
    return 'light';
  }
}

