import { Language } from './translations';

export interface ChatCopy {
  assistantTitle: string;
  assistantSubtitle: string;
  homeIntro: string;
  openFullAssistant: string;
  activeIncident: string;
  inputPlaceholder: string;
  send: string;
  microphone: string;
  speakAction: string;
  stopListening: string;
  speakHint: string;
  listening: string;
  transcribing: string;
  thinking: string;
  speaking: string;
  offline: string;
  typeInstead: string;
  retry: string;
  viewInstruction: string;
  continueToHelp: string;
  continueToSafe: string;
  cloudSttNotice: string;
  replay: string;
  stopSpeech: string;
  chipWhere: string;
  chipRepeat: string;
  chipChanged: string;
  chipHelp: string;
  micExplain: string;
  speechExplain: string;
  micUnavailable: string;
  speechFailed: string;
  connectionLost: string;
  assistantUnavailable: string;
  notUnderstood: string;
  trainingNote: string;
  openSettings: string;
  clearChat: string;
}

export const chatCopy: Record<Language, ChatCopy> = {
  en: {
    assistantTitle: 'Assistant',
    assistantSubtitle: 'Verified guidance only',
    homeIntro: 'Ask a short question about the current verified situation.',
    openFullAssistant: 'Open full assistant',
    activeIncident: 'ACTIVE INCIDENT',
    inputPlaceholder: 'Ask a short question',
    send: 'Send',
    microphone: 'Tap to speak your question',
    speakAction: 'SPEAK',
    stopListening: 'Stop listening',
    speakHint: 'Ringer on. Tap HEAR ANSWER after the reply.',
    listening: 'LISTENING',
    transcribing: 'TRANSCRIBING',
    thinking: 'THINKING',
    speaking: 'SPEAKING',
    offline: 'VOICE ASSISTANT OFFLINE',
    typeInstead: 'TYPE INSTEAD',
    retry: 'RETRY',
    viewInstruction: 'VIEW CURRENT INSTRUCTION',
    continueToHelp: 'CONTINUE TO HELP',
    continueToSafe: 'CONTINUE TO I AM SAFE',
    cloudSttNotice: 'Cloud transcription is used for this recording.',
    replay: 'HEAR ANSWER',
    stopSpeech: 'Stop speaking',
    chipWhere: 'WHERE SHOULD I GO?',
    chipRepeat: 'REPEAT INSTRUCTION',
    chipChanged: 'WHAT CHANGED?',
    chipHelp: 'I NEED HELP',
    micExplain: 'SOGN SAFE can listen to your question so you do not need to type during an emergency.',
    speechExplain: 'Speech recognition turns your question into text on this device when Apple Speech is available.',
    micUnavailable: 'MICROPHONE UNAVAILABLE',
    speechFailed: 'SPEECH RECOGNITION FAILED',
    connectionLost: 'CONNECTION LOST',
    assistantUnavailable: 'ASSISTANT UNAVAILABLE',
    notUnderstood: 'COULD NOT UNDERSTAND',
    trainingNote: 'Training assistant. Not a real 112 dispatcher.',
    openSettings: 'Open iOS Settings',
    clearChat: 'Clear chat',
  },
  no: {
    assistantTitle: 'Assistent',
    assistantSubtitle: 'Bare verifisert veiledning',
    homeIntro: 'Still et kort spørsmål om den verifiserte situasjonen.',
    openFullAssistant: 'Åpne full assistent',
    activeIncident: 'AKTIV HENDELSE',
    inputPlaceholder: 'Still et kort spørsmål',
    send: 'Send',
    microphone: 'Trykk for å snakke spørsmålet',
    speakAction: 'TALE',
    stopListening: 'Stopp lytting',
    speakHint: 'Slå på ringelyden. Trykk HØR SVARET etter svaret.',
    listening: 'LYTTER',
    transcribing: 'SKRIVER UT',
    thinking: 'TENKER',
    speaking: 'SNAKKER',
    offline: 'STEMMEASSISTENT FRAKOBLET',
    typeInstead: 'SKRIV I STEDET',
    retry: 'PRØV IGJEN',
    viewInstruction: 'VIS GJELDENDE INSTRUKSJON',
    continueToHelp: 'FORTSETT TIL HJELP',
    continueToSafe: 'FORTSETT TIL JEG ER TRYGG',
    cloudSttNotice: 'Skytjeneste brukes til denne transkripsjonen.',
    replay: 'HØR SVARET',
    stopSpeech: 'Stopp tale',
    chipWhere: 'HVOR SKAL JEG GÅ?',
    chipRepeat: 'GJENTA INSTRUKSJON',
    chipChanged: 'HVA HAR ENDRET SEG?',
    chipHelp: 'JEG TRENGER HJELP',
    micExplain: 'SOGN SAFE kan lytte til spørsmålet ditt slik at du slipper å skrive i en nødssituasjon.',
    speechExplain: 'Talegjenkjenning gjør spørsmålet om til tekst på enheten når Apple Speech er tilgjengelig.',
    micUnavailable: 'MIKROFON UTILGJENGELIG',
    speechFailed: 'TALEGJENKJENNING FEILET',
    connectionLost: 'MISTET FORBINDELSE',
    assistantUnavailable: 'ASSISTENT UTILGJENGELIG',
    notUnderstood: 'FORSTO IKKE',
    trainingNote: 'Øvingsassistent. Ikke en ekte 112-sentral.',
    openSettings: 'Åpne iOS-innstillinger',
    clearChat: 'Tøm chat',
  },
};
