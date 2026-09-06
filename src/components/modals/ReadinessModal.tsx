import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BorderRadius, Colors, Spacing, Touch, Typography } from '../../constants/theme';
import { useEmergency } from '../../context/EmergencyContext';
import { AppModal } from '../ui/AppModal';

interface ReadinessModalProps {
  visible: boolean;
  onClose: () => void;
}

interface ChecklistItem {
  id: string;
  titleEn: string;
  titleNo: string;
  descEn: string;
  descNo: string;
}

const READINESS_CHECKLIST: ChecklistItem[] = [
  {
    id: 'water',
    titleEn: '9 Liters of Clean Drinking Water per Person',
    titleNo: '9 liter rent drikkevann per person',
    descEn: 'Covers basic hydration and simple food preparation for 3 full days (DSB standard).',
    descNo: 'Dekker grunnleggende væskebehov og enkel matlaging i 3 døgn (DSB-standard).',
  },
  {
    id: 'food',
    titleEn: '3-Day Non-Perishable Food Supply',
    titleNo: 'Mating for 3 døgn som tåler romtemperatur',
    descEn: 'Canned fish/meat, dried food, crispbread, energy bars, requiring no electric boiling.',
    descNo: 'Hermetikk, tørrmat, knekkebrød og nøtter som kan tilberedes uten strøm.',
  },
  {
    id: 'warmth',
    titleEn: 'Warm Wool Clothing, Blankets & Sleeping Bags',
    titleNo: 'Varme ullklær, pledd og soveposer',
    descEn: 'Fjord valleys experience steep temperature drops when building heating fails.',
    descNo: 'Dype fjorddaler opplever raske temperaturfall ved strømbrudd.',
  },
  {
    id: 'radio',
    titleEn: 'Battery or Hand-Crank DAB+ Radio',
    titleNo: 'Batteridrevet eller opptrekkbar DAB-radio',
    descEn: 'Tune to NRK P1 (96.0 MHz) for official governmental emergency announcements.',
    descNo: 'Lytt til NRK P1 (96,0 MHz) for offisielle beredskapsmeldinger fra myndighetene.',
  },
  {
    id: 'power',
    titleEn: 'Flashlights, Spare Batteries & Charged Powerbanks',
    titleNo: 'Lommelykt, ekstra batterier og ladet nødlader',
    descEn: 'Keep phone charged and avoid unnecessary mobile data usage during blackouts.',
    descNo: 'Hold telefonen ladet og unngå unødvendig databruk ved strømbrudd.',
  },
  {
    id: 'medicine',
    titleEn: 'Essential Prescription Medicines & First Aid Kit',
    titleNo: 'Faste medisiner og førstehjelpsutstyr',
    descEn: 'Bandages, antiseptic wipes, painkillers, and minimum 7 days of personal medication.',
    descNo: 'B bandasjer, sårvask, smertestillende og minst 7 dagers forbruk av faste medisiner.',
  },
  {
    id: 'heat',
    titleEn: 'Alternative Heating & Matches / Gas Stove',
    titleNo: 'Alternativ oppvarming og fyrstikker / stormkjøkken',
    descEn: 'Firewood if fireplace available, or outdoor camping burner in well-ventilated space.',
    descNo: 'Ved til peis eller kokeapparat til utendørs bruk ved svikt i kraftnettet.',
  },
];

export const ReadinessModal: React.FC<ReadinessModalProps> = ({ visible, onClose }) => {
  const { language, t } = useEmergency();
  const isNorwegian = language === 'no';
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    water: true,
    warmth: true,
  });

  useEffect(() => {
    AsyncStorage.getItem('@sogn_safe_readiness')
      .then((stored) => {
        if (stored) {
          setCheckedItems(JSON.parse(stored));
        }
      })
      .catch(() => undefined);
  }, []);

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      AsyncStorage.setItem('@sogn_safe_readiness', JSON.stringify(next)).catch(() => undefined);
      return next;
    });
  };

  const completedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = READINESS_CHECKLIST.length;

  return (
    <AppModal visible={visible} onClose={onClose}>
      <View style={styles.modalRoot}>
        {/* Modal Handle & Header */}
        <View style={styles.header}>
          <View style={styles.handleBar} />
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.modalCategory}>
                {isNorwegian ? 'EGENBEREDSKAP I FLÅM' : 'CIVILIAN PREPAREDNESS'}
              </Text>
              <Text style={styles.modalTitle}>
                {isNorwegian ? '72-timers beredskap' : '72-Hour Readiness Guide'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close readiness guide"
            >
              <Text style={styles.closeBtnText}>{t.closeBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Status Counter */}
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>
                {isNorwegian ? 'Din beredskapsstatus' : 'Your Preparedness Progress'}
              </Text>
              <Text style={styles.progressCount}>
                {completedCount} / {totalCount}
              </Text>
            </View>
            <View style={styles.progressBarTrack}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { width: `${(completedCount / totalCount) * 100}%` }
                ]} 
              />
            </View>
            <Text style={styles.progressHint}>
              {isNorwegian 
                ? 'Norske myndigheter anbefaler at alle husstander kan klare seg selv i tre døgn ved kriser.'
                : 'Norwegian emergency authorities recommend all households be self-sufficient for 3 days.'}
            </Text>
          </View>

          {/* Checklist Items */}
          <View style={styles.listSection}>
            <Text style={styles.sectionHeading}>
              {isNorwegian ? 'ANBEFALT BASISUTSTYR' : 'RECOMMENDED BASIC SUPPLIES'}
            </Text>

            {READINESS_CHECKLIST.map((item) => {
              const isChecked = !!checkedItems[item.id];
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.itemCard, isChecked && styles.itemCardChecked]}
                  onPress={() => toggleItem(item.id)}
                  activeOpacity={0.8}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: isChecked }}
                >
                  <View style={[styles.checkboxBox, isChecked && styles.checkboxBoxChecked]}>
                    {isChecked ? (
                      <View style={styles.checkInnerBadge} />
                    ) : (
                      <View style={styles.checkboxEmpty} />
                    )}
                  </View>
                  <View style={styles.itemContent}>
                    <Text style={styles.itemTitle}>
                      {isNorwegian ? item.titleNo : item.titleEn}
                    </Text>
                    <Text style={styles.itemDesc}>
                      {isNorwegian ? item.descNo : item.descEn}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Real Emergency Numbers Advisory */}
          <View style={styles.emergencyDisclaimerCard}>
            <Text style={styles.disclaimerTitle}>
              {isNorwegian ? 'NØDNUMMER I NORGE (VIRKELIGE HENDELSER)' : 'EMERGENCY NUMBERS IN NORWAY'}
            </Text>
            <View style={styles.numberRow}>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>112</Text>
                <Text style={styles.numberSub}>{isNorwegian ? 'Politi' : 'Police'}</Text>
              </View>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>113</Text>
                <Text style={styles.numberSub}>{isNorwegian ? 'Ambulanse' : 'Ambulance'}</Text>
              </View>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>110</Text>
                <Text style={styles.numberSub}>{isNorwegian ? 'Brann' : 'Fire'}</Text>
              </View>
              <View style={styles.numberBadge}>
                <Text style={styles.numberText}>120</Text>
                <Text style={styles.numberSub}>{isNorwegian ? 'Kystradio' : 'Coast Guard'}</Text>
              </View>
            </View>
            <Text style={styles.disclaimerNote}>
              {isNorwegian
                ? 'SOGN SAFE er en studentprototype (HVL INN524). Ring alltid 112/113 direkte ved akutt livsfare.'
                : 'SOGN SAFE is a student demo prototype (HVL INN524). Always call 112/113 directly in real emergencies.'}
            </Text>
          </View>
        </ScrollView>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  handleBar: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderLight,
    alignSelf: 'center',
    marginBottom: Spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalCategory: {
    ...Typography.meta,
    color: Colors.textSecondary,
    letterSpacing: 1,
    fontSize: 12,
    fontWeight: '700',
  },
  modalTitle: {
    ...Typography.headline,
    color: Colors.textPrimary,
    marginTop: 2,
  },
  closeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.textPrimary,
    minHeight: Touch.minTarget,
    minWidth: Touch.minTarget,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    ...Typography.subhead,
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  progressCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  progressTitle: {
    ...Typography.subhead,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  progressCount: {
    ...Typography.headline,
    color: Colors.safetyGreenText,
    fontWeight: '700',
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.border,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.safetyGreen,
  },
  progressHint: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  listSection: {
    marginBottom: Spacing.xl,
  },
  sectionHeading: {
    ...Typography.subhead,
    color: Colors.textPrimary,
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
    fontWeight: '800',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    minHeight: 64,
  },
  itemCardChecked: {
    borderColor: Colors.safetyGreen,
    backgroundColor: Colors.safetyGreenBg,
  },
  checkboxBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    marginTop: 2,
  },
  checkboxBoxChecked: {
    borderColor: Colors.safetyGreen,
    backgroundColor: Colors.safetyGreen,
  },
  checkboxEmpty: {
    width: 0,
    height: 0,
  },
  checkInnerBadge: {
    width: 10,
    height: 10,
    borderRadius: 2,
    backgroundColor: '#FFFFFF',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    ...Typography.subhead,
    color: Colors.textPrimary,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  itemDesc: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 21,
  },
  emergencyDisclaimerCard: {
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  disclaimerTitle: {
    ...Typography.subhead,
    color: Colors.textPrimary,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: Spacing.sm,
  },
  numberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  numberBadge: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.sm,
    paddingVertical: 8,
    alignItems: 'center',
  },
  numberText: {
    ...Typography.headline,
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  numberSub: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 2,
  },
  disclaimerNote: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
