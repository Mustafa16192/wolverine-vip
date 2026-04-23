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

5-tab bottom navigator (Home, Stats, Ticket, News, Shop) with a Home stack containing the dashboard, season planning, game day phases, and detail screens. Tab bar is a floating pill with blur backdrop.

Additional screens in the Home stack not part of the main flow: `LauncherScreen`, `RenewalScreen`, `WidgetScreen`, `ARParkingAssistScreen`, `ARWalkToGateScreen`.

### Context Providers

- `useApp()` from `context/AppContext.js` — mode, schedule, user profile, phase progression
- `useGame()` from `context/GameContext.js` — simulation time, game states, auto-advance
- `useAssistant()` from `context/AssistantContext.js` — AI assistant panel state, conversation history, proactive suggestions, action execution

### Assistant Subsystem (`assistant/`)

A full AI concierge layer that sends context-aware prompts to a proxy server (default `localhost:8787/assistant/respond`) with a mock fallback. Configure the proxy URL via `EXPO_PUBLIC_ASSISTANT_PROXY_URL`.

- `contextBuilder.js` — builds a typed `AppSnapshot` (route, isGameDay, phase, game, user) and per-route proactive suggestions. Proactive cooldown: 10 minutes.
- `actionExecutor.js` — executes typed action commands: `navigate.*`, `open.liveOpsDetail`, `gameDay.enter/exit/goToPhase`, `ticket.flipPass`, `news.setFilter`, `shop.setCategory`
- `commandRegistry.js` — normalizes raw action objects from the AI response
- `policy.js` — risk classification (`low` vs `high`). Low-risk actions (all current navigate/gameDay/ticket/news/shop commands) auto-execute; high-risk ones (payment.*, account.*) are blocked pending confirmation
- `ticketFlipBridge.js` — event bridge that triggers the QR flip animation on TicketScreen
- `service/assistantClient.js` — POST to proxy with `{ systemPrompt, input, snapshot }`
- `service/mockAssistantClient.js` — offline fallback responses

Assistant UI lives in `components/assistant/`: `FloatingOrb` (entry point), `AssistantPanel` (chat drawer), `VoiceInputControl`, `CameraInputControl`, `ResponseCard`.

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
- New assistant action types must be added to both `actionExecutor.js` (handler) and `policy.js` (risk classification)
