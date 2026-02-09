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
import {
  Users,
  MapPin,
  Clock,
  ChevronRight,
  ArrowLeft,
  Beer,
  Flame,
  Music,
  Share2,
  Phone,
  Navigation,
} from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import AppBackground from '../../components/chrome/AppBackground';

const { width } = Dimensions.get('window');

/**
 * TailgatePhase - Pre-Game Celebration
 *
 * Tailgate hub with location, guests, and supplies.
 */

const TAILGATE_CREW = [
  { name: 'Mike R.', status: 'arrived', avatar: 'M' },
  { name: 'Sarah T.', status: 'on the way', avatar: 'S' },
  { name: 'James L.', status: 'arrived', avatar: 'J' },
  { name: 'Emma K.', status: 'arriving soon', avatar: 'E' },
];

const SUPPLIES = [
  { icon: Beer, label: 'Drinks', status: 'Stocked' },
  { icon: Flame, label: 'Grill', status: 'Ready' },
  { icon: Music, label: 'Speaker', status: 'Connected' },
];

export default function TailgatePhase({ navigation }) {
  const { advancePhase } = useApp();

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
          <Text style={styles.headerTitle}>TAILGATE</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Location Card */}
          <View style={styles.locationCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.locationAccent} />
            <View style={styles.locationContent}>
              <View style={styles.locationHeader}>
                <MapPin size={20} color={COLORS.maize} />
                <Text style={styles.locationLabel}>YOUR SPOT</Text>
              </View>
              <Text style={styles.locationTitle}>Pioneer High Lot</Text>
              <Text style={styles.locationAddress}>601 W Stadium Blvd</Text>
              <View style={styles.locationMeta}>
                <View style={styles.locationMetaItem}>
                  <Clock size={14} color={COLORS.textTertiary} />
                  <Text style={styles.locationMetaText}>Since 9:30 AM</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.directionsButton}>
                <Navigation size={16} color={COLORS.blue} />
                <Text style={styles.directionsButtonText}>Get Directions</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Crew Section */}
          <Text style={styles.sectionTitle}>YOUR CREW</Text>
          <View style={styles.crewCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            {TAILGATE_CREW.map((person, index) => (
              <View
                key={index}
                style={[
                  styles.crewMember,
                  index === TAILGATE_CREW.length - 1 && styles.crewMemberLast,
                ]}
              >
                <View style={styles.crewAvatar}>
                  <Text style={styles.crewAvatarText}>{person.avatar}</Text>
                </View>
                <View style={styles.crewInfo}>
                  <Text style={styles.crewName}>{person.name}</Text>
                  <Text
                    style={[
                      styles.crewStatus,
                      person.status === 'arrived' && styles.crewStatusArrived,
                    ]}
                  >
                    {person.status}
                  </Text>
                </View>
                <TouchableOpacity style={styles.crewAction}>
                  <Phone size={18} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.inviteButton}>
              <Users size={16} color={COLORS.maize} />
              <Text style={styles.inviteButtonText}>Invite More Friends</Text>
            </TouchableOpacity>
          </View>

          {/* Supplies Grid */}
          <Text style={styles.sectionTitle}>SUPPLIES STATUS</Text>
          <View style={styles.suppliesGrid}>
            {SUPPLIES.map((item, index) => (
              <View key={index} style={styles.supplyCard}>
                <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                <item.icon size={28} color={COLORS.maize} />
                <Text style={styles.supplyLabel}>{item.label}</Text>
                <Text style={styles.supplyStatus}>{item.status}</Text>
              </View>
            ))}
          </View>

          {/* Share Location */}
          <TouchableOpacity style={styles.shareCard}>
            <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
            <View style={styles.shareContent}>
              <Share2 size={24} color={COLORS.maize} />
              <View style={styles.shareText}>
                <Text style={styles.shareTitle}>Share Your Spot</Text>
                <Text style={styles.shareSubtitle}>Help friends find your tailgate</Text>
              </View>
              <ChevronRight size={20} color={COLORS.textTertiary} />
            </View>
          </TouchableOpacity>

          {/* Continue Button */}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.9}
          >
            <Text style={styles.continueButtonText}>HEAD TO STADIUM</Text>
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

  // Location Card
  locationCard: {
    borderRadius: RADIUS.xl,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: 'rgba(255,203,5,0.2)',
  },
  locationAccent: {
    height: 4,
    backgroundColor: COLORS.maize,
  },
  locationContent: {
    padding: SPACING.l,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.s,
  },
  locationLabel: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
  },
  locationTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: SPACING.xs,
  },
  locationAddress: {
    color: COLORS.textSecondary,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginBottom: SPACING.m,
  },
  locationMeta: {
    marginBottom: SPACING.m,
  },
  locationMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  locationMetaText: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.s,
    backgroundColor: COLORS.maize,
    paddingVertical: SPACING.m,
    borderRadius: RADIUS.lg,
  },
  directionsButtonText: {
    color: COLORS.blue,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_700Bold',
  },

  // Crew Card
  crewCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  crewMember: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  crewMemberLast: {
    borderBottomWidth: 0,
  },
  crewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,203,5,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.m,
  },
  crewAvatarText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.md,
    fontFamily: 'Montserrat_700Bold',
  },
  crewInfo: {
    flex: 1,
  },
  crewName: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_600SemiBold',
  },
  crewStatus: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
    textTransform: 'capitalize',
  },
  crewStatusArrived: {
    color: COLORS.waveFieldGreen,
  },
  crewAction: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.s,
    padding: SPACING.m,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  inviteButtonText: {
    color: COLORS.maize,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
  },

  // Supplies Grid
  suppliesGrid: {
    flexDirection: 'row',
    gap: SPACING.s,
    marginBottom: SPACING.xl,
  },
  supplyCard: {
    flex: 1,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    padding: SPACING.m,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  supplyLabel: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'Montserrat_600SemiBold',
    marginTop: SPACING.s,
  },
  supplyStatus: {
    color: COLORS.waveFieldGreen,
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
  },

  // Share Card
  shareCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  shareContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.m,
    gap: SPACING.m,
  },
  shareText: {
    flex: 1,
  },
  shareTitle: {
    color: COLORS.text,
    fontSize: TYPOGRAPHY.fontSize.base,
    fontFamily: 'Montserrat_600SemiBold',
  },
  shareSubtitle: {
    color: COLORS.textTertiary,
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    marginTop: SPACING.xxs,
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
