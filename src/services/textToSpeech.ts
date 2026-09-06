import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { Language } from '../constants/translations';
import { TtsState } from '../types/chat';

let state: TtsState = 'idle';
let browserUtterance: SpeechSynthesisUtterance | null = null;

const voiceLocale = (language: Language): string => (language === 'no' ? 'nb-NO' : 'en-US');

const getBrowserSynth = (): SpeechSynthesis | null => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return null;
  }
  return window.speechSynthesis;
};

export const unlockSpeechPlayback = (): void => {
  if (typeof window !== 'undefined') {
    const AudioContextCtor =
      window.AudioContext ||
      (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextCtor) {
      try {
        const ctx = new AudioContextCtor();
        void ctx.resume();
      } catch {
        // Ignore.
      }
    }
  }
  const synth = getBrowserSynth();
  if (!synth) {
    return;
  }
  try {
    synth.cancel();
    const unlock = new SpeechSynthesisUtterance('.');
    unlock.volume = 0;
    unlock.rate = 10;
    synth.speak(unlock);
    synth.cancel();
  } catch {
    // iOS may reject until a later tap.
  }
};

export const getTtsState = (): TtsState => state;

export const stopSpeech = async (): Promise<void> => {
  const synth = getBrowserSynth();
  if (synth) {
    try {
      synth.cancel();
    } catch {
      // Already stopped.
    }
    browserUtterance = null;
  }
  try {
    await Speech.stop();
  } catch {
    // Already stopped.
  }
  state = 'stopped';
};

export const pauseSpeech = async (): Promise<void> => {
  const synth = getBrowserSynth();
  if (synth) {
    synth.pause();
    state = 'paused';
    return;
  }
  if (Platform.OS === 'web') {
    await stopSpeech();
    return;
  }
  try {
    await Speech.pause();
    state = 'paused';
  } catch {
    await stopSpeech();
  }
};

export const resumeSpeech = async (): Promise<void> => {
  const synth = getBrowserSynth();
  if (synth) {
    synth.resume();
    state = 'speaking';
    return;
  }
  try {
    await Speech.resume();
    state = 'speaking';
  } catch {
    // Ignore.
  }
};

export const isSpeaking = async (): Promise<boolean> => {
  const synth = getBrowserSynth();
  if (synth) {
    return synth.speaking;
  }
  try {
    return await Speech.isSpeakingAsync();
  } catch {
    return state === 'speaking';
  }
};

const speakWithBrowser = (text: string, language: Language): Promise<void> =>
  new Promise((resolve) => {
    const synth = getBrowserSynth();
    if (!synth) {
      resolve();
      return;
    }
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = voiceLocale(language);
    utter.rate = 0.92;
    utter.pitch = 1;
    utter.onend = () => {
      browserUtterance = null;
      resolve();
    };
    utter.onerror = () => {
      browserUtterance = null;
      resolve();
    };
    browserUtterance = utter;
    synth.speak(utter);
    if (synth.paused) {
      synth.resume();
    }
    // iOS Safari can drop the first speak after an async gap.
    setTimeout(() => {
      if (browserUtterance === utter && !synth.speaking && !synth.pending) {
        synth.speak(utter);
      }
    }, 250);
  });

export const speakText = async (text: string, language: Language): Promise<void> => {
  const clean = text.trim();
  if (!clean) {
    return;
  }
  await stopSpeech();
  state = 'speaking';
  if (getBrowserSynth()) {
    await speakWithBrowser(clean, language);
    state = 'idle';
    return;
  }
  await new Promise<void>((resolve) => {
    Speech.speak(clean, {
      language: voiceLocale(language),
      rate: 0.92,
      pitch: 1,
      onDone: () => {
        state = 'idle';
        resolve();
      },
      onStopped: () => {
        state = 'stopped';
        resolve();
      },
      onError: () => {
        state = 'idle';
        resolve();
      },
    });
  });
};
