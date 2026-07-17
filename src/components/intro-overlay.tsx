import React, { useState } from 'react';
import { StyleSheet, View, Pressable, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut, Layout, SlideInRight, SlideOutLeft } from 'react-native-reanimated';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';
import { Spacing } from '@/constants/theme';

interface IntroOverlayProps {
  visible: boolean;
  onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function IntroOverlay({ visible, onClose }: IntroOverlayProps) {
  const theme = useTheme();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClosing, setIsClosing] = useState(false);

  if (!visible) return null;

  const slides = [
    {
      title: 'Welcome to Dwellist',
      subtitle: 'CURATED ELITE INTERIORS',
      description: 'Explore the most prestigious interior designers and architects in your city, curated for luxury and functionality.',
      icon: 'sparkles-outline' as const,
      color: theme.primaryGreen,
      accent: theme.accentGreenLight,
    },
    {
      title: 'Compare Studios',
      subtitle: 'INFORMED DESIGN DECISIONS',
      description: 'Compare ratings, experience levels, design specialties, and Google reviews side-by-side to find your ideal match.',
      icon: 'git-compare-outline' as const,
      color: theme.primaryBrown,
      accent: theme.accentBrownLight,
    },
    {
      title: 'Partner with Experts',
      subtitle: 'BRING VISION TO LIFE',
      description: 'Bookmark your favorite design portfolios, read reviews from real clients, and start crafting your dream spaces.',
      icon: 'home-outline' as const,
      color: theme.primaryGreen,
      accent: theme.accentGreenLight,
    },
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleClose();
    }
  };

  const handleBack = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleClose = () => {
    setIsClosing(true);
    // Let the fadeout animation run, then call onClose
    setTimeout(() => {
      onClose();
    }, 400);
  };

  const slide = slides[currentSlide];

  return (
    <Animated.View 
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(400)}
      style={[
        styles.container, 
        { backgroundColor: theme.background },
        isClosing && styles.fadeOutOverlay
      ]}
    >
      {/* Top Header Branding */}
      <View style={styles.header}>
        <ThemedText style={[styles.brandTitle, { color: theme.primaryBrown }]}>
          Dwellist
        </ThemedText>
        <Pressable 
          onPress={handleClose} 
          style={styles.skipTextButton}
          hitSlop={12}
        >
          <ThemedText style={{ color: theme.textSecondary, fontSize: 14 }}>
            Skip
          </ThemedText>
        </Pressable>
      </View>

      {/* Slide Content with Layout Animations */}
      <Animated.View 
        key={currentSlide}
        entering={SlideInRight.duration(300)}
        exiting={SlideOutLeft.duration(300)}
        style={styles.contentContainer}
      >
        {/* Luxury Glowing Icon Badge */}
        <View style={styles.badgeContainer}>
          <View style={[styles.badgeGlow, { backgroundColor: slide.accent }]} />
          <View style={[styles.iconWrapper, { backgroundColor: theme.background, borderColor: slide.color }]}>
            <Ionicons name={slide.icon} size={48} color={slide.color} />
          </View>
        </View>

        {/* Text Details */}
        <View style={styles.textContainer}>
          <ThemedText style={[styles.subtitle, { color: theme.primaryBrown }]}>
            {slide.subtitle}
          </ThemedText>
          <ThemedText type="subtitle" style={[styles.title, { color: theme.primaryGreen }]}>
            {slide.title}
          </ThemedText>
          <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
            {slide.description}
          </ThemedText>
        </View>
      </Animated.View>

      {/* Footer Navigation */}
      <View style={styles.footer}>
        {/* Pagination Dots */}
        <View style={styles.dotsRow}>
          {slides.map((_, index) => {
            const isActive = index === currentSlide;
            return (
              <View
                key={index}
                style={[
                  styles.dot,
                  { backgroundColor: isActive ? theme.primaryBrown : theme.border },
                  isActive && styles.activeDot,
                ]}
              />
            );
          })}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.buttonsRow}>
          {currentSlide > 0 ? (
            <Pressable 
              onPress={handleBack}
              style={({ pressed }) => [
                styles.navButton,
                styles.backButton,
                { borderColor: theme.border },
                pressed && { backgroundColor: theme.backgroundElement }
              ]}
            >
              <ThemedText style={{ color: theme.text, fontWeight: '600' }}>
                Back
              </ThemedText>
            </Pressable>
          ) : (
            <View style={styles.navButtonPlaceholder} />
          )}

          <Pressable 
            onPress={handleNext}
            style={({ pressed }) => [
              styles.navButton,
              styles.primaryButton,
              { backgroundColor: theme.primaryGreen },
              pressed && styles.primaryButtonPressed
            ]}
          >
            <ThemedText style={styles.primaryButtonText}>
              {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            </ThemedText>
            <Ionicons 
              name={currentSlide === slides.length - 1 ? 'checkmark' : 'arrow-forward'} 
              size={16} 
              color="#FFFFFF" 
              style={{ marginLeft: 6 }} 
            />
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    flexDirection: 'column',
    justifyContent: 'space-between',
    paddingVertical: Platform.OS === 'ios' ? Spacing.five + 20 : Spacing.five,
    paddingHorizontal: Spacing.four,
  },
  fadeOutOverlay: {
    opacity: 0,
    transform: [{ translateY: -20 }],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    marginTop: Platform.OS === 'android' ? Spacing.two : 0,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  skipTextButton: {
    padding: Spacing.two,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 600,
    alignSelf: 'center',
    width: '100%',
    marginVertical: Spacing.three,
  },
  badgeContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.five,
    width: 140,
    height: 140,
  },
  badgeGlow: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    opacity: 0.35,
  },
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: Spacing.two,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: Spacing.two,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: Spacing.three,
    textAlign: 'center',
    lineHeight: 34,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 420,
  },
  footer: {
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    alignItems: 'center',
    gap: Spacing.four,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 20,
  },
  buttonsRow: {
    flexDirection: 'row',
    width: '100%',
    gap: Spacing.three,
    justifyContent: 'space-between',
  },
  navButton: {
    flexDirection: 'row',
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navButtonPlaceholder: {
    flex: 1,
  },
  backButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  primaryButton: {
    shadowColor: '#1E3F20',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonPressed: {
    opacity: 0.9,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
