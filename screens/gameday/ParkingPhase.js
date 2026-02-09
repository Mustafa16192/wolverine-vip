import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS } from '../../constants/theme';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ParkingCircle,
  ChevronRight,
  ArrowLeft,
  MapPin,
  Footprints,
  Clock,
  Car,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import AppBackground from '../../components/chrome/AppBackground';

/**
 * ParkingPhase - Find Your Spot
 *
 * Parking location, walking directions to stadium.
 */

export default function ParkingPhase({ navigation }) {
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
          <Text style={styles.headerTitle}>PARKING</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Parking Spot Card */}
          <View style={styles.spotCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,203,5,0.15)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.spotAccent} />
            <View style={styles.spotContent}>
              <View style={styles.spotIcon}>
                <ParkingCircle size={32} color={COLORS.maize} />
              </View>
              <View style={styles.spotInfo}>
                <Text style={styles.spotLabel}>YOUR SPOT</Text>
                <Text style={styles.spotNumber}>{user.parking.spot}</Text>
                <Text style={styles.spotLot}>{user.parking.lot}</Text>
              </View>
            </View>
          </View>

          {/* Lot Map Placeholder */}
          <Text style={styles.sectionTitle}>LOT MAP</Text>
          <View style={styles.mapCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.mapPlaceholder}>
              <LinearGradient
                colors={['rgba(0,39,76,0.8)', 'rgba(0,39,76,0.4)']}
                style={StyleSheet.absoluteFill}
              />
              {/* Simple lot visualization */}
              <View style={styles.lotGrid}>
                {[...Array(20)].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.lotSpace,
                      i === 14 && styles.lotSpaceYours,
                    ]}
                  >
                    {i === 14 && (
                      <Car size={12} color={COLORS.blue} />
                    )}
                  </View>
                ))}
              </View>
              <View style={styles.mapLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: COLORS.maize }]} />
                  <Text style={styles.legendText}>Your Spot</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: COLORS.textTertiary }]} />
                  <Text style={styles.legendText}>Occupied</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Walking Directions */}
          <Text style={styles.sectionTitle}>TO STADIUM</Text>
          <View style={styles.walkCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.walkContent}>
              <View style={styles.walkMain}>
                <Footprints size={28} color={COLORS.maize} />
                <View style={styles.walkInfo}>
                  <Text style={styles.walkTime}>8 min walk</Text>
                  <Text style={styles.walkDistance}>0.4 miles to Gate 4</Text>
                </View>
              </View>
              <View style={styles.walkSteps}>
                <View style={styles.walkStep}>
                  <Text style={styles.walkStepNumber}>1</Text>
                  <Text style={styles.walkStepText}>Exit lot via Main Entrance</Text>
                </View>
                <View style={styles.walkStep}>
                  <Text style={styles.walkStepNumber}>2</Text>
                  <Text style={styles.walkStepText}>Turn right on Stadium Blvd</Text>
                </View>
                <View style={styles.walkStep}>
                  <Text style={styles.walkStepNumber}>3</Text>
                  <Text style={styles.walkStepText}>Enter via Gate 4</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Tips Card */}
          <View style={styles.tipCard}>
            <BlurView intensity={15} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.tipContent}>
              <Clock size={20} color={COLORS.maize} />
              <Text style={styles.tipText}>
                Gates open 90 minutes before kickoff. Arrive early for the best experience!
              </Text>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>HEAD TO PRE-GAME</Text>
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

  // Spot Card
  spotCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.2)',
  },
  spotAccent: {
    height: 4,
    backgroundColor: COLORS.maize,
  },
  spotContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.l,
    gap: SPACING.l,
  },
  spotIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,203,5,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spotInfo: {
    flex: 1,
  },
  spotLabel: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
    marginBottom: SPACING.xs,
  },
  spotNumber: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontFamily: 'Montserrat_700Bold',
  },
  spotLot: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },

  // Map Card
  mapCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mapPlaceholder: {
    padding: SPACING.l,
  },
  lotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.m,
  },
  lotSpace: {
    width: 28,
    height: 40,
    borderRadius: RADIUS.xs,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lotSpaceYours: {
    backgroundColor: COLORS.maize,
  },
  mapLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.l,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  // Walk Card
  walkCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  walkContent: {
    padding: SPACING.l,
  },
  walkMain: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
    marginBottom: SPACING.l,
    paddingBottom: SPACING.l,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  walkInfo: {
    flex: 1,
  },
  walkTime: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontFamily: 'Montserrat_700Bold',
  },
  walkDistance: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },
  walkSteps: {
    gap: SPACING.m,
  },
  walkStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
  },
  walkStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255,203,5,0.15)',
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
    textAlign: 'center',
    lineHeight: 24,
  },
  walkStepText: {
    flex: 1,
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },

  // Tip Card
  tipCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    gap: SPACING.m,
  },
  tipText: {
    flex: 1,
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    lineHeight: TYPOGRAPHY.fontSize.sm * 1.5,
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
