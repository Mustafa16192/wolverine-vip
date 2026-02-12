# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Wolverine VIP is a premium mobile app prototype for University of Michigan football season ticket holders. Built with React Native (Expo SDK 54). Inspired by F1's "Box Box" app design philosophy.

## Development Commands

```bash
npm install
npx expo start --clear       # Recommended
npx expo start --ios          # iOS Simulator
npx expo start --android      # Android Emulator
npx expo start --web          # Web browser
```

## Architecture

### Two-Mode System

- **Club Mode** (non-game day): Bento dashboard with stats, news, shop
- **Chaperone Mode** (game day): Sequential 8-phase journey (morning → tailgate → travel → parking → pregame → ingame → postgame → home)

### Navigation (App.js)

5-tab bottom navigator (Home, Stats, Ticket, News, Shop) with a Home stack containing the dashboard, game day phases, and detail screens. Tab bar is a floating pill with blur backdrop.

### Context Providers

- `useApp()` from `context/AppContext.js` — mode, schedule, user profile, phase progression
- `useGame()` from `context/GameContext.js` — simulation time, game states, auto-advance

### Theme (`constants/theme.js`)

Exports: `COLORS`, `TYPOGRAPHY`, `SPACING`, `RADIUS`, `SHADOWS`, `CHROME`, `ACCESSIBILITY`, `LAYOUT`

- Michigan Blue `#00274C`, Maize `#FFCB05`
- Fonts: Atkinson Hyperlegible (body), Montserrat (headings)
- `CHROME` for gradient backgrounds and dock styling

### Key Components

- **BentoCard** — Glassmorphic card (BlurView + gradient accent)
- **ConciergeCard** — Morphs content per game state
- **AppBackground** — Layered gradient background (variants: default/home/gameDay)
- **SimulatorControls** — Dev bar for state toggling

## Guidelines

- Use `constants/theme.js` exports — never hardcode colors/spacing
- Icons: `lucide-react-native` only
- Animations: React Native `Animated` API only (no reanimated/moti — not installed)
- Fonts: `TYPOGRAPHY.fontFamily.heading` / `TYPOGRAPHY.fontFamily.body`
- Wrap cards in `<BentoCard>`, use `<AppBackground>` for screen backgrounds
