import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * AppContext - Mode Management
 *
 * Manages the app's two primary modes:
 * - Game Day Mode: Sequential journey experience
 * - Non-Game Day Mode: Bento dashboard with stats, news, shop
 */

const AppContext = createContext();

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

export function AppProvider({ children }) {
  const [isGameDay, setIsGameDay] = useState(false);
  const [manualModeOverride, setManualModeOverride] = useState(null);
  const [currentGame, setCurrentGame] = useState(null);
  const [nextGame, setNextGame] = useState(null);
  const [gameDayPhase, setGameDayPhase] = useState('morning'); // morning, tailgate, travel, parking, pregame, ingame, postgame, home

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
    setManualModeOverride(prev => prev === null ? !isGameDay : !prev);
  };

  // Reset to auto-detection
  const resetToAutoMode = () => {
    setManualModeOverride(null);
  };

  // Game day phase progression
  const advancePhase = () => {
    const phases = ['morning', 'tailgate', 'travel', 'parking', 'pregame', 'ingame', 'postgame', 'home'];
    const currentIndex = phases.indexOf(gameDayPhase);
    if (currentIndex < phases.length - 1) {
      setGameDayPhase(phases[currentIndex + 1]);
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
