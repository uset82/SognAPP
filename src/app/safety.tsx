import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEmergency } from '../context/EmergencyContext';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { EmergencyButton, TacticalMapSurface } from '../components/ui';

export default function FindSafetyScreen() {
  const router = useRouter();
  const { incident, safeZones, language } = useEmergency();
  const isNorwegian = language === 'no';
  const [selectedZoneIndex, setSelectedZoneIndex] = useState(0);

  const activeZone = safeZones[selectedZoneIndex] || incident?.primarySafeZone;

  const handleNextSafeZone = () => {
    setSelectedZoneIndex((prev) => (prev + 1) % safeZones.length);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Navigation Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Go back to emergency alert"
          >
            <Text style={styles.backText}>‹ {isNorwegian ? 'TILBAKE' : 'BACK'}</Text>
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>
            {isNorwegian ? 'ANBEFALT TILFLUKTSSTED' : 'NEAREST SAFE AREA'}
          </Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Shelter Summary Card */}
        <View style={styles.shelterCard}>
          <View style={styles.statusRow}>
            <View style={styles.confirmedPill}>
              <View style={styles.greenDot} />
              <Text style={styles.confirmedText}>
                {activeZone?.status === 'OPEN_AND_CONFIRMED'
                  ? (isNorwegian ? 'ÅPENT OG BEKREFTET' : 'OPEN AND CONFIRMED')
                  : (isNorwegian ? 'BEREDSKAP' : 'STANDBY')}
              </Text>
            </View>
            <Text style={styles.timeLabel}>
              {isNorwegian ? 'Verifisert' : 'Verified'} {activeZone?.confirmedTimestamp || '14:46'}
            </Text>
          </View>

          <Text style={styles.shelterName}>{activeZone?.name || 'Flåm Skule & Samfunnshus'}</Text>
          <Text style={styles.shelterDesc}>
            {activeZone?.shortDescription || 'Heated civic assembly shelter with first aid station.'}
          </Text>

          <View style={styles.metricGrid}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>
                {activeZone && activeZone.distanceMeters >= 1000
                  ? `${(activeZone.distanceMeters / 1000).toFixed(1)} km`
                  : `${activeZone?.distanceMeters || 650} m`}
              </Text>
              <Text style={styles.metricLabel}>{isNorwegian ? 'AVSTAND' : 'DISTANCE'}</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{activeZone?.walkMinutes || 8} min</Text>
              <Text style={styles.metricLabel}>{isNorwegian ? 'EST. GANGTID' : 'EST. WALK'}</Text>
            </View>
            <View style={styles.metricDivider} />
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>+{activeZone?.elevationMeters || 18} m</Text>
              <Text style={styles.metricLabel}>{isNorwegian ? 'HØYDE OVER HAVET' : 'ELEVATION'}</Text>
            </View>
          </View>

          {/* Cycle Shelter Option */}
          <TouchableOpacity 
            style={styles.cycleShelterBtn}
            onPress={handleNextSafeZone}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Show alternative safe shelter"
          >
            <Text style={styles.cycleShelterBtnText}>
              {isNorwegian ? 'VIS ET ANNET TRYGGESTED ›' : 'SHOW ANOTHER SAFE AREA ›'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Schematic Route Overview Surface */}
        <TacticalMapSurface
          destinationName={activeZone?.name || 'Flåm Skule & Samfunnshus'}
          distanceMeters={activeZone?.distanceMeters || 650}
          walkMinutes={activeZone?.walkMinutes || 8}
          blockedZoneName="Flåm Waterfront Kai 1-3"
          instructionText={
            isNorwegian
              ? 'Ruten leder innover mot Nedre Brekkevegen bort fra flo- og kollisjonsfare ved kaien.'
              : 'Route directs pedestrians inland via Nedre Brekkevegen away from waterfront collision surge.'
          }
        />

        {/* Primary Action Buttons */}
        <View style={styles.actionContainer}>
          <EmergencyButton
            title={isNorwegian ? 'START SIKKER RUTE ›' : 'START SAFE ROUTE ›'}
            subtitle={isNorwegian ? `Veiledning til ${activeZone?.name}` : `Turn-by-turn guidance to ${activeZone?.name}`}
            variant="primary-safety"
            onPress={() => router.push('/evacuate')}
          />

          <EmergencyButton
            title={isNorwegian ? 'JEG TRENGER HJELP' : 'I NEED HELP'}
            subtitle={isNorwegian ? 'Dersom du ikke kan evakuere selv' : 'If unable to evacuate safely'}
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
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    minHeight: 44,
    justifyContent: 'center',
  },
  backText: {
    ...Typography.subhead,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  topBarTitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    letterSpacing: 1,
    fontSize: 10,
  },
  shelterCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.safetyGreenBorder,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  confirmedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.safetyGreenDark,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.safetyGreenText,
    marginRight: 6,
  },
  confirmedText: {
    ...Typography.caption,
    color: Colors.safetyGreenText,
    fontWeight: '700',
    fontSize: 11,
  },
  timeLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
  },
  shelterName: {
    ...Typography.title1,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  shelterDesc: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  metricGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceRaised,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  metricValue: {
    ...Typography.title2,
    color: Colors.textPrimary,
    fontWeight: '800',
  },
  metricLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  cycleShelterBtn: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    alignItems: 'center',
    minHeight: 40,
    justifyContent: 'center',
  },
  cycleShelterBtnText: {
    ...Typography.caption,
    color: Colors.safetyGreenText,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  actionContainer: {
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
});
