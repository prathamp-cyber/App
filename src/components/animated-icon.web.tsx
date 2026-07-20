import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withDelay, 
  runOnJS, 
  Easing,
  Keyframe
} from 'react-native-reanimated';
import { Image } from 'expo-image';

import classes from './animated-icon.module.css';
const DURATION = 300;

export function AnimatedSplashOverlay() {
  const [visible, setVisible] = useState(true);

  // Animation values
  const logoScale = useSharedValue(0.4);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(15);
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    // 1. Fade in and scale up the center logo
    logoScale.value = withTiming(1.0, {
      duration: 800,
      easing: Easing.out(Easing.back(1.5)),
    });
    logoOpacity.value = withTiming(1.0, {
      duration: 600,
    });

    // 2. Fade in and slide up the brand text (delayed)
    textOpacity.value = withDelay(400, withTiming(1.0, {
      duration: 600,
    }));
    textTranslateY.value = withDelay(400, withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.quad),
    }));

    // 3. Fade out the entire intro screen
    screenOpacity.value = withDelay(2200, withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.quad),
    }, (finished) => {
      if (finished) {
        runOnJS(setVisible)(false);
      }
    }));
  }, []);

  // Animated styles
  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const screenStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.splashOverlay, screenStyle]}>
      <View style={styles.contentContainer}>
        {/* Animated Logo Container */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Image 
            source={require('@/assets/images/icon.png')} 
            style={styles.logoImage} 
            contentFit="contain"
          />
        </Animated.View>

        {/* Animated Brand text */}
        <Animated.View style={[styles.textContainer, textStyle]}>
          <Text style={styles.brandText}>Dwellist</Text>
          <Text style={styles.taglineText}>CURATED ELITE INTERIORS</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

// -------------------------------------------------------------
// Keep original animated icon system in case it's used elsewhere
// -------------------------------------------------------------

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: 0 }],
  },
  60: {
    transform: [{ scale: 1.2 }],
    easing: Easing.elastic(1.2),
  },
  100: {
    transform: [{ scale: 1 }],
    easing: Easing.elastic(1.2),
  },
});

const logoKeyframe = new Keyframe({
  0: {
    opacity: 0,
  },
  60: {
    transform: [{ scale: 1.2 }],
    opacity: 0,
    easing: Easing.elastic(1.2),
  },
  100: {
    transform: [{ scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(1.2),
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: '-180deg' }, { scale: 0.8 }],
    opacity: 0,
  },
  [DURATION / 1000]: {
    transform: [{ rotateZ: '0deg' }, { scale: 1 }],
    opacity: 1,
    easing: Easing.elastic(0.7),
  },
  100: {
    transform: [{ rotateZ: '7200deg' }],
  },
});

export function AnimatedIcon() {
  return (
    <View style={styles.iconContainer}>
      <Animated.View entering={glowKeyframe.duration(60 * 1000 * 4)} style={styles.glow}>
        <Image style={styles.glow} source={require('@/assets/images/logo-glow.png')} />
      </Animated.View>

      <Animated.View style={styles.background} entering={keyframe.duration(DURATION)}>
        <div className={classes.expoLogoBackground} />
      </Animated.View>

      <Animated.View style={styles.imageContainer} entering={logoKeyframe.duration(DURATION)}>
        <Image style={styles.image} source={require('@/assets/images/expo-logo.png')} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1E3F20', // Signature Dwellist Forest Green
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: 140,
    height: 140,
    borderRadius: 35,
    backgroundColor: '#FFFFFF', // Crisp card background
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    marginBottom: 24,
  },
  logoImage: {
    width: 90,
    height: 90,
  },
  textContainer: {
    alignItems: 'center',
  },
  brandText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 3,
    fontFamily: 'serif',
  },
  taglineText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#E8EFE9', // Accent green light wash color
    letterSpacing: 4,
    marginTop: 8,
  },
  container: {
    alignItems: 'center',
    width: '100%',
    zIndex: 1000,
    position: 'absolute',
    top: 128 / 2 + 138,
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    width: 201,
    height: 201,
    position: 'absolute',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 128,
    height: 128,
  },
  image: {
    position: 'absolute',
    width: 76,
    height: 71,
  },
  background: {
    width: 128,
    height: 128,
    position: 'absolute',
  },
});
