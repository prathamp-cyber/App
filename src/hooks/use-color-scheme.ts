import { useColorScheme as useRNColorScheme } from 'react-native';
import { useAppContext } from '@/context/AppContext';

export function useColorScheme(): 'light' | 'dark' {
  try {
    const { resolvedTheme } = useAppContext();
    return resolvedTheme;
  } catch {
    const scheme = useRNColorScheme();
    return scheme === 'dark' ? 'dark' : 'light';
  }
}

