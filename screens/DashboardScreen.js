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
  Star,
  ShoppingBag,
  TrendingUp,
  Activity
} from 'lucide-react-native';
import BentoCard from '../components/BentoCard';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

/**
 * DashboardScreen - "The Pit Wall"
 * 
 * Non-Game Day Mode: Bento Grid Layout
 * Shows standings, stats, news, and merch.
 */

// Mock Data
const NEXT_GAME = {
  opponent: 'OHIO STATE',
  date: 'NOV 30, 2026',
  time: '12:00 PM',
  location: 'THE BIG HOUSE',
  targetDate: new Date('2026-11-30T12:00:00'),
};

const STANDINGS = [
  { rank: 1, team: 'Michigan', record: '10-0', conf: '7-0' },
  { rank: 2, team: 'Ohio State', record: '9-1', conf: '6-1' },
  { rank: 3, team: 'Penn State', record: '8-2', conf: '5-2' },
];

const MERCH_ITEM = {
  name: 'Jordan 1 Low',
  variant: 'Michigan PE',
  price: '$140',
  image: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b1bcbca4-085f-4335-a924-f58230932023/air-jordan-1-low-mens-shoes-0LXhbn.png' // Placeholder URL
};

export default function DashboardScreen({ navigation }) {
  const { toggleMode } = useApp();
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0 });
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Countdown Logic
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

  // Pulse Animation
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 0.4, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // === RENDER HELPERS ===

  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <View style={styles.liveIndicator}>
          <Animated.View style={[styles.liveDot, { opacity: pulseAnim }]} />
          <Text style={styles.liveText}>VIP CLUBHOUSE</Text>
        </View>
        <Text style={styles.username}>Welcome, Mustafa</Text>
      </View>
      <TouchableOpacity style={styles.avatarContainer}>
        <LinearGradient colors={[COLORS.maize, '#E5B700']} style={styles.avatarGradient}>
          <Text style={styles.avatarText}>M</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  // === MAIN RENDER ===

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background */}
      <LinearGradient
        colors={['#001428', COLORS.blue, '#000B14']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.gridOverlay} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {renderHeader()}

          {/* Game Day Trigger */}
          <TouchableOpacity style={styles.gameDayButton} onPress={toggleMode} activeOpacity={0.9}>
            <LinearGradient
              colors={[COLORS.maize, '#E5B800']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.gameDayButtonContent}>
              <View style={styles.gameDayButtonIcon}>
                <Zap size={24} color={COLORS.blue} />
              </View>
              <View style={styles.gameDayButtonText}>
                <Text style={styles.gameDayButtonTitle}>START GAME DAY MODE</Text>
                <Text style={styles.gameDayButtonSubtitle}>Begin your end-to-end experience</Text>
              </View>
              <ChevronRight size={24} color={COLORS.blue} />
            </View>
          </TouchableOpacity>

          {/* === BENTO GRID LAYOUT === */}

          {/* Row 1: Hero (Full Width) */}
          <BentoCard accent style={styles.heroCard}>
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
                <Image source={require('../assets/um-logo-blue.png')} style={styles.teamLogo} />
                <Text style={styles.teamName}>MICHIGAN</Text>
              </View>
              <Text style={styles.vsText}>VS</Text>
              <View style={styles.teamBlock}>
                <View style={styles.opponentLogo}><Text style={styles.opponentInitial}>O</Text></View>
                <Text style={styles.teamName}>{NEXT_GAME.opponent}</Text>
              </View>
            </View>

            <View style={styles.countdownContainer}>
              <CountdownUnit value={countdown.days} label="DAYS" />
              <View style={styles.countdownDivider} />
              <CountdownUnit value={countdown.hours} label="HRS" />
              <View style={styles.countdownDivider} />
              <CountdownUnit value={countdown.mins} label="MIN" />
            </View>
          </BentoCard>

          {/* Row 2: 2 Columns */}
          <View style={styles.bentoRow}>
            {/* Col 1: Standings (Tall) */}
            <View style={styles.colLeft}>
              <BentoCard title="BIG TEN STANDINGS" style={styles.standingsCard}>
                {STANDINGS.map((item, index) => (
                  <View key={item.team} style={[
                    styles.standingsRow, 
                    index !== STANDINGS.length - 1 && styles.borderBottom
                  ]}>
                    <View style={styles.rankContainer}>
                      <Text style={[styles.rankText, index === 0 && { color: COLORS.maize }]}>{item.rank}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.standingsTeam}>{item.team}</Text>
                      <Text style={styles.standingsRecord}>{item.conf} Conf</Text>
                    </View>
                    <Text style={styles.standingsOverall}>{item.record}</Text>
                  </View>
                ))}
                <TouchableOpacity style={styles.viewAllLink}>
                  <Text style={styles.viewAllText}>Full Table</Text>
                  <ChevronRight size={12} color={COLORS.maize} />
                </TouchableOpacity>
              </BentoCard>
            </View>

            {/* Col 2: Stats & Merch (Stacked) */}
            <View style={styles.colRight}>
              {/* Personal Stat */}
              <BentoCard style={styles.smallCard} onPress={() => navigation.navigate('Stats')}>
                <Trophy size={20} color={COLORS.maize} style={{ marginBottom: 8 }} />
                <Text style={styles.statBig}>12</Text>
                <Text style={styles.statLabel}>YEARS</Text>
              </BentoCard>

              {/* Merch Teaser */}
              <BentoCard style={styles.merchCard} noPadding onPress={() => navigation.navigate('Shop')}>
                <Image 
                  source={{ uri: MERCH_ITEM.image }} 
                  style={StyleSheet.absoluteFill}
                  resizeMode="cover"
                />
                <LinearGradient 
                  colors={['transparent', 'rgba(0,0,0,0.9)']} 
                  style={styles.merchOverlay}
                >
                  <View style={styles.newBadge}><Text style={styles.newBadgeText}>NEW DROP</Text></View>
                  <Text style={styles.merchName}>{MERCH_ITEM.name}</Text>
                  <Text style={styles.merchPrice}>{MERCH_ITEM.price}</Text>
                </LinearGradient>
              </BentoCard>
            </View>
          </View>

          {/* Row 3: News Feed (Horizontal) */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>INSIDER WIRE</Text>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.newsScroll}>
            {[
              { title: 'Harbaugh: "We are ready for anything"', tag: 'INTERVIEW' },
              { title: 'New Stadium Entry Protocols for 2026', tag: 'UPDATE' },
              { title: 'Injury Report: Full squad available', tag: 'TEAM' }
            ].map((news, i) => (
              <BentoCard key={i} style={styles.newsCard} onPress={() => navigation.navigate('News')}>
                <View style={styles.newsTag}><Text style={styles.newsTagText}>{news.tag}</Text></View>
                <Text style={styles.newsTitle} numberOfLines={3}>{news.title}</Text>
                <View style={styles.newsFooter}>
                  <Text style={styles.newsTime}>2h ago</Text>
                  <ChevronRight size={14} color={COLORS.textTertiary} />
                </View>
              </BentoCard>
            ))}
          </ScrollView>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const CountdownUnit = ({ value, label }) => (
  <View style={styles.countdownBlock}>
    <Text style={styles.countdownValue}>{value}</Text>
    <Text style={styles.countdownLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.blue },
  gridOverlay: { ...StyleSheet.absoluteFillObject, opacity: 0.03, backgroundColor: 'transparent' },
  safeArea: { flex: 1 },
  scrollContent: { padding: SPACING.m, paddingBottom: 100 },

  // Game Day Button
  gameDayButton: { borderRadius: RADIUS.lg, overflow: 'hidden', marginBottom: SPACING.m, ...SHADOWS.md },
  gameDayButtonContent: { flexDirection: 'row', alignItems: 'center', padding: SPACING.m, gap: SPACING.m },
  gameDayButtonIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,39,76,0.2)', alignItems: 'center', justifyContent: 'center' },
  gameDayButtonText: { flex: 1 },
  gameDayButtonTitle: { color: COLORS.blue, fontSize: TYPOGRAPHY.fontSize.base, fontFamily: 'Montserrat_700Bold', letterSpacing: 1 },
  gameDayButtonSubtitle: { color: 'rgba(0,39,76,0.7)', fontSize: TYPOGRAPHY.fontSize.xs, fontFamily: 'AtkinsonHyperlegible_400Regular', marginTop: 2 },

  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.l },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.maize, marginRight: 6 },
  liveText: { color: COLORS.maize, fontSize: 10, fontFamily: 'Montserrat_700Bold', letterSpacing: 1 },
  username: { color: COLORS.text, fontSize: 24, fontFamily: 'Montserrat_700Bold' },
  avatarContainer: { padding: 2, borderWidth: 2, borderColor: COLORS.maize, borderRadius: RADIUS.full },
  avatarGradient: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: COLORS.blue, fontSize: 16, fontFamily: 'Montserrat_700Bold' },

  // Layout
  bentoRow: { flexDirection: 'row', gap: SPACING.m, marginBottom: SPACING.m },
  colLeft: { flex: 1.5, gap: SPACING.m },
  colRight: { flex: 1, gap: SPACING.m },

  // Hero Card
  heroCard: { marginBottom: SPACING.m, minHeight: 200 },
  heroHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.l },
  matchupBadge: { backgroundColor: 'rgba(255,203,5,0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 100 },
  matchupText: { color: COLORS.maize, fontSize: 10, fontFamily: 'Montserrat_700Bold', letterSpacing: 1 },
  dateChip: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateChipText: { color: COLORS.maize, fontSize: 12, fontFamily: 'Montserrat_600SemiBold' },
  
  vsContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginBottom: SPACING.l },
  teamBlock: { alignItems: 'center' },
  teamLogo: { width: 48, height: 48, resizeMode: 'contain', marginBottom: 8 },
  teamName: { color: COLORS.text, fontSize: 12, fontFamily: 'Montserrat_700Bold', letterSpacing: 1 },
  vsText: { color: COLORS.textTertiary, fontSize: 18, fontFamily: 'Montserrat_700Bold' },
  opponentLogo: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#BB0000', alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  opponentInitial: { color: '#FFF', fontSize: 24, fontFamily: 'Montserrat_700Bold' },

  countdownContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,39,76,0.5)', borderRadius: RADIUS.lg, padding: SPACING.m },
  countdownBlock: { alignItems: 'center', width: 50 },
  countdownValue: { color: COLORS.maize, fontSize: 24, fontFamily: 'AtkinsonHyperlegible_700Bold' },
  countdownLabel: { color: COLORS.textSecondary, fontSize: 10, fontFamily: 'Montserrat_600SemiBold', marginTop: 2 },
  countdownDivider: { width: 1, height: 24, backgroundColor: COLORS.border },

  // Standings
  standingsCard: { flex: 1 },
  standingsRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  borderBottom: { borderBottomWidth: 1, borderBottomColor: COLORS.border },
  rankContainer: { width: 24, alignItems: 'center', marginRight: 8 },
  rankText: { color: COLORS.textSecondary, fontSize: 14, fontFamily: 'Montserrat_700Bold' },
  standingsTeam: { color: COLORS.text, fontSize: 14, fontFamily: 'Montserrat_600SemiBold' },
  standingsRecord: { color: COLORS.textTertiary, fontSize: 10, fontFamily: 'AtkinsonHyperlegible_400Regular' },
  standingsOverall: { color: COLORS.text, fontSize: 14, fontFamily: 'AtkinsonHyperlegible_700Bold' },
  viewAllLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 8, gap: 4 },
  viewAllText: { color: COLORS.maize, fontSize: 10, fontFamily: 'Montserrat_700Bold' },

  // Right Column Widgets
  smallCard: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 100 },
  statBig: { color: COLORS.text, fontSize: 24, fontFamily: 'Montserrat_700Bold' },
  statLabel: { color: COLORS.textTertiary, fontSize: 9, fontFamily: 'Montserrat_700Bold', letterSpacing: 1 },

  merchCard: { flex: 1.5, minHeight: 140 },
  merchOverlay: { flex: 1, justifyContent: 'flex-end', padding: 12 },
  newBadge: { backgroundColor: COLORS.maize, alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 4 },
  newBadgeText: { color: COLORS.blue, fontSize: 8, fontFamily: 'Montserrat_700Bold' },
  merchName: { color: COLORS.text, fontSize: 12, fontFamily: 'Montserrat_700Bold' },
  merchPrice: { color: COLORS.textSecondary, fontSize: 12, fontFamily: 'AtkinsonHyperlegible_400Regular' },

  // News
  sectionHeader: { marginTop: SPACING.s, marginBottom: SPACING.m },
  sectionTitle: { color: COLORS.textSecondary, fontSize: 12, fontFamily: 'Montserrat_700Bold', letterSpacing: 1 },
  newsScroll: { marginHorizontal: -SPACING.m, paddingHorizontal: SPACING.m },
  newsCard: { width: 160, height: 160, marginRight: SPACING.m },
  newsTag: { backgroundColor: 'rgba(255,255,255,0.1)', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, marginBottom: 8 },
  newsTagText: { color: COLORS.maize, fontSize: 8, fontFamily: 'Montserrat_700Bold' },
  newsTitle: { color: COLORS.text, fontSize: 14, fontFamily: 'AtkinsonHyperlegible_400Regular', lineHeight: 20, flex: 1 },
  newsFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  newsTime: { color: COLORS.textTertiary, fontSize: 10 },
});