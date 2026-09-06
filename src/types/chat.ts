export type ChatRole = 'user' | 'assistant' | 'system';

export type ChatSource = 'typed' | 'apple-speech' | 'whisper' | 'system';

export type ChatMessageStatus = 'pending' | 'completed' | 'failed';

export type VoiceSessionState =
  | 'IDLE'
  | 'LISTENING'
  | 'TRANSCRIBING'
  | 'THINKING'
  | 'SPEAKING'
  | 'ERROR'
  | 'CANCELLED'
  | 'OFFLINE';

export type SttProviderName = 'apple-speech' | 'whisper' | 'web-speech' | 'none';

export type TtsState = 'idle' | 'speaking' | 'paused' | 'stopped';

export type AgentAction =
  | 'NONE'
  | 'OPEN_SAFE_ROUTE'
  | 'OPEN_HELP_FLOW'
  | 'REPEAT_DIRECTION'
  | 'SHOW_SAFE_ZONE'
  | 'SHOW_LAST_UPDATE'
  | 'OPEN_CONNECTION_STATUS';

export type AgentResponseType = 'answer' | 'offer_help' | 'offer_safe' | 'offline' | 'error';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: string;
  source: ChatSource;
  status: ChatMessageStatus;
  spoken: boolean;
  incidentId: string | null;
}

export interface ConversationTurn {
  role: 'user' | 'assistant';
  text: string;
}

export interface EmergencyAgentContext {
  incidentId: string | null;
  incidentStatus: string | null;
  incidentTitle: string | null;
  affectedZone: string | null;
  userInsideAffectedZone: boolean;
  userApproximateLocation: string | null;
  nearestSafeZone: string | null;
  safeZoneStatus: string | null;
  safeZoneDistance: number | null;
  walkingTime: number | null;
  currentRoute: string | null;
  nextNavigationInstruction: string | null;
  blockedAreas: string[];
  lastVerifiedUpdate: string | null;
  connectionStatus: 'NORMAL' | 'DEGRADED';
  helpRequestStatus: string | null;
  selectedLanguage: 'en' | 'no';
  isSafeReported: boolean;
  hasActiveIncident: boolean;
}

export interface AgentResponse {
  type: AgentResponseType;
  message: string;
  action: AgentAction | null;
  speak: boolean;
  cached?: boolean;
}

export const ALLOWED_AGENT_ACTIONS: readonly AgentAction[] = [
  'NONE',
  'OPEN_SAFE_ROUTE',
  'OPEN_HELP_FLOW',
  'REPEAT_DIRECTION',
  'SHOW_SAFE_ZONE',
  'SHOW_LAST_UPDATE',
  'OPEN_CONNECTION_STATUS',
] as const;

export const CRITICAL_ACTIONS = [
  'send_location',
  'submit_help_request',
  'update_injury_status',
  'report_i_am_safe',
] as const;

export interface SpeechToTextProvider {
  name: SttProviderName;
  start: (locale: string) => Promise<void>;
  stop: () => Promise<string>;
  cancel: () => Promise<void>;
  isAvailable: () => Promise<boolean>;
}
