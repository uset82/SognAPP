import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEmergency } from '../context/EmergencyContext';
import { HelpCondition } from '../types/incident';
import { conditionLabel } from '../constants/translations';
import { BorderRadius, Colors, Spacing, Touch, Typography } from '../constants/theme';
import { CivicAtmosphere, CivicButton, GlassSurface, ScreenEnter, ScreenScroll } from '../components/ui';

const CONDITIONS: HelpCondition[] = [
  'I_AM_INJURED',
  'I_AM_TRAPPED',
  'I_CANNOT_WALK',
  'I_AM_WITH_PEOPLE_WHO_NEED_HELP',
  'OTHER_URGENT_HELP',
];

export default function HelpScreen() {
  const router = useRouter();
  const { activeHelpRequest, submitHelpRequest, t, civicCoords } = useEmergency();
  const [selectedCondition, setSelectedCondition] = useState<HelpCondition>('I_AM_INJURED');
  const [step, setStep] = useState<'select' | 'confirm'>('select');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendHelp = async () => {
    setIsSubmitting(true);
    await submitHelpRequest(selectedCondition);
    setIsSubmitting(false);
  };

  if (activeHelpRequest) {
    const isAcknowledged = activeHelpRequest.state === 'ACKNOWLEDGED';
    const labels = conditionLabel(activeHelpRequest.condition, t);

    return (
      <SafeAreaView style={styles.safeArea}>
        <CivicAtmosphere mood="alert">
        <ScreenEnter>
          <ScreenScroll contentContainerStyle={styles.container}>
            <GlassSurface tone={isAcknowledged ? 'mint' : 'neutral'} glow={isAcknowledged ? 'safe' : 'none'}>
              <View style={styles.statusBox}>
                <Text style={styles.statusHeadline}>
                  {isAcknowledged ? t.helpAcknowledged : t.helpReceived}
                </Text>
                <Text style={styles.statusExplanation}>
                  {isAcknowledged ? t.helpAcknowledgedBody : t.helpReceivedBody}
                </Text>
                <View style={styles.details}>
                  <Text style={styles.detailLabel}>{t.reportedCondition}</Text>
                  <Text style={styles.detailValue}>{labels.title}</Text>
                  <Text style={styles.detailLabel}>{t.locationTransmitted}</Text>
                  <Text style={styles.detailValue}>{activeHelpRequest.approximateLocation.name}</Text>
                  <Text style={styles.detailLabel}>{t.transmissionTime}</Text>
                  <Text style={styles.detailValue}>{activeHelpRequest.timestamp}</Text>
                  <Text style={styles.detailLabel}>{t.deviceId}</Text>
                  <Text style={styles.detailValue}>{activeHelpRequest.deviceId}</Text>
                </View>
                <Text style={styles.caution}>{t.staySheltered}</Text>
              </View>
            </GlassSurface>
            <CivicButton
              title={t.returnToGuidance}
              variant="outline-neutral"
              onPress={() => router.back()}
              style={styles.topGap}
            />
          </ScreenScroll>
        </ScreenEnter>
        </CivicAtmosphere>
      </SafeAreaView>
    );
  }

  const selectedLabels = conditionLabel(selectedCondition, t);

  return (
    <SafeAreaView style={styles.safeArea}>
      <CivicAtmosphere mood="alert">
      <ScreenEnter>
        <ScreenScroll contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => (step === 'confirm' ? setStep('select') : router.back())}
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel={t.cancelBtn}
            >
              <Text style={styles.backText}>‹ {step === 'confirm' ? t.continueBtn : t.cancelBtn}</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{t.helpTitle}</Text>
            <View style={styles.headerSpacer} />
          </View>

          {step === 'select' ? (
            <>
              <Text style={styles.heading}>{t.selectCondition}</Text>
              <Text style={styles.sub}>{t.selectConditionSub}</Text>
              <View style={styles.options}>
                {CONDITIONS.map((id) => {
                  const labels = conditionLabel(id, t);
                  const isSelected = selectedCondition === id;
                  return (
                    <TouchableOpacity
                      key={id}
                      style={[styles.option, isSelected && styles.optionSelected]}
                      onPress={() => setSelectedCondition(id)}
                      activeOpacity={0.8}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: isSelected }}
                      accessibilityLabel={labels.title}
                    >
                      <View style={styles.radioOuter}>
                        {isSelected ? <View style={styles.radioInner} /> : null}
                      </View>
                      <View style={styles.optionText}>
                        <Text style={[styles.optionLabel, isSelected && styles.optionLabelOn]}>
                          {labels.title}
                        </Text>
                        <Text style={styles.optionSub}>{labels.subtitle}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <CivicButton title={t.continueBtn} variant="primary-emergency" onPress={() => setStep('confirm')} />
            </>
          ) : (
            <>
              <Text style={styles.heading}>{t.confirmLocationTitle}</Text>
              <Text style={styles.sub}>{t.confirmLocationSub}</Text>
              <GlassSurface tone="neutral">
                <View style={styles.disclosure}>
                  <Text style={styles.disclosureTitle}>{t.dataToTransmit}</Text>
                  <Text style={styles.disclosureItem}>
                    • {t.selectedCondition} {selectedLabels.title}
                  </Text>
                  <Text style={styles.disclosureItem}>
                    • {t.approxLocation} Flåm Kai / Sentrum
                  </Text>
                  <Text style={styles.disclosureItem}>
                    • {t.locationAccuracy}: ± 25–80 m
                  </Text>
                  <Text style={styles.disclosureItem}>
                    • {civicCoords.latitude.toFixed(4)}, {civicCoords.longitude.toFixed(4)}
                  </Text>
                  <Text style={styles.disclosureItem}>• {t.timestampAndDevice}</Text>
                </View>
              </GlassSurface>
              <CivicButton
                title={isSubmitting ? t.transmitting : t.sendMyLocation}
                subtitle={t.confirmLocationSub}
                variant="primary-emergency"
                onPress={handleSendHelp}
                disabled={isSubmitting}
                style={styles.topGap}
              />
              <CivicButton
                title={t.cancelBtn}
                variant="outline-neutral"
                onPress={() => setStep('select')}
                style={styles.topGap}
              />
            </>
          )}
        </ScreenScroll>
      </ScreenEnter>
      </CivicAtmosphere>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  container: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  backButton: {
    minHeight: Touch.minTarget,
    justifyContent: 'center',
  },
  backText: {
    ...Typography.subhead,
    color: Colors.safetyGreen,
  },
  headerTitle: {
    ...Typography.headline,
    color: Colors.textPrimary,
  },
  headerSpacer: {
    width: 44,
  },
  heading: {
    ...Typography.title2,
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  sub: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  options: {
    gap: 10,
    marginBottom: 20,
  },
  option: {
    minHeight: Touch.minTarget,
    borderRadius: BorderRadius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.hairlineRing,
    backgroundColor: Colors.glassFillStrong,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  optionSelected: {
    backgroundColor: Colors.safetyGreen,
    borderColor: Colors.safetyGreen,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.textOnColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textOnColor,
  },
  optionText: {
    flex: 1,
  },
  optionLabel: {
    ...Typography.headline,
    color: Colors.textPrimary,
  },
  optionLabelOn: {
    color: Colors.textOnColor,
  },
  optionSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  disclosure: {
    padding: 16,
    gap: 6,
  },
  disclosureTitle: {
    ...Typography.meta,
    color: Colors.safetyGreen,
    marginBottom: 6,
  },
  disclosureItem: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  statusBox: {
    padding: 20,
    gap: 12,
  },
  statusHeadline: {
    ...Typography.title2,
    color: Colors.safetyGreen,
  },
  statusExplanation: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  details: {
    gap: 4,
  },
  detailLabel: {
    ...Typography.meta,
    color: Colors.textMuted,
    marginTop: 8,
  },
  detailValue: {
    ...Typography.subhead,
    color: Colors.textPrimary,
  },
  caution: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 8,
  },
  topGap: {
    marginTop: 12,
  },
});
