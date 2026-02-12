import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { buildAppSnapshot, buildProactiveSuggestion, redactForLogs } from '../assistant/contextBuilder';
import { normalizeAction } from '../assistant/commandRegistry';
import { executeAssistantAction } from '../assistant/actionExecutor';
import { canAutoExecute, enrichActionPolicy, shouldBlock } from '../assistant/policy';
import { respondViaProxy } from '../assistant/service/assistantClient';
import { respondWithMock } from '../assistant/service/mockAssistantClient';
import { useApp } from './AppContext';

const AssistantContext = createContext(null);

const PROACTIVE_COOLDOWN_MS = 10 * 60 * 1000;

function summarizeInput(input) {
  if (input.mode === 'voice') return input.text || 'Voice command';
  if (input.mode === 'image') return input.text || 'Image submitted';
  return input.text || '';
}

function ensureResponseShape(response) {
  return {
    message: response?.message || 'I am ready to help with your next move.',
    cards: Array.isArray(response?.cards) ? response.cards : [],
    actions: Array.isArray(response?.actions) ? response.actions : [],
  };
}

export function AssistantProvider({
  children,
  routeName,
  navigationRef,
  assistantEnabled = true,
}) {
  const { user, currentGame, nextGame, isGameDay, gameDayPhase, enterGameDay, exitGameDay, goToPhase } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [lastResponse, setLastResponse] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [lastError, setLastError] = useState(null);
  const [selectedNewsFilter, setSelectedNewsFilter] = useState('All');
  const [selectedShopCategory, setSelectedShopCategory] = useState('All');
  const [proactiveEnabled, setProactiveEnabled] = useState(true);

  const lastProactiveAtRef = useRef(0);

  const snapshot = useMemo(
    () =>
      buildAppSnapshot({
        routeName,
        isGameDay,
        gameDayPhase,
        currentGame,
        nextGame,
        user,
      }),
    [routeName, isGameDay, gameDayPhase, currentGame, nextGame, user]
  );

  const trackEvent = (event, payload = {}) => {
    // Keep telemetry lightweight and redacted for V1.
    console.log('[assistant-event]', event, payload);
  };

  const executeAction = async (action) => {
    const normalized = enrichActionPolicy(normalizeAction(action));

    if (shouldBlock(normalized)) {
      trackEvent('action_blocked', { type: normalized.type, risk: normalized.risk });
      return { ok: false, blocked: true, action: normalized };
    }

    const result = await executeAssistantAction(normalized, {
      navigationRef,
      enterGameDay,
      exitGameDay,
      goToPhase,
      setNewsFilter: setSelectedNewsFilter,
      setShopCategory: setSelectedShopCategory,
    });

    trackEvent('action_executed', {
      type: normalized.type,
      ok: !!result?.ok,
      risk: normalized.risk,
    });

    return result;
  };

  const sendInput = async (input) => {
    if (!assistantEnabled) return null;

    const normalizedInput = {
      mode: input?.mode || 'text',
      text: input?.text || '',
      audioUri: input?.audioUri,
      imageUri: input?.imageUri,
    };

    setLastError(null);
    setIsThinking(true);
    setHasUnread(false);

    const now = Date.now();
    const userEntry = {
      id: `u-${now}`,
      role: 'user',
      mode: normalizedInput.mode,
      text: summarizeInput(normalizedInput),
      createdAt: now,
    };

    setConversationHistory(prev => [...prev, userEntry]);

    let response;

    try {
      response = await respondViaProxy({ input: normalizedInput, snapshot });
      trackEvent('proxy_success', { routeName: snapshot.routeName });
    } catch (error) {
      response = await respondWithMock({ input: normalizedInput, snapshot });
      const redacted = redactForLogs(snapshot);
      trackEvent('proxy_fallback', {
        reason: error?.message || 'unknown_error',
        snapshot: redacted,
      });
      setLastError('Live assistant unavailable, using local copilot intelligence.');
    }

    const shaped = ensureResponseShape(response);
    const normalizedActions = shaped.actions.map(action => enrichActionPolicy(normalizeAction(action)));

    const assistantEntry = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      mode: 'text',
      text: shaped.message,
      cards: shaped.cards,
      actions: normalizedActions,
      createdAt: Date.now(),
    };

    setConversationHistory(prev => [...prev, assistantEntry]);
    setLastResponse({ ...shaped, actions: normalizedActions });

    for (const action of normalizedActions) {
      if (canAutoExecute(action)) {
        await executeAction(action);
      }
    }

    setIsThinking(false);
    return { ...shaped, actions: normalizedActions };
  };

  useEffect(() => {
    if (!assistantEnabled || !proactiveEnabled) return;
    if (!routeName) return;
    if (isThinking) return;

    const now = Date.now();
    if (now - lastProactiveAtRef.current < PROACTIVE_COOLDOWN_MS) return;

    const suggestion = buildProactiveSuggestion(snapshot);
    if (!suggestion?.message) return;

    const proactiveEntry = {
      id: `p-${now}`,
      role: 'assistant',
      mode: 'text',
      text: suggestion.message,
      cards: suggestion.cards || [],
      actions: (suggestion.actions || []).map(action => enrichActionPolicy(normalizeAction(action))),
      createdAt: now,
      proactive: true,
    };

    setConversationHistory(prev => [...prev, proactiveEntry]);
    setLastResponse({
      message: proactiveEntry.text,
      cards: proactiveEntry.cards,
      actions: proactiveEntry.actions,
    });
    setHasUnread(true);
    lastProactiveAtRef.current = now;
    trackEvent('proactive_suggestion', {
      routeName: snapshot.routeName,
      phase: snapshot.gameDayPhase,
    });
  }, [assistantEnabled, proactiveEnabled, routeName, isGameDay, gameDayPhase, isThinking, snapshot]);

  const openAssistant = () => {
    setIsOpen(true);
    setHasUnread(false);
  };

  const closeAssistant = () => setIsOpen(false);

  const clearHistory = () => {
    setConversationHistory([]);
    setLastResponse(null);
    setLastError(null);
    setHasUnread(false);
  };

  const startQuickVoiceCapture = async () => {
    openAssistant();
    await sendInput({
      mode: 'voice',
      text: 'Help me with the current highest-priority next step.',
    });
  };

  const value = {
    assistantEnabled,
    proactiveEnabled,
    setProactiveEnabled,

    isOpen,
    isThinking,
    hasUnread,
    lastError,

    lastResponse,
    conversationHistory,

    selectedNewsFilter,
    setNewsFilter: setSelectedNewsFilter,
    selectedShopCategory,
    setShopCategory: setSelectedShopCategory,

    openAssistant,
    closeAssistant,
    clearHistory,

    sendInput,
    executeAction,
    startQuickVoiceCapture,

    snapshot,
  };

  return (
    <AssistantContext.Provider value={value}>
      {children}
    </AssistantContext.Provider>
  );
}

export function useAssistant() {
  const context = useContext(AssistantContext);
  if (!context) {
    throw new Error('useAssistant must be used within an AssistantProvider');
  }
  return context;
}

export default AssistantContext;
