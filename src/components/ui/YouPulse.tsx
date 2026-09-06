import React, { useEffect } from 'react';
import Animated, {
  useAnimatedProps,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Circle } from 'react-native-svg';
import { Motion } from '../../constants/theme';
import { usePrefersReducedMotion } from '../../utils/reduceMotion';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface YouPulseProps {
  cx: number;
  cy: number;
}

export const YouPulse: React.FC<YouPulseProps> = ({ cx, cy }) => {
  const reduced = usePrefersReducedMotion();
  const opacity = useSharedValue(0.25);

  useEffect(() => {
    if (reduced) {
      opacity.value = 0.2;
      return;
    }
    opacity.value = withRepeat(withTiming(0.05, { duration: Motion.pulseMs }), -1, true);
  }, [opacity, reduced]);

  const animatedProps = useAnimatedProps(() => ({
    opacity: opacity.value,
  }));

  return <AnimatedCircle cx={cx} cy={cy} r="16" fill="rgba(37, 99, 235, 0.35)" animatedProps={animatedProps} />;
};
