import React, { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Touch, Typography } from '../../constants/theme';
import { AppModal } from './AppModal';

interface GlassModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  category?: string;
  closeLabel: string;
  children: ReactNode;
}

export const GlassModal: React.FC<GlassModalProps> = ({
  visible,
  onClose,
  title,
  category,
  closeLabel,
  children,
}) => (
  <AppModal visible={visible} onClose={onClose}>
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.handle} />
        <View style={styles.titleRow}>
          <View style={styles.titleCol}>
            {category ? <Text style={styles.category}>{category}</Text> : null}
            <Text style={styles.title}>{title}</Text>
          </View>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel={closeLabel}
          >
            <Text style={styles.closeText}>{closeLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {children}
    </View>
  </AppModal>
);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.hairlineRing,
  },
  handle: {
    alignSelf: 'center',
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleCol: {
    flex: 1,
  },
  category: {
    ...Typography.meta,
    color: Colors.safetyGreen,
    marginBottom: 4,
  },
  title: {
    ...Typography.title2,
    color: Colors.textPrimary,
  },
  closeBtn: {
    minHeight: Touch.minTarget,
    minWidth: Touch.minTarget,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  closeText: {
    ...Typography.subhead,
    color: Colors.safetyGreen,
  },
});
