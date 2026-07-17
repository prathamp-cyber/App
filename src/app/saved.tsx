import React, { useState } from 'react';
import { StyleSheet, View, ScrollView, Pressable, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing, BottomTabInset, MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MOCK_DESIGNERS, Designer } from '@/constants/mockData';
import { useAppContext } from '@/context/AppContext';
import { DesignerCard } from '@/components/designer-card';
import { DesignerDetailModal } from '@/components/designer-detail-modal';

export default function SavedScreen() {
  const theme = useTheme();
  const { savedIds } = useAppContext();
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
          <ThemedText type="subtitle" style={{ color: green }}>
            Saved Studios
          </ThemedText>
          <ThemedText style={styles.headerSubtitle} themeColor="textSecondary">
            Your curated list of favorite design studios
          </ThemedText>
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
    backgroundColor: '#FFFFFF',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  header: {
    paddingVertical: Spacing.two,
    marginBottom: Spacing.four,
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 2,
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
