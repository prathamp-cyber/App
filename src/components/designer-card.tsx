import React from 'react';
import { Pressable, StyleSheet, View, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/context/AppContext';
import { Designer } from '@/constants/mockData';

interface DesignerCardProps {
  designer: Designer;
  onPress: () => void;
}

export const DesignerCard: React.FC<DesignerCardProps> = ({ designer, onPress }) => {
  const theme = useTheme();
  const { isSaved, isCompared, toggleSave, toggleCompare } = useAppContext();

  const saved = isSaved(designer.id);
  const compared = isCompared(designer.id);

  // Use the premium brown and dark green colors defined in our theme
  const brown = theme.primaryBrown;
  const green = theme.primaryGreen;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.cardContainer, pressed && styles.cardPressed]}>
      {/* Cover Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: designer.coverImage }}
          style={styles.coverImage}
          contentFit="cover"
          transition={200}
        />
        {/* Rating Badge in Corner */}
        <View style={[styles.ratingBadge, { backgroundColor: 'rgba(255, 255, 255, 0.95)' }]}>
          <Ionicons
            name="star"
            size={12}
            color="#D4AF37" // Gold
          />
          <ThemedText style={[styles.ratingText, { color: '#1E2022' }]}>
            {designer.rating}
          </ThemedText>
        </View>

        {/* Save/Favorite button */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            toggleSave(designer.id);
          }}
          style={({ pressed }) => [
            styles.favoriteButton,
            { backgroundColor: 'rgba(255, 255, 255, 0.9)' },
            pressed && styles.iconPressed
          ]}
        >
          <Ionicons
            name={saved ? 'heart' : 'heart-outline'}
            size={18}
            color={saved ? '#C0392B' : '#5A6065'}
          />
        </Pressable>
      </View>

      {/* Designer Info */}
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <View style={styles.titleWrapper}>
            <ThemedText type="smallBold" style={[styles.firmName, { color: green }]}>
              {designer.firm}
            </ThemedText>
            <ThemedText style={styles.designerName} themeColor="textSecondary">
              Lead: {designer.name}
            </ThemedText>
          </View>

          {/* Compare Toggle Button */}
          <Pressable
            onPress={(e) => {
              e.stopPropagation();
              toggleCompare(designer.id);
            }}
            style={({ pressed }) => [
              styles.compareToggle,
              { borderColor: compared ? green : theme.border, backgroundColor: compared ? theme.accentGreenLight : '#FFFFFF' },
              pressed && styles.iconPressed
            ]}
          >
            <Ionicons
              name={compared ? 'checkbox' : 'square-outline'}
              size={14}
              color={compared ? green : theme.textSecondary}
            />
            <ThemedText style={[styles.compareText, { color: compared ? green : theme.textSecondary }]}>
              {compared ? "Comparing" : "Compare"}
            </ThemedText>
          </Pressable>
        </View>

        {/* Location & Experience tags */}
        <View style={styles.tagRow}>
          <View style={[styles.infoTag, { backgroundColor: theme.backgroundElement }]}>
            <Ionicons
              name="location"
              size={12}
              color={brown}
            />
            <ThemedText style={styles.tagText}>{designer.area}</ThemedText>
          </View>

          <View style={[styles.infoTag, { backgroundColor: theme.backgroundElement }]}>
            <Ionicons
              name="briefcase"
              size={11}
              color={brown}
            />
            <ThemedText style={styles.tagText}>{designer.experience} Years Exp</ThemedText>
          </View>
        </View>

        {/* Specialties pills */}
        <View style={styles.specialtiesRow}>
          {designer.specialties.slice(0, 3).map((spec, i) => (
            <View key={i} style={[styles.specialtyPill, { backgroundColor: theme.accentBrownLight }]}>
              <ThemedText style={[styles.specialtyText, { color: brown }]}>
                {spec}
              </ThemedText>
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: Spacing.three,
    borderWidth: 1,
    borderColor: '#E8E6E1', // Delicate warm border
    shadowColor: '#8D5B4C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardPressed: {
    transform: [{ scale: 0.99 }],
    opacity: 0.95,
  },
  imageContainer: {
    position: 'relative',
    height: 160,
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    left: 12,
    top: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
  },
  favoriteButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  iconPressed: {
    opacity: 0.8,
  },
  infoContainer: {
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleWrapper: {
    flex: 1,
    marginRight: 8,
  },
  firmName: {
    fontSize: 16,
    marginBottom: 2,
  },
  designerName: {
    fontSize: 12,
  },
  compareToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    gap: 4,
  },
  compareText: {
    fontSize: 11,
    fontWeight: '600',
  },
  tagRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    marginBottom: 10,
  },
  infoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  tagText: {
    fontSize: 11,
    color: '#5A6065',
    fontWeight: '500',
  },
  specialtiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  specialtyPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  specialtyText: {
    fontSize: 10,
    fontWeight: '700',
  },
});
