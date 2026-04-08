import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Sun,
  Navigation,
  ParkingCircle,
  Star,
  Utensils,
  Home,
  ChevronLeft,
  ChevronRight,
  Clock,
  Car,
  MapPin,
  Footprints,
  Eye,
  Route,
  Zap,
  Shield,
  Camera,
  Ticket,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import AppBackground from '../../components/chrome/AppBackground';
import TicketPassCard from '../../components/TicketPassCard';

const { width, height } = Dimensions.get('window');

const JOURNEY_PHASES = [
  { id: 'morning', label: 'WAKE UP', icon: Sun, skippable: false },
  { id: 'travel', label: 'TRAVEL', icon: Navigation, skippable: false },
  { id: 'parking', label: 'PARKING', icon: ParkingCircle, skippable: false },
  { id: 'pregame', label: 'PRE-GAME', icon: Star, skippable: true },
  { id: 'ingame', label: 'IN-GAME', icon: Utensils, skippable: false },
  { id: 'postgame', label: 'POST-GAME', icon: Star, skippable: false },
  { id: 'home', label: 'HOME', icon: Home, skippable: false },
];

const ROUTE_BRIEF = {
  eta: '27 min',
  routeType: 'I-94 westbound',
  tolls: 'No tolls',
  chargeImpact: '~8% EV / light fuel draw',
};

const MORNING_CONDITIONS = {
  temp: '54°',
  condition: 'Cool and breezy',
  wear: 'Light jacket + maize layer',
  routeCue: 'Leave by 9:45 AM for a clean lot approach',
};

const GAME_PULSE = [
  { clock: '1Q 12:08', title: 'Opening drive settled', detail: 'Michigan is working underneath throws and short gains.' },
  { clock: '1Q 8:41', title: 'Red zone pressure', detail: 'Concourse lines will spike after this sequence.' },
  { clock: '2Q 1:52', title: 'Momentum swing', detail: 'Big defensive stop. Food pickup is clean right now.' },
];

const SHARE_TEMPLATES = [
  { title: 'Go Blue', body: 'Gold lot to Gate 4. Another one in the books.', tag: '#GoBlue' },
  { title: 'Big House Day', body: 'Seat 24-10-4 and a full day handled cleanly.', tag: '#Hail' },
  { title: 'Game Day Recap', body: 'Parking, gate, seat, and the win thread all in one flow.', tag: '#Michigan' },
];

function parseKickoffDate(game) {
  if (!game?.date) return null;

  const [year, month, day] = game.date.split('-').map(Number);
  if (!year || !month || !day) return null;

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

function getKickoffCountdown(game) {
  const kickoff = parseKickoffDate(game);
  if (!kickoff) return 'Kickoff timing pending';

  const diffMs = kickoff.getTime() - Date.now();
  if (diffMs <= 0) return 'Kickoff is live';

  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const days = Math.floor(diffMinutes / (60 * 24));
  const hours = Math.floor((diffMinutes % (60 * 24)) / 60);
  const minutes = diffMinutes % 60;

  if (days > 0) return `Kickoff in ${days}d ${hours}h`;
  if (hours > 0) return `Kickoff in ${hours}h ${minutes}m`;
  return `Kickoff in ${minutes}m`;
}

async function openPreferredMaps() {
  const appleMapsUrl = 'http://maps.apple.com/?daddr=42.2658,-83.7486&dirflg=d';
  const googleMapsUrl = 'https://www.google.com/maps/dir/?api=1&destination=42.2658,-83.7486&travelmode=driving';
  const androidIntentUrl = 'google.navigation:q=42.2658,-83.7486';

  const primaryUrl = Platform.OS === 'android' ? androidIntentUrl : appleMapsUrl;
  const fallbackUrl = googleMapsUrl;
  const canOpenPrimary = await Linking.canOpenURL(primaryUrl);
  await Linking.openURL(canOpenPrimary ? primaryUrl : fallbackUrl);
}

/**
 * GameDayHomeScreen - Redesigned
 *
 * The current phase card dominates the screen.
 * Context-aware content changes based on phase.
 * The chrome stays restrained so the current moment stays obvious.
 */
export default function GameDayHomeScreen({ navigation }) {
  const {
    gameDayPhase,
    goToPhase,
    currentGame,
    nextGame,
    user,
    exitGameDay,
    journeyOverlay,
    openJourneyOverlay,
    closeJourneyOverlay,
    parkingAssistSession,
    openParkingAssist,
    walkAssistSession,
    openWalkAssist,
  } = useApp();
  const [activeSheet, setActiveSheet] = useState(null);
  const game = currentGame || nextGame;

  const matchedPhaseIndex = JOURNEY_PHASES.findIndex(p => p.id === gameDayPhase);
  const currentPhaseIndex = matchedPhaseIndex === -1 ? 0 : matchedPhaseIndex;
  const currentPhaseData = JOURNEY_PHASES[currentPhaseIndex];
  const nextPhaseData = currentPhaseIndex < JOURNEY_PHASES.length - 1
    ? JOURNEY_PHASES[currentPhaseIndex + 1]
    : null;
  const kickoffCountdown = useMemo(() => getKickoffCountdown(game), [game]);

  const advanceToNextAvailablePhase = () => {
    const nextIndex = currentPhaseIndex + 1;
    if (nextIndex < JOURNEY_PHASES.length) {
      goToPhase(JOURNEY_PHASES[nextIndex].id);
    }
  };

  const handleAdvance = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (gameDayPhase === 'parking' && parkingAssistSession.status === 'complete') {
      if (walkAssistSession.status !== 'complete') {
        handleStartWalkAssist();
        return;
      }
    }

    if (gameDayPhase === 'pregame' && walkAssistSession.status === 'complete') {
      advanceToNextAvailablePhase();
      return;
    }

    advanceToNextAvailablePhase();
  };

  const handleOpenParkingAssistFlow = () => {
    openParkingAssist();
    navigation.navigate('ARParkingAssist');
  };

  const openSheet = (sheetKey) => {
    setActiveSheet(sheetKey);
  };

  const closeSheet = () => {
    setActiveSheet(null);
  };

  const handleStartWalkAssist = () => {
    closeJourneyOverlay();
    openWalkAssist();
    navigation.navigate('ARWalkToGate');
  };

  const handleOpenTicketOverlay = () => {
    openJourneyOverlay('ticket_ready');
  };

  const handleDismissTicketOverlay = () => {
    closeJourneyOverlay();
  };

  const handleContinueFromTicketOverlay = () => {
    closeJourneyOverlay();
    openSheet('pregame_access');
  };

  const handlePhaseDetailPress = () => {
    if (gameDayPhase === 'parking') {
      handleOpenParkingAssistFlow();
      return;
    }
    const screenName = currentPhaseData.id.charAt(0).toUpperCase() + currentPhaseData.id.slice(1) + 'Phase';
    navigation.navigate(screenName);
  };

  const handleBackToDashboard = () => {
    exitGameDay();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Dashboard' }],
    });
  };

  // Get next phase label for CTA button
  const getNextPhaseLabel = () => {
    if (!nextPhaseData) return 'FINISH';
    return nextPhaseData.label;
  };

  const getPrimaryActionConfig = () => {
    if (gameDayPhase === 'parking') {
      if (parkingAssistSession.status !== 'complete') {
        return {
          label: 'OPEN PARKING ASSIST',
          onPress: handleOpenParkingAssistFlow,
        };
      }

      if (walkAssistSession.status !== 'complete') {
        return {
          label: 'START WALK ASSIST',
          onPress: handleStartWalkAssist,
        };
      }

      return {
        label: 'AT GATE',
        onPress: () => goToPhase('pregame'),
      };
    }

    if (gameDayPhase === 'pregame' && walkAssistSession.status === 'complete') {
      return {
        label: 'ENTER STADIUM',
        onPress: handleAdvance,
      };
    }

    if (gameDayPhase === 'home') {
      return {
        label: 'END GAME DAY',
        onPress: handleBackToDashboard,
      };
    }

    return {
      label: `NEXT: ${getNextPhaseLabel()}`,
      onPress: handleAdvance,
    };
  };

  const primaryAction = getPrimaryActionConfig();
  const ticketOverlayVisible = journeyOverlay === 'ticket_ready';

  return (
    <View style={styles.container}>
      <AppBackground variant="gameDay" />

      <SafeAreaView style={styles.safeArea}>
        {/* Compact Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.minimalBackButton}
            onPress={handleBackToDashboard}
            activeOpacity={0.8}
          >
            <ChevronLeft size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <View style={styles.headerLeft}>
            <View style={styles.gameDayBadge}>
              <Zap size={12} color={COLORS.blue} />
              <Text style={styles.gameDayBadgeText}>GAME DAY</Text>
            </View>
            <Text style={styles.headerOpponent}>
              vs {game?.opponent || 'Ohio State'}
            </Text>
            <View style={styles.phaseStrip}>
              <View style={styles.phaseStripItem}>
                <Text style={styles.phaseStripLabel}>NOW</Text>
                <Text style={styles.phaseStripValue}>{currentPhaseData?.label || 'WAKE UP'}</Text>
              </View>
              <View style={styles.phaseStripDivider} />
              <View style={styles.phaseStripItem}>
                <Text style={styles.phaseStripLabel}>NEXT</Text>
                <Text style={styles.phaseStripValue}>{nextPhaseData?.label || 'FINISH'}</Text>
              </View>
            </View>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        {/* Main Phase Card - Dominates the screen */}
        <ScrollView
          style={styles.mainContent}
          contentContainerStyle={styles.mainContentInner}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.phaseCard}>
            <BlurView intensity={25} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,203,5,0.12)', 'rgba(255,203,5,0.02)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.phaseCardAccent} />

            {/* Phase Header inside card */}
            <View style={styles.phaseCardHeader}>
              <View style={styles.phaseIconContainer}>
                {React.createElement(currentPhaseData.icon, {
                  size: 28,
                  color: COLORS.maize,
                })}
              </View>
              <View style={styles.phaseCardHeaderText}>
                <Text style={styles.phaseCardTitle}>{currentPhaseData.label}</Text>
              </View>
            </View>

            {/* Context-Aware Content */}
            <View style={styles.phaseCardBody}>
              {renderPhaseContent({
                phase: gameDayPhase,
                user,
                game,
                navigation,
                kickoffCountdown,
                parkingAssistSession,
                walkAssistSession,
                onOpenTicketOverlay: handleOpenTicketOverlay,
                onOpenMaps: openPreferredMaps,
                onOpenSheet: openSheet,
              })}
            </View>
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.bottomCTA}>
          <TouchableOpacity
            style={styles.advanceButton}
            onPress={primaryAction.onPress}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={[COLORS.maize, '#E5B800']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
              borderRadius={RADIUS.lg}
            />
            <Text style={styles.advanceButtonText}>{primaryAction.label}</Text>
            <ChevronRight size={20} color={COLORS.blue} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <Modal
        visible={ticketOverlayVisible}
        transparent
        animationType="fade"
        onRequestClose={handleDismissTicketOverlay}
      >
        <SafeAreaView style={styles.ticketOverlaySafeArea}>
          <View style={styles.ticketOverlay}>
            <View style={styles.ticketOverlayTop}>
              <Text style={styles.ticketOverlayEyebrow}>ENTRY PASS</Text>
            </View>

            <View style={styles.ticketOverlayInner}>
              <TicketPassCard user={user} />
            </View>

            <View style={styles.ticketOverlayActions}>
              <TouchableOpacity
                style={styles.ticketOverlayPrimaryButton}
                activeOpacity={0.9}
                onPress={handleContinueFromTicketOverlay}
              >
                <LinearGradient
                  colors={[COLORS.maize, '#E5B800']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={StyleSheet.absoluteFill}
                  borderRadius={RADIUS.lg}
                />
                <Text style={styles.ticketOverlayPrimaryText}>Continue to Pregame Access</Text>
                <ChevronRight size={18} color={COLORS.blue} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.ticketOverlaySecondaryButton}
                activeOpacity={0.88}
                onPress={handleDismissTicketOverlay}
              >
                <Text style={styles.ticketOverlaySecondaryText}>Not Now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={!!activeSheet}
        transparent
        animationType="slide"
        onRequestClose={closeSheet}
      >
        <View style={styles.sheetBackdrop}>
          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={closeSheet} />
          <View style={styles.sheetCard}>
            <View style={styles.sheetHandle} />
            {renderBottomSheet(activeSheet, closeSheet)}
          </View>
        </View>
      </Modal>
    </View>
  );
}

/**
 * Renders context-aware content for each phase.
 * This is the meat of the experience - each phase shows
 * completely different, relevant information.
 */
function renderPhaseContent({
  phase,
  user,
  game,
  navigation,
  kickoffCountdown,
  parkingAssistSession,
  walkAssistSession,
  onOpenTicketOverlay,
  onOpenMaps,
  onOpenSheet,
}) {
  switch (phase) {
    case 'morning':
      return <MorningContent user={user} game={game} kickoffCountdown={kickoffCountdown} />;
    case 'travel':
      return <TravelContent user={user} onOpenMaps={onOpenMaps} />;
    case 'parking':
      return (
        <ParkingContent
          user={user}
          navigation={navigation}
          parkingAssistSession={parkingAssistSession}
          walkAssistSession={walkAssistSession}
        />
      );
    case 'pregame':
      return (
        <PregameContent
          user={user}
          game={game}
          walkAssistSession={walkAssistSession}
          onOpenTicketOverlay={onOpenTicketOverlay}
          onOpenSheet={onOpenSheet}
        />
      );
    case 'ingame':
      return <IngameContent user={user} onOpenSheet={onOpenSheet} />;
    case 'postgame':
      return <PostgameContent user={user} onOpenSheet={onOpenSheet} />;
    case 'home':
      return <HomeContent user={user} game={game} />;
    default:
      return null;
  }
}

/* ========================================
   PHASE CONTENT COMPONENTS
   ======================================== */

function MorningContent({ user, game, kickoffCountdown }) {
  return (
    <View style={phaseStyles.content}>
      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Sun size={18} color={COLORS.maize} />
          <Text style={phaseStyles.infoBlockTitle}>CONDITIONS</Text>
        </View>
        <View style={phaseStyles.weatherRow}>
          <Text style={phaseStyles.weatherTemp}>{MORNING_CONDITIONS.temp}</Text>
          <View style={phaseStyles.weatherDetails}>
            <Text style={phaseStyles.weatherCondition}>{MORNING_CONDITIONS.condition}</Text>
            <View style={phaseStyles.weatherDetailItem}>
              <Clock size={14} color={COLORS.textTertiary} />
              <Text style={phaseStyles.weatherDetailText}>{kickoffCountdown}</Text>
            </View>
            <View style={phaseStyles.weatherDetailItem}>
              <Shield size={14} color={COLORS.textTertiary} />
              <Text style={phaseStyles.weatherDetailText}>{MORNING_CONDITIONS.wear}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={phaseStyles.divider} />

      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Navigation size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>DEPARTURE READINESS</Text>
        </View>
        <View style={phaseStyles.routeSummary}>
          <View style={phaseStyles.routeSummaryItem}>
            <Text style={phaseStyles.routeSummaryLabel}>LOT</Text>
            <Text style={phaseStyles.routeSummaryValue}>{user.parking.lot}</Text>
          </View>
          <View style={phaseStyles.routeSummaryItem}>
            <Text style={phaseStyles.routeSummaryLabel}>DRIVE</Text>
            <Text style={phaseStyles.routeSummaryValue}>{ROUTE_BRIEF.eta}</Text>
          </View>
        </View>
        <Text style={phaseStyles.subtitleText}>{MORNING_CONDITIONS.routeCue}</Text>
        <Text style={phaseStyles.locationMetaText}>Spot {user.parking.spot} is reserved and ready for lot handoff.</Text>
        <Text style={phaseStyles.locationMetaText}>Kickoff: {game?.time || '12:00 PM'} at Michigan Stadium.</Text>
      </View>
    </View>
  );
}

function TravelContent({ user, onOpenMaps }) {
  return (
    <View style={phaseStyles.content}>
      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Route size={18} color={COLORS.maize} />
          <Text style={phaseStyles.infoBlockTitle}>ROUTE BRIEF</Text>
        </View>
        <View style={phaseStyles.travelMetricRow}>
          <View style={phaseStyles.travelMetric}>
            <Text style={phaseStyles.travelMetricValue}>{ROUTE_BRIEF.eta}</Text>
            <Text style={phaseStyles.travelMetricLabel}>drive time</Text>
          </View>
          <View style={phaseStyles.etaDivider} />
          <View style={phaseStyles.travelMetric}>
            <Text style={phaseStyles.travelMetricValue}>0</Text>
            <Text style={phaseStyles.travelMetricLabel}>tolls</Text>
          </View>
          <View style={phaseStyles.etaDivider} />
          <View style={phaseStyles.travelMetric}>
            <Text style={phaseStyles.travelMetricValue}>8%</Text>
            <Text style={phaseStyles.travelMetricLabel}>charge draw</Text>
          </View>
        </View>
      </View>

      <View style={phaseStyles.divider} />

      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Navigation size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>DRIVE NOTES</Text>
        </View>
        <Text style={phaseStyles.locationName}>{ROUTE_BRIEF.routeType}</Text>
        <Text style={phaseStyles.locationAddress}>{ROUTE_BRIEF.tolls}</Text>
        <Text style={phaseStyles.locationMetaText}>{ROUTE_BRIEF.chargeImpact}</Text>
      </View>

      <View style={phaseStyles.destinationCard}>
        <ParkingCircle size={24} color={COLORS.maize} />
        <View style={{ flex: 1 }}>
          <Text style={phaseStyles.destinationTitle}>{user.parking.lot}</Text>
          <Text style={phaseStyles.destinationSub}>Spot {user.parking.spot}</Text>
        </View>
      </View>

      <TouchableOpacity style={phaseStyles.inlineAction} onPress={onOpenMaps} activeOpacity={0.9}>
        <Navigation size={18} color={COLORS.maize} />
        <Text style={phaseStyles.inlineActionText}>Open in Maps</Text>
      </TouchableOpacity>
    </View>
  );
}

// Pre-computed occupancy grid (deterministic — no Math.random on render)
// 1 = occupied, 0 = available. ~70% occupied on game day.
const LOT_OCCUPANCY = [
  [1,1,0,1,1,1,0,1,1,1], // A
  [1,0,1,1,1,1,1,0,1,1], // B
  [1,1,1,0,1,1,1,1,0,1], // C
  [0,1,1,1,1,0,1,1,1,1], // D
  [1,1,0,1,1,1,1,1,0,1], // E
  [1,1,1,1,0,1,1,1,1,0], // F
  [1,0,1,1,1,1,0,1,1,1], // G — user is index 1 (overridden)
];

function ParkingContent({ user, navigation, parkingAssistSession, walkAssistSession }) {
  const { openParkingAssist, openWalkAssist } = useApp();

  const handleOpenParkingAssist = () => {
    openParkingAssist();
    navigation.navigate('ARParkingAssist');
  };

  const handleOpenWalkAssist = () => {
    openWalkAssist();
    navigation.navigate('ARWalkToGate');
  };

  const LOT_ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const SPOTS_PER_ROW = 10;
  const userRow = 'G';
  const userSpotIndex = 1; // G-142

  return (
    <View style={phaseStyles.content}>
      <View style={phaseStyles.spotHero}>
        <View style={phaseStyles.spotHeroIcon}>
          <ParkingCircle size={36} color={COLORS.maize} />
        </View>
        <View style={phaseStyles.spotHeroInfo}>
          <Text style={phaseStyles.spotHeroLabel}>YOUR SPOT</Text>
          <Text style={phaseStyles.spotHeroNumber}>{user.parking.spot}</Text>
          <Text style={phaseStyles.spotHeroLot}>{user.parking.lot}</Text>
        </View>
      </View>

      <View style={phaseStyles.divider} />

      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Camera size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>JOURNEY TOOLS</Text>
        </View>
        <View style={{ gap: SPACING.s }}>
          <TouchableOpacity
            style={{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: RADIUS.lg,
              padding: SPACING.m,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)'
            }}
            onPress={handleOpenParkingAssist}
            activeOpacity={0.9}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.s }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,203,5,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                <ParkingCircle size={16} color={COLORS.maize} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: COLORS.text, fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Montserrat_600SemiBold' }}>
                  {parkingAssistSession.status === 'complete' ? 'Parking Confirmed' : 'Find Your Spot'}
                </Text>
                <Text style={{ color: COLORS.textSecondary, fontSize: 11, fontFamily: 'AtkinsonHyperlegible_400Regular' }}>
                  {parkingAssistSession.status === 'complete' ? 'Vehicle located' : 'Live AR guidance to your spot'}
                </Text>
              </View>
              <ChevronRight size={18} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>

          {parkingAssistSession.status === 'complete' && walkAssistSession.status !== 'complete' ? (
            <View style={phaseStyles.statusCard}>
              <View style={phaseStyles.statusIcon}>
                <Car size={16} color={COLORS.maize} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={phaseStyles.statusTitle}>Car parked. Spot remembered.</Text>
                <Text style={phaseStyles.statusBody}>
                  The car is locked in. Walking assist is the next step, not the ticket.
                </Text>
              </View>
            </View>
          ) : null}

          <TouchableOpacity
            style={[{
              backgroundColor: 'rgba(255,255,255,0.05)',
              borderRadius: RADIUS.lg,
              padding: SPACING.m,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.1)'
            }, parkingAssistSession.status !== 'complete' && { opacity: 0.5 }]}
            onPress={parkingAssistSession.status === 'complete' ? handleOpenWalkAssist : null}
            activeOpacity={0.9}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.s }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,203,5,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                <Footprints size={16} color={COLORS.maize} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: COLORS.text, fontSize: TYPOGRAPHY.fontSize.sm, fontFamily: 'Montserrat_600SemiBold' }}>
                  {walkAssistSession.status === 'complete' ? 'Gate Reached' : 'Walk to Gate'}
                </Text>
                <Text style={{ color: COLORS.textSecondary, fontSize: 11, fontFamily: 'AtkinsonHyperlegible_400Regular' }}>
                  {parkingAssistSession.status !== 'complete' 
                    ? 'Unlocks after parking' 
                    : walkAssistSession.status === 'complete' ? 'Arrived at Gate 4' : 'Live AR route to stadium gate'}
                </Text>
              </View>
              <ChevronRight size={18} color={COLORS.textSecondary} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={phaseStyles.divider} />

      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Eye size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>LOT MAP — BIRD'S EYE VIEW</Text>
        </View>

        <View style={phaseStyles.parkingMap}>
          {/* Stadium Reference */}
          <View style={phaseStyles.stadiumRef}>
            <LinearGradient
              colors={['rgba(255,203,5,0.15)', 'rgba(255,203,5,0.05)']}
              style={[StyleSheet.absoluteFill, { borderRadius: RADIUS.sm }]}
            />
            <Shield size={16} color={COLORS.maize} />
            <Text style={phaseStyles.stadiumRefText}>MICHIGAN STADIUM</Text>
            <Text style={phaseStyles.stadiumRefArrow}>↑ 0.4 mi walk</Text>
          </View>

          {/* Road label */}
          <View style={phaseStyles.roadLabel}>
            <View style={phaseStyles.roadLine} />
            <Text style={phaseStyles.roadLabelText}>STADIUM BLVD</Text>
            <View style={phaseStyles.roadLine} />
          </View>

          {/* Lot Grid */}
          <View style={phaseStyles.lotContainer}>
            <Text style={phaseStyles.lotName}>{user.parking.lot.toUpperCase()}</Text>
            {LOT_ROWS.map((row) => (
              <View key={row} style={phaseStyles.lotRow}>
                <Text style={phaseStyles.lotRowLabel}>{row}</Text>
                <View style={phaseStyles.lotRowSpots}>
                  {[...Array(SPOTS_PER_ROW)].map((_, spotIdx) => {
                    const rowIndex = LOT_ROWS.indexOf(row);
                    const isUserSpot = row === userRow && spotIdx === userSpotIndex;
                    const isOccupied = LOT_OCCUPANCY[rowIndex]?.[spotIdx] === 1;
                    return (
                      <View
                        key={spotIdx}
                        style={[
                          phaseStyles.lotSpot,
                          isUserSpot && phaseStyles.lotSpotUser,
                          !isUserSpot && isOccupied && phaseStyles.lotSpotOccupied,
                        ]}
                      >
                        {isUserSpot && (
                          <Car size={10} color={COLORS.blue} />
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            ))}

            {/* Lot Entrance */}
            <View style={phaseStyles.lotEntrance}>
              <View style={phaseStyles.lotEntranceArrow} />
              <Text style={phaseStyles.lotEntranceText}>ENTRANCE</Text>
            </View>
          </View>

          {/* Legend */}
          <View style={phaseStyles.mapLegend}>
            <View style={phaseStyles.legendItem}>
              <View style={[phaseStyles.legendDot, { backgroundColor: COLORS.maize }]} />
              <Text style={phaseStyles.legendText}>Your Spot</Text>
            </View>
            <View style={phaseStyles.legendItem}>
              <View style={[phaseStyles.legendDot, { backgroundColor: 'rgba(255,255,255,0.25)' }]} />
              <Text style={phaseStyles.legendText}>Occupied</Text>
            </View>
            <View style={phaseStyles.legendItem}>
              <View style={[phaseStyles.legendDot, { backgroundColor: 'rgba(255,255,255,0.06)' }]} />
              <Text style={phaseStyles.legendText}>Available</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function PregameContent({ user, game, walkAssistSession, onOpenTicketOverlay, onOpenSheet }) {
  if (walkAssistSession.status === 'complete') {
    return (
      <View style={phaseStyles.content}>
        <View style={phaseStyles.infoBlock}>
          <View style={phaseStyles.infoBlockHeader}>
            <Shield size={18} color={COLORS.maize} />
            <Text style={phaseStyles.infoBlockTitle}>ENTRY HANDOFF</Text>
          </View>
          <Text style={phaseStyles.bigText}>Gate 4 Ready</Text>
          <Text style={phaseStyles.subtitleText}>
            You are at the gate. Bring up the pass when the lane starts moving, then use pregame access before heading in.
          </Text>
        </View>

        <View style={phaseStyles.divider} />

        <View style={phaseStyles.infoBlock}>
          <View style={phaseStyles.infoBlockHeader}>
            <Clock size={18} color={COLORS.textSecondary} />
            <Text style={phaseStyles.infoBlockTitle}>RIGHT NOW</Text>
          </View>
          <View style={phaseStyles.walkStats}>
            <View style={phaseStyles.walkStatItem}>
              <Text style={phaseStyles.walkStatValue}>Gate 4</Text>
              <Text style={phaseStyles.walkStatUnit}>entry lane</Text>
            </View>
            <View style={phaseStyles.etaDivider} />
            <View style={phaseStyles.walkStatItem}>
              <Text style={phaseStyles.walkStatValue}>{user.seat.section}</Text>
              <Text style={phaseStyles.walkStatUnit}>section</Text>
            </View>
            <View style={phaseStyles.etaDivider} />
            <View style={phaseStyles.walkStatItem}>
              <Text style={phaseStyles.walkStatValue}>22</Text>
              <Text style={phaseStyles.walkStatUnit}>min to kick</Text>
            </View>
          </View>
        </View>

        <View style={phaseStyles.divider} />

        <View style={phaseStyles.infoBlock}>
          <View style={phaseStyles.infoBlockHeader}>
            <Star size={18} color={COLORS.textSecondary} />
            <Text style={phaseStyles.infoBlockTitle}>PREGAME ACCESS</Text>
          </View>
          <Text style={phaseStyles.subtitleText}>
            Premium entry, member lounge confirmation, and the final pass check live here.
          </Text>
          <View style={phaseStyles.inlineActionRow}>
            <TouchableOpacity style={phaseStyles.inlineAction} onPress={onOpenTicketOverlay} activeOpacity={0.9}>
              <Ticket size={18} color={COLORS.maize} />
              <Text style={phaseStyles.inlineActionText}>View Entry Pass</Text>
            </TouchableOpacity>
            <TouchableOpacity style={phaseStyles.inlineAction} onPress={() => onOpenSheet('pregame_access')} activeOpacity={0.9}>
              <Shield size={18} color={COLORS.maize} />
              <Text style={phaseStyles.inlineActionText}>Open Access</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={phaseStyles.divider} />

        <View style={phaseStyles.infoBlock}>
          <View style={phaseStyles.infoBlockHeader}>
            <MapPin size={18} color={COLORS.textSecondary} />
            <Text style={phaseStyles.infoBlockTitle}>SEAT COMMAND</Text>
          </View>
          <View style={phaseStyles.seatDisplay}>
            <View style={phaseStyles.seatItem}>
              <Text style={phaseStyles.seatLabel}>SEC</Text>
              <Text style={phaseStyles.seatValue}>{user.seat.section}</Text>
            </View>
            <View style={phaseStyles.seatDivider} />
            <View style={phaseStyles.seatItem}>
              <Text style={phaseStyles.seatLabel}>ROW</Text>
              <Text style={phaseStyles.seatValue}>{user.seat.row}</Text>
            </View>
            <View style={phaseStyles.seatDivider} />
            <View style={phaseStyles.seatItem}>
              <Text style={phaseStyles.seatLabel}>SEAT</Text>
              <Text style={phaseStyles.seatValue}>{user.seat.seat}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={phaseStyles.content}>
      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Footprints size={18} color={COLORS.maize} />
          <Text style={phaseStyles.infoBlockTitle}>APPROACHING GATE 4</Text>
        </View>
        <Text style={phaseStyles.bigText}>Gate 4</Text>
        <Text style={phaseStyles.subtitleText}>
          Finish walk assist first. The pass takes over only once you reach the gate.
        </Text>
      </View>

      <View style={phaseStyles.divider} />

      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Clock size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>TIME TO KICKOFF</Text>
        </View>
        <Text style={phaseStyles.bigText}>{game?.time || '12:00 PM'}</Text>
        <Text style={phaseStyles.subtitleText}>Kickoff timing stays pinned while entry opens.</Text>
      </View>

      <View style={phaseStyles.divider} />

      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <MapPin size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>YOUR SEAT</Text>
        </View>
        <View style={phaseStyles.seatDisplay}>
          <View style={phaseStyles.seatItem}>
            <Text style={phaseStyles.seatLabel}>SEC</Text>
            <Text style={phaseStyles.seatValue}>{user.seat.section}</Text>
          </View>
          <View style={phaseStyles.seatDivider} />
          <View style={phaseStyles.seatItem}>
            <Text style={phaseStyles.seatLabel}>ROW</Text>
            <Text style={phaseStyles.seatValue}>{user.seat.row}</Text>
          </View>
          <View style={phaseStyles.seatDivider} />
          <View style={phaseStyles.seatItem}>
            <Text style={phaseStyles.seatLabel}>SEAT</Text>
            <Text style={phaseStyles.seatValue}>{user.seat.seat}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function IngameContent({ user, onOpenSheet }) {
  return (
    <View style={phaseStyles.content}>
      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Star size={18} color={COLORS.maize} />
          <Text style={phaseStyles.infoBlockTitle}>MATCH PULSE</Text>
        </View>
        <View style={phaseStyles.pulseStack}>
          {GAME_PULSE.map((item) => (
            <View key={item.clock} style={phaseStyles.pulseItem}>
              <View style={phaseStyles.pulseChip}>
                <Text style={phaseStyles.pulseChipText}>{item.clock}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={phaseStyles.pulseTitle}>{item.title}</Text>
                <Text style={phaseStyles.pulseBody}>{item.detail}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={phaseStyles.divider} />

      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Utensils size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>IN-STADIUM SERVICES</Text>
        </View>
        <View style={phaseStyles.quickActionsGrid}>
          {[
            { icon: Utensils, label: 'Order Food', key: 'food' },
            { icon: Navigation, label: 'Restrooms', key: 'restrooms' },
            { icon: Shield, label: 'Guest Services', key: 'guest_services' },
            { icon: Footprints, label: 'Seat Route', key: 'seat_route' },
          ].map((action, i) => (
            <TouchableOpacity key={i} style={phaseStyles.quickActionItem} onPress={() => onOpenSheet(action.key)}>
              <action.icon size={22} color={COLORS.maize} />
              <Text style={phaseStyles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={phaseStyles.divider} />

      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <MapPin size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>SUPPORT POSITION</Text>
        </View>
        <Text style={phaseStyles.locationName}>Section {user.seat.section}</Text>
        <Text style={phaseStyles.subtitleText}>
          Service, rerouting, and wayfinding stay anchored to your section during the game.
        </Text>
      </View>
    </View>
  );
}

function PostgameContent({ user, onOpenSheet }) {
  return (
    <View style={phaseStyles.content}>
      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Navigation size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>RETURN ROUTE</Text>
        </View>
        <View style={phaseStyles.travelMetricRow}>
          <View style={phaseStyles.travelMetric}>
            <Text style={phaseStyles.travelMetricValue}>18 min</Text>
            <Text style={phaseStyles.travelMetricLabel}>to lot clear</Text>
          </View>
          <View style={phaseStyles.etaDivider} />
          <View style={phaseStyles.travelMetric}>
            <Text style={phaseStyles.travelMetricValue}>12 min</Text>
            <Text style={phaseStyles.travelMetricLabel}>to car</Text>
          </View>
          <View style={phaseStyles.etaDivider} />
          <View style={phaseStyles.travelMetric}>
            <Text style={phaseStyles.travelMetricValue}>Med</Text>
            <Text style={phaseStyles.travelMetricLabel}>delay</Text>
          </View>
        </View>
        <Text style={phaseStyles.subtitleText}>Exit through Gate 4, stay right on Stadium Blvd, and avoid the south ramp congestion.</Text>
      </View>

      <View style={phaseStyles.divider} />

      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <ParkingCircle size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>PARKING TARGET</Text>
        </View>
        <Text style={phaseStyles.locationName}>{user.parking.lot}</Text>
        <Text style={phaseStyles.locationAddress}>Spot {user.parking.spot}</Text>
      </View>

      <TouchableOpacity style={phaseStyles.inlineAction} onPress={() => onOpenSheet('share_game')} activeOpacity={0.9}>
        <Camera size={18} color={COLORS.maize} />
        <Text style={phaseStyles.inlineActionText}>Share Your Game Day</Text>
      </TouchableOpacity>
    </View>
  );
}

function HomeContent({ user, game }) {
  return (
    <View style={phaseStyles.content}>
      <View style={phaseStyles.infoBlock}>
        <View style={{ alignItems: 'center', paddingVertical: SPACING.l }}>
          <Home size={48} color={COLORS.maize} />
          <Text style={[phaseStyles.bigText, { textAlign: 'center', marginTop: SPACING.m }]}>
            Safe Travels, {user.name}!
          </Text>
          <Text style={[phaseStyles.subtitleText, { textAlign: 'center' }]}>Your day is wrapped. Dashboard becomes home base again from here.</Text>
        </View>
      </View>

      <View style={phaseStyles.divider} />
      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Clock size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>NEXT HORIZON</Text>
        </View>
        <Text style={phaseStyles.locationName}>Next kickoff stays pinned</Text>
        <Text style={phaseStyles.subtitleText}>
          {game ? `${game.opponent} at ${game.time}. Resume from the dashboard when you are ready.` : 'Resume from the dashboard when you are ready.'}
        </Text>
      </View>
    </View>
  );
}

function renderBottomSheet(activeSheet) {
  if (!activeSheet) return null;

  if (activeSheet === 'pregame_access') {
    return (
      <View>
        <Text style={styles.sheetTitle}>Pregame Access</Text>
        <Text style={styles.sheetBody}>Use the member lane at Gate 4, keep the pass forward, and head into the lounge before seat approach.</Text>
        <View style={styles.sheetList}>
          <Text style={styles.sheetListItem}>Premium lane opens first at Gate 4.</Text>
          <Text style={styles.sheetListItem}>Pass check happens before the interior queue split.</Text>
          <Text style={styles.sheetListItem}>Lounge access is the best stop before entering Section 24.</Text>
        </View>
      </View>
    );
  }

  if (activeSheet === 'food') {
    return (
      <View>
        <Text style={styles.sheetTitle}>Order Food</Text>
        <Text style={styles.sheetBody}>Member pricing is active. Your in-seat or express pickup order carries a 10% Wolverine VIP discount.</Text>
        <View style={styles.sheetList}>
          <Text style={styles.sheetListItem}>Express pickup: Section 22 concourse.</Text>
          <Text style={styles.sheetListItem}>Seat delivery: available during live play breaks.</Text>
          <Text style={styles.sheetListItem}>Discount auto-applies at checkout.</Text>
        </View>
      </View>
    );
  }

  if (activeSheet === 'restrooms') {
    return (
      <View>
        <Text style={styles.sheetTitle}>Restrooms</Text>
        <Text style={styles.sheetBody}>Nearest route is up one aisle and back toward the Section 24 concourse split.</Text>
        <View style={styles.sheetList}>
          <Text style={styles.sheetListItem}>Closest option: 90-second walk.</Text>
          <Text style={styles.sheetListItem}>Lower wait right after media timeouts.</Text>
        </View>
      </View>
    );
  }

  if (activeSheet === 'guest_services') {
    return (
      <View>
        <Text style={styles.sheetTitle}>Guest Services</Text>
        <Text style={styles.sheetBody}>Use this for accessibility support, seating help, or assistance rerouting back to your section.</Text>
        <View style={styles.sheetList}>
          <Text style={styles.sheetListItem}>Closest desk: Gate 4 interior corridor.</Text>
          <Text style={styles.sheetListItem}>Escort requests and accessibility support are available.</Text>
        </View>
      </View>
    );
  }

  if (activeSheet === 'seat_route') {
    return (
      <View>
        <Text style={styles.sheetTitle}>Seat Route</Text>
        <Text style={styles.sheetBody}>Return by following the Section 24 markers and taking the inside aisle once you clear the concourse.</Text>
        <View style={styles.sheetList}>
          <Text style={styles.sheetListItem}>Section 24, Row 10, Seat 4.</Text>
          <Text style={styles.sheetListItem}>Best re-entry window: between possessions.</Text>
        </View>
      </View>
    );
  }

  if (activeSheet === 'share_game') {
    return (
      <View>
        <Text style={styles.sheetTitle}>Share Your Game Day</Text>
        <Text style={styles.sheetBody}>Swipe through lightweight share templates. This keeps the prototype thoughtful without building a full export system today.</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shareTemplateRow}>
          {SHARE_TEMPLATES.map((template) => (
            <View key={template.title} style={styles.shareTemplateCard}>
              <Text style={styles.shareTemplateTitle}>{template.title}</Text>
              <Text style={styles.shareTemplateBody}>{template.body}</Text>
              <Text style={styles.shareTemplateTag}>{template.tag}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return null;
}

/* ========================================
   STYLES - Main Layout
   ======================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blue,
  },
  safeArea: {
    flex: 1,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.s,
    paddingBottom: SPACING.s,
  },
  minimalBackButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.xs,
  },
  headerLeft: {
    flex: 1,
  },
  headerSpacer: {
    width: 44,
  },
  gameDayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.maize,
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.s,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    marginBottom: SPACING.xs,
  },
  gameDayBadgeText: {
    color: COLORS.blue,
    fontSize: 9,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  headerOpponent: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: 'Montserrat_700Bold',
  },
  phaseStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: SPACING.s,
    marginTop: SPACING.s,
    paddingHorizontal: SPACING.s,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  phaseStripItem: {
    gap: 2,
  },
  phaseStripLabel: {
    color: COLORS.textTertiary,
    fontSize: 9,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  phaseStripValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
  },
  phaseStripDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // Main Content
  mainContent: {
    flex: 1,
  },
  mainContentInner: {
    paddingHorizontal: SPACING.l,
    paddingBottom: 182,
  },

  // Phase Card
  phaseCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.25)',
    minHeight: height * 0.54,
  },
  phaseCardAccent: {
    height: 4,
    backgroundColor: COLORS.maize,
  },
  phaseCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    paddingBottom: SPACING.s,
    gap: SPACING.m,
  },
  phaseIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,203,5,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseCardHeaderText: {
    flex: 1,
  },
  phaseCardTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: 'Montserrat_700Bold',
  },
  phaseCardBody: {
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.m,
  },

  // Bottom CTA
  bottomCTA: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: SPACING.l,
    paddingBottom: Platform.OS === 'ios' ? 116 : 92,
    paddingTop: SPACING.s,
  },
  advanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.s,
    paddingVertical: SPACING.m,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  advanceButtonText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  ticketOverlaySafeArea: {
    flex: 1,
    backgroundColor: '#000000',
  },
  ticketOverlay: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.s,
    paddingBottom: Platform.OS === 'ios' ? SPACING.l : SPACING.m,
  },
  ticketOverlayTop: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: SPACING.m,
  },
  ticketOverlayEyebrow: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1.2,
  },
  ticketOverlayInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletPass: {
    width: '100%',
    maxWidth: 380,
    overflow: 'hidden',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: SPACING.l,
    minHeight: 440,
  },
  walletPassAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
    backgroundColor: COLORS.maize,
  },
  walletPassHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.m,
    marginBottom: SPACING.l,
  },
  walletPassEyebrow: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  walletPassTitle: {
    color: COLORS.text,
    fontSize: 28,
    lineHeight: 32,
    fontFamily: 'Montserrat_700Bold',
  },
  walletPassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.maize,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  walletPassBadgeText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.9,
  },
  walletMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.m,
  },
  walletMetaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  walletMetaChipText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
  },
  walletSeatRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    marginBottom: SPACING.l,
  },
  walletSeatBlock: {
    flex: 1,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.s,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletSeatDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  walletSeatLabel: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
    marginBottom: 6,
  },
  walletSeatValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: 'Montserrat_700Bold',
  },
  walletBarcodeArea: {
    marginTop: 'auto',
    paddingTop: SPACING.l,
  },
  walletBarcodeBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 4,
    minHeight: 34,
    marginBottom: SPACING.s,
  },
  walletBarcodeBar: {
    flex: 1,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  walletBarcodeCaption: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 18,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    textAlign: 'center',
  },
  ticketOverlayPrimaryButton: {
    width: '100%',
    minHeight: 56,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  ticketOverlayActions: {
    width: '100%',
    maxWidth: 380,
    alignSelf: 'center',
    gap: SPACING.s,
    paddingTop: SPACING.l,
  },
  ticketOverlayPrimaryText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.6,
  },
  ticketOverlaySecondaryButton: {
    width: '100%',
    minHeight: 48,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  ticketOverlaySecondaryText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.4,
  },
  sheetBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  sheetCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: 'rgba(4,12,23,0.98)',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: SPACING.l,
    paddingTop: SPACING.s,
    paddingBottom: Platform.OS === 'ios' ? 36 : SPACING.l,
    minHeight: 260,
  },
  sheetHandle: {
    width: 46,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignSelf: 'center',
    marginBottom: SPACING.m,
  },
  sheetTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: SPACING.s,
  },
  sheetBody: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.base,
    lineHeight: 22,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  sheetList: {
    gap: SPACING.s,
    marginTop: SPACING.m,
  },
  sheetListItem: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 20,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  shareTemplateRow: {
    gap: SPACING.m,
    paddingTop: SPACING.m,
    paddingRight: SPACING.l,
  },
  shareTemplateCard: {
    width: width * 0.62,
    minHeight: 168,
    borderRadius: RADIUS.xl,
    padding: SPACING.m,
    backgroundColor: 'rgba(255,203,5,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.18)',
  },
  shareTemplateTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: SPACING.s,
  },
  shareTemplateBody: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 20,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  shareTemplateTag: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    marginTop: 'auto',
  },
});

/* ========================================
   STYLES - Phase Content
   ======================================== */

const phaseStyles = StyleSheet.create({
  content: {},

  // Info Block
  infoBlock: {
    marginBottom: SPACING.m,
  },
  infoBlockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
    marginBottom: SPACING.m,
  },
  infoBlockTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1.5,
  },
  entryPassCard: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.22)',
    backgroundColor: 'rgba(255,203,5,0.08)',
    padding: SPACING.m,
  },
  entryPassTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    lineHeight: 22,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: SPACING.xs,
  },
  entryPassBody: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 20,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginBottom: SPACING.m,
  },
  entryPassButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  entryPassButtonText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: SPACING.m,
  },

  // Weather
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.l,
  },
  weatherTemp: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.display,
    fontFamily: 'Montserrat_700Bold',
    lineHeight: TYPOGRAPHY.fontSize.display,
  },
  weatherDetails: {
    flex: 1,
    paddingTop: SPACING.xs,
  },
  weatherDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  weatherDetailText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  weatherCondition: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_600SemiBold',
    marginBottom: SPACING.xs,
  },
  weatherAdvice: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    fontStyle: 'italic',
  },

  // ETA
  etaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  etaStat: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  etaStatText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  etaValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontFamily: 'Montserrat_700Bold',
  },
  etaUnit: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
    marginTop: SPACING.xxs,
  },
  etaDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // Schedule
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.s,
    gap: SPACING.m,
  },
  scheduleTime: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
    width: 80,
  },
  scheduleEvent: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    flex: 1,
  },

  // Matchup
  matchupBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.m,
    paddingVertical: SPACING.l,
    marginTop: SPACING.m,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255,203,5,0.08)',
  },
  matchupTeam: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
  },
  matchupVs: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  // Location (Tailgate)
  locationName: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: SPACING.xxs,
  },
  locationAddress: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginBottom: SPACING.m,
  },
  locationMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  locationMetaText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  // Crew
  crewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.s,
    gap: SPACING.m,
  },
  crewAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,203,5,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crewAvatarText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
  },
  crewName: {
    flex: 1,
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_600SemiBold',
  },
  crewStatus: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    textTransform: 'capitalize',
  },

  // Countdown
  countdownRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.l,
  },
  countdownBlock: {
    alignItems: 'center',
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.m,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    minWidth: 80,
  },
  countdownValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.display,
    fontFamily: 'Montserrat_700Bold',
  },
  countdownUnit: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
    marginTop: SPACING.xxs,
  },

  // Big Time (Travel ETA)
  bigTime: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.display,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: SPACING.m,
  },

  // Alert
  alertBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
    padding: SPACING.m,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(216,96,24,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(216,96,24,0.25)',
  },
  alertIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(216,96,24,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    color: COLORS.rossOrange,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_600SemiBold',
  },
  alertDesc: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },

  // Route
  routePoints: {
    paddingLeft: SPACING.xs,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
  },
  routeDotStart: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.textTertiary,
  },
  routeDotEnd: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.maize,
  },
  routeLine: {
    width: 2,
    height: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginLeft: 4,
    marginVertical: SPACING.xs,
  },
  routePointText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  // Destination Card
  destinationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
    padding: SPACING.m,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255,203,5,0.08)',
    marginTop: SPACING.m,
  },
  destinationTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_700Bold',
  },
  destinationSub: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },
  routeSummary: {
    flexDirection: 'row',
    gap: SPACING.s,
    marginBottom: SPACING.m,
  },
  routeSummaryItem: {
    flex: 1,
    padding: SPACING.m,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  routeSummaryLabel: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  routeSummaryValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_700Bold',
  },
  travelMetricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: SPACING.s,
  },
  travelMetric: {
    alignItems: 'center',
    flex: 1,
  },
  travelMetricValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: 'Montserrat_700Bold',
  },
  travelMetricLabel: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },
  inlineActionRow: {
    flexDirection: 'row',
    gap: SPACING.s,
    marginTop: SPACING.m,
  },
  inlineAction: {
    marginTop: SPACING.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.s,
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.m,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inlineActionText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
  },
  statusCard: {
    flexDirection: 'row',
    gap: SPACING.m,
    padding: SPACING.m,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255,203,5,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.18)',
  },
  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,203,5,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: SPACING.xxs,
  },
  statusBody: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 20,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  // Parking Spot Hero
  spotHero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.l,
    marginBottom: SPACING.m,
  },
  spotHeroIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,203,5,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotHeroInfo: {},
  spotHeroLabel: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  spotHeroNumber: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontFamily: 'Montserrat_700Bold',
  },
  spotHeroLot: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },

  // Parking Map
  parkingMap: {
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(0,39,76,0.6)',
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  stadiumRef: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.s,
    paddingVertical: SPACING.s,
    marginBottom: SPACING.m,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  stadiumRefText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  stadiumRefArrow: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  roadLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
    marginBottom: SPACING.m,
  },
  roadLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  roadLabelText: {
    color: COLORS.textTertiary,
    fontSize: 8,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  lotContainer: {
    marginBottom: SPACING.m,
  },
  lotName: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
    marginBottom: SPACING.s,
    textAlign: 'center',
  },
  lotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    gap: SPACING.xs,
  },
  lotRowLabel: {
    width: 14,
    color: COLORS.textTertiary,
    fontSize: 8,
    fontFamily: 'Montserrat_700Bold',
    textAlign: 'center',
  },
  lotRowSpots: {
    flex: 1,
    flexDirection: 'row',
    gap: 2,
  },
  lotSpot: {
    flex: 1,
    height: 22,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lotSpotUser: {
    backgroundColor: COLORS.maize,
  },
  lotSpotOccupied: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  lotEntrance: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.s,
    marginTop: SPACING.s,
  },
  lotEntranceArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: COLORS.waveFieldGreen,
  },
  lotEntranceText: {
    color: COLORS.waveFieldGreen,
    fontSize: 8,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  mapLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.l,
    marginTop: SPACING.xs,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  legendText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  // Walk Stats
  walkStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  walkStatItem: {
    alignItems: 'center',
  },
  walkStatValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: 'Montserrat_700Bold',
  },
  walkStatUnit: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },

  // Big Text
  bigText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: SPACING.xs,
  },
  subtitleText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    lineHeight: TYPOGRAPHY.fontSize.base * 1.5,
  },

  // Seat Display
  seatDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: SPACING.m,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  seatItem: {
    alignItems: 'center',
  },
  seatLabel: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  seatValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontFamily: 'Montserrat_700Bold',
  },
  seatDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // Scoreboard
  scoreboard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: SPACING.l,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  scoreTeam: {
    alignItems: 'center',
    flex: 1,
  },
  scoreTeamName: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  scoreValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.display,
    fontFamily: 'Montserrat_700Bold',
  },
  scoreMid: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  scoreQuarter: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  scoreTime: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
  },

  // Quick Actions Grid
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.s,
  },
  quickActionItem: {
    width: '47%',
    paddingVertical: SPACING.m,
    paddingHorizontal: SPACING.m,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    gap: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickActionLabel: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
  },
  pulseStack: {
    gap: SPACING.s,
  },
  pulseItem: {
    flexDirection: 'row',
    gap: SPACING.s,
    padding: SPACING.m,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  pulseChip: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.s,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,203,5,0.15)',
  },
  pulseChipText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
  },
  pulseTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: SPACING.xxs,
  },
  pulseBody: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 18,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  // Recap
  recapRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  recapItem: {
    alignItems: 'center',
  },
  recapValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: 'Montserrat_700Bold',
  },
  recapLabel: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },
});
