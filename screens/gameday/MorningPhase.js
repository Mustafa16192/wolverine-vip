import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { BlurView } from 'expo-blur';
import {
  Sun,
  Cloud,
  Thermometer,
  Clock,
  ChevronRight,
  CheckCircle,
  Circle,
  ArrowLeft,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';

/**
 * MorningPhase - Game Day Wake Up
 *
 * Start the game day with weather, schedule overview,
 * and checklist of things to prepare.
 */

const CHECKLIST = [
  { id: 1, label: 'Check weather forecast', completed: true },
  { id: 2, label: 'Review parking pass', completed: true },
  { id: 3, label: 'Pack game day essentials', completed: false },
  { id: 4, label: 'Charge phone', completed: false },
  { id: 5, label: 'Confirm tailgate meetup', completed: false },
];

const SCHEDULE = [
  { time: '8:00 AM', event: 'Wake up & get ready' },
  { time: '9:30 AM', event: 'Tailgate starts' },
  { time: '11:00 AM', event: 'Head to stadium' },
  { time: '11:30 AM', event: 'Gates open' },
  { time: '12:00 PM', event: 'KICKOFF' },
];

export default function MorningPhase({ navigation }) {
  const { user, currentGame, advancePhase } = useApp();

  const handleContinue = () => {
    advancePhase();
    navigation.navigate('GameDayHome');
  };

  return (
    <View style={styles.container}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.blue }]} />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>GOOD MORNING</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Greeting Card */}
          <View style={styles.greetingCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.greetingContent}>
              <Sun size={48} color={COLORS.maize} />
              <View style={styles.greetingText}>
                <Text style={styles.greetingTitle}>It's Game Day, {user.name}!</Text>
                <Text style={styles.greetingSubtitle}>
                  Michigan vs {currentGame?.opponent || 'Ohio State'}
                </Text>
              </View>
            </View>
          </View>

          {/* Weather Card */}
          <Text style={styles.sectionTitle}>WEATHER</Text>
          <View style={styles.weatherCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.weatherContent}>
              <View style={styles.weatherMain}>
                <Cloud size={40} color={COLORS.textSecondary} />
                <Text style={styles.weatherTemp}>52°F</Text>
              </View>
              <View style={styles.weatherDetails}>
                <View style={styles.weatherDetail}>
                  <Thermometer size={16} color={COLORS.textTertiary} />
                  <Text style={styles.weatherDetailText}>Feels like 48°F</Text>
                </View>
                <View style={styles.weatherDetail}>
                  <Cloud size={16} color={COLORS.textTertiary} />
                  <Text style={styles.weatherDetailText}>Partly Cloudy</Text>
                </View>
              </View>
              <Text style={styles.weatherAdvice}>
                Perfect football weather! Bring a light jacket.
              </Text>
            </View>
          </View>

          {/* Today's Schedule */}
          <Text style={styles.sectionTitle}>TODAY'S SCHEDULE</Text>
          <View style={styles.scheduleCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            {SCHEDULE.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.scheduleItem,
                  index === SCHEDULE.length - 1 && styles.scheduleItemLast,
                ]}
              >
                <View style={styles.scheduleTime}>
                  <Clock size={14} color={COLORS.maize} />
                  <Text style={styles.scheduleTimeText}>{item.time}</Text>
                </View>
                <Text
                  style={[
                    styles.scheduleEvent,
                    item.event === 'KICKOFF' && styles.scheduleEventHighlight,
                  ]}
                >
                  {item.event}
                </Text>
              </View>
            ))}
          </View>

          {/* Checklist */}
          <Text style={styles.sectionTitle}>PRE-GAME CHECKLIST</Text>
          <View style={styles.checklistCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            {CHECKLIST.map((item) => (
              <TouchableOpacity key={item.id} style={styles.checklistItem}>
                {item.completed ? (
                  <CheckCircle size={20} color={COLORS.maize} />
                ) : (
                  <Circle size={20} color={COLORS.textTertiary} />
                )}
                <Text
                  style={[
                    styles.checklistText,
                    item.completed && styles.checklistTextCompleted,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>READY FOR TAILGATE</Text>
            <ChevronRight size={20} color={COLORS.blue} />
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blue,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.m,
    paddingVertical: SPACING.m,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
  },
  scrollContent: {
    padding: SPACING.l,
    paddingBottom: 40,
  },

  // Greeting
  greetingCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.2)',
  },
  greetingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.l,
    gap: SPACING.m,
  },
  greetingText: {
    flex: 1,
  },
  greetingTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: 'Montserrat_700Bold',
  },
  greetingSubtitle: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: 'Montserrat_600SemiBold',
    marginTop: SPACING.xs,
  },

  // Section Title
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
    marginBottom: SPACING.m,
  },

  // Weather
  weatherCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  weatherContent: {
    padding: SPACING.l,
  },
  weatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
    marginBottom: SPACING.m,
  },
  weatherTemp: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.display,
    fontFamily: 'Montserrat_700Bold',
  },
  weatherDetails: {
    flexDirection: 'row',
    gap: SPACING.l,
    marginBottom: SPACING.m,
  },
  weatherDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  weatherDetailText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  weatherAdvice: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    fontStyle: 'italic',
  },

  // Schedule
  scheduleCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  scheduleItemLast: {
    borderBottomWidth: 0,
  },
  scheduleTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    width: 100,
  },
  scheduleTimeText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
  },
  scheduleEvent: {
    flex: 1,
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  scheduleEventHighlight: {
    color: COLORS.maize,
    fontFamily: 'Montserrat_700Bold',
  },

  // Checklist
  checklistCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: SPACING.m,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
    paddingVertical: SPACING.s,
  },
  checklistText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  checklistTextCompleted: {
    color: COLORS.textTertiary,
    textDecorationLine: 'line-through',
  },

  // Continue Button
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.s,
    backgroundColor: COLORS.maize,
    paddingVertical: SPACING.m,
    borderRadius: RADIUS.lg,
  },
  continueButtonText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
});
