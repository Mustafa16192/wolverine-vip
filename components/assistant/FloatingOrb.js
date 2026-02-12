import React, { useEffect, useMemo, useRef } from 'react';
import {
  ActivityIndicator,
  Animated,
  PanResponder,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Mic, Sparkles } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SHADOWS, CHROME } from '../../constants/theme';
import { useAssistant } from '../../context/AssistantContext';

const ORB_SIZE = 56;
const SCREEN_MARGIN = 18;

function clamp(value, min, max) {
  return Math.max(min, Math.min(value, max));
}

export default function FloatingOrb() {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { openAssistant, startQuickVoiceCapture, hasUnread, isThinking, isOpen } = useAssistant();

  const tabClearance = Platform.OS === 'ios' ? 106 : 90;
  const anchorBottom = tabClearance;

  const bounds = useMemo(() => {
    const horizontalTravel = Math.max(0, width - (SCREEN_MARGIN * 2) - ORB_SIZE);
    const topClearance = insets.top + 10;
    const verticalTravel = Math.max(0, height - topClearance - anchorBottom - ORB_SIZE);

    const minX = -horizontalTravel;
    const maxX = 0;
    const minY = -verticalTravel;
    const maxY = 0;

    return { minX, maxX, minY, maxY };
  }, [anchorBottom, height, insets.top, width]);

  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const currentPosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const id = position.addListener((value) => {
      currentPosRef.current = value;
    });
    return () => position.removeListener(id);
  }, [position]);

  useEffect(() => {
    const clamped = {
      x: clamp(currentPosRef.current.x, bounds.minX, bounds.maxX),
      y: clamp(currentPosRef.current.y, bounds.minY, bounds.maxY),
    };

    position.setValue(clamped);
    currentPosRef.current = clamped;
  }, [bounds.maxX, bounds.maxY, bounds.minX, bounds.minY, position]);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) + Math.abs(gestureState.dy) > 6,
        onPanResponderGrant: () => {
          position.extractOffset();
          position.setValue({ x: 0, y: 0 });
        },
        onPanResponderMove: Animated.event([null, { dx: position.x, dy: position.y }], {
          useNativeDriver: false,
        }),
        onPanResponderRelease: () => {
          position.flattenOffset();
          const clamped = {
            x: clamp(currentPosRef.current.x, bounds.minX, bounds.maxX),
            y: clamp(currentPosRef.current.y, bounds.minY, bounds.maxY),
          };
          Animated.spring(position, {
            toValue: clamped,
            friction: 8,
            tension: 80,
            useNativeDriver: false,
          }).start();
        },
      }),
    [bounds.maxX, bounds.maxY, bounds.minX, bounds.minY, position]
  );

  if (isOpen) {
    return null;
  }

  return (
    <Animated.View
      style={[
        styles.orb,
        {
          width: ORB_SIZE,
          height: ORB_SIZE,
          opacity: 1,
          bottom: anchorBottom,
          right: SCREEN_MARGIN,
          transform: position.getTranslateTransform(),
        },
      ]}
      {...panResponder.panHandlers}
    >
      <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={[CHROME.surface.elevated, 'rgba(6, 20, 44, 0.92)']}
        style={StyleSheet.absoluteFill}
      />

      <Pressable
        style={styles.touchArea}
        onPress={openAssistant}
        delayLongPress={220}
        onLongPress={startQuickVoiceCapture}
        accessibilityRole="button"
        accessibilityLabel="Open VIP Copilot"
        accessibilityHint="Tap to open assistant. Long press for quick voice capture."
      >
        {isThinking ? (
          <ActivityIndicator size="small" color={COLORS.maize} />
        ) : (
          <View style={styles.iconRow}>
            <Sparkles size={18} color={COLORS.maize} />
            <Mic size={15} color={COLORS.textSecondary} />
          </View>
        )}

        {hasUnread ? <View style={styles.unreadDot} /> : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  orb: {
    position: 'absolute',
    borderRadius: ORB_SIZE / 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CHROME.surface.border,
    ...SHADOWS.xl,
    zIndex: 120,
  },
  touchArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  unreadDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.maize,
  },
});
