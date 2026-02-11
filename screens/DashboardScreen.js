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
  ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS, CHROME } from '../constants/theme';
import AppBackground from '../components/chrome/AppBackground';
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
  Shield,
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

const MATCHUP_GRAPHIC_BG = require('../assets/content_images/matchup_bg.jpeg');
const FRESNO_LOGO = require('../assets/fresno_logo.png');

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
  const { user, schedule, currentGame, nextGame, isGameDay, gameDayPhase, enterGameDay } = useApp();

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

  const opsContext = useMemo(() => {
    const hoursToKickoff = (gameDate.getTime() - Date.now()) / (1000 * 60 * 60);
    let stage = 'season';

    if (isGameDay) {
      stage = gameDayPhase || 'morning';
    } else if (hoursToKickoff <= 7 && hoursToKickoff > 1.5) {
      stage = 'travel';
    } else if (hoursToKickoff <= 1.5 && hoursToKickoff > 0.5) {
      stage = 'parking';
    } else if (hoursToKickoff <= 0.5 && hoursToKickoff > 0) {
      stage = 'pregame';
    } else if (hoursToKickoff <= 0 && hoursToKickoff > -3.5) {
      stage = 'ingame';
    } else if (hoursToKickoff <= -3.5 && hoursToKickoff > -7) {
      stage = 'postgame';
    } else if (daysToGame <= 7) {
      stage = 'morning';
    }

    const contextByStage = {
      season: {
        label: 'Season Planning',
        priority: 'Keep logistics synced for the next home matchup.',
      },
      morning: {
        label: 'Game Week Prep',
        priority: 'Confirm permits, weather plan, and arrival window.',
      },
      tailgate: {
        label: 'Tailgate Window',
        priority: 'Align host timing and guest handoff details.',
      },
      travel: {
        label: 'Travel Window',
        priority: 'Optimize ETA and avoid route congestion.',
      },
      parking: {
        label: 'Parking Priority',
        priority: 'Guide arrival to the assigned lot and spot.',
      },
      pregame: {
        label: 'Entry Priority',
        priority: 'Move through the fastest gate lane to seats.',
      },
      ingame: {
        label: 'In-Seat Support',
        priority: 'Manage comfort, service, and live access windows.',
      },
      postgame: {
        label: 'Exit Routing',
        priority: 'Clear stadium and lot with minimal delays.',
      },
      home: {
        label: 'Postgame Wrap',
        priority: 'Log the day and prep the next game plan.',
      },
    };

    return { stage, ...(contextByStage[stage] || contextByStage.season) };
  }, [gameDate, isGameDay, gameDayPhase, daysToGame]);

  const liveOps = useMemo(() => {
    const lot = user?.parking?.lot || 'Gold Lot A';
    const spot = user?.parking?.spot || 'G-142';
    const section = user?.seat?.section || '24';
    const row = user?.seat?.row || '10';
    const opponent = featuredGame?.opponent || 'Opponent';

    const snapshots = {
      season: {
        parking: { value: `${lot} reserved`, detail: `Season permit active • Spot ${spot}` },
        gate: { value: 'Credentials synced', detail: `VIP entry profile is ready for ${opponent}.` },
        weather: { value: 'Monitoring', detail: 'Forecast watch starts automatically during game week.' },
        walk: { value: `Sec ${section}, Row ${row}`, detail: 'Seat route saved and ready to launch.' },
      },
      morning: {
        parking: { value: `${lot} confirmed`, detail: `Arrival window set • Spot ${spot}` },
        gate: { value: 'Gate model pending', detail: 'Fast-lane prediction unlocks 24h before kickoff.' },
        weather: { value: 'Low risk', detail: 'Pack a light layer for late wind shift.' },
        walk: { value: 'Route preview', detail: `Primary path loaded for Section ${section}.` },
      },
      tailgate: {
        parking: { value: `${lot} staging`, detail: `Host team monitoring entry to Spot ${spot}` },
        gate: { value: 'Hospitality check', detail: 'Guest list synced with premium gate staff.' },
        weather: { value: 'Comfortable', detail: 'No rain expected during tailgate window.' },
        walk: { value: 'Concourse timing', detail: 'Route to suite recalculated every 5 minutes.' },
      },
      travel: {
        parking: { value: `${lot} • ${spot}`, detail: 'Navigation optimized to current traffic flow.' },
        gate: { value: 'Gate 40 ETA 9m', detail: 'South premium lane trending fastest right now.' },
        weather: { value: '52°F • clear', detail: 'Stable conditions from arrival through kickoff.' },
        walk: { value: '8 min walk', detail: `Recommended path to Section ${section} is clear.` },
      },
      parking: {
        parking: { value: 'Lot arrival active', detail: `${lot} entry open • proceed to Spot ${spot}` },
        gate: { value: 'Gate 40 ready', detail: 'Host greeting desk has your arrival alert.' },
        weather: { value: '51°F • breeze', detail: 'Concourses are open if wind picks up.' },
        walk: { value: '6 min to gate', detail: 'Blue route has lowest pedestrian load.' },
      },
      pregame: {
        parking: { value: 'Vehicle secured', detail: `${lot} monitored • valet support available` },
        gate: { value: 'Gate 40 • 5 min', detail: 'Premium lane currently moving without wait.' },
        weather: { value: '50°F • clear', detail: 'No weather alerts before kickoff.' },
        walk: { value: 'Seat route live', detail: `Best path to Section ${section} via east concourse.` },
      },
      ingame: {
        parking: { value: 'Postgame route saved', detail: `Exit pattern preloaded for ${lot}` },
        gate: { value: 'Re-entry active', detail: 'Suite and concourse access remain open.' },
        weather: { value: '49°F • steady', detail: 'No weather impact expected through final whistle.' },
        walk: { value: 'Concourse low traffic', detail: 'In-seat service path currently clear.' },
      },
      postgame: {
        parking: { value: 'Exit lane open', detail: `${lot} egress moving at low delay` },
        gate: { value: 'Gate 40 outbound', detail: 'Premium corridor is fastest for departure.' },
        weather: { value: '47°F • clear', detail: 'Dry conditions for walk back to parking.' },
        walk: { value: '5 min to vehicle', detail: `Staff escort available to Spot ${spot}.` },
      },
      home: {
        parking: { value: 'Trip complete', detail: 'Parking and travel logs archived for this game.' },
        gate: { value: 'Session closed', detail: 'Entry and hospitality timeline captured.' },
        weather: { value: 'Archive synced', detail: 'Game-day weather notes added to your profile.' },
        walk: { value: 'Next route pending', detail: `Section ${section} route will refresh next matchup.` },
      },
    };

    const stageSnapshot = snapshots[opsContext.stage] || snapshots.season;

    return [
      {
        id: 'parking',
        icon: MapPin,
        title: 'Parking',
        value: stageSnapshot.parking.value,
        detail: stageSnapshot.parking.detail,
      },
      {
        id: 'gate',
        icon: Clock,
        title: 'Entry Gates',
        value: stageSnapshot.gate.value,
        detail: stageSnapshot.gate.detail,
      },
      {
        id: 'weather',
        icon: Cloud,
        title: 'Weather',
        value: stageSnapshot.weather.value,
        detail: stageSnapshot.weather.detail,
      },
      {
        id: 'walk',
        icon: Route,
        title: 'Seat Route',
        value: stageSnapshot.walk.value,
        detail: stageSnapshot.walk.detail,
      },
    ];
  }, [user, featuredGame?.opponent, opsContext.stage]);

  const parkingInfo = useMemo(() => {
    const lot = user?.parking?.lot || 'Gold Lot A';
    const spot = user?.parking?.spot || 'G-142';
    const row = spot.includes('-') ? spot.split('-')[0] : spot.charAt(0) || 'G';
    const gameWindow = isGameDay || daysToGame <= 1;

    return {
      lot,
      row,
      spot,
      permitId: `VIP-${row}-24`,
      arrivalWindow: featuredGame.time ? `Arrive by ${featuredGame.time}` : 'Arrive 90m before kickoff',
      attendant: gameWindow ? 'A. Thompson (Lot Host)' : 'Lot host assigned 24h before kickoff',
    };
  }, [user, isGameDay, daysToGame, featuredGame.time]);

  const gateHandoff = useMemo(() => {
    const gameWindow = isGameDay || daysToGame <= 1;
    return {
      gate: featuredGame.isHome ? 'Gate 40' : 'Visitor Premium Gate',
      host: gameWindow ? 'Dana - Premium Entry Team' : 'Entry host assigned game morning',
      routeHint: `From ${parkingInfo.lot}, follow Blue Route to VIP lane`,
      welcomeKit: gameWindow ? 'Welcome bag pickup active at gate desk' : 'Welcome bag queued for game day',
      eta: '7 min from your spot',
    };
  }, [featuredGame.isHome, parkingInfo.lot, isGameDay, daysToGame]);

  const journeyPlan = useMemo(() => {
    const minutesToKickoff = Math.round((gameDate.getTime() - Date.now()) / 60000);
    const steps = [
      { id: 'wake', time: '08:00', title: 'Wake-up briefing', detail: 'Weather, attire, and departure check' },
      { id: 'travel', time: '09:45', title: 'Travel window', detail: 'Best route and congestion watch' },
      { id: 'park', time: '10:40', title: 'Reserved parking', detail: `${parkingInfo.lot} • Spot ${parkingInfo.spot}` },
      { id: 'gate', time: '11:00', title: 'Gate handoff', detail: `${gateHandoff.gate} host greeting` },
      { id: 'field', time: '11:20', title: 'Field access', detail: 'Premium sideline pass window' },
    ];

    const thresholds = [360, 240, 140, 75, 40];
    const planningMode = !isGameDay && daysToGame > 1;
    let currentIndex = -1;

    if (!planningMode) {
      currentIndex = thresholds.findIndex((threshold, index) => {
        const nextThreshold = thresholds[index + 1] ?? -100000;
        return minutesToKickoff <= threshold && minutesToKickoff > nextThreshold;
      });

      if (currentIndex === -1) {
        currentIndex = minutesToKickoff > thresholds[0] ? 0 : steps.length - 1;
      }
    }

    return {
      planningMode,
      steps: steps.map((step, index) => {
        let status = 'upcoming';
        if (!planningMode) {
          if (index < currentIndex) status = 'done';
          if (index === currentIndex) status = 'current';
        }
        return { ...step, status };
      }),
    };
  }, [gameDate, parkingInfo.lot, parkingInfo.spot, gateHandoff.gate, isGameDay, daysToGame]);

  const matchupLabel = currentGame ? "TODAY'S MATCHUP" : 'NEXT MATCHUP';
  const countdownChipText =
    countdown.totalMs > 0
      ? `Kickoff in ${countdown.days}d ${countdown.hours}h ${countdown.mins}m`
      : 'Kickoff window is active';
  const modeCtaText = 'Enter Game Day';
  const launchJourneyWithIntent = (intent = 'journey') => {
    enterGameDay({ intent });
    navigation.navigate('GameDayHome');
  };
  const openLiveOpsDetail = (opId) => {
    navigation.navigate('LiveOpsDetail', {
      opId,
      stage: opsContext.stage,
      opponent: featuredGame.opponent,
      kickoff: featuredGame.time,
      isHome: featuredGame.isHome,
    });
  };

  const handlePrimaryModeAction = () => {
    launchJourneyWithIntent('journey');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <AppBackground variant="home" />

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

          <ImageBackground
            source={MATCHUP_GRAPHIC_BG}
            resizeMode="cover"
            style={styles.heroCard}
            imageStyle={styles.heroCardImageAsset}
          >
            <LinearGradient
              colors={['rgba(255,203,5,0.08)', 'rgba(255,203,5,0.015)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <LinearGradient
              colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.96)']}
              locations={[0, 0.56, 1]}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.heroTopRow}>
              <View style={styles.heroTag}>
                <Text style={styles.heroTagText}>{matchupLabel}</Text>
              </View>
              <Text style={styles.heroOpponentText}>vs {featuredGame.opponent}</Text>
            </View>

            <View style={styles.matchupGraphic}>
              <View style={styles.teamColumn}>
                <Image
                  source={require('../assets/M_yellow_logo.png')}
                  style={styles.teamLogo}
                  resizeMode="contain"
                />
                <Text style={styles.teamLabel}>MICHIGAN</Text>
              </View>

              <View style={styles.vsBadge}>
                <Text style={styles.vsText}>VS</Text>
              </View>

              <View style={styles.teamColumn}>
                {featuredGame.opponent === 'Fresno State' ? (
                  <Image
                    source={FRESNO_LOGO}
                    style={styles.opponentLogo}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={[styles.opponentWordmark, { color: opponentBadge.color }]}>
                    {opponentBadge.abbr}
                  </Text>
                )}
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

            <TouchableOpacity style={styles.primaryCta} onPress={handlePrimaryModeAction} activeOpacity={0.9}>
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
          </ImageBackground>

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

          <View style={styles.liveOpsHeader}>
            <Text style={[styles.sectionTitle, styles.liveOpsTitle]}>LIVE OPS</Text>
            <Text style={styles.liveOpsStage}>{opsContext.label}</Text>
          </View>
          <Text style={styles.liveOpsPriority}>{opsContext.priority}</Text>
          <View style={styles.opsGrid}>
            {liveOps.map(item => {
              const Icon = item.icon;
              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.opsCard}
                  activeOpacity={0.9}
                  onPress={() => openLiveOpsDetail(item.id)}
                >
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
                  <View style={styles.opsFooterRow}>
                    <Text style={styles.opsCta}>Open</Text>
                    <ChevronRight size={14} color={COLORS.maize} />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>VIP CONCIERGE</Text>
          <View style={styles.conciergeStack}>
            <View style={styles.conciergeCard}>
              <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.conciergeHeaderRow}>
                <View style={styles.conciergeIconWrap}>
                  <MapPin size={16} color={COLORS.maize} />
                </View>
                <Text style={styles.conciergeTitle}>Parking Concierge</Text>
              </View>

              <View style={styles.conciergeMetaRow}>
                <Text style={styles.conciergeMetaLabel}>LOT</Text>
                <Text style={styles.conciergeMetaValue}>{parkingInfo.lot}</Text>
              </View>
              <View style={styles.conciergeMetaRow}>
                <Text style={styles.conciergeMetaLabel}>SPOT</Text>
                <Text style={styles.conciergeMetaValue}>{parkingInfo.spot}</Text>
              </View>
              <View style={styles.conciergeMetaRow}>
                <Text style={styles.conciergeMetaLabel}>PERMIT</Text>
                <Text style={styles.conciergeMetaValue}>{parkingInfo.permitId}</Text>
              </View>
              <Text style={styles.conciergeHint}>{parkingInfo.arrivalWindow}</Text>
              <Text style={styles.conciergeHint}>{parkingInfo.attendant}</Text>

              <TouchableOpacity
                style={styles.conciergeAction}
                activeOpacity={0.85}
                onPress={() => launchJourneyWithIntent('parking')}
              >
                <Text style={styles.conciergeActionText}>Open Parking Guidance</Text>
                <ChevronRight size={16} color={COLORS.maize} />
              </TouchableOpacity>
            </View>

            <View style={styles.conciergeCard}>
              <BlurView intensity={22} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.conciergeHeaderRow}>
                <View style={styles.conciergeIconWrap}>
                  <Shield size={16} color={COLORS.maize} />
                </View>
                <Text style={styles.conciergeTitle}>Gate Handoff</Text>
              </View>

              <View style={styles.conciergeMetaRow}>
                <Text style={styles.conciergeMetaLabel}>ENTRY</Text>
                <Text style={styles.conciergeMetaValue}>{gateHandoff.gate}</Text>
              </View>
              <View style={styles.conciergeMetaRow}>
                <Text style={styles.conciergeMetaLabel}>HOST</Text>
                <Text style={styles.conciergeMetaValue}>{gateHandoff.host}</Text>
              </View>
              <View style={styles.conciergeMetaRow}>
                <Text style={styles.conciergeMetaLabel}>ETA</Text>
                <Text style={styles.conciergeMetaValue}>{gateHandoff.eta}</Text>
              </View>
              <Text style={styles.conciergeHint}>{gateHandoff.routeHint}</Text>
              <Text style={styles.conciergeHint}>{gateHandoff.welcomeKit}</Text>

              <TouchableOpacity
                style={styles.conciergeAction}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Ticket')}
              >
                <Text style={styles.conciergeActionText}>Open Entry Pass</Text>
                <ChevronRight size={16} color={COLORS.maize} />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.sectionTitle}>TODAY JOURNEY</Text>
          <View style={styles.timelineCard}>
            <BlurView intensity={18} tint="dark" style={StyleSheet.absoluteFill} />
            {journeyPlan.planningMode && (
              <Text style={styles.timelinePlanningHint}>
                Timeline unlocks in detail on game day. Your itinerary is staged.
              </Text>
            )}
            {journeyPlan.steps.map((step, index) => (
              <View
                key={step.id}
                style={[
                  styles.timelineRow,
                  index === journeyPlan.steps.length - 1 && styles.timelineRowLast,
                ]}
              >
                <View style={styles.timelineRail}>
                  <View
                    style={[
                      styles.timelineDot,
                      step.status === 'done' && styles.timelineDotDone,
                      step.status === 'current' && styles.timelineDotCurrent,
                    ]}
                  />
                  {index < journeyPlan.steps.length - 1 && (
                    <View
                      style={[
                        styles.timelineConnector,
                        step.status === 'done' && styles.timelineConnectorDone,
                      ]}
                    />
                  )}
                </View>

                <View style={styles.timelineContent}>
                  <View style={styles.timelineHeader}>
                    <Text style={styles.timelineTime}>{step.time}</Text>
                    <Text
                      style={[
                        styles.timelineStatus,
                        step.status === 'done' && styles.timelineStatusDone,
                        step.status === 'current' && styles.timelineStatusCurrent,
                      ]}
                    >
                      {step.status === 'done' ? 'Done' : step.status === 'current' ? 'Current' : 'Upcoming'}
                    </Text>
                  </View>
                  <Text style={styles.timelineTitle}>{step.title}</Text>
                  <Text style={styles.timelineDetail}>{step.detail}</Text>
                </View>
              </View>
            ))}
          </View>

          <Text style={styles.sectionTitle}>QUICK ACTIONS</Text>
          <View style={styles.actionRow}>
            <ActionPill icon={Ticket} label="Scan Ticket" onPress={() => navigation.navigate('Ticket')} />
            <ActionPill icon={Utensils} label="Order Food" onPress={() => navigation.navigate('Ticket')} />
            <ActionPill
              icon={Route}
              label={isGameDay ? 'Travel' : 'Route'}
              onPress={() => launchJourneyWithIntent('travel')}
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
    borderColor: CHROME.surface.border,
    backgroundColor: CHROME.surface.base,
    padding: SPACING.l,
    marginBottom: SPACING.m,
    ...SHADOWS.lg,
  },
  heroCardImageAsset: {
    transform: [{ scale: 1 }],
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
    paddingVertical: SPACING.s,
    paddingHorizontal: 0,
    marginBottom: SPACING.s,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamColumn: {
    alignItems: 'center',
    width: '42%',
    justifyContent: 'center',
    minHeight: 98,
    paddingHorizontal: 6,
  },
  teamLogo: {
    width: 74,
    height: 74,
    marginBottom: 8,
  },
  opponentWordmark: {
    fontSize: 42,
    lineHeight: 42,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  opponentLogo: {
    width: 78,
    height: 78,
    marginBottom: 8,
  },
  teamLabel: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.8,
    textAlign: 'center',
    width: '100%',
  },
  vsBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(6,18,33,0.68)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.38)',
    marginHorizontal: 0,
    flexShrink: 0,
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
    backgroundColor: CHROME.surface.base,
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
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
    backgroundColor: CHROME.surface.elevated,
    borderWidth: 1,
    borderColor: CHROME.surface.border,
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
  progressCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CHROME.surface.border,
    backgroundColor: CHROME.surface.base,
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
  liveOpsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  liveOpsTitle: {
    marginBottom: 0,
  },
  liveOpsStage: {
    color: COLORS.maize,
    fontSize: 10,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.8,
  },
  liveOpsPriority: {
    color: COLORS.textTertiary,
    fontSize: 11,
    lineHeight: 16,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: 4,
    marginBottom: SPACING.s,
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
    borderColor: CHROME.surface.borderSoft,
    backgroundColor: CHROME.surface.base,
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
  opsFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginTop: 8,
  },
  opsCta: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.5,
  },

  conciergeStack: {
    gap: SPACING.s,
    marginBottom: SPACING.m,
  },
  conciergeCard: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CHROME.surface.border,
    backgroundColor: CHROME.surface.base,
    padding: SPACING.s,
  },
  conciergeHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  conciergeIconWrap: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,203,5,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  conciergeTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: 'Montserrat_700Bold',
  },
  conciergeMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conciergeMetaLabel: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.8,
  },
  conciergeMetaValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_700Bold',
    textAlign: 'right',
    flex: 1,
    marginLeft: SPACING.s,
  },
  conciergeHint: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    lineHeight: 16,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: 3,
  },
  conciergeAction: {
    marginTop: SPACING.s,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    paddingTop: 10,
  },
  conciergeActionText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
  },

  timelineCard: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
    backgroundColor: CHROME.surface.base,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.s,
    marginBottom: SPACING.m,
  },
  timelinePlanningHint: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginBottom: SPACING.s,
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: SPACING.s,
  },
  timelineRowLast: {
    marginBottom: 0,
  },
  timelineRail: {
    width: 24,
    alignItems: 'center',
    marginRight: 4,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.34)',
    marginTop: 4,
  },
  timelineDotDone: {
    backgroundColor: '#38A169',
  },
  timelineDotCurrent: {
    backgroundColor: COLORS.maize,
  },
  timelineConnector: {
    width: 1,
    flex: 1,
    marginTop: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  timelineConnectorDone: {
    backgroundColor: 'rgba(56,161,105,0.7)',
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 2,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  timelineTime: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.7,
  },
  timelineStatus: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontFamily: 'Montserrat_600SemiBold',
  },
  timelineStatusDone: {
    color: '#38A169',
  },
  timelineStatusCurrent: {
    color: COLORS.maize,
  },
  timelineTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 2,
  },
  timelineDetail: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    lineHeight: 16,
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
    backgroundColor: CHROME.surface.elevated,
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
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
    borderColor: CHROME.surface.border,
    backgroundColor: CHROME.surface.base,
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
    backgroundColor: CHROME.surface.elevated,
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
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
    borderColor: CHROME.surface.borderSoft,
    backgroundColor: CHROME.surface.base,
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
