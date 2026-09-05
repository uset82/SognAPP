# SOGN SAFE — Civilian Emergency iPhone App

## Project status

SOGN SAFE is an INN524 student innovation prototype developed at HVL.

This repository builds the REAL civilian mobile prototype.

The first target is:

- real iPhone application
- Expo / React Native
- installable through TestFlight
- real push-notification testing
- real app navigation
- real device location permission
- simulated emergency scenarios
- temporary Platform Simulator for testing

This is NOT yet a production emergency system.

The professional emergency coordination platform will be developed later.

For the current phase, a lightweight Platform Simulator will imitate the future platform and agent network so the iPhone application can be tested end-to-end.

---

# 1. Product vision

SOGN SAFE is a civilian emergency application for residents, tourists, workers, students, families and visitors in Inner Sogn.

The initial innovation scenario is:

A large passenger vessel loses manoeuvrability near a harbor/kai in Inner Sogn and may collide with the waterfront.

Authorities may have only a short time to:

- understand the situation
- establish a danger zone
- warn civilians
- open safe areas
- communicate evacuation instructions
- guide civilians away from danger
- locate civilians who cannot evacuate
- coordinate rescue requests

The professional side may be complex.

The civilian experience must remain extremely simple.

Core product principle:

> Professional complexity becomes civilian simplicity.

---

# 2. Core civilian questions

During an emergency, SOGN SAFE must help the civilian answer four questions:

1. Am I in danger?
2. Where should I go?
3. How do I get there?
4. What do I do if I cannot evacuate?

The civilian should not need to understand:

- emergency command structures
- agent architecture
- hospital coordination
- police coordination
- maritime systems
- responder logistics
- technical emergency terminology

The app translates an authorised incident state into simple personal instructions.

---

# 3. Core journey

Primary journey:

NORMAL
↓
ALERT
↓
FIND SAFETY
↓
EVACUATE
↓
SAFE

Alternative emergency branch:

ALERT
↓
I NEED HELP
↓
SELECT CONDITION
↓
SHARE LOCATION
↓
HELP REQUEST RECEIVED
↓
RESPONDER UPDATE
↓
SAFE

Core conceptual model:

WARN → GUIDE → LOCATE → RESCUE

---

# 4. Existing UX prototype

Existing generated prototype images define the initial visual direction.

Current screens:

## 01 / READY

Normal state.

Main message:

SAFE

No active emergency in your area.

Functions conceptually shown:

- safe places
- emergency readiness
- offline information
- language selection
- cached emergency information

---

## 02 / ALERT

Critical alert state.

Main message:

EMERGENCY ALERT

Possible vessel collision near Flåm harbor.

YOU ARE INSIDE THE AFFECTED AREA

Two dominant actions:

GO TO SAFETY

I NEED HELP

---

## 03 / FIND SAFETY

The application determines which predefined safe location is relevant to the user.

Example:

Flåm School

650 m

8 min walk

OPEN AND CONFIRMED

Map shows:

- user
- affected area
- blocked waterfront
- safe destination
- safe route

---

## 04 / EVACUATE

Turn-by-turn emergency guidance.

Example:

CONTINUE NORTH

Turn left in 120 m

Flåm School Safe Area

520 m

6 min walk

The navigation intentionally removes irrelevant map information.

Persistent action:

I NEED HELP

---

# 5. Design principles

The app is designed for someone who may be:

- frightened
- injured
- disoriented
- helping children
- helping elderly people
- unfamiliar with Inner Sogn
- a tourist
- unable to speak Norwegian
- experiencing weak connectivity

Therefore:

- very large touch targets
- minimal reading
- one obvious primary action
- high contrast
- simple icons
- no unnecessary navigation
- no advertising
- no social functions
- no chat clutter
- no complex dashboards
- no technical jargon

The user should understand critical screens within approximately one second.

---

# 6. Visual identity

Brand:

SOGN SAFE

Descriptor:

Civilian Emergency App

Visual direction:

- Scandinavian civic design
- calm
- trustworthy
- robust
- understated
- public-service feeling

Palette direction:

- warm off-white
- charcoal
- muted fjord gray-green
- deep safety green
- restrained amber
- emergency red only for critical danger/help

Avoid:

- purple
- lilac
- neon blue
- blue-purple gradients
- cyberpunk
- generic AI aesthetics
- decorative glassmorphism

The existing generated screenshots are the visual source of truth for V1.

---

# 7. Technology

Primary stack:

- Expo
- React Native
- TypeScript
- Expo Router

Primary Expo capabilities expected:

- expo-notifications
- expo-location
- local persistent storage
- secure storage where appropriate
- EAS Build
- EAS Submit / TestFlight workflow

Use the existing project stack if the repository has already been initialized.

Do not replace working architecture without evidence that it is necessary.

---

# 8. Target devices

Primary target:

iPhone

Initial testing:

- iOS Simulator
- physical iPhone
- TestFlight

Android support may come later because Expo supports it, but the first delivery target is iOS.

Do not allow Android work to delay the TestFlight prototype.

---

# 9. Development tools

Where available, use:

## XcodeBuildMCP

For:

- simulator builds
- running the app
- simulator interaction
- screenshots
- verification

## Expo / EAS MCP

For:

- Expo configuration
- SDK documentation
- EAS Build
- credentials workflow
- TestFlight preparation

## Figma MCP

For:

- design tokens
- layout inspection
- future component handoff

Do not add RevenueCat.

SOGN SAFE has no subscriptions, purchases or paywalls.

---

# 10. Temporary Platform Simulator

The real professional emergency platform does not exist yet.

To test SOGN SAFE, build a TEMPORARY Platform Simulator.

Its purpose is only to generate test events that imitate the future system.

It is not the professional product.

The simulator may expose controls such as:

START FLÅM SCENARIO

SEND EMERGENCY ALERT

EVACUATE ZONE A

SET SAFE AREA

UPDATE SAFE ROUTE

SIMULATE CONNECTION LOSS

ACKNOWLEDGE HELP REQUEST

END INCIDENT

The simulator must remain visually and technically separate from SOGN SAFE.

---

# 11. Future architecture compatibility

Even though the current source is a simulator, the mobile app should consume stable domain events.

Conceptual flow:

Platform Simulator
↓
Prototype API
↓
Notification / incident service
↓
SOGN SAFE

Later:

Professional Platform
↓
Main Agent / Orchestrator
↓
Public Agent
↓
Citizen Agent
↓
same incident API/events
↓
SOGN SAFE

The app should not need to know whether an event originated from the temporary simulator or the future platform.

---

# 12. Core domain events

Design stable event/data contracts for at least:

INCIDENT_STARTED

PUBLIC_ALERT_ISSUED

EVACUATION_ORDERED

SAFE_ZONE_UPDATED

ROUTE_UPDATED

INCIDENT_UPDATED

INCIDENT_ENDED

HELP_REQUEST_SUBMITTED

HELP_REQUEST_ACKNOWLEDGED

USER_SAFE_REPORTED

Do not overengineer these contracts.

Keep them understandable and versionable.

---

# 13. V1 incident model

A fictional incident may contain:

- incident id
- title
- type
- severity
- status
- location
- created timestamp
- last verified timestamp
- affected zones
- safe zones
- public instruction
- estimated risk window
- current evacuation state

All data in V1 is test/simulated data.

---

# 14. Safe zone model

A safe zone should contain:

- id
- name
- latitude
- longitude
- status
- confirmation timestamp
- short description
- accessibility metadata if relevant

Initial fictional example:

Flåm School Safe Area

Status:

OPEN_AND_CONFIRMED

---

# 15. Route model

For V1, routes may use simulated/predefined route geometry.

The app does NOT need a sophisticated routing engine initially.

Route data may contain:

- route id
- origin
- destination safe zone
- path coordinates
- estimated distance
- estimated walking time
- next instruction
- route status
- blocked areas
- verified timestamp

Later the routing system may become more advanced.

---

# 16. Notification model

SOGN SAFE must support real test push notifications on TestFlight.

Example notification:

EMERGENCY ALERT

Possible vessel collision near Flåm harbor.

Open SOGN SAFE for instructions.

When opened, the notification must deep-link into the relevant incident state.

---

# 17. iOS notification sound strategy

V1 must NOT assume access to Apple's governmental emergency-warning infrastructure.

V1 notification strategy:

- standard iOS notification permission
- vibration/haptic behavior where supported
- prominent notification
- appropriate notification sound
- foreground emergency UI

If a custom notification sound is used, bundle it correctly and verify it on physical iPhone.

Critical Alerts are a separate future capability.

Do not block V1 on Critical Alerts.

Critical Alert support must remain feature-gated because Apple requires special entitlement/approval.

Do not falsely claim that V1 can bypass Silent Mode or Focus unless the entitlement has actually been granted and verified.

---

# 18. Notification permissions UX

Do not request every permission immediately on first launch without explanation.

Explain why notifications matter:

> SOGN SAFE uses notifications to warn you when an active emergency may affect your area.

Then request notification permission.

Handle:

- granted
- denied
- provisional/limited where applicable
- permission changed later

Provide a settings path if notifications are disabled.

---

# 19. Location

Location is important for deciding:

- whether the civilian is inside an affected area
- nearest safe zone
- starting point for evacuation guidance
- help-request location

Use expo-location.

Location must be permission-based.

Do not silently collect location.

For V1:

foreground location is sufficient unless a validated use case requires more.

Do not introduce continuous background tracking without a strong reason.

---

# 20. Privacy principle

Collect the minimum information required.

Normal mode should not continuously upload the user's location.

Conceptual behavior:

NORMAL:
location may be used locally when needed.

ACTIVE INCIDENT:
location may be used to determine relevant safety guidance.

HELP REQUEST:
location may be explicitly sent when the civilian chooses to request help.

Clearly communicate when location is being transmitted.

---

# 21. I NEED HELP flow

The emergency screen always provides:

I NEED HELP

The first implementation should support:

I AM INJURED

I AM TRAPPED

I CANNOT WALK

I AM WITH PEOPLE WHO NEED HELP

OTHER URGENT HELP

Avoid text entry unless necessary.

After selection:

SEND HELP SIGNAL

The app shows what information will be sent.

Example:

- selected condition
- approximate location
- timestamp
- test-device identifier
- current incident id

The user confirms submission.

---

# 22. Help request states

Support:

DRAFT

SENDING

SENT

RECEIVED

ACKNOWLEDGED

UPDATED

RESOLVED

FAILED

The UI must never falsely guarantee that help is coming.

For example:

Good:

HELP REQUEST RECEIVED

Bad:

AMBULANCE WILL ARRIVE IN 3 MINUTES

unless the simulator explicitly provides a fictional verified ETA for demonstration purposes.

---

# 23. I AM SAFE

The user should be able to report:

I AM SAFE

This sends a test event back to the simulator/backend.

The app then shows:

SAFE STATUS RECORDED

Continue following official instructions.

This should not automatically end the incident.

---

# 24. Offline/degraded connectivity

This is an important project requirement.

The app must cache:

- active incident summary
- last verified instruction
- last known safe zone
- current evacuation route
- last verified timestamp

When the network becomes unavailable:

show:

LIMITED CONNECTION

LAST VERIFIED UPDATE
14:47

Information may be outdated.

The user must still be able to view the last safe route.

Never silently present cached information as live.

---

# 25. Languages

Initial:

- English
- Norwegian

Architecture must support additional languages later.

Potential later languages:

- Spanish
- German
- Polish

Emergency vocabulary must remain short and consistent.

Do not build full translation infrastructure before English/Norwegian work reliably.

---

# 26. Accessibility

Required:

- large minimum touch targets
- VoiceOver-friendly labels
- Dynamic Type consideration
- strong color contrast
- color not used as the only state indicator
- simple language
- icons paired with labels
- reduced-motion support

Emergency UI must remain understandable under accessibility settings.

---

# 27. Test mode

The application must clearly support a development/test environment.

Example visual indicator outside critical user content:

TEST SCENARIO

or

TRAINING MODE

Do not make simulated alerts indistinguishable from a genuine future production system.

All TestFlight prototypes should clearly be demonstrators.

---

# 28. Platform Simulator requirements

The temporary simulator must be minimal.

It may be a small web interface.

V1 controls:

- select registered test device
- select scenario
- start incident
- issue alert
- set affected zone
- set safe zone
- update route
- acknowledge civilian help request
- send fictional responder update
- end incident

It must also display incoming app events:

- HELP REQUEST
- condition
- test location
- timestamp
- I AM SAFE

This simulator will eventually be replaced by the real professional platform.

---

# 29. Backend requirements

The simulator and TestFlight app require a small test backend/API.

Responsibilities:

- device registration
- Expo push token storage
- active test incidents
- outgoing simulated events
- help requests
- safe-status reports

Do not build a complex microservice architecture.

The backend is temporary testing infrastructure.

Keep the mobile/API contract clean enough that the future professional platform can replace the simulator.

---

# 30. Security boundary

This is a student prototype.

Do NOT connect to:

- real emergency dispatch
- police systems
- hospital systems
- maritime control systems
- governmental alert networks
- production rescue infrastructure

Never send a real public emergency notification.

Only registered prototype/test devices may receive test scenarios.

---

# 31. Demo goal

The target classroom/stakeholder demo should be:

Laptop:
Platform Simulator

↓

Press:

START FLÅM SCENARIO

↓

Physical iPhone receives:

EMERGENCY ALERT

↓

Open app:

YOU ARE INSIDE THE AFFECTED AREA

↓

Press:

GO TO SAFETY

↓

App displays:

Flåm School
650 m
8 min

↓

START SAFE ROUTE

↓

Evacuation guidance

OR:

I NEED HELP

↓

I AM INJURED

↓

SEND MY LOCATION

↓

Laptop simulator displays:

NEW HELP REQUEST

↓

Simulator acknowledges

↓

iPhone displays:

HELP REQUEST RECEIVED

This is the V1 end-to-end success condition.

---

# 32. V1 success criteria

V1 is successful when:

1. SOGN SAFE installs on a physical iPhone through TestFlight.
2. Test device can register for push notifications.
3. Platform Simulator can send a fictional emergency alert.
4. iPhone receives the alert.
5. Opening it shows the correct incident.
6. User can choose GO TO SAFETY.
7. User can see a fictional/predefined safe zone.
8. User can follow a simulated evacuation route.
9. User can press I NEED HELP.
10. User can submit condition + permitted location.
11. Simulator receives the help request.
12. Simulator can acknowledge it.
13. iPhone reflects the acknowledgement.
14. User can report I AM SAFE.
15. App retains last verified emergency instructions when connectivity is degraded.
16. All emergency data is clearly fictional/test data.
17. Production build and TestFlight build succeed.
