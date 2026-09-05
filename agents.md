# SOGN SAFE — Agent Architecture & Roles (`agents.md`)

> **Specification Reference**: Aligned with the [agents.md specification](https://github.com/agentsmd/agents.md) and [OpenAI Codex Agent Guides](https://developers.openai.com/codex/guides/agents-md).

---

## 1. Project Overview & Context

**SOGN SAFE** is a civilian emergency application prototype developed for the HVL INN524 student innovation course. It targets a physical iPhone application built with Expo, React Native, and TypeScript, installable via TestFlight, and validated end-to-end against a temporary Platform Simulator.

- **Primary Goal**: Translate complex emergency response telemetry into 4 simple civilian answers:
  1. *Am I in danger?*
  2. *Where should I go?*
  3. *How do I get there?*
  4. *What do I do if I cannot evacuate?*
- **Primary Domain Principle**: *"Professional complexity becomes civilian simplicity."*

---

## 2. Agent Roster & Role Definitions

### 2.1 Lead Mobile Architect (`agent-mobile-architect`)
- **Primary Responsibility**: Oversees the Expo / React Native codebase, Expo Router file-based navigation, state management, and iOS build configurations.
- **Core Domain**:
  - Expo SDK 57 & React Native 0.86.3 configuration
  - TypeScript strict typings across all screens and services
  - Native iOS capabilities: `expo-notifications`, `expo-location`, `expo-haptics`
  - EAS Build & TestFlight packaging (`no.hvl.sognsafe`)
- **Inputs**: Feature specifications from `mainidea.md`, task items from `taskplan.md`.
- **Outputs**: Well-typed components, routing architecture, performance-tuned layouts, build configurations.
- **Constraints**: iPhone-first focus; avoid premature Android-specific divergence that delays TestFlight delivery.

---

### 2.2 Civic Design & Accessibility Specialist (`agent-civic-designer`)
- **Primary Responsibility**: Enforces Scandinavian civic design principles, WCAG AA accessibility compliance, and anti-slop visual standards.
- **Core Domain**:
  - Color token governance (Charcoal `#0D0F12`, Safety Green `#1E874B`, Emergency Red `#D93829`, Warning Amber `#D97706`, Off-white `#F6F5F2`)
  - Minimum 48px touch targets for users in high-stress/trembling situations
  - Semantic clarity and 1-second comprehension rule
  - WebDesigner anti-slop quality gate verification (`wd audit`)
- **Inputs**: Wireframes, screen layouts, design tokens in `src/constants/theme.ts`, `logo.md` brand specifications.
- **Outputs**: Accessible screen templates, high-contrast layouts, tokenized styling.
- **Constraints**: Strictly reject generic AI aesthetics: no purple/lilac, no neon cyan gradients, no decorative glassmorphism, no double borders, no stock emojis.

---

### 2.3 Emergency Protocol & Domain Coordinator (`agent-emergency-coordinator`)
- **Primary Responsibility**: Governs the domain event contracts, state transitions, and emergency models.
- **Core Domain**:
  - Domain lifecycle: `READY` → `ALERT` → `FIND SAFETY` → `EVACUATE` → `SAFE`
  - Rescue branch: `I NEED HELP` → Condition selection → Location disclosure → Dispatcher acknowledgment
  - Data contracts: `Incident`, `SafeZone`, `EvacuationRoute`, `HelpRequest`
  - Offline caching strategy: Local persistence of last verified emergency instruction and timestamp
- **Inputs**: Emergency scenarios (e.g., Flåm passenger vessel collision), mock event streams.
- **Outputs**: Reactive contexts, typed event handlers, local storage caches.
- **Constraints**: Never make false promises or display unverified ETAs (e.g., display "HELP REQUEST RECEIVED", never "AMBULANCE ARRIVING IN 3 MINUTES").

---

### 2.4 Platform Simulator & Integration Engineer (`agent-platform-simulator`)
- **Primary Responsibility**: Builds and maintains the lightweight temporary Platform Simulator and mock APIs imitating the future professional emergency platform.
- **Core Domain**:
  - Simulated scenario controls (`START FLÅM SCENARIO`, `SEND ALERT`, `ACKNOWLEDGE HELP`)
  - Device token registration and push notification dispatching
  - Simulating network degradation and connection recovery
  - Contract parity so the future multi-agent professional platform can cleanly replace the simulator
- **Inputs**: Test scenario parameters, incoming help requests.
- **Outputs**: Mock API routes, simulator UI controls, test push payloads.
- **Constraints**: Keep simulator strictly decoupled from civilian app logic; simulator code must never pollute production mobile bundles.

---

### 2.5 Security, Privacy & Boundary Auditor (`agent-security-auditor`)
- **Primary Responsibility**: Enforces project safety boundaries, privacy safeguards, and mock data verification.
- **Core Domain**:
  - Hard boundary enforcement: Zero connections to real emergency services (112, HRS, police, fire, health, AIS)
  - Clear test demonstrator labeling (`TEST SCENARIO` / `TRAINING MODE`)
  - Privacy principle: Foreground location only; zero passive tracking; explicit user confirmation before sharing coordinates
  - Dependency integrity and secret isolation
- **Inputs**: Network endpoints, permission declarations in `app.json`, data transmission payloads.
- **Outputs**: Audit reports, security constraints, compliance checks.
- **Constraints**: Unconditional veto power over any integration that could inadvertently broadcast live emergency alerts or leak civilian location.

---

## 3. Collaboration & Handoff Protocols

```
┌────────────────────────────────┐
│   Task Intake (taskplan.md)    │
└──────────────┬─────────────────┘
               │
               ▼
┌────────────────────────────────┐
│  agent-emergency-coordinator   │ ──► Defines/validates domain models & state contracts
└──────────────┬─────────────────┘
               │
               ▼
┌────────────────────────────────┐
│     agent-civic-designer       │ ──► Establishes tokens, layout, accessibility & audit floor
└──────────────┬─────────────────┘
               │
               ▼
┌────────────────────────────────┐
│     agent-mobile-architect     │ ──► Implements Expo Router screens, services & state
└──────────────┬─────────────────┘
               │
               ▼
┌────────────────────────────────┐
│    agent-platform-simulator    │ ──► Verifies end-to-end flow with simulated event payloads
└──────────────┬─────────────────┘
               │
               ▼
┌────────────────────────────────┐
│    agent-security-auditor      │ ──► Verifies safety boundary, privacy, and marks task complete
└────────────────────────────────┘
```

1. **Phase Discipline**: Tasks must be implemented strictly in order according to `taskplan.md`. No agent may skip phases.
2. **Audit Verification Gate**: Any new UI screen must pass `wd audit <screenPath>` with a minimum score of 85 before being marked complete.
3. **Type Safety Gate**: All code modifications must pass `npx tsc --noEmit` with zero errors prior to handoff.
4. **Boundary Verification Gate**: Every scenario and alert payload must be explicitly verified as simulated test data.
