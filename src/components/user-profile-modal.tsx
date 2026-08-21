import React from 'react';
import { Modal, StyleSheet, View, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/context/AuthContext';
import { useAppContext } from '@/context/AppContext';
import { Spacing } from '@/constants/theme';

export function UserProfileModal() {
  const theme = useTheme();
  const { user, isProfileModalVisible, setProfileModalVisible, logout } = useAuth();
  const { savedIds, comparedIds, city } = useAppContext();

  if (!user) return null;

  const green = theme.primaryGreen;
  const brown = theme.primaryBrown;
  const isDesigner = user.role === 'designer';

  return (
    <Modal
      visible={isProfileModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setProfileModalVisible(false)}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={() => setProfileModalVisible(false)} />

        <View style={[styles.sheet, { backgroundColor: theme.background, borderColor: theme.border }]}>
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <ThemedText type="smallBold" style={{ color: brown, letterSpacing: 1, fontSize: 10 }}>
              USER ACCOUNT PROFILE
            </ThemedText>
            <Pressable onPress={() => setProfileModalVisible(false)} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={theme.text} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {/* User Header Section */}
            <View style={styles.userCard}>
              <View style={styles.avatarWrapper}>
                {user.avatar ? (
                  <Image source={{ uri: user.avatar }} style={styles.avatar} contentFit="cover" />
                ) : (
                  <View style={[styles.avatarFallback, { backgroundColor: isDesigner ? theme.accentBrownLight : theme.accentGreenLight }]}>
                    <ThemedText type="subtitle" style={{ color: isDesigner ? brown : green }}>
                      {user.name.charAt(0)}
                    </ThemedText>
                  </View>
                )}
                <View style={[styles.roleBadge, { backgroundColor: isDesigner ? brown : green }]}>
                  <Ionicons name={isDesigner ? 'briefcase' : 'person'} size={10} color="#FFFFFF" />
                </View>
              </View>

              <ThemedText type="subtitle" style={[styles.userName, { color: theme.text }]}>
                {user.name}
              </ThemedText>

              <View style={[styles.membershipPill, { backgroundColor: isDesigner ? theme.accentBrownLight : theme.accentGreenLight }]}>
                <ThemedText style={{ color: isDesigner ? brown : green, fontSize: 11, fontWeight: '700' }}>
                  {isDesigner ? `STUDIO: ${user.firmName || 'Interior Designer'}` : 'HOMEOWNER MEMBER'}
                </ThemedText>
              </View>

              <ThemedText style={styles.userEmail} themeColor="textSecondary">
                {user.email} {user.phone ? `• ${user.phone}` : ''}
              </ThemedText>
            </View>

            {/* Quick Stats Grid */}
            <View style={[styles.statsRow, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
              <View style={styles.statItem}>
                <ThemedText type="subtitle" style={[styles.statNumber, { color: green }]}>
                  {savedIds.length}
                </ThemedText>
                <ThemedText style={styles.statLabel} themeColor="textSecondary">
                  Saved Studios
                </ThemedText>
              </View>

              <View style={[styles.statDivider, { backgroundColor: theme.border }]} />

              <View style={styles.statItem}>
                <ThemedText type="subtitle" style={[styles.statNumber, { color: brown }]}>
                  {comparedIds.length}
                </ThemedText>
                <ThemedText style={styles.statLabel} themeColor="textSecondary">
                  Compared
                </ThemedText>
              </View>

              <View style={[styles.statDivider, { backgroundColor: theme.border }]} />

              <View style={styles.statItem}>
                <ThemedText type="smallBold" style={[styles.statNumber, { color: theme.text, fontSize: 14 }]}>
                  {city}
                </ThemedText>
                <ThemedText style={styles.statLabel} themeColor="textSecondary">
                  Active City
                </ThemedText>
              </View>
            </View>

            {/* Profile Options List */}
            <View style={styles.optionsList}>
              <View style={[styles.optionItem, { borderColor: theme.border }]}>
                <View style={styles.optionLeft}>
                  <Ionicons name="calendar-outline" size={18} color={theme.textSecondary} />
                  <ThemedText style={styles.optionText}>Member Since</ThemedText>
                </View>
                <ThemedText type="smallBold" style={{ fontSize: 12, color: theme.text }}>
                  {user.memberSince}
                </ThemedText>
              </View>

              <View style={[styles.optionItem, { borderColor: theme.border }]}>
                <View style={styles.optionLeft}>
                  <Ionicons name="shield-checkmark-outline" size={18} color={theme.textSecondary} />
                  <ThemedText style={styles.optionText}>Account Status</ThemedText>
                </View>
                <View style={[styles.verifiedTag, { backgroundColor: '#E8F8F0' }]}>
                  <ThemedText style={{ color: '#27AE60', fontSize: 10, fontWeight: '700' }}>
                    VERIFIED
                  </ThemedText>
                </View>
              </View>

              <View style={[styles.optionItem, { borderColor: theme.border }]}>
                <View style={styles.optionLeft}>
                  <Ionicons name="location-outline" size={18} color={theme.textSecondary} />
                  <ThemedText style={styles.optionText}>Primary Location</ThemedText>
                </View>
                <ThemedText style={{ fontSize: 12, color: theme.textSecondary }}>
                  {city}, Gujarat
                </ThemedText>
              </View>
            </View>

            {/* Logout Button */}
            <Pressable
              onPress={logout}
              style={({ pressed }) => [
                styles.logoutBtn,
                { borderColor: '#FADBD8', backgroundColor: '#FDEDEC' },
                pressed && { opacity: 0.8 }
              ]}
            >
              <Ionicons name="log-out-outline" size={18} color="#C0392B" />
              <ThemedText type="smallBold" style={{ color: '#C0392B', fontSize: 14 }}>
                Sign Out
              </ThemedText>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    padding: Spacing.four,
  },
  userCard: {
    alignItems: 'center',
    marginBottom: Spacing.four,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  membershipPill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  userEmail: {
    fontSize: 12,
  },
  statsRow: {
    flexDirection: 'row',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    marginBottom: Spacing.four,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  statDivider: {
    width: 1,
    height: '60%',
    alignSelf: 'center',
  },
  optionsList: {
    gap: 8,
    marginBottom: Spacing.four,
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  optionText: {
    fontSize: 13,
  },
  verifiedTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 4,
  },
});
