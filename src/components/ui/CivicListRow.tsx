import React, { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Touch, Typography } from '../../constants/theme';
import { ChevronRightIcon } from './CivicIcons';

interface CivicListRowProps {
  icon: ReactNode;
  label: string;
  value?: string;
  onPress: () => void;
  accessibilityLabel?: string;
  last?: boolean;
}

export const CivicListRow: React.FC<CivicListRowProps> = ({
  icon,
  label,
  value,
  onPress,
  accessibilityLabel,
  last = false,
}) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.75}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel ?? label}
    style={[styles.inner, !last && styles.divider]}
  >
    <View style={styles.left}>
      {icon}
      <Text style={styles.label}>{label}</Text>
    </View>
    <View style={styles.right}>
      {value ? <Text style={styles.value}>{value}</Text> : null}
      <ChevronRightIcon size={18} color={Colors.textMuted} />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  inner: {
    minHeight: Touch.minTarget,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  divider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(17, 24, 39, 0.08)',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  label: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.textPrimary,
    fontSize: 16,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  value: {
    ...Typography.subhead,
    color: Colors.safetyGreen,
  },
});
