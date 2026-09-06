import { VoiceSessionState } from '../types/chat';

export const VOICE_STATES: Record<VoiceSessionState, string> = {
  IDLE: 'Ready. No microphone is open.',
  LISTENING: 'Push-to-talk is active. Capturing speech.',
  TRANSCRIBING: 'Speech captured. Converting to text.',
  THINKING: 'Transcript sent. Waiting for a validated answer.',
  SPEAKING: 'Assistant answer is being spoken.',
  ERROR: 'Voice step failed. Text chat remains available.',
  CANCELLED: 'User cancelled listening. Return to IDLE.',
  OFFLINE: 'Agent backend unreachable. Local cached answers only.',
};

export const MIC_START = 'Tap the microphone to start push-to-talk. Do not listen continuously.';
export const MIC_STOP = 'Tap again or auto-stop after silence to end capture.';
export const MIC_CANCEL = 'Cancel discards the in-progress recording and returns to IDLE.';
export const MIC_INTERRUPT = 'If TTS is speaking, start-mic stops speech first, then listens.';

export const VOICE_FLOW: VoiceSessionState[] = [
  'IDLE',
  'LISTENING',
  'TRANSCRIBING',
  'THINKING',
  'SPEAKING',
  'IDLE',
];
