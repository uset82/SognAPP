import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { SognSafeLogo } from '../brand';
import { GlassSurface } from './GlassSurface';
import { LocationPinIcon } from './CivicIcons';

interface AppChromeProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
  district?: string;
  centered?: boolean;
}

export const AppChrome: React.FC<AppChromeProps> = ({
  title = 'SOGN SAFE',
  subtitle,
  compact = false,
  district,
  centered = false,
}) => {
  if (centered) {
    return (
      <View style={styles.centered}>
        <SognSafeLogo size={compact ? 34 : 36} variant="master" />
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <SognSafeLogo size={compact ? 36 : 42} variant="master" />
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {district ? (
        <GlassSurface tone="neutral" intensity="soft" radius={16} style={styles.chip}>
          <View style={styles.chipInner}>
            <LocationPinIcon size={14} color={Colors.textSecondary} />
            <Text style={styles.chipText}>{district}</Text>
          </View>
        </GlassSurface>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  centered: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  title: {
    ...Typography.headline,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  chip: {
    marginLeft: 8,
  },
  chipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    minHeight: 32,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});
