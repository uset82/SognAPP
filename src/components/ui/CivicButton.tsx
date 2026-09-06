import React, { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { BorderRadius, Colors, Elevation, Spacing, Touch, Typography } from '../../constants/theme';
import { ChevronRightIcon } from './CivicIcons';

export type CivicButtonVariant =
  | 'primary-safety'
  | 'primary-emergency'
  | 'outline-emergency'
  | 'outline-neutral'
  | 'warning';

interface CivicButtonProps {
  title: string;
  subtitle?: string;
  variant?: CivicButtonVariant;
  onPress: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  showChevron?: boolean;
  style?: ViewStyle;
}

export const CivicButton: React.FC<CivicButtonProps> = ({
  title,
  subtitle,
  variant = 'primary-safety',
  onPress,
  disabled = false,
  icon,
  showChevron = false,
  style,
}) => {
  const handlePress = () => {
    if (disabled) return;
    if (variant === 'primary-emergency') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => undefined);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => undefined);
    }
    onPress();
  };

  const isSolid =
    variant === 'primary-safety' ||
    variant === 'primary-emergency' ||
    variant === 'warning';
  const textColor =
    variant === 'outline-emergency'
      ? Colors.emergencyRed
      : variant === 'outline-neutral'
        ? Colors.textPrimary
        : Colors.textOnColor;

  const glow =
    variant === 'primary-safety'
      ? Elevation.glowSafe
      : variant === 'primary-emergency'
        ? Elevation.glowAlert
        : Elevation.shadowMd;

  const fill: readonly [string, string] =
    variant === 'primary-safety'
      ? [Colors.safetyGreen, Colors.safetyGreenDark]
      : variant === 'primary-emergency'
        ? [Colors.emergencyRed, Colors.emergencyRedDark]
        : variant === 'warning'
          ? [Colors.warningAmber, Colors.warningAmberDark]
          : variant === 'outline-emergency'
            ? ['rgba(255,255,255,0.55)', 'rgba(255,245,244,0.72)']
            : ['rgba(255,255,255,0.5)', 'rgba(255,255,255,0.7)'];

  return (
    <TouchableOpacity
      style={[styles.lift, glow, disabled && styles.disabled, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`${title}${subtitle ? `, ${subtitle}` : ''}`}
    >
      <LinearGradient
        colors={fill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[
          styles.base,
          variant === 'outline-emergency' && styles.outlineEmergency,
          variant === 'outline-neutral' && styles.outlineNeutral,
        ]}
      >
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(255,255,255,0.38)', 'transparent']}
          style={styles.sheen}
        />
        <View style={styles.row}>
          {icon ? <View style={styles.iconSlot}>{icon}</View> : null}
          <View style={styles.textCol}>
            <Text style={[styles.title, { color: textColor }]}>{title}</Text>
            {subtitle ? (
              <Text style={[styles.subtitle, { color: isSolid ? 'rgba(255,255,255,0.82)' : Colors.textSecondary }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          {showChevron ? <ChevronRightIcon size={20} color={textColor} /> : null}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  lift: {
    borderRadius: BorderRadius.lg,
  },
  base: {
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.lg,
    minHeight: Touch.primaryCta,
    justifyContent: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.hairlineRingOnColor,
  },
  sheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 22,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSlot: {
    marginRight: 12,
  },
  textCol: {
    flex: 1,
  },
  title: {
    ...Typography.headline,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  subtitle: {
    ...Typography.caption,
    marginTop: 2,
  },
  outlineEmergency: {
    minHeight: Touch.minTarget,
    borderWidth: 1.5,
    borderColor: Colors.emergencyRed,
  },
  outlineNeutral: {
    minHeight: Touch.minTarget,
    borderColor: Colors.hairlineRing,
  },
  disabled: {
    opacity: 0.5,
  },
});
