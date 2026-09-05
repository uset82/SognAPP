import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors, Spacing, Typography, BorderRadius } from '../../constants/theme';
import { useEmergency } from '../../context/EmergencyContext';
import { SafeZone } from '../../types/incident';

interface SafePlacesModalProps {
  visible: boolean;
  onClose: () => void;
}

export const SafePlacesModal: React.FC<SafePlacesModalProps> = ({ visible, onClose }) => {
  const { language, t, safeZones } = useEmergency();
  const isNorwegian = language === 'no';

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={styles.modalRoot}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.handleBar} />
          <View style={styles.titleRow}>
            <View>
              <Text style={styles.modalCategory}>
                {isNorwegian ? 'KOMMUNALE SAMLINGSSTEDER' : 'MUNICIPAL ASSEMBLY ZONES'}
              </Text>
              <Text style={styles.modalTitle}>
                {isNorwegian ? 'Trygge steder i Indre Sogn' : 'Safe Places in Inner Sogn'}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.closeBtn} 
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close safe places modal"
            >
              <Text style={styles.closeBtnText}>{t.closeBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.leadText}>
            {isNorwegian
              ? 'Ved hendelser i havne- eller fjordområdet i Flåm er følgende steder forhåndsdefinert som trygge samlingspunkter avhengig av type fare.'
              : 'During incidents in the harbor or fjord area in Flåm, the following locations are designated safe assembly zones depending on hazard type.'}
          </Text>

          {safeZones.map((zone: SafeZone, index: number) => {
            const isConfirmed = zone.status === 'OPEN_AND_CONFIRMED';
            return (
              <View key={zone.id} style={styles.zoneCard}>
                {/* Zone Header */}
                <View style={styles.zoneHeader}>
                  <View style={styles.numberBadge}>
                    <Text style={styles.numberText}>{index + 1}</Text>
                  </View>
                  <View style={styles.zoneNameCol}>
                    <Text style={styles.zoneName}>{zone.name}</Text>
                    {zone.address && (
                      <Text style={styles.zoneAddress}>{zone.address}</Text>
                    )}
                  </View>
                  <View style={[styles.statusTag, isConfirmed ? styles.statusConfirmed : styles.statusStandby]}>
                    <Text style={[styles.statusTagText, isConfirmed ? styles.statusConfirmedText : styles.statusStandbyText]}>
                      {isConfirmed ? (isNorwegian ? 'BEKREFTET' : 'CONFIRMED') : (isNorwegian ? 'BEREDSKAP' : 'STANDBY')}
                    </Text>
                  </View>
                </View>

                {/* Key Metrics */}
                <View style={styles.metricsRow}>
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>{isNorwegian ? 'AVSTAND' : 'DISTANCE'}</Text>
                    <Text style={styles.metricValue}>
                      {zone.distanceMeters >= 1000 
                        ? `${(zone.distanceMeters / 1000).toFixed(1)} km` 
                        : `${zone.distanceMeters} m`}
                    </Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>{isNorwegian ? 'GANGTID' : 'EST. WALK'}</Text>
                    <Text style={styles.metricValue}>{zone.walkMinutes} min</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>{isNorwegian ? 'HØYDE' : 'ELEVATION'}</Text>
                    <Text style={styles.metricValue}>+{zone.elevationMeters ?? 15} m</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricItem}>
                    <Text style={styles.metricLabel}>{isNorwegian ? 'KAPASITET' : 'CAPACITY'}</Text>
                    <Text style={styles.metricValue}>{zone.capacity ?? 400}</Text>
                  </View>
                </View>

                {/* Description */}
                <Text style={styles.zoneDescription}>{zone.shortDescription}</Text>

                {/* Facilities Badges */}
                {zone.facilities && zone.facilities.length > 0 && (
                  <View style={styles.facilitiesRow}>
                    {zone.facilities.map((facility, fIndex) => (
                      <View key={fIndex} style={styles.facilityPill}>
                        <View style={styles.facilityDot} />
                        <Text style={styles.facilityText}>{facility}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            );
          })}

          <View style={styles.infoCard}>
            <Text style={styles.infoCardTitle}>
              {isNorwegian ? 'RETNINGSLINJER FOR EVAKUERING' : 'EVACUATION DIRECTIVES'}
            </Text>
            <Text style={styles.infoCardText}>
              {isNorwegian
                ? 'Gå alltid til fots opp i terrenget bort fra kaien ved skipsulykker eller brann. Ikke bruk bil på kaiområdet da utrykningskjøretøy trenger fri adkomst.'
                : 'Always proceed on foot uphill away from the waterfront during ship collisions or fires. Avoid personal vehicles near the pier to keep roads clear for first responders.'}
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
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
    ...Typography.caption,
    color: Colors.textMuted,
    letterSpacing: 1,
    fontSize: 10,
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
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  leadText: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: Spacing.md,
  },
  zoneCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  zoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  numberBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  numberText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  zoneNameCol: {
    flex: 1,
  },
  zoneName: {
    ...Typography.subhead,
    color: Colors.textPrimary,
    fontWeight: '700',
  },
  zoneAddress: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  statusConfirmed: {
    backgroundColor: Colors.safetyGreenDark,
  },
  statusStandby: {
    backgroundColor: Colors.surfaceRaised,
  },
  statusTagText: {
    ...Typography.caption,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusConfirmedText: {
    color: Colors.safetyGreenText,
  },
  statusStandbyText: {
    color: Colors.textMuted,
  },
  metricsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceRaised,
    borderRadius: BorderRadius.sm,
    paddingVertical: 8,
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
  },
  metricLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 9,
    letterSpacing: 0.5,
  },
  metricValue: {
    ...Typography.subhead,
    color: Colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 1,
  },
  zoneDescription: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  facilitiesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  facilityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  facilityDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: Colors.safetyGreenText,
    marginRight: 5,
  },
  facilityText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
  },
  infoCard: {
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.sm,
  },
  infoCardTitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
  },
  infoCardText: {
    ...Typography.caption,
    color: Colors.textMuted,
    lineHeight: 18,
  },
});
