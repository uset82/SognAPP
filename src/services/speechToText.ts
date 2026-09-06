import { Platform } from 'react-native';
import { Audio } from 'expo-av';
import { Language } from '../constants/translations';
import { SttProviderName } from '../types/chat';
import { transcribeAudioOnBackend } from './agentClient';

type RecognitionCtor = new () => {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: { results: ArrayLike<{ 0: { transcript: string; confidence?: number }; isFinal?: boolean }> }) => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

interface NativeSpeechModule {
  isRecognitionAvailable: () => boolean;
  requestPermissionsAsync: () => Promise<{ granted: boolean }>;
  start: (options: { lang: string; interimResults: boolean; continuous: boolean; addsPunctuation: boolean }) => void;
  stop: () => void;
  abort: () => void;
  addListener: (event: string, listener: (payload: never) => void) => { remove: () => void };
}

interface ActiveSession {
  provider: SttProviderName;
  recognition?: InstanceType<RecognitionCtor>;
  chunks: string[];
  finalText: string;
  confidence: number | null;
  resolveStop?: (text: string) => void;
  subscriptions?: Array<{ remove: () => void }>;
}

let session: ActiveSession | null = null;
let webRecorder: MediaRecorder | null = null;
let webChunks: Blob[] = [];
let nativeRecording: Audio.Recording | null = null;
let lastConfidence: number | null = null;

const localeFor = (language: Language): string => (language === 'no' ? 'nb-NO' : 'en-US');

const getNativeSpeech = (): NativeSpeechModule | null => {
  if (Platform.OS === 'web') {
    return null;
  }
  try {
    const loaded = require('expo-speech-recognition') as { ExpoSpeechRecognitionModule?: NativeSpeechModule };
    return loaded.ExpoSpeechRecognitionModule ?? null;
  } catch {
    return null;
  }
};

const getWebRecognition = (): RecognitionCtor | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const speechWindow = window as typeof window & {
    SpeechRecognition?: RecognitionCtor;
    webkitSpeechRecognition?: RecognitionCtor;
  };
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null;
};

export const getLastTranscriptConfidence = (): number | null => lastConfidence;

export const getPreferredSttProvider = async (): Promise<SttProviderName> => {
  const native = getNativeSpeech();
  if (native?.isRecognitionAvailable()) {
    return 'apple-speech';
  }
  if (getWebRecognition()) {
    return 'apple-speech';
  }
  return 'whisper';
};

const startNativeAppleSpeech = async (language: Language, native: NativeSpeechModule): Promise<SttProviderName> => {
  const permission = await native.requestPermissionsAsync();
  if (!permission.granted) {
    return 'none';
  }

  session = { provider: 'apple-speech', chunks: [], finalText: '', confidence: null, subscriptions: [] };
  session.subscriptions?.push(
    native.addListener('result', ((event: { results?: Array<{ transcript: string; confidence?: number }>; isFinal?: boolean }) => {
      const first = event.results?.[0];
      if (!first) {
        return;
      }
      session?.chunks.push(first.transcript);
      listenCallbacks.onPartial?.(first.transcript);
      if (typeof first.confidence === 'number') {
        session!.confidence = first.confidence;
        lastConfidence = first.confidence;
      }
      if (event.isFinal) {
        session!.finalText = first.transcript;
      }
    }) as (payload: never) => void)
  );
  session.subscriptions?.push(
    native.addListener('end', (() => {
      const text = session?.finalText || session?.chunks.at(-1) || '';
      session?.resolveStop?.(text);
      listenCallbacks.onEnded?.(text);
    }) as (payload: never) => void)
  );
  session.subscriptions?.push(
    native.addListener('error', (() => {
      session?.resolveStop?.('');
    }) as (payload: never) => void)
  );

  native.start({
    lang: localeFor(language),
    interimResults: true,
    continuous: false,
    addsPunctuation: true,
  });
  return 'apple-speech';
};

type ListenCallbacks = {
  onPartial?: (text: string) => void;
  onEnded?: (text: string) => void;
};

let listenCallbacks: ListenCallbacks = {};

export const startListening = async (
  language: Language,
  callbacks: ListenCallbacks = {}
): Promise<SttProviderName> => {
  lastConfidence = null;
  listenCallbacks = callbacks;
  const native = getNativeSpeech();
  if (native?.isRecognitionAvailable()) {
    return startNativeAppleSpeech(language, native);
  }

  const Recognition = getWebRecognition();
  if (Recognition) {
    const recognition = new Recognition();
    recognition.lang = localeFor(language);
    recognition.interimResults = true;
    recognition.continuous = false;
    session = { provider: 'apple-speech', recognition, chunks: [], finalText: '', confidence: null };
    recognition.onresult = (event) => {
      const last = event.results[event.results.length - 1];
      if (!last) {
        return;
      }
      const text = last[0].transcript;
      session?.chunks.push(text);
      listenCallbacks.onPartial?.(text);
      if (typeof last[0].confidence === 'number') {
        session!.confidence = last[0].confidence;
        lastConfidence = last[0].confidence;
      }
      if (last.isFinal) {
        session!.finalText = text;
      }
    };
    recognition.onerror = () => undefined;
    recognition.onend = () => {
      const text = session?.finalText || session?.chunks.at(-1) || '';
      session?.resolveStop?.(text);
      listenCallbacks.onEnded?.(text);
    };
    recognition.start();
    return 'apple-speech';
  }

  if (Platform.OS === 'web' && typeof navigator !== 'undefined' && navigator.mediaDevices) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    webChunks = [];
    webRecorder = new MediaRecorder(stream);
    webRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        webChunks.push(event.data);
      }
    };
    webRecorder.start();
    session = { provider: 'whisper', chunks: [], finalText: '', confidence: null };
    return 'whisper';
  }

  const permission = await Audio.requestPermissionsAsync();
  if (!permission.granted) {
    session = { provider: 'none', chunks: [], finalText: '', confidence: null };
    return 'none';
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });
  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
  await recording.startAsync();
  nativeRecording = recording;
  session = { provider: 'whisper', chunks: [], finalText: '', confidence: null };
  return 'whisper';
};

export const readPartialTranscript = (): string => session?.chunks.at(-1) || session?.finalText || '';

export const cancelListening = async (): Promise<void> => {
  listenCallbacks = {};
  session?.subscriptions?.forEach((sub) => sub.remove());
  if (session?.recognition) {
    session.recognition.abort();
  }
  const native = getNativeSpeech();
  try {
    native?.abort();
  } catch {
    // Not running.
  }
  if (webRecorder && webRecorder.state !== 'inactive') {
    webRecorder.stop();
    webRecorder.stream.getTracks().forEach((track) => track.stop());
  }
  if (nativeRecording) {
    try {
      await nativeRecording.stopAndUnloadAsync();
    } catch {
      // Already stopped.
    }
    nativeRecording = null;
  }
  webRecorder = null;
  webChunks = [];
  session = null;
};

export const stopListening = async (language: Language): Promise<{ text: string; provider: SttProviderName; confidence: number | null }> => {
  const current = session;
  if (!current) {
    return { text: '', provider: 'none', confidence: null };
  }

  if (current.recognition || current.provider === 'apple-speech') {
    const native = getNativeSpeech();
    const text = await new Promise<string>((resolve) => {
      current.resolveStop = resolve;
      current.recognition?.stop();
      try {
        native?.stop();
      } catch {
        // Already stopped.
      }
      setTimeout(() => resolve(current.finalText || current.chunks.at(-1) || ''), 1200);
    });
    lastConfidence = current.confidence;
    current.subscriptions?.forEach((sub) => sub.remove());
    session = null;
    return { text: text.trim(), provider: 'apple-speech', confidence: lastConfidence };
  }

  if (webRecorder) {
    const blob = await new Promise<Blob>((resolve) => {
      webRecorder!.onstop = () => resolve(new Blob(webChunks, { type: 'audio/webm' }));
      webRecorder!.stop();
      webRecorder!.stream.getTracks().forEach((track) => track.stop());
    });
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    const transcript = await transcribeAudioOnBackend(btoa(binary), 'audio/webm', language);
    webRecorder = null;
    webChunks = [];
    session = null;
    return { text: transcript?.trim() || '', provider: 'whisper', confidence: null };
  }

  if (nativeRecording) {
    await nativeRecording.stopAndUnloadAsync();
    const uri = nativeRecording.getURI();
    nativeRecording = null;
    session = null;
    if (!uri) {
      return { text: '', provider: 'whisper', confidence: null };
    }
    const response = await fetch(uri);
    const buffer = await response.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    const transcript = await transcribeAudioOnBackend(btoa(binary), 'audio/m4a', language);
    return { text: transcript?.trim() || '', provider: 'whisper', confidence: null };
  }

  session = null;
  return { text: '', provider: current.provider, confidence: current.confidence };
};
