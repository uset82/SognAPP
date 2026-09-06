import React, { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';

interface ScreenScrollProps {
  children: ReactNode;
  contentContainerStyle?: ViewStyle;
}

export const ScreenScroll: React.FC<ScreenScrollProps> = ({ children, contentContainerStyle }) => {
  if (Platform.OS === 'web') {
    return <View style={contentContainerStyle}>{children}</View>;
  }

  return (
    <ScrollView
      style={styles.fill}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
