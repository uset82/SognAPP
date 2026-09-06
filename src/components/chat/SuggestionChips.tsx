import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Touch, Typography } from '../../constants/theme';

export interface SuggestionChip {
  id: string;
  label: string;
  prompt: string;
}

interface SuggestionChipsProps {
  chips: SuggestionChip[];
  onSelect: (prompt: string) => void;
}

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({ chips, onSelect }) => (
  <View style={styles.wrap}>
    {chips.map((chip) => (
      <Pressable
        key={chip.id}
        onPress={() => onSelect(chip.prompt)}
        accessibilityRole="button"
        accessibilityLabel={chip.label}
        style={({ pressed }) => [styles.chip, pressed && styles.pressed]}
      >
        <Text style={styles.label}>{chip.label}</Text>
      </Pressable>
    ))}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  chip: {
    minHeight: Touch.minTarget,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.edgeSafe,
    backgroundColor: Colors.safetyGreenBg,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
  label: {
    ...Typography.caption,
    fontWeight: '800',
    letterSpacing: 0.4,
    color: Colors.safetyGreen,
  },
});
