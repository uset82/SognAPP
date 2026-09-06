import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Touch, Typography } from '../../constants/theme';

interface HearAnswerBarProps {
  visible: boolean;
  replayLabel: string;
  stopLabel: string;
  onReplay: () => void;
  onStop: () => void;
}

export const HearAnswerBar: React.FC<HearAnswerBarProps> = ({
  visible,
  replayLabel,
  stopLabel,
  onReplay,
  onStop,
}) => {
  if (!visible) {
    return null;
  }

  return (
    <View style={styles.row}>
      <Pressable
        onPress={onReplay}
        style={styles.hear}
        accessibilityRole="button"
        accessibilityLabel={replayLabel}
      >
        <Text style={styles.hearText}>{replayLabel}</Text>
      </Pressable>
      <Pressable
        onPress={onStop}
        style={styles.stop}
        accessibilityRole="button"
        accessibilityLabel={stopLabel}
      >
        <Text style={styles.stopText}>{stopLabel}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  hear: {
    flex: 1,
    minHeight: Touch.minTarget,
    borderRadius: 16,
    backgroundColor: Colors.safetyGreen,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  hearText: {
    ...Typography.subhead,
    color: Colors.textOnColor,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  stop: {
    minHeight: Touch.minTarget,
    minWidth: Touch.minTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  stopText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
});
