import React from 'react';
import { View } from 'react-native';
import Svg, { Path, Circle, Rect, Polyline, Line, G } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * Green circular badge with white shield and checkmark (Figma Prototype SAFE hero & primary CTA)
 */
export const ShieldCheckBadge: React.FC<{ size?: number; badgeColor?: string; checkColor?: string }> = ({
  size = 48,
  badgeColor = '#1B5E36',
  checkColor = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 48 48" fill="none">
    <Circle cx="24" cy="24" r="24" fill={badgeColor} />
    <Path
      d="M24 12L15 16V23C15 29.5 18.8 35.6 24 37C29.2 35.6 33 29.5 33 23V16L24 12Z"
      stroke={checkColor}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline
      points="20 24 23 27 28 21"
      stroke={checkColor}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Small Shield Check Icon (for inside buttons)
 */
export const ShieldCheckIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L4 5.5V11.5C4 16.5 7.4 21.2 12 22.5C16.6 21.2 20 16.5 20 11.5V5.5L12 2Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline
      points="8.5 12 11 14.5 15.5 9.5"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Soft green circular icon container for list items
 */
export const CircularIconContainer: React.FC<{
  size?: number;
  bgColor?: string;
  children: React.ReactNode;
}> = ({ size = 44, bgColor = '#EBF5EE', children }) => (
  <View
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: bgColor,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    {children}
  </View>
);

/**
 * Clipboard checklist icon (Emergency readiness)
 */
export const ClipboardCheckIcon: React.FC<IconProps> = ({
  size = 22,
  color = '#1B5E36',
  strokeWidth = 1.75,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect
      x="8"
      y="2"
      width="8"
      height="4"
      rx="1"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline
      points="9 13 11 15 15 10"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Safe Places Shelter / Community House Icon
 */
export const ShelterGroupIcon: React.FC<IconProps> = ({
  size = 22,
  color = '#1B5E36',
  strokeWidth = 1.75,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 10L12 3L21 10V20C21 20.55 20.55 21 20 21H4C3.45 21 3 20.55 3 20V10Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="9" cy="14" r="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Circle cx="15" cy="14" r="1.5" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M7.5 18C7.5 16.5 8.5 16 9 16C9.5 16 10.5 16.5 10.5 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Path
      d="M13.5 18C13.5 16.5 14.5 16 15 16C15.5 16 16.5 16.5 16.5 18"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * Open Book / Offline Information Icon
 */
export const BookOpenIcon: React.FC<IconProps> = ({
  size = 22,
  color = '#1B5E36',
  strokeWidth = 1.75,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M2 3H8C10.2 3 12 4.8 12 7V21C12 19.3 10.2 18 8 18H2V3Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M22 3H16C13.8 3 12 4.8 12 7V21C12 19.3 13.8 18 16 18H22V3Z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Globe / Language Selection Icon
 */
export const GlobeGridIcon: React.FC<IconProps> = ({
  size = 22,
  color = '#1B5E36',
  strokeWidth = 1.75,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M3.6 9H20.4M3.6 15H20.4" stroke={color} strokeWidth={strokeWidth} />
    <Path
      d="M12 3C14.5 5.5 15.5 8.5 15.5 12C15.5 15.5 14.5 18.5 12 21C9.5 18.5 8.5 15.5 8.5 12C8.5 8.5 9.5 5.5 12 3Z"
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </Svg>
);

/**
 * Download arrow entering tray (Emergency information downloaded)
 */
export const DownloadCheckIcon: React.FC<IconProps> = ({
  size = 22,
  color = '#1B5E36',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 3V15M12 15L7 10M12 15L17 10" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 17V19C4 20.1 4.9 21 6 21H18C19.1 21 20 20.1 20 19V17" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * Small Checkmark Circle (Verified status)
 */
export const CheckCircleSolidIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 22,
  color = '#1B5E36',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill={color} />
    <Polyline points="8 12 11 15 16 9" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * Location Pin Icon (for Inner Sogn pill)
 */
export const LocationPinIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#4B5563',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="12" cy="9" r="2.5" stroke={color} strokeWidth="2" />
  </Svg>
);

/**
 * Navigation Chevron
 */
export const ChevronRightIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#9CA3AF',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polyline points="9 18 15 12 9 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#9CA3AF',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polyline points="15 18 9 12 15 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * Emergency Warning Triangle
 */
export const AlertTriangleSolidIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 36,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L1 21H23L12 2Z"
      fill={color}
    />
    <Line x1="12" y1="9" x2="12" y2="14" stroke="#C5221F" strokeWidth="2.5" strokeLinecap="round" />
    <Circle cx="12" cy="18" r="1.2" fill="#C5221F" />
  </Svg>
);

/**
 * Vibrate on Icon
 */
export const PhoneVibrateIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#FFFFFF',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="7" y="4" width="10" height="16" rx="2" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M3 8L2 10L3 12L2 14L3 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M21 8L22 10L21 12L22 14L21 16" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

/**
 * Speaker sound on Icon
 */
export const SpeakerSoundIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#FFFFFF',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M11 5L6 9H2V15H6L11 19V5Z" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M15.54 8.46C16.48 9.4 17 10.66 17 12C17 13.34 16.48 14.6 15.54 15.54" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M19.07 4.93C20.95 6.81 22 9.35 22 12C22 14.65 20.95 17.19 19.07 19.07" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

/**
 * First Aid Cross Icon
 */
export const MedicalCrossIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 20,
  color = '#991B1B',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 3H15V9H21V15H15V21H9V15H3V9H9V3Z"
      fill={color}
    />
  </Svg>
);

/**
 * Walking Pedestrian Silhouette
 */
export const WalkingPersonIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#111827',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="13" cy="4" r="2" fill={color} />
    <Path d="M13 7L10 13L13 15L11 22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M10 10L6 12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M13 10L17 12L15 16L18 20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * Clock Icon
 */
export const ClockIcon: React.FC<IconProps> = ({
  size = 24,
  color = '#111827',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    <Polyline points="12 7 12 12 15 14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * Swap / Switch arrows
 */
export const ArrowsSwapIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#4B5563',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M16 3L20 7L16 11" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M4 7H20" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M8 21L4 17L8 13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M20 17H4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

/**
 * Large Upward Navigation Arrow
 */
export const UpArrowNavIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 32,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L5 11H9V21H15V11H19L12 2Z"
      fill={color}
    />
  </Svg>
);

/**
 * Compass Navigation Arrow
 */
export const CompassArrowIcon: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
    <Circle cx="16" cy="16" r="14" fill="#FFFFFF" stroke="#E5E7EB" strokeWidth="1" />
    <Path d="M16 8L20 22L16 18L12 22L16 8Z" fill="#111827" />
  </Svg>
);
