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
  Navigation,
  Clock,
  ChevronRight,
  ArrowLeft,
  Car,
  AlertTriangle,
  MapPin,
  Route,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

/**
 * TravelPhase - Navigate to Stadium
 *
 * Route, traffic info, and ETA.
 */

export default function TravelPhase({ navigation }) {
  const { advancePhase, user } = useApp();

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
          <Text style={styles.headerTitle}>TRAVEL</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ETA Card */}
          <View style={styles.etaCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <LinearGradient
              colors={['rgba(255,203,5,0.15)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.etaAccent} />
            <View style={styles.etaContent}>
              <View style={styles.etaHeader}>
                <Navigation size={24} color={COLORS.maize} />
                <Text style={styles.etaLabel}>ESTIMATED ARRIVAL</Text>
              </View>
              <Text style={styles.etaTime}>11:24 AM</Text>
              <View style={styles.etaDetails}>
                <View style={styles.etaDetail}>
                  <Route size={16} color={COLORS.textSecondary} />
                  <Text style={styles.etaDetailText}>2.4 mi</Text>
                </View>
                <View style={styles.etaDivider} />
                <View style={styles.etaDetail}>
                  <Clock size={16} color={COLORS.textSecondary} />
                  <Text style={styles.etaDetailText}>12 min</Text>
                </View>
                <View style={styles.etaDivider} />
                <View style={styles.etaDetail}>
                  <Car size={16} color={COLORS.textSecondary} />
                  <Text style={styles.etaDetailText}>Via Stadium Blvd</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Traffic Alert */}
          <View style={styles.alertCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.alertContent}>
              <View style={styles.alertIcon}>
                <AlertTriangle size={20} color={COLORS.rossOrange} />
              </View>
              <View style={styles.alertText}>
                <Text style={styles.alertTitle}>Moderate Traffic</Text>
                <Text style={styles.alertDescription}>
                  Expect delays near Main St intersection
                </Text>
              </View>
            </View>
          </View>

          {/* Route Overview */}
          <Text style={styles.sectionTitle}>ROUTE OVERVIEW</Text>
          <View style={styles.routeCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />

            {/* Map Placeholder */}
            <View style={styles.mapPlaceholder}>
              <LinearGradient
                colors={['rgba(0,39,76,0.8)', 'rgba(0,39,76,0.4)']}
                style={StyleSheet.absoluteFill}
              />
              <Navigation size={48} color={COLORS.maize} />
              <Text style={styles.mapPlaceholderText}>Map View</Text>
            </View>

            {/* Route Steps */}
            <View style={styles.routeSteps}>
              <View style={styles.routeStep}>
                <View style={styles.routeStepIndicator}>
                  <View style={styles.routeStepDot} />
                </View>
                <View style={styles.routeStepContent}>
                  <Text style={styles.routeStepTitle}>Current Location</Text>
                  <Text style={styles.routeStepSubtitle}>Pioneer High Lot</Text>
                </View>
              </View>

              <View style={styles.routeStepConnector} />

              <View style={styles.routeStep}>
                <View style={[styles.routeStepIndicator, styles.routeStepIndicatorActive]}>
                  <MapPin size={14} color={COLORS.blue} />
                </View>
                <View style={styles.routeStepContent}>
                  <Text style={styles.routeStepTitle}>{user.parking.lot}</Text>
                  <Text style={styles.routeStepSubtitle}>Spot {user.parking.spot}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Navigation Options */}
          <Text style={styles.sectionTitle}>OPEN IN</Text>
          <View style={styles.navOptions}>
            <TouchableOpacity style={styles.navOption}>
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <Text style={styles.navOptionText}>Apple Maps</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navOption}>
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <Text style={styles.navOptionText}>Google Maps</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navOption}>
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <Text style={styles.navOptionText}>Waze</Text>
            </TouchableOpacity>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>ARRIVED AT PARKING</Text>
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

  // ETA Card
  etaCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.m,
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.2)',
  },
  etaAccent: {
    height: 4,
    backgroundColor: COLORS.maize,
  },
  etaContent: {
    padding: SPACING.l,
  },
  etaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.s,
    marginBottom: SPACING.s,
  },
  etaLabel: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  etaTime: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.display,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: SPACING.m,
  },
  etaDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  etaDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  etaDetailText: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  etaDivider: {
    width: 1,
    height: 16,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.m,
  },

  // Alert Card
  alertCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(216,96,24,0.3)',
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    gap: SPACING.m,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(216,96,24,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertText: {
    flex: 1,
  },
  alertTitle: {
    color: COLORS.rossOrange,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_600SemiBold',
  },
  alertDescription: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },

  // Route Card
  routeCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  mapPlaceholder: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapPlaceholderText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.s,
  },
  routeSteps: {
    padding: SPACING.m,
  },
  routeStep: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.m,
  },
  routeStepIndicator: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeStepIndicatorActive: {
    backgroundColor: COLORS.maize,
  },
  routeStepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textTertiary,
  },
  routeStepConnector: {
    width: 2,
    height: 24,
    backgroundColor: COLORS.border,
    marginLeft: 13,
    marginVertical: SPACING.xs,
  },
  routeStepContent: {
    flex: 1,
  },
  routeStepTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_600SemiBold',
  },
  routeStepSubtitle: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },

  // Nav Options
  navOptions: {
    flexDirection: 'row',
    gap: SPACING.s,
    marginBottom: SPACING.xl,
  },
  navOption: {
    flex: 1,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    padding: SPACING.m,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  navOptionText: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
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
