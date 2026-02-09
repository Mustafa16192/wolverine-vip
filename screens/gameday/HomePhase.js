import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Home,
  ChevronRight,
  ArrowLeft,
  Navigation,
  Clock,
  Heart,
  Calendar,
  Star,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import AppBackground from '../../components/chrome/AppBackground';

/**
 * HomePhase - Journey Home
 *
 * Safe travels, thank you, next game preview.
 */

export default function HomePhase({ navigation }) {
  const { user, resetToAutoMode, schedule } = useApp();

  // Find next home game
  const today = new Date();
  const nextGame = schedule
    ?.filter(game => new Date(game.date) > today && game.isHome)
    .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

  const handleFinish = () => {
    resetToAutoMode();
    navigation.navigate('GameDayHome');
  };

  return (
    <View style={styles.container}>
      <AppBackground variant="gameDay" />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>JOURNEY HOME</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Thank You Card */}
          <View style={styles.thankYouCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,203,5,0.15)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.thankYouContent}>
              <Heart size={48} color={COLORS.maize} />
              <Text style={styles.thankYouTitle}>Thank You, {user.name}!</Text>
              <Text style={styles.thankYouSubtitle}>
                Your support makes Michigan great.{'\n'}
                Go Blue! 💛💙
              </Text>
            </View>
          </View>

          {/* Traffic Info */}
          <Text style={styles.sectionTitle}>GETTING HOME</Text>
          <View style={styles.trafficCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.trafficContent}>
              <View style={styles.trafficIcon}>
                <Navigation size={24} color={COLORS.maize} />
              </View>
              <View style={styles.trafficInfo}>
                <Text style={styles.trafficTitle}>Expected Traffic</Text>
                <Text style={styles.trafficStatus}>Heavy for 30 min</Text>
              </View>
              <View style={styles.trafficTime}>
                <Clock size={16} color={COLORS.textTertiary} />
                <Text style={styles.trafficTimeText}>~45 min</Text>
              </View>
            </View>
            <View style={styles.trafficTip}>
              <Text style={styles.trafficTipText}>
                Consider waiting 20-30 minutes for traffic to clear.
              </Text>
            </View>
          </View>

          {/* Game Day Recap */}
          <Text style={styles.sectionTitle}>TODAY'S JOURNEY</Text>
          <View style={styles.recapCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.recapContent}>
              <View style={styles.recapItem}>
                <Text style={styles.recapLabel}>Time at Stadium</Text>
                <Text style={styles.recapValue}>4h 32m</Text>
              </View>
              <View style={styles.recapDivider} />
              <View style={styles.recapItem}>
                <Text style={styles.recapLabel}>Steps Taken</Text>
                <Text style={styles.recapValue}>8,432</Text>
              </View>
              <View style={styles.recapDivider} />
              <View style={styles.recapItem}>
                <Text style={styles.recapLabel}>Memories Made</Text>
                <Text style={styles.recapValue}>∞</Text>
              </View>
            </View>
          </View>

          {/* Next Game Preview */}
          {nextGame && (
            <>
              <Text style={styles.sectionTitle}>NEXT HOME GAME</Text>
              <View style={styles.nextGameCard}>
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                <View style={styles.nextGameContent}>
                  <View style={styles.nextGameIcon}>
                    <Calendar size={24} color={COLORS.maize} />
                  </View>
                  <View style={styles.nextGameInfo}>
                    <Text style={styles.nextGameOpponent}>
                      vs {nextGame.opponent}
                    </Text>
                    <Text style={styles.nextGameDate}>
                      {new Date(nextGame.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                  <ChevronRight size={20} color={COLORS.textTertiary} />
                </View>
              </View>
            </>
          )}

          {/* Legacy Stats */}
          <Text style={styles.sectionTitle}>YOUR LEGACY</Text>
          <View style={styles.legacyCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,203,5,0.1)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.legacyContent}>
              <Star size={32} color={COLORS.maize} />
              <View style={styles.legacyStats}>
                <Text style={styles.legacyValue}>{user.yearsAsMember} Years</Text>
                <Text style={styles.legacyLabel}>as a Season Ticket Holder</Text>
              </View>
            </View>
            <View style={styles.legacyFooter}>
              <Text style={styles.legacyFooterText}>
                Member since {user.memberSince} • {user.stats.fanRank} Fan Rank
              </Text>
            </View>
          </View>

          {/* Finish Button */}
          <TouchableOpacity
            style={styles.finishButton}
            onPress={handleFinish}
            activeOpacity={0.9}
          >
            <Home size={20} color={COLORS.blue} />
            <Text style={styles.finishButtonText}>END GAME DAY</Text>
          </TouchableOpacity>

          <Text style={styles.footerText}>
            See you at the next game! Go Blue! 🏈
          </Text>

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
    alignItems: 'center',
    justifyContent: 'space-between',
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
  headerTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
  },
  scrollContent: {
    padding: SPACING.l,
    paddingBottom: 40,
  },

  // Section Title
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
    marginBottom: SPACING.m,
  },

  // Thank You Card
  thankYouCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.2)',
  },
  thankYouContent: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  thankYouTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontFamily: 'Montserrat_700Bold',
    marginTop: SPACING.m,
    textAlign: 'center',
  },
  thankYouSubtitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    textAlign: 'center',
    marginTop: SPACING.s,
    lineHeight: TYPOGRAPHY.fontSize.base * 1.5,
  },

  // Traffic Card
  trafficCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  trafficContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    gap: SPACING.m,
  },
  trafficIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,203,5,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trafficInfo: {
    flex: 1,
  },
  trafficTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_600SemiBold',
  },
  trafficStatus: {
    color: COLORS.rossOrange,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },
  trafficTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  trafficTimeText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
  },
  trafficTip: {
    padding: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  trafficTipText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  // Recap Card
  recapCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  recapContent: {
    flexDirection: 'row',
    padding: SPACING.m,
  },
  recapItem: {
    flex: 1,
    alignItems: 'center',
  },
  recapLabel: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 0.5,
    marginBottom: SPACING.xs,
  },
  recapValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: 'Montserrat_700Bold',
  },
  recapDivider: {
    width: 1,
    backgroundColor: COLORS.border,
  },

  // Next Game Card
  nextGameCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  nextGameContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    gap: SPACING.m,
  },
  nextGameIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,203,5,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextGameInfo: {
    flex: 1,
  },
  nextGameOpponent: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: 'Montserrat_700Bold',
  },
  nextGameDate: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },

  // Legacy Card
  legacyCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.2)',
  },
  legacyContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.l,
    gap: SPACING.m,
  },
  legacyStats: {},
  legacyValue: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontFamily: 'Montserrat_700Bold',
  },
  legacyLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },
  legacyFooter: {
    padding: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  legacyFooterText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  // Finish Button
  finishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.s,
    backgroundColor: COLORS.maize,
    paddingVertical: SPACING.m,
    borderRadius: RADIUS.lg,
    marginBottom: SPACING.m,
  },
  finishButtonText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },

  footerText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    textAlign: 'center',
  },
});
