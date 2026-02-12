const HIGH_RISK_PREFIXES = ['payment.', 'account.', 'security.', 'profile.'];

const DEFAULT_LOW_RISK_COMMANDS = new Set([
  'navigate.home',
  'navigate.ticket',
  'navigate.news',
  'navigate.shop',
  'navigate.stats',
  'open.liveOpsDetail',
  'gameDay.enter',
  'gameDay.exit',
  'gameDay.goToPhase',
  'ticket.flipPass',
  'news.setFilter',
  'shop.setCategory',
]);

export function inferRiskByType(type) {
  if (!type) return 'high';
  if (HIGH_RISK_PREFIXES.some(prefix => type.startsWith(prefix))) return 'high';
  if (DEFAULT_LOW_RISK_COMMANDS.has(type)) return 'low';
  return 'high';
}

export function enrichActionPolicy(action) {
  const inferredRisk = action.risk || inferRiskByType(action.type);
  const requiresConfirmation = action.requiresConfirmation ?? inferredRisk === 'high';
  return {
    ...action,
    risk: inferredRisk,
    requiresConfirmation,
  };
}

export function canAutoExecute(action) {
  const normalized = enrichActionPolicy(action);
  return normalized.risk === 'low' && normalized.requiresConfirmation === false;
}

export function shouldBlock(action) {
  const normalized = enrichActionPolicy(action);
  return normalized.risk === 'high' && normalized.requiresConfirmation;
}

export default {
  enrichActionPolicy,
  canAutoExecute,
  shouldBlock,
};
