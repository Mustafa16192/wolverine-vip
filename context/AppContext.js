import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AppContext - Mode Management
 *
 * Manages the app's two primary modes:
 * - Game Day Mode: Sequential journey experience
 * - Non-Game Day Mode: Bento dashboard with stats, news, shop
 */

const AppContext = createContext();
const GAME_DAY_PHASES = ['morning', 'tailgate', 'travel', 'parking', 'pregame', 'ingame', 'postgame', 'home'];

const INTENT_PHASE_MAP = {
  parking: 'parking',
  travel: 'travel',
  entry: 'pregame',
  ingame: 'ingame',
  postgame: 'postgame',
  home: 'home',
};

// Mock schedule data - in production, this would come from an API
const GAME_SCHEDULE = [
  { date: '2026-09-05', opponent: 'Fresno State', time: '12:00 PM', isHome: true },
  { date: '2026-09-12', opponent: 'Texas', time: '3:30 PM', isHome: true },
  { date: '2026-09-19', opponent: 'Arkansas State', time: '12:00 PM', isHome: true },
  { date: '2026-09-26', opponent: 'USC', time: '7:30 PM', isHome: false },
  { date: '2026-10-03', opponent: 'Minnesota', time: '12:00 PM', isHome: true },
  { date: '2026-10-10', opponent: 'Northwestern', time: '3:30 PM', isHome: false },
  { date: '2026-10-17', opponent: 'Illinois', time: '12:00 PM', isHome: true },
  { date: '2026-10-24', opponent: 'Michigan State', time: '7:30 PM', isHome: true },
  { date: '2026-11-07', opponent: 'Indiana', time: '3:30 PM', isHome: false },
  { date: '2026-11-14', opponent: 'Penn State', time: '12:00 PM', isHome: true },
  { date: '2026-11-21', opponent: 'Maryland', time: '12:00 PM', isHome: false },
  { date: '2026-11-28', opponent: 'Ohio State', time: '12:00 PM', isHome: true },
];

// User profile mock data
const USER_PROFILE = {
  name: 'Mustafa',
  memberSince: 2014,
  yearsAsMember: 12,
  seat: {
    section: '24',
    row: '10',
    seat: '4',
  },
  stats: {
    gamesAttended: 96,
    winsWitnessed: 84,
    fanRank: 'Top 5%',
    championships: 3,
  },
  parking: {
    lot: 'Gold Lot A',
    spot: 'G-142',
  },
};

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

export function AppProvider({ children }) {
  const [isGameDay, setIsGameDay] = useState(false);
  const [manualModeOverride, setManualModeOverride] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);
  const [nextGame, setNextGame] = useState(null);
  const [gameDayPhase, setGameDayPhase] = useState('morning'); // morning, tailgate, travel, parking, pregame, ingame, postgame, home

  const resolvePhaseByTime = (referenceGame) => {
    const kickoff = parseKickoffDate(referenceGame);
    if (!kickoff) return 'morning';

    // Positive values are hours until kickoff; negatives are hours after kickoff.
    const deltaHours = (kickoff.getTime() - Date.now()) / (1000 * 60 * 60);

    if (deltaHours > 6) return 'morning';
    if (deltaHours > 3) return 'tailgate';
    if (deltaHours > 1.5) return 'travel';
    if (deltaHours > 0.5) return 'parking';
    if (deltaHours > 0) return 'pregame';
    if (deltaHours > -3.5) return 'ingame';
    if (deltaHours > -6) return 'postgame';
    return 'home';
  };

  const resolvePhaseForIntent = (intent, referenceGame) => {
    if (intent && INTENT_PHASE_MAP[intent]) return INTENT_PHASE_MAP[intent];
    return resolvePhaseByTime(referenceGame);
  };

  // Check if today is a game day
  useEffect(() => {
    const checkGameDay = () => {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];

      const todaysGame = GAME_SCHEDULE.find(game => game.date === todayStr && game.isHome);
      const upcoming = GAME_SCHEDULE
        .filter(game => new Date(game.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

      setCurrentGame(todaysGame || null);
      setNextGame(upcoming || null);

      // Auto-detect game day (only for home games)
      if (manualModeOverride !== null) {
        setIsGameDay(manualModeOverride);
      } else {
        setIsGameDay(!!todaysGame);
      }
    };

    checkGameDay();
    // Check every minute for auto-switching
    const interval = setInterval(checkGameDay, 60000);
    return () => clearInterval(interval);
  }, [manualModeOverride]);

  // Toggle mode manually
  const toggleMode = () => {
    if (isGameDay) {
      setManualModeOverride(false);
      setIsGameDay(false);
    } else {
      const phase = resolvePhaseForIntent('journey', currentGame || nextGame);
      setManualModeOverride(true);
      setIsGameDay(true);
      setGameDayPhase(phase);
    }
  };

  // Reset to auto-detection
  const resetToAutoMode = () => {
    setManualModeOverride(null);
  };

  const enterGameDay = ({ intent = 'journey' } = {}) => {
    const phase = resolvePhaseForIntent(intent, currentGame || nextGame);
    setManualModeOverride(true);
    setIsGameDay(true);
    setGameDayPhase(phase);
  };

  const exitGameDay = () => {
    setManualModeOverride(false);
    setIsGameDay(false);
    setGameDayPhase('morning');
  };

  // Game day phase progression
  const advancePhase = () => {
    const currentIndex = GAME_DAY_PHASES.indexOf(gameDayPhase);
    if (currentIndex < GAME_DAY_PHASES.length - 1) {
      setGameDayPhase(GAME_DAY_PHASES[currentIndex + 1]);
    }
  };

  const goToPhase = (phase) => {
    setGameDayPhase(phase);
  };

  const value = {
    // Mode state
    isGameDay,
    toggleMode,
    resetToAutoMode,
    enterGameDay,
    exitGameDay,
    manualModeOverride,

    // Game info
    currentGame,
    nextGame,
    schedule: GAME_SCHEDULE,

    // Game day phases
    gameDayPhase,
    advancePhase,
    goToPhase,

    // User data
    user: USER_PROFILE,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export default AppContext;
