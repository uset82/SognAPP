import React, { ReactNode } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Colors } from '../../constants/theme';

const PHONE_WIDTH = 390;
const PHONE_MAX_HEIGHT = 844;
const FRAME_BREAKPOINT = 520;

interface WebAppShellProps {
  children: ReactNode;
}

export const WebAppShell: React.FC<WebAppShellProps> = ({ children }) => {
  const { width, height } = useWindowDimensions();

  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  if (width < FRAME_BREAKPOINT) {
    return <View style={styles.fill}>{children}</View>;
  }

  const frameHeight = Math.min(PHONE_MAX_HEIGHT, Math.max(640, height - 48));

  return (
    <View style={styles.stage}>
      <View style={[styles.phone, { height: frameHeight }]}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
    minHeight: 0,
    height: '100%',
  },
  stage: {
    flex: 1,
    minHeight: 0,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A2320',
    padding: 24,
  },
  phone: {
    width: PHONE_WIDTH,
    maxWidth: '100%',
    borderRadius: 36,
    overflow: 'hidden',
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    shadowColor: '#050A0D',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.45,
    shadowRadius: 40,
  },
});
