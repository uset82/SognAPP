import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEmergency } from '../context/EmergencyContext';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { EmergencyButton } from '../components/ui';
import { AlertTriangleIcon } from '../components/ui/CivicIcons';

export default function AlertScreen() {
  const router = useRouter();
  const { incident, isDegradedConnection, language } = useEmergency();
  const isNorwegian = language === 'no';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Emergency Header Bar */}
        <View style={styles.alertHeaderBar}>
          <View style={styles.emergencyPill}>
            <View style={styles.pulseDot} />
            <Text style={styles.emergencyPillText}>
              {isNorwegian ? 'KRITISK SIVILT VARSEL' : 'CRITICAL CIVIC ALERT'}
            </Text>
          </View>

          <View style={styles.deliveryBadges}>
            <View style={styles.deliveryBadge}>
              <Text style={styles.deliveryBadgeText}>HAPTIC</Text>
            </View>
            <View style={styles.deliveryBadge}>
              <Text style={styles.deliveryBadgeText}>SOUND</Text>
            </View>
          </View>
        </View>

        {/* Degraded Connection Banner */}
        {isDegradedConnection && (
          <View style={styles.degradedBanner}>
            <Text style={styles.degradedText}>
              {isNorwegian 
                ? 'BEGRENSET MOBILNETT • VISER LOKAL BUFFER' 
                : 'LIMITED CELLULAR • OPERATING ON LOCAL CACHE'}
            </Text>
          </View>
        )}

        {/* Hero Alert Title */}
        <View style={styles.heroSection}>
          <Text style={styles.alertCategory}>
            {isNorwegian ? 'NØDVARSLING' : 'EMERGENCY ALERT'}
          </Text>
          <Text style={styles.incidentTitle}>
            {isNorwegian 
              ? 'Mulig skipskollisjon ved Flåm kai' 
              : (incident?.title || 'Possible vessel collision near Flåm harbor')}
          </Text>
          <Text style={styles.incidentDesc}>
            {isNorwegian
              ? 'Stort passasjerskip melder om manøvreringssvikt ved innseiling mot Flåm kai.'
              : (incident?.shortDescription || 'Large passenger vessel experiencing maneuvering failure approaching waterfront.')}
          </Text>
        </View>

        {/* Major Affected Area Warning Card */}
        <View style={styles.affectedAreaCard}>
          <View style={styles.affectedHeaderRow}>
            <View style={styles.affectedIconBadge}>
              <AlertTriangleIcon size={18} color="#FFFFFF" />
            </View>
            <View style={styles.affectedTextCol}>
              <Text style={styles.affectedHeading}>
                {isNorwegian ? 'DU ER I BERØRT OMRÅDE' : 'YOU ARE INSIDE THE AFFECTED AREA'}
              </Text>
              <Text style={styles.affectedSub}>
                {isNorwegian 
                  ? 'Sone: Indre Flåm kai og havnebasseng' 
                  : `Zone: ${incident?.affectedZoneName || 'Inner Kai Waterfront Zone A'}`}
              </Text>
            </View>
          </View>

          <View style={styles.instructionBox}>
            <Text style={styles.instructionLead}>
              {isNorwegian ? 'PÅLEGG:' : 'INSTRUCTION:'}
            </Text>
            <Text style={styles.instructionText}>
              {isNorwegian 
                ? 'Forlat havneområdet til fots umiddelbart. Trekk oppover mot Flåm skule.'
                : 'Leave the harbor area now on foot. Proceed uphill toward Flåm School.'}
            </Text>
          </View>

          {/* Risk Window Indicator */}
          <View style={styles.riskWindowRow}>
            <Text style={styles.riskWindowLabel}>
              {isNorwegian ? 'BEREGNET RISIKOVINDU:' : 'ESTIMATED RISK WINDOW:'}
            </Text>
            <Text style={styles.riskWindowValue}>
              {isNorwegian ? '~15 minutter til kaiområdet' : '~15 min until impact perimeter'}
            </Text>
          </View>
        </View>

        {/* Two Dominant Primary Touch Targets */}
        <View style={styles.actionContainer}>
          <EmergencyButton
            title={isNorwegian ? 'GÅ TIL TRYGGESTED' : 'GO TO SAFETY'}
            subtitle={isNorwegian ? 'Flåm skule • 650 m • 8 min gangtid' : 'Flåm School • 650 m • 8 min walk'}
            variant="primary-safety"
            onPress={() => router.push('/safety')}
          />

          <EmergencyButton
            title={isNorwegian ? 'JEG TRENGER HJELP' : 'I NEED HELP'}
            subtitle={isNorwegian ? 'Dersom du er skadet eller innesperret' : 'If injured, trapped, or unable to evacuate'}
            variant="outline-emergency"
            onPress={() => router.push('/help')}
          />
        </View>

        {/* Official Authority Metadata Footer */}
        <View style={styles.footerMeta}>
          <Text style={styles.footerOfficial}>
            {isNorwegian 
              ? 'Offisiell oppdatering · 14:47 · Indre Sogn Beredskapssamvirke' 
              : 'Official update · 14:47 · Inner Sogn Emergency Coordination'}
          </Text>
          <Text style={styles.footerDisclaimer}>
            {isNorwegian 
              ? 'Fiktiv studentprototype (HVL INN524) · Ring 112/113 ved reell livsfare' 
              : 'Fictional student prototype (HVL INN524) · Call 112/113 in real emergencies'}
          </Text>
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
  alertHeaderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  emergencyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.emergencyRedDark,
    borderColor: Colors.emergencyRedBorder,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.emergencyRed,
    marginRight: 8,
  },
  emergencyPillText: {
    ...Typography.caption,
    color: Colors.emergencyRedText,
    fontWeight: '800',
    letterSpacing: 1,
    fontSize: 10,
  },
  deliveryBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  deliveryBadge: {
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.xs,
  },
  deliveryBadgeText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  degradedBanner: {
    backgroundColor: Colors.warningAmberDark,
    borderColor: Colors.warningAmberBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.md,
    alignItems: 'center',
  },
  degradedText: {
    ...Typography.caption,
    color: Colors.warningAmberText,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },
  heroSection: {
    marginBottom: Spacing.lg,
  },
  alertCategory: {
    ...Typography.caption,
    color: Colors.emergencyRed,
    fontWeight: '800',
    letterSpacing: 1.5,
    fontSize: 11,
    marginBottom: 4,
  },
  incidentTitle: {
    ...Typography.title1,
    color: Colors.textPrimary,
    fontWeight: '800',
    fontSize: 24,
    lineHeight: 30,
    marginBottom: Spacing.xs,
  },
  incidentDesc: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  affectedAreaCard: {
    backgroundColor: Colors.emergencyRedDark,
    borderColor: Colors.emergencyRedBorder,
    borderWidth: 1.5,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  affectedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  affectedIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.emergencyRed,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  affectedIcon: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '900',
  },
  affectedTextCol: {
    flex: 1,
  },
  affectedHeading: {
    ...Typography.subhead,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  affectedSub: {
    ...Typography.caption,
    color: Colors.emergencyRedText,
    marginTop: 2,
    fontSize: 11,
  },
  instructionBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  instructionLead: {
    ...Typography.caption,
    color: Colors.emergencyRedText,
    fontWeight: '800',
    letterSpacing: 1,
    fontSize: 10,
    marginBottom: 4,
  },
  instructionText: {
    ...Typography.headline,
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  riskWindowRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.xs,
  },
  riskWindowLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  riskWindowValue: {
    ...Typography.caption,
    color: Colors.warningAmberText,
    fontWeight: '700',
    fontSize: 11,
  },
  actionContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  footerMeta: {
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerOfficial: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
    marginBottom: 2,
  },
  footerDisclaimer: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
  },
});
