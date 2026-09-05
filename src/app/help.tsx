import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEmergency } from '../context/EmergencyContext';
import { HelpCondition } from '../types/incident';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { EmergencyButton } from '../components/ui';

interface ConditionOption {
  id: HelpCondition;
  labelEn: string;
  labelNo: string;
  subEn: string;
  subNo: string;
}

const CONDITION_OPTIONS: ConditionOption[] = [
  { 
    id: 'I_AM_INJURED', 
    labelEn: 'I AM INJURED', 
    labelNo: 'JEG ER SKADET',
    subEn: 'Need immediate medical first aid',
    subNo: 'Trenger akutt medisinsk førstehjelp'
  },
  { 
    id: 'I_AM_TRAPPED', 
    labelEn: 'I AM TRAPPED', 
    labelNo: 'JEG ER INNESPERRET',
    subEn: 'Cannot exit building, vehicle, or vessel',
    subNo: 'Kan ikke forlate bygg, kjøretøy eller kai'
  },
  { 
    id: 'I_CANNOT_WALK', 
    labelEn: 'I CANNOT WALK', 
    labelNo: 'JEG KAN IKKE GÅ',
    subEn: 'Mobility impaired or physical obstruction',
    subNo: 'Nedsatt bevegelighet eller fysisk hindring'
  },
  { 
    id: 'I_AM_WITH_PEOPLE_WHO_NEED_HELP', 
    labelEn: 'WITH OTHERS NEEDING HELP', 
    labelNo: 'MED ANDRE SOM TRENGER HJELP',
    subEn: 'Children, elderly, or severely injured persons present',
    subNo: 'Barn, eldre eller alvorlig skadde til stede'
  },
  { 
    id: 'OTHER_URGENT_HELP', 
    labelEn: 'OTHER URGENT ASSISTANCE', 
    labelNo: 'ANNEN AKUTT BISTAND',
    subEn: 'Emergency hazard preventing evacuation',
    subNo: 'Akutt fare som hindrer trygg evakuering'
  },
];

export default function HelpScreen() {
  const router = useRouter();
  const { activeHelpRequest, submitHelpRequest, language } = useEmergency();
  const isNorwegian = language === 'no';
  const [selectedCondition, setSelectedCondition] = useState<HelpCondition>('I_AM_INJURED');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendHelp = async () => {
    setIsSubmitting(true);
    await submitHelpRequest(selectedCondition);
    setIsSubmitting(false);
  };

  // Screen 05 / RESCUE SIGNAL TRANSMITTED OR ACKNOWLEDGED
  if (activeHelpRequest) {
    const isAcknowledged = activeHelpRequest.state === 'ACKNOWLEDGED';

    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.statusBox}>
            <View style={[styles.statusIconCircle, isAcknowledged && { backgroundColor: Colors.safetyGreen }]}>
              <View style={[styles.statusInnerDot, isAcknowledged && styles.statusInnerDotActive]} />
            </View>

            <Text style={styles.statusHeadline}>
              {isAcknowledged
                ? (isNorwegian ? 'NØDSIGNAL BEKREFTET MOTTATT' : 'HELP REQUEST ACKNOWLEDGED')
                : (isNorwegian ? 'NØDSIGNAL OVERFØRT' : 'HELP REQUEST TRANSMITTED')}
            </Text>

            <Text style={styles.statusExplanation}>
              {isAcknowledged
                ? (isNorwegian
                    ? 'Ditt signal er registrert av beredskapsledelsen i Indre Sogn. Redningsmannskaper har dine koordinater.'
                    : 'Your signal has been registered by emergency dispatchers in Inner Sogn. Rescue teams have your approximate coordinates.')
                : (isNorwegian
                    ? 'Ditt signal er formidlet til simulatorsentralen. Venter på bekreftelse fra operatør...'
                    : 'Your signal has reached the simulator dispatcher. Awaiting responder confirmation...')}
            </Text>

            <View style={styles.detailsCard}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {isNorwegian ? 'RAPPORTERT TILSTAND:' : 'REPORTED CONDITION:'}
                </Text>
                <Text style={styles.detailValue}>{activeHelpRequest.condition.replace(/_/g, ' ')}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {isNorwegian ? 'SENDT POSISJON:' : 'LOCATION TRANSMITTED:'}
                </Text>
                <Text style={styles.detailValue}>{activeHelpRequest.approximateLocation.name}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {isNorwegian ? 'TIDSPUNKT:' : 'TRANSMISSION TIME:'}
                </Text>
                <Text style={styles.detailValue}>{activeHelpRequest.timestamp}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {isNorwegian ? 'ENHETS-ID:' : 'DEVICE ID:'}
                </Text>
                <Text style={styles.detailValue}>{activeHelpRequest.deviceId}</Text>
              </View>
            </View>

            <Text style={styles.cautionNotice}>
              {isNorwegian
                ? 'Bli på et trygt sted skjermet for røyk og bølger. Ved akutt forverring, ring 113 direkte.'
                : 'Stay in a sheltered location away from hazards. If your condition worsens, call 113 directly.'}
            </Text>
          </View>

          <EmergencyButton
            title={isNorwegian ? 'TILBAKE TIL VEILEDNING' : 'RETURN TO GUIDANCE'}
            subtitle={isNorwegian ? 'Hold telefonen tilgjengelig' : 'Keep phone available'}
            variant="outline-neutral"
            onPress={() => router.back()}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()} 
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Cancel help request"
          >
            <Text style={styles.backText}>‹ {isNorwegian ? 'AVBRYT' : 'CANCEL'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {isNorwegian ? 'NØDSIGNAL' : 'RESCUE SIGNAL'}
          </Text>
          <View style={{ width: 44 }} />
        </View>

        <Text style={styles.screenHeading}>
          {isNorwegian ? 'VELG DIN SITUASJON' : 'SELECT YOUR CONDITION'}
        </Text>
        <Text style={styles.screenSub}>
          {isNorwegian
            ? 'Beredskapsmannskaper prioriterer innsats basert på tilstanden du velger under.'
            : 'Emergency services prioritize resources based on the condition selected below.'}
        </Text>

        {/* Condition Selector */}
        <View style={styles.optionList}>
          {CONDITION_OPTIONS.map((opt) => {
            const isSelected = selectedCondition === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => setSelectedCondition(opt.id)}
                activeOpacity={0.8}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
              >
                <View style={styles.radioOuter}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
                <View style={styles.optionTextContainer}>
                  <Text style={[styles.optionLabel, isSelected && { color: '#FFFFFF' }]}>
                    {isNorwegian ? opt.labelNo : opt.labelEn}
                  </Text>
                  <Text style={styles.optionSub}>
                    {isNorwegian ? opt.subNo : opt.subEn}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Telemetry Disclosure Box */}
        <View style={styles.disclosureBox}>
          <Text style={styles.disclosureTitle}>
            {isNorwegian ? 'DATA SOM BLIR TRANSMITTERT:' : 'DATA TO BE TRANSMITTED:'}
          </Text>
          <Text style={styles.disclosureItem}>
            • {isNorwegian ? 'Valgt tilstand:' : 'Selected condition:'} {selectedCondition.replace(/_/g, ' ')}
          </Text>
          <Text style={styles.disclosureItem}>
            • {isNorwegian ? 'Omtrentlig posisjon:' : 'Approximate location:'} Flåm Kai / Sentrum
          </Text>
          <Text style={styles.disclosureItem}>
            • {isNorwegian ? 'Verifisert tidsstempel og enhets-ID' : 'Verified timestamp & device identifier'}
          </Text>
        </View>

        {/* Primary Transmit Button */}
        <EmergencyButton
          title={isSubmitting 
            ? (isNorwegian ? 'SENDER SIGNAL...' : 'TRANSMITTING SIGNAL...') 
            : (isNorwegian ? 'SEND NØDSIGNAL' : 'SEND HELP SIGNAL')}
          subtitle={isNorwegian ? 'Omtrentlig posisjon vil bli delt' : 'Approximate coordinates will be shared'}
          variant="primary-emergency"
          onPress={handleSendHelp}
          disabled={isSubmitting}
        />
      </ScrollView>
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
    paddingVertical: 6,
    minHeight: 44,
    justifyContent: 'center',
  },
  backText: {
    ...Typography.subhead,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  headerTitle: {
    ...Typography.caption,
    color: Colors.emergencyRedText,
    fontWeight: '800',
    letterSpacing: 1,
    fontSize: 10,
  },
  screenHeading: {
    ...Typography.title1,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  screenSub: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    fontSize: 13,
    lineHeight: 18,
  },
  optionList: {
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    minHeight: 64,
  },
  optionCardSelected: {
    borderColor: Colors.emergencyRed,
    backgroundColor: Colors.emergencyRedDark,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.emergencyRed,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionLabel: {
    ...Typography.headline,
    color: Colors.textPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  optionSub: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
    fontSize: 11,
  },
  disclosureBox: {
    backgroundColor: Colors.surfaceRaised,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disclosureTitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '700',
    marginBottom: 6,
    fontSize: 10,
  },
  disclosureItem: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: 3,
    fontSize: 11,
  },
  statusBox: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  statusIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.emergencyRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  statusInnerDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  statusInnerDotActive: {
    backgroundColor: Colors.safetyGreenText,
  },
  statusHeadline: {
    ...Typography.title1,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
    fontSize: 20,
  },
  statusExplanation: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
    fontSize: 13,
  },
  detailsCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  detailRow: {
    marginBottom: Spacing.sm,
  },
  detailLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
  },
  detailValue: {
    ...Typography.subhead,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginTop: 2,
    fontSize: 13,
  },
  cautionNotice: {
    ...Typography.caption,
    color: Colors.warningAmberText,
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: Spacing.md,
    fontSize: 11,
  },
});
