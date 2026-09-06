import React, { useEffect, useRef } from 'react';
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
import { Colors, Touch, Typography } from '../constants/theme';
import { AppChrome, CivicAtmosphere, CivicButton, ScreenEnter } from '../components/ui';
import { MedicalCrossIcon } from '../components/ui/CivicIcons';
import { ChatBubble } from '../components/chat/ChatBubble';
import { SuggestionChips } from '../components/chat/SuggestionChips';
import { VoiceStatusBar } from '../components/chat/VoiceStatusBar';
import { VoiceMicButton } from '../components/chat/VoiceMicButton';
import { HearAnswerBar } from '../components/chat/HearAnswerBar';
import { useEmergencyChat } from '../hooks/useEmergencyChat';

export default function ChatScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const chat = useEmergencyChat({ maxChips: 4, includeHelpChip: true });

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [chat.messages, chat.pendingAction, chat.voiceState]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <CivicAtmosphere mood={chat.hasActiveIncident ? 'alert' : 'calm'}>
        <ScreenEnter>
          <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <AppChrome
              title={chat.t.brandTitle}
              subtitle={chat.copy.assistantTitle}
              onBack={() => router.replace('/')}
              backLabel={chat.t.backToHome}
            />
            {chat.hasActiveIncident ? (
              <Text style={styles.incident}>{chat.copy.activeIncident}</Text>
            ) : null}
            <Text style={styles.training}>{chat.copy.trainingNote}</Text>
            <Pressable
              onPress={chat.clearThread}
              style={styles.clearBtn}
              accessibilityRole="button"
              accessibilityLabel={chat.copy.clearChat}
            >
              <Text style={styles.clearText}>{chat.copy.clearChat}</Text>
            </Pressable>

            <ScrollView
              ref={scrollRef}
              style={styles.thread}
              contentContainerStyle={styles.threadInner}
              keyboardShouldPersistTaps="handled"
            >
              <SuggestionChips chips={chat.chips} onSelect={(prompt) => void chat.askAssistant(prompt, 'typed')} />
              {chat.messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
              <VoiceStatusBar
                state={chat.voiceState}
                label={chat.statusLabel}
                partial={chat.partial}
                cloudNotice={chat.usingCloudStt ? chat.copy.cloudSttNotice : undefined}
              />
              {chat.pendingAction?.type === 'offer_help' ? (
                <View style={styles.confirm}>
                  <CivicButton
                    title={chat.copy.continueToHelp}
                    variant="primary-emergency"
                    onPress={() => router.push('/help')}
                  />
                </View>
              ) : null}
              {chat.pendingAction?.type === 'offer_safe' ? (
                <View style={styles.confirm}>
                  <CivicButton
                    title={chat.copy.continueToSafe}
                    variant="primary-safety"
                    onPress={() => router.push('/safe')}
                  />
                </View>
              ) : null}
              {chat.errorCode ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{chat.errorCode}</Text>
                  <View style={styles.errorActions}>
                    <Pressable onPress={chat.dismissError} style={styles.errorBtn} accessibilityRole="button">
                      <Text style={styles.errorBtnText}>{chat.copy.retry}</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => {
                        chat.setDraft('');
                        chat.dismissError();
                      }}
                      style={styles.errorBtn}
                      accessibilityRole="button"
                    >
                      <Text style={styles.errorBtnText}>{chat.copy.typeInstead}</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => router.push(chat.hasActiveIncident ? '/evacuate' : '/')}
                      style={styles.errorBtn}
                      accessibilityRole="button"
                    >
                      <Text style={styles.errorBtnText}>{chat.copy.viewInstruction}</Text>
                    </Pressable>
                  </View>
                  {chat.errorCode === chat.copy.micUnavailable ? (
                    <Pressable onPress={() => Linking.openSettings()} style={styles.errorBtn} accessibilityRole="button">
                      <Text style={styles.errorBtnText}>{chat.copy.openSettings}</Text>
                    </Pressable>
                  ) : null}
                </View>
              ) : null}
            </ScrollView>

            <Text style={styles.speakHint}>{chat.copy.speakHint}</Text>
            <View style={styles.composer}>
              <TextInput
                value={chat.draft}
                onChangeText={chat.setDraft}
                placeholder={chat.copy.inputPlaceholder}
                placeholderTextColor={Colors.textMuted}
                style={styles.input}
                multiline
                accessibilityLabel={chat.copy.inputPlaceholder}
              />
              <Pressable
                onPress={chat.handleSend}
                disabled={!chat.draft.trim() || chat.busy}
                style={[styles.iconBtn, (!chat.draft.trim() || chat.busy) && styles.disabled]}
                accessibilityRole="button"
                accessibilityLabel={chat.copy.send}
              >
                <Text style={styles.iconText}>{chat.copy.send}</Text>
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

            <View style={styles.help}>
              <CivicButton
                title={chat.t.needHelp}
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
  speakHint: {
    ...Typography.caption,
    color: Colors.textSecondary,
    paddingHorizontal: 16,
    marginBottom: 6,
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
  help: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
});
