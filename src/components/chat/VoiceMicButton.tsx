import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Colors, Touch } from '../../constants/theme';
import { VoiceSessionState } from '../../types/chat';
import { MicrophoneIcon } from '../ui/CivicIcons';

interface VoiceMicButtonProps {
  voiceState: VoiceSessionState;
  speakLabel: string;
  stopLabel: string;
  accessibilityLabel: string;
  onPress: () => void;
  onLongPress?: () => void;
}

export const VoiceMicButton: React.FC<VoiceMicButtonProps> = ({
  voiceState,
  speakLabel,
  stopLabel,
  accessibilityLabel,
  onPress,
  onLongPress,
}) => {
  const listening = voiceState === 'LISTENING';
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.micBtn, listening && styles.micLive]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <MicrophoneIcon size={20} color={Colors.textOnColor} />
      <Text style={styles.micText}>{listening ? stopLabel : speakLabel}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  micBtn: {
    minHeight: Touch.minTarget,
    minWidth: 72,
    paddingHorizontal: 10,
    borderRadius: 24,
    backgroundColor: Colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    gap: 2,
  },
  micLive: {
    backgroundColor: Colors.emergencyRed,
  },
  micText: {
    color: Colors.textOnColor,
    fontWeight: '800',
    fontSize: 10,
    letterSpacing: 0.4,
  },
});
