import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, StatusBar, TouchableOpacity, Switch } from 'react-native';
import { COLORS, SPACING } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Smartphone, Lock, TrendingUp, Trophy, Calendar, Users } from 'lucide-react-native';

export default function WidgetScreen() {
  const [lockScreenEnabled, setLockScreenEnabled] = useState(true);
  const [homeScreenEnabled, setHomeScreenEnabled] = useState(true);
  const [selectedStats, setSelectedStats] = useState(['tenure', 'rank']);

  const widgetOptions = [
    { id: 'tenure', icon: Calendar, label: '12 Years', color: '#FFCB05' },
    { id: 'wins', icon: Trophy, label: '84 Wins', color: '#00274C' },
    { id: 'rank', icon: TrendingUp, label: 'Top 5%', color: '#FFCB05' },
    { id: 'since', icon: Users, label: 'Since 2013', color: '#00274C' },
  ];

  const toggleStat = (statId) => {
    if (selectedStats.includes(statId)) {
      setSelectedStats(selectedStats.filter(id => id !== statId));
    } else {
      if (selectedStats.length < 3) {
        setSelectedStats([...selectedStats, statId]);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.background, '#000']}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Customize Widgets</Text>
            <Text style={styles.subtitle}>
              Choose up to 3 stats to display on your home and lock screen
            </Text>
          </View>

          {/* Widget Type Toggles */}
          <View style={styles.section}>
            <View style={styles.toggleCard}>
              <View style={styles.toggleLeft}>
                <Lock size={24} color={COLORS.secondary} />
                <View style={styles.toggleText}>
                  <Text style={styles.toggleTitle}>Lock Screen Widget</Text>
                  <Text style={styles.toggleSub}>Quick glance stats</Text>
                </View>
              </View>
              <Switch
                value={lockScreenEnabled}
                onValueChange={setLockScreenEnabled}
                trackColor={{ false: '#3e3e3e', true: COLORS.secondary }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.toggleCard}>
              <View style={styles.toggleLeft}>
                <Smartphone size={24} color={COLORS.secondary} />
                <View style={styles.toggleText}>
                  <Text style={styles.toggleTitle}>Home Screen Widget</Text>
                  <Text style={styles.toggleSub}>Larger detailed view</Text>
                </View>
              </View>
              <Switch
                value={homeScreenEnabled}
                onValueChange={setHomeScreenEnabled}
                trackColor={{ false: '#3e3e3e', true: COLORS.secondary }}
                thumbColor="#fff"
              />
            </View>
          </View>

          {/* Stat Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>SELECT YOUR STATS</Text>
            <Text style={styles.sectionSub}>
              Choose up to 3 stats • {selectedStats.length}/3 selected
            </Text>

            <View style={styles.statsGrid}>
              {widgetOptions.map((stat) => {
                const Icon = stat.icon;
                const isSelected = selectedStats.includes(stat.id);
                return (
                  <TouchableOpacity
                    key={stat.id}
                    style={[
                      styles.statOption,
                      { backgroundColor: isSelected ? stat.color : 'rgba(255, 255, 255, 0.05)' },
                    ]}
                    onPress={() => toggleStat(stat.id)}
                    disabled={!isSelected && selectedStats.length >= 3}
                  >
                    <Icon
                      size={32}
                      color={isSelected ? (stat.color === '#FFCB05' ? COLORS.primary : COLORS.secondary) : COLORS.textSecondary}
                    />
                    <Text
                      style={[
                        styles.statOptionLabel,
                        { color: isSelected ? (stat.color === '#FFCB05' ? COLORS.primary : COLORS.secondary) : COLORS.textSecondary },
                      ]}
                    >
                      {stat.label}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkmark}>
                        <Text style={styles.checkmarkText}>✓</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Preview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>WIDGET PREVIEW</Text>
            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>WOLVERINE VIP</Text>
              <View style={styles.previewStats}>
                {selectedStats.slice(0, 3).map((statId) => {
                  const stat = widgetOptions.find(s => s.id === statId);
                  return (
                    <View key={statId} style={styles.previewStat}>
                      <Text style={styles.previewStatValue}>{stat.label}</Text>
                    </View>
                  );
                })}
              </View>
              <Text style={styles.previewFooter}>Season Ticket Holder</Text>
            </View>
          </View>

          {/* Info */}
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              💡 To add widgets: Long press your home or lock screen, tap the "+" button, and search for "Wolverine VIP"
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SPACING.m,
    paddingBottom: 100,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '800',
    marginBottom: SPACING.s,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },

  // Sections
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    color: COLORS.secondary,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: SPACING.s,
  },
  sectionSub: {
    color: COLORS.textSecondary,
    fontSize: 13,
    marginBottom: SPACING.m,
  },

  // Toggle Cards
  toggleCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  toggleText: {
    marginLeft: SPACING.m,
    flex: 1,
  },
  toggleTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  toggleSub: {
    color: COLORS.textSecondary,
    fontSize: 12,
  },

  // Stat Options
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statOption: {
    width: '48%',
    aspectRatio: 1.3,
    borderRadius: 20,
    padding: SPACING.m,
    marginBottom: SPACING.m,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
  },
  statOptionLabel: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: SPACING.s,
    textAlign: 'center',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // Preview
  previewCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 20,
    padding: SPACING.l,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  previewTitle: {
    color: COLORS.secondary,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: SPACING.m,
  },
  previewStats: {
    marginBottom: SPACING.m,
  },
  previewStat: {
    marginBottom: SPACING.s,
  },
  previewStatValue: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
  },
  previewFooter: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },

  // Info
  infoCard: {
    backgroundColor: 'rgba(255, 203, 5, 0.1)',
    borderRadius: 12,
    padding: SPACING.m,
    borderWidth: 1,
    borderColor: 'rgba(255, 203, 5, 0.2)',
  },
  infoText: {
    color: COLORS.text,
    fontSize: 13,
    lineHeight: 20,
  },
});
