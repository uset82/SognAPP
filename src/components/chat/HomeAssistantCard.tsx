import React, { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Touch, Typography } from '../../constants/theme';
import { chatCopy } from '../../constants/chatTranslations';
import { useEmergency } from '../../context/EmergencyContext';
import { buildEmergencyAgentContext } from '../../services/agentContext';
import { runAgentPipeline } from '../../services/agentPipeline';
import { ChatMessage, ChatSource } from '../../types/chat';
import { GlassSurface } from '../ui/GlassSurface';
import { ChatBubble } from './ChatBubble';
import { SuggestionChips } from './SuggestionChips';

const makeId = () => `home-chat-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

export const HomeAssistantCard: React.FC = () => {
  const router = useRouter();
  const emergency = useEmergency();
  const { language, t, hasActiveIncident, incident, isDegradedConnection, activeHelpRequest } = emergency;
  const copy = chatCopy[language];
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

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

  const chips = useMemo(
    () => [
      { id: 'where', label: copy.chipWhere, prompt: language === 'no' ? 'Hvor skal jeg gå?' : 'Where should I go?' },
      { id: 'changed', label: copy.chipChanged, prompt: language === 'no' ? 'Hva har endret seg?' : 'What changed?' },
    ],
    [copy.chipChanged, copy.chipWhere, language]
  );

  const handleAsk = async (text: string, source: ChatSource) => {
    const clean = text.trim();
    if (!clean || busy) {
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
      incidentId: incident?.id ?? null,
    };
    const next = [...messages, userMessage];
    setMessages(next);
    setDraft('');
    setBusy(true);
    const history = next.slice(-6).map((item) => ({
      role: item.role as 'user' | 'assistant',
      text: item.text,
    }));
    const { response } = await runAgentPipeline({
      message: clean,
      context,
      conversation: history,
      source,
    });
    setMessages((prev) => [
      ...prev,
      {
        id: makeId(),
        role: 'assistant',
        text: response.message,
        timestamp: new Date().toISOString(),
        source: 'system',
        status: 'completed',
        spoken: false,
        incidentId: incident?.id ?? null,
      },
    ]);
    setBusy(false);
  };

  const visible = messages.slice(-4);

  return (
    <GlassSurface tone="mint" glow="safe" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{copy.assistantTitle}</Text>
          <Text style={styles.note}>{copy.trainingNote}</Text>
        </View>
        {Platform.OS === 'web' ? (
          <a href="/chat" style={{ textDecoration: 'none', color: Colors.safetyGreen, fontWeight: 700, fontSize: 13 }}>
            {copy.openFullAssistant}
          </a>
        ) : (
          <Pressable
            onPress={() => router.push('/chat')}
            accessibilityRole="link"
            accessibilityLabel={copy.openFullAssistant}
            style={styles.linkBtn}
          >
            <Text style={styles.linkText}>{copy.openFullAssistant}</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.thread} accessibilityRole="text">
        {visible.length === 0 ? (
          <ChatBubble
            message={{
              id: 'intro',
              role: 'assistant',
              text: copy.homeIntro,
              timestamp: new Date().toISOString(),
              source: 'system',
              status: 'completed',
              spoken: false,
              incidentId: null,
            }}
          />
        ) : (
          visible.map((message) => <ChatBubble key={message.id} message={message} />)
        )}
        {busy ? <Text style={styles.thinking}>{copy.thinking}</Text> : null}
      </View>

      <SuggestionChips chips={chips} onSelect={(prompt) => void handleAsk(prompt, 'typed')} />

      <View style={styles.composer}>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder={copy.inputPlaceholder}
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
          editable={!busy}
          accessibilityLabel={copy.inputPlaceholder}
        />
        <Pressable
          onPress={() => void handleAsk(draft, 'typed')}
          disabled={!draft.trim() || busy}
          style={[styles.send, (!draft.trim() || busy) && styles.disabled]}
          accessibilityRole="button"
          accessibilityLabel={copy.send}
        >
          <Text style={styles.sendText}>{copy.send}</Text>
        </Pressable>
      </View>
    </GlassSurface>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 14,
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 12,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...Typography.headline,
    color: Colors.textPrimary,
  },
  note: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
  },
  linkBtn: {
    minHeight: Touch.minTarget,
    justifyContent: 'center',
  },
  linkText: {
    ...Typography.subhead,
    color: Colors.safetyGreen,
    fontWeight: '700',
  },
  thread: {
    maxHeight: 220,
    paddingTop: 8,
  },
  thinking: {
    ...Typography.caption,
    color: Colors.textMuted,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    minHeight: Touch.minTarget,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.hairlineRing,
    backgroundColor: 'rgba(255,255,255,0.86)',
    paddingHorizontal: 12,
    color: Colors.textPrimary,
  },
  send: {
    minHeight: Touch.minTarget,
    minWidth: Touch.minTarget,
    borderRadius: 16,
    backgroundColor: Colors.safetyGreen,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  disabled: {
    opacity: 0.45,
  },
  sendText: {
    color: Colors.textOnColor,
    fontWeight: '800',
    fontSize: 12,
  },
});
