import { useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Platform, ActivityIndicator, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { AppProvider, useAppContext } from '@/context/AppContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/auth-modal';
import { UserProfileModal } from '@/components/user-profile-modal';
import { OnboardingCarousel } from '@/components/onboarding-carousel';
import { useTheme } from '@/hooks/use-theme';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

SplashScreen.preventAutoHideAsync();

function AppMainLayout() {
  const { resolvedTheme } = useAppContext();
  const theme = useTheme();
  const { user, isLoading, hasSeenOnboarding, isAuthModalVisible, setAuthModalVisible } = useAuth();

  // Auto-trigger auth modal if session loading is complete, user has completed onboarding, and is unauthenticated
  useEffect(() => {
    if (!isLoading && hasSeenOnboarding && !user && !isAuthModalVisible) {
      setAuthModalVisible(true);
    }
  }, [isLoading, hasSeenOnboarding, user, isAuthModalVisible]);

  // 1. Render Loading Screen while restoring auth session & onboarding state on app load
  if (isLoading) {
    return (
      <ThemeProvider value={resolvedTheme === 'dark' ? DarkTheme : DefaultTheme}>
        <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.primaryGreen} />
          <ThemedText type="smallBold" style={{ marginTop: 14, color: theme.primaryGreen, letterSpacing: 0.5 }}>
            Loading Dwellist...
          </ThemedText>
        </ThemedView>
      </ThemeProvider>
    );
  }

  // 2. Render Onboarding Carousel on first app open for unauthenticated users
  if (!hasSeenOnboarding && !user) {
    return (
      <ThemeProvider value={resolvedTheme === 'dark' ? DarkTheme : DefaultTheme}>
        <OnboardingCarousel />
      </ThemeProvider>
    );
  }

  const isDesigner = user?.role === 'designer';

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
            display: isDesigner ? 'none' : 'flex',
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '700',
            paddingBottom: Platform.OS === 'ios' ? 0 : 5,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: isDesigner ? "Studio Portal" : "Explore",
            tabBarIcon: ({ color }) => (
              <Ionicons
                name={isDesigner ? "briefcase" : "compass"}
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="compare"
          options={{
            title: "Compare",
            href: isDesigner ? null : undefined, // Hide compare tab for designers
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="git-compare"
                size={22}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            title: "Saved",
            href: isDesigner ? null : undefined, // Hide saved tab for designers
            tabBarIcon: ({ color }) => (
              <Ionicons
                name="heart"
                size={22}
                color={color}
              />
            ),
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
