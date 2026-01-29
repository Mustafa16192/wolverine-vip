import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY, RADIUS } from '../constants/theme';

/**
 * BentoCard - Premium Glassmorphic Card Component
 *
 * Reusable card component with:
 * - Glassmorphic blur effect
 * - Optional gradient accent
 * - Press interaction support
 * - Consistent styling with U-M brand
 */

export default function BentoCard({
  children,
  title,
  subtitle,
  style,
  onPress,
  accent = false,
  height,
  blurIntensity = 20,
  noPadding = false,
}) {
  const Container = onPress ? TouchableOpacity : View;
  const containerProps = onPress ? { onPress, activeOpacity: 0.8 } : {};

  return (
    <Container
      style={[
        styles.container,
        style,
        height && { height },
      ]}
      {...containerProps}
    >
      {/* Blur background */}
      <BlurView
        intensity={blurIntensity}
        tint="dark"
        style={StyleSheet.absoluteFill}
      />

      {/* Optional gradient accent */}
      {accent && (
        <LinearGradient
          colors={['rgba(255,203,5,0.12)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Content */}
      <View style={[styles.content, noPadding && styles.noPadding]}>
        {(title || subtitle) && (
          <View style={styles.header}>
            {title && <Text style={styles.title}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          </View>
        )}
        {children}
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    backgroundColor: COLORS.surfaceElevated,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.md,
  },
  content: {
    padding: SPACING.m,
    flex: 1,
  },
  noPadding: {
    padding: 0,
  },
  header: {
    marginBottom: SPACING.s,
  },
  title: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    textTransform: 'uppercase',
    letterSpacing: TYPOGRAPHY.letterSpacing.wider,
  },
  subtitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: 'Montserrat_700Bold',
    marginTop: SPACING.xxs,
  },
});
