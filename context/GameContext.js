import React, { createContext, useContext, useState, useEffect } from 'react';

// Game Day States
export const GAME_STATES = {
  OFF_DAY: 'OFF_DAY',
  COMMUTE: 'COMMUTE',
  ARRIVAL: 'ARRIVAL',
  IN_GAME: 'IN_GAME',
  POST_GAME: 'POST_GAME',
};

// Time thresholds for auto-advance (hours relative to kickoff)
const STATE_THRESHOLDS = {
  COMMUTE: -3.0,    // T-3:00
  ARRIVAL: -0.5,    // T-0:30
  IN_GAME: 0.0,     // T+0:00 (kickoff)
  POST_GAME: 3.5,   // T+3:30
};

const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [currentState, setCurrentState] = useState(GAME_STATES.OFF_DAY);
  const [simulatedTime, setSimulatedTime] = useState(-96); // Default: 4 days (96 hours) before kickoff
  const [autoAdvanceEnabled, setAutoAdvanceEnabled] = useState(false);

  // Auto-advance logic based on time thresholds
  useEffect(() => {
    if (!autoAdvanceEnabled) return;

    if (simulatedTime >= STATE_THRESHOLDS.POST_GAME) {
      setCurrentState(GAME_STATES.POST_GAME);
    } else if (simulatedTime >= STATE_THRESHOLDS.IN_GAME) {
      setCurrentState(GAME_STATES.IN_GAME);
    } else if (simulatedTime >= STATE_THRESHOLDS.ARRIVAL) {
      setCurrentState(GAME_STATES.ARRIVAL);
    } else if (simulatedTime >= STATE_THRESHOLDS.COMMUTE) {
      setCurrentState(GAME_STATES.COMMUTE);
    } else {
      setCurrentState(GAME_STATES.OFF_DAY);
    }
  }, [simulatedTime, autoAdvanceEnabled]);

  const setGameState = (state) => {
    setCurrentState(state);
    setAutoAdvanceEnabled(false); // Disable auto-advance when manually setting state
  };

  const advanceTime = (hours) => {
    setSimulatedTime((prev) => prev + hours);
  };

  const resetSimulation = () => {
    setCurrentState(GAME_STATES.OFF_DAY);
    setSimulatedTime(-96);
    setAutoAdvanceEnabled(false);
  };

  const toggleAutoAdvance = () => {
    setAutoAdvanceEnabled((prev) => !prev);
  };

  // Format time for display
  const formatTimeDisplay = () => {
    const absTime = Math.abs(simulatedTime);
    const hours = Math.floor(absTime);
    const mins = Math.round((absTime - hours) * 60);

    if (simulatedTime < 0) {
      return `T-${hours}:${String(mins).padStart(2, '0')} to kickoff`;
    } else {
      return `Kickoff +${hours}:${String(mins).padStart(2, '0')}`;
    }
  };

  const value = {
    currentState,
    simulatedTime,
    autoAdvanceEnabled,
    setGameState,
    advanceTime,
    resetSimulation,
    toggleAutoAdvance,
    formatTimeDisplay,
    GAME_STATES,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
