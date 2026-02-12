import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { BellRing, ChevronRight, Send, Sparkles, Trash2, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, CHROME } from '../../constants/theme';
import { useAssistant } from '../../context/AssistantContext';
import ResponseCard from './ResponseCard';
import VoiceInputControl from './VoiceInputControl';
import CameraInputControl from './CameraInputControl';

function actionLabel(type) {
  switch (type) {
    case 'navigate.home':
      return 'Open Home';
    case 'navigate.ticket':
      return 'Open Ticket';
    case 'navigate.news':
      return 'Open News';
    case 'navigate.shop':
      return 'Open Shop';
    case 'navigate.stats':
      return 'Open Stats';
    case 'open.liveOpsDetail':
      return 'Open Live Ops';
    case 'gameDay.enter':
      return 'Enter Game Day';
    case 'gameDay.exit':
      return 'Exit Game Day';
    case 'gameDay.goToPhase':
      return 'Jump to Phase';
    case 'ticket.flipPass':
      return 'Flip Pass';
    case 'news.setFilter':
      return 'Apply News Filter';
    case 'shop.setCategory':
      return 'Set Shop Category';
    default:
      return 'Run Action';
  }
}

export default function AssistantPanel() {
  const {
    isOpen,
    closeAssistant,
    sendInput,
    executeAction,
    isThinking,
    conversationHistory,
    clearHistory,
    lastError,
    proactiveEnabled,
    setProactiveEnabled,
    snapshot,
  } = useAssistant();

  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const scrollRef = useRef(null);
  const [inputText, setInputText] = useState('');

  const openProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(openProgress, {
      toValue: isOpen ? 1 : 0,
      friction: 8,
      tension: 72,
      useNativeDriver: true,
    }).start();
  }, [isOpen, openProgress]);

  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    });
  }, [conversationHistory, isOpen]);

  const recentHistory = useMemo(
    () => conversationHistory.slice(Math.max(0, conversationHistory.length - 10)),
    [conversationHistory]
  );

  const panelTop = insets.top + 64;
  const panelBottom = Platform.OS === 'ios' ? 94 : 76;
  const closedOffset = Math.max(260, height - panelTop + 48);

  const panelTranslate = openProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [closedOffset, 0],
  });

  const overlayOpacity = openProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleTextSend = async () => {
    const next = inputText.trim();
    if (!next || isThinking) return;

    setInputText('');
    await sendInput({ mode: 'text', text: next });
  };

  const handleVoiceCapture = async () => {
    if (isThinking) return;
    const prompt = inputText.trim() || 'Help me with the highest-priority next step right now.';
    setInputText('');
    await sendInput({ mode: 'voice', text: prompt });
  };

  const handleCameraCapture = async () => {
    if (isThinking) return;
    const prompt = inputText.trim() || 'Use this image context and guide my next move.';
    setInputText('');
    await sendInput({ mode: 'image', text: prompt });
  };

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents={isOpen ? 'auto' : 'none'}>
      <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={closeAssistant} />
      </Animated.View>

      <Animated.View
        style={[
          styles.panel,
          {
            top: panelTop,
            bottom: panelBottom,
            transform: [{ translateY: panelTranslate }],
          },
        ]}
      >
        <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
        <LinearGradient
          colors={['rgba(0, 12, 30, 0.84)', 'rgba(2, 22, 52, 0.94)']}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.headerRow}>
          <View style={styles.titleGroup}>
            <Sparkles size={15} color={COLORS.maize} />
            <Text style={styles.title}>Wolverine Copilot</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={closeAssistant} activeOpacity={0.85}>
            <X size={16} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.routeHint}>Synced to {snapshot?.routeName || 'App'} context</Text>

        <View style={styles.utilityRow}>
          <TouchableOpacity
            style={[styles.utilityChip, proactiveEnabled && styles.utilityChipActive]}
            onPress={() => setProactiveEnabled(!proactiveEnabled)}
            activeOpacity={0.85}
          >
            <BellRing size={12} color={proactiveEnabled ? COLORS.blue : COLORS.textSecondary} />
            <Text style={[styles.utilityChipText, proactiveEnabled && styles.utilityChipTextActive]}>
              Proactive {proactiveEnabled ? 'On' : 'Off'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.utilityChip} onPress={clearHistory} activeOpacity={0.85}>
            <Trash2 size={12} color={COLORS.textSecondary} />
            <Text style={styles.utilityChipText}>Clear History</Text>
          </TouchableOpacity>
        </View>

        {lastError ? <Text style={styles.errorText}>{lastError}</Text> : null}

        <ScrollView
          ref={scrollRef}
          style={styles.history}
          contentContainerStyle={styles.historyContent}
          showsVerticalScrollIndicator={false}
        >
          {recentHistory.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Action-first copilot ready.</Text>
              <Text style={styles.emptySubtitle}>
                Ask for parking routing, gate guidance, ticket access, or stats insights.
              </Text>
            </View>
          ) : null}

          {recentHistory.map((entry) => {
            const isUser = entry.role === 'user';
            return (
              <View key={entry.id} style={[styles.messageGroup, isUser && styles.messageGroupUser]}>
                <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
                  <Text style={isUser ? styles.userText : styles.assistantText}>{entry.text}</Text>
                </View>

                {!isUser && Array.isArray(entry.cards)
                  ? entry.cards.map((card, index) => (
                      <ResponseCard key={`${entry.id}-card-${index}`} card={card} />
                    ))
                  : null}

                {!isUser && Array.isArray(entry.actions) && entry.actions.length > 0 ? (
                  <View style={styles.actionWrap}>
                    {entry.actions.map((action) => (
                      <TouchableOpacity
                        key={action.id}
                        style={styles.actionChip}
                        activeOpacity={0.85}
                        onPress={() => executeAction(action)}
                      >
                        <Text style={styles.actionChipText}>{actionLabel(action.type)}</Text>
                        <ChevronRight size={14} color={COLORS.blue} />
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.inputShell}>
          <VoiceInputControl onCapture={handleVoiceCapture} disabled={isThinking} />
          <CameraInputControl onCapture={handleCameraCapture} disabled={isThinking} />

          <View style={styles.inputWrap}>
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Tell me what to do next..."
              placeholderTextColor={COLORS.textSecondary}
              style={styles.input}
              multiline
              maxLength={420}
              editable={!isThinking}
            />
          </View>

          <TouchableOpacity
            style={[styles.sendButton, (!inputText.trim() || isThinking) && styles.sendButtonDisabled]}
            onPress={handleTextSend}
            disabled={!inputText.trim() || isThinking}
            activeOpacity={0.85}
          >
            {isThinking ? (
              <ActivityIndicator size="small" color={COLORS.blue} />
            ) : (
              <Send size={16} color={COLORS.blue} />
            )}
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  panel: {
    position: 'absolute',
    left: 18,
    right: 18,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: CHROME.surface.border,
    overflow: 'hidden',
    padding: SPACING.m,
    gap: SPACING.s,
    zIndex: 150,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  title: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.4,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
    backgroundColor: CHROME.surface.elevated,
  },
  routeHint: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  utilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    flexWrap: 'wrap',
  },
  utilityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
    backgroundColor: CHROME.surface.elevated,
  },
  utilityChipActive: {
    borderColor: COLORS.maize,
    backgroundColor: COLORS.maize,
  },
  utilityChipText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
  },
  utilityChipTextActive: {
    color: COLORS.blue,
  },
  errorText: {
    color: '#FFB4B4',
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  history: {
    flex: 1,
  },
  historyContent: {
    paddingBottom: SPACING.xs,
    gap: SPACING.s,
  },
  emptyState: {
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
    backgroundColor: CHROME.surface.base,
    padding: SPACING.s,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 2,
  },
  emptySubtitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 18,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  messageGroup: {
    alignItems: 'flex-start',
  },
  messageGroupUser: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '90%',
    borderRadius: RADIUS.md,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 6,
  },
  userBubble: {
    borderColor: 'rgba(255,203,5,0.45)',
    backgroundColor: 'rgba(255,203,5,0.18)',
  },
  assistantBubble: {
    borderColor: CHROME.surface.borderSoft,
    backgroundColor: CHROME.surface.base,
  },
  userText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 18,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  assistantText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 18,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  actionWrap: {
    width: '100%',
    gap: 6,
    marginTop: 2,
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.42)',
    backgroundColor: 'rgba(255,203,5,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  actionChipText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.3,
  },
  inputShell: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: SPACING.xs,
  },
  inputWrap: {
    flex: 1,
    minHeight: 40,
    maxHeight: 86,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
    backgroundColor: CHROME.surface.base,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 9 : 5,
  },
  input: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  sendButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.maize,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
});
