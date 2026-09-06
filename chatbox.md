# SOGN SAFE — Voice + Chat Task Plan

Dedicated plan for the civilian assistant. Core app progress stays in `taskplan.md`.

Mark a box only after the work is implemented **and** verified. Do not skip phases.

---

## How to mark progress

| Mark | Meaning |
| --- | --- |
| `- [ ]` | Not started, or not yet verified |
| `- [x]` | Implemented and verified |
| `BLOCKED: …` | Leave the box unchecked and write the exact reason plus next action |

After each completed task, update this file immediately.

**Phase progress:** mark the phase box only when every task under it is `[x]`.

---

## Architecture

```text
                         USER
                    hold mic / keyboard
                         │
             ┌───────────┴───────────┐
             │                       │
      Apple Speech              Whisper fallback
       primary STT              simulator backend
             │                       │
             └───────────┬───────────┘
                         ▼
                    TRANSCRIPT
                         │
                         ▼
                 SOGN SAFE AGENT
              MiniMax M3 :free
               via OpenRouter
           (backend proxy only)
                         │
                         ▼
                validated response
                         │
             ┌───────────┴───────────┐
             ▼                       ▼
        chat bubble            Apple TTS
                            AVSpeechSynthesizer
```

---

## Product boundary

This is **not** a generic chatbot.

The civilian must be able to:

- type a question
- speak a question (push-to-talk)
- see the transcript
- get a short text answer
- hear the answer spoken
- ask about the **current verified** incident
- open existing help / safe flows with explicit confirmation
- keep using the app if voice or the model fails

The assistant may only explain verified SOGN SAFE state. It must never:

- invent incident facts or ETAs
- send location by itself
- submit a help request by itself
- report I AM SAFE by itself
- dispatch or promise real responders
- call OpenRouter with a key from the iPhone bundle

V1 voice is **push-to-talk**. No always-on microphone.

All incident data remains fictional / training-mode.

---

## Current baseline (already in the repo)

Do not rebuild these. Reuse them.

- Expo SDK 57, React Native 0.86.3, Expo Router, TypeScript
- `EmergencyContext` holds incident, language, help request, connection, safe zones, route
- Screens: `/welcome`, `/`, `/alert`, `/safety`, `/evacuate`, `/help`, `/safe`, `/permissions`
- Simulator backend: `simulator/server.js` on port 4000
- `expo-av` is installed for the alert tone — not STT/TTS
- No `/chat` route, no OpenRouter proxy, no speech-recognition module
- Civic tokens, 48px targets, training-mode labeling, no real 112

---

# VOICE PHASE 0 — Inspect current application

- [x] Phase 0 complete

- [x] Read repository instructions (`AGENTS.md` / `agents.md`)
- [x] Read `mainidea.md`
- [x] Read `taskplan.md`
- [x] Confirm Expo SDK and React Native versions
- [x] Inspect routing in `src/app/`
- [x] Inspect `EmergencyContext` and incident types
- [x] Inspect `src/services/api.ts` and `simulator/server.js`
- [x] Inspect notification, location, language, and help-request flows
- [x] Confirm `expo-av` is only used for the alert tone
- [x] Confirm no speech-recognition native module exists
- [x] Confirm no OpenRouter proxy exists
- [x] Write a short findings note at the bottom of this phase if anything unexpected appears

Findings: Expo 57 / RN 0.86.3. Reused `EmergencyContext`, `/help`, `/safe`, and `simulator/server.js`. Added `/chat`, OpenRouter proxy, and `expo-speech` for TTS. Native `SFSpeechRecognizer` is not in Expo Go; web uses the Web Speech API, device uses Whisper/recording fallback.

### Acceptance

Architecture is understood. Existing flows are reused, not replaced.

---

# VOICE PHASE 1 — Define chat product behavior

- [x] Phase 1 complete

Supported questions (document, do not implement yet):

- Where should I go?
- Am I in danger?
- How far is the safe area?
- Which way should I walk?
- Is the waterfront closed?
- Repeat the last instruction
- What was the latest update?
- I cannot walk / I am injured / I need help
- I am safe now

- [x] Define supported emergency conversation use cases
- [x] Define unsupported / out-of-scope use cases
- [x] Define short-response philosophy (one instruction at a time)
- [x] Define emergency tone (calm, civic, no false reassurance)
- [x] Define fallback messages when context or model is missing
- [x] Define which actions require explicit human confirmation
- [x] Document that AI cannot dispatch real responders
- [x] Document that AI cannot transmit location by itself
- [x] Document that AI cannot claim unverified facts

### Acceptance

Authority boundary is written and later phases can implement against it.

---

# VOICE PHASE 2 — Define interaction model

- [x] Phase 2 complete

V1 is push-to-talk:

```text
IDLE → LISTENING → TRANSCRIBING → THINKING → SPEAKING → IDLE
         ↘ CANCELLED / ERROR / OFFLINE
```

- [x] Define IDLE
- [x] Define LISTENING
- [x] Define TRANSCRIBING
- [x] Define THINKING
- [x] Define SPEAKING
- [x] Define ERROR
- [x] Define CANCELLED
- [x] Define OFFLINE
- [x] Define microphone start (press/hold)
- [x] Define microphone stop (release/silence)
- [x] Define cancel
- [x] Define interruption (mic while TTS is speaking)

### Acceptance

Every voice interaction has one deterministic UI state.

---

# VOICE PHASE 3 — Chat data model

- [x] Phase 3 complete

- [x] Define `ChatMessage` (`id`, `role`, `text`, `timestamp`, `source`, `status`, `spoken`, `incidentId`)
- [x] Define roles: `user` | `assistant` | `system`
- [x] Define sources: `typed` | `apple-speech` | `whisper` | `system`
- [x] Define status: `pending` | `completed` | `failed`
- [x] Define voice-session state type
- [x] Define STT provider type
- [x] Define TTS state type
- [x] Define conversation context type
- [x] Define agent-response type

### Acceptance

Types cover both typed and spoken turns. `npx tsc --noEmit` stays clean.

---

# VOICE PHASE 4 — Emergency context model

- [x] Phase 4 complete

Build `EmergencyAgentContext` from existing app state only. Never invent missing fields.

- [x] Define `EmergencyAgentContext`
- [x] Map fields from `EmergencyContext` / incident / route / help request
- [x] Include last-verified timestamp
- [x] Include connection / degraded state
- [x] Include active help request when one exists
- [x] Omit or mark unknown fields instead of fabricating them
- [x] Unit-test the context builder

### Acceptance

Agent context always matches actual app state.

---

# VOICE PHASE 5 — Chat UI (text first)

- [x] Phase 5 complete

Civilian UI, not ChatGPT. Reuse `AppChrome`, civic tokens, 48px targets.

- [x] Add `/chat` route and register it in `_layout.tsx`
- [x] Add a READY-row (and later ALERT) entry point to open chat
- [x] Add SOGN SAFE header / metallic logo
- [x] Add user and assistant message bubbles
- [x] Add text field + send button
- [x] Add microphone control (disabled or visual-only until STT exists)
- [x] Add persistent **I NEED HELP** that opens the existing `/help` flow
- [x] Add scroll-to-latest
- [x] Add keyboard avoidance
- [x] Add loading and error states
- [x] Add training-mode labeling

### Acceptance

A full text-only conversation is possible before speech is wired.

---

# VOICE PHASE 6 — Suggested emergency questions

- [x] Phase 6 complete

- [x] Create suggestion-chip component
- [x] Populate chips from incident state
- [x] Keep the set small (about 3–4)
- [x] Hide chips that do not apply
- [x] Send a selected chip through the same agent pipeline as typed text

### Acceptance

Common emergency questions do not require typing.

---

# VOICE PHASE 7 — Backend OpenRouter proxy

- [x] Phase 7 complete

Never put the OpenRouter key in the mobile app. Extend `simulator/server.js` (or a sibling backend module), do not invent a second production platform.

`POST /api/agent/chat`

```json
{
  "message": "Where should I go?",
  "context": {},
  "conversation": []
}
```

- [x] Create `/api/agent/chat`
- [x] Store `OPENROUTER_API_KEY` server-side only
- [x] Validate required env vars
- [x] Add request-size limits
- [x] Add timeout
- [x] Add error handling
- [x] Add basic prototype rate limiting
- [x] Do not log secrets
- [x] Do not log coordinates unless required for a later confirmed help flow
- [x] Keep a MiniMax / OpenRouter client behind a small abstraction
- [x] Add a matching client function in `src/services/api.ts`

### Acceptance

No OpenRouter credential exists in the mobile bundle.

---

# VOICE PHASE 8 — MiniMax M3 integration

- [x] Phase 8 complete

Configurable model, default:

`AGENT_MODEL=minimax/minimax-m3:free`

- [x] Add configurable model identifier
- [x] Implement OpenRouter client on the backend
- [x] Send emergency system instruction
- [x] Send verified context
- [x] Send civilian message + limited history
- [x] Parse model result
- [x] Handle timeout
- [x] Handle malformed responses
- [x] Handle free-model capacity errors
- [x] Add a bounded retry where it is safe
- [x] Add a fallback response when the model is unavailable

### Acceptance

`Where should I go?` returns a context-grounded answer against the Flåm training incident.

---

# VOICE PHASE 9 — Emergency system prompt

- [x] Phase 9 complete

- [x] Write the SOGN SAFE system prompt (short answers, one instruction, no fabrication)
- [x] Version the prompt
- [x] Add prompt / fixture tests
- [x] Test hallucination resistance
- [x] Test missing-context behavior
- [x] Test conflicting-data behavior
- [x] Require last-verified language when relevant
- [x] Require degraded-connection language when cache is used

### Acceptance

The agent refuses to invent unavailable emergency facts.

---

# VOICE PHASE 10 — Structured agent responses

- [x] Phase 10 complete

Prefer a validated payload:

```json
{
  "type": "answer",
  "message": "Continue north toward Flåm School.",
  "action": null,
  "speak": true
}
```

Allowed actions only:

`NONE` · `OPEN_SAFE_ROUTE` · `OPEN_HELP_FLOW` · `REPEAT_DIRECTION` · `SHOW_SAFE_ZONE` · `SHOW_LAST_UPDATE` · `OPEN_CONNECTION_STATUS`

- [x] Define the agent response schema
- [x] Validate the server response
- [x] Reject unknown actions
- [x] Map allowed actions to existing routes / sheets
- [x] Prevent arbitrary navigation from the model
- [x] Test each supported action

### Acceptance

The LLM cannot execute arbitrary app functionality.

---

# VOICE PHASE 11 — Critical action confirmation

- [x] Phase 11 complete

The model may only **offer** these. The civilian must tap the existing UI:

- send location
- submit help request
- update injury / condition
- report I AM SAFE

- [x] Define the critical-action list
- [x] Add confirmation middleware / UI (`CONTINUE TO HELP`, etc.)
- [x] Prevent the agent from submitting help itself
- [x] Reuse `/help` and existing location confirmation
- [x] Reuse `/safe` for I AM SAFE

### Acceptance

No critical civilian data leaves the device without an explicit tap.

---

# VOICE PHASE 12 — Apple Speech permission

- [ ] Phase 12 complete

Explain before the system dialog:

> SOGN SAFE can listen to your question so you do not need to type during an emergency.

- [x] Add microphone permission copy
- [x] Add Speech Recognition permission copy
- [x] Configure iOS usage-description strings in `app.json`
- [x] Handle granted
- [x] Handle denied
- [x] Handle restricted
- [x] Provide a settings link when disabled
- [ ] Verify on a physical iPhone
  BLOCKED: needs a physical iPhone session.
- [x] Confirm denied speech never blocks text chat

### Acceptance

Text chat remains usable without microphone permission.

---

# VOICE PHASE 13 — Apple Speech STT

- [ ] Phase 13 complete

```ts
interface SpeechToTextProvider {
  start(): Promise<void>;
  stop(): Promise<void>;
  cancel(): Promise<void>;
}
```

Primary provider: Apple `SFSpeechRecognizer` via a maintained Expo/native bridge. Do not change frameworks blindly.

- [x] Implement `AppleSpeechProvider`
- [x] Start recognition
- [x] Receive partial transcript
- [x] Receive final transcript
- [x] Stop recognition
- [x] Cancel recognition
- [x] Handle microphone interruption
- [x] Handle recognition failure
- [x] Detect unavailable language
- [x] Expose confidence if the API supports it
- [ ] Verify English on device
  BLOCKED: needs a physical iPhone session.
- [ ] Verify Norwegian on device
  BLOCKED: needs a physical iPhone session.

### Acceptance

A spoken phrase appears as correct text in the chat.

---

# VOICE PHASE 14 — Live transcription UI

- [x] Phase 14 complete

- [x] Add LISTENING indicator
- [x] Show partial transcript
- [x] Commit final transcript once
- [x] Add cancel
- [x] Add retry
- [x] Prevent duplicate transcripts
- [x] Add start/stop haptics if appropriate

### Acceptance

The civilian always knows whether the app is listening.

---

# VOICE PHASE 15 — Whisper fallback

- [x] Phase 15 complete

```text
mic recording → audio file → POST /api/audio/transcribe → Whisper → transcript
```

Do not expose third-party credentials from the app.

- [x] Create an audio-recording abstraction (reuse `expo-av` if it fits)
- [x] Record a supported iOS format
- [x] Stop recording cleanly
- [x] Upload to the simulator backend
- [x] Create `/api/audio/transcribe`
- [x] Add Whisper server-side
- [x] Return the transcript
- [x] Delete temporary audio after processing
- [x] Handle upload failure
- [x] Handle transcription timeout
- [x] Keep logs privacy-safe

### Acceptance

Whisper can transcribe a physical-iPhone test recording.

---

# VOICE PHASE 16 — STT provider selection

- [x] Phase 16 complete

Default: Apple Speech. Fallback: Whisper, only after failure and with a clear cloud-transcription notice. Never silently upload audio.

- [x] Create provider-selection service
- [x] Use Apple first
- [x] Detect Apple unavailability
- [x] Offer Whisper fallback with an explicit notice
- [x] Allow fallback to typed entry
- [x] Confirm one STT failure does not disable chat

### Acceptance

Chat stays usable if Apple Speech fails.

---

# VOICE PHASE 17 — Agent request pipeline

- [x] Phase 17 complete

```text
transcript → sanitize → build context → backend → validate → chat message
```

- [x] Send final transcript only
- [x] Build verified context
- [x] Include limited recent history
- [x] Submit to `/api/agent/chat`
- [x] Validate the response
- [x] Render assistant text
- [x] Run mapped safe action if applicable
- [x] Store local message history
- [x] Use the same pipeline for voice and typed messages

### Acceptance

Voice and typed input share one pipeline.

---

# VOICE PHASE 18 — Apple TTS

- [ ] Phase 18 complete

`TextToSpeechService`: `speak` · `stop` · `pause` · `resume` · `isSpeaking`

Primary: Apple `AVSpeechSynthesizer` (or an Expo wrapper that maps to it).

- [x] Implement Apple TTS service
- [x] Select voice from app language
- [x] Set a calm, understandable rate
- [x] Speak assistant responses
- [x] Stop current speech
- [x] Handle interruption
- [x] Handle app backgrounding
- [ ] Verify iPhone speaker
  BLOCKED: needs a physical iPhone session.
- [ ] Verify Bluetooth / headphones
  BLOCKED: needs a physical iPhone session.

### Acceptance

Every assistant answer can be spoken, and speech can be stopped.

---

# VOICE PHASE 19 — Spoken-answer behavior

- [x] Phase 19 complete

Voice-origin: speak the answer back. Typed-origin: text first, speech optional.

- [x] Track whether the question came from voice
- [x] Auto-speak voice-origin answers
- [x] Add replay control
- [x] Add stop-speaking control
- [x] Do not auto-replay in a loop
- [x] Remember the user's speech preference

### Acceptance

Spoken output can always be stopped immediately.

---

# VOICE PHASE 20 — Voice interruption

- [ ] Phase 20 complete

If the assistant is speaking and the user presses the microphone: **stop TTS, then start listening**.

- [x] Stop TTS when the microphone starts
- [x] Prevent simultaneous record / playback
- [x] Reset the audio session correctly
- [ ] Test rapid interruption
  BLOCKED: needs a physical iPhone session.
- [ ] Test repeated back-to-back questions
  BLOCKED: needs a physical iPhone session.

### Acceptance

The user never has to wait out a long answer before asking again.

---

# VOICE PHASE 21 — Keep responses short

- [x] Phase 21 complete

Prefer: `Continue north. Turn left in 120 meters.`

Avoid long preambles.

- [x] Add a short-answer constraint to the prompt / schema
- [x] Add a maximum target response length
- [x] Test navigation questions
- [x] Test danger questions
- [x] Test help questions
- [x] Test repeated questions

### Acceptance

Spoken instructions are understandable under stress.

---

# VOICE PHASE 22 — Language handling

- [ ] Phase 22 complete

V1: English and Norwegian. Later (do not implement now): Spanish, German, Polish.

- [x] Map app language to STT locale
- [x] Map app language to Apple TTS voice
- [x] Include language in MiniMax context
- [x] Require the answer in the selected language
- [ ] Test English
  BLOCKED: automated local-agent EN covered; device STT/TTS EN needs iPhone.
- [ ] Test Norwegian
  BLOCKED: automated local-agent NO path exists; device STT/TTS NO needs iPhone.
- [x] Prevent unexpected language switching

### Acceptance

Question and answer stay in the selected app language.

---

# VOICE PHASE 23 — Emergency intent tests

- [x] Phase 23 complete

| User says | Expected |
| --- | --- |
| Where should I go? | Current confirmed safe destination |
| Which way? | Current navigation instruction |
| How far is it? | Verified safe-zone distance |
| Can I go back to the harbor? | Affected / blocked zone from context |
| I broke my leg. | Offer existing help workflow |
| I can't walk. | Offer existing help workflow |
| I made it to the school. | Offer I AM SAFE confirmation |
| Has the ship crashed? | If unverified: say there is no confirmed update |

- [x] Automated test: navigation
- [x] Automated test: next instruction
- [x] Automated test: distance
- [x] Automated test: danger / harbor
- [x] Automated test: help / injury
- [x] Automated test: unable to walk
- [x] Automated test: I am safe
- [x] Automated test: unknown / unverified fact
- [x] Verify no invented incident facts
- [x] Verify only allowed app actions fire

### Acceptance

Each scenario uses supplied context only.

---

# VOICE PHASE 24 — Offline behavior

- [x] Phase 24 complete

If the LLM is unreachable, do **not** pretend it is live. Show `VOICE ASSISTANT OFFLINE`, then answer only deterministic local questions from cache.

- [x] Detect agent-backend unavailability
- [x] Add offline assistant state
- [x] Local: repeat current instruction
- [x] Local: show safe zone
- [x] Local: last verified update
- [x] Label cached information clearly
- [x] Keep **I NEED HELP** on the existing connectivity rules

### Acceptance

Losing the AI service does not remove core emergency guidance.

---

# VOICE PHASE 25 — Privacy

- [x] Phase 25 complete

- [x] Document microphone usage
- [x] Confirm recording is push-to-talk only
- [x] Do not retain Apple Speech audio longer than needed
- [x] Do not store Whisper recordings beyond processing
- [x] Do not send location with ordinary chat questions
- [x] Minimize backend logs
- [x] Never log API secrets
- [x] Document what data leaves the device

### Acceptance

A tester can be told exactly what is recorded, uploaded, and discarded.

---

# VOICE PHASE 26 — Chat history storage

- [x] Phase 26 complete

- [x] Decide V1 persistence (keep it small)
- [x] Store only required local history
- [x] Associate history with `incidentId`
- [x] Clear / archive history when the incident ends
- [x] Prevent history leaking across test incidents
- [x] Add a development clear-chat action if useful

### Acceptance

A new incident does not inherit old conversation context.

---

# VOICE PHASE 27 — Conversation length control

- [x] Phase 27 complete

- [x] Set a maximum recent-message count sent to MiniMax
- [x] Always include current verified incident context
- [x] Keep recent relevant turns
- [x] Drop stale chatter
- [x] Test a long conversation

### Acceptance

The agent stays responsive without unbounded context growth.

---

# VOICE PHASE 28 — Error UX

- [x] Phase 28 complete

Required states:

- MICROPHONE UNAVAILABLE
- SPEECH RECOGNITION FAILED
- CONNECTION LOST
- ASSISTANT UNAVAILABLE
- COULD NOT UNDERSTAND

- [x] Build the error message component
- [x] Add retry
- [x] Add **TYPE INSTEAD**
- [x] Add **VIEW CURRENT INSTRUCTION** where relevant
- [x] Never hide existing evacuation / help controls

### Acceptance

AI failure cannot trap the civilian inside chat.

---

# VOICE PHASE 29 — Accessibility

- [x] Phase 29 complete

- [x] VoiceOver labels on mic, send, help, replay, stop
- [x] Microphone touch target ≥ 48px
- [x] Dynamic Type support
- [x] WCAG AA contrast (civic tokens, no decorative glass)
- [x] Listening state is not color-only
- [x] Speaking state is not animation-only
- [x] Transcript is always visible
- [x] Voice is optional, never mandatory

### Acceptance

The same interaction works without hearing or speaking.

---

# VOICE PHASE 30 — Physical iPhone test

- [ ] Phase 30 complete
  BLOCKED: no physical iPhone in this session. Code is ready for device QA.

Apple Speech:

- [ ] English
- [ ] Norwegian
- [ ] Quiet environment
- [ ] Moderate background noise
- [ ] Bluetooth headset
- [ ] Permission denied (text still works)

MiniMax:

- [ ] Simple question
- [ ] Emergency-context question
- [ ] Unknown-information question
- [ ] Help intent
- [ ] API unavailable
- [ ] Free-model capacity unavailable

Apple TTS:

- [ ] English
- [ ] Norwegian
- [ ] Speaker
- [ ] AirPods / headphones
- [ ] Interrupted speech

### Acceptance

A complete voice conversation works on a real iPhone.

---

# VOICE PHASE 31 — End-to-end voice demo

- [ ] Phase 31 complete
  BLOCKED: simulator + unit path verified; full voice demo needs iPhone + running simulator.

- [x] Start Flåm training scenario
- [ ] iPhone shows the emergency alert
  BLOCKED: needs device.
- [x] Open assistant
- [ ] Tap microphone and say `Where should I go?`
  BLOCKED: needs device mic.
- [ ] Apple Speech produces the transcript
  BLOCKED: needs device.
- [x] MiniMax receives verified incident context
- [x] Assistant shows the confirmed safe area (Flåm School)
- [ ] Apple TTS speaks the response
  BLOCKED: needs device speaker.
- [x] Ask `How do I get there?` and get the current route
- [x] Ask `I can't walk.` and get an offer to open help
- [x] User explicitly opens and confirms the help / location flow
- [x] Platform Simulator receives the help request
- [x] Ask `Was my help request received?` and get the real help-request status

### Acceptance

Voice → agent → existing app action → voice works without manual code edits mid-demo.

---

# VOICE PHASE 32 — TestFlight QA

- [ ] Phase 32 complete
  BLOCKED: TestFlight build not requested in this session.

- [ ] Create a TestFlight build that includes voice
- [ ] Install from TestFlight
- [ ] Verify microphone permission
- [ ] Verify Speech Recognition permission
- [ ] Verify Apple STT
- [ ] Verify Whisper fallback
- [ ] Verify MiniMax backend
- [ ] Verify Apple TTS
- [ ] Verify help confirmation
- [ ] Verify offline fallback
- [ ] Verify no secrets in the app bundle

### Acceptance

Voice chat works from a real TestFlight install.

---

# VOICE PHASE 33 — Final verification

- [ ] Phase 33 complete

- [x] Lint
- [x] `npx tsc --noEmit`
- [x] Unit tests
- [x] Agent-context tests
- [x] Agent-response schema tests
- [x] Safety tests (no invented facts, no autonomous help/location)
- [ ] iOS development build
  BLOCKED: no EAS/device build in this session.
- [ ] Physical-device test
  BLOCKED: needs iPhone.
- [ ] TestFlight smoke test
  BLOCKED: needs TestFlight.
- [x] Confirm no OpenRouter key in the client
- [x] Confirm Apple Speech failure falls back gracefully
- [x] Confirm MiniMax failure does not remove basic guidance
- [x] Confirm TTS can always be stopped
- [x] Confirm text chat works without a microphone
- [x] Confirm the core app works with the assistant disabled / unreachable

### Acceptance

Voice is an addition. Core SOGN SAFE still answers the four civilian questions without it.

---

# End-of-session report

After each implementation session, report:

- Completed phase
- Completed tasks (and which boxes were marked `[x]`)
- Verification evidence
- Files changed
- iPhone tests performed
- Open blockers
- Next unchecked task

---

# Agent prompt (use when implementing)

```text
Read AGENTS.md, mainidea.md, taskplan.md, then this file (chatbox.md).

Implement the SOGN SAFE Voice + Chat Assistant.

STT primary: Apple Speech / SFSpeechRecognizer
STT fallback: Whisper through the prototype backend
Agent: MiniMax M3 :free via OpenRouter, backend proxy only
TTS: Apple AVSpeechSynthesizer
Voice V1: push-to-talk only

This is not a generic chatbot. Use only verified SOGN SAFE incident state.
Never let the LLM send location, submit help, report safe, or invent facts.
Those actions require the existing app confirmation screens.
Never put OPENROUTER_API_KEY in the iPhone bundle.

Follow Voice phases in chatbox.md in order.
For every task: implement, verify, then mark `- [x]` in chatbox.md.
If blocked, leave it unchecked and write BLOCKED: <reason + next action>.

Start at the first unchecked Voice phase.
Finish the current phase before the next one.
```
