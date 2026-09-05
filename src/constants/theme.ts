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
  // Neutral Canvas & Surfaces
  canvas: '#0D0F12',
  surface: '#16191E',
  surfaceRaised: '#1E232A',
  surfaceSubtle: '#252B33',
  border: '#2C333D',
  borderLight: '#3D4653',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0AAB8',
  textMuted: '#6D7886',
  textOnColor: '#FFFFFF',

  // Semantic Emergency Palette
  emergencyRed: '#D93829',
  emergencyRedDark: '#3A1412',
  emergencyRedBorder: '#E65142',
  emergencyRedText: '#FFA197',

  // Safety / Normal State
  safetyGreen: '#1E874B',
  safetyGreenDark: '#122E1F',
  safetyGreenBorder: '#27A860',
  safetyGreenText: '#87E2A9',

  // Warning / Degraded Connectivity
  warningAmber: '#D97706',
  warningAmberDark: '#33200B',
  warningAmberBorder: '#F59E0B',
  warningAmberText: '#FCD34D',

  // Accent / Map & Navigation
  fjordTeal: '#2A5A66',
  fjordTealLight: '#4B8898',
  routeBlue: '#38BDF8',
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
