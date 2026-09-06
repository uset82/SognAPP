import React, { ReactNode } from 'react';
import { Platform, StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { BorderRadius, Colors, Elevation, Glass } from '../../constants/theme';

export type GlassTone = 'neutral' | 'mint' | 'alert' | 'nav' | 'warning';
export type GlassGlow = 'none' | 'safe' | 'alert' | 'warning';

interface GlassSurfaceProps {
  children: ReactNode;
  tone?: GlassTone;
  glow?: GlassGlow;
  intensity?: 'soft' | 'strong';
  radius?: number;
  style?: ViewStyle;
}

const TONE_FILL: Record<GlassTone, string> = {
  neutral: Colors.glassFill,
  mint: Colors.glassFillMint,
  alert: Colors.glassFillAlert,
  nav: Colors.glassFillNav,
  warning: Colors.glassFillWarning,
};

const EDGE: Record<GlassGlow, string> = {
  none: Colors.hairlineRing,
  safe: Colors.edgeSafe,
  alert: Colors.edgeAlert,
  warning: Colors.edgeWarning,
};

export const GlassSurface: React.FC<GlassSurfaceProps> = ({
  children,
  tone = 'neutral',
  glow = 'none',
  intensity = 'soft',
  radius = BorderRadius.card,
  style,
}) => {
  const glowStyle =
    glow === 'safe'
      ? Elevation.glowSafe
      : glow === 'alert'
        ? Elevation.glowAlert
        : glow === 'warning'
          ? Elevation.glowWarning
          : Elevation.shadowMd;

  const fill = TONE_FILL[tone];
  const onColor = tone === 'alert' || tone === 'nav';
  const blur = intensity === 'strong' ? Glass.blurStrong : Glass.blurSoft;

  return (
    <View style={[styles.lift, glowStyle, style]}>
      <View
        style={[
          styles.shell,
          {
            borderRadius: radius,
            borderColor: EDGE[glow],
          },
        ]}
      >
        <BlurView
          intensity={blur}
          tint={onColor ? 'dark' : 'light'}
          style={StyleSheet.absoluteFill}
        />
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: fill,
              ...(Platform.OS === 'web'
                ? ({
                    backdropFilter: `saturate(160%) blur(${blur}px)`,
                    WebkitBackdropFilter: `saturate(160%) blur(${blur}px)`,
                  } as ViewStyle)
                : null),
            },
          ]}
        />
        <LinearGradient
          pointerEvents="none"
          colors={[
            onColor ? 'rgba(255,255,255,0.34)' : 'rgba(255,255,255,0.95)',
            'rgba(255,255,255,0.08)',
            'transparent',
          ]}
          style={styles.specular}
        />
        <LinearGradient
          pointerEvents="none"
          colors={
            glow === 'safe'
              ? ['transparent', 'rgba(27, 94, 54, 0.12)']
              : glow === 'alert'
                ? ['transparent', 'rgba(80, 8, 6, 0.18)']
                : glow === 'warning'
                  ? ['transparent', 'rgba(217, 119, 6, 0.1)']
                  : ['transparent', 'rgba(17, 24, 39, 0.04)']
          }
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  lift: {
    backgroundColor: 'transparent',
  },
  shell: {
    overflow: 'hidden',
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
  specular: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 28,
  },
  content: {
    position: 'relative',
  },
});
