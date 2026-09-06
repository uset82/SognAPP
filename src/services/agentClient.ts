import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { AgentResponse, ConversationTurn, EmergencyAgentContext } from '../types/chat';
import { ALLOWED_AGENT_ACTIONS } from '../types/chat';

const getSimulatorServerUrl = (): string => {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:4000';
    }
    return window.location.origin;
  }
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return `http://${hostUri.split(':')[0]}:4000`;
  }
  return 'http://localhost:4000';
};

export const validateAgentResponse = (payload: unknown): AgentResponse | null => {
  if (!payload || typeof payload !== 'object') {
    return null;
  }
  const data = payload as Partial<AgentResponse>;
  const types = ['answer', 'offer_help', 'offer_safe', 'offline', 'error'];
  if (!data.type || !types.includes(data.type)) {
    return null;
  }
  if (typeof data.message !== 'string' || data.message.trim().length === 0) {
    return null;
  }
  let action = data.action ?? null;
  if (action === 'NONE') {
    action = null;
  }
  if (action && !ALLOWED_AGENT_ACTIONS.includes(action)) {
    action = null;
  }
  return {
    type: data.type,
    message: data.message.trim().slice(0, 220),
    action,
    speak: data.speak !== false,
    cached: Boolean(data.cached),
  };
};

export const requestAgentChat = async (
  message: string,
  context: EmergencyAgentContext,
  conversation: ConversationTurn[]
): Promise<AgentResponse | null> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(`${getSimulatorServerUrl()}/api/agent/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: message.slice(0, 500),
        context,
        conversation: conversation.slice(-6),
      }),
      signal: controller.signal,
    });
    if (!response.ok) {
      return null;
    }
    return validateAgentResponse(await response.json());
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

export const requestAgentSpeech = async (
  text: string,
  language: 'en' | 'no'
): Promise<{ audioBase64: string; mimeType: string } | null> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch(`${getSimulatorServerUrl()}/api/audio/speech`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: text.slice(0, 400), language }),
      signal: controller.signal,
    });
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as { audioBase64?: string; mimeType?: string };
    if (!data.audioBase64) {
      return null;
    }
    return {
      audioBase64: data.audioBase64,
      mimeType: data.mimeType || 'audio/mpeg',
    };
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};

export const transcribeAudioOnBackend = async (
  audioBase64: string,
  mimeType: string,
  language: 'en' | 'no'
): Promise<string | null> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`${getSimulatorServerUrl()}/api/audio/transcribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioBase64, mimeType, language }),
      signal: controller.signal,
    });
    if (!response.ok) {
      return null;
    }
    const data = (await response.json()) as { transcript?: string };
    return data.transcript?.trim() || null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
};
