import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

export type ButtonVariant = 
  | 'primary-safety' 
  | 'primary-emergency' 
  | 'outline-emergency' 
  | 'outline-neutral' 
  | 'warning';

interface EmergencyButtonProps {
  title: string;
  subtitle?: string;
  variant?: ButtonVariant;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: string;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  title,
  subtitle,
  variant = 'primary-safety',
  onPress,
  disabled = false,
  style,
  icon,
}) => {
  const handlePress = () => {
    if (disabled) return;

    // Trigger haptic feedback based on button priority
    if (variant === 'primary-emergency') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } else {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    onPress();
  };

  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'primary-safety':
        return styles.primarySafety;
      case 'primary-emergency':
        return styles.primaryEmergency;
      case 'outline-emergency':
        return styles.outlineEmergency;
      case 'outline-neutral':
        return styles.outlineNeutral;
      case 'warning':
        return styles.warning;
      default:
        return styles.primarySafety;
    }
  };

  const getTitleStyle = (): TextStyle => {
    switch (variant) {
      case 'outline-emergency':
        return styles.textEmergency;
      case 'outline-neutral':
        return styles.textNeutral;
      default:
        return styles.textWhite;
    }
  };

  const getSubStyle = (): TextStyle => {
    switch (variant) {
      case 'primary-safety':
        return styles.subSafety;
      case 'primary-emergency':
        return styles.subEmergency;
      default:
        return styles.subMuted;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.baseButton, getContainerStyle(), disabled && styles.disabled, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`${title}${subtitle ? `, ${subtitle}` : ''}`}
    >
      <View style={styles.contentRow}>
        {icon && <Text style={[styles.icon, getTitleStyle()]}>{icon} </Text>}
        <Text style={[styles.title, getTitleStyle()]}>{title}</Text>
      </View>
      {subtitle ? <Text style={[styles.subtitle, getSubStyle()]}>{subtitle}</Text> : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseButton: {
    borderRadius: BorderRadius.lg,
    paddingVertical: 16,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...Typography.headline,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  subtitle: {
    ...Typography.caption,
    marginTop: 2,
    fontWeight: '500',
  },
  icon: {
    fontSize: 18,
    marginRight: 6,
  },
  primarySafety: {
    backgroundColor: Colors.safetyGreen,
    minHeight: 64,
  },
  primaryEmergency: {
    backgroundColor: Colors.emergencyRed,
    minHeight: 64,
  },
  outlineEmergency: {
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1.5,
    borderColor: Colors.emergencyRed,
  },
  outlineNeutral: {
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  warning: {
    backgroundColor: Colors.warningAmber,
  },
  disabled: {
    opacity: 0.5,
  },
  textWhite: {
    color: '#FFFFFF',
  },
  textEmergency: {
    color: Colors.emergencyRedText,
  },
  textNeutral: {
    color: Colors.textPrimary,
  },
  subSafety: {
    color: Colors.safetyGreenText,
  },
  subEmergency: {
    color: '#FFA197',
  },
  subMuted: {
    color: Colors.textMuted,
  },
});
