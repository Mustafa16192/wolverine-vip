import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Brightness from 'expo-brightness';
import { LinearGradient } from 'expo-linear-gradient';
import { QrCode, Sparkles } from 'lucide-react-native';
import { COLORS, SPACING, SHADOWS, TYPOGRAPHY, RADIUS } from '../constants/theme';

const { width } = Dimensions.get('window');
const DEFAULT_CARD_WIDTH = width - SPACING.l * 2;
const DEFAULT_CARD_HEIGHT = 420;

const TicketPassCard = forwardRef(function TicketPassCard(
  {
    user,
    showHint = true,
    cardWidth = DEFAULT_CARD_WIDTH,
    cardHeight = DEFAULT_CARD_HEIGHT,
  },
  ref
) {
  const [isFlipped, setIsFlipped] = useState(false);
  const originalBrightness = useRef(null);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const tapAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    (async () => {
      try {
        await Brightness.requestPermissionsAsync();
      } catch (error) {
        console.log('Brightness permission error', error);
      }
    })();
  }, []);

  useEffect(() => {
    return () => {
      if (isFlipped && originalBrightness.current !== null) {
        Brightness.setBrightnessAsync(originalBrightness.current).catch(() => {});
      }
    };
  }, [isFlipped]);

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );

    shimmer.start();
    return () => shimmer.stop();
  }, [shimmerAnim]);

  const handleFlip = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setIsFlipped((previous) => {
      const toValue = previous ? 0 : 1;

      (async () => {
        try {
          const { status } = await Brightness.getPermissionsAsync();
          if (status === 'granted') {
            if (!previous) {
              const current = await Brightness.getBrightnessAsync();
              originalBrightness.current = current;
              await Brightness.setBrightnessAsync(1);
            } else if (originalBrightness.current !== null) {
              await Brightness.setBrightnessAsync(originalBrightness.current);
            }
          }
        } catch (error) {
          console.log('Brightness error', error);
        }
      })();

      Animated.parallel([
        Animated.spring(flipAnim, {
          toValue,
          friction: 7,
          tension: 70,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(tapAnim, {
            toValue: 1,
            duration: 85,
            useNativeDriver: true,
          }),
          Animated.spring(tapAnim, {
            toValue: 0,
            friction: 6,
            tension: 130,
            useNativeDriver: true,
          }),
        ]),
      ]).start();

      return !previous;
    });
  }, [flipAnim, tapAnim]);

  useImperativeHandle(ref, () => ({
    flip: handleFlip,
  }), [handleFlip]);

  const frontRotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backRotateY = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 0.49, 0.5, 1],
    outputRange: [1, 1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 0.5, 0.51, 1],
    outputRange: [0, 0, 1, 1],
  });

  const flipScale = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0.965, 1],
  });

  const tapScale = tapAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.985],
  });

  const cardLift = flipAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, -3, 0],
  });

  const shimmerTranslate = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-cardWidth, cardWidth],
  });

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={handleFlip} activeOpacity={0.95} style={styles.cardTouchable}>
        <Animated.View
          style={[
            styles.cardContainer,
            {
              width: cardWidth,
              height: cardHeight,
              transform: [
                { translateY: cardLift },
                { scale: flipScale },
                { scale: tapScale },
              ],
            },
          ]}
        >
          <Animated.View
            style={[
              styles.ticketCard,
              styles.frontCard,
              {
                opacity: frontOpacity,
                transform: [
                  { perspective: 1400 },
                  { rotateY: frontRotateY },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={[COLORS.blue, 'rgba(0,39,76,0.95)', 'rgba(0,39,76,0.9)']}
              locations={[0, 0.6, 1]}
              style={StyleSheet.absoluteFill}
            />

            <Animated.View
              style={[
                styles.shimmer,
                { transform: [{ translateX: shimmerTranslate }] },
              ]}
            >
              <LinearGradient
                colors={['transparent', 'rgba(255,203,5,0.1)', 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>

            <View style={styles.cardAccent} />

            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.seasonBadge}>2026 SEASON</Text>
                  <Text style={styles.passType}>VIP PASS</Text>
                </View>
                <Image
                  source={require('../assets/um-logo-outlined.png')}
                  style={styles.cardLogo}
                />
              </View>

              <View style={styles.seatGrid}>
                <View style={styles.seatItem}>
                  <Text style={styles.seatLabel}>SECTION</Text>
                  <Text style={styles.seatValue}>{user.seat.section}</Text>
                </View>
                <View style={styles.seatDivider} />
                <View style={styles.seatItem}>
                  <Text style={styles.seatLabel}>ROW</Text>
                  <Text style={styles.seatValue}>{user.seat.row}</Text>
                </View>
                <View style={styles.seatDivider} />
                <View style={styles.seatItem}>
                  <Text style={styles.seatLabel}>SEAT</Text>
                  <Text style={styles.seatValue}>{user.seat.seat}</Text>
                </View>
              </View>

              <View style={styles.holderSection}>
                <View style={styles.holderRow}>
                  <View>
                    <Text style={styles.holderLabel}>TICKET HOLDER</Text>
                    <Text style={styles.holderName}>{user.name.toUpperCase()}</Text>
                  </View>
                  <View style={styles.verifiedBadge}>
                    <Sparkles size={12} color={COLORS.blue} />
                    <Text style={styles.verifiedText}>VERIFIED</Text>
                  </View>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.footerText}>THE BIG HOUSE</Text>
                <Text style={styles.footerText}>ANN ARBOR, MI</Text>
              </View>
            </View>

            <View style={styles.cornerAccent} />
          </Animated.View>

          <Animated.View
            style={[
              styles.ticketCard,
              styles.backCard,
              {
                opacity: backOpacity,
                transform: [
                  { perspective: 1400 },
                  { rotateY: backRotateY },
                ],
              },
            ]}
          >
            <LinearGradient
              colors={[COLORS.maize, COLORS.maize, 'rgba(255,203,5,0.95)']}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.qrSection}>
              <Text style={styles.qrTitle}>SCAN FOR ENTRY</Text>
              <View style={styles.qrContainer}>
                <QrCode size={160} color={COLORS.blue} strokeWidth={1.5} />
              </View>
              <Text style={styles.qrSubtitle}>Present at gate for access</Text>
            </View>

            <View style={styles.backFooter}>
              <View style={styles.backFooterLine} />
              <Text style={styles.backFooterText}>WOLVERINE VIP</Text>
              <View style={styles.backFooterLine} />
            </View>
          </Animated.View>
        </Animated.View>
      </TouchableOpacity>

      {showHint ? (
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>Tap card to {isFlipped ? 'hide' : 'reveal'} QR code</Text>
        </View>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  cardTouchable: {
    marginTop: SPACING.m,
  },
  cardContainer: {
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
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
  },
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
  cornerAccent: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 80,
    height: 80,
    backgroundColor: 'rgba(255,203,5,0.05)',
    borderTopLeftRadius: 80,
  },
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
  hintContainer: {
    marginTop: SPACING.m,
  },
  hintText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
});

export default TicketPassCard;
