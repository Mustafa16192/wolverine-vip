const SCREEN_HINTS = {
  Dashboard: 'Season HQ overview: matchup, countdown, live ops, concierge, and journey priorities.',
  LiveOpsDetail: 'Live operations detail: parking, gate, weather, and route action plans.',
  GameDayHome: 'Game day command flow with active phase, next steps, and quick action opportunities.',
  MorningPhase: 'Morning game-day preparation, weather checks, and readiness checklist.',
  TailgatePhase: 'Tailgate stage orchestration, social and timing decisions before travel.',
  TravelPhase: 'Travel coordination for ETA, route health, and lot arrival.',
  ParkingPhase: 'Parking wayfinding, lot/spot assignment, and gate transition guidance.',
  PregamePhase: 'Entry, gate handoff, and pre-kickoff sequencing.',
  IngamePhase: 'In-game support: seat services, quick actions, and real-time convenience.',
  PostgamePhase: 'Postgame exit planning and congestion-aware return routing.',
  HomePhase: 'Return-home wrap-up and next-game preparation.',
  Ticket: 'Seat command pass, QR access, and concierge modules.',
  News: 'Insider wire stories, reels-like feed, and category filters.',
  Shop: 'VIP shop with categories, featured merch, and curated picks.',
  Stats: 'Team and fan stats with standings and performance cards.',
  Home: 'Top-level tab route that usually resolves to Dashboard.',
};

export function buildAppSnapshot({
  routeName,
  isGameDay,
  gameDayPhase,
  currentGame,
  nextGame,
  user,
}) {
  const safeUser = user
    ? {
        name: user.name,
        seat: { ...user.seat },
        parking: { ...user.parking },
      }
    : {
        name: 'Member',
        seat: { section: '', row: '', seat: '' },
        parking: { lot: '', spot: '' },
      };

  return {
    routeName: routeName || 'Unknown',
    isGameDay: !!isGameDay,
    gameDayPhase: gameDayPhase || 'morning',
    currentGame: currentGame || undefined,
    nextGame: nextGame || undefined,
    user: safeUser,
    screenHint: SCREEN_HINTS[routeName] || SCREEN_HINTS.Home,
  };
}

export function redactForLogs(snapshot) {
  if (!snapshot) return null;
  return {
    routeName: snapshot.routeName,
    isGameDay: snapshot.isGameDay,
    gameDayPhase: snapshot.gameDayPhase,
    currentGame: snapshot.currentGame
      ? {
          opponent: snapshot.currentGame.opponent,
          date: snapshot.currentGame.date,
          time: snapshot.currentGame.time,
          isHome: snapshot.currentGame.isHome,
        }
      : undefined,
    nextGame: snapshot.nextGame
      ? {
          opponent: snapshot.nextGame.opponent,
          date: snapshot.nextGame.date,
          time: snapshot.nextGame.time,
          isHome: snapshot.nextGame.isHome,
        }
      : undefined,
    user: {
      name: snapshot.user?.name || 'Member',
      seat: {
        section: snapshot.user?.seat?.section,
        row: snapshot.user?.seat?.row,
        seat: snapshot.user?.seat?.seat,
      },
      parking: {
        lot: snapshot.user?.parking?.lot,
        spot: snapshot.user?.parking?.spot,
      },
    },
  };
}

export function buildProactiveSuggestion(snapshot) {
  const route = snapshot?.routeName || 'Home';
  const phase = snapshot?.gameDayPhase || 'morning';

  if (route === 'Dashboard') {
    return {
      message: 'I can prep your next high-value move now. Want parking, gate routing, or direct ticket access?',
      cards: [
        {
          kind: 'route',
          data: {
            title: 'Next Best Move',
            body: snapshot?.isGameDay
              ? `You are in ${phase.toUpperCase()} phase. I can move you to the right detail instantly.`
              : 'Season planning mode is active. I can stage your route and gate flow for the next game.',
          },
        },
      ],
      actions: [
        {
          id: 'proactive-open-parking',
          type: 'open.liveOpsDetail',
          payload: { opId: 'parking' },
          risk: 'low',
          requiresConfirmation: false,
        },
      ],
    };
  }

  if (route === 'Ticket') {
    return {
      message: 'Your pass is ready. I can flip to QR or launch gate routing in one step.',
      cards: [{ kind: 'ticket', data: { title: 'Seat Command Ready' } }],
      actions: [
        {
          id: 'proactive-flip-pass',
          type: 'ticket.flipPass',
          payload: {},
          risk: 'low',
          requiresConfirmation: false,
        },
      ],
    };
  }

  return {
    message: 'I am synced with this screen and ready to execute your next step.',
    cards: [],
    actions: [],
  };
}
