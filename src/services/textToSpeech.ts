import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { Language } from '../constants/translations';
import { TtsState } from '../types/chat';

let state: TtsState = 'idle';

const voiceLocale = (language: Language): string => (language === 'no' ? 'nb-NO' : 'en-US');

export const getTtsState = (): TtsState => state;

export const stopSpeech = async (): Promise<void> => {
  try {
    await Speech.stop();
  } catch {
    // Already stopped.
  }
  state = 'stopped';
};

export const pauseSpeech = async (): Promise<void> => {
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
  try {
    await Speech.resume();
    state = 'speaking';
  } catch {
    // Ignore.
  }
};

export const isSpeaking = async (): Promise<boolean> => {
  try {
    return await Speech.isSpeakingAsync();
  } catch {
    return state === 'speaking';
  }
};

export const speakText = async (text: string, language: Language): Promise<void> => {
  await stopSpeech();
  state = 'speaking';
  await new Promise<void>((resolve) => {
    Speech.speak(text, {
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
