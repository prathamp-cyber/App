import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AppProvider, useAppContext } from '@/context/AppContext';
import { AuthProvider } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth-modal';
import { UserProfileModal } from '@/components/user-profile-modal';
import { useTheme } from '@/hooks/use-theme';

SplashScreen.preventAutoHideAsync();


function AppMainLayout() {
  const { resolvedTheme } = useAppContext();
  const theme = useTheme();

  return (
    <ThemeProvider value={resolvedTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <AuthModal />
      <UserProfileModal />
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
    </ThemeProvider>
  );
}

export default function TabLayout() {
  return (
    <AppProvider>
      <AuthProvider>
        <AppMainLayout />
      </AuthProvider>
    </AppProvider>
  );
}

