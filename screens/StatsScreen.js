import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Trophy,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Award,
  Flame,
  Shield,
} from 'lucide-react-native';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.l * 2 - SPACING.s) / 2;

/**
 * StatsScreen - Season Statistics & Data
 *
 * Displays team standings, performance metrics,
 * and fan engagement statistics.
 */

// Mock team standings data
const BIG_TEN_STANDINGS = [
  { rank: 1, team: 'Michigan', conf: '7-0', overall: '10-0', streak: 'W10' },
  { rank: 2, team: 'Ohio State', conf: '6-1', overall: '9-1', streak: 'W3' },
  { rank: 3, team: 'Penn State', conf: '5-2', overall: '8-2', streak: 'L1' },
  { rank: 4, team: 'Oregon', conf: '5-2', overall: '8-2', streak: 'W2' },
  { rank: 5, team: 'Iowa', conf: '4-3', overall: '7-3', streak: 'W1' },
];

// Mock team stats
const TEAM_STATS = {
  pointsPerGame: 38.4,
  pointsAllowed: 12.1,
  totalYards: 442.8,
  rushingYards: 218.6,
  passingYards: 224.2,
  turnovers: 8,
};

export default function StatsScreen() {
  const { user } = useApp();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.blue, COLORS.blue]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerLabel}>2026 SEASON</Text>
            <Text style={styles.headerTitle}>STATS & STANDINGS</Text>
          </View>

          {/* Team Record Hero */}
          <View style={styles.heroCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,203,5,0.15)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.heroContent}>
              <View style={styles.heroRecord}>
                <Text style={styles.heroWins}>10</Text>
                <Text style={styles.heroDivider}>-</Text>
                <Text style={styles.heroLosses}>0</Text>
              </View>
              <Text style={styles.heroLabel}>OVERALL RECORD</Text>
              <View style={styles.heroSubStats}>
                <View style={styles.heroSubStat}>
                  <Text style={styles.heroSubValue}>7-0</Text>
                  <Text style={styles.heroSubLabel}>CONF</Text>
                </View>
                <View style={styles.heroSubDivider} />
                <View style={styles.heroSubStat}>
                  <Text style={styles.heroSubValue}>#2</Text>
                  <Text style={styles.heroSubLabel}>CFP RANK</Text>
                </View>
                <View style={styles.heroSubDivider} />
                <View style={styles.heroSubStat}>
                  <View style={styles.streakBadge}>
                    <Flame size={12} color={COLORS.maize} />
                    <Text style={styles.heroSubValue}>W10</Text>
                  </View>
                  <Text style={styles.heroSubLabel}>STREAK</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Stats Grid */}
          <Text style={styles.sectionTitle}>TEAM PERFORMANCE</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon={<Target size={20} color={COLORS.maize} />}
              value={TEAM_STATS.pointsPerGame.toFixed(1)}
              label="PPG"
              trend="up"
            />
            <StatCard
              icon={<Shield size={20} color={COLORS.maize} />}
              value={TEAM_STATS.pointsAllowed.toFixed(1)}
              label="OPP PPG"
              trend="down"
              trendGood
            />
            <StatCard
              icon={<TrendingUp size={20} color={COLORS.maize} />}
              value={TEAM_STATS.totalYards.toFixed(0)}
              label="YDS/GAME"
              trend="up"
            />
            <StatCard
              icon={<Award size={20} color={COLORS.maize} />}
              value={TEAM_STATS.turnovers}
              label="TURNOVERS"
              trend="down"
              trendGood
            />
          </View>

          {/* Big Ten Standings */}
          <Text style={styles.sectionTitle}>BIG TEN STANDINGS</Text>
          <View style={styles.standingsCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.standingsHeader}>
              <Text style={[styles.standingsHeaderText, styles.rankCol]}>#</Text>
              <Text style={[styles.standingsHeaderText, styles.teamCol]}>TEAM</Text>
              <Text style={[styles.standingsHeaderText, styles.confCol]}>CONF</Text>
              <Text style={[styles.standingsHeaderText, styles.overallCol]}>ALL</Text>
            </View>
            {BIG_TEN_STANDINGS.map((team, index) => (
              <View
                key={team.team}
                style={[
                  styles.standingsRow,
                  team.team === 'Michigan' && styles.standingsRowHighlight,
                  index === BIG_TEN_STANDINGS.length - 1 && styles.standingsRowLast,
                ]}
              >
                <Text style={[styles.standingsText, styles.rankCol, styles.rankText]}>
                  {team.rank}
                </Text>
                <View style={[styles.teamCol, styles.teamNameContainer]}>
                  <Text
                    style={[
                      styles.standingsText,
                      styles.teamName,
                      team.team === 'Michigan' && styles.teamNameHighlight,
                    ]}
                  >
                    {team.team}
                  </Text>
                  {team.team === 'Michigan' && (
                    <View style={styles.youBadge}>
                      <Text style={styles.youBadgeText}>YOU</Text>
                    </View>
                  )}
                </View>
                <Text style={[styles.standingsText, styles.confCol]}>{team.conf}</Text>
                <Text style={[styles.standingsText, styles.overallCol]}>{team.overall}</Text>
              </View>
            ))}
          </View>

          {/* Your Fan Stats */}
          <Text style={styles.sectionTitle}>YOUR FAN STATS</Text>
          <View style={styles.fanStatsGrid}>
            <View style={styles.fanStatCard}>
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <Trophy size={28} color={COLORS.maize} />
              <Text style={styles.fanStatValue}>{user.stats.winsWitnessed}</Text>
              <Text style={styles.fanStatLabel}>WINS WITNESSED</Text>
            </View>
            <View style={styles.fanStatCard}>
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <Users size={28} color={COLORS.maize} />
              <Text style={styles.fanStatValue}>{user.stats.gamesAttended}</Text>
              <Text style={styles.fanStatLabel}>GAMES ATTENDED</Text>
            </View>
          </View>

          <View style={styles.fanRankCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,203,5,0.1)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.fanRankContent}>
              <View>
                <Text style={styles.fanRankLabel}>FAN RANK</Text>
                <Text style={styles.fanRankValue}>{user.stats.fanRank}</Text>
              </View>
              <View style={styles.fanRankBadge}>
                <Award size={32} color={COLORS.maize} />
              </View>
            </View>
            <Text style={styles.fanRankSubtext}>
              You're among the most dedicated Wolverines
            </Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/**
 * StatCard Component
 */
function StatCard({ icon, value, label, trend, trendGood }) {
  const TrendIcon = trend === 'up' ? TrendingUp : TrendingDown;
  const trendColor = trendGood
    ? COLORS.waveFieldGreen
    : trend === 'up'
    ? COLORS.waveFieldGreen
    : COLORS.tappanRed;

  return (
    <View style={styles.statCard}>
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.statCardHeader}>
        {icon}
        {trend && (
          <TrendIcon size={14} color={trendColor} />
        )}
      </View>
      <Text style={styles.statCardValue}>{value}</Text>
      <Text style={styles.statCardLabel}>{label}</Text>
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
    padding: SPACING.l,
    paddingBottom: 120,
  },

  // Header
  header: {
    marginBottom: SPACING.xl,
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
    letterSpacing: 1,
  },

  // Hero Card
  heroCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  heroContent: {
    padding: SPACING.l,
    alignItems: 'center',
  },
  heroRecord: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  heroWins: {
    color: COLORS.maize,
    fontSize: 64,
    fontFamily: 'Montserrat_700Bold',
  },
  heroDivider: {
    color: COLORS.textTertiary,
    fontSize: 48,
    fontFamily: 'Montserrat_700Bold',
    marginHorizontal: SPACING.s,
  },
  heroLosses: {
    color: COLORS.text,
    fontSize: 64,
    fontFamily: 'Montserrat_700Bold',
  },
  heroLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 1,
    marginTop: SPACING.xs,
  },
  heroSubStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.l,
    paddingTop: SPACING.l,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    width: '100%',
    justifyContent: 'center',
  },
  heroSubStat: {
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
  },
  heroSubValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: 'Montserrat_700Bold',
  },
  heroSubLabel: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
    marginTop: SPACING.xxs,
  },
  heroSubDivider: {
    width: 1,
    height: 32,
    backgroundColor: COLORS.border,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
  },

  // Section Title
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
    marginBottom: SPACING.m,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.s,
    marginBottom: SPACING.xl,
  },
  statCard: {
    width: CARD_WIDTH,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.s,
  },
  statCardValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontFamily: 'Montserrat_700Bold',
  },
  statCardLabel: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 0.5,
    marginTop: SPACING.xxs,
  },

  // Standings
  standingsCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.xl,
  },
  standingsHeader: {
    flexDirection: 'row',
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  standingsHeaderText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.5,
  },
  standingsRow: {
    flexDirection: 'row',
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    alignItems: 'center',
  },
  standingsRowLast: {
    borderBottomWidth: 0,
  },
  standingsRowHighlight: {
    backgroundColor: 'rgba(255,203,5,0.08)',
  },
  standingsText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  rankCol: {
    width: 32,
  },
  rankText: {
    fontFamily: 'Montserrat_700Bold',
    color: COLORS.textSecondary,
  },
  teamCol: {
    flex: 1,
  },
  teamNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  teamName: {
    fontFamily: 'Montserrat_600SemiBold',
  },
  teamNameHighlight: {
    color: COLORS.maize,
  },
  confCol: {
    width: 48,
    textAlign: 'center',
  },
  overallCol: {
    width: 48,
    textAlign: 'center',
  },
  youBadge: {
    backgroundColor: COLORS.maize,
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  youBadgeText: {
    color: COLORS.blue,
    fontSize: 8,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.5,
  },

  // Fan Stats
  fanStatsGrid: {
    flexDirection: 'row',
    gap: SPACING.s,
    marginBottom: SPACING.s,
  },
  fanStatCard: {
    flex: 1,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    padding: SPACING.l,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  fanStatValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontFamily: 'Montserrat_700Bold',
    marginTop: SPACING.m,
  },
  fanStatLabel: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 0.5,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },

  fanRankCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    padding: SPACING.l,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  fanRankContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fanRankLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 1,
  },
  fanRankValue: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontFamily: 'Montserrat_700Bold',
    marginTop: SPACING.xxs,
  },
  fanRankBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,203,5,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fanRankSubtext: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.m,
  },
});
