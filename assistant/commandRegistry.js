export const COMMAND_REGISTRY = {
  'navigate.home': {
    type: 'navigate.home',
    payloadShape: {},
    description: 'Open Home tab',
  },
  'navigate.ticket': {
    type: 'navigate.ticket',
    payloadShape: {},
    description: 'Open Ticket tab',
  },
  'navigate.news': {
    type: 'navigate.news',
    payloadShape: {},
    description: 'Open News tab',
  },
  'navigate.shop': {
    type: 'navigate.shop',
    payloadShape: {},
    description: 'Open Shop tab',
  },
  'navigate.stats': {
    type: 'navigate.stats',
    payloadShape: {},
    description: 'Open Stats tab',
  },
  'open.liveOpsDetail': {
    type: 'open.liveOpsDetail',
    payloadShape: { opId: 'string' },
    description: 'Open a Live Ops detail card',
  },
  'gameDay.enter': {
    type: 'gameDay.enter',
    payloadShape: { intent: 'string?' },
    description: 'Enter game day mode with intent',
  },
  'gameDay.exit': {
    type: 'gameDay.exit',
    payloadShape: {},
    description: 'Exit game day mode',
  },
  'gameDay.goToPhase': {
    type: 'gameDay.goToPhase',
    payloadShape: { phase: 'string' },
    description: 'Jump to game day phase',
  },
  'ticket.flipPass': {
    type: 'ticket.flipPass',
    payloadShape: {},
    description: 'Flip ticket to reveal/hide QR',
  },
  'news.setFilter': {
    type: 'news.setFilter',
    payloadShape: { filter: 'string' },
    description: 'Set news filter chip',
  },
  'shop.setCategory': {
    type: 'shop.setCategory',
    payloadShape: { category: 'string' },
    description: 'Set active shop category',
  },
};

export function isKnownCommand(type) {
  return !!COMMAND_REGISTRY[type];
}

export function normalizeAction(action) {
  return {
    id: action.id || `${action.type}-${Date.now()}`,
    type: action.type,
    payload: action.payload || {},
    risk: action.risk || 'low',
    requiresConfirmation: action.requiresConfirmation ?? false,
  };
}

export function inferActionFromText(text = '') {
  const lower = text.toLowerCase();
  const actions = [];

  if (lower.includes('exclusive') && lower.includes('news')) {
    actions.push({
      id: 'intent-news-exclusive',
      type: 'news.setFilter',
      payload: { filter: 'Exclusive' },
      risk: 'low',
      requiresConfirmation: false,
    });
  } else if (lower.includes('analysis') && lower.includes('news')) {
    actions.push({
      id: 'intent-news-analysis',
      type: 'news.setFilter',
      payload: { filter: 'Analysis' },
      risk: 'low',
      requiresConfirmation: false,
    });
  } else if (lower.includes('team news')) {
    actions.push({
      id: 'intent-news-team',
      type: 'news.setFilter',
      payload: { filter: 'Team News' },
      risk: 'low',
      requiresConfirmation: false,
    });
  }

  if (lower.includes('jersey')) {
    actions.push({
      id: 'intent-shop-jerseys',
      type: 'shop.setCategory',
      payload: { category: 'Jerseys' },
      risk: 'low',
      requiresConfirmation: false,
    });
  } else if (lower.includes('apparel') || lower.includes('hoodie') || lower.includes('polo')) {
    actions.push({
      id: 'intent-shop-apparel',
      type: 'shop.setCategory',
      payload: { category: 'Apparel' },
      risk: 'low',
      requiresConfirmation: false,
    });
  } else if (lower.includes('accessories') || lower.includes('cap') || lower.includes('scarf')) {
    actions.push({
      id: 'intent-shop-accessories',
      type: 'shop.setCategory',
      payload: { category: 'Accessories' },
      risk: 'low',
      requiresConfirmation: false,
    });
  }

  if (lower.includes('parking')) {
    actions.push({
      id: 'intent-parking',
      type: 'open.liveOpsDetail',
      payload: { opId: 'parking' },
      risk: 'low',
      requiresConfirmation: false,
    });
  }

  if (lower.includes('ticket') || lower.includes('qr')) {
    actions.push({
      id: 'intent-ticket',
      type: 'navigate.ticket',
      payload: {},
      risk: 'low',
      requiresConfirmation: false,
    });
    actions.push({
      id: 'intent-flip-pass',
      type: 'ticket.flipPass',
      payload: {},
      risk: 'low',
      requiresConfirmation: false,
    });
  }

  if (lower.includes('news')) {
    actions.push({
      id: 'intent-news',
      type: 'navigate.news',
      payload: {},
      risk: 'low',
      requiresConfirmation: false,
    });
  }

  if (lower.includes('shop') || lower.includes('merch')) {
    actions.push({
      id: 'intent-shop',
      type: 'navigate.shop',
      payload: {},
      risk: 'low',
      requiresConfirmation: false,
    });
  }

  if (lower.includes('start game day') || lower.includes('enter game day')) {
    actions.push({
      id: 'intent-game-day',
      type: 'gameDay.enter',
      payload: { intent: 'journey' },
      risk: 'low',
      requiresConfirmation: false,
    });
  }

  return actions;
}

export default COMMAND_REGISTRY;
