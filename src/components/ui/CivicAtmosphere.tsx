import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/theme';

interface CivicAtmosphereProps {
  children: ReactNode;
  mood?: 'calm' | 'alert';
}

export const CivicAtmosphere: React.FC<CivicAtmosphereProps> = ({
  children,
  mood = 'calm',
}) => (
  <View style={styles.root}>
    <LinearGradient
      colors={
        mood === 'alert'
          ? [Colors.canvasWarm, '#F3E4DE', Colors.canvasMint]
          : [Colors.canvasMint, Colors.canvasWarm, Colors.canvasFjord]
      }
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.95, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
    <View
      pointerEvents="none"
      style={[
        styles.orb,
        styles.orbTop,
        { backgroundColor: mood === 'alert' ? 'rgba(197, 34, 31, 0.16)' : 'rgba(27, 94, 54, 0.18)' },
      ]}
    />
    <View
      pointerEvents="none"
      style={[
        styles.orb,
        styles.orbBottom,
        { backgroundColor: mood === 'alert' ? 'rgba(217, 119, 6, 0.14)' : 'rgba(122, 164, 196, 0.28)' },
      ]}
    />
    {children}
  </View>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    overflow: 'hidden',
  },
  orb: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  orbTop: {
    top: -80,
    right: -60,
  },
  orbBottom: {
    bottom: -90,
    left: -70,
    width: 320,
    height: 320,
    borderRadius: 160,
  },
});
