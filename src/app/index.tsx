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
import { useAuth } from '@/context/AuthContext';

export default function ExploreScreen() {
  const theme = useTheme();
  const { city, setCity, toggleThemeMode, resolvedTheme } = useAppContext();
  const { user, openAuthModal, openProfileModal } = useAuth();

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
        
        {/* Header Section with Brand Logo, Location Selection & Action Buttons */}
        <View style={styles.header}>
          {/* Left Side: Brand Identity & Location Selector */}
          <View style={styles.headerLeftCol}>
            {/* Dwellist Brand Badge */}
            <View style={[styles.logoBadge, { backgroundColor: theme.accentGreenLight }]}>
              <Ionicons name="sparkles" size={13} color={green} style={{ marginRight: 4 }} />
              <ThemedText type="smallBold" style={{ color: green, fontWeight: '800', fontSize: 13, letterSpacing: 0.3 }}>
                Dwellist
              </ThemedText>
            </View>

            {/* Location Selector */}
            <View style={styles.locationContainer}>
              <ThemedText style={styles.locationLabel} themeColor="textSecondary">
                LOCATION
              </ThemedText>
              
              <Pressable 
                onPress={() => setCityModalVisible(true)}
                style={({ pressed }) => [styles.locationRow, pressed && styles.pressedHeaderItem]}
              >
                <Ionicons
                  name="location"
                  size={13}
                  color={brown}
                />
                <ThemedText type="smallBold" style={[styles.cityText, { color: green }]}>
                  {city}, Gujarat
                </ThemedText>
                <Ionicons
                  name="chevron-down"
                  size={12}
                  color={green}
                  style={{ marginLeft: 1 }}
                />
              </Pressable>
            </View>
          </View>

          {/* Right Side Actions: Theme Toggle & Auth Profile Button */}
          <View style={styles.headerRightRow}>
            {/* Quick Theme Toggle Icon Button */}
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

        {/* Search Bar */}
        <View style={[styles.searchBarContainer, { borderColor: theme.border, backgroundColor: theme.inputBackground }]}>
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
                    Lead: {featuredDesigner.name} • {featuredDesigner.experience} Yrs Exp
                  </ThemedText>
                  
                  <View style={styles.featuredReviewsRow}>
                    <Ionicons
                      name="star"
                      size={12}
                      color="#D4AF37"
                    />
                    <Text style={styles.featuredReviewsText}>
                      {featuredDesigner.rating} ({featuredDesigner.googleReviewCount} Google reviews) • {featuredDesigner.area}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </View>
          )}

          {/* Area Filter Chips */}
          <View style={styles.filterSection}>
            <ThemedText type="smallBold" style={[styles.sectionTitle, { color: brown }]}>
              Filter by Neighborhood
            </ThemedText>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              {activeAreas.map((area) => {
                const isSelected = selectedArea === area;
                return (
                  <Pressable
                    key={area}
                    onPress={() => setSelectedArea(area)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: isSelected ? green : theme.backgroundElement,
                        borderColor: isSelected ? green : theme.border,
                      }
                    ]}
                  >
                    <ThemedText 
                      style={[
                        styles.filterChipText, 
                        { color: isSelected ? '#FFFFFF' : theme.textSecondary }
                      ]}
                    >
                      {area}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Designer Listings Grid */}
          <View style={styles.listingsSection}>
            <View style={styles.listingsHeader}>
              <ThemedText type="smallBold" style={[styles.sectionTitle, { color: brown }]}>
                {selectedArea === 'All Areas' ? 'All Verified Studios' : `${selectedArea} Studios`}
              </ThemedText>
              <ThemedText style={{ fontSize: 12 }} themeColor="textSecondary">
                {filteredDesigners.length} {filteredDesigners.length === 1 ? 'result' : 'results'}
              </ThemedText>
            </View>

            {filteredDesigners.length > 0 ? (
              filteredDesigners.map((designer) => (
                <DesignerCard
                  key={designer.id}
                  designer={designer}
                  onPress={() => handleCardPress(designer)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color={theme.textSecondary} />
                <ThemedText type="subtitle" style={{ fontSize: 18, marginTop: 12 }}>
                  No Studios Found
                </ThemedText>
                <ThemedText style={{ textAlign: 'center', marginTop: 4 }} themeColor="textSecondary">
                  Try adjusting your search query or area filter for {city}.
                </ThemedText>
              </View>
            )}
          </View>
        </ScrollView>

      </SafeAreaView>

      {/* Designer Detail Modal */}
      <DesignerDetailModal
        designer={selectedDesigner}
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedDesigner(null);
        }}
      />

      {/* City Selection Dropdown Modal */}
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
          <View style={[styles.cityDropdown, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <ThemedText type="smallBold" style={[styles.dropdownHeader, { color: theme.textSecondary }]}>
              Select City
            </ThemedText>
            
            {['Gandhidham', 'Ahmedabad'].map((cityName) => {
              const isSelected = city === cityName;
              return (
                <Pressable
                  key={cityName}
                  onPress={() => selectCity(cityName)}
                  style={[
                    styles.cityOption,
                    isSelected && { backgroundColor: theme.accentGreenLight }
                  ]}
                >
                  <ThemedText 
                    style={{ 
                      fontWeight: isSelected ? '700' : '500',
                      color: isSelected ? green : theme.text 
                    }}
                  >
                    {cityName}, Gujarat
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
  headerLeftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexShrink: 1,
  },
  logoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    height: 36,
  },
  locationContainer: {
    justifyContent: 'center',
  },
  locationLabel: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 1,
  },
  cityText: {
    fontSize: 14,
    fontWeight: '700',
  },
  pressedHeaderItem: {
    opacity: 0.7,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeIconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButton: {
    position: 'relative',
    padding: 2,
    borderRadius: 18,
    borderWidth: 1,
    height: 36,
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  userInitialsBg: {
    width: 30,
    height: 30,
    borderRadius: 15,
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
    bottom: -1,
    right: -1,
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
    gap: 5,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  signInText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
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
