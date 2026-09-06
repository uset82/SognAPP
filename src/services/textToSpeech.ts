import { Platform } from 'react-native';
import * as Speech from 'expo-speech';
import { Language } from '../constants/translations';
import { TtsState } from '../types/chat';
import { requestAgentSpeech } from './agentClient';

let state: TtsState = 'idle';
let browserUtterance: SpeechSynthesisUtterance | null = null;
let webPlayer: HTMLAudioElement | null = null;
let webPlayerUrl: string | null = null;

const SILENT_WAV =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';

const voiceLocale = (language: Language): string => (language === 'no' ? 'nb-NO' : 'en-US');

const isWeb = (): boolean => Platform.OS === 'web' && typeof window !== 'undefined';

const getBrowserSynth = (): SpeechSynthesis | null => {
  if (!isWeb() || !window.speechSynthesis) {
    return null;
  }
  return window.speechSynthesis;
};

const getWebPlayer = (): HTMLAudioElement | null => {
  if (!isWeb()) {
    return null;
  }
  if (!webPlayer) {
    webPlayer = new Audio();
    webPlayer.setAttribute('playsinline', 'true');
    (webPlayer as HTMLAudioElement & { playsInline?: boolean }).playsInline = true;
    webPlayer.preload = 'auto';
  }
  return webPlayer;
};

const startKeepAlive = (): void => {
  const player = getWebPlayer();
  if (!player) {
    return;
  }
  player.muted = false;
  player.volume = 0.02;
  player.loop = true;
  player.src = SILENT_WAV;
  void player.play().catch(() => undefined);
};

const stopWebPlayer = (keepAlive: boolean): void => {
  if (!webPlayer) {
    return;
  }
  try {
    webPlayer.pause();
    if (webPlayerUrl) {
      URL.revokeObjectURL(webPlayerUrl);
      webPlayerUrl = null;
    }
    if (keepAlive) {
      startKeepAlive();
      return;
    }
    webPlayer.loop = false;
    webPlayer.removeAttribute('src');
    webPlayer.load();
  } catch {
    // Already stopped.
  }
};

export const unlockSpeechPlayback = (): void => {
  if (!isWeb()) {
    return;
  }
  startKeepAlive();
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
  const synth = getBrowserSynth();
  if (synth) {
    const prime = new SpeechSynthesisUtterance(' ');
    prime.volume = 0.01;
    prime.rate = 2;
    try {
      synth.speak(prime);
    } catch {
      // Ignore.
    }
  }
};

export const speakImmediateCue = (language: Language): void => {
  if (!isWeb()) {
    return;
  }
  unlockSpeechPlayback();
  const synth = getBrowserSynth();
  if (!synth) {
    return;
  }
  const utter = new SpeechSynthesisUtterance(language === 'no' ? 'OK.' : 'OK.');
  utter.lang = voiceLocale(language);
  utter.rate = 1;
  const prefix = language === 'no' ? 'nb' : 'en';
  const voice = synth.getVoices().find((item) => item.lang.toLowerCase().startsWith(prefix));
  if (voice) {
    utter.voice = voice;
  }
  try {
    synth.speak(utter);
  } catch {
    // Ignore.
  }
};

export const getTtsState = (): TtsState => state;

export const hushOutput = (): void => {
  const synth = getBrowserSynth();
  if (synth) {
    try {
      synth.cancel();
    } catch {
      // Already stopped.
    }
    browserUtterance = null;
  }
  stopWebPlayer(true);
  if (Platform.OS !== 'web') {
    void Speech.stop().catch(() => undefined);
  }
  state = 'stopped';
};

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
  stopWebPlayer(false);
  if (Platform.OS !== 'web') {
    try {
      await Speech.stop();
    } catch {
      // Already stopped.
    }
  }
  state = 'stopped';
};

export const pauseSpeech = async (): Promise<void> => {
  if (webPlayer && !webPlayer.paused && !webPlayer.loop) {
    webPlayer.pause();
    state = 'paused';
    return;
  }
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
  if (webPlayer && webPlayer.paused && webPlayer.src) {
    try {
      await webPlayer.play();
      state = 'speaking';
    } catch {
      // Ignore.
    }
    return;
  }
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
  if (webPlayer && !webPlayer.paused && !webPlayer.ended && !webPlayer.loop) {
    return true;
  }
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

const waitForPlayer = (player: HTMLAudioElement): Promise<void> =>
  new Promise((resolve) => {
    const finish = () => {
      player.onended = null;
      player.onerror = null;
      resolve();
    };
    player.onended = finish;
    player.onerror = finish;
  });

const playRemoteSpeech = async (text: string, language: Language): Promise<boolean> => {
  const player = getWebPlayer();
  if (!player) {
    return false;
  }
  const remote = await requestAgentSpeech(text, language);
  if (!remote) {
    return false;
  }
  const binary = Uint8Array.from(atob(remote.audioBase64), (char) => char.charCodeAt(0));
  const blob = new Blob([binary], { type: remote.mimeType });
  if (webPlayerUrl) {
    URL.revokeObjectURL(webPlayerUrl);
  }
  webPlayerUrl = URL.createObjectURL(blob);
  player.loop = false;
  player.muted = false;
  player.volume = 1;
  player.src = webPlayerUrl;
  const ended = waitForPlayer(player);
  try {
    await player.play();
    await ended;
    return true;
  } catch {
    startKeepAlive();
    return false;
  }
};

const speakWithBrowserNow = (text: string, language: Language): Promise<void> => {
  const synth = getBrowserSynth();
  if (!synth) {
    return Promise.resolve();
  }
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = voiceLocale(language);
  utter.rate = 0.92;
  utter.pitch = 1;
  const prefix = language === 'no' ? 'nb' : 'en';
  const voice = synth.getVoices().find((item) => item.lang.toLowerCase().startsWith(prefix));
  if (voice) {
    utter.voice = voice;
  }
  const done = new Promise<void>((resolve) => {
    utter.onend = () => {
      browserUtterance = null;
      resolve();
    };
    utter.onerror = () => {
      browserUtterance = null;
      resolve();
    };
  });
  browserUtterance = utter;
  synth.speak(utter);
  if (synth.paused) {
    synth.resume();
  }
  return done;
};

export const speakText = async (
  text: string,
  language: Language,
  options: { fromUserGesture?: boolean } = {}
): Promise<void> => {
  const clean = text.trim();
  if (!clean) {
    return;
  }
  state = 'speaking';

  if (isWeb()) {
    if (options.fromUserGesture) {
      const browserDone = speakWithBrowserNow(clean, language);
      const remotePlayed = await playRemoteSpeech(clean, language);
      if (remotePlayed) {
        getBrowserSynth()?.cancel();
        state = 'idle';
        return;
      }
      await browserDone;
      state = 'idle';
      return;
    }

    const remotePlayed = await playRemoteSpeech(clean, language);
    if (remotePlayed) {
      state = 'idle';
      return;
    }
    await speakWithBrowserNow(clean, language);
    state = 'idle';
    return;
  }

  try {
    await Speech.stop();
  } catch {
    // Ignore.
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
