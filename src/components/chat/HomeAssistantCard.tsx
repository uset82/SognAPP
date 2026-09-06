import React from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Touch, Typography } from '../../constants/theme';
import { useEmergencyChat } from '../../hooks/useEmergencyChat';
import { GlassSurface } from '../ui/GlassSurface';
import { ChatBubble } from './ChatBubble';
import { SuggestionChips } from './SuggestionChips';
import { VoiceStatusBar } from './VoiceStatusBar';
import { VoiceMicButton } from './VoiceMicButton';

export const HomeAssistantCard: React.FC = () => {
  const router = useRouter();
  const chat = useEmergencyChat({ maxChips: 2, includeHelpChip: false, homeChips: true });
  const visible = chat.messages.slice(-4);

  return (
    <GlassSurface tone="mint" glow="safe" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>{chat.copy.assistantTitle}</Text>
          <Text style={styles.note}>{chat.copy.trainingNote}</Text>
        </View>
        {Platform.OS === 'web' ? (
          <a
            href="/chat"
            style={{
              textDecoration: 'none',
              color: Colors.safetyGreen,
              fontWeight: 700,
              fontSize: 13,
              minHeight: Touch.minTarget,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {chat.copy.openFullAssistant}
          </a>
        ) : (
          <Pressable
            onPress={() => router.push('/chat')}
            accessibilityRole="link"
            accessibilityLabel={chat.copy.openFullAssistant}
            style={styles.linkBtn}
          >
            <Text style={styles.linkText}>{chat.copy.openFullAssistant}</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.thread} accessibilityRole="text">
        {visible.length === 0 ? (
          <ChatBubble
            message={{
              id: 'intro',
              role: 'assistant',
              text: chat.copy.homeIntro,
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
        <VoiceStatusBar
          state={chat.voiceState}
          label={chat.statusLabel}
          partial={chat.partial}
          cloudNotice={chat.usingCloudStt ? chat.copy.cloudSttNotice : undefined}
        />
        {chat.errorCode ? <Text style={styles.errorText}>{chat.errorCode}</Text> : null}
      </View>

      <SuggestionChips chips={chat.chips} onSelect={(prompt) => void chat.askAssistant(prompt, 'typed')} />

      <Text style={styles.speakHint}>{chat.copy.speakHint}</Text>
      <View style={styles.composer}>
        <TextInput
          value={chat.draft}
          onChangeText={chat.setDraft}
          placeholder={chat.copy.inputPlaceholder}
          placeholderTextColor={Colors.textMuted}
          style={styles.input}
          editable={!chat.busy}
          accessibilityLabel={chat.copy.inputPlaceholder}
        />
        <Pressable
          onPress={chat.handleSend}
          disabled={!chat.draft.trim() || chat.busy}
          style={[styles.send, (!chat.draft.trim() || chat.busy) && styles.disabled]}
          accessibilityRole="button"
          accessibilityLabel={chat.copy.send}
        >
          <Text style={styles.sendText}>{chat.copy.send}</Text>
        </Pressable>
        <VoiceMicButton
          voiceState={chat.voiceState}
          speakLabel={chat.copy.speakAction}
          stopLabel="STOP"
          accessibilityLabel={
            chat.voiceState === 'LISTENING' ? chat.copy.stopListening : chat.copy.microphone
          }
          onPress={() => void chat.handleMic()}
          onLongPress={() => void chat.handleCancelVoice()}
        />
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
    maxHeight: 240,
    paddingTop: 8,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.warningAmberDark,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  speakHint: {
    ...Typography.caption,
    color: Colors.textSecondary,
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
