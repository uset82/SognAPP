import React, { ReactNode, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { Motion } from '../../constants/theme';
import { usePrefersReducedMotion } from '../../utils/reduceMotion';

interface ScreenEnterProps {
  children: ReactNode;
}

export const ScreenEnter: React.FC<ScreenEnterProps> = ({ children }) => {
  const reduced = usePrefersReducedMotion();
  const opacity = useSharedValue(reduced ? 1 : 0);
  const translateY = useSharedValue(reduced ? 0 : Motion.translateY);

  useEffect(() => {
    if (reduced) {
      opacity.value = 1;
      translateY.value = 0;
      return;
    }
    opacity.value = withTiming(1, { duration: Motion.enterMs });
    translateY.value = withTiming(0, { duration: Motion.enterMs });
  }, [opacity, reduced, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[styles.fill, animatedStyle]}>{children}</Animated.View>;
};

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
