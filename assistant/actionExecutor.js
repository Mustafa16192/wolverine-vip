import { triggerTicketFlip } from './ticketFlipBridge';

const PHASE_ROUTE_MAP = {
  morning: 'MorningPhase',
  tailgate: 'TailgatePhase',
  travel: 'TravelPhase',
  parking: 'ParkingPhase',
  pregame: 'PregamePhase',
  ingame: 'IngamePhase',
  postgame: 'PostgamePhase',
  home: 'HomePhase',
};

function safeNavigate(navigationRef, ...args) {
  if (!navigationRef?.isReady?.()) return false;
  navigationRef.navigate(...args);
  return true;
}

function delayed(ms, fn) {
  setTimeout(fn, ms);
}

export async function executeAssistantAction(action, deps) {
  const {
    navigationRef,
    enterGameDay,
    exitGameDay,
    goToPhase,
    setNewsFilter,
    setShopCategory,
  } = deps;

  switch (action.type) {
    case 'navigate.home':
      return { ok: safeNavigate(navigationRef, 'Home', { screen: 'Dashboard' }) };

    case 'navigate.ticket':
      return { ok: safeNavigate(navigationRef, 'Ticket') };

    case 'navigate.news':
      return { ok: safeNavigate(navigationRef, 'News') };

    case 'navigate.shop':
      return { ok: safeNavigate(navigationRef, 'Shop') };

    case 'navigate.stats':
      return { ok: safeNavigate(navigationRef, 'Stats') };

    case 'open.liveOpsDetail': {
      const opId = action.payload?.opId || 'parking';
      return {
        ok: safeNavigate(navigationRef, 'Home', {
          screen: 'LiveOpsDetail',
          params: { opId },
        }),
      };
    }

    case 'gameDay.enter': {
      enterGameDay?.({ intent: action.payload?.intent || 'journey' });
      const intent = action.payload?.intent;
      const phaseScreen = PHASE_ROUTE_MAP[intent];
      return {
        ok: safeNavigate(
          navigationRef,
          'Home',
          { screen: phaseScreen || 'GameDayHome' }
        ),
      };
    }

    case 'gameDay.exit': {
      exitGameDay?.();
      return { ok: safeNavigate(navigationRef, 'Home', { screen: 'Dashboard' }) };
    }

    case 'gameDay.goToPhase': {
      const phase = action.payload?.phase;
      if (!phase) return { ok: false, error: 'Missing phase' };
      goToPhase?.(phase);
      return {
        ok: safeNavigate(
          navigationRef,
          'Home',
          { screen: PHASE_ROUTE_MAP[phase] || 'GameDayHome' }
        ),
      };
    }

    case 'ticket.flipPass': {
      const navigated = safeNavigate(navigationRef, 'Ticket');
      delayed(180, () => {
        triggerTicketFlip();
      });
      return { ok: navigated || triggerTicketFlip() };
    }

    case 'news.setFilter': {
      const filter = action.payload?.filter || 'All';
      setNewsFilter?.(filter);
      const navigated = safeNavigate(navigationRef, 'News');
      return { ok: navigated };
    }

    case 'shop.setCategory': {
      const category = action.payload?.category || 'All';
      setShopCategory?.(category);
      const navigated = safeNavigate(navigationRef, 'Shop');
      return { ok: navigated };
    }

    default:
      return { ok: false, error: `Unsupported command: ${action.type}` };
  }
}

export default executeAssistantAction;
