import AsyncStorage from '@react-native-async-storage/async-storage';
import { ChatMessage } from '../types/chat';

const historyKey = (incidentId: string | null) => `@sogn_safe_chat_${incidentId ?? 'none'}`;

export const MAX_STORED_MESSAGES = 24;
export const MAX_REMOTE_TURNS = 6;

export const loadChatHistory = async (incidentId: string | null): Promise<ChatMessage[]> => {
  try {
    const raw = await AsyncStorage.getItem(historyKey(incidentId));
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as ChatMessage[];
    return Array.isArray(parsed) ? parsed.slice(-MAX_STORED_MESSAGES) : [];
  } catch {
    return [];
  }
};

export const saveChatHistory = async (incidentId: string | null, messages: ChatMessage[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(historyKey(incidentId), JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)));
  } catch {
    // Ignore storage failures.
  }
};

export const clearChatHistory = async (incidentId: string | null): Promise<void> => {
  try {
    await AsyncStorage.removeItem(historyKey(incidentId));
  } catch {
    // Ignore.
  }
};

export const clearAllChatHistory = async (): Promise<void> => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const chatKeys = keys.filter((key) => key.startsWith('@sogn_safe_chat_'));
    if (chatKeys.length > 0) {
      await AsyncStorage.multiRemove(chatKeys);
    }
  } catch {
    // Ignore.
  }
};
