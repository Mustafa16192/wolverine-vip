import 'react-native-gesture-handler';
import React from 'react';
import { View, ActivityIndicator, Platform, Text, StyleSheet } from 'react-native';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS, TYPOGRAPHY, SPACING } from './constants/theme';
import { Home, BarChart3, Newspaper, ShoppingBag, Ticket, Zap } from 'lucide-react-native';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  AtkinsonHyperlegible_400Regular,
  AtkinsonHyperlegible_700Bold
} from '@expo-google-fonts/atkinson-hyperlegible';
import {
  Montserrat_600SemiBold,
  Montserrat_700Bold
} from '@expo-google-fonts/montserrat';

// Context
import { AppProvider, useApp } from './context/AppContext';
import { GameProvider } from './context/GameContext';

// Screens - Launcher
import LauncherScreen from './screens/LauncherScreen';

// Non-Game Day Screens
import DashboardScreen from './screens/DashboardScreen';
import StatsScreen from './screens/StatsScreen';
import NewsScreen from './screens/NewsScreen';
import ShopScreen from './screens/ShopScreen';

// Shared Screens
import TicketScreen from './screens/TicketScreen';

// Game Day Screens
import GameDayHomeScreen from './screens/gameday/GameDayHomeScreen';
import MorningPhase from './screens/gameday/MorningPhase';
import TailgatePhase from './screens/gameday/TailgatePhase';
import TravelPhase from './screens/gameday/TravelPhase';
import ParkingPhase from './screens/gameday/ParkingPhase';
import PregamePhase from './screens/gameday/PregamePhase';
import IngamePhase from './screens/gameday/IngamePhase';
import PostgamePhase from './screens/gameday/PostgamePhase';
import HomePhase from './screens/gameday/HomePhase';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const RootStack = createStackNavigator();

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
 * Non-Game Day Tab Navigator
 * Bento-style dashboard experience
 */
function NonGameDayTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.blue,
          borderTopWidth: 2,
          borderTopColor: COLORS.maize,
          height: Platform.OS === 'ios' ? 85 : 65,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 24 : 8,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarActiveTintColor: COLORS.maize,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.5)',
        tabBarLabelStyle: {
          fontFamily: 'Montserrat_700Bold',
          fontSize: 9,
          letterSpacing: 1,
          marginTop: 2,
        },
        tabBarIconStyle: {
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Home color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
          ),
          tabBarLabel: 'HOME',
        }}
      />
      <Tab.Screen
        name="Stats"
        component={StatsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <BarChart3 color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
          ),
          tabBarLabel: 'STATS',
        }}
      />
      <Tab.Screen
        name="Ticket"
        component={TicketScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ticket color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
          ),
          tabBarLabel: 'TICKET',
        }}
      />
      <Tab.Screen
        name="News"
        component={NewsScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Newspaper color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
          ),
          tabBarLabel: 'NEWS',
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          tabBarIcon: ({ color, focused }) => (
            <ShoppingBag color={color} size={24} strokeWidth={focused ? 2.5 : 2} />
          ),
          tabBarLabel: 'SHOP',
        }}
      />
    </Tab.Navigator>
  );
}

/**
 * Game Day Stack Navigator
 * Full end-to-end game day experience
 */
function GameDayNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.blue },
        gestureEnabled: true,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="GameDayHome" component={GameDayHomeScreen} />
      <Stack.Screen name="MorningPhase" component={MorningPhase} />
      <Stack.Screen name="TailgatePhase" component={TailgatePhase} />
      <Stack.Screen name="TravelPhase" component={TravelPhase} />
      <Stack.Screen name="ParkingPhase" component={ParkingPhase} />
      <Stack.Screen name="PregamePhase" component={PregamePhase} />
      <Stack.Screen name="IngamePhase" component={IngamePhase} />
      <Stack.Screen name="PostgamePhase" component={PostgamePhase} />
      <Stack.Screen name="HomePhase" component={HomePhase} />
      <Stack.Screen name="GameDayTicket" component={TicketScreen} />
    </Stack.Navigator>
  );
}

/**
 * Main App Navigator (The "Working" Prototype)
 * Switches between Game Day and Non-Game Day modes
 */
function MainAppNavigator() {
  const { isGameDay } = useApp();
  return isGameDay ? <GameDayNavigator /> : <NonGameDayTabs />;
}

/**
 * Root App Component
 */
export default function App() {
  let [fontsLoaded] = useFonts({
    AtkinsonHyperlegible_400Regular,
    AtkinsonHyperlegible_700Bold,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.maize} />
      </View>
    );
  }

  return (
    <AppProvider>
      <GameProvider>
        <NavigationContainer theme={NavTheme}>
          <StatusBar style="light" />
          <RootStack.Navigator screenOptions={{ headerShown: false }}>
            <RootStack.Screen name="Launcher" component={LauncherScreen} />
            <RootStack.Screen name="MainApp" component={MainAppNavigator} />
          </RootStack.Navigator>
        </NavigationContainer>
      </GameProvider>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.blue,
  },
});
