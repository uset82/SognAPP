import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';

export type BannerVariant = 'emergency' | 'safety' | 'warning' | 'neutral';

interface StatusBannerProps {
  badge?: string;
  title: string;
  description?: string;
  timestamp?: string;
  variant?: BannerVariant;
  style?: ViewStyle;
}

export const StatusBanner: React.FC<StatusBannerProps> = ({
  badge,
  title,
  description,
  timestamp,
  variant = 'emergency',
  style,
}) => {
  const getContainerStyle = (): ViewStyle => {
    switch (variant) {
      case 'emergency':
        return styles.emergencyContainer;
      case 'safety':
        return styles.safetyContainer;
      case 'warning':
        return styles.warningContainer;
      case 'neutral':
        return styles.neutralContainer;
      default:
        return styles.emergencyContainer;
    }
  };

  const getBadgeStyle = () => {
    switch (variant) {
      case 'emergency':
        return {
          pill: styles.emergencyPill,
          text: styles.emergencyPillText,
        };
      case 'safety':
        return {
          pill: styles.safetyPill,
          text: styles.safetyPillText,
        };
      case 'warning':
        return {
          pill: styles.warningPill,
          text: styles.warningPillText,
        };
      default:
        return {
          pill: styles.neutralPill,
          text: styles.neutralPillText,
        };
    }
  };

  const badgeStyles = getBadgeStyle();

  return (
    <View style={[styles.baseContainer, getContainerStyle(), style]} accessibilityRole="alert">
      {(badge || timestamp) && (
        <View style={styles.headerRow}>
          {badge && (
            <View style={badgeStyles.pill}>
              <Text style={badgeStyles.text}>{badge}</Text>
            </View>
          )}
          {timestamp && <Text style={styles.timestampText}>VERIFIED {timestamp}</Text>}
        </View>
      )}
      <Text style={styles.titleText}>{title}</Text>
      {description && <Text style={styles.descriptionText}>{description}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  emergencyContainer: {
    backgroundColor: Colors.emergencyRedDark,
    borderColor: Colors.emergencyRed,
  },
  safetyContainer: {
    backgroundColor: Colors.safetyGreenDark,
    borderColor: Colors.safetyGreenBorder,
  },
  warningContainer: {
    backgroundColor: Colors.warningAmberDark,
    borderColor: Colors.warningAmberBorder,
  },
  neutralContainer: {
    backgroundColor: Colors.surfaceRaised,
    borderColor: Colors.border,
  },
  emergencyPill: {
    backgroundColor: 'rgba(217, 56, 41, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  emergencyPillText: {
    ...Typography.caption,
    color: Colors.emergencyRedText,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontSize: 10,
  },
  safetyPill: {
    backgroundColor: 'rgba(30, 135, 75, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  safetyPillText: {
    ...Typography.caption,
    color: Colors.safetyGreenText,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontSize: 10,
  },
  warningPill: {
    backgroundColor: 'rgba(217, 119, 6, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  warningPillText: {
    ...Typography.caption,
    color: Colors.warningAmberText,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontSize: 10,
  },
  neutralPill: {
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  neutralPillText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '700',
    fontSize: 10,
  },
  timestampText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
  },
  titleText: {
    ...Typography.headline,
    color: Colors.textPrimary,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  descriptionText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 13,
    marginTop: 3,
    lineHeight: 18,
  },
});
