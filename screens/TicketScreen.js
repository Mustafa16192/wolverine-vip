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
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY, RADIUS, CHROME } from '../constants/theme';
import {
  QrCode,
  Utensils,
  Sparkles,
  Shield,
  Car,
  Clock,
  Route,
  Users,
  ChevronRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useApp } from '../context/AppContext';
import AppBackground from '../components/chrome/AppBackground';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - SPACING.l * 2;
const CARD_HEIGHT = 420;

/**
 * TicketScreen - "Seat Command" Digital Season Pass
 *
 * Premium ticket experience with tap-to-flip reveal.
 * Inspired by luxury event passes and F1 pit credentials.
 */

export default function TicketScreen({ navigation }) {
  const { user, currentGame, nextGame, enterGameDay } = useApp();
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const featuredGame = currentGame || nextGame;

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

  const enterGameDayWithIntent = (intent) => {
    enterGameDay({ intent });
    navigation.navigate('Home', { screen: 'GameDayHome' });
  };

  const conciergeModules = [
    {
      id: 'arrival',
      icon: Car,
      title: 'Arrival Orchestration',
      subtitle: `${user.parking.lot} • Spot ${user.parking.spot}`,
      detail: 'Dedicated host at Gate 40 with fast-lane check-in.',
      cta: 'Launch Parking Guidance',
      action: () => navigation.navigate('Home', { screen: 'LiveOpsDetail', params: { opId: 'parking' } }),
    },
    {
      id: 'entry',
      icon: Shield,
      title: 'Entry & Security Lane',
      subtitle: 'Premium lane credentials synced',
      detail: 'Credential pre-check enabled. Queue model refreshes every minute.',
      cta: 'Open Gate Routing',
      action: () => navigation.navigate('Home', { screen: 'LiveOpsDetail', params: { opId: 'gate' } }),
    },
    {
      id: 'hospitality',
      icon: Utensils,
      title: 'In-Seat Hospitality',
      subtitle: 'Chef pickup + in-seat delivery windows',
      detail: 'Reserve halftime tray, beverage pairing, and suite-level service.',
      cta: 'Activate In-Seat Service',
      action: () => enterGameDayWithIntent('ingame'),
    },
    {
      id: 'postgame',
      icon: Users,
      title: 'Postgame Privileges',
      subtitle: 'Tunnel escort and field access queue',
      detail: 'Your premium postgame route is staged for controlled access.',
      cta: 'Open Postgame Plan',
      action: () => enterGameDayWithIntent('postgame'),
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <AppBackground />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: 44 }} />
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
                  colors={[COLORS.blue, 'rgba(0,39,76,0.95)', 'rgba(0,39,76,0.9)']}
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
                      source={require('../assets/um-logo-outlined.png')}
                      style={styles.cardLogo}
                    />
                  </View>

                  {/* Seat information */}
                  <View style={styles.seatGrid}>
                    <View style={styles.seatItem}>
                      <Text style={styles.seatLabel}>SECTION</Text>
                      <Text style={styles.seatValue}>{user.seat.section}</Text>
                    </View>
                    <View style={styles.seatDivider} />
                    <View style={styles.seatItem}>
                      <Text style={styles.seatLabel}>ROW</Text>
                      <Text style={styles.seatValue}>{user.seat.row}</Text>
                    </View>
                    <View style={styles.seatDivider} />
                    <View style={styles.seatItem}>
                      <Text style={styles.seatLabel}>SEAT</Text>
                      <Text style={styles.seatValue}>{user.seat.seat}</Text>
                    </View>
                  </View>

                  {/* Holder info */}
                  <View style={styles.holderSection}>
                    <View style={styles.holderRow}>
                      <View>
                        <Text style={styles.holderLabel}>TICKET HOLDER</Text>
                        <Text style={styles.holderName}>{user.name.toUpperCase()}</Text>
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
                  colors={[COLORS.maize, COLORS.maize, 'rgba(255,203,5,0.95)']}
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
            <Text style={styles.sectionTitle}>VIP CONCIERGE</Text>
          </View>

          <View style={styles.conciergeHero}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.conciergeHeroTop}>
              <View style={styles.conciergeChip}>
                <Sparkles size={12} color={COLORS.maize} />
                <Text style={styles.conciergeChipText}>Today&apos;s Host Plan</Text>
              </View>
              <Text style={styles.conciergeHeroTitle}>Premium Game Day Control</Text>
            </View>
            <Text style={styles.conciergeHeroMeta}>
              {featuredGame?.opponent ? `vs ${featuredGame.opponent}` : 'Next home matchup'} • {featuredGame?.time || '12:00 PM'}
            </Text>
            <Text style={styles.conciergeHeroHint}>
              Arrival, gate, hospitality, and postgame privileges are coordinated here.
            </Text>
          </View>

          <View style={styles.moduleStack}>
            {conciergeModules.map(module => {
              const Icon = module.icon;
              return (
                <TouchableOpacity
                  key={module.id}
                  style={styles.moduleCard}
                  activeOpacity={0.88}
                  onPress={module.action}
                >
                  <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                  <View style={styles.moduleHeader}>
                    <View style={styles.moduleIconWrap}>
                      <Icon size={16} color={COLORS.maize} />
                    </View>
                    <Text style={styles.moduleTitle}>{module.title}</Text>
                  </View>
                  <Text style={styles.moduleSubtitle}>{module.subtitle}</Text>
                  <Text style={styles.moduleDetail}>{module.detail}</Text>
                  <View style={styles.moduleFooter}>
                    <Text style={styles.moduleCta}>{module.cta}</Text>
                    <ChevronRight size={16} color={COLORS.maize} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.quickActionRow}>
            <TouchableOpacity
              style={styles.quickAction}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Home', { screen: 'LiveOpsDetail', params: { opId: 'walk' } })}
            >
              <Route size={14} color={COLORS.maize} />
              <Text style={styles.quickActionText}>Route to Section {user.seat.section}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quickAction}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('Home', { screen: 'LiveOpsDetail', params: { opId: 'weather' } })}
            >
              <Clock size={14} color={COLORS.maize} />
              <Text style={styles.quickActionText}>Kickoff Conditions</Text>
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
    width: 56,
    height: 56,
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

  conciergeHero: {
    width: '100%',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CHROME.surface.border,
    backgroundColor: CHROME.surface.base,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  conciergeHeroTop: {
    marginBottom: SPACING.xs,
  },
  conciergeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    alignSelf: 'flex-start',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    backgroundColor: 'rgba(255,203,5,0.12)',
    marginBottom: SPACING.xs,
  },
  conciergeChipText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.6,
  },
  conciergeHeroTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: 'Montserrat_700Bold',
  },
  conciergeHeroMeta: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_700Bold',
    marginBottom: SPACING.xs,
  },
  conciergeHeroHint: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 18,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  moduleStack: {
    width: '100%',
    gap: SPACING.s,
  },
  moduleCard: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    padding: SPACING.s,
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
    backgroundColor: CHROME.surface.base,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  moduleIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,203,5,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_700Bold',
  },
  moduleSubtitle: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_700Bold',
    marginBottom: SPACING.xxs,
  },
  moduleDetail: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 18,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  moduleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SPACING.s,
    paddingTop: SPACING.s,
  },
  moduleCta: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
  },
  quickActionRow: {
    width: '100%',
    gap: SPACING.s,
    marginTop: SPACING.s,
  },
  quickAction: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  quickActionText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
});
