/**
 * SOGN SAFE Design Tokens
 * 
 * Visual direction:
 * - Scandinavian civic design
 * - Calm, trustworthy, robust, understated, public-service feeling
 * - High contrast, accessible minimum touch targets (>= 48px)
 * - Clear semantic role separation: Safety Green vs Emergency Red vs Restrained Amber
 */

export const Colors = {
  // Neutral Canvas & Surfaces (Nightglass & Astra Metallic Tokens)
  canvas: '#080B0F',
  surface: '#0F151E',
  surfaceRaised: '#151C28',
  surfaceSubtle: '#1C2534',
  carbonPlate: '#0B0F15',
  border: 'rgba(255, 255, 255, 0.09)',
  borderLight: 'rgba(255, 255, 255, 0.16)',
  borderSubtle: 'rgba(255, 255, 255, 0.04)',
  specularTop: 'rgba(255, 255, 255, 0.20)',

  // Astra Metallic Steel Palette
  metalHighlight: '#F8FAFC',
  metalPrimary: '#E2E8F0',
  metalSecondary: '#94A3B8',
  metalShadow: '#475569',
  metalEdge: 'rgba(203, 213, 225, 0.25)',

  // Text Hierarchy
  textPrimary: '#FFFFFF',
  textSecondary: '#CBD5E1',
  textMuted: '#7E8B9B',
  textFaint: '#475569',
  textOnColor: '#FFFFFF',

  // Semantic Emergency Palette
  emergencyRed: '#EF4444',
  emergencyRedDark: '#2B1113',
  emergencyRedBorder: '#F87171',
  emergencyRedText: '#FCA5A5',

  // Safety / Normal State (High-grade Emerald)
  safetyGreen: '#10B981',
  safetyGreenDark: '#0B2418',
  safetyGreenBorder: '#059669',
  safetyGreenText: '#6EE7B7',

  // Warning / Degraded Connectivity
  warningAmber: '#F59E0B',
  warningAmberDark: '#2B1B09',
  warningAmberBorder: '#D97706',
  warningAmberText: '#FDE68A',

  // Accent / Map & Navigation
  fjordTeal: '#0284C7',
  fjordTealLight: '#38BDF8',
  routeBlue: '#38BDF8',
  routeBlueDark: '#082F49',
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
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  title1: {
    fontSize: 26,
    fontWeight: '700' as const,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  title2: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 26,
  },
  headline: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  subhead: {
    fontSize: 14,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
  caption: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.5,
  },
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};
