/**
 * SOGN SAFE Design Tokens
 * 
 * Visual direction:
 * - Official Figma Prototype (Scandinavian Civic Emergency System)
 * - Clean, trustworthy, accessible, light Nordic aesthetic
 * - Paper-white/warm cream canvas (#FBFBFA) with soft sage-green safe tint (#EDF5EE)
 * - Deep forest green (#1B5E36) and high-visibility crimson (#C5221F)
 * - High contrast, accessible touch targets (>= 48px)
 */

export const Colors = {
  // Neutral Canvas & Surfaces (Figma Light Scandinavian Palette)
  canvas: '#FBFBFA',
  surface: '#FFFFFF',
  surfaceRaised: '#F3F4F6',
  surfaceSubtle: '#F9FAFB',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderSubtle: '#F9FAFB',
  specularTop: 'rgba(255, 255, 255, 0.8)',

  // Text Hierarchy
  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  textFaint: '#D1D5DB',
  textOnColor: '#FFFFFF',

  // Semantic Emergency Palette (Figma Crimson Red)
  emergencyRed: '#C5221F',
  emergencyRedDark: '#991B1B',
  emergencyRedBorder: '#EF4444',
  emergencyRedText: '#FEE2E2',
  emergencyRedBg: '#FEF2F2',

  // Safety / Normal State (Figma Forest Green & Mint Tint)
  safetyGreen: '#1B5E36',
  safetyGreenDark: '#0F3D22',
  safetyGreenBorder: '#D1E7D5',
  safetyGreenText: '#1B5E36',
  safetyGreenBg: '#EDF5EE',

  // Warning / Degraded Connectivity (Figma Amber)
  warningAmber: '#D97706',
  warningAmberDark: '#92400E',
  warningAmberBorder: '#F59E0B',
  warningAmberText: '#B45309',
  warningAmberBg: '#FEF3C7',

  // Fjord Cartography & Navigation
  fjordWater: '#A7C7E7',
  fjordWaterDeep: '#7EA6C8',
  fjordTeal: '#2A5A66',
  fjordTealLight: '#38BDF8',
  routeBlue: '#2563EB',
  routeBlueDark: '#1D4ED8',
  routeBlueAura: 'rgba(37, 99, 235, 0.15)',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  fontFamily: 'System',
  hero: {
    fontSize: 34,
    fontWeight: '800' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  title1: {
    fontSize: 24,
    fontWeight: '800' as const,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  title2: {
    fontSize: 20,
    fontWeight: '700' as const,
    lineHeight: 26,
  },
  headline: {
    fontSize: 17,
    fontWeight: '700' as const,
    lineHeight: 22,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 21,
  },
  subhead: {
    fontSize: 14,
    fontWeight: '600' as const,
    lineHeight: 18,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.2,
  },
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 9999,
};
