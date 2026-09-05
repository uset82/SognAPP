import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEmergency } from '../context/EmergencyContext';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { EmergencyButton } from '../components/ui';

interface NavigationStep {
  stepIndex: number;
  totalSteps: number;
  direction: 'NORTH' | 'LEFT' | 'ARRIVE';
  arrowSymbol: string;
  primaryEn: string;
  primaryNo: string;
  secondaryEn: string;
  secondaryNo: string;
  remainingMeters: number;
  remainingMinutes: number;
}

const EVACUATION_STEPS: NavigationStep[] = [
  {
    stepIndex: 1,
    totalSteps: 2,
    direction: 'NORTH',
    arrowSymbol: '↑',
    primaryEn: 'CONTINUE NORTH',
    primaryNo: 'FORTSETT NORD',
    secondaryEn: 'Follow Nedre Brekkevegen away from the harbor kai',
    secondaryNo: 'Følg Nedre Brekkevegen vekk fra havnekaien',
    remainingMeters: 520,
    remainingMinutes: 6,
  },
  {
    stepIndex: 2,
    totalSteps: 2,
    direction: 'LEFT',
    arrowSymbol: '←',
    primaryEn: 'TURN LEFT INTO FLÅM SKULE',
    primaryNo: 'SVING TIL VENSTRE INN TIL SKOLEN',
    secondaryEn: 'Follow emergency signs to main heated gymnasium shelter',
    secondaryNo: 'Følg skilt inn til oppvarmet samfunnshus og gymsal',
    remainingMeters: 140,
    remainingMinutes: 2,
  },
];

export default function EvacuateScreen() {
  const router = useRouter();
  const { incident, language } = useEmergency();
  const isNorwegian = language === 'no';
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const activeStep = EVACUATION_STEPS[currentStepIndex];

  const handleNextStep = () => {
    if (currentStepIndex < EVACUATION_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      router.push('/safe');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Status Row */}
        <View style={styles.topStatusRow}>
          <View style={styles.guidancePill}>
            <View style={styles.guidanceDot} />
            <Text style={styles.guidancePillText}>
              {isNorwegian ? 'AKTIV EVAKUERINGSRUTE' : 'ACTIVE EVACUATION ROUTE'}
            </Text>
          </View>
          <Text style={styles.stepCounter}>
            {isNorwegian ? 'STEG' : 'STEP'} {activeStep.stepIndex} {isNorwegian ? 'AV' : 'OF'} {activeStep.totalSteps}
          </Text>
        </View>

        {/* Dynamic Hazard Rerouting Alert */}
        {incident?.defaultRoute?.routeStatus === 'HAZARD_REROUTED' && (
          <View style={styles.reroutedBanner}>
            <View style={styles.reroutedDot} />
            <Text style={styles.reroutedText}>
              {isNorwegian
                ? 'RUTE ENDRET: RØYK PÅ KAIEN. FØLG NEDRE BREKKEVEGEN.'
                : 'ROUTE MODIFIED: SMOKE ON KAI. DIVERTING INLAND.'}
            </Text>
          </View>
        )}

        {/* Turn-by-Turn Instruction Banner */}
        <TouchableOpacity 
          style={styles.instructionBanner}
          onPress={handleNextStep}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Next evacuation turn instruction"
        >
          <View style={styles.arrowIconContainer}>
            <Text style={styles.arrowIcon}>{activeStep.arrowSymbol}</Text>
          </View>
          <View style={styles.instructionTextContainer}>
            <Text style={styles.primaryInstruction}>
              {isNorwegian ? activeStep.primaryNo : activeStep.primaryEn}
            </Text>
            <Text style={styles.secondaryInstruction}>
              {isNorwegian ? activeStep.secondaryNo : activeStep.secondaryEn}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Destination Target Box */}
        <View style={styles.targetDestinationBox}>
          <View style={styles.destinationHeader}>
            <Text style={styles.destinationLabel}>
              {isNorwegian ? 'MÅLOMRÅDE (TRYGGESTED)' : 'DESTINATION SHELTER'}
            </Text>
            <Text style={styles.verifiedTime}>
              {isNorwegian ? 'VERIFISERT 14:47' : 'VERIFIED 14:47'}
            </Text>
          </View>

          <Text style={styles.destinationTitle}>
            {incident?.primarySafeZone?.name || 'Flåm Skule & Samfunnshus'}
          </Text>

          <View style={styles.distanceBadgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeValue}>{activeStep.remainingMeters} m</Text>
              <Text style={styles.badgeUnit}>
                {isNorwegian ? 'GJENSTÅENDE' : 'REMAINING'}
              </Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeValue}>{activeStep.remainingMinutes} min</Text>
              <Text style={styles.badgeUnit}>
                {isNorwegian ? 'GANGTID' : 'EST. WALK'}
              </Text>
            </View>
          </View>
        </View>

        {/* Critical Safety Directive: Do NOT Return to Harbor */}
        <View style={styles.dangerAdvisoryCard}>
          <View style={styles.dangerAdvisoryHeader}>
            <View style={styles.dangerIconBadge}>
              <Text style={styles.dangerIcon}>!</Text>
            </View>
            <Text style={styles.dangerAdvisoryTitle}>
              {isNorwegian ? 'SIKKERHETSANBEFALING' : 'SAFETY DIRECTIVE'}
            </Text>
          </View>
          <Text style={styles.dangerAdvisoryText}>
            {isNorwegian
              ? 'Ikke snu tilbake mot kaiområdet eller fjorden. Fortsett oppover i dalen.'
              : 'Do not return toward the waterfront kai. Continue moving inland and uphill.'}
          </Text>
        </View>

        {/* Path Restrictions Overview */}
        <View style={styles.tacticalCard}>
          <Text style={styles.tacticalHeading}>
            {isNorwegian ? 'STATUS PÅ FERDSELSÅRER' : 'PATH RESTRICTIONS'}
          </Text>
          <View style={styles.restrictionRow}>
            <View style={styles.blockedTag}>
              <Text style={styles.blockedTagText}>
                {isNorwegian ? 'SPERRET' : 'BLOCKED'}
              </Text>
            </View>
            <Text style={styles.restrictionText}>
              {isNorwegian ? 'Flåm kaiområde og brygge 1-3 er stengt' : 'Flåm Waterfront Kai 1-3 is closed'}
            </Text>
          </View>
          <View style={styles.restrictionRow}>
            <View style={styles.openTag}>
              <Text style={styles.openTagText}>
                {isNorwegian ? 'ÅPEN' : 'OPEN'}
              </Text>
            </View>
            <Text style={styles.restrictionText}>
              {isNorwegian ? 'Nedre Brekkevegen gangvei åpen' : 'Nedre Brekkevegen pedestrian road open'}
            </Text>
          </View>
        </View>

        {/* Bottom Actions */}
        <View style={styles.actionContainer}>
          <EmergencyButton
            title={isNorwegian ? 'JEG ER TRYGG NÅ' : 'I AM SAFE'}
            subtitle={isNorwegian ? 'Bekreft ankomst ved samlingssted' : 'Confirm arrival at safe shelter'}
            variant="primary-safety"
            onPress={() => router.push('/safe')}
          />

          <EmergencyButton
            title={isNorwegian ? 'JEG TRENGER HJELP' : 'I NEED HELP'}
            subtitle={isNorwegian ? 'Dersom du ikke kan fortsette' : 'If unable to continue evacuation'}
            variant="outline-emergency"
            onPress={() => router.push('/help')}
          />
        </View>
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
  topStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  guidancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceRaised,
    borderColor: Colors.safetyGreenBorder,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: BorderRadius.full,
  },
  guidanceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.safetyGreenText,
    marginRight: 6,
  },
  guidancePillText: {
    ...Typography.caption,
    color: Colors.safetyGreenText,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontSize: 10,
  },
  stepCounter: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
  },
  instructionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 2,
    borderColor: Colors.safetyGreenBorder,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    minHeight: 88,
  },
  arrowIconContainer: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.safetyGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  arrowIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  instructionTextContainer: {
    flex: 1,
  },
  primaryInstruction: {
    ...Typography.title2,
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  secondaryInstruction: {
    ...Typography.subhead,
    color: Colors.textSecondary,
    marginTop: 4,
    fontSize: 12,
    lineHeight: 16,
  },
  targetDestinationBox: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  destinationLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  verifiedTime: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
  },
  destinationTitle: {
    ...Typography.headline,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  distanceBadgeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  badge: {
    flex: 1,
    backgroundColor: Colors.surfaceRaised,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  badgeValue: {
    ...Typography.title2,
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  badgeUnit: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 9,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  dangerAdvisoryCard: {
    backgroundColor: Colors.emergencyRedDark,
    borderWidth: 1,
    borderColor: Colors.emergencyRedBorder,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  dangerAdvisoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dangerIconBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.emergencyRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  dangerIcon: {
    fontSize: 12,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  dangerAdvisoryTitle: {
    ...Typography.caption,
    color: Colors.emergencyRedText,
    fontWeight: '800',
    letterSpacing: 0.5,
    fontSize: 10,
  },
  dangerAdvisoryText: {
    ...Typography.caption,
    color: '#FFFFFF',
    lineHeight: 16,
    fontSize: 12,
  },
  tacticalCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  tacticalHeading: {
    ...Typography.caption,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
    fontSize: 11,
  },
  restrictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  blockedTag: {
    backgroundColor: Colors.emergencyRedDark,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    marginRight: Spacing.sm,
  },
  blockedTagText: {
    ...Typography.caption,
    color: Colors.emergencyRedText,
    fontWeight: '800',
    fontSize: 9,
  },
  openTag: {
    backgroundColor: Colors.safetyGreenDark,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    marginRight: Spacing.sm,
  },
  openTagText: {
    ...Typography.caption,
    color: Colors.safetyGreenText,
    fontWeight: '800',
    fontSize: 9,
  },
  restrictionText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  actionContainer: {
    gap: Spacing.md,
  },
  reroutedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warningAmberDark,
    borderColor: Colors.warningAmberBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  reroutedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.warningAmber,
    marginRight: 8,
  },
  reroutedText: {
    ...Typography.caption,
    color: Colors.warningAmberText,
    fontWeight: '800',
    letterSpacing: 0.5,
    flex: 1,
    fontSize: 10,
  },
});
