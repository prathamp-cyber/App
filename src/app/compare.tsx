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
import { DesignerDetailModal } from '@/components/designer-detail-modal';

export default function CompareScreen() {
  const theme = useTheme();
  const { comparedIds, toggleCompare, clearCompare } = useAppContext();
  const [selectedDesigner, setSelectedDesigner] = useState<Designer | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const brown = theme.primaryBrown;
  const green = theme.primaryGreen;

  // Retrieve active designers in comparison list
  const comparedDesigners = MOCK_DESIGNERS.filter((d) => comparedIds.includes(d.id));

  const handleDesignerPress = (designer: Designer) => {
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
              Compare Studios
            </ThemedText>
            <ThemedText style={styles.headerSubtitle} themeColor="textSecondary">
              Side-by-side comparison of local designers
            </ThemedText>
          </View>
          {comparedDesigners.length > 0 && (
            <Pressable
              style={styles.clearAllButton}
              onPress={clearCompare}
            >
              <ThemedText style={[styles.clearAllText, { color: brown }]}>Clear All</ThemedText>
            </Pressable>
          )}
        </View>

        {comparedDesigners.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyState}>
            <View style={[styles.emptyIconBg, { backgroundColor: theme.accentBrownLight }]}>
              <Ionicons
                name="git-compare"
                size={36}
                color={brown}
              />
            </View>
            <ThemedText type="smallBold" style={{ textAlign: 'center', marginBottom: 6 }}>
              No designers selected
            </ThemedText>
            <ThemedText style={styles.emptyText} themeColor="textSecondary">
              Go to the Explore tab and check the "Compare" checkbox on 2 or 3 designer cards to see a side-by-side comparison here.
            </ThemedText>
          </View>
        ) : (
          /* Comparison Grid */
          <ScrollView horizontal showsHorizontalScrollIndicator={true} contentContainerStyle={styles.gridScroll}>
            <ScrollView showsVerticalScrollIndicator={false}>
              
              {/* Table Row: Header / Card Cards */}
              <View style={styles.tableRow}>
                {/* Fixed Label column placeholder */}
                <View style={styles.labelCol} />
                
                {/* Designer Columns */}
                {comparedDesigners.map((designer) => (
                  <View key={designer.id} style={styles.designerCol}>
                    <Pressable
                      onPress={() => handleDesignerPress(designer)}
                      style={[styles.miniCard, { borderColor: theme.border }]}
                    >
                      <Image source={{ uri: designer.avatar }} style={styles.avatar} />
                      <ThemedText type="smallBold" numberOfLines={1} style={[styles.firmTitle, { color: green }]}>
                        {designer.firm}
                      </ThemedText>
                      <ThemedText style={styles.leadDesigner} numberOfLines={1} themeColor="textSecondary">
                        {designer.name} ({designer.city})
                      </ThemedText>

                      {/* Rating details */}
                      <View style={styles.ratingRow}>
                        <Ionicons
                          name="star"
                          size={11}
                          color="#D4AF37"
                        />
                        <Text style={styles.ratingText}>{designer.rating}</Text>
                      </View>

                      {/* Remove button */}
                      <Pressable
                        onPress={(e) => {
                          e.stopPropagation();
                          toggleCompare(designer.id);
                        }}
                        style={styles.removeButton}
                      >
                        <Ionicons
                          name="close-circle"
                          size={16}
                          color={theme.textSecondary}
                        />
                      </Pressable>
                    </Pressable>
                  </View>
                ))}
              </View>

              {/* Table Row: Experience */}
              <View style={[styles.tableRow, { backgroundColor: theme.backgroundElement }]}>
                <View style={styles.labelCol}>
                  <ThemedText style={styles.rowLabelText}>Experience</ThemedText>
                </View>
                {comparedDesigners.map((d) => (
                  <View key={d.id} style={styles.designerCol}>
                    <ThemedText style={styles.rowValText}>{d.experience} Years</ThemedText>
                  </View>
                ))}
              </View>

              {/* Table Row: Completed Projects */}
              <View style={styles.tableRow}>
                <View style={styles.labelCol}>
                  <ThemedText style={styles.rowLabelText}>Projects Done</ThemedText>
                </View>
                {comparedDesigners.map((d) => (
                  <View key={d.id} style={styles.designerCol}>
                    <ThemedText style={styles.rowValText}>{d.completedProjects}+ completed</ThemedText>
                  </View>
                ))}
              </View>

              {/* Table Row: Location Area */}
              <View style={[styles.tableRow, { backgroundColor: theme.backgroundElement }]}>
                <View style={styles.labelCol}>
                  <ThemedText style={styles.rowLabelText}>Area/Sector</ThemedText>
                </View>
                {comparedDesigners.map((d) => (
                  <View key={d.id} style={styles.designerCol}>
                    <ThemedText style={styles.rowValText}>{d.area}</ThemedText>
                  </View>
                ))}
              </View>

              {/* Table Row: Response Time */}
              <View style={styles.tableRow}>
                <View style={styles.labelCol}>
                  <ThemedText style={styles.rowLabelText}>Response Speed</ThemedText>
                </View>
                {comparedDesigners.map((d) => (
                  <View key={d.id} style={styles.designerCol}>
                    <ThemedText style={styles.rowValText}>{d.responseTime}</ThemedText>
                  </View>
                ))}
              </View>

              {/* Table Row: Specialty Styles */}
              <View style={[styles.tableRow, { backgroundColor: theme.backgroundElement }]}>
                <View style={styles.labelCol}>
                  <ThemedText style={styles.rowLabelText}>Core Specialties</ThemedText>
                </View>
                {comparedDesigners.map((d) => (
                  <View key={d.id} style={[styles.designerCol, styles.specialtiesCol]}>
                    {d.specialties.slice(0, 3).map((spec, index) => (
                      <View key={index} style={[styles.specPill, { backgroundColor: theme.accentBrownLight }]}>
                        <Text style={[styles.specPillText, { color: brown }]}>{spec}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>

              {/* Survey Header */}
              <View style={styles.surveyHeaderRow}>
                <ThemedText style={[styles.surveyHeaderText, { color: brown }]}>SURVEY RATINGS (Out of 5.0)</ThemedText>
              </View>

              {/* Table Row: Communication */}
              <View style={styles.tableRow}>
                <View style={styles.labelCol}>
                  <ThemedText style={styles.rowLabelText}>Communication</ThemedText>
                </View>
                {comparedDesigners.map((d) => (
                  <View key={d.id} style={styles.designerCol}>
                    <ThemedText style={[styles.rowValText, { fontWeight: '700', color: green }]}>
                      {d.surveyMetrics.communication} ★
                    </ThemedText>
                  </View>
                ))}
              </View>

              {/* Table Row: Design Versatility */}
              <View style={[styles.tableRow, { backgroundColor: theme.backgroundElement }]}>
                <View style={styles.labelCol}>
                  <ThemedText style={styles.rowLabelText}>Versatility</ThemedText>
                </View>
                {comparedDesigners.map((d) => (
                  <View key={d.id} style={styles.designerCol}>
                    <ThemedText style={[styles.rowValText, { fontWeight: '700', color: green }]}>
                      {d.surveyMetrics.versatility} ★
                    </ThemedText>
                  </View>
                ))}
              </View>

              {/* Table Row: Timeliness */}
              <View style={styles.tableRow}>
                <View style={styles.labelCol}>
                  <ThemedText style={styles.rowLabelText}>Delivery Time</ThemedText>
                </View>
                {comparedDesigners.map((d) => (
                  <View key={d.id} style={styles.designerCol}>
                    <ThemedText style={[styles.rowValText, { fontWeight: '700', color: green }]}>
                      {d.surveyMetrics.timeliness} ★
                    </ThemedText>
                  </View>
                ))}
              </View>

              {/* Table Row: Professionalism */}
              <View style={[styles.tableRow, { backgroundColor: theme.backgroundElement }]}>
                <View style={styles.labelCol}>
                  <ThemedText style={styles.rowLabelText}>Professionalism</ThemedText>
                </View>
                {comparedDesigners.map((d) => (
                  <View key={d.id} style={styles.designerCol}>
                    <ThemedText style={[styles.rowValText, { fontWeight: '700', color: green }]}>
                      {d.surveyMetrics.professionalism} ★
                    </ThemedText>
                  </View>
                ))}
              </View>

              {/* Table Row: Quick Actions */}
              <View style={styles.tableRow}>
                <View style={styles.labelCol} />
                {comparedDesigners.map((d) => (
                  <View key={d.id} style={styles.designerCol}>
                    <Pressable
                      style={({ pressed }) => [
                        styles.actionBtn,
                        { backgroundColor: green },
                        pressed && styles.actionBtnPressed
                      ]}
                      onPress={() => handleDesignerPress(d)}
                    >
                      <Text style={styles.actionBtnText}>View Details</Text>
                    </Pressable>
                  </View>
                ))}
              </View>

            </ScrollView>
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
  clearAllButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  clearAllText: {
    fontSize: 13,
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
  gridScroll: {
    paddingBottom: 40,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  labelCol: {
    width: 110,
    paddingRight: 10,
    justifyContent: 'center',
  },
  designerCol: {
    width: 140,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginBottom: 6,
  },
  firmTitle: {
    fontSize: 12,
    marginBottom: 2,
    textAlign: 'center',
  },
  leadDesigner: {
    fontSize: 10,
    textAlign: 'center',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 10,
    fontWeight: '700',
  },
  removeButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    padding: 2,
  },
  rowLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#5A6065',
    textTransform: 'uppercase',
  },
  rowValText: {
    fontSize: 12,
    color: '#1E2022',
    textAlign: 'center',
  },
  specialtiesCol: {
    gap: 4,
  },
  specPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
  },
  specPillText: {
    fontSize: 9,
    fontWeight: '700',
  },
  surveyHeaderRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E6E1',
    marginTop: Spacing.two,
  },
  surveyHeaderText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  actionBtn: {
    width: '100%',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  actionBtnPressed: {
    opacity: 0.9,
  },
});
