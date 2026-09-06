import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextStyle } from 'react-native';
import { Colors, Typography } from '../../constants/theme';
import { formatClock, formatRelativeUpdated } from '../../utils/relativeTime';

interface TimestampMetaProps {
  isoTimestamp: string;
  language: 'en' | 'no';
  prefix: string;
  mode?: 'relative' | 'clock' | 'official';
  style?: TextStyle;
}

export const TimestampMeta: React.FC<TimestampMetaProps> = ({
  isoTimestamp,
  language,
  prefix,
  mode = 'relative',
  style,
}) => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((value) => value + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const label =
    mode === 'clock'
      ? `${prefix} · ${formatClock(isoTimestamp)}`
      : mode === 'official'
        ? `${prefix} · ${formatClock(isoTimestamp)}`
        : formatRelativeUpdated(isoTimestamp, language, prefix);

  return <Text style={[styles.meta, style]}>{label}</Text>;
};

const styles = StyleSheet.create({
  meta: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
