# SOGN SAFE — Agent Skills Catalog (`skills.md`)

> **Framework Reference**: Aligned with the [AgentSkills Framework](https://agentskills.io/home) and [OpenAI Codex Skills Specification](https://developers.openai.com/codex/skills).

---

## Skill Index

| Skill Name | Primary Agent | Purpose |
|------------|---------------|---------|
| `expo-router-navigation` | `agent-mobile-architect` | Manages file-based native routing, modals, and deep-link handling. |
| `nordic-civic-styling` | `agent-civic-designer` | Applies Scandinavian civic tokens, high contrast, and accessible touch targets. |
| `webdesigner-antislop-audit` | `agent-civic-designer` | Enforces automated anti-slop heuristic quality gate via WebDesigner CLI. |
| `emergency-state-orchestration` | `agent-emergency-coordinator` | Coordinates reactive incident states and civilian transition lifecycle. |
| `device-location-permission` | `agent-mobile-architect` | Handles foreground location permissions, disclosures, and approximate positioning. |
| `push-notifications-pipeline` | `agent-mobile-architect` | Manages push token lifecycle, notification channels, and incident deep-links. |
| `offline-resilience-cache` | `agent-emergency-coordinator` | Persists verified instructions and indicates connection status. |
| `platform-simulator-mocking` | `agent-platform-simulator` | Generates simulated incident events and acknowledges civilian help requests. |
| `eas-ios-build-workflow` | `agent-mobile-architect` | Configures and runs EAS build and TestFlight distribution steps. |

---

## 1. `expo-router-navigation`

### Description
Configures and maintains file-based routing using Expo Router inside `src/app/`, supporting stack navigation, modal presentations, and deep-linking into active emergencies.

### Trigger Conditions
- Adding new emergency screens or sub-flows (e.g., condition selection, safe confirmation).
- Handling push notification deep-links (e.g., `sognsafe://incident/inc-flam-2026-09`).

### Inputs
- Target route path (e.g., `/alert`, `/safety`, `/evacuate`, `/help`, `/safe`).
- Presentation type: `card` (standard stack), `modal` (transient action), `fade` (critical alert).
- Route parameters: `incidentId`, `condition`, `source`.

### Outputs
- Route files inside `src/app/` following strict Expo Router conventions.
- Navigation actions via `useRouter()` (`router.push()`, `router.replace()`, `router.back()`).

### Quality & Safety Constraints
- Root layout in `src/app/_layout.tsx` must wrap children with `SafeAreaProvider` and `StatusBar style="light"`.
- Never leave orphan unlinked routes.
- Deep links must gracefully fall back to `/` if an incident ID is expired or not found.

---

## 2. `nordic-civic-styling`

### Description
Applies the Scandinavian civic design system to all UI components, ensuring a calm, trustworthy, public-service aesthetic with extreme clarity under stress.

### Trigger Conditions
- Styling any user-facing screen, card, button, banner, or map representation.
- Refactoring UI for accessibility or contrast improvements.

### Inputs
- Semantic role (`canvas`, `surface`, `safetyGreen`, `emergencyRed`, `warningAmber`).
- Component type (hero banner, dominant touch target, tactical card, status pill).

### Outputs
- React Native `StyleSheet` objects referencing `Colors`, `Spacing`, `Typography`, and `BorderRadius` from `@/constants/theme`.

### Quality & Safety Constraints
- **Minimum Touch Target**: 48×48 px for all primary and secondary interactive elements.
- **Contrast**: Minimum 4.5:1 for body text; 3:1 for large headlines (WCAG AA).
- **No Palette Creep**: Strictly no purple, lilac, neon cyan, or generic blue-purple gradients.
- **One Dominant Action**: Each emergency screen must present one clear primary action.

---

## 3. `webdesigner-antislop-audit`

### Description
Executes an automated anti-slop and visual quality floor audit on UI screen components using the WebDesigner CLI engine (`wd audit`).

### Trigger Conditions
- Completion or modification of any React Native screen file in `src/app/` or component in `src/components/`.
- Pre-commit verification gate before checking off tasks in `taskplan.md`.

### Execution Command
```bash
wd audit <targetFilePath>
```

### Outputs
- Audit Score (0–100 scale).
- Heuristic violation breakdown (generic gradients, double borders, single blur shadows, stock emojis, inaccessible touch targets).
- Recommended design engineering remediation.

### Quality & Safety Constraints
- Minimum passing score: **85/100**. Target score: **100/100**.
- Zero stock emoji icons in emergency guidance; use geometric SVG vectors or abstract text glyphs.

---

## 4. `emergency-state-orchestration`

### Description
Implements and enforces the reactive emergency state machine in `EmergencyContext`, translating platform incident events into unambiguous civilian states.

### State Transition Diagram
```
    [ NORMAL (READY) ]
           │
           │ (PUBLIC_ALERT_ISSUED)
           ▼
    [ ACTIVE (ALERT) ]
      /             \
     / (GO TO SAFETY) \ (I NEED HELP)
    ▼                   ▼
[ FIND SAFETY ]      [ HELP CONDITION ]
    │                   │
    │ (START ROUTE)     │ (SEND SIGNAL)
    ▼                   ▼
[ EVACUATE ]         [ HELP ACKNOWLEDGED ]
    │                   │
    │ (I AM SAFE)       │ (RESCUED / SAFE)
    ▼                   ▼
    [ SAFE REPORTED ]
```

### Inputs
- Incoming incident events: `PUBLIC_ALERT_ISSUED`, `EVACUATION_ORDERED`, `HELP_ACKNOWLEDGED`, `INCIDENT_ENDED`.
- Civilian actions: `goToSafety()`, `startRoute()`, `submitHelpRequest()`, `reportIAmSafe()`.

### Outputs
- React context values: `hasActiveIncident`, `incident`, `activeHelpRequest`, `isSafeReported`.

### Quality & Safety Constraints
- State changes must trigger immediate UI updates without race conditions.
- Reporting "I AM SAFE" records civilian status but does NOT terminate the public incident.

---

## 5. `device-location-permission`

### Description
Manages device location access using `expo-location`, providing transparent user consent disclosures, approximate positioning, and shelter distance calculations.

### Trigger Conditions
- Determining if a user is within an affected emergency polygon.
- Calculating distance and walking time to the nearest confirmed safe zone.
- Transmitting civilian rescue coordinates during `I NEED HELP`.

### Inputs
- Required accuracy: `LocationAccuracy.Balanced` (foreground calculation).
- Target safe zone coordinates (`latitude`, `longitude`).

### Outputs
- User coordinates (`latitude`, `longitude`).
- Distance in meters and estimated walking duration in minutes.
- Human-readable location description (e.g., "Near Flåm Waterfront Area").

### Quality & Safety Constraints
- **Foreground Only**: No continuous background location tracking in V1.
- **Explicit Disclosure**: Explain why location is needed before requesting the iOS system prompt.
- **Fallback**: If location permission is denied, app must still allow manual selection of the safe shelter.

---

## 6. `push-notifications-pipeline`

### Description
Handles Expo push notification token acquisition, local foreground notification presentation, and incident deep-link activation upon notification tap.

### Trigger Conditions
- App initialization and notification onboarding screen.
- Receiving simulated emergency alerts in foreground, background, or killed states.

### Inputs
- Expo project ID / bundle identifier (`no.hvl.sognsafe`).
- Incoming remote notification payload with `incidentId` and `type`.

### Outputs
- Expo Push Token (`ExponentPushToken[...]`).
- Local notification display with custom color (`#D93829`) and vibration.
- Direct navigation into the `/alert` screen.

### Quality & Safety Constraints
- Standard iOS notification permissions only. Do not claim Critical Alerts capability in V1.
- Respect iOS Silent/Focus modes; do not bypass without Apple governmental entitlement.

---

## 7. `offline-resilience-cache`

### Description
Stores emergency instructions, safe zone directories, and tactical route paths in `@react-native-async-storage/async-storage` for reliable retrieval when cellular networks are degraded or disconnected.

### Trigger Conditions
- Receipt of new incident updates or safe zone status changes.
- Device network state transitions to offline or degraded.

### Inputs
- Active incident payload, safe zone models, route coordinate lists.
- Verification timestamp (e.g., `14:47`).

### Outputs
- Cached emergency manifest loaded into state upon startup.
- `isDegradedConnection` flag triggering the `LIMITED CONNECTION` warning banner.

### Quality & Safety Constraints
- **Transparency Rule**: Never present cached data as live. Always display the "LAST VERIFIED" timestamp.
- Route geometry and safe shelter locations must remain viewable offline once cached.

---

## 8. `platform-simulator-mocking`

### Description
Provides mock infrastructure and testing controls that imitate the future professional emergency coordination platform.

### Trigger Conditions
- Classroom demonstrations, stakeholder walkthroughs, and automated test passes.
- Simulating the Flåm passenger vessel collision incident.

### Inputs
- Scenario selector (`START FLÅM SCENARIO`, `ACKNOWLEDGE HELP`, `END INCIDENT`).
- Registered test device ID.

### Outputs
- Emitted test domain events (`PUBLIC_ALERT_ISSUED`, `HELP_ACKNOWLEDGED`).
- Console telemetry for demo monitoring.

### Quality & Safety Constraints
- All simulated events must carry an explicit test header (`isDemonstrator: true`).
- Simulator code must be isolated from production mobile business logic.

---

## 9. `eas-ios-build-workflow`

### Description
Orchestrates Expo Application Services (EAS) builds, provisioning profile generation, and TestFlight submissions for physical iPhone validation.

### Trigger Conditions
- Preparing internal testing builds for physical iPhone deployment.
- Verifying native push notifications and iOS permissions on real hardware.

### Inputs
- `eas.json` configuration file.
- Apple Developer Team credentials.
- Bundle identifier: `no.hvl.sognsafe`.

### Outputs
- Production-ready iOS `.ipa` binary distributed to TestFlight.
- Build logs and signing artifact reports.

### Quality & Safety Constraints
- `supportsTablet` must remain `false` (iPhone primary target).
- Never commit private Apple certificates or API tokens to source control.
