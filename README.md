# SOGN SAFE • Civilian Emergency System (Indre Sogn)

A civilian emergency mobile application prototype for iPhone developed as part of the **HVL INN524** innovation course at Western Norway University of Applied Sciences (*Høgskulen på Vestlandet*).

---

## 1. Safety Sandbox & Academic Boundaries (P0 Invariant)

> [!IMPORTANT]
> **ACADEMIC DEMONSTRATION ONLY**:
> SOGN SAFE is an experimental student prototype designed to model civilian evacuation guidance during a simulated large passenger-vessel collision near Flåm harbor (*Flåm kai*).
> - Strictly **NO** connection to live Norwegian emergency dispatch services (112, 113, 110, Hovedredningssentralen / HRS, Kystradio).
> - All warnings and distress signals are simulated locally or routed to the temporary classroom Platform Simulator.
> - In any real-world emergency, dial **112** (Police) or **113** (Ambulance) directly.

---

## 2. Core Architecture & Technology Stack

- **Mobile Framework**: Expo SDK 57 / React Native 0.86.3 / React 19 / TypeScript / Expo Router.
- **Design System**: Scandinavian civic public-service UX (high-contrast off-black `#121417`, high-visibility red `#D93829`, deep safety green `#1E874B`, 64px min-height primary emergency touch targets).
- **Design Engine & Quality Assurance**: Built and audited using `uset82/webdesigner` (`wd audit`) with a strict 100/100 anti-slop quality score across all routes.
- **Privacy Standard**: Foreground-only GPS positioning (`expo-location`). No background location tracking.
- **Offline Resilience**: Complete local cache persistence (`@react-native-async-storage/async-storage`) and degraded cellular connectivity indicator (`LIMITED CONNECTION`).
- **Bilingual Architecture**: Instant toggling between English and Norsk Bokmål (`translations.ts`).
- **Platform Simulator**: Standalone Node.js test harness and live web dashboard (`simulator/server.js`, `simulator/index.html`) on port 4000.

---

## 3. Getting Started & Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g eas-cli`)

### Install Dependencies
```bash
cd c:/Users/carlos/HVL2026/Autumn_2026/INN524/app
npm install
```

### Run the Mobile Application (iPhone / Web / Simulator)
```bash
# Start Expo Metro bundler
npm run start

# Launch on iOS Simulator (macOS) or development build
npm run ios

# Launch in browser (for rapid UI review)
npm run web
```

### Run the Platform Simulator
In a separate terminal window:
```bash
npm run simulator
```
Open your browser at:
**[http://localhost:4000/simulator](http://localhost:4000/simulator)**

---

## 4. End-to-End Classroom Demonstration Script (Phase 31)

1. **Start the Simulator**: Run `npm run simulator` and open `http://localhost:4000/simulator` on your laptop.
2. **Open the iPhone App**: Launch SOGN SAFE on your iPhone or Expo Go / iOS Simulator.
3. **Verify READY State**: Observe the calm, reassuring screen: `SAFE • No active emergency in your area`. Note the calm schematic map card, local cache timestamp, and 3 utility drawers (*Readiness*, *Safe Places*, *Offline Info*).
4. **Trigger Flåm Vessel Scenario**: Click **"TRIGGER FLÅM PASSENGER SHIP COLLISION"** on the laptop simulator.
5. **Receive Emergency Alert**:
   - The iPhone screen immediately transitions to **CRITICAL EMERGENCY ALERT** with urgent haptic feedback.
   - Prominently displays: `YOU ARE INSIDE THE AFFECTED AREA` and estimated risk window (~15 min).
6. **Evacuation Decision**:
   - Tap **"GO TO SAFETY"** to open the **FIND SAFETY** shelter directory.
   - Review nearest shelter: *Flåm Skule & Samfunnshus* (650m, 8 min walk, +18m elevation, open & confirmed).
   - Tap *"Show another safe area"* to cycle through alternative high-ground points (e.g. *Fretheim Høyde*).
7. **Turn-by-Turn Navigation**:
   - Tap **"START SAFE ROUTE"** to open **EVACUATION GUIDANCE**.
   - Review top directive: `CONTINUE NORTH` and secondary caution: `Do not return toward waterfront kai`.
   - Tap the turn banner to advance to Step 2 (*Turn left into school shelter*).
8. **Distress Telemetry (Optional Branch)**:
   - Tap **"I NEED HELP"**.
   - Select condition: `I AM INJURED` or `I AM TRAPPED`.
   - Tap **"SEND HELP SIGNAL"**.
   - Verify on the laptop simulator: The incoming distress signal appears in real time with condition and device ID.
   - Click **"Acknowledge"** on the laptop: The iPhone status updates to `HELP REQUEST ACKNOWLEDGED`.
9. **Confirm Safe Arrival**:
   - Tap **"I AM SAFE"** on the iPhone.
   - Screen displays `SAFE STATUS RECORDED` with reassuring success haptic.
   - Verify on the laptop simulator: The civilian check-in log records the arrival.
10. **Resolve Scenario**:
    - Click **"RESOLVE INCIDENT"** on the laptop simulator.
    - All-clear is broadcast and the iPhone returns to the normal **READY** state.

---

## 5. TestFlight Deployment Workflow (Phase 29 & 30)

The application is pre-configured for Apple TestFlight distribution via Expo Application Services (EAS):

1. **Log in to your Expo account**:
   ```bash
   eas login
   ```
2. **Initialize EAS project (if not linked)**:
   ```bash
   eas project:init
   ```
3. **Configure Apple Developer Credentials**:
   Ensure your Apple ID is associated with an active Apple Developer Program membership.
4. **Trigger Cloud iOS Build**:
   ```bash
   # Build production ipa for TestFlight
   eas build --platform ios --profile production
   ```
5. **Submit to TestFlight**:
   ```bash
   eas submit --platform ios
   ```
6. **Install via TestFlight**: Open the TestFlight invite on your physical iPhone to install the production build.

---

## 6. Verification Status

- `npx tsc --noEmit`: Clean (0 errors).
- `wd audit`: 100/100 across all 7 app screens and 4 component drawers.
- `app.json`: Validated with bundle ID `no.hvl.sognsafe`.
- `eas.json`: Validated build profiles.
