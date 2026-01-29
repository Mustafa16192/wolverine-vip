import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  StatusBar,
} from 'react-native';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY, RADIUS } from '../constants/theme';
import { QrCode, MapPin, Utensils, ArrowLeft, Sparkles, Shield } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - SPACING.l * 2;
const CARD_HEIGHT = 420;

/**
 * TicketScreen - "Seat Command" Digital Season Pass
 *
 * Premium ticket experience with tap-to-flip reveal.
 * Inspired by luxury event passes and F1 pit credentials.
 */

export default function TicketScreen({ navigation }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  // Shimmer effect
  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    shimmer.start();
    return () => shimmer.stop();
  }, []);

  const handleFlip = () => {
    const toValue = isFlipped ? 0 : 1;
    Animated.spring(flipAnim, {
      toValue,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setIsFlipped(!isFlipped);
  };

  // Interpolations for card flip
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-CARD_WIDTH, CARD_WIDTH],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background */}
      <LinearGradient
        colors={['#001428', COLORS.blue, '#000B14']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <ArrowLeft color={COLORS.text} size={24} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Shield size={16} color={COLORS.maize} />
            <Text style={styles.headerTitle}>SEAT COMMAND</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* The Golden Ticket */}
          <TouchableOpacity
            onPress={handleFlip}
            activeOpacity={0.95}
            style={styles.cardTouchable}
          >
            <View style={styles.cardContainer}>
              {/* Front of Card */}
              <Animated.View
                style={[
                  styles.ticketCard,
                  styles.frontCard,
                  { opacity: frontInterpolate },
                ]}
              >
                <LinearGradient
                  colors={[COLORS.blue, '#001020', '#000810']}
                  locations={[0, 0.6, 1]}
                  style={StyleSheet.absoluteFill}
                />

                {/* Shimmer effect */}
                <Animated.View
                  style={[
                    styles.shimmer,
                    { transform: [{ translateX: shimmerTranslate }] },
                  ]}
                >
                  <LinearGradient
                    colors={['transparent', 'rgba(255,203,5,0.1)', 'transparent']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={StyleSheet.absoluteFill}
                  />
                </Animated.View>

                {/* Top accent */}
                <View style={styles.cardAccent} />

                {/* Card content */}
                <View style={styles.cardContent}>
                  {/* Header row */}
                  <View style={styles.cardHeader}>
                    <View>
                      <Text style={styles.seasonBadge}>2026 SEASON</Text>
                      <Text style={styles.passType}>VIP PASS</Text>
                    </View>
                    <Image
                      source={require('../assets/um-logo-blue.png')}
                      style={styles.cardLogo}
                    />
                  </View>

                  {/* Seat information */}
                  <View style={styles.seatGrid}>
                    <View style={styles.seatItem}>
                      <Text style={styles.seatLabel}>SECTION</Text>
                      <Text style={styles.seatValue}>24</Text>
                    </View>
                    <View style={styles.seatDivider} />
                    <View style={styles.seatItem}>
                      <Text style={styles.seatLabel}>ROW</Text>
                      <Text style={styles.seatValue}>10</Text>
                    </View>
                    <View style={styles.seatDivider} />
                    <View style={styles.seatItem}>
                      <Text style={styles.seatLabel}>SEAT</Text>
                      <Text style={styles.seatValue}>4</Text>
                    </View>
                  </View>

                  {/* Holder info */}
                  <View style={styles.holderSection}>
                    <View style={styles.holderRow}>
                      <View>
                        <Text style={styles.holderLabel}>TICKET HOLDER</Text>
                        <Text style={styles.holderName}>MUSTAFA</Text>
                      </View>
                      <View style={styles.verifiedBadge}>
                        <Sparkles size={12} color={COLORS.blue} />
                        <Text style={styles.verifiedText}>VERIFIED</Text>
                      </View>
                    </View>
                  </View>

                  {/* Bottom row */}
                  <View style={styles.cardFooter}>
                    <Text style={styles.footerText}>THE BIG HOUSE</Text>
                    <Text style={styles.footerText}>ANN ARBOR, MI</Text>
                  </View>
                </View>

                {/* Decorative corner accent */}
                <View style={styles.cornerAccent} />
              </Animated.View>

              {/* Back of Card (QR Code) */}
              <Animated.View
                style={[
                  styles.ticketCard,
                  styles.backCard,
                  { opacity: backInterpolate },
                ]}
              >
                <LinearGradient
                  colors={[COLORS.maize, '#E5B700', '#D4A800']}
                  style={StyleSheet.absoluteFill}
                />

                <View style={styles.qrSection}>
                  <Text style={styles.qrTitle}>SCAN FOR ENTRY</Text>
                  <View style={styles.qrContainer}>
                    <QrCode size={160} color={COLORS.blue} strokeWidth={1.5} />
                  </View>
                  <Text style={styles.qrSubtitle}>Present at gate for access</Text>
                </View>

                {/* Decorative footer */}
                <View style={styles.backFooter}>
                  <View style={styles.backFooterLine} />
                  <Text style={styles.backFooterText}>WOLVERINE VIP</Text>
                  <View style={styles.backFooterLine} />
                </View>
              </Animated.View>
            </View>
          </TouchableOpacity>

          {/* Hint text */}
          <View style={styles.hintContainer}>
            <Text style={styles.hintText}>Tap card to {isFlipped ? 'hide' : 'reveal'} QR code</Text>
          </View>

          {/* Concierge Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>CONCIERGE</Text>
          </View>

          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.actionIconContainer}>
                <Utensils size={24} color={COLORS.maize} />
              </View>
              <Text style={styles.actionTitle}>Order Food</Text>
              <Text style={styles.actionSubtitle}>Skip the line</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} activeOpacity={0.8}>
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.actionIconContainer}>
                <MapPin size={24} color={COLORS.maize} />
              </View>
              <Text style={styles.actionTitle}>Directions</Text>
              <Text style={styles.actionSubtitle}>To Section 24</Text>
            </TouchableOpacity>
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
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
  },
  scrollContent: {
    paddingHorizontal: SPACING.m,
    paddingBottom: 100,
    alignItems: 'center',
  },

  // Card
  cardTouchable: {
    marginTop: SPACING.m,
  },
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    ...SHADOWS.xl,
  },
  ticketCard: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
  },
  frontCard: {
    zIndex: 2,
  },
  backCard: {
    zIndex: 1,
  },
  cardAccent: {
    height: 4,
    backgroundColor: COLORS.maize,
  },
  cardContent: {
    flex: 1,
    padding: SPACING.l,
    justifyContent: 'space-between',
  },

  // Shimmer
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
  },

  // Card Header
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  seasonBadge: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
  },
  passType: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontFamily: 'Montserrat_700Bold',
    marginTop: SPACING.xxs,
  },
  cardLogo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },

  // Seat Grid
  seatGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,203,5,0.08)',
    borderRadius: RADIUS.lg,
    padding: SPACING.l,
    marginVertical: SPACING.m,
  },
  seatItem: {
    flex: 1,
    alignItems: 'center',
  },
  seatLabel: {
    color: COLORS.textTertiary,
    fontSize: 10,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  seatValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.display,
    fontFamily: 'AtkinsonHyperlegible_700Bold',
    lineHeight: TYPOGRAPHY.fontSize.display,
  },
  seatDivider: {
    width: 1,
    height: 50,
    backgroundColor: COLORS.border,
  },

  // Holder Section
  holderSection: {
    marginBottom: SPACING.m,
  },
  holderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  holderLabel: {
    color: COLORS.textTertiary,
    fontSize: 10,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 1,
    marginBottom: SPACING.xxs,
  },
  holderName: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.maize,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    gap: SPACING.xxs,
  },
  verifiedText: {
    color: COLORS.blue,
    fontSize: 10,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.5,
  },

  // Card Footer
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.m,
  },
  footerText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  // Corner Accent
  cornerAccent: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,203,5,0.05)',
    borderTopLeftRadius: 80,
  },

  // QR Section (Back)
  qrSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.l,
  },
  qrTitle: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
    marginBottom: SPACING.l,
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: SPACING.l,
    borderRadius: RADIUS.lg,
    ...SHADOWS.md,
  },
  qrSubtitle: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.m,
    opacity: 0.8,
  },

  // Back Footer
  backFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: SPACING.l,
    gap: SPACING.m,
  },
  backFooterLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,39,76,0.2)',
    maxWidth: 60,
  },
  backFooterText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
    opacity: 0.6,
  },

  // Hint
  hintContainer: {
    marginTop: SPACING.m,
    marginBottom: SPACING.xl,
  },
  hintText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  // Section Header
  sectionHeader: {
    width: '100%',
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },

  // Action Grid
  actionGrid: {
    flexDirection: 'row',
    gap: SPACING.m,
    width: '100%',
  },
  actionCard: {
    flex: 1,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    padding: SPACING.l,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 130,
    justifyContent: 'center',
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,203,5,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  actionTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_700Bold',
    marginTop: SPACING.xs,
  },
  actionSubtitle: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },
});
