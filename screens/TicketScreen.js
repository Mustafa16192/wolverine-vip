import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY, RADIUS, CHROME } from '../constants/theme';
import {
  Sparkles,
  Shield,
  ChevronRight,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useApp } from '../context/AppContext';
import AppBackground from '../components/chrome/AppBackground';
import TicketPassCard from '../components/TicketPassCard';
import { registerTicketFlipHandler, unregisterTicketFlipHandler } from '../assistant/ticketFlipBridge';

/**
 * TicketScreen - "Seat Command" Digital Season Pass
 *
 * Premium ticket experience with tap-to-flip reveal.
 * Inspired by luxury event passes and F1 pit credentials.
 */

export default function TicketScreen({ navigation }) {
  const { user, currentGame, nextGame, isGameDay, enterGameDay } = useApp();
  const ticketCardRef = useRef(null);
  const featuredGame = currentGame || nextGame;

  useEffect(() => {
    const handleFlip = () => {
      ticketCardRef.current?.flip();
    };

    registerTicketFlipHandler(handleFlip);
    return () => unregisterTicketFlipHandler(handleFlip);
  });

  const handleLaunchGameDay = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    enterGameDay({ intent: 'journey' });
    navigation.navigate('GameDayHome');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <AppBackground />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{ width: 44 }} />
          <View style={styles.headerCenter}>
            <Shield size={16} color={COLORS.maize} />
            <Text style={styles.headerTitle}>SEAT COMMAND</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <TicketPassCard ref={ticketCardRef} user={user} />

          {/* Entry Notes */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>ENTRY NOTES</Text>
          </View>

          <View style={styles.conciergeHero}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.conciergeHeroTop}>
              <View style={styles.conciergeChip}>
                <Sparkles size={12} color={COLORS.maize} />
                <Text style={styles.conciergeChipText}>Ticket-Only Context</Text>
              </View>
              <Text style={styles.conciergeHeroTitle}>Keep This Ready At The Gate</Text>
            </View>
            <Text style={styles.conciergeHeroMeta}>
              Gate 4 • {featuredGame?.time || '12:00 PM'} kickoff
            </Text>
            <Text style={styles.conciergeHeroHint}>
              Present the QR code at entry, then move directly to Section {user.seat.section}. Parking remains pinned to {user.parking.lot} • {user.parking.spot}.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.journeyLaunchButton}
            activeOpacity={0.92}
            onPress={handleLaunchGameDay}
          >
            <LinearGradient
              colors={[COLORS.maize, '#E7B600']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.journeyLaunchContent}>
              <Shield size={16} color={COLORS.blue} />
              <Text style={styles.journeyLaunchText}>
                {isGameDay ? 'Resume Game Day' : 'Launch Game Day'}
              </Text>
              <ChevronRight size={16} color={COLORS.blue} />
            </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
  },
  scrollContent: {
    paddingHorizontal: SPACING.m,
    paddingBottom: 100,
    alignItems: 'center',
  },

  // Card
  cardTouchable: {
    marginTop: SPACING.m,
  },
  cardContainer: {
    width: '100%',
    height: 420,
    ...SHADOWS.xl,
  },
  ticketCard: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
  },
  frontCard: {
    zIndex: 2,
  },
  backCard: {
    zIndex: 1,
  },
  cardAccent: {
    height: 4,
    backgroundColor: COLORS.maize,
  },
  cardContent: {
    flex: 1,
    padding: SPACING.l,
    justifyContent: 'space-between',
  },

  // Shimmer
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
  },

  // Card Header
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  seasonBadge: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
  },
  passType: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontFamily: 'Montserrat_700Bold',
    marginTop: SPACING.xxs,
  },
  cardLogo: {
    width: 56,
    height: 56,
    resizeMode: 'contain',
  },

  // Seat Grid
  seatGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,203,5,0.08)',
    borderRadius: RADIUS.lg,
    padding: SPACING.l,
    marginVertical: SPACING.m,
  },
  seatItem: {
    flex: 1,
    alignItems: 'center',
  },
  seatLabel: {
    color: COLORS.textTertiary,
    fontSize: 10,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  seatValue: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.display,
    fontFamily: 'AtkinsonHyperlegible_700Bold',
    lineHeight: TYPOGRAPHY.fontSize.display,
  },
  seatDivider: {
    width: 1,
    height: 50,
    backgroundColor: COLORS.border,
  },

  // Holder Section
  holderSection: {
    marginBottom: SPACING.m,
  },
  holderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  holderLabel: {
    color: COLORS.textTertiary,
    fontSize: 10,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 1,
    marginBottom: SPACING.xxs,
  },
  holderName: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.maize,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    gap: SPACING.xxs,
  },
  verifiedText: {
    color: COLORS.blue,
    fontSize: 10,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.5,
  },

  // Card Footer
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.m,
  },
  footerText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  // Corner Accent
  cornerAccent: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,203,5,0.05)',
    borderTopLeftRadius: 80,
  },

  // QR Section (Back)
  qrSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.l,
  },
  qrTitle: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
    marginBottom: SPACING.l,
  },
  qrContainer: {
    backgroundColor: 'white',
    padding: SPACING.l,
    borderRadius: RADIUS.lg,
    ...SHADOWS.md,
  },
  qrSubtitle: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.m,
    opacity: 0.8,
  },

  // Back Footer
  backFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: SPACING.l,
    gap: SPACING.m,
  },
  backFooterLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,39,76,0.2)',
    maxWidth: 60,
  },
  backFooterText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
    opacity: 0.6,
  },

  // Hint
  hintContainer: {
    marginTop: SPACING.m,
    marginBottom: SPACING.xl,
  },
  hintText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  // Section Header
  sectionHeader: {
    width: '100%',
    marginBottom: SPACING.m,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },

  conciergeHero: {
    width: '100%',
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CHROME.surface.border,
    backgroundColor: CHROME.surface.base,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  conciergeHeroTop: {
    marginBottom: SPACING.xs,
  },
  conciergeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    alignSelf: 'flex-start',
    borderRadius: RADIUS.full,
    paddingHorizontal: SPACING.s,
    paddingVertical: SPACING.xs,
    backgroundColor: 'rgba(255,203,5,0.12)',
    marginBottom: SPACING.xs,
  },
  conciergeChipText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.6,
  },
  conciergeHeroTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: 'Montserrat_700Bold',
  },
  conciergeHeroMeta: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_700Bold',
    marginBottom: SPACING.xs,
  },
  conciergeHeroHint: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 18,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  journeyLaunchButton: {
    width: '100%',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.m,
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255,255,255,0.45)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.25)',
  },
  journeyLaunchContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingVertical: 14,
  },
  journeyLaunchText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  moduleStack: {
    width: '100%',
    gap: SPACING.s,
  },
  moduleCard: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    padding: SPACING.s,
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
    backgroundColor: CHROME.surface.base,
  },
  moduleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  moduleIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,203,5,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_700Bold',
  },
  moduleSubtitle: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_700Bold',
    marginBottom: SPACING.xxs,
  },
  moduleDetail: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 18,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  moduleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: SPACING.s,
    paddingTop: SPACING.s,
  },
  moduleCta: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
  },
  quickActionRow: {
    width: '100%',
    gap: SPACING.s,
    marginTop: SPACING.s,
  },
  quickAction: {
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.s,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  quickActionText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
});
