import 'react-native-gesture-handler';
import React, { useCallback, useMemo, useState } from 'react';
import { View, ActivityIndicator, Platform, StyleSheet } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  createNavigationContainerRef,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { BlurView } from 'expo-blur';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { COLORS, CHROME } from './constants/theme';
import { Home, BarChart3, Newspaper, ShoppingBag, Ticket } from 'lucide-react-native';
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
import { AppProvider } from './context/AppContext';
import { GameProvider } from './context/GameContext';
import { AssistantProvider } from './context/AssistantContext';

// Non-Game Day Screens
import DashboardScreen from './screens/DashboardScreen';
import StatsScreen from './screens/StatsScreen';
import NewsScreen from './screens/NewsScreen';
import ShopScreen from './screens/ShopScreen';
import LiveOpsDetailScreen from './screens/LiveOpsDetailScreen';

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
import FloatingOrb from './components/assistant/FloatingOrb';
import AssistantPanel from './components/assistant/AssistantPanel';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

function getActiveRouteName(state) {
  if (!state || !state.routes?.length) return 'Dashboard';
  const route = state.routes[state.index ?? 0];
  if (route.state) return getActiveRouteName(route.state);
  return route.name || 'Dashboard';
}

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
 * Home Stack
 * Keeps dashboard + game day journey in one continuous app experience.
 */
function HomeNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.blue },
        gestureEnabled: true,
        animationEnabled: true,
      }}
    >
      <HomeStack.Screen name="Dashboard" component={DashboardScreen} />
      <HomeStack.Screen name="LiveOpsDetail" component={LiveOpsDetailScreen} />
      <HomeStack.Screen name="GameDayHome" component={GameDayHomeScreen} />
      <HomeStack.Screen name="MorningPhase" component={MorningPhase} />
      <HomeStack.Screen name="TailgatePhase" component={TailgatePhase} />
      <HomeStack.Screen name="TravelPhase" component={TravelPhase} />
      <HomeStack.Screen name="ParkingPhase" component={ParkingPhase} />
      <HomeStack.Screen name="PregamePhase" component={PregamePhase} />
      <HomeStack.Screen name="IngamePhase" component={IngamePhase} />
      <HomeStack.Screen name="PostgamePhase" component={PostgamePhase} />
      <HomeStack.Screen name="HomePhase" component={HomePhase} />
      <HomeStack.Screen name="GameDayTicket" component={TicketScreen} />
    </HomeStack.Navigator>
  );
}

/**
 * Main Tabs
 * Single app shell; tab bar remains available across app states.
 */
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          left: 18,
          right: 18,
          bottom: Platform.OS === 'ios' ? 24 : 12,
          borderTopWidth: 0,
          borderWidth: 1,
          borderColor: CHROME.dock.border,
          borderRadius: 34,
          backgroundColor: CHROME.dock.background,
          height: Platform.OS === 'ios' ? 66 : 58,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 14 : 8,
          elevation: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.22,
          shadowRadius: 16,
          overflow: 'hidden',
        },
        tabBarBackground: () => (
          <BlurView intensity={34} tint="dark" style={StyleSheet.absoluteFill} />
        ),
        tabBarActiveTintColor: COLORS.maize,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.58)',
        tabBarShowLabel: false,
        tabBarIconStyle: {
          marginTop: 1,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeNavigator}
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
 * Root App Component
 */
export default function App() {
  const [routeName, setRouteName] = useState('Dashboard');
  const navigationRef = useMemo(() => createNavigationContainerRef(), []);
  const assistantEnabled = process.env.EXPO_PUBLIC_ASSISTANT_ENABLED !== 'false';

  let [fontsLoaded] = useFonts({
    AtkinsonHyperlegible_400Regular,
    AtkinsonHyperlegible_700Bold,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  const handleNavigationStateChange = useCallback(() => {
    if (!navigationRef.isReady()) return;
    const currentRouteName = getActiveRouteName(navigationRef.getRootState());
    if (currentRouteName) {
      setRouteName(currentRouteName);
    }
  }, [navigationRef]);

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.maize} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <GameProvider>
          <AssistantProvider
            assistantEnabled={assistantEnabled}
            routeName={routeName}
            navigationRef={navigationRef}
          >
            <NavigationContainer
              ref={navigationRef}
              theme={NavTheme}
              onReady={handleNavigationStateChange}
              onStateChange={handleNavigationStateChange}
            >
              <StatusBar style="light" />
              <MainTabs />
              <AssistantPanel />
              <FloatingOrb />
            </NavigationContainer>
          </AssistantProvider>
        </GameProvider>
      </AppProvider>
    </SafeAreaProvider>
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
