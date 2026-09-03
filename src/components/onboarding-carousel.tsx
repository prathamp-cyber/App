import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  SafeAreaView,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/context/AuthContext';
import { Spacing } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  iconName: keyof typeof Ionicons.glyphMap;
  imageUrl: string;
}

const SLIDES: Slide[] = [
  {
    id: '1',
    badge: 'DISCOVER',
    title: 'Verified Interior Studios',
    subtitle: 'Browse top-rated interior designers and architects in Gandhidham & Ahmedabad.',
    iconName: 'compass',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '2',
    badge: 'COMPARE',
    title: 'Side-by-Side Comparison',
    subtitle: 'Evaluate firms by experience, project history, response times, and client ratings.',
    iconName: 'git-compare',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '3',
    badge: 'CONNECT',
    title: 'Direct Inquiries',
    subtitle: 'Send direct project inquiries and consult with lead architects without middleman fees.',
    iconName: 'paper-plane',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop',
  },
  {
    id: '4',
    badge: 'CURATE',
    title: 'Bookmark Favorites',
    subtitle: 'Save your dream studios, compare portfolios, and build your ideal home aesthetic.',
    iconName: 'heart',
    imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=800&auto=format&fit=crop',
  },
];

export function OnboardingCarousel() {
  const theme = useTheme();
  const { completeOnboarding } = useAuth();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const green = theme.primaryGreen;
  const brown = theme.primaryBrown;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / SCREEN_WIDTH);
    if (index !== activeIndex && index >= 0 && index < SLIDES.length) {
      setActiveIndex(index);
    }
  };

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      const nextIndex = activeIndex + 1;
      scrollRef.current?.scrollTo({ x: nextIndex * SCREEN_WIDTH, animated: true });
      setActiveIndex(nextIndex);
    } else {
      completeOnboarding();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header Bar with Skip Button */}
        <View style={styles.header}>
          <View style={[styles.brandBadge, { backgroundColor: theme.accentGreenLight }]}>
            <Ionicons name="sparkles" size={14} color={green} style={{ marginRight: 4 }} />
            <Text style={[styles.brandText, { color: green }]}>Dwellist</Text>
          </View>

          <Pressable
            onPress={completeOnboarding}
            style={({ pressed }) => [styles.skipButton, pressed && { opacity: 0.7 }]}
          >
            <Text style={[styles.skipText, { color: theme.textSecondary }]}>Skip</Text>
          </Pressable>
        </View>

        {/* Carousel Horizontal ScrollView */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.scrollContainer}
        >
          {SLIDES.map((slide) => (
            <View key={slide.id} style={styles.slideWidth}>
              {/* Image Preview Box */}
              <View style={[styles.imageCard, { borderColor: theme.border }]}>
                <Image source={{ uri: slide.imageUrl }} style={styles.slideImage} contentFit="cover" />
                <View style={styles.imageOverlay} />
                <View style={[styles.slideBadge, { backgroundColor: green }]}>
                  <Ionicons name={slide.iconName} size={12} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.slideBadgeText}>{slide.badge}</Text>
                </View>
              </View>

              {/* Text Info */}
              <View style={styles.textContainer}>
                <ThemedText type="subtitle" style={[styles.slideTitle, { color: theme.text }]}>
                  {slide.title}
                </ThemedText>
                <ThemedText style={styles.slideSubtitle} themeColor="textSecondary">
                  {slide.subtitle}
                </ThemedText>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Footer with Dots & Next Button */}
        <View style={styles.footer}>
          {/* Pagination Dots */}
          <View style={styles.dotsRow}>
            {SLIDES.map((_, index) => {
              const isActive = index === activeIndex;
              return (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    {
                      backgroundColor: isActive ? green : theme.border,
                      width: isActive ? 24 : 8,
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Action Button */}
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.nextBtn,
              { backgroundColor: green },
              pressed && { opacity: 0.9 },
            ]}
          >
            <Text style={styles.nextBtnText}>
              {activeIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
            </Text>
            <Ionicons
              name={activeIndex === SLIDES.length - 1 ? 'checkmark-circle' : 'arrow-forward'}
              size={18}
              color="#FFFFFF"
            />
          </Pressable>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
  },
  brandBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  brandText: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContainer: {
    flex: 1,
  },
  slideWidth: {
    width: SCREEN_WIDTH,
    paddingHorizontal: Spacing.four,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCard: {
    width: '100%',
    height: 300,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    position: 'relative',
    marginBottom: Spacing.four,
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  slideBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  slideBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.three,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  slideSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  footer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
    paddingTop: Spacing.two,
    gap: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    width: '100%',
  },
  nextBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
