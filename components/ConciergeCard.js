import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { COLORS, SPACING, SHADOWS } from '../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Car, MapPin, Ticket, Utensils, Phone, Clock, ArrowRight, Trophy } from 'lucide-react-native';
import SmartOrderModal from './SmartOrderModal';

const { width } = Dimensions.get('window');

// Content Configuration for each State
const CONTENT = {
  COMMUTE: {
    hero: "Good Morning, Gerald.",
    subhero: "Kickoff is in 3 hours. Traffic is light.",
    mainIcon: <Car size={48} color={COLORS.secondary} />,
    primaryAction: "START NAVIGATION",
    primarySub: "To Reserved Lot SC7",
    secondaryAction: "View Traffic Map",
    accent: COLORS.primary,
  },
  ARRIVAL: {
    hero: "Welcome to The Big House.",
    subhero: "You are 5 mins from your seat.",
    mainIcon: <Ticket size={48} color={COLORS.secondary} />,
    primaryAction: "ACCESS TICKET",
    primarySub: "Flip for Gate Entry",
    secondaryAction: "Show Gate Map",
    accent: "#003970",
  },
  IN_GAME: {
    hero: "MICH 7 - 0 OSU",
    subhero: "2nd Quarter • 12:30 PM",
    mainIcon: <Utensils size={48} color={COLORS.secondary} />,
    primaryAction: "ORDER FOOD",
    primarySub: "Delivered to Sec 24, Row 10",
    secondaryAction: "Call Concierge",
    accent: "#000",
  },
  POST_GAME: {
    hero: "VICTORY! 24-17",
    subhero: "Michigan defeats Ohio State",
    mainIcon: <Trophy size={48} color={COLORS.secondary} />,
    primaryAction: "SHARE HIGHLIGHT",
    primarySub: "Auto-generated game day reel",
    secondaryAction: "View Stats",
    accent: COLORS.secondary,
  }
};

export default function ConciergeCard({ state, navigation }) {
  const [modalVisible, setModalVisible] = useState(false);
  const content = CONTENT[state];

  if (!content) return null;

  const handlePrimaryPress = () => {
    if (state === 'ARRIVAL') {
      navigation.navigate('Ticket');
    } else if (state === 'IN_GAME') {
      setModalVisible(true);
    } else if (state === 'POST_GAME') {
      Alert.alert('Share Highlight', 'Your personalized game day reel is ready to share!');
    }
    // Other actions (Navigation, Food) would launch modals/deep links
  };

  const handleOrderPlaced = (total) => {
    Alert.alert(
      'Order Placed!',
      `Your order ($${total.toFixed(2)}) will be delivered to Section 24, Row 10.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.cardContainer}>
       <LinearGradient
          colors={[content.accent, COLORS.background]}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
       >
          {/* Top Section: Status */}
          <View style={styles.topSection}>
             <View style={styles.iconCircle}>
                {content.mainIcon}
             </View>
             <Text style={styles.heroText}>{content.hero}</Text>
             <Text style={styles.subheroText}>{content.subhero}</Text>
          </View>

          {/* Bottom Section: Actions */}
          <View style={styles.actionSection}>
             <TouchableOpacity 
               activeOpacity={0.8} 
               style={styles.primaryButton}
               onPress={handlePrimaryPress}
             >
                <View>
                   <Text style={styles.primaryLabel}>{content.primaryAction}</Text>
                   <Text style={styles.primarySubLabel}>{content.primarySub}</Text>
                </View>
                <View style={styles.arrowCircle}>
                   <ArrowRight size={20} color={COLORS.background} />
                </View>
             </TouchableOpacity>

             <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryLabel}>{content.secondaryAction}</Text>
             </TouchableOpacity>
          </View>
       </LinearGradient>

       {/* Smart Order Modal */}
       <SmartOrderModal
         visible={modalVisible}
         onClose={() => setModalVisible(false)}
         onOrderPlaced={handleOrderPlaced}
       />
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: 500,
    ...SHADOWS.medium,
  },
  card: {
    flex: 1,
    borderRadius: 32,
    padding: SPACING.xl,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  topSection: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.l,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  heroText: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: SPACING.s,
    lineHeight: 34,
  },
  subheroText: {
    color: COLORS.textSecondary,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  actionSection: {
    width: '100%',
  },
  primaryButton: {
    backgroundColor: COLORS.secondary,
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: SPACING.l,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.m,
  },
  primaryLabel: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1,
  },
  primarySubLabel: {
    color: 'rgba(0,39,76, 0.7)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButton: {
    alignItems: 'center',
    padding: SPACING.s,
  },
  secondaryLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  }
});
