import React from 'react';
import Svg, { Path, Circle, Rect, Polyline, Line, G } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
}

/**
 * Emergency Readiness / Checklist Icon (Nordic Civic Shield with Tick)
 */
export const ReadinessIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#6EE7B7',
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
 * Safe Assembly Point / Mountain Refuge Icon (High Ground Shelter)
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
 * Offline Safety / Local Cache Broadcast Icon (Radio Wave & Mesh Device)
 */
export const OfflineInfoIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FDE68A',
  strokeWidth = 1.75,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="5"
      y="2"
      width="14"
      height="20"
      rx="3"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Line
      x1="12"
      y1="18"
      x2="12.01"
      y2="18"
      stroke={color}
      strokeWidth={strokeWidth + 0.5}
      strokeLinecap="round"
    />
    <Path
      d="M9 7h6M9 11h6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </Svg>
);

/**
 * Scandinavian Dual Language Globe Icon
 */
export const LanguageIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#C6CDD7',
  strokeWidth = 1.75,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx="12"
      cy="12"
      r="9"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Path
      d="M3.6 9h16.8M3.6 15h16.8"
      stroke={color}
      strokeWidth={strokeWidth}
    />
    <Path
      d="M12 3a15.3 15.3 0 0 1 4 9 15.3 15.3 0 0 1-4 9 15.3 15.3 0 0 1-4-9 15.3 15.3 0 0 1 4-9z"
      stroke={color}
      strokeWidth={strokeWidth}
    />
  </Svg>
);

/**
 * Hairline Chevron for navigation rows
 */
export const ChevronRightIcon: React.FC<IconProps> = ({
  size = 16,
  color = '#505A68',
  strokeWidth = 2,
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Polyline
      points="9 18 15 12 9 6"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
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
    <Path
      d="M12 2L15 10H9L12 2Z"
      fill={color}
    />
    <Path
      d="M12 22L9 14H15L12 22Z"
      fill="#505A68"
    />
  </Svg>
);

/**
 * Civilian GPS Location Pulse Dot
 */
export const CivilianPinIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" fill="rgba(56, 189, 248, 0.2)" />
    <Circle cx="12" cy="12" r="6" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="2" />
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
    <Line
      x1="12"
      y1="9"
      x2="12"
      y2="13"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
    <Circle cx="12" cy="17" r="1" fill={color} />
  </Svg>
);

