import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { useEmergency } from '../context/EmergencyContext';
import { Colors, Touch, Typography } from '../constants/theme';
import { chatCopy } from '../constants/chatTranslations';
import { AppChrome, CivicAtmosphere, CivicButton, ScreenEnter } from '../components/ui';
import { MedicalCrossIcon } from '../components/ui/CivicIcons';
import { ChatBubble } from '../components/chat/ChatBubble';
import { SuggestionChips } from '../components/chat/SuggestionChips';
import { VoiceStatusBar } from '../components/chat/VoiceStatusBar';
import { buildEmergencyAgentContext } from '../services/agentContext';
import { runAgentPipeline } from '../services/agentPipeline';
import { clearChatHistory, loadChatHistory, saveChatHistory } from '../services/chatHistory';
import { cancelListening, readPartialTranscript, startListening, stopListening } from '../services/speechToText';
import { speakText, stopSpeech } from '../services/textToSpeech';
import { AgentResponse, ChatMessage, ChatSource, VoiceSessionState } from '../types/chat';
import { triggerWarningHaptic } from '../services/haptics';

const makeId = () => `chat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export default function ChatScreen() {
  const router = useRouter();
  const emergency = useEmergency();
  const { language, t, hasActiveIncident, incident, isDegradedConnection, activeHelpRequest } = emergency;
  const copy = chatCopy[language];
  const scrollRef = useRef<ScrollView>(null);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [voiceState, setVoiceState] = useState<VoiceSessionState>('IDLE');
  const [partial, setPartial] = useState('');
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<AgentResponse | null>(null);
  const [lastSpoken, setLastSpoken] = useState('');
  const [voicePref, setVoicePref] = useState(true);
  const [usingCloudStt, setUsingCloudStt] = useState(false);
  const voiceOriginRef = useRef(false);

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
        selectedZone: emergency.enrichedZones.find((zone) => zone.id === emergency.selectedZoneId) ?? incident?.primarySafeZone,
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
    loadChatHistory(incidentId).then(setMessages).catch(() => undefined);
  }, [incidentId]);

  useEffect(() => {
    if (!hasActiveIncident && messages.length > 0 && messages.some((item) => item.incidentId && item.incidentId !== incidentId)) {
      void clearChatHistory(messages[0].incidentId);
    }
  }, [hasActiveIncident, incidentId, messages]);

  useEffect(() => {
    void saveChatHistory(incidentId, messages);
  }, [incidentId, messages]);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, pendingAction, voiceState]);

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

  const chips = useMemo(() => {
    const items = [
      { id: 'where', label: copy.chipWhere, prompt: language === 'no' ? 'Hvor skal jeg gå?' : 'Where should I go?' },
      { id: 'repeat', label: copy.chipRepeat, prompt: language === 'no' ? 'Gjenta instruksjonen' : 'Repeat the last instruction' },
      { id: 'changed', label: copy.chipChanged, prompt: language === 'no' ? 'Hva har endret seg?' : 'What changed?' },
    ];
    if (hasActiveIncident) {
      items.push({ id: 'help', label: copy.chipHelp, prompt: language === 'no' ? 'Jeg trenger hjelp' : 'I need help' });
    }
    return items.slice(0, 4);
  }, [copy, hasActiveIncident, language]);

  const append = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const askAssistant = async (text: string, source: ChatSource) => {
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
    append(userMessage);
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
    append(assistantMessage);
    setPendingAction(response.type === 'offer_help' || response.type === 'offer_safe' ? response : null);
    setLastSpoken(response.message);

    if (response.action && response.action !== 'OPEN_HELP_FLOW' && response.type !== 'offer_help' && response.type !== 'offer_safe') {
      // Do not auto-navigate for critical flows. Informational actions stay optional.
    }

    const shouldSpeak = response.speak && (voiceOriginRef.current || voicePref === false ? voiceOriginRef.current : false);
    if (shouldSpeak) {
      setVoiceState('SPEAKING');
      await speakText(response.message, language);
    }
    voiceOriginRef.current = false;
    setVoiceState(offline ? 'OFFLINE' : 'IDLE');
  };

  const handleSend = () => {
    voiceOriginRef.current = false;
    void askAssistant(draft, 'typed');
  };

  const handleMic = async () => {
    if (voiceState === 'LISTENING') {
      setVoiceState('TRANSCRIBING');
      const result = await stopListening(language);
      setPartial('');
      if (result.provider === 'whisper') {
        setUsingCloudStt(true);
      }
      if (!result.text) {
        setErrorCode(copy.speechFailed);
        setVoiceState('ERROR');
        return;
      }
      voiceOriginRef.current = true;
      await askAssistant(result.text, result.provider === 'whisper' ? 'whisper' : 'apple-speech');
      return;
    }

    await stopSpeech();
    triggerWarningHaptic();
    setUsingCloudStt(false);
    setPartial('');
    try {
      const provider = await startListening(language);
      if (provider === 'none') {
        setErrorCode(copy.micUnavailable);
        setVoiceState('ERROR');
        return;
      }
      if (provider === 'whisper') {
        setUsingCloudStt(true);
      }
      setVoiceState('LISTENING');
      const pulse = setInterval(() => {
        setPartial(readPartialTranscript());
      }, 250);
      setTimeout(() => clearInterval(pulse), 12000);
    } catch {
      setErrorCode(copy.micUnavailable);
      setVoiceState('ERROR');
    }
  };

  const handleCancelVoice = async () => {
    await cancelListening();
    await stopSpeech();
    setPartial('');
    setVoiceState('CANCELLED');
    setTimeout(() => setVoiceState('IDLE'), 400);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CivicAtmosphere mood={hasActiveIncident ? 'alert' : 'calm'}>
        <ScreenEnter>
          <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <AppChrome
              title={t.brandTitle}
              subtitle={copy.assistantTitle}
              onBack={() => router.replace('/')}
              backLabel={t.backToHome}
            />
            {hasActiveIncident ? (
              <Text style={styles.incident}>{copy.activeIncident}</Text>
            ) : null}
            <Text style={styles.training}>{copy.trainingNote}</Text>
            <Pressable
              onPress={() => {
                setMessages([]);
                setPendingAction(null);
                void clearChatHistory(incidentId);
              }}
              style={styles.clearBtn}
              accessibilityRole="button"
              accessibilityLabel={copy.clearChat}
            >
              <Text style={styles.clearText}>{copy.clearChat}</Text>
            </Pressable>

            <ScrollView
              ref={scrollRef}
              style={styles.thread}
              contentContainerStyle={styles.threadInner}
              keyboardShouldPersistTaps="handled"
            >
              <SuggestionChips chips={chips} onSelect={(prompt) => void askAssistant(prompt, 'typed')} />
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
              <VoiceStatusBar
                state={voiceState}
                label={statusLabel}
                partial={partial}
                cloudNotice={usingCloudStt ? copy.cloudSttNotice : undefined}
              />
              {pendingAction?.type === 'offer_help' ? (
                <View style={styles.confirm}>
                  <CivicButton title={copy.continueToHelp} variant="primary-emergency" onPress={() => router.push('/help')} />
                </View>
              ) : null}
              {pendingAction?.type === 'offer_safe' ? (
                <View style={styles.confirm}>
                  <CivicButton title={copy.continueToSafe} variant="primary-safety" onPress={() => router.push('/safe')} />
                </View>
              ) : null}
              {errorCode ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{errorCode}</Text>
                  <View style={styles.errorActions}>
                    <Pressable onPress={() => setErrorCode(null)} style={styles.errorBtn} accessibilityRole="button">
                      <Text style={styles.errorBtnText}>{copy.retry}</Text>
                    </Pressable>
                    <Pressable onPress={() => setDraft('')} style={styles.errorBtn} accessibilityRole="button">
                      <Text style={styles.errorBtnText}>{copy.typeInstead}</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => router.push(hasActiveIncident ? '/evacuate' : '/')}
                      style={styles.errorBtn}
                      accessibilityRole="button"
                    >
                      <Text style={styles.errorBtnText}>{copy.viewInstruction}</Text>
                    </Pressable>
                  </View>
                  {errorCode === copy.micUnavailable ? (
                    <Pressable onPress={() => Linking.openSettings()} style={styles.errorBtn} accessibilityRole="button">
                      <Text style={styles.errorBtnText}>{copy.openSettings}</Text>
                    </Pressable>
                  ) : null}
                </View>
              ) : null}
            </ScrollView>

            <View style={styles.composer}>
              <TextInput
                value={draft}
                onChangeText={setDraft}
                placeholder={copy.inputPlaceholder}
                placeholderTextColor={Colors.textMuted}
                style={styles.input}
                multiline
                accessibilityLabel={copy.inputPlaceholder}
              />
              <Pressable
                onPress={handleSend}
                disabled={!draft.trim()}
                style={[styles.iconBtn, !draft.trim() && styles.disabled]}
                accessibilityRole="button"
                accessibilityLabel={copy.send}
              >
                <Text style={styles.iconText}>{copy.send}</Text>
              </Pressable>
              <Pressable
                onPress={() => void handleMic()}
                onLongPress={() => void handleCancelVoice()}
                style={[styles.micBtn, voiceState === 'LISTENING' && styles.micLive]}
                accessibilityRole="button"
                accessibilityLabel={voiceState === 'LISTENING' ? copy.stopListening : copy.microphone}
              >
                <Text style={styles.micText}>{voiceState === 'LISTENING' ? 'STOP' : 'MIC'}</Text>
              </Pressable>
            </View>

            {lastSpoken ? (
              <View style={styles.speechRow}>
                <Pressable
                  onPress={() => {
                    voiceOriginRef.current = true;
                    setVoicePref(true);
                    void speakText(lastSpoken, language);
                  }}
                  style={styles.speechBtn}
                  accessibilityRole="button"
                  accessibilityLabel={copy.replay}
                >
                  <Text style={styles.speechText}>{copy.replay}</Text>
                </Pressable>
                <Pressable
                  onPress={() => void stopSpeech()}
                  style={styles.speechBtn}
                  accessibilityRole="button"
                  accessibilityLabel={copy.stopSpeech}
                >
                  <Text style={styles.speechText}>{copy.stopSpeech}</Text>
                </Pressable>
              </View>
            ) : null}

            <View style={styles.help}>
              <CivicButton
                title={t.needHelp}
                variant="outline-emergency"
                icon={<MedicalCrossIcon size={22} color={Colors.emergencyRed} />}
                onPress={() => router.push('/help')}
              />
            </View>
          </KeyboardAvoidingView>
        </ScreenEnter>
      </CivicAtmosphere>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  fill: {
    flex: 1,
  },
  incident: {
    ...Typography.meta,
    color: Colors.emergencyRed,
    textAlign: 'center',
    marginBottom: 4,
  },
  training: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 4,
  },
  clearBtn: {
    minHeight: Touch.minTarget,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  clearText: {
    ...Typography.subhead,
    color: Colors.safetyGreen,
  },
  thread: {
    flex: 1,
  },
  threadInner: {
    paddingBottom: 16,
  },
  confirm: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  errorBox: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: Colors.warningAmberBg,
  },
  errorText: {
    ...Typography.subhead,
    color: Colors.textPrimary,
  },
  errorActions: {
    marginTop: 8,
    gap: 6,
  },
  errorBtn: {
    minHeight: Touch.minTarget,
    justifyContent: 'center',
  },
  errorBtnText: {
    ...Typography.subhead,
    color: Colors.safetyGreen,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    minHeight: Touch.minTarget,
    maxHeight: 110,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.hairlineRing,
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: Colors.textPrimary,
  },
  iconBtn: {
    minHeight: Touch.minTarget,
    minWidth: Touch.minTarget,
    borderRadius: 16,
    backgroundColor: Colors.safetyGreen,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  disabled: {
    opacity: 0.45,
  },
  iconText: {
    color: Colors.textOnColor,
    fontWeight: '800',
    fontSize: 12,
  },
  micBtn: {
    minHeight: Touch.minTarget,
    minWidth: Touch.minTarget,
    borderRadius: 24,
    backgroundColor: Colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micLive: {
    backgroundColor: Colors.emergencyRed,
  },
  micText: {
    color: Colors.textOnColor,
    fontWeight: '800',
    fontSize: 11,
  },
  speechRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  speechBtn: {
    minHeight: Touch.minTarget,
    justifyContent: 'center',
  },
  speechText: {
    ...Typography.subhead,
    color: Colors.safetyGreen,
  },
  help: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
});
