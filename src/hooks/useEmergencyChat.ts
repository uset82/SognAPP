import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useEmergency } from '../context/EmergencyContext';
import { chatCopy } from '../constants/chatTranslations';
import { buildEmergencyAgentContext } from '../services/agentContext';
import { runAgentPipeline } from '../services/agentPipeline';
import { clearChatHistory, loadChatHistory, saveChatHistory } from '../services/chatHistory';
import { cancelListening, readPartialTranscript, startListening, stopListening } from '../services/speechToText';
import { hushOutput, speakImmediateCue, speakText, stopSpeech, unlockSpeechPlayback } from '../services/textToSpeech';
import { triggerWarningHaptic } from '../services/haptics';
import { AgentResponse, ChatMessage, ChatSource, VoiceSessionState } from '../types/chat';

const makeId = () => `chat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export interface SuggestionChipItem {
  id: string;
  label: string;
  prompt: string;
}

export interface UseEmergencyChatOptions {
  /** Limit chips (home card uses 2; full chat uses up to 4). */
  maxChips?: number;
  /** Include the help chip when an incident is active. */
  includeHelpChip?: boolean;
  /** Home card: only destination + update chips. */
  homeChips?: boolean;
}

export const useEmergencyChat = (options: UseEmergencyChatOptions = {}) => {
  const { maxChips = 4, includeHelpChip = true, homeChips = false } = options;
  const emergency = useEmergency();
  const { language, t, hasActiveIncident, incident, isDegradedConnection, activeHelpRequest } = emergency;
  const copy = chatCopy[language];

  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [voiceState, setVoiceState] = useState<VoiceSessionState>('IDLE');
  const [partial, setPartial] = useState('');
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<AgentResponse | null>(null);
  const [lastSpoken, setLastSpoken] = useState('');
  const [voicePref, setVoicePref] = useState(true);
  const [usingCloudStt, setUsingCloudStt] = useState(false);
  const [historyReady, setHistoryReady] = useState(false);
  const voiceOriginRef = useRef(false);
  const listeningRef = useRef(false);
  const finishingRef = useRef(false);
  const partialTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const incidentId = incident?.id ?? null;

  const context = useMemo(
    () =>
      buildEmergencyAgentContext({
        hasActiveIncident,
        incident,
        activeHelpRequest,
        isDegradedConnection,
        isSafeReported: emergency.isSafeReported,
        language,
        selectedZone:
          emergency.enrichedZones.find((zone) => zone.id === emergency.selectedZoneId) ??
          incident?.primarySafeZone,
        locationName: incident?.locationName ?? t.districtName,
      }),
    [
      activeHelpRequest,
      emergency.enrichedZones,
      emergency.isSafeReported,
      emergency.selectedZoneId,
      hasActiveIncident,
      incident,
      isDegradedConnection,
      language,
      t.districtName,
    ]
  );

  useEffect(() => {
    let cancelled = false;
    setHistoryReady(false);
    loadChatHistory(incidentId)
      .then((loaded) => {
        if (!cancelled) {
          setMessages(loaded);
          setHistoryReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMessages([]);
          setHistoryReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [incidentId]);

  useEffect(() => {
    if (!hasActiveIncident && messages.length > 0 && messages.some((item) => item.incidentId && item.incidentId !== incidentId)) {
      void clearChatHistory(messages[0].incidentId);
    }
  }, [hasActiveIncident, incidentId, messages]);

  useEffect(() => {
    if (!historyReady) {
      return;
    }
    void saveChatHistory(incidentId, messages);
  }, [historyReady, incidentId, messages]);

  const clearVoiceTimers = () => {
    if (partialTimerRef.current) {
      clearInterval(partialTimerRef.current);
      partialTimerRef.current = null;
    }
    if (autoStopTimerRef.current) {
      clearTimeout(autoStopTimerRef.current);
      autoStopTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearVoiceTimers();
    };
  }, []);

  const statusLabel =
    voiceState === 'LISTENING'
      ? copy.listening
      : voiceState === 'TRANSCRIBING'
        ? copy.transcribing
        : voiceState === 'THINKING'
          ? copy.thinking
          : voiceState === 'SPEAKING'
            ? copy.speaking
            : voiceState === 'OFFLINE'
              ? copy.offline
              : voiceState === 'ERROR'
                ? errorCode ?? copy.assistantUnavailable
                : '';

  const chips = useMemo((): SuggestionChipItem[] => {
    if (homeChips) {
      return [
        {
          id: 'where',
          label: copy.chipWhere,
          prompt: language === 'no' ? 'Hvor skal jeg gå?' : 'Where should I go?',
        },
        {
          id: 'changed',
          label: copy.chipChanged,
          prompt: language === 'no' ? 'Hva har endret seg?' : 'What changed?',
        },
      ].slice(0, maxChips);
    }
    const items: SuggestionChipItem[] = [
      {
        id: 'where',
        label: copy.chipWhere,
        prompt: language === 'no' ? 'Hvor skal jeg gå?' : 'Where should I go?',
      },
      {
        id: 'repeat',
        label: copy.chipRepeat,
        prompt: language === 'no' ? 'Gjenta instruksjonen' : 'Repeat the last instruction',
      },
      {
        id: 'changed',
        label: copy.chipChanged,
        prompt: language === 'no' ? 'Hva har endret seg?' : 'What changed?',
      },
    ];
    if (includeHelpChip && hasActiveIncident) {
      items.push({
        id: 'help',
        label: copy.chipHelp,
        prompt: language === 'no' ? 'Jeg trenger hjelp' : 'I need help',
      });
    }
    return items.slice(0, maxChips);
  }, [copy, hasActiveIncident, homeChips, includeHelpChip, language, maxChips]);

  const busy =
    voiceState === 'LISTENING' ||
    voiceState === 'TRANSCRIBING' ||
    voiceState === 'THINKING' ||
    voiceState === 'SPEAKING';

  const askAssistant = useCallback(
    async (text: string, source: ChatSource) => {
      unlockSpeechPlayback();
      if (source === 'typed') {
        speakImmediateCue(language);
      }
      const clean = text.trim();
      if (!clean) {
        setErrorCode(copy.notUnderstood);
        setVoiceState('ERROR');
        return;
      }

      const userMessage: ChatMessage = {
        id: makeId(),
        role: 'user',
        text: clean,
        timestamp: new Date().toISOString(),
        source,
        status: 'completed',
        spoken: false,
        incidentId,
      };

      setMessages((prev) => [...prev, userMessage]);
      setDraft('');
      setVoiceState('THINKING');
      setErrorCode(null);

      const history = [...messages, userMessage]
        .filter((item) => item.role !== 'system')
        .slice(-6)
        .map((item) => ({ role: item.role as 'user' | 'assistant', text: item.text }));

      const { response, offline } = await runAgentPipeline({
        message: clean,
        context,
        conversation: history,
        source,
      });

      if (offline) {
        setVoiceState('OFFLINE');
      }

      const assistantMessage: ChatMessage = {
        id: makeId(),
        role: 'assistant',
        text: response.message,
        timestamp: new Date().toISOString(),
        source: 'system',
        status: 'completed',
        spoken: false,
        incidentId,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setPendingAction(response.type === 'offer_help' || response.type === 'offer_safe' ? response : null);
      setLastSpoken(response.message);

      if (response.speak !== false && voicePref) {
        setVoiceState('SPEAKING');
        await speakText(response.message, language);
      }
      voiceOriginRef.current = false;
      setVoiceState(offline ? 'OFFLINE' : 'IDLE');
    },
    [context, copy.notUnderstood, incidentId, language, messages, voicePref]
  );

  const finishSpokenQuestion = useCallback(
    async (text: string, provider: ChatSource) => {
      if (finishingRef.current) {
        return;
      }
      finishingRef.current = true;
      listeningRef.current = false;
      clearVoiceTimers();
      setPartial('');
      const clean = text.trim();
      if (!clean) {
        setErrorCode(copy.speechFailed);
        setVoiceState('ERROR');
        finishingRef.current = false;
        return;
      }
      voiceOriginRef.current = true;
      await askAssistant(clean, provider);
      finishingRef.current = false;
    },
    [askAssistant, copy.speechFailed]
  );

  const handleSend = useCallback(() => {
    voiceOriginRef.current = false;
    void askAssistant(draft, 'typed');
  }, [askAssistant, draft]);

  const handleMic = useCallback(async () => {
    unlockSpeechPlayback();
    if (listeningRef.current || voiceState === 'LISTENING') {
      setVoiceState('TRANSCRIBING');
      const result = await stopListening(language);
      if (result.provider === 'whisper') {
        setUsingCloudStt(true);
      }
      await finishSpokenQuestion(
        result.text,
        result.provider === 'whisper' ? 'whisper' : 'apple-speech'
      );
      return;
    }

    hushOutput();
    triggerWarningHaptic();
    setUsingCloudStt(false);
    setPartial('');
    finishingRef.current = false;
    try {
      const provider = await startListening(language, {
        onPartial: setPartial,
        onEnded: (text) => {
          if (!listeningRef.current) {
            return;
          }
          setVoiceState('TRANSCRIBING');
          void finishSpokenQuestion(text, 'apple-speech');
        },
      });
      if (provider === 'none') {
        setErrorCode(copy.micUnavailable);
        setVoiceState('ERROR');
        return;
      }
      if (provider === 'whisper') {
        setUsingCloudStt(true);
      }
      listeningRef.current = true;
      setVoiceState('LISTENING');
      clearVoiceTimers();
      partialTimerRef.current = setInterval(() => {
        setPartial(readPartialTranscript());
      }, 250);
      autoStopTimerRef.current = setTimeout(() => {
        if (!listeningRef.current) {
          return;
        }
        setVoiceState('TRANSCRIBING');
        void stopListening(language).then((result) => {
          if (result.provider === 'whisper') {
            setUsingCloudStt(true);
          }
          void finishSpokenQuestion(
            result.text,
            result.provider === 'whisper' ? 'whisper' : 'apple-speech'
          );
        });
      }, 10000);
    } catch {
      listeningRef.current = false;
      setErrorCode(copy.micUnavailable);
      setVoiceState('ERROR');
    }
  }, [copy.micUnavailable, finishSpokenQuestion, language, voiceState]);

  const handleCancelVoice = useCallback(async () => {
    listeningRef.current = false;
    finishingRef.current = false;
    clearVoiceTimers();
    await cancelListening();
    await stopSpeech();
    setPartial('');
    setVoiceState('CANCELLED');
    setTimeout(() => setVoiceState('IDLE'), 400);
  }, []);

  const clearThread = useCallback(() => {
    setMessages([]);
    setPendingAction(null);
    setLastSpoken('');
    setErrorCode(null);
    void clearChatHistory(incidentId);
  }, [incidentId]);

  const replayLast = useCallback(() => {
    if (!lastSpoken) {
      return;
    }
    unlockSpeechPlayback();
    voiceOriginRef.current = true;
    setVoicePref(true);
    setVoiceState('SPEAKING');
    void speakText(lastSpoken, language, { fromUserGesture: true }).finally(() => {
      setVoiceState('IDLE');
    });
  }, [language, lastSpoken]);

  const dismissError = useCallback(() => {
    setErrorCode(null);
    if (voiceState === 'ERROR') {
      setVoiceState('IDLE');
    }
  }, [voiceState]);

  return {
    copy,
    language,
    t,
    hasActiveIncident,
    incidentId,
    draft,
    setDraft,
    messages,
    voiceState,
    partial,
    errorCode,
    pendingAction,
    lastSpoken,
    usingCloudStt,
    statusLabel,
    chips,
    busy,
    askAssistant,
    handleSend,
    handleMic,
    handleCancelVoice,
    clearThread,
    replayLast,
    stopSpeech,
    dismissError,
    setErrorCode,
    setPendingAction,
  };
};
