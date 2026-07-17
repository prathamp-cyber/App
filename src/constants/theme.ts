/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#1E2022',
    background: '#FFFFFF',
    backgroundElement: '#F9F8F6',
    backgroundSelected: '#F0EDE9',
    textSecondary: '#5A6065',
    primaryBrown: '#8D5B4C', // Rich wood brown
    primaryGreen: '#1E3F20', // Dark forest green
    accentGreenLight: '#E8EFE9', // Light green wash for tags
    accentBrownLight: '#F5ECE9', // Light brown wash for tags
    border: '#E8E6E1',
  },
  dark: {
    text: '#F5F5F7',
    background: '#121212',
    backgroundElement: '#1E1E1E',
    backgroundSelected: '#2A2A2A',
    textSecondary: '#A0A5AB',
    primaryBrown: '#A87465',
    primaryGreen: '#2D5B30',
    accentGreenLight: '#1C2E21',
    accentBrownLight: '#2D201C',
    border: '#2E2E2E',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = 0;
export const MaxContentWidth = 800;
