# SOGN SAFE — Agent Governance & Operational Rules (`rules.md`)

> **Standard Reference**: Aligned with the [OpenAI Codex Rules Standard](https://developers.openai.com/codex/rules).
> 
> **Authority**: These rules represent inviolable project invariants. All agents, subagents, and automated assistants operating within this repository must adhere strictly to these directives without exception.

---

## Priority 0 (P0) — Non-Negotiable Safety Invariants

### RULE 0.1: Hard Emergency Boundary (Sandbox Isolation)
- **Directives**:
  - SOGN SAFE is a student innovation prototype developed at HVL for INN524.
  - **NEVER** connect, link, mock, or route network traffic to genuine emergency services, including:
    - 112 / Police dispatch
    - 110 / Fire & rescue dispatch
    - 113 / Emergency medical dispatch
    - Hovedredningssentralen (HRS)
    - Kystverket / Maritime AIS infrastructure
    - Sivilforsvaret or governmental emergency SMS / cell broadcast networks.
  - All alerts, incidents, coordinates, and instructions are simulated test data.
  - Every screen, notification, and simulator output must clearly indicate prototype/demonstrator status (`TRAINING MODE` or `DEMONSTRATOR`).

### RULE 0.2: Civilian Simplicity Principle
- **Directives**:
  - Core philosophy: *"Professional complexity becomes civilian simplicity."*
  - The civilian user must be guided to answer 4 questions within 1 second of glancing at the screen:
    1. *Am I in danger?*
    2. *Where should I go?*
    3. *How do I get there?*
    4. *What do I do if I cannot evacuate?*
  - **NEVER** expose responder command hierarchies, hospital triage logistics, agent communication logs, or military/tactical jargon to the civilian interface.

### RULE 0.3: Truthfulness & No False Rescue Guarantees
- **Directives**:
  - The UI must **never** mislead a civilian into believing rescue is guaranteed or arriving at a specific minute.
  - **Compliant**: `"HELP REQUEST RECEIVED — Rescue teams have your approximate coordinates."`
  - **Prohibited**: `"Ambulance will arrive in 3 minutes."` (unless the simulation specifically tests a fictional ETA scenario with explicit disclaimer).
  - Acknowledgment statuses must accurately represent simulator response, never fabricated instant success.

### RULE 0.4: Anti-Slop & Scandinavian Civic Design Standards
- **Directives**:
  - The visual identity must remain calm, trustworthy, robust, understated, and public-service oriented.
  - **Prohibited Aesthetics**:
    - Neon purple, lilac, magenta, and cyan radial glows.
    - Blue-to-purple gradients.
    - Generic AI chat or crypto-dashboard styling.
    - Decorative glassmorphism and blurred frosted cards that degrade outdoor readability.
    - Double borders and single-blur heavy drop shadows.
    - Stock emoji icons (e.g., ⚠, 🚨, 🏃‍♂️); use technical SVG glyphs or geometric indicators instead.
  - **Mandatory Quality Gate**:
    - Every newly created or edited screen component must pass `wd audit <filePath>` with a minimum score of **85/100**.

---

## Priority 1 (P1) — Privacy & Permission Governance

### RULE 1.1: Foreground-Only Location Privacy
- **Directives**:
  - Collect the minimum data required.
  - Normal/Ready mode must **never** continuously track or upload civilian coordinates in the background.
  - Location is used locally to compute distance to safe zones.
  - Location is transmitted over the network **only** when the user explicitly triggers `I NEED HELP` and confirms the disclosure screen.

### RULE 1.2: Transparent Permission UX
- **Directives**:
  - Never trigger system permission dialogs (location, notifications) abruptly on app launch without contextual explanation.
  - Always precede system prompts with a brief, clear explanation screen explaining why the permission is vital for civilian safety.
  - Gracefully handle `DENIED` states; always provide a manual fallback (e.g., manual shelter selection).

### RULE 1.3: Honest iOS Notification Capabilities
- **Directives**:
  - V1 uses standard iOS notification permissions and haptic feedback.
  - **NEVER** claim or advertise Critical Alert capabilities (bypassing Silent/Focus switch) in V1, as Apple requires special governmental entitlement.
  - Critical Alert support must remain gated as a future feature flag only.

---

## Priority 2 (P2) — Offline Resilience & Connectivity

### RULE 2.1: Transparent Cache Disclosure
- **Directives**:
  - The application must cache the active incident summary, last verified instruction, assigned safe zone, and tactical evacuation route.
  - When network connection is lost or degraded:
    - Display the prominent `LIMITED CONNECTION` banner.
    - Display the exact `LAST VERIFIED UPDATE` timestamp (e.g., `14:47`).
    - **NEVER** silently present cached data as live real-time information.
    - The civilian must still be able to follow the cached route geometry.

---

## Priority 3 (P3) — Engineering & Execution Standards

### RULE 3.1: Strict Phase Discipline (`taskplan.md`)
- **Directives**:
  - `taskplan.md` is the single source of truth for engineering progress.
  - Complete phases in strict numerical order (Phase 0 → Phase 1 → Phase 2 ...).
  - Do not jump ahead because another phase seems easier or convenient.
  - Mark `[x]` **only after** both implementation and verification pass.
  - If an item is blocked, leave it unchecked and append: `BLOCKED: <exact reason and next step>`.

### RULE 3.2: Type Safety & Compilation Invariants
- **Directives**:
  - TypeScript must be strictly typed across all components, hooks, contexts, and models.
  - Run `npx tsc --noEmit` before concluding any turn; exit code must be `0`.
  - All interactive elements must have a minimum touch target of 48×48 px.
  - Follow Expo Router file-based conventions inside `src/app/`.

### RULE 3.3: Tool Usage & Communication Protocols
- **Directives**:
  - **Always** explain to the user why a tool is being invoked before making the call.
  - **Never** output raw code blocks to the user unless explicitly requested; use code editing tools.
  - Format all file references as clickable Markdown links (e.g., `[file.tsx](file:///path/to/file.tsx)`).
  - Maintain documentation integrity; preserve existing comments, docstrings, and tests.
