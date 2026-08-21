import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Platform, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing, BottomTabInset, MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MOCK_DESIGNERS, Designer } from '@/constants/mockData';
import { useAppContext } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { DesignerCard } from '@/components/designer-card';
import { DesignerDetailModal } from '@/components/designer-detail-modal';

export default function SavedScreen() {
  const theme = useTheme();
  const { savedIds, toggleThemeMode, resolvedTheme } = useAppContext();
  const { user, openAuthModal, openProfileModal } = useAuth();
  const [selectedDesigner, setSelectedDesigner] = useState<Designer | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const brown = theme.primaryBrown;
  const green = theme.primaryGreen;

  // Retrieve bookmarked designers
  const savedDesigners = MOCK_DESIGNERS.filter((d) => savedIds.includes(d.id));

  const handleCardPress = (designer: Designer) => {
    setSelectedDesigner(designer);
    setModalVisible(true);
  };

  const safeAreaStyle = Platform.select({
    ios: { paddingBottom: BottomTabInset },
    android: { paddingBottom: BottomTabInset },
    default: { paddingBottom: Spacing.four }
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={[styles.safeArea, safeAreaStyle]}>
        
        {/* Header Action Bar */}
        <View style={styles.header}>
          <View>
            <ThemedText type="subtitle" style={{ color: green }}>
              Saved Studios
            </ThemedText>
            <ThemedText style={styles.headerSubtitle} themeColor="textSecondary">
              Your curated list of favorite design studios
            </ThemedText>
          </View>

          <View style={styles.headerRightActions}>
            {/* Theme Toggle Button */}
            <Pressable
              onPress={toggleThemeMode}
              style={({ pressed }) => [
                styles.themeIconButton,
                { borderColor: theme.border, backgroundColor: theme.backgroundElement },
                pressed && { opacity: 0.7 }
              ]}
              accessibilityLabel="Toggle Light/Dark Theme"
            >
              <Ionicons
                name={resolvedTheme === 'dark' ? 'sunny' : 'moon'}
                size={16}
                color={resolvedTheme === 'dark' ? '#F1C40F' : brown}
              />
            </Pressable>

            {/* Right Header Auth Profile Trigger */}
            {user ? (
              <Pressable
                onPress={openProfileModal}
                style={({ pressed }) => [
                  styles.profileButton,
                  { borderColor: theme.border, backgroundColor: theme.backgroundElement },
                  pressed && { opacity: 0.8 }
                ]}
              >
                {user.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.userAvatar} contentFit="cover" />
                ) : (
                  <View style={[styles.userInitialsBg, { backgroundColor: user.role === 'designer' ? brown : green }]}>
                    <Text style={styles.userInitialsText}>{user.name.charAt(0)}</Text>
                  </View>
                )}
                <View style={styles.onlineDot} />
              </Pressable>
            ) : (
              <Pressable
                onPress={openAuthModal}
                style={({ pressed }) => [
                  styles.signInPill,
                  { backgroundColor: green },
                  pressed && { opacity: 0.9 }
                ]}
              >
                <Ionicons name="person-circle-outline" size={16} color="#FFFFFF" />
                <Text style={styles.signInText}>Sign In</Text>
              </Pressable>
            )}
          </View>
        </View>

        {savedDesigners.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyState}>
            <View style={[styles.emptyIconBg, { backgroundColor: theme.accentBrownLight }]}>
              <Ionicons
                name="heart"
                size={36}
                color={brown}
              />
            </View>
            <ThemedText type="smallBold" style={{ textAlign: 'center', marginBottom: 6 }}>
              No saved studios
            </ThemedText>
            <ThemedText style={styles.emptyText} themeColor="textSecondary">
              Tap the heart icon on any interior design studio card in the Explore tab to save them here for quick access later.
            </ThemedText>
          </View>
        ) : (
          /* List of Bookmarked Designers */
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContent}>
            {savedDesigners.map((designer) => (
              <DesignerCard
                key={designer.id}
                designer={designer}
                onPress={() => handleCardPress(designer)}
              />
            ))}
          </ScrollView>
        )}

      </SafeAreaView>

      {/* Designer Profile Detail Sheet Modal */}
      <DesignerDetailModal
        designer={selectedDesigner}
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedDesigner(null);
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.two,
    marginBottom: Spacing.four,
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButton: {
    position: 'relative',
    padding: 2,
    borderRadius: 20,
    borderWidth: 1,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  userInitialsBg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInitialsText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#27AE60',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  signInPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.five,
    paddingBottom: 80,
  },
  emptyIconBg: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  emptyText: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
  },
  listContent: {
    paddingBottom: 20,
  },
});
