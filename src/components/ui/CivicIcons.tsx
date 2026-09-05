import React from 'react';
import Svg, { Path, Circle, Rect, Polyline, Line, G, Polygon } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * High-precision Nordic Civic Shield with verified checkmark
 */
export const ReadinessIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#34D399',
  strokeWidth = 1.75,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Polyline
      points="9 12 11 14 15 10"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Topographic Mountain Peak with safe elevation beacon
 */
export const SafePlacesIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#38BDF8',
  strokeWidth = 1.75,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 20h18L13 4l-4 7-3-4-3 13z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="13" cy="9" r="1.5" fill={color} />
  </Svg>
);

/**
 * Radio Tower with Offline Broadcast Waves
 */
export const OfflineInfoIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FDE68A',
  strokeWidth = 1.75,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Line x1="12" y1="2" x2="12" y2="12" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M4.93 4.93a10 10 0 0 1 14.14 0" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Path d="M7.76 7.76a6 6 0 0 1 8.48 0" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Circle cx="12" cy="16" r="2" fill={color} />
    <Line x1="9" y1="22" x2="15" y2="22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Line x1="12" y1="18" x2="12" y2="22" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
  </Svg>
);

/**
 * Dual Language Globe Icon
 */
export const LanguageIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#C6CDD7',
  strokeWidth = 1.75,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M3.6 9h16.8M3.6 15h16.8" stroke={color} strokeWidth={strokeWidth} />
    <Path d="M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9z" stroke={color} strokeWidth={strokeWidth} />
  </Svg>
);

/**
 * Hairline Chevron for navigation rows
 */
export const ChevronRightIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#64748B',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polyline points="9 18 15 12 9 6" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

/**
 * High-visibility Alert Triangle Warning Icon
 */
export const AlertTriangleIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line x1="12" y1="9" x2="12" y2="13" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    <Circle cx="12" cy="17" r="1" fill={color} />
  </Svg>
);

/**
 * Emergency Hotline Phone Icon
 */
export const PhoneCallIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#FFFFFF',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

/**
 * Sensor / Radar Telemetry Reticle Icon
 */
export const RadarReticleIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#38BDF8',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5" strokeDasharray="3,3" />
    <Circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.5" />
    <Circle cx="12" cy="12" r="1.5" fill={color} />
    <Line x1="12" y1="1" x2="12" y2="5" stroke={color} strokeWidth="1.5" />
    <Line x1="12" y1="19" x2="12" y2="23" stroke={color} strokeWidth="1.5" />
    <Line x1="1" y1="12" x2="5" y2="12" stroke={color} strokeWidth="1.5" />
    <Line x1="19" y1="12" x2="23" y2="12" stroke={color} strokeWidth="1.5" />
  </Svg>
);

/**
 * Topographical Compass Indicator
 */
export const CompassIcon: React.FC<IconProps> = ({
  size = 14,
  color = '#8A95A5',
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L15 10H9L12 2Z" fill={color} />
    <Path d="M12 22L9 14H15L12 22Z" fill="#505A68" />
  </Svg>
);
