import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { GlassSurface } from './GlassSurface';

interface MetricPillProps {
  icon?: ReactNode;
  label: string;
  tone?: 'neutral' | 'safe';
}

export const MetricPill: React.FC<MetricPillProps> = ({ icon, label, tone = 'neutral' }) => (
  <GlassSurface tone={tone === 'safe' ? 'mint' : 'neutral'} radius={12} style={styles.wrap}>
    <View style={styles.inner}>
      {icon}
      <Text style={[styles.label, tone === 'safe' && styles.safeLabel]}>{label}</Text>
    </View>
  </GlassSurface>
);

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'flex-start',
  },
  inner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },
  label: {
    ...Typography.subhead,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  safeLabel: {
    color: Colors.safetyGreen,
    fontWeight: '800',
    letterSpacing: 0.3,
    fontSize: 12,
  },
});
