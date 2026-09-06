/**
 * SOGN SAFE assistant product boundary — Phase 1.
 * The assistant explains verified incident state. It is not a generic chatbot.
 */

export const SUPPORTED_CHAT_USES = [
  'Where should I go?',
  'Am I in danger?',
  'How far is the safe area?',
  'Which way should I walk?',
  'Is the waterfront closed?',
  'Repeat the last instruction',
  'What was the latest update?',
  'I cannot walk / I am injured / I need help',
  'I am safe now',
  'Was my help request received?',
] as const;

export const UNSUPPORTED_CHAT_USES = [
  'General conversation unrelated to the incident',
  'Medical diagnosis or treatment advice',
  'Real 112 / HRS / police dispatch',
  'Unverified news about the ship or casualties',
  'ETA promises for ambulances or rescue',
  'Autonomous location sharing',
  'Autonomous help-request submission',
] as const;

export const SHORT_RESPONSE_PHILOSOPHY =
  'One instruction at a time. Prefer a short civic sentence over explanation.';

export const EMERGENCY_TONE =
  'Calm, civic, and specific. No false reassurance. No unverified ETAs.';

export const FALLBACK_MESSAGES = {
  en: {
    noIncident: 'No active emergency is verified right now.',
    unknown: 'I do not have a verified update confirming that.',
    offline: 'VOICE ASSISTANT OFFLINE. Showing cached local guidance.',
    modelDown: 'The assistant is unavailable. Core guidance is still on screen.',
    notUnderstood: 'I could not understand that. Type the question, or view the current instruction.',
    micDenied: 'Microphone is unavailable. You can still type.',
    speechFailed: 'Speech recognition failed. Type instead, or retry.',
  },
  no: {
    noIncident: 'Ingen aktiv hendelse er verifisert nå.',
    unknown: 'Jeg har ingen verifisert oppdatering som bekrefter det.',
    offline: 'STEMMEASSISTENT FRAKOBLET. Viser lokal buffer.',
    modelDown: 'Assistenten er utilgjengelig. Kjerneveiledningen ligger fortsatt på skjermen.',
    notUnderstood: 'Jeg forsto ikke det. Skriv spørsmålet, eller vis gjeldende instruksjon.',
    micDenied: 'Mikrofon er utilgjengelig. Du kan fortsatt skrive.',
    speechFailed: 'Talegjenkjenning feilet. Skriv i stedet, eller prøv igjen.',
  },
} as const;

export const REQUIRES_HUMAN_CONFIRMATION = [
  'Sending location',
  'Submitting a help request',
  'Updating injury / condition',
  'Reporting I AM SAFE',
] as const;

export const AI_CANNOT_DISPATCH_RESPONDERS = true;
export const AI_CANNOT_TRANSMIT_LOCATION = true;
export const AI_CANNOT_CLAIM_UNVERIFIED_FACTS = true;
