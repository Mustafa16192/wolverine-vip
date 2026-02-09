import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Cloud,
  Route,
  ChevronRight,
  Car,
  ShieldCheck,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../constants/theme';
import { useApp } from '../context/AppContext';
import AppBackground from '../components/chrome/AppBackground';

const PARKING_IMAGE_URI =
  'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=1600&q=80';

const DEFAULT_OP = 'parking';

function getStageTag(stage) {
  const stageMap = {
    season: 'SEASON PLANNING',
    morning: 'GAME WEEK PREP',
    tailgate: 'TAILGATE WINDOW',
    travel: 'TRAVEL WINDOW',
    parking: 'PARKING ACTIVE',
    pregame: 'ENTRY PRIORITY',
    ingame: 'IN-SEAT SUPPORT',
    postgame: 'POSTGAME EXIT',
    home: 'WRAP-UP',
  };
  return stageMap[stage] || stageMap.season;
}

function getOpConfig({ opId, stage, user, opponent, kickoff, isHome }) {
  const lot = user?.parking?.lot || 'Gold Lot A';
  const spot = user?.parking?.spot || 'G-142';
  const section = user?.seat?.section || '24';
  const row = user?.seat?.row || '10';
  const kickoffTime = kickoff || '12:00 PM';

  const commonMeta = {
    kickoff: `${isHome ? 'Michigan Stadium' : 'Away Site'} • ${kickoffTime}`,
    opponent: `vs ${opponent || 'Opponent'}`,
  };

  const base = {
    parking: {
      icon: MapPin,
      title: 'Parking Guidance',
      subtitle: `${lot} • Spot ${spot}`,
      summary: 'Turn-by-turn arrival guidance with lot host handoff and permit checks.',
      imageUri: PARKING_IMAGE_URI,
      imageLabel: 'Lot View',
      priority: stage === 'parking' ? 'Proceed to lot now.' : 'Arrival window is staged.',
      steps: [
        `Approach ${lot} through the premium lane entrance.`,
        `Present permit ID VIP-${spot.charAt(0)}-24 at checkpoint.`,
        `Park at ${spot} and confirm vehicle tag in app.`,
        'Follow Blue Route path to Gate 40 host desk.',
      ],
      metrics: [
        { label: 'ETA', value: stage === 'parking' ? '4 min' : '12 min' },
        { label: 'Lot Load', value: stage === 'parking' ? '62%' : '38%' },
        { label: 'Walking Time', value: '6 min' },
      ],
      primaryLabel: 'Start Parking Journey',
      primaryIntent: 'parking',
      secondaryLabel: 'Open Entry Pass',
      secondaryRoute: 'Ticket',
      ...commonMeta,
    },
    gate: {
      icon: Clock,
      title: 'Entry Gate Status',
      subtitle: 'Premium Gate Routing',
      summary: 'Live queue intelligence for fastest premium lane and host coordination.',
      imageUri: '',
      imageLabel: 'Gate Status',
      priority: stage === 'pregame' ? 'Use Gate 40 now.' : 'Predictive routing is active.',
      steps: [
        'Use Gate 40 premium corridor at south approach.',
        'Host Dana is assigned at the greeting desk.',
        'Scan VIP pass for expedited lane access.',
        `Proceed to Section ${section}, Row ${row} through East concourse.`,
      ],
      metrics: [
        { label: 'Current Wait', value: stage === 'pregame' ? '3 min' : '9 min' },
        { label: 'Lane Health', value: 'Fast' },
        { label: 'Desk Status', value: 'Staffed' },
      ],
      primaryLabel: 'Open Entry Flow',
      primaryIntent: 'entry',
      secondaryLabel: 'Open Ticket Pass',
      secondaryRoute: 'Ticket',
      ...commonMeta,
    },
    weather: {
      icon: Cloud,
      title: 'Weather Intelligence',
      subtitle: 'Kickoff Through Final Whistle',
      summary: 'Comfort-focused conditions and contingency updates for premium seating.',
      imageUri: '',
      imageLabel: 'Weather View',
      priority: 'No severe alerts. Light outer layer recommended.',
      steps: [
        `Kickoff forecast: 52°F and clear skies around ${kickoffTime}.`,
        'Wind remains moderate on east sideline sections.',
        'Concourses remain open for warm-up if temperature drops.',
        'No precipitation signal in current game window.',
      ],
      metrics: [
        { label: 'Temp', value: '52°F' },
        { label: 'Wind', value: '9 mph' },
        { label: 'Rain Risk', value: '6%' },
      ],
      primaryLabel: 'Open Game Day Overview',
      primaryIntent: 'journey',
      secondaryLabel: 'Read Matchup Brief',
      secondaryRoute: 'News',
      ...commonMeta,
    },
    walk: {
      icon: Route,
      title: 'Seat Route Guidance',
      subtitle: `Section ${section}, Row ${row}`,
      summary: 'Crowd-aware routing from parking to seat with accessibility checkpoints.',
      imageUri: '',
      imageLabel: 'Route Map',
      priority: stage === 'travel' ? 'Route is live now.' : 'Best path is ready.',
      steps: [
        `From ${lot}, follow Blue Route to Gate 40.`,
        'Use premium corridor to skip standard concourse queues.',
        `Turn at East concourse and continue to Section ${section}.`,
        'In-seat staff support unlocks once you arrive at your row.',
      ],
      metrics: [
        { label: 'Walk Time', value: stage === 'travel' ? '8 min' : '10 min' },
        { label: 'Crowd Level', value: 'Low' },
        { label: 'Accessibility', value: 'Clear' },
      ],
      primaryLabel: 'Open Travel Journey',
      primaryIntent: 'travel',
      secondaryLabel: 'Open Parking Detail',
      secondaryRoute: 'LiveOpsDetail',
      secondaryParams: { opId: 'parking' },
      ...commonMeta,
    },
  };

  return base[opId] || base[DEFAULT_OP];
}

export default function LiveOpsDetailScreen({ navigation, route }) {
  const { user, currentGame, nextGame, isGameDay, gameDayPhase, enterGameDay } = useApp();
  const [imageFailed, setImageFailed] = useState(false);

  const opId = route?.params?.opId || DEFAULT_OP;
  const stage = route?.params?.stage || (isGameDay ? gameDayPhase : 'season');
  const fallbackGame = currentGame || nextGame;
  const opponent = route?.params?.opponent || fallbackGame?.opponent || 'Opponent';
  const kickoff = route?.params?.kickoff || fallbackGame?.time || '12:00 PM';
  const isHome = typeof route?.params?.isHome === 'boolean'
    ? route.params.isHome
    : (fallbackGame?.isHome ?? true);

  const config = useMemo(
    () => getOpConfig({ opId, stage, user, opponent, kickoff, isHome }),
    [opId, stage, user, opponent, kickoff, isHome]
  );

  const Icon = config.icon;

  const handlePrimary = () => {
    enterGameDay({ intent: config.primaryIntent || 'journey' });
    navigation.navigate('GameDayHome');
  };

  const handleSecondary = () => {
    if (config.secondaryRoute === 'LiveOpsDetail') {
      navigation.push('LiveOpsDetail', config.secondaryParams || { opId: 'parking' });
      return;
    }
    navigation.navigate(config.secondaryRoute || 'Ticket', config.secondaryParams || {});
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppBackground />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <ArrowLeft size={18} color={COLORS.text} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <View style={styles.stageTag}>
              <Text style={styles.stageTagText}>{getStageTag(stage)}</Text>
            </View>
            <Text style={styles.headerTitle}>{config.title}</Text>
          </View>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.heroCard}>
            <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />

            <View style={styles.heroTopRow}>
              <View style={styles.iconWrap}>
                <Icon size={16} color={COLORS.maize} />
              </View>
              <Text style={styles.heroLabel}>{config.imageLabel}</Text>
            </View>

            <View style={styles.imageFrame}>
              {config.imageUri && !imageFailed ? (
                <Image
                  source={{ uri: config.imageUri }}
                  style={styles.heroImage}
                  resizeMode="cover"
                  onError={() => setImageFailed(true)}
                />
              ) : (
                <LinearGradient
                  colors={['rgba(47,101,167,0.8)', 'rgba(0,39,76,0.7)', 'rgba(0,39,76,0.95)']}
                  style={StyleSheet.absoluteFill}
                />
              )}
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.55)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.imageOverlayBadge}>
                <Car size={12} color={COLORS.maize} />
                <Text style={styles.imageOverlayText}>{config.subtitle}</Text>
              </View>
            </View>

            <Text style={styles.heroSummary}>{config.summary}</Text>
            <Text style={styles.heroPriority}>{config.priority}</Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{config.opponent}</Text>
              <Text style={styles.metaText}>{config.kickoff}</Text>
            </View>
          </View>

          <View style={styles.metricsRow}>
            {config.metrics.map(metric => (
              <View key={metric.label} style={styles.metricCard}>
                <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
                <Text style={styles.metricValue}>{metric.value}</Text>
                <Text style={styles.metricLabel}>{metric.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.stepsCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.stepsHeader}>
              <ShieldCheck size={14} color={COLORS.maize} />
              <Text style={styles.stepsTitle}>Action Plan</Text>
            </View>

            {config.steps.map((step, index) => (
              <View key={`${config.title}-${index}`} style={styles.stepRow}>
                <View style={styles.stepDot}>
                  <Text style={styles.stepDotText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.primaryCta} onPress={handlePrimary} activeOpacity={0.9}>
            <LinearGradient
              colors={[COLORS.maize, '#E7B600']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <Text style={styles.primaryCtaText}>{config.primaryLabel}</Text>
            <ChevronRight size={18} color={COLORS.blue} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryCta} onPress={handleSecondary} activeOpacity={0.85}>
            <Text style={styles.secondaryCtaText}>{config.secondaryLabel}</Text>
            <ChevronRight size={16} color={COLORS.maize} />
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
    paddingTop: SPACING.s,
    paddingBottom: SPACING.s,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.s,
  },
  headerSpacer: {
    width: 36,
  },
  stageTag: {
    backgroundColor: 'rgba(255,203,5,0.18)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 4,
  },
  stageTagText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.7,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: 'Montserrat_700Bold',
  },
  scrollContent: {
    paddingHorizontal: SPACING.m,
    paddingBottom: 120,
  },
  heroCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: SPACING.m,
    marginTop: SPACING.s,
    marginBottom: SPACING.s,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.s,
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,203,5,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.8,
  },
  imageFrame: {
    height: 164,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    marginBottom: SPACING.s,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
  },
  imageOverlayBadge: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.56)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  imageOverlayText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
  },
  heroSummary: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 18,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginBottom: 4,
  },
  heroPriority: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 18,
    fontFamily: 'AtkinsonHyperlegible_700Bold',
    marginBottom: SPACING.s,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    paddingTop: SPACING.s,
  },
  metaText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: SPACING.s,
    marginBottom: SPACING.s,
  },
  metricCard: {
    flex: 1,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  metricValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: 'AtkinsonHyperlegible_700Bold',
    marginBottom: 2,
  },
  metricLabel: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 0.5,
  },
  stepsCard: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.s,
    marginBottom: SPACING.m,
  },
  stepsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: SPACING.s,
  },
  stepsTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.s,
  },
  stepDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,203,5,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  stepDotText: {
    color: COLORS.maize,
    fontSize: 10,
    fontFamily: 'Montserrat_700Bold',
  },
  stepText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 18,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  primaryCta: {
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    paddingHorizontal: SPACING.m,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.s,
  },
  primaryCtaText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.8,
  },
  secondaryCta: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.m,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  secondaryCtaText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
  },
});
