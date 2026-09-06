import React from 'react';
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Touch, Typography } from '../../constants/theme';
import { useEmergencyChat } from '../../hooks/useEmergencyChat';
import { GlassSurface } from '../ui/GlassSurface';
import { VoiceStatusBar } from './VoiceStatusBar';
import { VoiceMicButton } from './VoiceMicButton';
import { HearAnswerBar } from './HearAnswerBar';

interface AskDockProps {
  /** Called before navigating to full chat (e.g. stop alert sound). */
  onOpenChat?: () => void;
}

export const AskDock: React.FC<AskDockProps> = ({ onOpenChat }) => {
  const router = useRouter();
  const chat = useEmergencyChat({ maxChips: 0, includeHelpChip: false });

  const handleOpenFull = () => {
    onOpenChat?.();
    router.push('/chat');
  };

  return (
    <GlassSurface tone="neutral" glow="none" style={styles.dock}>
      <View style={styles.header}>
        <Text style={styles.title}>{chat.copy.assistantTitle}</Text>
        {Platform.OS === 'web' ? (
          <a
            href="/chat"
            onClick={() => onOpenChat?.()}
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
            onPress={handleOpenFull}
            accessibilityRole="link"
            accessibilityLabel={chat.copy.openFullAssistant}
            style={styles.linkBtn}
          >
            <Text style={styles.linkText}>{chat.copy.openFullAssistant}</Text>
          </Pressable>
        )}
      </View>

      <Text style={styles.note}>{chat.copy.trainingNote}</Text>

      <VoiceStatusBar
        state={chat.voiceState}
        label={chat.statusLabel}
        partial={chat.partial}
        cloudNotice={chat.usingCloudStt ? chat.copy.cloudSttNotice : undefined}
      />

      {chat.errorCode ? <Text style={styles.errorText}>{chat.errorCode}</Text> : null}

      {chat.messages.length > 0 ? (
        <Text style={styles.lastAnswer} numberOfLines={3}>
          {chat.messages[chat.messages.length - 1]?.text}
        </Text>
      ) : null}

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
      <HearAnswerBar
        visible={Boolean(chat.lastSpoken)}
        replayLabel={chat.copy.replay}
        stopLabel={chat.copy.stopSpeech}
        onReplay={chat.replayLast}
        onStop={() => void chat.stopSpeech()}
      />
    </GlassSurface>
  );
};

const styles = StyleSheet.create({
  dock: {
    marginHorizontal: 16,
    marginTop: 12,
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 12,
    gap: 8,
  },
  title: {
    ...Typography.headline,
    color: Colors.textPrimary,
    fontSize: 16,
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
  note: {
    ...Typography.caption,
    color: Colors.textMuted,
    paddingHorizontal: 14,
    marginTop: 2,
    marginBottom: 6,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.warningAmberDark,
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  lastAnswer: {
    ...Typography.subhead,
    color: Colors.textPrimary,
    paddingHorizontal: 14,
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
    paddingHorizontal: 10,
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
