import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/theme';
import { useAppContext } from '@/context/AppContext';

export function useTheme() {
  try {
    const { resolvedTheme } = useAppContext();
    return Colors[resolvedTheme];
  } catch {
    const scheme = useColorScheme();
    return Colors[scheme === 'dark' ? 'dark' : 'light'];
  }
}

