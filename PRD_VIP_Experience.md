# Wolverine VIP Product Requirements Document (Living PRD)

Version: 3.0.0
Last Updated: February 12, 2026
Product Stage: Frontend MVP plus Copilot Foundation
Owner: Product and Experience Team

## 1. Document Purpose
This PRD is the single source of truth for what Wolverine VIP is, what is implemented now, what is not, and what must happen next.

This document is intentionally living.
- Update it after every meaningful product/UX/architecture change.
- Separate shipped reality from planned intent.
- Use it for scope control and release readiness.

## 2. Executive Summary
Wolverine VIP is a premium companion app for University of Michigan season ticket holders.

Current product direction is one continuous app experience, not separate prototypes. The app keeps persistent tab navigation while dynamically shifting priority around game-day needs.

The current build delivers:
- A premium Season HQ home dashboard centered on matchup and logistics.
- A linear game-day journey with phase-by-phase screens.
- A premium digital ticket experience with animated flip pass.
- News, shop, and stats surfaces with rich UI and mock content.
- A floating multimodal AI Copilot shell with executable in-app actions.

The current build does not yet deliver production backend, real-time data, payments, auth, or true multimodal capture/transcription.

## 3. Product Vision and Positioning
### Vision
Deliver a high-polish VIP operating system for game day that makes premium members feel recognized, guided, and in control.

### Positioning
From ticket utility app to premium concierge platform.

### Value Proposition
For premium season ticket holders who value status, smooth logistics, and exclusive access, Wolverine VIP orchestrates the full game-day lifecycle from planning to postgame departure in a single mobile experience.

## 4. Problem Statement
Current premium fan experiences are fragmented across ticketing, parking, comms, and game-day support. High-value users experience uncertainty in exactly the moments where confidence and service quality matter most.

Wolverine VIP must remove this friction by:
- Prioritizing the next best action by context.
- Providing trusted, high-clarity logistics.
- Making premium benefits tangible at each stage.
- Maintaining continuity across Home, Game Day, Ticket, News, Shop, and Stats.

## 5. Target Users and JTBD
### Primary Segment
Premium season ticket holders and their guests, including high-expectation users who prioritize efficiency, comfort, and status signaling.

### Secondary Segment
Power fans who want deep engagement and fast access to curated team updates and merchandise.

### Jobs To Be Done
- Before game day: "Help me prepare without thinking through every detail myself."
- Arrival and entry: "Get me parked, through gates, and seated with minimal friction."
- During game: "Give me fast service and context without breaking immersion."
- After game: "Get me out efficiently and preserve the premium feeling."

## 6. Core Experience Principles
- Premium clarity over feature clutter.
- Action-first interface over content-first interface.
- Continuity over mode silos.
- Real utility over decorative complexity.
- Trust and safety for any automated assistant action.

## 7. Current App Information Architecture
### 7.1 Navigation Structure
Implemented navigation shell:
- Bottom tabs: `Home`, `Stats`, `Ticket`, `News`, `Shop`
- Home stack screens: `Dashboard`, `LiveOpsDetail`, `GameDayHome`, `MorningPhase`, `TailgatePhase`, `TravelPhase`, `ParkingPhase`, `PregamePhase`, `IngamePhase`, `PostgamePhase`, `HomePhase`

Assistant surfaces are rendered globally above navigation:
- `FloatingOrb`
- `AssistantPanel`

### 7.2 Active Context Layers
- `AppContext`: core user/schedule/game-day state and phase control.
- `GameContext`: simulation context exists but is effectively secondary in current UX.
- `AssistantContext`: copilot state, action execution, proactive suggestions, shared News/Shop state.

## 8. Current Feature Inventory (As Built)
Status legend:
- Implemented
- Partial
- Not Implemented
- Dormant

| Area | Feature | Status | Notes |
|---|---|---|---|
| Shell | Unified tabbed app with persistent bottom dock | Implemented | Single experience preserved during game-day flow. |
| Home | Season HQ hero around next matchup | Implemented | Matchup graphic, metadata chips, countdown chip, CTA. |
| Home | Season progress tracker | Implemented | Uses schedule in `AppContext`; shows completed/total + progress rail. |
| Home | Live Ops grid with context-aware labels | Implemented | Cards route to `LiveOpsDetail` with contextual params. |
| Home | VIP concierge modules (parking/gate) | Implemented | Detailed cards with action buttons. |
| Home | Insider feed large cards with visuals | Implemented | Gradient-image cards route to News/Shop. |
| Home | Legacy status card | Implemented | Tenure/wins/rank/renewal style card. |
| Game Day | Enter game day from dashboard | Implemented | `enterGameDay()` and navigation to game-day stack. |
| Game Day | Exit game day cleanly back to season view | Implemented | Back action in `GameDayHome` calls `exitGameDay()`. |
| Game Day | Master journey home with phase state | Implemented | Current phase card + progress dots + next CTA. |
| Game Day | Skippable optional phases | Implemented | Toggle logic in `GameDayHome` for skippable phases. |
| Game Day | Dedicated phase detail screens (8) | Implemented | Morning, Tailgate, Travel, Parking, Pregame, Ingame, Postgame, Home. |
| Ticket | Premium animated flip pass with QR reveal | Implemented | Spring/rotation/shimmer/tap animations. |
| Ticket | VIP concierge modules in ticket | Implemented | Arrival, entry, hospitality, postgame modules. |
| Ticket | Assistant-triggered flip action | Implemented | Bridge registration via `ticketFlipBridge`. |
| Stats | Team and fan stats screen | Partial | Rich cards/standings exist; lacks deeper interactivity/charts requested. |
| News | Reels-like full-screen story feed | Implemented | Vertical paging, large imagery, card overlay. |
| News | Filter chips (All/Exclusive/Analysis/Team News) | Implemented | Connected to assistant shared state. |
| Shop | Category filtering and featured/picks | Implemented | Connected to assistant shared state. |
| Shop | Commerce checkout/order backend | Not Implemented | UI only, mock order status. |
| AI Copilot | Floating orb + assistant panel | Implemented | Draggable orb, panel with history/actions. |
| AI Copilot | Text pipeline with action execution | Implemented | Route-aware snapshot and action registry execution. |
| AI Copilot | Voice mode | Partial | Mode exists, but no real recording/transcription pipeline yet. |
| AI Copilot | Camera mode | Partial | Mode exists, but no real camera capture/vision pipeline yet. |
| AI Copilot | Cloud-first proxy client | Partial | Client exists; production backend/proxy service not included here. |
| AI Copilot | Local fallback when proxy fails | Implemented | Mock assistant + inferred actions. |
| Safety | Auto-run policy by risk | Implemented | Low-risk commands auto-execute; high-risk prefixes blocked/confirm required. |
| Release | App Store production config | Not Implemented | No `eas.json` yet; iOS bundle ID/build flow not finalized in repo. |
| Legacy | Launcher/Widget/Renewal screens | Dormant | Files exist but not mounted in current navigation. |

## 9. AI Copilot Scope (Current)
### 9.1 Current Capability
Assistant can:
- Read route and game-day context snapshot.
- Return response message + typed cards.
- Execute commands for navigation and in-app state mutation.
- Apply News filter and Shop category.
- Enter/exit game day and jump phases.
- Open Live Ops detail and flip ticket pass.
- Trigger proactive suggestions (throttled: max once every 10 minutes).

### 9.2 Implemented Command Surface
- `navigate.home`
- `navigate.ticket`
- `navigate.news`
- `navigate.shop`
- `navigate.stats`
- `open.liveOpsDetail`
- `gameDay.enter`
- `gameDay.exit`
- `gameDay.goToPhase`
- `ticket.flipPass`
- `news.setFilter`
- `shop.setCategory`

### 9.3 Policy
- Low-risk commands auto-execute.
- Any command type with prefixes `payment.`, `account.`, `security.`, `profile.` is high-risk and blocked pending confirmation.

### 9.4 Copilot Gaps
- Real audio recording and server transcription not wired.
- Real camera capture or image-picker flow not wired.
- No persistent backend conversation store.
- No production telemetry sink (console-only events).

## 10. In Scope vs Out of Scope
### 10.1 In Scope (Current Product Increment)
- Premium frontend UX for Home, Game Day, Ticket, News, Shop, Stats.
- Unified navigation and game-day continuity.
- Route-aware AI copilot shell with low-risk action execution.
- Mock data and static content prototypes with realistic interaction patterns.

### 10.2 Explicitly Out of Scope (Current Increment)
- Real authentication and user accounts.
- Real ticketing backend or credential validation.
- Real parking/gate operations integrations.
- Real payment and checkout.
- Push notifications and background services.
- Real map SDK integrations and live traffic APIs.
- Native speech capture/transcription and computer vision services.
- Production analytics pipeline.

## 11. Feasibility, Desirability, Viability (FDV)
### 11.1 Feasibility
Overall: Medium-High for current frontend scope.

Strengths:
- Modern Expo/React Native stack with reusable theme system.
- Clear context architecture for state orchestration.
- Copilot command and policy layers already modularized.

Constraints:
- Backend dependencies not yet available for production concierge flows.
- Multimodal depth requires native permissions, media handling, and server services.
- Some UI technical debt remains from rapid iteration.

Feasibility score by stream (1-5):
- Frontend polish and interaction refinement: 5
- Copilot text/action orchestration: 4
- Real multimodal capture and inference: 3
- Full production operations integrations: 2

### 11.2 Desirability
Overall: High.

Evidence in product direction:
- High-clarity dashboard centered on next matchup and logistics.
- VIP-specific concierge framing across Live Ops and Ticket.
- Visual polish direction aligned to premium/dark/athletic luxury.

Current desirability gaps:
- Stats depth is still generic and not yet deeply football-analytical.
- Some phase content remains static placeholders rather than truly context-driven.
- Assistant reliability depends on mock fallback unless proxy is deployed.

Desirability score by stream (1-5):
- Core game-day logistics utility: 4
- VIP emotional value signaling: 4
- Data depth and personalization: 3

### 11.3 Viability
Overall: Medium (prototype strong, business stack incomplete).

What supports viability:
- Clear renewal/retention narrative.
- Premium up-sell and merch surfaces in product flow.
- Foundation for concierge monetizable services.

What limits viability today:
- No production backend integration.
- No payment rails.
- No instrumented retention/conversion funnel.
- No compliance and App Store operational hardening in repo yet.

Viability score by stream (1-5):
- Near-term prototype value: 4
- Production business readiness: 2

## 12. Functional Requirements
### 12.1 Home (Season HQ)
- Show next or current matchup prominently.
- Show season progress (`games completed / total`).
- Show context-aware Live Ops cards with detail drill-down.
- Provide quick entry into game-day flow.
- Present concierge and insider feed blocks.

### 12.2 Game Day Flow
- Allow entering and exiting game-day mode without breaking tab shell continuity.
- Maintain phase state with deterministic phase progression.
- Support dedicated screens for each phase.
- Provide phase advancement and detail views.

### 12.3 Ticket
- Present premium pass front and QR back with polished flip interaction.
- Include concierge operational modules.
- Allow assistant command to open and flip pass.

### 12.4 News
- Full-screen story feed with image-first cards.
- Filter chip behavior must work from user tap and assistant action.

### 12.5 Shop
- Category-based browsing and featured content.
- Category state must respond to assistant actions.

### 12.6 Assistant
- Persistent floating entry point.
- Contextual response generation with cards and actions.
- Auto-execute low-risk commands.
- Block high-risk command classes.
- Fallback behavior when cloud endpoint fails.

## 13. Non-Functional Requirements
- Performance target: smooth 60 FPS feel on modern iOS devices for core transitions.
- Input latency target: assistant open/close under 250ms on local UI actions.
- Accessibility: large touch targets and legible contrast-first typography.
- Reliability: graceful fallback when assistant backend unavailable.

Current compliance status:
- Performance and polish are good in most paths but still under iterative tuning.
- Accessibility foundations are present but not yet audited screen-by-screen.
- Error fallback exists for assistant service failures.

## 14. Technical Architecture (Current)
### 14.1 Stack
- Expo SDK 54
- React Native 0.81
- React Navigation (tabs + stack)
- `expo-blur`, `expo-linear-gradient`
- Lucide icons
- Theme-driven styling via `constants/theme.js`

### 14.2 App State
- `AppContext` manages schedule, user profile, current/next game, game-day mode/phase transitions, and manual mode override.
- `AssistantContext` manages panel state, conversation history, proactive toggles/cooldown, shared News/Shop state, and action execution/safety checks.

### 14.3 Assistant Service Path
1. Build snapshot from route + app context.
2. Send to proxy endpoint (`EXPO_PUBLIC_ASSISTANT_PROXY_URL` or localhost default).
3. Parse message/cards/actions.
4. If proxy fails, fallback to mock response and inferred actions.
5. Auto-run low-risk actions.

### 14.4 Data Layer Reality
Current data is mock/local:
- schedule
- user profile
- stats/news/shop content
- game-day details

No production API contract has been finalized in repo.

## 15. Privacy, Safety, and Compliance
Current safeguards:
- High-risk command classes blocked by policy.
- Snapshot redaction helper exists for logs.
- Conversation history local to session by default.

Pending for production:
- PII classification and retention policy.
- Consent flows for voice/camera.
- Secure backend key handling and auth.
- Compliance documentation for App Store release.

## 16. UX and Design System Alignment
Current design system uses:
- Michigan Blue and Maize as primaries.
- Dark premium gradients, blurred surfaces, high-contrast text.
- Atkinson Hyperlegible plus Montserrat typography.

Current UX strengths:
- Strong visual hierarchy on dashboard hero and operational cards.
- Better continuity between normal and game-day experiences.
- Premium ticket interaction quality is above baseline.

Current UX debt:
- Assistant overlay spacing still requires stabilization on all device classes.
- Some screens still rely on deprecated `SafeAreaView` import from React Native.
- Cross-screen visual consistency needs another refinement pass.

## 17. Metrics and Measurement Plan
Current state:
- No production analytics instrumentation.
- Assistant emits console telemetry only.

Required metrics for next phase:
- Home to action conversion rate (parking, ticket, entry).
- Game-day flow completion rate by phase.
- Assistant action success rate and fallback rate.
- Time-to-task completion (manual vs assistant-assisted).
- Retention and renewal proxy signals.

## 18. Risks and Mitigations
| Risk | Impact | Mitigation |
|---|---|---|
| Static mock data diverges from real operations | High | Define backend contracts early and map each UI card to API fields. |
| Assistant over-automation or wrong navigation | Medium | Keep strict command whitelist and risk policy gates. |
| Overlay/padding regressions across devices | Medium | Add device matrix QA with snapshot checks for key resolutions. |
| App Store readiness gaps | High | Add EAS config, identifiers, version/build discipline, and release checklist. |
| External image dependencies availability | Medium | Move critical assets local/CDN controlled by product. |

## 19. Roadmap
### 19.1 Completed (Current Increment)
- Reframed home around matchup and season progress.
- Integrated game-day flow into single app shell.
- Added richer Live Ops and concierge navigation.
- Upgraded ticket flip experience and assistant-triggered pass flip.
- Converted news to immersive reels-style cards and wired filters.
- Added floating copilot foundation with command execution and policy.

### 19.2 Next (P0)
- Stabilize assistant overlay layout across target iPhone sizes.
- Replace deprecated SafeAreaView usage in screens.
- Deploy real assistant proxy service.
- Add real voice capture and transcription flow.
- Add real camera capture/input flow.

### 19.3 Next (P1)
- Increase stats depth with football-relevant interactive modules.
- Deepen concierge journeys (parking lot image guidance, gate host details, postgame routes).
- Replace static game-day content with contextually generated content from live data.

### 19.4 Later (P2)
- Authenticated profiles and household/guest management.
- Payment-enabled premium commerce flows.
- Push and proactive notification engine.
- Renewal conversion experiments with measurable funnel instrumentation.

## 20. Release Readiness Checklist (Production)
- App identifiers and EAS config finalized.
- iOS build number and versioning workflow established.
- Proxy backend deployed and secured.
- Crash, analytics, and event instrumentation integrated.
- Privacy policy and data handling disclosures finalized.
- App Store metadata, screenshots, and submission package completed.

## 21. Open Questions
- Which concierge actions must be real-time at launch versus static assistive content?
- What exact SLA is expected for premium host handoff updates?
- Which assistant actions should remain auto-executed versus confirmation-gated beyond current policy?
- What renewal and revenue KPIs define launch success for this app version?

## 22. Change Log
- v3.0.0 (February 12, 2026)
- Replaced legacy two-mode PRD framing with current single-experience architecture.
- Added shipped vs partial vs not-implemented feature inventory.
- Added assistant subsystem scope and policy details.
- Added feasibility, desirability, viability analysis.
- Added roadmap, risks, release readiness, and open questions.

- v2.2 (prior)
- Older unified vision draft with outdated mode framing and incomplete implementation mapping.
