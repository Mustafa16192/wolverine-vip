import { inferActionFromText } from '../commandRegistry';

function buildContextCard(snapshot) {
  if (!snapshot) return null;

  if (snapshot.routeName === 'Dashboard') {
    return {
      kind: 'timeline',
      data: {
        title: snapshot.isGameDay ? 'Game Day Priorities' : 'Season HQ Priorities',
        body: snapshot.isGameDay
          ? `Phase: ${snapshot.gameDayPhase}. I can move you directly to parking, gate, or ticket execution flows.`
          : `Next matchup: ${snapshot.nextGame?.opponent || 'TBD'}. I can stage travel and gate plans now.`,
      },
    };
  }

  if (snapshot.routeName === 'Ticket') {
    return {
      kind: 'ticket',
      data: {
        title: 'Seat Command Ready',
        body: `Section ${snapshot.user?.seat?.section}, Row ${snapshot.user?.seat?.row}, Seat ${snapshot.user?.seat?.seat}`,
      },
    };
  }

  if (snapshot.routeName === 'News') {
    return {
      kind: 'news',
      data: {
        title: 'Insider Feed Focus',
        body: 'I can switch filters and pull priority stories instantly.',
      },
    };
  }

  if (snapshot.routeName === 'Shop') {
    return {
      kind: 'shop',
      data: {
        title: 'VIP Shop Concierge',
        body: 'I can jump to the right product category based on your request.',
      },
    };
  }

  return {
    kind: 'route',
    data: {
      title: 'Assistant Synced',
      body: 'I am synced to your current screen context and can execute actions directly.',
    },
  };
}

function multimodalPrefix(input) {
  if (input.mode === 'voice') return 'Voice received. ';
  if (input.mode === 'image') return 'Image context received. ';
  return '';
}

export async function respondWithMock({ input, snapshot }) {
  const text = input?.text || '';
  const inferredActions = inferActionFromText(text);
  const contextCard = buildContextCard(snapshot);
  const cards = contextCard ? [contextCard] : [];

  const message = `${multimodalPrefix(input)}I can execute this now or refine it further.`;

  return {
    message,
    cards,
    actions: inferredActions,
  };
}

export default respondWithMock;
