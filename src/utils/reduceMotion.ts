import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export const usePrefersReducedMotion = (): boolean => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (mounted) setReduced(value);
      })
      .catch(() => undefined);

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (value: boolean) => {
        setReduced(value);
      }
    );

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return reduced;
};
