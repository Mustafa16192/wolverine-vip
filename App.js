import 'react-native-gesture-handler';
import React from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS, TYPOGRAPHY, LAYOUT, SPACING, RADIUS } from './constants/theme';
import { Home, Ticket, Trophy } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import { BlurView } from 'expo-blur';
import {
  useFonts,
  AtkinsonHyperlegible_400Regular,
  AtkinsonHyperlegible_700Bold
} from '@expo-google-fonts/atkinson-hyperlegible';
import {
  Montserrat_600SemiBold,
  Montserrat_700Bold
} from '@expo-google-fonts/montserrat';

// Screens
import DashboardScreen from './screens/DashboardScreen';
import TicketScreen from './screens/TicketScreen';
import RenewalScreen from './screens/RenewalScreen';

const Tab = createBottomTabNavigator();

/**
 * Navigation Theme
 * Custom dark theme matching U-M brand identity
 */
const NavTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.blue,
    card: COLORS.blue,
    text: COLORS.text,
    border: COLORS.border,
    primary: COLORS.maize,
  },
};

/**
 * Custom Tab Bar Background
 * Glassmorphic blur effect for premium feel
 */
function TabBarBackground() {
  return (
    <BlurView
      intensity={50}
      tint="dark"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    />
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    AtkinsonHyperlegible_400Regular,
    AtkinsonHyperlegible_700Bold,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.blue
      }}>
        <ActivityIndicator size="large" color={COLORS.maize} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={NavTheme}>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: 'rgba(0, 39, 76, 0.95)',
            borderTopWidth: 1,
            borderTopColor: 'rgba(255, 203, 5, 0.15)',
            height: Platform.OS === 'ios' ? 88 : 70,
            paddingTop: SPACING.s,
            paddingBottom: Platform.OS === 'ios' ? 28 : SPACING.s,
            paddingHorizontal: SPACING.m,
          },
          tabBarBackground: () => <TabBarBackground />,
          tabBarActiveTintColor: COLORS.maize,
          tabBarInactiveTintColor: COLORS.textTertiary,
          tabBarLabelStyle: {
            fontFamily: 'Montserrat_700Bold',
            fontSize: 10,
            letterSpacing: 0.5,
            marginTop: SPACING.xxs,
          },
          tabBarItemStyle: {
            paddingVertical: SPACING.xs,
          },
        }}
      >
        <Tab.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 32,
                borderRadius: 16,
                backgroundColor: focused ? 'rgba(255, 203, 5, 0.15)' : 'transparent',
              }}>
                <Home color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
            tabBarLabel: 'HOME',
          }}
        />
        <Tab.Screen
          name="Ticket"
          component={TicketScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 32,
                borderRadius: 16,
                backgroundColor: focused ? 'rgba(255, 203, 5, 0.15)' : 'transparent',
              }}>
                <Ticket color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
            tabBarLabel: 'TICKET',
            tabBarStyle: { display: 'none' }, // Hide tab bar on ticket screen for immersive view
          }}
        />
        <Tab.Screen
          name="Legacy"
          component={RenewalScreen}
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: 44,
                height: 32,
                borderRadius: 16,
                backgroundColor: focused ? 'rgba(255, 203, 5, 0.15)' : 'transparent',
              }}>
                <Trophy color={color} size={22} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
            tabBarLabel: 'LEGACY',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
