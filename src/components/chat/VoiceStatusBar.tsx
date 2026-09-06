import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { VoiceSessionState } from '../../types/chat';

interface VoiceStatusBarProps {
  state: VoiceSessionState;
  label: string;
  partial?: string;
  cloudNotice?: string;
}

export const VoiceStatusBar: React.FC<VoiceStatusBarProps> = ({ state, label, partial, cloudNotice }) => {
  if (state === 'IDLE') {
    return null;
  }

  return (
    <View
      style={[styles.bar, state === 'ERROR' || state === 'OFFLINE' ? styles.warn : styles.info]}
      accessibilityLiveRegion="polite"
      accessibilityRole="text"
    >
      <Text style={styles.label}>{label}</Text>
      {partial ? <Text style={styles.partial}>{partial}</Text> : null}
      {cloudNotice ? <Text style={styles.notice}>{cloudNotice}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  info: {
    backgroundColor: Colors.safetyGreenBg,
  },
  warn: {
    backgroundColor: Colors.warningAmberBg ?? '#FEF3C7',
  },
  label: {
    ...Typography.meta,
    color: Colors.textPrimary,
  },
  partial: {
    ...Typography.body,
    color: Colors.textPrimary,
    marginTop: 4,
  },
  notice: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});
