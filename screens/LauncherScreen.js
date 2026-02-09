import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { COLORS, SPACING, TYPOGRAPHY, RADIUS, SHADOWS } from '../constants/theme';
import { Zap, LayoutGrid, Coffee, ChevronRight } from 'lucide-react-native';
import { useApp } from '../context/AppContext';

const { width } = Dimensions.get('window');

/**
 * LauncherScreen - The "Three Prototypes" Menu
 * 
 * Entry point for instructors to select which prototype they want to view.
 * 1. The Club (Non-Game Day Dashboard)
 * 2. The Chaperone (Game Day Journey)
 * 3. The Concierge (Specific Feature Focus)
 */

export default function LauncherScreen({ navigation }) {
  const { resetToAutoMode, toggleMode } = useApp();

  const handleSelectProto = (protoId) => {
    if (protoId === 'club') {
      resetToAutoMode(); // Defaults to Off-Day/Club
      navigation.replace('MainApp'); 
    } else if (protoId === 'chaperone') {
      toggleMode(); // Force Game Day mode
      navigation.replace('MainApp');
    } else {
      // Future proto logic
      navigation.replace('MainApp');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Background */}
      <LinearGradient
        colors={['#001428', COLORS.blue, '#000B14']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Grid Pattern Overlay */}
      <View style={styles.gridOverlay} />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          
          {/* Header */}
          <View style={styles.header}>
            <Image 
              source={require('../assets/um-logo-blue.png')} 
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>WOLVERINE VIP</Text>
            <Text style={styles.subtitle}>EXPERIENCE PROTOTYPES</Text>
          </View>

          {/* Prototype Selection Cards */}
          <View style={styles.cardContainer}>
            
            {/* Proto 1: The Club */}
            <TouchableOpacity 
              style={styles.protoCard} 
              activeOpacity={0.9}
              onPress={() => handleSelectProto('club')}
            >
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.cardContent}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(255,203,5,0.15)' }]}>
                  <LayoutGrid size={28} color={COLORS.maize} />
                </View>
                <View style={styles.textBlock}>
                  <Text style={styles.protoTitle}>PROTOTYPE A</Text>
                  <Text style={styles.protoName}>The Club</Text>
                  <Text style={styles.protoDesc}>Non-Game Day Dashboard with Bento Grid stats & news.</Text>
                </View>
                <ChevronRight size={24} color={COLORS.textTertiary} />
              </View>
            </TouchableOpacity>

            {/* Proto 2: The Chaperone */}
            <TouchableOpacity 
              style={styles.protoCard} 
              activeOpacity={0.9}
              onPress={() => handleSelectProto('chaperone')}
            >
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.cardContent}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(0,178,169,0.15)' }]}>
                  <Zap size={28} color="#00B2A9" />
                </View>
                <View style={styles.textBlock}>
                  <Text style={[styles.protoTitle, { color: '#00B2A9' }]}>PROTOTYPE B</Text>
                  <Text style={styles.protoName}>The Chaperone</Text>
                  <Text style={styles.protoDesc}>End-to-end Game Day journey from wake up to post-game.</Text>
                </View>
                <ChevronRight size={24} color={COLORS.textTertiary} />
              </View>
            </TouchableOpacity>

            {/* Proto 3: The Concierge */}
            <TouchableOpacity 
              style={styles.protoCard} 
              activeOpacity={0.9}
              onPress={() => handleSelectProto('concierge')}
            >
              <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
              <View style={styles.cardContent}>
                <View style={[styles.iconBox, { backgroundColor: 'rgba(216,96,24,0.15)' }]}>
                  <Coffee size={28} color="#D86018" />
                </View>
                <View style={styles.textBlock}>
                  <Text style={[styles.protoTitle, { color: '#D86018' }]}>PROTOTYPE C</Text>
                  <Text style={styles.protoName}>The Concierge</Text>
                  <Text style={styles.protoDesc}>High-touch service request & smart ordering system.</Text>
                </View>
                <ChevronRight size={24} color={COLORS.textTertiary} />
              </View>
            </TouchableOpacity>

          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>SI 511 • WINTER 2026</Text>
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.blue,
  },
  gridOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.03,
    backgroundColor: 'transparent', // Add subtle grid image if available
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SPACING.l,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: SPACING.m,
  },
  title: {
    color: COLORS.maize,
    fontSize: 24,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 4,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 2,
  },
  cardContainer: {
    gap: SPACING.m,
  },
  protoCard: {
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.l,
    gap: SPACING.m,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
  },
  protoTitle: {
    color: COLORS.maize,
    fontSize: 10,
    fontFamily: 'Montserrat_700Bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  protoName: {
    color: COLORS.text,
    fontSize: 18,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 4,
  },
  protoDesc: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontFamily: 'AtkinsonHyperlegible_400Regular',
    lineHeight: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.textTertiary,
    fontSize: 10,
    fontFamily: 'Montserrat_600SemiBold',
    letterSpacing: 2,
  },
});
