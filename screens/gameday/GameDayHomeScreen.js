import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import {
  Sun,
  Users,
  Navigation,
  ParkingCircle,
  Star,
  Utensils,
  Trophy,
  Home,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Thermometer,
  Clock,
  Car,
  MapPin,
  Footprints,
  Eye,
  AlertTriangle,
  Route,
  Zap,
  Shield,
  Camera,
  Ticket,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import AppBackground from '../../components/chrome/AppBackground';

const { width, height } = Dimensions.get('window');

const JOURNEY_PHASES = [
  { id: 'morning', label: 'WAKE UP', icon: Sun, skippable: false },
  { id: 'tailgate', label: 'TAILGATE', icon: Users, skippable: true },
  { id: 'travel', label: 'TRAVEL', icon: Navigation, skippable: false },
  { id: 'parking', label: 'PARKING', icon: ParkingCircle, skippable: false },
  { id: 'pregame', label: 'PRE-GAME', icon: Star, skippable: true },
  { id: 'ingame', label: 'IN-GAME', icon: Utensils, skippable: false },
  { id: 'postgame', label: 'POST-GAME', icon: Trophy, skippable: false },
  { id: 'home', label: 'HOME', icon: Home, skippable: false },
];

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

  const currentPhaseIndex = JOURNEY_PHASES.findIndex(p => p.id === gameDayPhase);
  const currentPhaseData = JOURNEY_PHASES[currentPhaseIndex];
  const nextPhaseData = currentPhaseIndex < JOURNEY_PHASES.length - 1
    ? JOURNEY_PHASES[currentPhaseIndex + 1]
    : null;

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
    handleStartWalkAssist();
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
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    navigation.navigate('Dashboard');
  };

  // Get next phase label for CTA button
  const getNextPhaseLabel = () => {
    if (gameDayPhase === 'parking' && parkingAssistSession.status === 'complete') {
      return 'ENTRY PASS';
    }

    if (!nextPhaseData) return 'FINISH';
    return nextPhaseData.label;
  };

  const getPhaseNarrative = () => {
    switch (gameDayPhase) {
      case 'morning':
        return 'Set timing, weather, and the first departure decision before the day compresses.';
      case 'tailgate':
        return 'Keep the crew coordinated without losing the path back to kickoff logistics.';
      case 'travel':
        return 'Arrival matters more than browsing. Route clarity should stay front and center.';
      case 'parking':
        if (parkingAssistSession.status === 'complete') {
          return 'Parking is locked in. Bring the pass forward now so entry feels calm instead of rushed.';
        }
        return 'Finish the lot arrival first. The journey should not move ahead until the car is settled.';
      case 'pregame':
        return walkAssistSession.status === 'complete'
          ? 'You are at the gate. Entry, access, and seat timing should stay direct from here.'
          : 'Keep the approach to entry simple. Relevant access details should come forward at the right moment.';
      case 'ingame':
        return 'The app becomes lighter here. Support stays available without competing with the game.';
      case 'postgame':
        return 'Shift from the final whistle to a clean exit plan without burying the next move.';
      case 'home':
        return 'Close the loop, reset the mode, and leave the experience feeling finished.';
      default:
        return 'Stay focused on the one thing that matters right now.';
    }
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
        label: 'VIEW ENTRY PASS',
        onPress: handleOpenTicketOverlay,
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

  const phaseNarrative = getPhaseNarrative();
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
              vs {currentGame?.opponent || 'Ohio State'}
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.journeyStatusCard}>
          <View style={styles.journeyStatusTopRow}>
            <Text style={styles.journeyStatusEyebrow}>Journey Status</Text>
            <Text style={styles.journeyStatusProgress}>
              {currentPhaseIndex + 1} of {JOURNEY_PHASES.length}
            </Text>
          </View>
          <View style={styles.journeyStatusMainRow}>
            <View style={styles.journeyStatusBlock}>
              <Text style={styles.journeyStatusLabel}>Now</Text>
              <Text style={styles.journeyStatusValue}>{currentPhaseData.label}</Text>
            </View>
            <View style={styles.journeyStatusDivider} />
            <View style={styles.journeyStatusBlock}>
              <Text style={styles.journeyStatusLabel}>Up Next</Text>
              <Text style={styles.journeyStatusValue}>
                {gameDayPhase === 'parking' && parkingAssistSession.status === 'complete'
                  ? 'ENTRY PASS'
                  : (nextPhaseData?.label || 'WRAP')}
              </Text>
            </View>
          </View>
          <View style={styles.journeyProgressTrack}>
            <View
              style={[
                styles.journeyProgressFill,
                { width: `${((currentPhaseIndex + 1) / JOURNEY_PHASES.length) * 100}%` },
              ]}
            />
          </View>
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
                <Text style={styles.phaseCardSubtitle}>{phaseNarrative}</Text>
              </View>
            </View>

            {/* Context-Aware Content */}
            <View style={styles.phaseCardBody}>
              {renderPhaseContent(gameDayPhase, user, currentGame, navigation, handleOpenTicketOverlay)}
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
        <View style={styles.ticketOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={handleDismissTicketOverlay}
          />
          <View style={styles.ticketOverlayInner}>
            <View style={styles.walletPass}>
              <LinearGradient
                colors={[COLORS.blue, 'rgba(0,39,76,0.95)', 'rgba(4,12,23,0.98)']}
                locations={[0, 0.62, 1]}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.walletPassAccent} />

              <View style={styles.walletPassHeader}>
                <View>
                  <Text style={styles.walletPassEyebrow}>ENTRY PASS</Text>
                  <Text style={styles.walletPassTitle}>Seat Command</Text>
                </View>
                <View style={styles.walletPassBadge}>
                  <Ticket size={14} color={COLORS.blue} />
                  <Text style={styles.walletPassBadgeText}>READY</Text>
                </View>
              </View>

              <View style={styles.walletMetaRow}>
                <View style={styles.walletMetaChip}>
                  <Shield size={12} color={COLORS.maize} />
                  <Text style={styles.walletMetaChipText}>Gate 4</Text>
                </View>
                <View style={styles.walletMetaChip}>
                  <MapPin size={12} color={COLORS.maize} />
                  <Text style={styles.walletMetaChipText}>Sec {user.seat.section}</Text>
                </View>
                <View style={styles.walletMetaChip}>
                  <Clock size={12} color={COLORS.maize} />
                  <Text style={styles.walletMetaChipText}>{currentGame?.time || '12:00 PM'}</Text>
                </View>
              </View>

              <View style={styles.walletSeatRow}>
                <View style={styles.walletSeatBlock}>
                  <Text style={styles.walletSeatLabel}>SECTION</Text>
                  <Text style={styles.walletSeatValue}>{user.seat.section}</Text>
                </View>
                <View style={styles.walletSeatDivider} />
                <View style={styles.walletSeatBlock}>
                  <Text style={styles.walletSeatLabel}>ROW</Text>
                  <Text style={styles.walletSeatValue}>{user.seat.row}</Text>
                </View>
                <View style={styles.walletSeatDivider} />
                <View style={styles.walletSeatBlock}>
                  <Text style={styles.walletSeatLabel}>SEAT</Text>
                  <Text style={styles.walletSeatValue}>{user.seat.seat}</Text>
                </View>
              </View>

              <View style={styles.walletBarcodeArea}>
                <View style={styles.walletBarcodeBars}>
                  {Array.from({ length: 28 }).map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.walletBarcodeBar,
                        { height: index % 4 === 0 ? 30 : index % 3 === 0 ? 22 : 26 },
                      ]}
                    />
                  ))}
                </View>
                <Text style={styles.walletBarcodeCaption}>Keep this visible before you move into the entry lane.</Text>
              </View>
            </View>

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
              <Text style={styles.ticketOverlayPrimaryText}>Continue to Walk Assist</Text>
              <ChevronRight size={18} color={COLORS.blue} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.ticketOverlaySecondaryButton}
              activeOpacity={0.88}
              onPress={handleDismissTicketOverlay}
            >
              <Text style={styles.ticketOverlaySecondaryText}>Dismiss</Text>
            </TouchableOpacity>
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
function renderPhaseContent(phase, user, currentGame, navigation, openTicketOverlay) {
  switch (phase) {
    case 'morning':
      return <MorningContent user={user} currentGame={currentGame} />;
    case 'tailgate':
      return <TailgateContent user={user} />;
    case 'travel':
      return <TravelContent user={user} />;
    case 'parking':
      return <ParkingContent user={user} navigation={navigation} openTicketOverlay={openTicketOverlay} />;
    case 'pregame':
      return <PregameContent user={user} currentGame={currentGame} />;
    case 'ingame':
      return <IngameContent user={user} currentGame={currentGame} />;
    case 'postgame':
      return <PostgameContent currentGame={currentGame} />;
    case 'home':
      return <HomeContent user={user} />;
    default:
      return null;
  }
}

/* ========================================
   PHASE CONTENT COMPONENTS
   ======================================== */

function MorningContent({ user, currentGame }) {
  return (
    <View style={phaseStyles.content}>
      {/* Weather Block */}
      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Cloud size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>WEATHER AT KICKOFF</Text>
        </View>
        <View style={phaseStyles.weatherRow}>
          <Text style={phaseStyles.weatherTemp}>52°</Text>
          <View style={phaseStyles.weatherDetails}>
            <View style={phaseStyles.weatherDetailItem}>
              <Thermometer size={14} color={COLORS.textTertiary} />
              <Text style={phaseStyles.weatherDetailText}>Feels 48°</Text>
            </View>
            <Text style={phaseStyles.weatherCondition}>Partly Cloudy</Text>
            <Text style={phaseStyles.weatherAdvice}>
              Bring a light jacket
            </Text>
          </View>
        </View>
      </View>

      <View style={phaseStyles.divider} />

      {/* ETA Block */}
      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Car size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>DRIVE TO STADIUM</Text>
        </View>
        <View style={phaseStyles.etaRow}>
          <View style={phaseStyles.etaStat}>
            <Text style={phaseStyles.etaValue}>12</Text>
            <Text style={phaseStyles.etaUnit}>min</Text>
          </View>
          <View style={phaseStyles.etaDivider} />
          <View style={phaseStyles.etaStat}>
            <Text style={phaseStyles.etaValue}>2.4</Text>
            <Text style={phaseStyles.etaUnit}>miles</Text>
          </View>
          <View style={phaseStyles.etaDivider} />
          <View style={phaseStyles.etaStat}>
            <Text style={[phaseStyles.etaValue, { color: COLORS.waveFieldGreen }]}>Low</Text>
            <Text style={phaseStyles.etaUnit}>traffic</Text>
          </View>
        </View>
      </View>

      <View style={phaseStyles.divider} />

      {/* Today's Schedule */}
      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Clock size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>TODAY'S TIMELINE</Text>
        </View>
        {[
          { time: '9:30 AM', event: 'Tailgate starts', past: false },
          { time: '11:00 AM', event: 'Head to stadium', past: false },
          { time: '11:30 AM', event: 'Gates open', past: false },
          { time: '12:00 PM', event: 'KICKOFF', highlight: true },
        ].map((item, i) => (
          <View key={i} style={phaseStyles.scheduleRow}>
            <Text style={phaseStyles.scheduleTime}>{item.time}</Text>
            <Text
              style={[
                phaseStyles.scheduleEvent,
                item.highlight && { color: COLORS.maize, fontFamily: 'Montserrat_700Bold' },
              ]}
            >
              {item.event}
            </Text>
          </View>
        ))}
      </View>

      {/* Matchup */}
      <View style={phaseStyles.matchupBanner}>
        <Text style={phaseStyles.matchupTeam}>MICHIGAN</Text>
        <Text style={phaseStyles.matchupVs}>vs</Text>
        <Text style={phaseStyles.matchupTeam}>
          {(currentGame?.opponent || 'OHIO STATE').toUpperCase()}
        </Text>
      </View>
    </View>
  );
}

function TailgateContent({ user }) {
  const crew = [
    { name: 'Mike R.', status: 'arrived', avatar: 'M' },
    { name: 'Sarah T.', status: 'on the way', avatar: 'S' },
    { name: 'James L.', status: 'arrived', avatar: 'J' },
    { name: 'Emma K.', status: 'arriving soon', avatar: 'E' },
  ];

  return (
    <View style={phaseStyles.content}>
      {/* Location */}
      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <MapPin size={18} color={COLORS.maize} />
          <Text style={phaseStyles.infoBlockTitle}>YOUR TAILGATE SPOT</Text>
        </View>
        <Text style={phaseStyles.locationName}>Pioneer High Lot</Text>
        <Text style={phaseStyles.locationAddress}>601 W Stadium Blvd</Text>
        <View style={phaseStyles.locationMeta}>
          <Clock size={14} color={COLORS.textTertiary} />
          <Text style={phaseStyles.locationMetaText}>Here since 9:30 AM</Text>
        </View>
      </View>

      <View style={phaseStyles.divider} />

      {/* Crew */}
      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Users size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>YOUR CREW</Text>
        </View>
        {crew.map((person, i) => (
          <View key={i} style={phaseStyles.crewRow}>
            <View style={phaseStyles.crewAvatar}>
              <Text style={phaseStyles.crewAvatarText}>{person.avatar}</Text>
            </View>
            <Text style={phaseStyles.crewName}>{person.name}</Text>
            <Text
              style={[
                phaseStyles.crewStatus,
                person.status === 'arrived' && { color: COLORS.waveFieldGreen },
              ]}
            >
              {person.status}
            </Text>
          </View>
        ))}
      </View>

      <View style={phaseStyles.divider} />

      {/* Time to departure */}
      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Navigation size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>HEAD TO STADIUM IN</Text>
        </View>
        <View style={phaseStyles.countdownRow}>
          <View style={phaseStyles.countdownBlock}>
            <Text style={phaseStyles.countdownValue}>1</Text>
            <Text style={phaseStyles.countdownUnit}>HR</Text>
          </View>
          <View style={phaseStyles.countdownBlock}>
            <Text style={phaseStyles.countdownValue}>30</Text>
            <Text style={phaseStyles.countdownUnit}>MIN</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function TravelContent({ user }) {
  return (
    <View style={phaseStyles.content}>
      {/* Big ETA */}
      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Navigation size={18} color={COLORS.maize} />
          <Text style={phaseStyles.infoBlockTitle}>ESTIMATED ARRIVAL</Text>
        </View>
        <Text style={phaseStyles.bigTime}>11:24 AM</Text>
        <View style={phaseStyles.etaRow}>
          <View style={phaseStyles.etaStat}>
            <Route size={16} color={COLORS.textSecondary} />
            <Text style={phaseStyles.etaStatText}>2.4 mi</Text>
          </View>
          <View style={phaseStyles.etaDivider} />
          <View style={phaseStyles.etaStat}>
            <Clock size={16} color={COLORS.textSecondary} />
            <Text style={phaseStyles.etaStatText}>12 min</Text>
          </View>
          <View style={phaseStyles.etaDivider} />
          <View style={phaseStyles.etaStat}>
            <Car size={16} color={COLORS.textSecondary} />
            <Text style={phaseStyles.etaStatText}>Stadium Blvd</Text>
          </View>
        </View>
      </View>

      <View style={phaseStyles.divider} />

      {/* Traffic Alert */}
      <View style={phaseStyles.alertBlock}>
        <View style={phaseStyles.alertIcon}>
          <AlertTriangle size={18} color={COLORS.rossOrange} />
        </View>
        <View style={phaseStyles.alertText}>
          <Text style={phaseStyles.alertTitle}>Moderate Traffic</Text>
          <Text style={phaseStyles.alertDesc}>
            Expect delays near Main St intersection
          </Text>
        </View>
      </View>

      <View style={phaseStyles.divider} />

      {/* Route */}
      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Route size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>ROUTE</Text>
        </View>
        <View style={phaseStyles.routePoints}>
          <View style={phaseStyles.routePoint}>
            <View style={phaseStyles.routeDotStart} />
            <Text style={phaseStyles.routePointText}>Pioneer High Lot</Text>
          </View>
          <View style={phaseStyles.routeLine} />
          <View style={phaseStyles.routePoint}>
            <View style={phaseStyles.routeDotEnd} />
            <Text style={phaseStyles.routePointText}>
              {user.parking.lot} — Spot {user.parking.spot}
            </Text>
          </View>
        </View>
      </View>

      {/* Destination */}
      <View style={phaseStyles.destinationCard}>
        <ParkingCircle size={24} color={COLORS.maize} />
        <View style={{ flex: 1 }}>
          <Text style={phaseStyles.destinationTitle}>{user.parking.lot}</Text>
          <Text style={phaseStyles.destinationSub}>Spot {user.parking.spot}</Text>
        </View>
      </View>
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

function ParkingContent({ user, navigation, openTicketOverlay }) {
  const {
    parkingAssistSession,
    openParkingAssist,
    walkAssistSession,
    openWalkAssist,
  } = useApp();

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
      {/* Spot Hero */}
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

      {/* AR Assistant Actions */}
      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Camera size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>LIVE CAMERA ASSISTANCE</Text>
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

      {/* Parking Lot Map — Bird's Eye View */}
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

      <View style={phaseStyles.divider} />

      {parkingAssistSession.status === 'complete' && walkAssistSession.status !== 'complete' ? (
        <>
          <View style={phaseStyles.infoBlock}>
            <View style={phaseStyles.infoBlockHeader}>
              <Ticket size={18} color={COLORS.maize} />
              <Text style={phaseStyles.infoBlockTitle}>ENTRY PASS</Text>
            </View>
            <View style={phaseStyles.entryPassCard}>
              <Text style={phaseStyles.entryPassTitle}>Bring your pass forward before the walk.</Text>
              <Text style={phaseStyles.entryPassBody}>
                Your ticket is staged for Gate 4. Review it here, then move into the live walk assist when you are ready.
              </Text>
              <TouchableOpacity
                style={phaseStyles.entryPassButton}
                activeOpacity={0.88}
                onPress={openTicketOverlay}
              >
                <Text style={phaseStyles.entryPassButtonText}>View Entry Pass</Text>
                <ChevronRight size={16} color={COLORS.maize} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={phaseStyles.divider} />
        </>
      ) : null}

      {/* Walk to Stadium */}
      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Footprints size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>WALK TO STADIUM</Text>
        </View>
        <View style={phaseStyles.walkStats}>
          <View style={phaseStyles.walkStatItem}>
            <Text style={phaseStyles.walkStatValue}>8</Text>
            <Text style={phaseStyles.walkStatUnit}>min walk</Text>
          </View>
          <View style={phaseStyles.etaDivider} />
          <View style={phaseStyles.walkStatItem}>
            <Text style={phaseStyles.walkStatValue}>0.4</Text>
            <Text style={phaseStyles.walkStatUnit}>miles</Text>
          </View>
          <View style={phaseStyles.etaDivider} />
          <View style={phaseStyles.walkStatItem}>
            <Text style={phaseStyles.walkStatValue}>Gate 4</Text>
            <Text style={phaseStyles.walkStatUnit}>entry</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function PregameContent({ user, currentGame }) {
  const { walkAssistSession } = useApp();

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
            You are at the gate. Keep your pass visible and move through the premium entry lane.
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
              <Text style={phaseStyles.walkStatValue}>24</Text>
              <Text style={phaseStyles.walkStatUnit}>section</Text>
            </View>
            <View style={phaseStyles.etaDivider} />
            <View style={phaseStyles.walkStatItem}>
              <Text style={phaseStyles.walkStatValue}>32</Text>
              <Text style={phaseStyles.walkStatUnit}>min to kick</Text>
            </View>
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
          <Star size={18} color={COLORS.maize} />
          <Text style={phaseStyles.infoBlockTitle}>FIELD EXPERIENCE</Text>
        </View>
        <Text style={phaseStyles.bigText}>Sideline Access</Text>
        <Text style={phaseStyles.subtitleText}>
          Your VIP pass grants you tunnel-view warmup access.
        </Text>
      </View>

      <View style={phaseStyles.divider} />

      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Clock size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>TIME TO KICKOFF</Text>
        </View>
        <View style={phaseStyles.countdownRow}>
          <View style={phaseStyles.countdownBlock}>
            <Text style={phaseStyles.countdownValue}>0</Text>
            <Text style={phaseStyles.countdownUnit}>HR</Text>
          </View>
          <View style={phaseStyles.countdownBlock}>
            <Text style={phaseStyles.countdownValue}>32</Text>
            <Text style={phaseStyles.countdownUnit}>MIN</Text>
          </View>
        </View>
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

function IngameContent({ user, currentGame }) {
  return (
    <View style={phaseStyles.content}>
      {/* Scoreboard */}
      <View style={phaseStyles.scoreboard}>
        <View style={phaseStyles.scoreTeam}>
          <Text style={phaseStyles.scoreTeamName}>MICH</Text>
          <Text style={phaseStyles.scoreValue}>21</Text>
        </View>
        <View style={phaseStyles.scoreMid}>
          <Text style={phaseStyles.scoreQuarter}>Q3</Text>
          <Text style={phaseStyles.scoreTime}>8:42</Text>
        </View>
        <View style={phaseStyles.scoreTeam}>
          <Text style={phaseStyles.scoreTeamName}>
            {(currentGame?.opponent || 'OSU').substring(0, 4).toUpperCase()}
          </Text>
          <Text style={phaseStyles.scoreValue}>14</Text>
        </View>
      </View>

      <View style={phaseStyles.divider} />

      {/* Quick Actions */}
      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Utensils size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>QUICK ACTIONS</Text>
        </View>
        <View style={phaseStyles.quickActionsGrid}>
          {[
            { icon: Utensils, label: 'Order Food' },
            { icon: Navigation, label: 'Restrooms' },
            { icon: Star, label: 'Replay' },
            { icon: Users, label: 'Find Friends' },
          ].map((action, i) => (
            <TouchableOpacity key={i} style={phaseStyles.quickActionItem}>
              <action.icon size={22} color={COLORS.maize} />
              <Text style={phaseStyles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={phaseStyles.divider} />

      {/* Seat Info */}
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
  );
}

function PostgameContent({ currentGame }) {
  return (
    <View style={phaseStyles.content}>
      {/* Final Score */}
      <View style={phaseStyles.scoreboard}>
        <View style={phaseStyles.scoreTeam}>
          <Text style={phaseStyles.scoreTeamName}>MICH</Text>
          <Text style={[phaseStyles.scoreValue, { color: COLORS.maize }]}>35</Text>
        </View>
        <View style={phaseStyles.scoreMid}>
          <Text style={phaseStyles.scoreQuarter}>FINAL</Text>
          <Trophy size={24} color={COLORS.maize} />
        </View>
        <View style={phaseStyles.scoreTeam}>
          <Text style={phaseStyles.scoreTeamName}>
            {(currentGame?.opponent || 'OSU').substring(0, 4).toUpperCase()}
          </Text>
          <Text style={phaseStyles.scoreValue}>21</Text>
        </View>
      </View>

      <View style={phaseStyles.matchupBanner}>
        <Text style={[phaseStyles.matchupTeam, { color: COLORS.maize }]}>
          WOLVERINES WIN!
        </Text>
      </View>

      <View style={phaseStyles.divider} />

      {/* Traffic */}
      <View style={phaseStyles.alertBlock}>
        <View style={phaseStyles.alertIcon}>
          <AlertTriangle size={18} color={COLORS.rossOrange} />
        </View>
        <View style={phaseStyles.alertText}>
          <Text style={phaseStyles.alertTitle}>Heavy Traffic</Text>
          <Text style={phaseStyles.alertDesc}>
            Wait 20–30 min for best exit routes
          </Text>
        </View>
      </View>

      <View style={phaseStyles.divider} />

      {/* Getting to Car */}
      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Footprints size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>BACK TO YOUR CAR</Text>
        </View>
        <View style={phaseStyles.walkStats}>
          <View style={phaseStyles.walkStatItem}>
            <Text style={phaseStyles.walkStatValue}>8</Text>
            <Text style={phaseStyles.walkStatUnit}>min walk</Text>
          </View>
          <View style={phaseStyles.etaDivider} />
          <View style={phaseStyles.walkStatItem}>
            <Text style={phaseStyles.walkStatValue}>Gate 4</Text>
            <Text style={phaseStyles.walkStatUnit}>exit via</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function HomeContent({ user }) {
  return (
    <View style={phaseStyles.content}>
      <View style={phaseStyles.infoBlock}>
        <View style={{ alignItems: 'center', paddingVertical: SPACING.l }}>
          <Home size={48} color={COLORS.maize} />
          <Text style={[phaseStyles.bigText, { textAlign: 'center', marginTop: SPACING.m }]}>
            Safe Travels, {user.name}!
          </Text>
          <Text style={[phaseStyles.subtitleText, { textAlign: 'center' }]}>
            Thank you for being a 12-year legacy holder.
          </Text>
        </View>
      </View>

      <View style={phaseStyles.divider} />

      {/* Drive Home */}
      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Navigation size={18} color={COLORS.textSecondary} />
          <Text style={phaseStyles.infoBlockTitle}>DRIVE HOME</Text>
        </View>
        <View style={phaseStyles.etaRow}>
          <View style={phaseStyles.etaStat}>
            <Text style={phaseStyles.etaValue}>~45</Text>
            <Text style={phaseStyles.etaUnit}>min</Text>
          </View>
          <View style={phaseStyles.etaDivider} />
          <View style={phaseStyles.etaStat}>
            <Text style={[phaseStyles.etaValue, { color: COLORS.rossOrange }]}>Heavy</Text>
            <Text style={phaseStyles.etaUnit}>traffic</Text>
          </View>
        </View>
      </View>

      <View style={phaseStyles.divider} />

      {/* Today's Recap */}
      <View style={phaseStyles.infoBlock}>
        <View style={phaseStyles.infoBlockHeader}>
          <Trophy size={18} color={COLORS.maize} />
          <Text style={phaseStyles.infoBlockTitle}>TODAY'S JOURNEY</Text>
        </View>
        <View style={phaseStyles.recapRow}>
          <View style={phaseStyles.recapItem}>
            <Text style={phaseStyles.recapValue}>4h 32m</Text>
            <Text style={phaseStyles.recapLabel}>at stadium</Text>
          </View>
          <View style={phaseStyles.recapItem}>
            <Text style={phaseStyles.recapValue}>8,432</Text>
            <Text style={phaseStyles.recapLabel}>steps</Text>
          </View>
          <View style={phaseStyles.recapItem}>
            <Text style={phaseStyles.recapValue}>W</Text>
            <Text style={phaseStyles.recapLabel}>result</Text>
          </View>
        </View>
      </View>
    </View>
  );
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

  journeyStatusCard: {
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.s,
    marginBottom: SPACING.xs,
  },
  journeyStatusTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  journeyStatusEyebrow: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1.2,
  },
  journeyStatusProgress: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
  },
  journeyStatusMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
    marginBottom: SPACING.s,
  },
  journeyStatusBlock: {
    flex: 1,
  },
  journeyStatusLabel: {
    color: COLORS.textTertiary,
    fontSize: 10,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  journeyStatusValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.4,
  },
  journeyStatusDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  journeyProgressTrack: {
    height: 4,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  journeyProgressFill: {
    height: '100%',
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.maize,
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
    marginBottom: 6,
  },
  phaseCardSubtitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 20,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
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
  ticketOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.94)',
  },
  ticketOverlayInner: {
    width: Math.min(width - SPACING.xl * 2, 380),
    alignItems: 'stretch',
  },
  walletPass: {
    overflow: 'hidden',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: SPACING.l,
    marginBottom: SPACING.m,
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
    minHeight: 56,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: SPACING.s,
  },
  ticketOverlayPrimaryText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.6,
  },
  ticketOverlaySecondaryButton: {
    minHeight: 48,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  ticketOverlaySecondaryText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 0.4,
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
