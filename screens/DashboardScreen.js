import React, { useMemo, useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../constants/theme';
import {
  ChevronRight,
  Zap,
  Ticket,
  MapPin,
  Utensils,
  Share2,
  Calendar,
  Clock,
  Route,
  Trophy,
  Star,
  Cloud,
  Gauge,
  Users,
  Circle,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';

/**
 * DashboardScreen - Season HQ
 *
 * Home is framed around today's/next matchup, season progress,
 * and context-aware operational quick actions.
 */

const FALLBACK_GAME = {
  opponent: 'Ohio State',
  date: '2026-11-28',
  time: '12:00 PM',
  isHome: true,
};

const OPPONENT_STYLES = {
  'Ohio State': { abbr: 'OSU', color: '#BB0000' },
  Texas: { abbr: 'TEX', color: '#BF5700' },
  'Michigan State': { abbr: 'MSU', color: '#18453B' },
  USC: { abbr: 'USC', color: '#990000' },
  Maryland: { abbr: 'UMD', color: '#E03A3E' },
  'Penn State': { abbr: 'PSU', color: '#001E44' },
};

const INSIDER_ITEMS = [
  {
    id: 'wire-1',
    tag: 'INSIDER WIRE',
    title: 'Depth chart notes from this week\'s closed practice in Ann Arbor.',
    summary: 'Position battles and likely starters for the next matchup.',
    cta: 'Open Story',
    imageLabel: 'Practice Report',
    imageColors: ['#0A1A34', '#1B4A86'],
    target: 'News',
  },
  {
    id: 'wire-2',
    tag: 'VIP DROP',
    title: 'Limited maize sideline quarter-zip unlocks for members on Friday.',
    summary: 'Members get early purchase window before public release.',
    cta: 'View Drop',
    imageLabel: 'Member Release',
    imageColors: ['#0D2A20', '#1E7D55'],
    target: 'Shop',
  },
];

function parseGameDate(game) {
  if (!game?.date) return new Date('2026-11-28T12:00:00');

  const [year, month, day] = game.date.split('-').map(Number);
  let hours = 12;
  let minutes = 0;

  const timeMatch = (game.time || '').match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (timeMatch) {
    hours = Number(timeMatch[1]);
    minutes = Number(timeMatch[2]);
    const meridiem = timeMatch[3].toUpperCase();

    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
  }

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
}

function formatGameDate(dateObj) {
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function toOpponentBadge(opponent = 'Opponent') {
  const known = OPPONENT_STYLES[opponent];
  if (known) return known;

  const abbr = opponent
    .split(' ')
    .map(word => word[0])
    .join('')
    .slice(0, 3)
    .toUpperCase();

  return { abbr: abbr || 'OPP', color: '#25467A' };
}

export default function DashboardScreen({ navigation }) {
  const { user, schedule, currentGame, nextGame, isGameDay, toggleMode } = useApp();

  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, totalMs: 0 });
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const featuredGame = currentGame || nextGame || FALLBACK_GAME;
  const gameDate = useMemo(() => parseGameDate(featuredGame), [featuredGame]);
  const opponentBadge = useMemo(() => toOpponentBadge(featuredGame.opponent), [featuredGame]);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = Math.max(0, gameDate.getTime() - now.getTime());

      setCountdown({
        totalMs: diff,
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [gameDate]);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.35, duration: 950, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 950, useNativeDriver: true }),
      ])
    ).start();
  }, [pulseAnim]);

  const daysToGame = Math.max(0, Math.ceil(countdown.totalMs / (1000 * 60 * 60 * 24)));

  const seasonData = useMemo(() => {
    const seasonSchedule = schedule?.length ? schedule : [FALLBACK_GAME];
    const now = new Date();

    const entries = seasonSchedule.map(game => {
      const kickoff = parseGameDate(game);
      return {
        ...game,
        kickoff,
        completed: kickoff < now,
      };
    });

    const completed = entries.filter(entry => entry.completed).length;
    const total = entries.length;
    const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const upcoming = entries.find(entry => !entry.completed) || null;

    return {
      entries,
      completed,
      total,
      progressPercent,
      upcoming,
    };
  }, [schedule]);

  const liveOps = useMemo(() => {
    const gameWeek = daysToGame <= 7;
    const gameWindow = isGameDay || daysToGame <= 1;

    return [
      {
        id: 'parking',
        icon: MapPin,
        title: 'Parking',
        value: gameWindow ? 'Lot A Open' : user?.parking?.lot || 'Gold Lot A',
        detail: gameWindow ? `Spot ${user?.parking?.spot || 'G-142'} • active guidance` : gameWeek ? 'Permit loaded for game week' : 'Reservation confirmed',
      },
      {
        id: 'gate',
        icon: Clock,
        title: 'Entry Gates',
        value: gameWindow ? 'Gate 2 • 6 min' : 'Pre-check',
        detail: gameWindow ? 'South entrance currently fastest' : gameWeek ? 'Predictions unlock 24h before kickoff' : 'No lines outside game windows',
      },
      {
        id: 'weather',
        icon: Cloud,
        title: 'Weather',
        value: gameWindow ? '52°F • Clear' : gameWeek ? 'Low Risk' : 'Monitor',
        detail: gameWindow ? 'Bring a light jacket for evening wind' : gameWeek ? 'No severe weather expected' : 'Forecast appears during game week',
      },
      {
        id: 'walk',
        icon: Route,
        title: 'Seat Route',
        value: gameWindow ? '9 min walk' : 'Preview',
        detail: `Section ${user?.seat?.section || '24'} via East Gate`,
      },
    ];
  }, [daysToGame, isGameDay, user]);

  const matchupLabel = currentGame ? "TODAY'S MATCHUP" : 'NEXT MATCHUP';
  const countdownChipText =
    countdown.totalMs > 0
      ? `Kickoff in ${countdown.days}d ${countdown.hours}h ${countdown.mins}m`
      : 'Kickoff window is active';
  const modeCtaText = isGameDay ? 'RETURN TO SEASON VIEW' : 'ENTER GAME DAY PRIORITY';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={['#000813', COLORS.blue, '#001530']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.backdropGlowTop} />
      <View style={styles.backdropGlowBottom} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <View style={styles.liveIndicator}>
                <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
                <Text style={styles.liveText}>{isGameDay ? 'GAME DAY HQ' : 'SEASON HQ'}</Text>
              </View>
              <Text style={styles.username}>Welcome back, {user?.name || 'Member'}</Text>
            </View>
          </View>

          <View style={styles.heroCard}>
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,203,5,0.18)', 'rgba(255,203,5,0.03)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.heroTopRow}>
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>{matchupLabel}</Text>
              </View>
              <Text style={styles.heroOpponentText}>vs {featuredGame.opponent}</Text>
            </View>

            <View style={styles.matchupGraphic}>
              <LinearGradient
                colors={['rgba(0,39,76,0.6)', 'rgba(0,39,76,0.2)']}
                style={StyleSheet.absoluteFill}
              />

              <View style={styles.teamColumn}>
                <View style={styles.teamLogoWrap}>
                  <Image
                    source={require('../assets/um-logo-blue.png')}
                    style={styles.teamLogo}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.teamLabel}>MICHIGAN</Text>
              </View>

              <View style={styles.vsBadge}>
                <Text style={styles.vsText}>VS</Text>
              </View>

              <View style={styles.teamColumn}>
                <View style={[styles.opponentBadge, { backgroundColor: opponentBadge.color }]}>
                  <Text style={styles.opponentBadgeText}>{opponentBadge.abbr}</Text>
                </View>
                <Text style={styles.teamLabel}>{featuredGame.opponent.toUpperCase()}</Text>
              </View>
            </View>

            <View style={styles.heroMetaChips}>
              <View style={styles.metaChip}>
                <Calendar size={12} color={COLORS.maize} />
                <Text style={styles.metaChipText}>{formatGameDate(gameDate)}</Text>
              </View>
              <View style={styles.metaChip}>
                <Clock size={12} color={COLORS.maize} />
                <Text style={styles.metaChipText}>{featuredGame.time || '12:00 PM'}</Text>
              </View>
              <View style={styles.metaChip}>
                <MapPin size={12} color={COLORS.maize} />
                <Text style={styles.metaChipText}>{featuredGame.isHome ? 'Michigan Stadium' : 'Away Game'}</Text>
              </View>
            </View>

            <View style={styles.countdownChip}>
              <Clock size={14} color={COLORS.maize} />
              <Text style={styles.countdownChipText}>{countdownChipText}</Text>
            </View>

            <TouchableOpacity style={styles.primaryCta} onPress={toggleMode} activeOpacity={0.9}>
              <LinearGradient
                colors={[COLORS.maize, '#E7B600']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.primaryCtaContent}>
                <Zap size={18} color={COLORS.blue} />
                <Text style={styles.primaryCtaText}>{modeCtaText}</Text>
                <ChevronRight size={18} color={COLORS.blue} />
              </View>
            </TouchableOpacity>

            {isGameDay && (
              <TouchableOpacity
                style={styles.secondaryCta}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('GameDayHome')}
              >
                <Text style={styles.secondaryCtaText}>Open Full Game Day Journey</Text>
                <ChevronRight size={16} color={COLORS.maize} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.progressCard}>
            <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />

            <View style={styles.progressHeader}>
              <View>
                <Text style={styles.progressEyebrow}>SEASON PROGRESS</Text>
                <Text style={styles.progressFraction}>{seasonData.completed}/{seasonData.total}</Text>
                <Text style={styles.progressLabel}>Games completed</Text>
              </View>
              <View style={styles.progressMetaWrap}>
                <Text style={styles.progressPercent}>{seasonData.progressPercent}%</Text>
                <Text style={styles.progressMeta}>season complete</Text>
              </View>
            </View>

            <View style={styles.seasonTrackRow}>
              {seasonData.entries.map((entry, index) => {
                const isPlayed = index < seasonData.completed;
                const isNext = index === seasonData.completed && seasonData.completed < seasonData.total;
                return (
                  <View
                    key={`${entry.date}-${entry.opponent}`}
                    style={[
                      styles.seasonTick,
                      isPlayed && styles.seasonTickPlayed,
                      isNext && styles.seasonTickNext,
                    ]}
                  />
                );
              })}
            </View>

            <Text style={styles.progressHint}>
              {seasonData.upcoming
                ? `Up next: ${seasonData.upcoming.opponent} on ${formatGameDate(seasonData.upcoming.kickoff)}`
                : 'Regular season complete.'}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>{isGameDay ? 'LIVE OPS NOW' : 'LIVE OPS'}</Text>
          <View style={styles.opsGrid}>
            {liveOps.map(item => {
              const Icon = item.icon;
              return (
                <View key={item.id} style={styles.opsCard}>
                  <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
                  <View style={styles.opsTopRow}>
                    <View style={styles.opsIconWrap}>
                      <Icon size={16} color={COLORS.maize} />
                    </View>
                    <Circle
                      size={8}
                      color={item.id === 'weather' ? '#38A169' : COLORS.maize}
                      fill={item.id === 'weather' ? '#38A169' : COLORS.maize}
                    />
                  </View>
                  <Text style={styles.opsTitle}>{item.title}</Text>
                  <Text style={styles.opsValue}>{item.value}</Text>
                  <Text style={styles.opsDetail}>{item.detail}</Text>
                </View>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>CONCIERGE ACTIONS</Text>
          <View style={styles.actionRow}>
            <ActionPill icon={Ticket} label="Scan Ticket" onPress={() => navigation.navigate('Ticket')} />
            <ActionPill icon={Utensils} label="Order Food" onPress={() => navigation.navigate('Ticket')} />
            <ActionPill
              icon={Route}
              label={isGameDay ? 'Journey' : 'Route'}
              onPress={() => (isGameDay ? navigation.navigate('GameDayHome') : toggleMode())}
            />
            <ActionPill icon={Share2} label="Guest Pass" onPress={() => navigation.navigate('News')} />
          </View>

          <View style={styles.legacyCard}>
            <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,203,5,0.12)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.legacyHeader}>
              <View>
                <Text style={styles.legacyEyebrow}>LEGACY STATUS</Text>
                <Text style={styles.legacyTitle}>Renewal Momentum</Text>
              </View>
              <TouchableOpacity style={styles.legacyCta} onPress={() => navigation.navigate('Stats')}>
                <Text style={styles.legacyCtaText}>View Profile</Text>
                <ChevronRight size={14} color={COLORS.maize} />
              </TouchableOpacity>
            </View>

            <View style={styles.legacyStats}>
              <LegacyStat icon={Trophy} value={`${user?.stats?.winsWitnessed || 84}`} label="Wins Witnessed" />
              <LegacyStat icon={Star} value={`${user?.yearsAsMember || 12} yrs`} label="Member Tenure" />
              <LegacyStat icon={Gauge} value={user?.stats?.fanRank || 'Top 5%'} label="Fan Rank" />
              <LegacyStat icon={Users} value="Mar 15" label="Renewal Window" />
            </View>
          </View>

          <Text style={styles.sectionTitle}>INSIDER FEED</Text>
          <View style={styles.feedStack}>
            {INSIDER_ITEMS.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.feedCard}
                activeOpacity={0.88}
                onPress={() => navigation.navigate(item.target)}
              >
                <BlurView intensity={16} tint="dark" style={StyleSheet.absoluteFill} />

                <View style={styles.feedImageWrap}>
                  <LinearGradient colors={item.imageColors} style={StyleSheet.absoluteFill} />
                  <View style={styles.feedImageBadge}>
                    <Text style={styles.feedImageBadgeText}>{item.tag}</Text>
                  </View>
                  <Text style={styles.feedImageLabel}>{item.imageLabel}</Text>
                </View>

                <View style={styles.feedContent}>
                  <Text style={styles.feedTitle}>{item.title}</Text>
                  <Text style={styles.feedSummary}>{item.summary}</Text>
                  <View style={styles.feedFooter}>
                    <Text style={styles.feedCta}>{item.cta}</Text>
                    <ChevronRight size={16} color={COLORS.maize} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ActionPill({ icon: Icon, label, onPress }) {
  return (
    <TouchableOpacity style={styles.actionPill} activeOpacity={0.9} onPress={onPress}>
      <Icon size={16} color={COLORS.maize} />
      <Text style={styles.actionPillText}>{label}</Text>
    </TouchableOpacity>
  );
}

function LegacyStat({ icon: Icon, value, label }) {
  return (
    <View style={styles.legacyStatCard}>
      <Icon size={16} color={COLORS.maize} />
      <Text style={styles.legacyStatValue}>{value}</Text>
      <Text style={styles.legacyStatLabel}>{label}</Text>
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
  scrollContent: {
    paddingHorizontal: SPACING.m,
    paddingTop: SPACING.s,
    paddingBottom: 116,
  },
  backdropGlowTop: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(46, 91, 255, 0.18)',
    top: -90,
    right: -80,
  },
  backdropGlowBottom: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255, 203, 5, 0.08)',
    bottom: -80,
    left: -110,
  },

  header: {
    alignItems: 'flex-start',
    marginBottom: SPACING.m,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.maize,
    marginRight: 6,
  },
  liveText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1.2,
  },
  username: {
    color: COLORS.text,
    fontSize: 24,
    lineHeight: 30,
    fontFamily: 'Montserrat_700Bold',
  },

  heroCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: SPACING.l,
    marginBottom: SPACING.m,
    ...SHADOWS.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  heroTag: {
    backgroundColor: 'rgba(255,203,5,0.16)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  heroTagText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.8,
  },
  heroOpponentText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_700Bold',
  },
  matchupGraphic: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.s,
    marginBottom: SPACING.s,
    backgroundColor: 'rgba(0,0,0,0.26)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  teamColumn: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 4,
  },
  teamLogoWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    marginBottom: 8,
  },
  teamLogo: {
    width: 42,
    height: 42,
  },
  opponentBadge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.26)',
    marginBottom: 8,
  },
  opponentBadgeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  teamLabel: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.8,
    textAlign: 'center',
  },
  vsBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  vsText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  heroMetaChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.s,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,0,0,0.30)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaChipText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
  },
  countdownChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.38)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: SPACING.s,
  },
  countdownChipText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_700Bold',
  },
  primaryCta: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginTop: 4,
  },
  primaryCtaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingVertical: 14,
  },
  primaryCtaText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  secondaryCta: {
    marginTop: SPACING.s,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  secondaryCtaText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
  },

  progressCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.11)',
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.s,
  },
  progressEyebrow: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
    marginBottom: 2,
  },
  progressFraction: {
    color: '#FF6A00',
    fontSize: 52,
    lineHeight: 54,
    fontFamily: 'AtkinsonHyperlegible_700Bold',
  },
  progressLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  progressMetaWrap: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  progressPercent: {
    color: COLORS.text,
    fontSize: 24,
    lineHeight: 26,
    fontFamily: 'AtkinsonHyperlegible_700Bold',
  },
  progressMeta: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  seasonTrackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.s,
  },
  seasonTick: {
    flex: 1,
    height: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(255,255,255,0.16)',
  },
  seasonTickPlayed: {
    backgroundColor: '#FF6A00',
  },
  seasonTickNext: {
    borderWidth: 1,
    borderColor: COLORS.maize,
    backgroundColor: 'rgba(255,203,5,0.22)',
  },
  progressHint: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 18,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1.2,
    marginBottom: SPACING.s,
    marginTop: SPACING.xs,
  },

  opsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.s,
    marginBottom: SPACING.m,
  },
  opsCard: {
    width: '48.7%',
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: SPACING.s,
  },
  opsTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  opsIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,203,5,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  opsTitle: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: 4,
    letterSpacing: 0.6,
  },
  opsValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 2,
  },
  opsDetail: {
    color: COLORS.textSecondary,
    fontSize: 11,
    lineHeight: 15,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.s,
    marginBottom: SPACING.m,
  },
  actionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(0,0,0,0.36)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actionPillText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
  },

  legacyCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  legacyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  legacyEyebrow: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
    marginBottom: 2,
  },
  legacyTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: 'Montserrat_700Bold',
  },
  legacyCta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legacyCtaText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
  },
  legacyStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.s,
    marginTop: SPACING.xs,
  },
  legacyStatCard: {
    width: '48.7%',
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: SPACING.s,
  },
  legacyStatValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: 'Montserrat_700Bold',
    marginTop: 6,
    marginBottom: 2,
  },
  legacyStatLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  feedStack: {
    gap: SPACING.m,
  },
  feedCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    minHeight: 248,
  },
  feedImageWrap: {
    height: 128,
    padding: SPACING.s,
    justifyContent: 'space-between',
  },
  feedImageBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.32)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  feedImageBadgeText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.8,
  },
  feedImageLabel: {
    color: '#EAF3FF',
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: 'Montserrat_700Bold',
  },
  feedContent: {
    padding: SPACING.m,
  },
  feedTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.md,
    lineHeight: 22,
    fontFamily: 'AtkinsonHyperlegible_700Bold',
    marginBottom: 6,
  },
  feedSummary: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 18,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginBottom: 10,
  },
  feedFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  feedCta: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
  },
});
