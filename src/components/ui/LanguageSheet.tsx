import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Language } from '../../constants/translations';
import { Colors, Touch, Typography } from '../../constants/theme';
import { GlassModal } from './GlassModal';
import { CheckCircleSolidIcon } from './CivicIcons';

interface LanguageSheetProps {
  visible: boolean;
  onClose: () => void;
  language: Language;
  onSelect: (language: Language) => void;
  title: string;
  closeLabel: string;
  englishLabel: string;
  norwegianLabel: string;
}

export const LanguageSheet: React.FC<LanguageSheetProps> = ({
  visible,
  onClose,
  language,
  onSelect,
  title,
  closeLabel,
  englishLabel,
  norwegianLabel,
}) => {
  const handleSelect = (next: Language) => {
    onSelect(next);
    onClose();
  };

  return (
    <GlassModal visible={visible} onClose={onClose} title={title} closeLabel={closeLabel}>
      <View style={styles.list}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleSelect('en')}
          accessibilityRole="radio"
          accessibilityState={{ selected: language === 'en' }}
          accessibilityLabel={englishLabel}
        >
          <Text style={styles.optionText}>{englishLabel}</Text>
          {language === 'en' ? <CheckCircleSolidIcon size={22} color={Colors.safetyGreen} /> : null}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleSelect('no')}
          accessibilityRole="radio"
          accessibilityState={{ selected: language === 'no' }}
          accessibilityLabel={norwegianLabel}
        >
          <Text style={styles.optionText}>{norwegianLabel}</Text>
          {language === 'no' ? <CheckCircleSolidIcon size={22} color={Colors.safetyGreen} /> : null}
        </TouchableOpacity>
      </View>
    </GlassModal>
  );
};

const styles = StyleSheet.create({
  list: {
    padding: 20,
    gap: 10,
  },
  option: {
    minHeight: Touch.minTarget,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.hairlineRing,
    backgroundColor: Colors.glassFillStrong,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionText: {
    ...Typography.headline,
    color: Colors.textPrimary,
  },
});
