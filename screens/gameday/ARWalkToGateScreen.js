import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { BlurView } from 'expo-blur';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Camera,
  ChevronRight,
  Footprints,
  Map,
  MapPin,
  RotateCcw,
  X,
} from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS, CHROME } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

const CUE_ICON_MAP = {
  right: ArrowRight,
  straight: ArrowUp,
  gate: Footprints,
};

function PermissionState({
  title,
  detail,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondaryAction,
  busy = false,
  icon = Camera,
}) {
  const Icon = icon;

  return (
    <View style={styles.stateCardWrap}>
      <BlurView intensity={32} tint="dark" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={['rgba(255,203,5,0.16)', 'rgba(5,14,28,0.94)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.stateIconWrap}>
        <Icon size={28} color={COLORS.maize} />
      </View>
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateDetail}>{detail}</Text>

      <TouchableOpacity style={styles.statePrimaryButton} activeOpacity={0.9} onPress={onAction}>
        {busy ? (
          <ActivityIndicator size="small" color={COLORS.blue} />
        ) : (
          <>
            <Text style={styles.statePrimaryButtonText}>{actionLabel}</Text>
            <ChevronRight size={18} color={COLORS.blue} />
          </>
        )}
      </TouchableOpacity>

      {secondaryLabel ? (
        <TouchableOpacity style={styles.stateSecondaryButton} activeOpacity={0.88} onPress={onSecondaryAction}>
          <Text style={styles.stateSecondaryButtonText}>{secondaryLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export default function ARWalkToGateScreen({ navigation }) {
  const isFocused = useIsFocused();
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [requestingPermission, setRequestingPermission] = useState(false);
  const autoRequestedRef = useRef(false);

  const {
    goToPhase,
    user,
    walkAssistSteps,
    walkAssistSession,
    advanceWalkAssist,
    fallbackWalkAssistToMap,
    completeWalkAssistJourney,
    resetWalkAssist,
  } = useApp();

  const currentStep = walkAssistSteps[walkAssistSession.stepIndex] || walkAssistSteps[0];
  const CueIcon = CUE_ICON_MAP[currentStep?.cue] || ArrowUp;
  const isFinalStep = walkAssistSession.stepIndex === walkAssistSteps.length - 1;
  const progressLabel = `${walkAssistSession.stepIndex + 1} of ${walkAssistSteps.length}`;

  useEffect(() => {
    if (!isFocused || permission?.granted || autoRequestedRef.current) {
      return;
    }

    autoRequestedRef.current = true;
    setRequestingPermission(true);
    requestPermission()
      .catch(() => null)
      .finally(() => setRequestingPermission(false));
  }, [isFocused, permission?.granted, requestPermission]);

  const handleBack = () => {
    goToPhase('parking');
    navigation.navigate('GameDayHome');
  };

  const handleMapFallback = () => {
    fallbackWalkAssistToMap();
    goToPhase('parking');
    navigation.navigate('GameDayHome');
  };

  const handleRetryPermission = async () => {
    setRequestingPermission(true);
    try {
      await requestPermission();
    } finally {
      setRequestingPermission(false);
    }
  };

  const handlePrimaryAction = async () => {
    if (walkAssistSession.status === 'complete') {
      goToPhase('pregame');
      navigation.navigate('GameDayHome');
      return;
    }

    if (isFinalStep) {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      completeWalkAssistJourney();
      navigation.navigate('GameDayHome');
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    advanceWalkAssist();
  };

  const permissionState = useMemo(() => {
    if (cameraError) {
      return {
        title: 'Camera unavailable here',
        detail: 'Use a physical device for the live walk assist, or drop back to the parking screen for the static walking route.',
        actionLabel: 'Use walking route card',
        onAction: handleMapFallback,
        secondaryLabel: 'Try camera again',
        onSecondaryAction: () => {
          setCameraError(null);
          setCameraReady(false);
        },
        icon: X,
      };
    }

    if (permission?.granted) {
      return null;
    }

    if (requestingPermission || permission == null) {
      return {
        title: 'Opening walk assist',
        detail: 'We are preparing the live view from Gold Lot A to Gate 4.',
        actionLabel: 'Preparing',
        onAction: () => {},
        secondaryLabel: 'Use walking route card',
        onSecondaryAction: handleMapFallback,
        busy: true,
        icon: Camera,
      };
    }

    if (permission?.canAskAgain) {
      return {
        title: 'Allow camera for gate guidance',
        detail: 'The rear camera stays in this flow only, so the walk to Gate 4 stays spatial and immediate.',
        actionLabel: 'Enable camera',
        onAction: handleRetryPermission,
        secondaryLabel: 'Use walking route card',
        onSecondaryAction: handleMapFallback,
        icon: Camera,
      };
    }

    return {
      title: 'Camera permission is off',
      detail: 'Turn camera access back on in system settings to use the live walk assist. Until then, the route card remains available in Parking.',
      actionLabel: 'Use walking route card',
      onAction: handleMapFallback,
      secondaryLabel: 'Reset walk assist',
      onSecondaryAction: resetWalkAssist,
      icon: Map,
    };
  }, [cameraError, handleMapFallback, permission, requestingPermission, resetWalkAssist]);

  return (
    <View style={styles.container}>
      {permission?.granted && isFocused ? (
        <CameraView
          style={StyleSheet.absoluteFill}
          facing="back"
          onCameraReady={() => setCameraReady(true)}
          onMountError={({ nativeEvent }) => setCameraError(nativeEvent?.message || 'Camera unavailable')}
        />
      ) : (
        <LinearGradient
          colors={['#060A12', '#0A1931', '#05080F']}
          start={{ x: 0.15, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      <LinearGradient
        colors={['rgba(1,5,12,0.78)', 'transparent', 'rgba(1,5,12,0.84)']}
        locations={[0, 0.38, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.chromeButton} onPress={handleBack} activeOpacity={0.88}>
            <ArrowLeft size={20} color={COLORS.text} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <View style={styles.headerChipRow}>
              <View style={styles.headerChip}>
                <Footprints size={13} color={COLORS.maize} />
                <Text style={styles.headerChipText}>WALK ASSIST</Text>
              </View>
              <View style={styles.headerChipMuted}>
                <Text style={styles.headerChipMutedText}>Gate 4</Text>
              </View>
            </View>
            <Text style={styles.headerTitle}>Section {user.seat.section} entry</Text>
          </View>

          <TouchableOpacity style={styles.chromeButton} onPress={handleMapFallback} activeOpacity={0.88}>
            <Map size={19} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {!permissionState ? (
          <>
            <View style={styles.heroArea} pointerEvents="none">
              <View style={styles.landmarkPill}>
                <MapPin size={13} color={COLORS.maize} />
                <Text style={styles.landmarkPillText}>{currentStep.landmark}</Text>
              </View>

              <View style={styles.cueWrap}>
                <CueIcon size={116} color={COLORS.maize} strokeWidth={2.35} />
              </View>

              <Text style={styles.heroTitle}>{currentStep.title}</Text>
            </View>

            <View style={styles.bottomSheetWrap}>
              <BlurView intensity={34} tint="dark" style={StyleSheet.absoluteFill} />
              <LinearGradient
                colors={['rgba(12,18,29,0.62)', 'rgba(6,12,24,0.9)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={StyleSheet.absoluteFill}
              />

              {walkAssistSession.status === 'complete' ? (
                <>
                  <Text style={styles.sheetEyebrow}>GATE REACHED</Text>
                  <Text style={styles.sheetTitle}>You’re at Gate 4</Text>
                  <Text style={styles.sheetDetail}>Entry routing is complete. Return to the journey for the focused gate and seat handoff.</Text>

                  <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9} onPress={handlePrimaryAction}>
                    <Text style={styles.primaryButtonText}>RETURN TO JOURNEY</Text>
                    <ChevronRight size={18} color={COLORS.blue} />
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.88} onPress={resetWalkAssist}>
                    <RotateCcw size={15} color={COLORS.textSecondary} />
                    <Text style={styles.secondaryButtonText}>Run walk assist again</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <View style={styles.sheetHeaderRow}>
                    <View>
                      <Text style={styles.sheetEyebrow}>GATE APPROACH</Text>
                      <Text style={styles.sheetTitle}>{progressLabel}</Text>
                    </View>
                    <View style={styles.liveStatusChip}>
                      <View style={[styles.liveDot, cameraReady && styles.liveDotReady]} />
                      <Text style={styles.liveStatusText}>{cameraReady ? 'Live view' : 'Aligning camera'}</Text>
                    </View>
                  </View>

                  <View style={styles.progressRail}>
                    {walkAssistSteps.map((step, index) => (
                      <View
                        key={step.id}
                        style={[
                          styles.progressPill,
                          index <= walkAssistSession.stepIndex && styles.progressPillActive,
                        ]}
                      />
                    ))}
                  </View>

                  <Text style={styles.sheetDetail}>{currentStep.detail}</Text>
                  <Text style={styles.sheetCaption}>Tap once after each turn or checkpoint so the route stays aligned.</Text>

                  <TouchableOpacity style={styles.primaryButton} activeOpacity={0.9} onPress={handlePrimaryAction}>
                    <Text style={styles.primaryButtonText}>{isFinalStep ? 'ARRIVED AT GATE 4' : 'DONE'}</Text>
                    <ChevronRight size={18} color={COLORS.blue} />
                  </TouchableOpacity>

                  <View style={styles.sheetSecondaryRow}>
                    <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.88} onPress={handleMapFallback}>
                      <Map size={15} color={COLORS.textSecondary} />
                      <Text style={styles.secondaryButtonText}>Route card</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.88} onPress={handleBack}>
                      <Text style={styles.secondaryButtonText}>Exit assist</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </>
        ) : (
          <PermissionState
            title={permissionState.title}
            detail={permissionState.detail}
            actionLabel={permissionState.actionLabel}
            onAction={permissionState.onAction}
            secondaryLabel={permissionState.secondaryLabel}
            onSecondaryAction={permissionState.onSecondaryAction}
            busy={permissionState.busy}
            icon={permissionState.icon}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05080F',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingBottom: SPACING.l,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.s,
  },
  chromeButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(4, 11, 20, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  headerCenter: {
    alignItems: 'center',
    gap: SPACING.xs,
  },
  headerChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
  },
  headerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(4, 11, 20, 0.54)',
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.22)',
  },
  headerChipText: {
    color: COLORS.maize,
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xs,
    letterSpacing: 0.9,
  },
  headerChipMuted: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(4, 11, 20, 0.44)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  headerChipMutedText: {
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
  },
  headerTitle: {
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  heroArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: SPACING.xxl,
    gap: SPACING.l,
  },
  landmarkPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(6, 12, 24, 0.54)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },
  landmarkPillText: {
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  cueWrap: {
    width: 172,
    height: 172,
    borderRadius: 86,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,203,5,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.16)',
  },
  heroTitle: {
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: 38,
    lineHeight: 42,
    textAlign: 'center',
    paddingHorizontal: SPACING.xl,
    textShadowColor: 'rgba(0,0,0,0.34)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 18,
  },
  bottomSheetWrap: {
    borderRadius: 30,
    overflow: 'hidden',
    padding: SPACING.l,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(6, 12, 24, 0.64)',
    ...SHADOWS.xl,
  },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: SPACING.m,
  },
  sheetEyebrow: {
    color: COLORS.maize,
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.xs,
    letterSpacing: 1,
    marginBottom: 6,
  },
  sheetTitle: {
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: 24,
    lineHeight: 28,
  },
  liveStatusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.26)',
  },
  liveDotReady: {
    backgroundColor: COLORS.success,
  },
  liveStatusText: {
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.xs,
  },
  progressRail: {
    flexDirection: 'row',
    gap: SPACING.s,
    marginTop: SPACING.m,
    marginBottom: SPACING.m,
  },
  progressPill: {
    flex: 1,
    height: 6,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  progressPillActive: {
    backgroundColor: COLORS.maize,
  },
  sheetDetail: {
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.md,
    lineHeight: 23,
  },
  sheetCaption: {
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 18,
    marginTop: SPACING.s,
    marginBottom: SPACING.l,
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.maize,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: SPACING.l,
  },
  primaryButtonText: {
    color: COLORS.blue,
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.base,
    letterSpacing: 0.6,
  },
  sheetSecondaryRow: {
    flexDirection: 'row',
    gap: SPACING.s,
    marginTop: SPACING.s,
  },
  secondaryButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: SPACING.m,
    marginTop: SPACING.s,
  },
  secondaryButtonText: {
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
  stateCardWrap: {
    marginTop: 'auto',
    marginBottom: 'auto',
    borderRadius: 32,
    overflow: 'hidden',
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: CHROME.surface.border,
    backgroundColor: CHROME.surface.elevated,
    ...SHADOWS.xl,
  },
  stateIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,203,5,0.12)',
    marginBottom: SPACING.l,
  },
  stateTitle: {
    color: COLORS.text,
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: 28,
    lineHeight: 32,
    marginBottom: SPACING.s,
  },
  stateDetail: {
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.md,
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  statePrimaryButton: {
    minHeight: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.maize,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: SPACING.l,
  },
  statePrimaryButtonText: {
    color: COLORS.blue,
    fontFamily: TYPOGRAPHY.fontFamily.heading,
    fontSize: TYPOGRAPHY.fontSize.base,
  },
  stateSecondaryButton: {
    minHeight: 46,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.s,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  stateSecondaryButtonText: {
    color: COLORS.textSecondary,
    fontFamily: TYPOGRAPHY.fontFamily.primary,
    fontSize: TYPOGRAPHY.fontSize.sm,
  },
});
