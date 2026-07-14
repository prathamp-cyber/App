import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TextInput, Pressable, Platform, Text, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing, BottomTabInset, MaxContentWidth } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { MOCK_DESIGNERS, GANDHIDHAM_AREAS, AHMEDABAD_AREAS, Designer } from '@/constants/mockData';
import { DesignerCard } from '@/components/designer-card';
import { DesignerDetailModal } from '@/components/designer-detail-modal';
import { useAppContext } from '@/context/AppContext';

export default function ExploreScreen() {
  const theme = useTheme();
  const { city, setCity } = useAppContext();
  const [selectedArea, setSelectedArea] = useState('All Areas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDesigner, setSelectedDesigner] = useState<Designer | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [cityModalVisible, setCityModalVisible] = useState(false);

  const brown = theme.primaryBrown;
  const green = theme.primaryGreen;

  // Reset area filter when city changes
  useEffect(() => {
    setSelectedArea('All Areas');
    setSearchQuery('');
  }, [city]);

  // Select active areas list
  const activeAreas = city === 'Gandhidham' ? GANDHIDHAM_AREAS : AHMEDABAD_AREAS;

  // Filter designers based on search, selected city, and area
  const filteredDesigners = MOCK_DESIGNERS.filter((designer) => {
    const matchesCity = designer.city === city;

    const matchesArea = selectedArea === 'All Areas' || designer.area === selectedArea;
    const matchesSearch =
      designer.firm.toLowerCase().includes(searchQuery.toLowerCase()) ||
      designer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      designer.specialties.some((spec) => spec.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCity && matchesArea && matchesSearch;
  });

  // Featured Designer per city:
  // Gandhidham featured: Designer's Circle (id: "1")
  // Ahmedabad featured: The Grid Architects (id: "8")
  const featuredDesigner = MOCK_DESIGNERS.find(d => d.id === (city === 'Gandhidham' ? '1' : '8')) || filteredDesigners[0];

  const handleCardPress = (designer: Designer) => {
    setSelectedDesigner(designer);
    setModalVisible(true);
  };

  const selectCity = (selectedCity: string) => {
    setCity(selectedCity);
    setCityModalVisible(false);
  };

  const safeAreaStyle = Platform.select({
    ios: { paddingBottom: BottomTabInset },
    android: { paddingBottom: BottomTabInset },
    default: { paddingBottom: Spacing.four }
  });

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={[styles.safeArea, safeAreaStyle]}>
        
        {/* Header Section with City Selection Selector */}
        <View style={styles.header}>
          <View>
            <ThemedText style={styles.locationLabel} themeColor="textSecondary">
              CURRENT LOCATION
            </ThemedText>
            
            {/* Pressable City Trigger */}
            <Pressable 
              onPress={() => setCityModalVisible(true)}
              style={({ pressed }) => [styles.locationRow, pressed && styles.pressedHeaderItem]}
            >
              <Ionicons
                name="location"
                size={16}
                color={brown}
              />
              <ThemedText type="smallBold" style={[styles.cityText, { color: green }]}>
                {city}, Gujarat
              </ThemedText>
              <Ionicons
                name="chevron-down"
                size={14}
                color={green}
                style={{ marginLeft: 2 }}
              />
            </Pressable>
          </View>
          <View style={[styles.logoBadge, { backgroundColor: theme.accentGreenLight }]}>
            <ThemedText type="smallBold" style={{ color: green }}>G-Interior</ThemedText>
          </View>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchBarContainer, { borderColor: theme.border }]}>
          <Ionicons
            name="search"
            size={18}
            color={theme.textSecondary}
          />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder={`Search in ${city}...`}
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <Pressable onPress={() => setSearchQuery('')}>
              <Ionicons
                name="close-circle"
                size={16}
                color={theme.textSecondary}
              />
            </Pressable>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          {/* Top Choice Section */}
          {searchQuery === '' && selectedArea === 'All Areas' && featuredDesigner && (
            <View style={styles.featuredContainer}>
              <ThemedText type="smallBold" style={[styles.sectionTitle, { color: brown }]}>
                Editor's Top Choice in {city}
              </ThemedText>
              
              <Pressable 
                onPress={() => handleCardPress(featuredDesigner)}
                style={({ pressed }) => [
                  styles.featuredCard, 
                  { borderColor: theme.border },
                  pressed && styles.cardPressed
                ]}
              >
                <Image 
                  source={{ uri: featuredDesigner.coverImage }} 
                  style={styles.featuredImage}
                  contentFit="cover"
                />
                <View style={styles.gradientOverlay} />
                
                <View style={[styles.featuredTag, { backgroundColor: green }]}>
                  <ThemedText style={styles.featuredTagText}>TOP CHOICE</ThemedText>
                </View>

                <View style={styles.featuredTextContainer}>
                  <ThemedText type="subtitle" style={styles.featuredTitle}>
                    {featuredDesigner.firm}
                  </ThemedText>
                  <ThemedText style={styles.featuredSubtitle}>
                    {featuredDesigner.name} • {featuredDesigner.experience} Yrs Experience
                  </ThemedText>
                  
                  <View style={styles.featuredReviewsRow}>
                    <Ionicons
                      name="star"
                      size={12}
                      color="#D4AF37"
                    />
                    <Text style={styles.featuredReviewsText}>
                      {featuredDesigner.rating} ({featuredDesigner.googleReviewCount} Google reviews)
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          )}

          {/* Area Filter Scroll Row */}
          <View style={styles.filterSection}>
            <ThemedText type="smallBold" style={[styles.sectionTitle, { color: brown }]}>
              Explore by Areas / Wards
            </ThemedText>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {activeAreas.map((area) => {
                const isActive = selectedArea === area;
                return (
                  <Pressable
                    key={area}
                    onPress={() => setSelectedArea(area)}
                    style={[
                      styles.filterChip,
                      {
                        borderColor: isActive ? green : theme.border,
                        backgroundColor: isActive ? green : '#FFFFFF',
                      }
                    ]}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        { color: isActive ? '#FFFFFF' : theme.textSecondary }
                      ]}
                    >
                      {area}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Listings List */}
          <View style={styles.listingsSection}>
            <View style={styles.listingsHeader}>
              <ThemedText type="smallBold" style={[styles.sectionTitle, { color: brown }]}>
                Interior Designers in {city} ({filteredDesigners.length})
              </ThemedText>
            </View>

            {filteredDesigners.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons
                  name="information-circle-outline"
                  size={30}
                  color={theme.textSecondary}
                />
                <ThemedText style={{ marginTop: 8 }} themeColor="textSecondary">
                  No designers found matching your filters.
                </ThemedText>
              </View>
            ) : (
              filteredDesigners.map((designer) => (
                <DesignerCard
                  key={designer.id}
                  designer={designer}
                  onPress={() => handleCardPress(designer)}
                />
              ))
            )}
          </View>
        </ScrollView>

      </SafeAreaView>

      {/* Profile Detail Modal */}
      <DesignerDetailModal
        designer={selectedDesigner}
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedDesigner(null);
        }}
      />

      {/* City Switcher Modal */}
      <Modal
        visible={cityModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setCityModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setCityModalVisible(false)}
        >
          <View style={[styles.cityDropdown, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <ThemedText type="smallBold" style={[styles.dropdownHeader, { color: brown }]}>
              Select City
            </ThemedText>
            
            {['Gandhidham', 'Ahmedabad'].map((cityOption) => {
              const isSelected = city === cityOption;
              return (
                <Pressable
                  key={cityOption}
                  onPress={() => selectCity(cityOption)}
                  style={({ pressed }) => [
                    styles.cityOption,
                    { backgroundColor: isSelected ? theme.accentGreenLight : 'transparent' },
                    pressed && styles.pressedHeaderItem
                  ]}
                >
                  <ThemedText 
                    type={isSelected ? "smallBold" : "small"} 
                    style={{ color: isSelected ? green : theme.text }}
                  >
                    {cityOption}
                  </ThemedText>
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={16}
                      color={green}
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Modal>
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
    marginBottom: Spacing.two,
  },
  locationLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  cityText: {
    fontSize: 16,
    fontWeight: '700',
  },
  pressedHeaderItem: {
    opacity: 0.7,
  },
  logoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 10 : 6,
    gap: 8,
    marginBottom: Spacing.three,
    backgroundColor: '#FFFFFF',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    padding: 0,
  },
  featuredContainer: {
    marginBottom: Spacing.four,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  featuredCard: {
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.95,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  featuredTag: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  featuredTagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  featuredTextContainer: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
  },
  featuredTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  featuredSubtitle: {
    color: '#E8E8E8',
    fontSize: 11,
    fontWeight: '500',
  },
  featuredReviewsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  featuredReviewsText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  filterSection: {
    marginBottom: Spacing.four,
  },
  filterScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '700',
  },
  listingsSection: {
    marginBottom: 20,
  },
  listingsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.six,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityDropdown: {
    width: 250,
    borderRadius: 12,
    borderWidth: 1,
    padding: Spacing.three,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  dropdownHeader: {
    fontSize: 12,
    marginBottom: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  cityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
});
