import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CHROME } from '../../constants/theme';

const VARIANTS = {
  default: {
    base: CHROME.background.gradient,
    top: CHROME.background.overlayTop,
    bottom: CHROME.background.overlayBottom,
  },
  home: {
    base: ['#01050D', '#032654', '#00162D'],
    top: ['rgba(47,101,167,0.24)', 'transparent'],
    bottom: ['transparent', 'rgba(0,0,0,0.45)'],
  },
  gameDay: {
    base: ['#05070F', '#0A1F43', '#001327'],
    top: ['rgba(255,203,5,0.10)', 'transparent'],
    bottom: ['transparent', 'rgba(0,0,0,0.5)'],
  },
};

export default function AppBackground({ variant = 'default' }) {
  const palette = VARIANTS[variant] || VARIANTS.default;

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient colors={palette.base} locations={[0, 0.52, 1]} style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={palette.top}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.45 }}
        style={styles.topSweep}
      />
      <LinearGradient
        colors={palette.bottom}
        start={{ x: 0, y: 0.1 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.vignette} />
    </View>
  );
}

const styles = StyleSheet.create({
  topSweep: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
});
