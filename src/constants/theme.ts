/**
 * SOGN SAFE — Civic Liquid Glass tokens
 *
 * Light civic emergency system with restrained iOS 26 materials.
 * Frost + hairline specular communicate surface. Semantic glow
 * communicates state only (SAFE / ALERT / WARNING).
 */

export const Colors = {
  canvas: '#E4EBE4',
  canvasWarm: '#F3EFE6',
  canvasMint: '#C9DCCE',
  canvasFjord: '#C5D6E4',
  surface: '#FFFFFF',
  surfaceRaised: '#F3F4F6',
  surfaceSubtle: '#F9FAFB',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderSubtle: '#F9FAFB',
  specularTop: 'rgba(255, 255, 255, 0.8)',

  textPrimary: '#111827',
  textSecondary: '#4B5563',
  textMuted: '#9CA3AF',
  textFaint: '#D1D5DB',
  textOnColor: '#FFFFFF',

  emergencyRed: '#C5221F',
  emergencyRedDark: '#991B1B',
  emergencyRedBorder: '#EF4444',
  emergencyRedText: '#FEE2E2',
  emergencyRedBg: '#FEF2F2',

  safetyGreen: '#1B5E36',
  safetyGreenDark: '#0F3D22',
  safetyGreenBorder: '#D1E7D5',
  safetyGreenText: '#1B5E36',
  safetyGreenBg: '#EDF5EE',

  warningAmber: '#D97706',
  warningAmberDark: '#92400E',
  warningAmberBorder: '#F59E0B',
  warningAmberText: '#B45309',
  warningAmberBg: '#FEF3C7',

  fjordWater: '#A7C7E7',
  fjordWaterDeep: '#7EA6C8',
  fjordTeal: '#2A5A66',
  fjordTealLight: '#38BDF8',
  routeBlue: '#2563EB',
  routeBlueDark: '#1D4ED8',
  routeBlueAura: 'rgba(37, 99, 235, 0.15)',

  glassFill: 'rgba(255, 255, 255, 0.46)',
  glassFillStrong: 'rgba(255, 255, 255, 0.62)',
  glassFillMint: 'rgba(214, 236, 220, 0.58)',
  glassFillAlert: 'rgba(197, 34, 31, 0.88)',
  glassFillNav: 'rgba(27, 94, 54, 0.88)',
  glassFillWarning: 'rgba(255, 236, 179, 0.7)',
  specularHairline: 'rgba(255, 255, 255, 0.92)',
  hairlineRing: 'rgba(255, 255, 255, 0.65)',
  hairlineRingOnColor: 'rgba(255, 255, 255, 0.38)',
  edgeSafe: 'rgba(27, 94, 54, 0.45)',
  edgeAlert: 'rgba(197, 34, 31, 0.55)',
  edgeWarning: 'rgba(217, 119, 6, 0.5)',

  glowSafe: 'rgba(27, 94, 54, 0.38)',
  glowAlert: 'rgba(197, 34, 31, 0.42)',
  glowWarning: 'rgba(217, 119, 6, 0.36)',
};

export const Glass = {
  blurSoft: 22,
  blurStrong: 36,
  fill: Colors.glassFill,
  fillStrong: Colors.glassFillStrong,
  specularHairline: Colors.specularHairline,
  hairlineRing: Colors.hairlineRing,
};

export const Elevation = {
  shadowXs: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  shadowSm: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  shadowMd: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  shadowLg: {
    shadowColor: '#111827',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 8,
  },
  glowSafe: {
    shadowColor: Colors.safetyGreen,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 6,
  },
  glowAlert: {
    shadowColor: Colors.emergencyRed,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.32,
    shadowRadius: 14,
    elevation: 6,
  },
  glowWarning: {
    shadowColor: Colors.warningAmber,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
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
  display: {
    fontSize: 34,
    fontWeight: '800' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
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
  meta: {
    fontSize: 11,
    fontWeight: '600' as const,
    lineHeight: 14,
    letterSpacing: 1.2,
  },
};

export const BorderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  card: 22,
  full: 9999,
};

export const Motion = {
  enterMs: 200,
  pressMs: 180,
  pulseMs: 2400,
  translateY: 8,
};

export const Touch = {
  minTarget: 48,
  primaryCta: 64,
};
