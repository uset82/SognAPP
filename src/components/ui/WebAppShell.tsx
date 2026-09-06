import React, { ReactNode } from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Colors } from '../../constants/theme';

const PHONE_WIDTH = 390;
const FRAME_BREAKPOINT = 720;

interface WebAppShellProps {
  children: ReactNode;
}

export const WebAppShell: React.FC<WebAppShellProps> = ({ children }) => {
  const { width } = useWindowDimensions();

  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  if (width < FRAME_BREAKPOINT) {
    return <View style={styles.mobile}>{children}</View>;
  }

  return (
    <View style={styles.stage}>
      <View style={styles.phone}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  mobile: {
    minHeight: '100%',
    backgroundColor: Colors.canvas,
  },
  stage: {
    minHeight: '100%',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: '#1A2320',
  },
  phone: {
    width: PHONE_WIDTH,
    maxWidth: '100%',
    minHeight: 720,
    borderRadius: 36,
    overflow: 'visible',
    backgroundColor: Colors.canvas,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    shadowColor: '#050A0D',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.45,
    shadowRadius: 40,
  },
});
