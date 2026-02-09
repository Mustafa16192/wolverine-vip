import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Star,
  ChevronRight,
  ArrowLeft,
  Camera,
  Users,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import AppBackground from '../../components/chrome/AppBackground';

const { width } = Dimensions.get('window');

/**
 * PregamePhase - Field Experience
 *
 * VIP pre-game access: tunnel experience, warmups, photo ops.
 */

const VIP_EXPERIENCES = [
  {
    id: 1,
    title: 'Tunnel Experience',
    description: 'Watch players enter the field',
    time: '11:30 AM',
    location: 'Gate 4 Tunnel',
    icon: Users,
  },
  {
    id: 2,
    title: 'Sideline Warmups',
    description: 'View team warmups up close',
    time: '11:15 AM',
    location: 'South End Zone',
    icon: Star,
  },
  {
    id: 3,
    title: 'Photo Opportunity',
    description: 'On-field photos with Block M',
    time: '11:00 AM',
    location: 'Center Field',
    icon: Camera,
  },
];

export default function PregamePhase({ navigation }) {
  const { advancePhase, user } = useApp();

  const handleContinue = () => {
    advancePhase();
    navigation.navigate('GameDayHome');
  };

  return (
    <View style={styles.container}>
      <AppBackground variant="gameDay" />

      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>PRE-GAME</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* VIP Access Badge */}
          <View style={styles.vipCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,203,5,0.2)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.vipAccent} />
            <View style={styles.vipContent}>
              <View style={styles.vipIcon}>
                <Sparkles size={28} color={COLORS.maize} />
              </View>
              <View style={styles.vipText}>
                <Text style={styles.vipLabel}>VIP ACCESS GRANTED</Text>
                <Text style={styles.vipTitle}>Field Experience</Text>
                <Text style={styles.vipSubtitle}>
                  Your exclusive pre-game access is ready
                </Text>
              </View>
            </View>
          </View>

          {/* Experiences List */}
          <Text style={styles.sectionTitle}>YOUR EXPERIENCES</Text>
          {VIP_EXPERIENCES.map((experience) => (
            <TouchableOpacity
              key={experience.id}
              style={styles.experienceCard}
              activeOpacity={0.8}
            >
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.experienceContent}>
                <View style={styles.experienceIcon}>
                  <experience.icon size={24} color={COLORS.maize} />
                </View>
                <View style={styles.experienceInfo}>
                  <Text style={styles.experienceTitle}>{experience.title}</Text>
                  <Text style={styles.experienceDescription}>
                    {experience.description}
                  </Text>
                  <View style={styles.experienceMeta}>
                    <View style={styles.experienceMetaItem}>
                      <Clock size={12} color={COLORS.textTertiary} />
                      <Text style={styles.experienceMetaText}>{experience.time}</Text>
                    </View>
                    <View style={styles.experienceMetaItem}>
                      <MapPin size={12} color={COLORS.textTertiary} />
                      <Text style={styles.experienceMetaText}>{experience.location}</Text>
                    </View>
                  </View>
                </View>
                <ChevronRight size={20} color={COLORS.textTertiary} />
              </View>
            </TouchableOpacity>
          ))}

          {/* Photo Memories */}
          <Text style={styles.sectionTitle}>CAPTURE THE MOMENT</Text>
          <View style={styles.photoCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.photoContent}>
              <Camera size={32} color={COLORS.maize} />
              <Text style={styles.photoTitle}>Photo Station Ready</Text>
              <Text style={styles.photoSubtitle}>
                Visit the Block M for your official game day photo
              </Text>
              <TouchableOpacity style={styles.photoButton}>
                <Text style={styles.photoButtonText}>View Photo Spots</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Countdown to Kickoff */}
          <View style={styles.countdownCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.countdownContent}>
              <Text style={styles.countdownLabel}>KICKOFF IN</Text>
              <View style={styles.countdownTime}>
                <View style={styles.countdownBlock}>
                  <Text style={styles.countdownValue}>00</Text>
                  <Text style={styles.countdownUnit}>HR</Text>
                </View>
                <Text style={styles.countdownSeparator}>:</Text>
                <View style={styles.countdownBlock}>
                  <Text style={styles.countdownValue}>32</Text>
                  <Text style={styles.countdownUnit}>MIN</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>HEAD TO YOUR SEAT</Text>
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

  // Section Title
  sectionTitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
    marginBottom: SPACING.m,
  },

  // VIP Card
  vipCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.3)',
  },
  vipAccent: {
    height: 4,
    backgroundColor: COLORS.maize,
  },
  vipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.l,
    gap: SPACING.m,
  },
  vipIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,203,5,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vipText: {
    flex: 1,
  },
  vipLabel: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
    marginBottom: SPACING.xxs,
  },
  vipTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: 'Montserrat_700Bold',
  },
  vipSubtitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },

  // Experience Card
  experienceCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.s,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  experienceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    gap: SPACING.m,
  },
  experienceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,203,5,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  experienceInfo: {
    flex: 1,
  },
  experienceTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_600SemiBold',
  },
  experienceDescription: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },
  experienceMeta: {
    flexDirection: 'row',
    gap: SPACING.m,
    marginTop: SPACING.s,
  },
  experienceMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xxs,
  },
  experienceMetaText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  // Photo Card
  photoCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.m,
  },
  photoContent: {
    padding: SPACING.l,
    alignItems: 'center',
  },
  photoTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontFamily: 'Montserrat_700Bold',
    marginTop: SPACING.m,
  },
  photoSubtitle: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.m,
  },
  photoButton: {
    paddingHorizontal: SPACING.l,
    paddingVertical: SPACING.s,
    backgroundColor: 'rgba(255,203,5,0.15)',
    borderRadius: RADIUS.full,
  },
  photoButtonText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
  },

  // Countdown Card
  countdownCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  countdownContent: {
    padding: SPACING.l,
    alignItems: 'center',
  },
  countdownLabel: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 2,
    marginBottom: SPACING.m,
  },
  countdownTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countdownBlock: {
    alignItems: 'center',
  },
  countdownValue: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.display,
    fontFamily: 'Montserrat_700Bold',
  },
  countdownUnit: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 1,
  },
  countdownSeparator: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontFamily: 'Montserrat_700Bold',
    marginHorizontal: SPACING.m,
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
