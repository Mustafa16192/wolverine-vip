# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wolverine VIP is a premium mobile app for University of Michigan football season ticket holders, inspired by F1's "Box Box" app. Built with React Native (Expo SDK 54).

## Development Commands

```bash
# Install dependencies
npm install

# Start Expo development server
npx expo start

# Run on specific platforms
npx expo start --ios      # iOS Simulator
npx expo start --android  # Android Emulator
npx expo start --web      # Web browser
```

## Architecture

### Navigation Structure
- **App.js** - Root component with React Navigation setup
- Uses bottom tab navigator with three main screens
- Navigation theme configured with app colors

### Screens (`/screens`)
- **HomeScreen** - "Pit Wall" dashboard with countdown timer, matchup display, legacy stats, and news feed
- **TicketScreen** - "Seat Command" with flip-to-scan digital season pass (3D card animation)
- **RenewalScreen** - "Legacy" hub with renewal CTA and loyalty stats

### Components (`/components`)
- **BentoCard** - Reusable glassmorphic card with BlurView, optional gradient accent, and press handling

### Theme System (`/constants/theme.js`)
- **COLORS** - Michigan Blue (#00274C), Maize (#FFCB05), deep background, glassmorphic overlays
- **SPACING** - xs/s/m/l/xl/xxl scale
- **SHADOWS** - light/medium presets

## Key Libraries
- `react-native-reanimated` + `moti` - Animations (card flips, countdown, glow effects)
- `expo-blur` - Glassmorphism on cards
- `expo-linear-gradient` - Gradient backgrounds and accents
- `lucide-react-native` - Icons
- `expo-haptics` - Available for tactile feedback

## Design System
- "Athletic Luxury" theme with dark OLED-friendly backgrounds
- Glassmorphic cards with `rgba(255,255,255,0.08)` background and blur
- Maize (#FFCB05) for actionable elements and highlights
- Bold condensed typography for headers
