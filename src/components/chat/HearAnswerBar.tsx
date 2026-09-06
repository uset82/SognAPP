import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Touch, Typography } from '../../constants/theme';
import { CivicButton } from '../ui/CivicButton';

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
      <View style={styles.replay}>
        <CivicButton title={replayLabel} variant="primary-safety" onPress={onReplay} />
      </View>
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
    gap: 8,
    paddingHorizontal: 12,
    marginTop: 10,
  },
  replay: {
    flexGrow: 1,
  },
  stop: {
    minHeight: Touch.minTarget,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  stopText: {
    ...Typography.subhead,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
});
