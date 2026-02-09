import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
  Animated,
  Image,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Shield,
  Trophy,
  Star,
  TrendingUp,
  Calendar,
  Users,
  Crown,
  ChevronRight,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

/**
 * RenewalScreen - "Legacy" Hub
 *
 * Premium renewal experience emphasizing fan loyalty and status.
 * Designed to emotionally engage and drive renewal conversion.
 */

export default function RenewalScreen() {
  const glowAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Glow animation for CTA
  useEffect(() => {
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    glow.start();
    return () => glow.stop();
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background - using only official U-M Blue */}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.blue }]} />

      {/* Decorative background elements */}
      <View style={styles.bgDecoration}>
        <View style={styles.bgCircle1} />
        <View style={styles.bgCircle2} />
      </View>

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Crown size={20} color={COLORS.maize} />
            <Text style={styles.headerTitle}>YOUR LEGACY</Text>
          </View>

          {/* Legacy Badge */}
          <View style={styles.badgeContainer}>
            <LinearGradient
              colors={['rgba(255,203,5,0.15)', 'rgba(255,203,5,0.05)']}
              style={styles.badgeGlow}
            />
            <View style={styles.badgeInner}>
              <Shield size={64} color={COLORS.maize} strokeWidth={1.5} />
              <View style={styles.badgeYears}>
                <Text style={styles.yearsValue}>12</Text>
                <Text style={styles.yearsLabel}>YEARS</Text>
              </View>
            </View>
            <Text style={styles.badgeTitle}>WOLVERINE LEGACY</Text>
            <Text style={styles.badgeSubtitle}>Season Ticket Holder Since 2014</Text>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <Trophy size={24} color={COLORS.maize} />
              <Text style={styles.statValue}>84</Text>
              <Text style={styles.statLabel}>WINS WITNESSED</Text>
            </View>

            <View style={styles.statCard}>
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <Star size={24} color={COLORS.maize} />
              <Text style={styles.statValue}>Top 5%</Text>
              <Text style={styles.statLabel}>FAN RANK</Text>
            </View>

            <View style={styles.statCard}>
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <TrendingUp size={24} color={COLORS.maize} />
              <Text style={styles.statValue}>96</Text>
              <Text style={styles.statLabel}>GAMES ATTENDED</Text>
            </View>

            <View style={styles.statCard}>
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <Users size={24} color={COLORS.maize} />
              <Text style={styles.statValue}>3</Text>
              <Text style={styles.statLabel}>CHAMPIONSHIPS</Text>
            </View>
          </View>

          {/* Renewal Section */}
          <View style={styles.renewalSection}>
            <View style={styles.renewalHeader}>
              <Calendar size={18} color={COLORS.maize} />
              <Text style={styles.renewalTitle}>2027 SEASON</Text>
            </View>

            <Text style={styles.renewalMessage}>
              Secure your seat for another legendary season. Your place in the Big House awaits.
            </Text>

            {/* Benefits */}
            <View style={styles.benefitsContainer}>
              {[
                'Priority seat selection',
                'Exclusive VIP events',
                'Legacy member rewards',
              ].map((benefit, index) => (
                <View key={index} style={styles.benefitRow}>
                  <View style={styles.benefitDot} />
                  <Text style={styles.benefitText}>{benefit}</Text>
                </View>
              ))}
            </View>

            {/* CTA Button */}
            <TouchableOpacity
              activeOpacity={0.9}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              style={styles.ctaContainer}
            >
              <Animated.View
                style={[
                  styles.ctaGlow,
                  { opacity: glowOpacity },
                ]}
              />
              <Animated.View
                style={[
                  styles.ctaButton,
                  { transform: [{ scale: scaleAnim }] },
                ]}
              >
                <LinearGradient
                  colors={[COLORS.maize, COLORS.maize]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                />
                <View style={styles.ctaContent}>
                  <View>
                    <Text style={styles.ctaLabel}>RENEW NOW</Text>
                    <Text style={styles.ctaPrice}>$850 / season</Text>
                  </View>
                  <ChevronRight size={24} color={COLORS.blue} />
                </View>
              </Animated.View>
            </TouchableOpacity>

            <Text style={styles.deadline}>Renewal deadline: March 15, 2027</Text>
          </View>

          {/* Testimonial */}
          <View style={styles.testimonialCard}>
            <BlurView intensity={15} tint="dark" style={StyleSheet.absoluteFill} />
            <Text style={styles.testimonialQuote}>
              "Being a season ticket holder isn't just about the games—it's about being part of something bigger."
            </Text>
            <View style={styles.testimonialAuthor}>
              <View style={styles.testimonialAvatar}>
                <Text style={styles.testimonialInitial}>G</Text>
              </View>
              <View>
                <Text style={styles.testimonialName}>Gerald P.</Text>
                <Text style={styles.testimonialYears}>15-year member</Text>
              </View>
            </View>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blue,
  },
  bgDecoration: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  bgCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,203,5,0.03)',
  },
  bgCircle2: {
    position: 'absolute',
    bottom: 100,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: 'rgba(255,203,5,0.02)',
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.l,
    paddingBottom: 120,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.s,
    marginBottom: SPACING.xl,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
  },

  // Badge
  badgeContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  badgeGlow: {
    position: 'absolute',
    top: -20,
    left: '25%',
    right: '25%',
    height: 160,
    borderRadius: 80,
  },
  badgeInner: {
    alignItems: 'center',
    marginBottom: SPACING.m,
  },
  badgeYears: {
    position: 'absolute',
    top: 18,
    alignItems: 'center',
  },
  yearsValue: {
    color: COLORS.maize,
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
  },
  yearsLabel: {
    color: COLORS.maize,
    fontSize: 8,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 1,
  },
  badgeTitle: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },
  badgeSubtitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.s,
    marginBottom: SPACING.xl,
  },
  statCard: {
    width: (width - SPACING.l * 2 - SPACING.s) / 2,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    padding: SPACING.m,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 110,
    justifyContent: 'center',
  },
  statValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontFamily: 'Montserrat_700Bold',
    marginTop: SPACING.s,
  },
  statLabel: {
    color: COLORS.textTertiary,
    fontSize: 9,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 0.5,
    marginTop: SPACING.xxs,
    textAlign: 'center',
  },

  // Renewal Section
  renewalSection: {
    marginBottom: SPACING.xl,
  },
  renewalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
    marginBottom: SPACING.m,
  },
  renewalTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  renewalMessage: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    lineHeight: TYPOGRAPHY.fontSize.base * 1.5,
    marginBottom: SPACING.l,
  },

  // Benefits
  benefitsContainer: {
    marginBottom: SPACING.l,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.maize,
    marginRight: SPACING.m,
  },
  benefitText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  // CTA
  ctaContainer: {
    position: 'relative',
    marginBottom: SPACING.m,
  },
  ctaGlow: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    backgroundColor: COLORS.maize,
    borderRadius: RADIUS.xl + 4,
  },
  ctaButton: {
    height: 64,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    ...SHADOWS.lg,
  },
  ctaContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.l,
  },
  ctaLabel: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  ctaPrice: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    opacity: 0.8,
  },
  deadline: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    textAlign: 'center',
  },

  // Testimonial
  testimonialCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    padding: SPACING.l,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  testimonialQuote: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    fontStyle: 'italic',
    lineHeight: TYPOGRAPHY.fontSize.base * 1.6,
    marginBottom: SPACING.m,
  },
  testimonialAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
  },
  testimonialAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,203,5,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testimonialInitial: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: 'Montserrat_700Bold',
  },
  testimonialName: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_700Bold',
  },
  testimonialYears: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
});
