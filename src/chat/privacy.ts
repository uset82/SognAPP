export const CHAT_PRIVACY_NOTES = {
  microphone: 'Push-to-talk only. The microphone is not left open.',
  appleSpeech: 'Apple Speech audio is not retained by SOGN SAFE after the transcript is produced.',
  whisper: 'Whisper recordings are uploaded only after an explicit fallback notice and discarded after processing.',
  location: 'Ordinary chat questions do not send coordinates. Location is sent only through the existing help confirmation screen.',
  logs: 'Backend logs must not include API secrets or raw coordinates.',
  leavesDevice: 'Typed/spoken text and verified incident context may leave the device when the simulator backend or OpenRouter is used.',
} as const;
