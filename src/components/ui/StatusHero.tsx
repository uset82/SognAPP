import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { GlassSurface, GlassTone, GlassGlow } from './GlassSurface';

type StatusHeroVariant = 'safe' | 'alert' | 'nav';

interface StatusHeroProps {
  variant: StatusHeroVariant;
  title: string;
  subtitle?: string;
  eyebrow?: string;
  icon?: ReactNode;
  footer?: ReactNode;
}

const VARIANT_MAP: Record<StatusHeroVariant, { tone: GlassTone; glow: GlassGlow; titleColor: string }> = {
  safe: { tone: 'mint', glow: 'safe', titleColor: Colors.safetyGreen },
  alert: { tone: 'alert', glow: 'alert', titleColor: Colors.textOnColor },
  nav: { tone: 'nav', glow: 'safe', titleColor: Colors.textOnColor },
};

export const StatusHero: React.FC<StatusHeroProps> = ({
  variant,
  title,
  subtitle,
  eyebrow,
  icon,
  footer,
}) => {
  const visual = VARIANT_MAP[variant];
  const onColor = variant !== 'safe';

  return (
    <GlassSurface tone={visual.tone} glow={visual.glow} intensity="strong" style={styles.wrap}>
      <View style={styles.inner}>
        <View style={styles.top}>
          {icon}
          <View style={styles.textCol}>
            {eyebrow ? (
              <Text style={[styles.eyebrow, { color: onColor ? 'rgba(255,255,255,0.85)' : Colors.safetyGreen }]}>
                {eyebrow}
              </Text>
            ) : null}
            <Text style={[styles.title, variant === 'safe' ? styles.safeTitle : styles.colorTitle, { color: visual.titleColor }]}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={[styles.subtitle, { color: onColor ? Colors.textOnColor : Colors.textSecondary }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
        {footer}
      </View>
    </GlassSurface>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
  },
  inner: {
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 14,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  textCol: {
    flex: 1,
  },
  eyebrow: {
    ...Typography.meta,
    marginBottom: 2,
  },
  title: {
    fontWeight: '800',
  },
  safeTitle: {
    ...Typography.display,
  },
  colorTitle: {
    ...Typography.title2,
    letterSpacing: 0.4,
  },
  subtitle: {
    ...Typography.body,
    marginTop: 3,
  },
});
