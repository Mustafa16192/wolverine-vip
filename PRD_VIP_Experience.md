# Product Requirement Document (PRD): The Wolverine VIP Experience

**Version:** 2.2 (Unified Vision)
**Target Audience:** Premium Season Ticket Holders (The "Victors" circle), 50+ demographic.
**Core Philosophy:** "The App is your Personal Game Day Concierge."
**Visual Language:** Athletic Luxury (U-M Blue, Gold, Glassmorphism, High Legibility).

---

## 1. Executive Summary
The Wolverine VIP app is an elite digital companion designed to remove friction from the lives of Michigan's most dedicated supporters. Recognizing that the premium experience begins long before kickoff and extends well after the final whistle, the app employs a **Context-Aware Interface**. It transforms based on the user's situation: a data-rich **"Club Mode"** for daily engagement and a directive, high-touch **"Chaperone Mode"** for the logistical complexities of Game Day.

---

## 2. Product Rationale
*   **Demographic Focus:** Optimized for users aged 50+ who value efficiency, exclusivity, and clarity. The UI uses high-contrast elements, larger touch targets, and the Atkinson Hyperlegible typeface.
*   **Value Proposition:** Transitioning from a "Digital Ticket" to a "Digital Concierge." The app doesn't just store data; it anticipates needs.
*   **Business Objective:** Increase season ticket renewal rates by elevating the physical experience through digital convenience and "white-glove" service.

---

## 3. The Two-Mode Architecture

### 3.1. "The Club" (Non-Game Day Mode)
Designed for mid-week use, focusing on information, history, and community.
*   **Bento Grid Dashboard:** A modular layout providing a high-level overview of the team and the member's status.
*   **Insider Wire:** Exclusive access to "Behind the Scenes" content and team updates.
*   **Legacy Locker:** A gamified summary of the user's history as a season ticket holder (tenure, wins seen, impact).
*   **VIP Shop:** Access to exclusive apparel drops and member-only merchandise.

### 3.2. "The Chaperone" (Game Day Mode)
Activates on Game Day, replacing the dashboard with a linear, card-based journey.
*   **Focus Card System:** The UI minimizes noise to show exactly what the user needs *right now*.
*   **Predictive Logic:** Automatically advances through the 8-step journey based on time and geolocation.

---

## 4. The End-to-End Game Day Journey

The app guides the user through eight distinct phases, ensuring a seamless experience:

1.  **WAKE UP (The Hype):**
    *   Morning weather report for Ann Arbor, hype-reel video, and recommended gear based on temperature.
2.  **TAILGATE (The Community):**
    *   GPS coordination for the user's specific tailgate lot. Ability to share location with guests.
3.  **TRAVELING (The Transit):**
    *   Real-time traffic integration with Waze/Maps. Notifications for road closures or recommended departure times.
4.  **PARKING (The Arrival):**
    *   Display of reserved parking spot details (Lot, Row, Spot). Digital parking permit surfaces automatically.
5.  **PRE-GAME ON-FIELD (The Perk):**
    *   Countdown to the user's exclusive on-field access window. Digital "Field Pass" QR code becomes active.
6.  **SEAT (The Settlement):**
    *   Interactive stadium map guiding the user to their specific VIP entry gate and seat.
7.  **IN-GAME (The Service):**
    *   **Smart Order Modal:** In-seat delivery menu for food and drinks. Real-time game stats and "Live Tunnel Cam" access.
8.  **POST-GAME (The Gratitude):**
    *   Traffic egress routing, game highlight summary, and a personalized "Thank You for your Loyalty" message.

---

## 5. Key Feature Specifications

### 5.1. The Digital ID ("The Gold Card")
*   A premium, 3D interactive season pass that uses gyroscope effects to shimmer. Flips to reveal a high-res QR code for entry and parking.

### 5.2. Contextual Notifications
*   AI-driven alerts that are proactive, not reactive (e.g., "Your usual order is ready for pickup at the start of the 2nd Quarter to avoid lines").

### 5.3. Athletic Luxury Styling
*   Utilizes the official U-M Design System (PMS 282 Blue, PMS 7406 Maize).
*   Glassmorphic "Blur" cards to provide depth while maintaining a modern, high-end aesthetic.

---

## 6. Technical Stack
*   **Framework:** React Native (Expo SDK 54).
*   **Styling:** Theme-driven architecture (`theme.js`) for consistency.
*   **Icons:** Lucide-React-Native for clean, recognizable iconography.
*   **Animation:** Animated API for smooth state transitions between journey phases.
