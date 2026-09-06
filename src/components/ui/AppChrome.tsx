import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Colors, Touch, Typography } from '../../constants/theme';
import { SognSafeLogo } from '../brand';
import { GlassSurface } from './GlassSurface';
import { ChevronLeftIcon, LocationPinIcon } from './CivicIcons';

interface AppChromeProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
  district?: string;
  centered?: boolean;
  onBack?: () => void;
  backLabel?: string;
}

export const AppChrome: React.FC<AppChromeProps> = ({
  title = 'SOGN SAFE',
  subtitle,
  compact = false,
  district,
  centered = false,
  onBack,
  backLabel = 'Back',
}) => {
  const brand = centered ? (
    <View style={styles.centered}>
      <SognSafeLogo size={compact ? 34 : 36} variant="master" />
      <Text style={styles.title}>{title}</Text>
    </View>
  ) : (
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

  if (!onBack) {
    return brand;
  }

  return (
    <View>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel={backLabel}
        hitSlop={8}
        style={({ pressed }) => [styles.back, pressed && styles.backPressed]}
      >
        <ChevronLeftIcon size={18} color={Colors.textPrimary} strokeWidth={2.4} />
        <Text style={styles.backLabel}>{backLabel}</Text>
      </Pressable>
      {brand}
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
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    minHeight: Touch.minTarget,
    paddingHorizontal: 16,
    paddingRight: 20,
  },
  backPressed: {
    opacity: 0.65,
  },
  backLabel: {
    ...Typography.subhead,
    color: Colors.textPrimary,
  },
});
