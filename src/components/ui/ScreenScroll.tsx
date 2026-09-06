import React, { ReactNode } from 'react';
import { Platform, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';

interface ScreenScrollProps {
  children: ReactNode;
  contentContainerStyle?: ViewStyle;
}

export const ScreenScroll: React.FC<ScreenScrollProps> = ({ children, contentContainerStyle }) => {
  if (Platform.OS === 'web') {
    return (
      <View style={[styles.webScroll, contentContainerStyle]}>
        {children}
      </View>
    );
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
  webScroll: {
    flex: 1,
    minHeight: 0,
    height: '100%',
    overflow: 'scroll',
    // RN-web maps these to CSS so iPhone Safari can actually pan the page.
    ...({
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      overscrollBehavior: 'contain',
    } as ViewStyle),
  },
});
