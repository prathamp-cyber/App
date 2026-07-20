import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AppProvider } from '@/context/AppContext';
import { useTheme } from '@/hooks/use-theme';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const theme = useTheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppProvider>
        <AnimatedSplashOverlay />
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: theme.primaryGreen,
            tabBarInactiveTintColor: theme.textSecondary,
            tabBarStyle: {
              backgroundColor: theme.background,
              borderTopColor: theme.border,
              paddingTop: 5,
              height: Platform.OS === 'ios' ? 88 : 60,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              fontWeight: '700',
              paddingBottom: Platform.OS === 'ios' ? 0 : 5,
            }
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Explore",
              tabBarIcon: ({ color }) => (
                <Ionicons
                  name="compass"
                  size={22}
                  color={color}
                />
              )
            }}
          />
          <Tabs.Screen
            name="compare"
            options={{
              title: "Compare",
              tabBarIcon: ({ color }) => (
                <Ionicons
                  name="git-compare"
                  size={22}
                  color={color}
                />
              )
            }}
          />
          <Tabs.Screen
            name="saved"
            options={{
              title: "Saved",
              tabBarIcon: ({ color }) => (
                <Ionicons
                  name="heart"
                  size={22}
                  color={color}
                />
              )
            }}
          />
        </Tabs>
      </AppProvider>
    </ThemeProvider>
  );
}
