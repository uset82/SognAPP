import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePathname, useRouter } from 'expo-router';
import { Colors, Touch, Typography } from '../../constants/theme';
import { SognSafeLogo } from '../brand';
import { GlassSurface } from './GlassSurface';
import { ChevronLeftIcon, LocationPinIcon } from './CivicIcons';
import { stopEmergencyAlert } from '../../services/alertSound';

interface AppChromeProps {
  title?: string;
  subtitle?: string;
  compact?: boolean;
  district?: string;
  centered?: boolean;
  onBack?: () => void;
  backLabel?: string;
}

const isHomePath = (pathname: string) => pathname === '/' || pathname === '/index';

export const AppChrome: React.FC<AppChromeProps> = ({
  title = 'SOGN SAFE',
  subtitle,
  compact = false,
  district,
  centered = false,
  onBack,
  backLabel = 'Back',
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = isHomePath(pathname);

  const handleGoHome = () => {
    if (isHome) {
      return;
    }
    void stopEmergencyAlert();
    router.replace('/');
  };

  const brandMark = (
    <Pressable
      onPress={handleGoHome}
      disabled={isHome}
      accessibilityRole={isHome ? 'header' : 'button'}
      accessibilityLabel={title}
      accessibilityHint={isHome ? undefined : backLabel}
      hitSlop={8}
      style={({ pressed }) => [styles.brand, centered && styles.centeredBrand, pressed && !isHome && styles.pressed]}
    >
      <SognSafeLogo size={compact ? (centered ? 34 : 36) : 42} variant="master" />
      <View>
        <Text style={styles.title}>{title}</Text>
        {subtitle && !centered ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </Pressable>
  );

  const chrome = centered ? (
    <View style={styles.centered}>{brandMark}</View>
  ) : (
    <View style={styles.row}>
      {brandMark}
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
    return chrome;
  }

  return (
    <View>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel={backLabel}
        hitSlop={8}
        style={({ pressed }) => [styles.back, pressed && styles.pressed]}
      >
        <ChevronLeftIcon size={18} color={Colors.textPrimary} strokeWidth={2.4} />
        <Text style={styles.backLabel}>{backLabel}</Text>
      </Pressable>
      {chrome}
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
    minHeight: Touch.minTarget,
  },
  centeredBrand: {
    flex: 0,
    justifyContent: 'center',
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
  pressed: {
    opacity: 0.65,
  },
  backLabel: {
    ...Typography.subhead,
    color: Colors.textPrimary,
  },
});
