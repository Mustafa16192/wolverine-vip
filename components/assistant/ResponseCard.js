import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, CHROME } from '../../constants/theme';

const KIND_LABELS = {
  timeline: 'Timeline',
  route: 'Route',
  ticket: 'Ticket',
  news: 'News',
  stats: 'Stats',
  shop: 'Shop',
};

export default function ResponseCard({ card }) {
  const kind = card?.kind || 'route';
  const data = card?.data || {};

  return (
    <View style={styles.card}>
      <BlurView intensity={24} tint="dark" style={StyleSheet.absoluteFill} />
      <View style={styles.headerRow}>
        <Text style={styles.kind}>{KIND_LABELS[kind] || 'Copilot'}</Text>
      </View>
      <Text style={styles.title}>{data.title || 'Action Insight'}</Text>
      {data.body ? <Text style={styles.body}>{data.body}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: CHROME.surface.borderSoft,
    backgroundColor: CHROME.surface.base,
    overflow: 'hidden',
    padding: SPACING.s,
    marginBottom: SPACING.s,
  },
  headerRow: {
    marginBottom: 4,
  },
  kind: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 0.8,
  },
  title: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 3,
  },
  body: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    lineHeight: 18,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
});
