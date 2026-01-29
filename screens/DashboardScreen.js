import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../constants/theme';
import {
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Trophy,
  Zap,
  Star
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

/**
 * DashboardScreen - "Pit Wall" Command Center
 *
 * Premium Athletic Luxury design with U-M brand identity.
 * Dark theme optimized for OLED with glassmorphic cards.
 */

// Next game data (static for prototype)
const NEXT_GAME = {
  opponent: 'OHIO STATE',
  date: 'NOV 30, 2026',
  time: '12:00 PM',
  location: 'THE BIG HOUSE',
  targetDate: new Date('2026-11-30T12:00:00'),
};

export default function DashboardScreen({ navigation }) {
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0 });
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = NEXT_GAME.targetDate - now;

      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  // Pulse animation for live indicator
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Gradient Background */}
      <LinearGradient
        colors={['#001428', COLORS.blue, '#000B14']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle grid pattern overlay */}
      <View style={styles.gridOverlay} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.liveIndicator}>
                <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
                <Text style={styles.liveText}>VIP ACCESS</Text>
              </View>
              <Text style={styles.username}>Welcome, Mustafa</Text>
            </View>
            <TouchableOpacity style={styles.avatarContainer}>
              <LinearGradient
                colors={[COLORS.maize, '#E5B700']}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText}>M</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Hero Card - Next Game Countdown */}
          <View style={styles.heroCard}>
            <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,203,5,0.1)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            {/* Top accent line */}
            <View style={styles.heroAccent} />

            <View style={styles.heroContent}>
              <View style={styles.heroHeader}>
                <View style={styles.matchupBadge}>
                  <Text style={styles.matchupText}>NEXT MATCHUP</Text>
                </View>
                <View style={styles.dateChip}>
                  <Calendar size={12} color={COLORS.maize} />
                  <Text style={styles.dateChipText}>{NEXT_GAME.date}</Text>
                </View>
              </View>

              <View style={styles.vsContainer}>
                <View style={styles.teamBlock}>
                  <Image
                    source={require('../assets/um-logo-blue.png')}
                    style={styles.teamLogo}
                  />
                  <Text style={styles.teamName}>MICHIGAN</Text>
                </View>

                <View style={styles.vsBlock}>
                  <Text style={styles.vsText}>VS</Text>
                </View>

                <View style={styles.teamBlock}>
                  <View style={styles.opponentLogo}>
                    <Text style={styles.opponentInitial}>O</Text>
                  </View>
                  <Text style={styles.teamName}>{NEXT_GAME.opponent}</Text>
                </View>
              </View>

              {/* Countdown */}
              <View style={styles.countdownContainer}>
                <View style={styles.countdownBlock}>
                  <Text style={styles.countdownValue}>{countdown.days}</Text>
                  <Text style={styles.countdownLabel}>DAYS</Text>
                </View>
                <View style={styles.countdownDivider} />
                <View style={styles.countdownBlock}>
                  <Text style={styles.countdownValue}>{countdown.hours}</Text>
                  <Text style={styles.countdownLabel}>HRS</Text>
                </View>
                <View style={styles.countdownDivider} />
                <View style={styles.countdownBlock}>
                  <Text style={styles.countdownValue}>{countdown.mins}</Text>
                  <Text style={styles.countdownLabel}>MIN</Text>
                </View>
              </View>

              <View style={styles.heroFooter}>
                <View style={styles.locationRow}>
                  <MapPin size={14} color={COLORS.textSecondary} />
                  <Text style={styles.locationText}>{NEXT_GAME.location}</Text>
                </View>
                <View style={styles.timeRow}>
                  <Clock size={14} color={COLORS.textSecondary} />
                  <Text style={styles.locationText}>{NEXT_GAME.time}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Stats Row */}
          <View style={styles.statsRow}>
            <TouchableOpacity
              style={styles.statCard}
              onPress={() => navigation.navigate('Legacy')}
              activeOpacity={0.8}
            >
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <Trophy size={24} color={COLORS.maize} />
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>YEARS</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.statCard}
              onPress={() => navigation.navigate('Ticket')}
              activeOpacity={0.8}
            >
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <Ticket size={24} color={COLORS.maize} />
              <Text style={styles.statValue}>SEC 24</Text>
              <Text style={styles.statLabel}>YOUR SEAT</Text>
            </TouchableOpacity>

            <View style={styles.statCard}>
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <Star size={24} color={COLORS.maize} />
              <Text style={styles.statValue}>84</Text>
              <Text style={styles.statLabel}>WINS SEEN</Text>
            </View>
          </View>

          {/* Season Record Card */}
          <TouchableOpacity style={styles.recordCard} activeOpacity={0.9}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.recordContent}>
              <View>
                <Text style={styles.recordLabel}>2026 SEASON</Text>
                <View style={styles.recordRow}>
                  <Text style={styles.recordValue}>8-2</Text>
                  <View style={styles.recordBadge}>
                    <Zap size={12} color={COLORS.blue} />
                    <Text style={styles.recordBadgeText}>#4 CFP</Text>
                  </View>
                </View>
              </View>
              <ChevronRight size={24} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>

          {/* Insider Wire */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>INSIDER WIRE</Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>LIVE</Text>
            </View>
          </View>

          {/* News Items */}
          {[
            { headline: 'Harbaugh praises team chemistry ahead of rivalry week', time: '2h ago' },
            { headline: 'Stadium upgrades: New premium lounges opening', time: '5h ago' },
            { headline: 'Edwards breaks single-season rushing record', time: '1d ago' },
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.newsCard} activeOpacity={0.8}>
              <BlurView intensity={15} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.newsContent}>
                <Text style={styles.newsHeadline}>{item.headline}</Text>
                <Text style={styles.newsTime}>{item.time}</Text>
              </View>
              <ChevronRight size={20} color={COLORS.textTertiary} />
            </TouchableOpacity>
          ))}

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
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
    backgroundColor: 'transparent',
    // Subtle grid pattern would be added via image/svg in production
  },
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.m,
    paddingBottom: 120,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
    marginTop: SPACING.s,
  },
  headerLeft: {
    flex: 1,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.maize,
    marginRight: SPACING.xs,
  },
  liveText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
  },
  username: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontFamily: 'Montserrat_700Bold',
  },
  avatarContainer: {
    borderRadius: RADIUS.full,
    padding: 2,
    borderWidth: 2,
    borderColor: COLORS.maize,
  },
  avatarGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: 'Montserrat_700Bold',
  },

  // Hero Card
  heroCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.2)',
    ...SHADOWS.lg,
  },
  heroAccent: {
    height: 3,
    backgroundColor: COLORS.maize,
  },
  heroContent: {
    padding: SPACING.l,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.l,
  },
  matchupBadge: {
    backgroundColor: 'rgba(255,203,5,0.15)',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  matchupText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  dateChipText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
  },

  // VS Container
  vsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: SPACING.l,
  },
  teamBlock: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
    marginBottom: SPACING.s,
  },
  opponentLogo: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#BB0000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.s,
  },
  opponentInitial: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
  },
  teamName: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  vsBlock: {
    paddingHorizontal: SPACING.m,
  },
  vsText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: 'Montserrat_700Bold',
  },

  // Countdown
  countdownContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,39,76,0.5)',
    borderRadius: RADIUS.lg,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  countdownBlock: {
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
  },
  countdownValue: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.display,
    fontFamily: 'AtkinsonHyperlegible_700Bold',
    lineHeight: TYPOGRAPHY.fontSize.display,
  },
  countdownLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 1,
    marginTop: SPACING.xxs,
  },
  countdownDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.border,
  },

  heroFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  locationText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: SPACING.s,
    marginBottom: SPACING.m,
  },
  statCard: {
    flex: 1,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    padding: SPACING.m,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 100,
    justifyContent: 'center',
  },
  statValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: 'Montserrat_700Bold',
    marginTop: SPACING.s,
  },
  statLabel: {
    color: COLORS.textTertiary,
    fontSize: 9,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 1,
    marginTop: SPACING.xxs,
  },

  // Record Card
  recordCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.l,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recordContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.m,
  },
  recordLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
  },
  recordValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontFamily: 'Montserrat_700Bold',
  },
  recordBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.maize,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    gap: SPACING.xxs,
  },
  recordBadgeText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  sectionBadge: {
    backgroundColor: '#9A3324',
    paddingHorizontal: SPACING.s,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  sectionBadgeText: {
    color: COLORS.text,
    fontSize: 9,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },

  // News Cards
  newsCard: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginBottom: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  newsContent: {
    flex: 1,
    padding: SPACING.m,
  },
  newsHeadline: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    lineHeight: TYPOGRAPHY.fontSize.base * 1.4,
    marginBottom: SPACING.xs,
  },
  newsTime: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
});
