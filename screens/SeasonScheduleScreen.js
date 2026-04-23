import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Calendar,
  ChevronRight,
  Clock,
  Home,
  MapPin,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, CHROME, SHADOWS } from '../constants/theme';
import AppBackground from '../components/chrome/AppBackground';
import { useApp } from '../context/AppContext';

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'home', label: 'Home' },
  { key: 'away', label: 'Away' },
  { key: 'upcoming', label: 'Upcoming' },
];

function parseGameDate(game) {
  if (!game?.date) return new Date();

  const [year, month, day] = game.date.split('-').map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

function formatMonth(date) {
  return date.toLocaleDateString('en-US', { month: 'long' });
}

function formatShortDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function formatMonthShort(date) {
  return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
}

function formatDay(date) {
  return date.toLocaleDateString('en-US', { day: 'numeric' });
}

function sameDate(a, b) {
  return a?.date === b?.date;
}

function getGameStatus(game, currentGame, nextHomeGame, now) {
  const kickoff = game.kickoff;

  if (currentGame && sameDate(game, currentGame)) {
    return { label: 'GAME DAY', tone: 'live' };
  }

  if (nextHomeGame && sameDate(game, nextHomeGame)) {
    return { label: 'NEXT HOME', tone: 'next' };
  }

  if (kickoff < now) {
    return { label: 'COMPLETED', tone: 'complete' };
  }

  return { label: game.isHome ? 'SCHEDULED' : 'AWAY', tone: game.isHome ? 'home' : 'away' };
}

function groupGamesByMonth(games) {
  const grouped = [];

  games.forEach((game) => {
    const monthKey = `${formatMonth(game.kickoff)} ${game.kickoff.getFullYear()}`;
    const existing = grouped.find(item => item.key === monthKey);

    if (existing) {
      existing.games.push(game);
      existing.homeCount += game.isHome ? 1 : 0;
      existing.awayCount += game.isHome ? 0 : 1;
      return;
    }

    grouped.push({
      key: monthKey,
      month: formatMonth(game.kickoff),
      games: [game],
      homeCount: game.isHome ? 1 : 0,
      awayCount: game.isHome ? 0 : 1,
    });
  });

  return grouped;
}

export default function SeasonScheduleScreen({ navigation }) {
  const { schedule, currentGame, enterGameDay } = useApp();
  const [filter, setFilter] = useState('all');

  const sortedGames = useMemo(() => {
    const source = schedule?.length ? schedule : [];
    return source
      .map(game => ({
        ...game,
        kickoff: parseGameDate(game),
      }))
      .sort((a, b) => a.kickoff.getTime() - b.kickoff.getTime());
  }, [schedule]);

  const summary = useMemo(() => {
    const total = sortedGames.length;
    const home = sortedGames.filter(game => game.isHome).length;
    const away = total - home;
    const now = new Date();
    const played = sortedGames.filter(game => game.kickoff < now).length;

    const nextHomeGame =
      sortedGames.find(game => game.isHome && game.kickoff >= now) ||
      sortedGames.find(game => game.isHome) ||
      null;

    return { total, home, away, played, nextHomeGame };
  }, [sortedGames]);

  const visibleGames = useMemo(() => {
    const now = new Date();

    return sortedGames.filter((game) => {
      if (filter === 'home') return game.isHome;
      if (filter === 'away') return !game.isHome;
      if (filter === 'upcoming') return game.kickoff >= now;
      return true;
    });
  }, [sortedGames, filter]);

  const monthSections = useMemo(() => groupGamesByMonth(visibleGames), [visibleGames]);
  const monthOverview = useMemo(() => groupGamesByMonth(sortedGames), [sortedGames]);
  const nextHomeGame = summary.nextHomeGame;

  const openNextGameDay = () => {
    if (!nextHomeGame) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    enterGameDay({ intent: 'journey' });
    navigation.navigate('GameDayHome');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppBackground variant="home" />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerLabel}>2026 SEASON</Text>
            <Text style={styles.headerTitle}>SEASON SCHEDULE</Text>
            <Text style={styles.headerSubtext}>
              A glanceable season calendar for planning before game day.
            </Text>
          </View>

          <View style={styles.heroCard}>
            <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,203,5,0.14)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.heroTopRow}>
              <View>
                <Text style={styles.heroEyebrow}>SEASON SNAPSHOT</Text>
                <Text style={styles.heroTitle}>12 games on the calendar</Text>
              </View>
              <View style={styles.heroCountBadge}>
                <Text style={styles.heroCountValue}>{summary.played}</Text>
                <Text style={styles.heroCountLabel}>played</Text>
              </View>
            </View>

            <View style={styles.heroStatsRow}>
              <SummaryStat value={`${summary.total}`} label="Games" />
              <SummaryStat value={`${summary.home}`} label="Home" />
              <SummaryStat value={`${summary.away}`} label="Away" />
            </View>

            <View style={styles.heroNextCard}>
              <View style={styles.heroNextHeader}>
                <Text style={styles.heroNextEyebrow}>NEXT HOME GAME</Text>
                <View style={styles.heroNextBadge}>
                  <Text style={styles.heroNextBadgeText}>PLANNING VIEW</Text>
                </View>
              </View>
              <Text style={styles.heroNextOpponent}>
                {nextHomeGame ? `vs ${nextHomeGame.opponent}` : 'No home game found'}
              </Text>
              <Text style={styles.heroNextMeta}>
                {nextHomeGame ? `${formatShortDate(nextHomeGame.kickoff)} · ${nextHomeGame.time}` : 'Season schedule only'}
              </Text>

              <TouchableOpacity
                style={[styles.heroCta, !nextHomeGame && styles.heroCtaDisabled]}
                activeOpacity={0.9}
                onPress={openNextGameDay}
                disabled={!nextHomeGame}
              >
                <Text style={styles.heroCtaText}>Open Game Day</Text>
                <ChevronRight size={16} color={COLORS.blue} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.monthOverviewScroll}
          >
            {monthOverview.map((section) => (
              <View key={section.key} style={styles.monthOverviewCard}>
                <BlurView intensity={16} tint="dark" style={StyleSheet.absoluteFill} />
                <Text style={styles.monthOverviewLabel}>{section.month}</Text>
                <Text style={styles.monthOverviewValue}>{section.games.length} games</Text>
                <Text style={styles.monthOverviewMeta}>
                  {section.homeCount} home · {section.awayCount} away
                </Text>
              </View>
            ))}
          </ScrollView>

          <View style={styles.filterRow}>
            {FILTERS.map((item) => (
              <FilterChip
                key={item.key}
                label={item.label}
                active={filter === item.key}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setFilter(item.key);
                }}
              />
            ))}
          </View>

          <View style={styles.sectionStack}>
            {monthSections.map((section) => (
              <View key={section.key} style={styles.monthCard}>
                <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
                <LinearGradient
                  colors={['rgba(255,203,5,0.10)', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={StyleSheet.absoluteFill}
                />

                <View style={styles.monthHeader}>
                  <View>
                    <Text style={styles.monthLabel}>{section.month}</Text>
                    <Text style={styles.monthMeta}>
                      {section.games.length} games · {section.homeCount} home · {section.awayCount} away
                    </Text>
                  </View>
                  <Calendar size={16} color={COLORS.maize} />
                </View>

                <View style={styles.monthList}>
                  {section.games.map((game, index) => {
                    const status = getGameStatus(game, currentGame, nextHomeGame, new Date());
                    const isFeatured = nextHomeGame && sameDate(game, nextHomeGame);
                    return (
                      <SeasonGameRow
                        key={game.date + game.opponent}
                        game={game}
                        status={status}
                        isFeatured={isFeatured}
                        isLast={index === section.games.length - 1}
                      />
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SummaryStat({ value, label }) {
  return (
    <View style={styles.summaryStat}>
      <Text style={styles.summaryStatValue}>{value}</Text>
      <Text style={styles.summaryStatLabel}>{label}</Text>
    </View>
  );
}

function FilterChip({ label, active, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.filterChip, active && styles.filterChipActive]}
      activeOpacity={0.88}
      onPress={onPress}
    >
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

function SeasonGameRow({ game, status, isFeatured, isLast }) {
  const isHome = game.isHome;
  const locationVerb = isHome ? 'vs' : 'at';
  return (
    <View style={[styles.gameRow, isFeatured && styles.gameRowFeatured, isLast && styles.gameRowLast]}>
      <View style={[styles.dateBadge, isFeatured && styles.dateBadgeFeatured]}>
        <Text style={styles.dateBadgeDay}>{formatDay(game.kickoff)}</Text>
        <Text style={styles.dateBadgeLabel}>{formatMonthShort(game.kickoff)}</Text>
      </View>

      <View style={styles.gameCopy}>
        <View style={styles.gameTitleRow}>
          <Text style={styles.gameTitle}>
            {locationVerb} {game.opponent}
          </Text>
          <View style={[styles.statusChip, status.tone === 'next' && styles.statusChipNext, status.tone === 'live' && styles.statusChipLive, status.tone === 'complete' && styles.statusChipComplete]}>
            <Text style={[styles.statusChipText, status.tone === 'next' && styles.statusChipTextNext, status.tone === 'live' && styles.statusChipTextLive]}>
              {status.label}
            </Text>
          </View>
        </View>

        <Text style={styles.gameMeta}>{formatShortDate(game.kickoff)} · {game.time}</Text>

        <View style={styles.gameFooter}>
          <View style={styles.locationPill}>
            {isHome ? <Home size={12} color={COLORS.maize} /> : <MapPin size={12} color={COLORS.maize} />}
            <Text style={styles.locationPillText}>{isHome ? 'Michigan Stadium' : 'Away game'}</Text>
          </View>

          <View style={styles.typePill}>
            <Text style={styles.typePillText}>{isHome ? 'Home' : 'Away'}</Text>
          </View>
        </View>
      </View>
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
    paddingBottom: 120,
  },

  header: {
    marginBottom: SPACING.m,
  },
  headerLabel: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.8,
  },
  headerSubtext: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 18,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xs,
  },

  heroCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CHROME.surface.border,
    backgroundColor: CHROME.surface.base,
    padding: SPACING.l,
    marginBottom: SPACING.m,
    ...SHADOWS.lg,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.m,
  },
  heroEyebrow: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  heroTitle: {
    color: COLORS.text,
    fontSize: 24,
    lineHeight: 30,
    fontFamily: 'Montserrat_700Bold',
    maxWidth: 220,
  },
  heroCountBadge: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 78,
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.m,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255,203,5,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.24)',
  },
  heroCountValue: {
    color: COLORS.maize,
    fontSize: 28,
    fontFamily: 'Montserrat_700Bold',
    lineHeight: 30,
  },
  heroCountLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 0.6,
    marginTop: 2,
  },
  heroStatsRow: {
    flexDirection: 'row',
    gap: SPACING.s,
    marginBottom: SPACING.m,
  },
  summaryStat: {
    flex: 1,
    borderRadius: RADIUS.lg,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.s,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
  },
  summaryStatValue: {
    color: COLORS.text,
    fontSize: 22,
    fontFamily: 'Montserrat_700Bold',
    lineHeight: 24,
  },
  summaryStatLabel: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  heroNextCard: {
    borderRadius: RADIUS.lg,
    padding: SPACING.m,
    backgroundColor: 'rgba(4, 15, 30, 0.42)',
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
  },
  heroNextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  heroNextEyebrow: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  heroNextBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,203,5,0.12)',
  },
  heroNextBadgeText: {
    color: COLORS.maize,
    fontSize: 8,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.6,
  },
  heroNextOpponent: {
    color: COLORS.text,
    fontSize: 22,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 2,
  },
  heroNextMeta: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  heroCta: {
    marginTop: SPACING.m,
    height: 46,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    backgroundColor: COLORS.maize,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  heroCtaDisabled: {
    opacity: 0.45,
  },
  heroCtaText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.4,
  },

  monthOverviewScroll: {
    gap: SPACING.s,
    paddingBottom: SPACING.xs,
    marginBottom: SPACING.m,
  },
  monthOverviewCard: {
    width: 110,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
    backgroundColor: CHROME.surface.base,
  },
  monthOverviewLabel: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  monthOverviewValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: 'Montserrat_700Bold',
  },
  monthOverviewMeta: {
    color: COLORS.textSecondary,
    fontSize: 10,
    lineHeight: 14,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: 4,
  },

  filterRow: {
    flexDirection: 'row',
    gap: SPACING.s,
    marginBottom: SPACING.m,
  },
  filterChip: {
    paddingHorizontal: SPACING.m,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  filterChipActive: {
    backgroundColor: COLORS.maize,
    borderColor: COLORS.maize,
  },
  filterChipText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
  },
  filterChipTextActive: {
    color: COLORS.blue,
    fontFamily: 'Montserrat_700Bold',
  },

  sectionStack: {
    gap: SPACING.m,
  },
  monthCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
    backgroundColor: CHROME.surface.elevated,
    padding: SPACING.m,
  },
  monthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.m,
  },
  monthLabel: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.4,
  },
  monthMeta: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 0.4,
    marginTop: 4,
  },
  monthList: {
    gap: SPACING.s,
  },
  gameRow: {
    flexDirection: 'row',
    gap: SPACING.m,
    padding: SPACING.m,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
  },
  gameRowFeatured: {
    borderColor: 'rgba(255,203,5,0.36)',
    backgroundColor: 'rgba(255,203,5,0.08)',
  },
  gameRowLast: {
    marginBottom: 0,
  },
  dateBadge: {
    width: 64,
    borderRadius: RADIUS.md,
    paddingVertical: SPACING.s,
    paddingHorizontal: SPACING.xs,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
    alignSelf: 'flex-start',
  },
  dateBadgeFeatured: {
    backgroundColor: 'rgba(255,203,5,0.14)',
    borderColor: 'rgba(255,203,5,0.28)',
  },
  dateBadgeDay: {
    color: COLORS.text,
    fontSize: 18,
    lineHeight: 20,
    fontFamily: 'Montserrat_700Bold',
  },
  dateBadgeLabel: {
    color: COLORS.textTertiary,
    fontSize: 10,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.8,
    marginTop: 2,
  },
  gameCopy: {
    flex: 1,
    minWidth: 0,
  },
  gameTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.s,
  },
  gameTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.md,
    lineHeight: 20,
    fontFamily: 'Montserrat_700Bold',
  },
  statusChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
  },
  statusChipNext: {
    backgroundColor: COLORS.maize,
    borderColor: COLORS.maize,
  },
  statusChipLive: {
    backgroundColor: 'rgba(56,161,105,0.16)',
    borderColor: 'rgba(56,161,105,0.28)',
  },
  statusChipComplete: {
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  statusChipText: {
    color: COLORS.textSecondary,
    fontSize: 8,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.6,
  },
  statusChipTextNext: {
    color: COLORS.blue,
  },
  statusChipTextLive: {
    color: '#B6F3C7',
  },
  gameMeta: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: 4,
  },
  gameFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.s,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
    maxWidth: '72%',
  },
  locationPillText: {
    color: COLORS.text,
    fontSize: 11,
    fontFamily: 'Montserrat_600SemiBold',
  },
  typePill: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,203,5,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.18)',
  },
  typePillText: {
    color: COLORS.maize,
    fontSize: 10,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.5,
  },
});
