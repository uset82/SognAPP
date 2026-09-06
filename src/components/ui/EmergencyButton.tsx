import React, { ReactNode } from 'react';
import { ViewStyle } from 'react-native';
import { CivicButton, CivicButtonVariant } from './CivicButton';

export type ButtonVariant = CivicButtonVariant;

interface EmergencyButtonProps {
  title: string;
  subtitle?: string;
  variant?: ButtonVariant;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: ReactNode;
  showChevron?: boolean;
}

export const EmergencyButton: React.FC<EmergencyButtonProps> = ({
  title,
  subtitle,
  variant = 'primary-safety',
  onPress,
  disabled = false,
  style,
  icon,
  showChevron = false,
}) => (
  <CivicButton
    title={title}
    subtitle={subtitle}
    variant={variant}
    onPress={onPress}
    disabled={disabled}
    style={style}
    icon={icon}
    showChevron={showChevron}
  />
);
