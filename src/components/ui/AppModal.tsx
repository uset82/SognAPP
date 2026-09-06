import React, { ReactNode } from 'react';
import { Modal, Platform, StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/theme';

interface AppModalProps {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const AppModal: React.FC<AppModalProps> = ({ visible, onClose, children }) => {
  if (Platform.OS === 'web') {
    if (!visible) {
      return null;
    }

    return (
      <View
        accessibilityViewIsModal
        style={styles.webRoot}
      >
        {children}
      </View>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      {children}
    </Modal>
  );
};

const styles = StyleSheet.create({
  webRoot: {
    position: 'fixed' as unknown as 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 10000,
    backgroundColor: Colors.canvas,
    ...({
      overflowX: 'hidden',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
      overscrollBehavior: 'contain',
    } as any),
  },
});
