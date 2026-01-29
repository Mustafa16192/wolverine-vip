import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { BlurView } from 'expo-blur';
import { RotateCcw, Play, Pause } from 'lucide-react-native';
import { useGame } from '../context/GameContext';

export default function SimulatorControls() {
  const {
    currentState,
    simulatedTime,
    autoAdvanceEnabled,
    advanceTime,
    resetSimulation,
    toggleAutoAdvance,
    formatTimeDisplay,
    GAME_STATES,
  } = useGame();

  // State display configuration
  const stateLabels = {
    [GAME_STATES.OFF_DAY]: 'OFF',
    [GAME_STATES.COMMUTE]: 'COMM',
    [GAME_STATES.ARRIVAL]: 'ARR',
    [GAME_STATES.IN_GAME]: 'GAME',
    [GAME_STATES.POST_GAME]: 'POST',
  };

  return (
    <BlurView intensity={30} tint="dark" style={styles.container}>
      {/* Time Display */}
      <View style={styles.topRow}>
        <Text style={styles.timeDisplay}>{formatTimeDisplay()}</Text>
        <View style={styles.controlButtons}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={toggleAutoAdvance}
          >
            {autoAdvanceEnabled ? (
              <Pause size={18} color={COLORS.secondary} />
            ) : (
              <Play size={18} color={COLORS.text} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={resetSimulation}
          >
            <RotateCcw size={18} color={COLORS.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Time Jump Buttons & State Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Time Jump Buttons */}
        <View style={styles.timeJumpContainer}>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => advanceTime(-0.5)}
          >
            <Text style={styles.timeButtonText}>-30m</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => advanceTime(0.5)}
          >
            <Text style={styles.timeButtonText}>+30m</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.timeButton}
            onPress={() => advanceTime(1)}
          >
            <Text style={styles.timeButtonText}>+1h</Text>
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* State Pills */}
        <View style={styles.statesContainer}>
          {Object.values(GAME_STATES).map((state) => (
            <View
              key={state}
              style={[
                styles.statePill,
                currentState === state && styles.statePillActive,
              ]}
            >
              <Text
                style={[
                  styles.statePillText,
                  currentState === state && styles.statePillTextActive,
                ]}
              >
                {stateLabels[state]}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: SPACING.m,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeDisplay: {
    color: COLORS.secondary,
    fontSize: 13,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    letterSpacing: 0.5,
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  timeJumpContainer: {
    flexDirection: 'row',
    gap: 8,
    marginRight: 12,
  },
  timeButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  timeButtonText: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 12,
  },
  statesContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  statePill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statePillActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  statePillText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statePillTextActive: {
    color: COLORS.primary,
  },
});
