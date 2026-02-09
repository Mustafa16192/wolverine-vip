import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Trophy,
  ChevronRight,
  ArrowLeft,
  Share2,
  Camera,
  Star,
  TrendingUp,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import AppBackground from '../../components/chrome/AppBackground';

/**
 * PostgamePhase - Celebrate the Win
 *
 * Final score, highlights, share moments.
 */

const GAME_HIGHLIGHTS = [
  { quarter: '1st', play: 'Edwards 45-yd TD run', time: '8:23' },
  { quarter: '2nd', play: 'Johnson INT returned for TD', time: '4:12' },
  { quarter: '3rd', play: 'McCarthy 28-yd TD pass', time: '11:05' },
  { quarter: '4th', play: 'Game-sealing interception', time: '2:34' },
];

export default function PostgamePhase({ navigation }) {
  const { advancePhase, user } = useApp();
  const celebrationAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(celebrationAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleContinue = () => {
    advancePhase();
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
          <Text style={styles.headerTitle}>FINAL</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Victory Card */}
          <Animated.View
            style={[
              styles.victoryCard,
              {
                opacity: celebrationAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,203,5,0.25)', 'rgba(255,203,5,0.05)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.victoryContent}>
              <Trophy size={64} color={COLORS.maize} />
              <Text style={styles.victoryTitle}>VICTORY!</Text>

              <View style={styles.finalScore}>
                <View style={styles.scoreTeam}>
                  <Text style={styles.scoreTeamName}>MICHIGAN</Text>
                  <Text style={styles.scoreValue}>35</Text>
                </View>
                <View style={styles.scoreDivider}>
                  <Text style={styles.scoreDividerText}>FINAL</Text>
                </View>
                <View style={styles.scoreTeam}>
                  <Text style={styles.scoreTeamName}>OHIO STATE</Text>
                  <Text style={styles.scoreValueOpponent}>21</Text>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Your Stats */}
          <Text style={styles.sectionTitle}>YOUR GAME DAY</Text>
          <View style={styles.statsCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.statsContent}>
              <View style={styles.statItem}>
                <Star size={24} color={COLORS.maize} />
                <Text style={styles.statValue}>{user.stats.winsWitnessed + 1}</Text>
                <Text style={styles.statLabel}>WINS WITNESSED</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <TrendingUp size={24} color={COLORS.maize} />
                <Text style={styles.statValue}>{user.stats.gamesAttended + 1}</Text>
                <Text style={styles.statLabel}>GAMES ATTENDED</Text>
              </View>
            </View>
          </View>

          {/* Highlights */}
          <Text style={styles.sectionTitle}>KEY MOMENTS</Text>
          <View style={styles.highlightsCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            {GAME_HIGHLIGHTS.map((highlight, index) => (
              <View
                key={index}
                style={[
                  styles.highlightItem,
                  index === GAME_HIGHLIGHTS.length - 1 && styles.highlightItemLast,
                ]}
              >
                <View style={styles.highlightQuarter}>
                  <Text style={styles.highlightQuarterText}>{highlight.quarter}</Text>
                </View>
                <View style={styles.highlightInfo}>
                  <Text style={styles.highlightPlay}>{highlight.play}</Text>
                  <Text style={styles.highlightTime}>{highlight.time}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Share Section */}
          <Text style={styles.sectionTitle}>SHARE THE VICTORY</Text>
          <View style={styles.shareGrid}>
            <TouchableOpacity style={styles.shareCard}>
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <Camera size={28} color={COLORS.maize} />
              <Text style={styles.shareCardTitle}>Game Photos</Text>
              <Text style={styles.shareCardSubtitle}>View & download</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.shareCard}>
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <Share2 size={28} color={COLORS.maize} />
              <Text style={styles.shareCardTitle}>Share Victory</Text>
              <Text style={styles.shareCardSubtitle}>Post to social</Text>
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>HEAD HOME SAFE</Text>
            <ChevronRight size={20} color={COLORS.blue} />
          </TouchableOpacity>

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

  // Victory Card
  victoryCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 2,
    borderColor: COLORS.maize,
  },
  victoryContent: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  victoryTitle: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 4,
    marginTop: SPACING.m,
    marginBottom: SPACING.xl,
  },
  finalScore: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  scoreTeam: {
    flex: 1,
    alignItems: 'center',
  },
  scoreTeamName: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  scoreValue: {
    color: COLORS.maize,
    fontSize: 56,
    fontFamily: 'Montserrat_700Bold',
  },
  scoreValueOpponent: {
    color: COLORS.text,
    fontSize: 56,
    fontFamily: 'Montserrat_700Bold',
  },
  scoreDivider: {
    paddingHorizontal: SPACING.m,
  },
  scoreDividerText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 1,
  },

  // Stats Card
  statsCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statsContent: {
    flexDirection: 'row',
    padding: SPACING.l,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontFamily: 'Montserrat_700Bold',
    marginTop: SPACING.s,
  },
  statLabel: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 0.5,
    marginTop: SPACING.xs,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.m,
  },

  // Highlights Card
  highlightsCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: SPACING.m,
  },
  highlightItemLast: {
    borderBottomWidth: 0,
  },
  highlightQuarter: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,203,5,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightQuarterText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
  },
  highlightInfo: {
    flex: 1,
  },
  highlightPlay: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  highlightTime: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },

  // Share Grid
  shareGrid: {
    flexDirection: 'row',
    gap: SPACING.m,
    marginBottom: SPACING.xl,
  },
  shareCard: {
    flex: 1,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    padding: SPACING.l,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  shareCardTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_600SemiBold',
    marginTop: SPACING.m,
  },
  shareCardSubtitle: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },

  // Continue Button
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.s,
    backgroundColor: COLORS.maize,
    paddingVertical: SPACING.m,
    borderRadius: RADIUS.lg,
  },
  continueButtonText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
});
