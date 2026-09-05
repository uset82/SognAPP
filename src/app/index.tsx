import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEmergency } from '../context/EmergencyContext';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { CalmLocalMapCard } from '../components/ui/CalmLocalMapCard';
import { SognSafeLogo } from '../components/brand';
import { ReadinessModal } from '../components/modals/ReadinessModal';
import { SafePlacesModal } from '../components/modals/SafePlacesModal';
import { OfflineInfoModal } from '../components/modals/OfflineInfoModal';
import {
  ReadinessIcon,
  SafePlacesIcon,
  OfflineInfoIcon,
  LanguageIcon,
  ChevronRightIcon,
} from '../components/ui/CivicIcons';

export default function ReadyScreen() {
  const router = useRouter();
  const { 
    hasActiveIncident, 
    isDegradedConnection, 
    triggerFlamScenario, 
    toggleDegradedConnection,
    language,
    toggleLanguage,
    t,
    safeZones,
    lastSyncTimestamp,
    offlineCacheStatus,
  } = useEmergency();

  const [isReadinessOpen, setIsReadinessOpen] = useState(false);
  const [isSafePlacesOpen, setIsSafePlacesOpen] = useState(false);
  const [isOfflineInfoOpen, setIsOfflineInfoOpen] = useState(false);
  const [isSimulatorExpanded, setIsSimulatorExpanded] = useState(false);

  const handleStartFlåm = () => {
    triggerFlamScenario();
    router.push('/alert');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Scandinavian Public Safety Header */}
        <View style={styles.topBar}>
          <View style={styles.officialPill}>
            <View style={styles.norwayFlagDot} />
            <Text style={styles.officialPillText}>
              {language === 'no' ? 'OFFENTLIG NØDVARSEL' : 'CIVILIAN EMERGENCY SYSTEM'}
            </Text>
          </View>
          <View style={styles.sectorTag}>
            <Text style={styles.sectorTagText}>SECTOR 4-B</Text>
          </View>
        </View>

        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <SognSafeLogo
              size={36}
              variant="small"
              accessibilityLabel={`${t.brandTitle} logo`}
            />
            <View style={styles.brandTitles}>
              <Text style={styles.brandTitle}>{t.brandTitle}</Text>
              <Text style={styles.brandSubtitle}>
                {language === 'no' ? 'INDRE SOGN • FLÅM & AURLAND' : 'INNER SOGN • FLÅM & AURLAND'}
              </Text>
            </View>
          </View>

          {/* Language Toggle Pill */}
          <TouchableOpacity 
            style={styles.langPill} 
            onPress={toggleLanguage}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel={`Toggle language. Current: ${language.toUpperCase()}`}
          >
            <LanguageIcon size={14} color={Colors.textSecondary} />
            <Text style={styles.langText}>
              {language === 'en' ? 'NO / EN' : 'EN / NO'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Degraded Connection Banner */}
        {isDegradedConnection && (
          <View style={styles.degradedBanner} accessible accessibilityRole="alert">
            <View style={styles.degradedHeader}>
              <View style={styles.degradedDot} />
              <Text style={styles.degradedTitle}>{t.limitedConnectionTitle}</Text>
            </View>
            <Text style={styles.degradedSub}>{t.limitedConnectionSub}</Text>
          </View>
        )}

        {/* Luminous Bento SAFE Hero Card */}
        <View style={styles.safeCard} accessible accessibilityRole="summary">
          <View style={styles.safeCardGlowOverlay} />
          
          <View style={styles.safeHeaderRow}>
            <View style={styles.statusPill}>
              <View style={styles.statusPulseDot} />
              <Text style={styles.statusPillText}>{t.allClear}</Text>
            </View>
            <Text style={styles.statusTimestamp}>{lastSyncTimestamp}</Text>
          </View>

          <Text style={styles.safeHeroTitle}>{t.safeTitle}</Text>
          <Text style={styles.safeHeroDesc}>
            {language === 'no' 
              ? 'Ingen aktive hendelser eller nødvarsler i din overvåkede sektor.' 
              : 'No active emergencies in your monitored sector. All municipal safety channels normal.'}
          </Text>

          <View style={styles.locationBar}>
            <Text style={styles.locationLabel}>{t.monitoredZoneLabel}</Text>
            <View style={styles.locationValueRow}>
              <Text style={styles.locationValue}>{t.monitoredZoneValue}</Text>
              <View style={styles.gpsActiveDot} />
            </View>
          </View>
        </View>

        {/* Calm Local Situation Map */}
        <CalmLocalMapCard 
          safeZones={safeZones}
          userLocationName="Flåm Kai / Sentrum"
          statusText={t.normalMaritimeStatus}
          onPressExplore={() => setIsSafePlacesOpen(true)}
        />

        {/* Grouped Civic Utilities */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionLabel}>
            {language === 'no' ? 'BEREDSKAP OG OFFENTLIGE TJENESTER' : 'PREPAREDNESS & CIVILIAN UTILITIES'}
          </Text>

          <View style={styles.groupedListContainer}>
            {/* 1. Emergency Readiness */}
            <TouchableOpacity 
              style={styles.groupedRow} 
              onPress={() => setIsReadinessOpen(true)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={t.readinessTitle}
            >
              <View style={[styles.iconWell, { borderColor: 'rgba(16, 185, 129, 0.3)' }]}>
                <ReadinessIcon size={18} color="#6EE7B7" />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>{t.readinessTitle}</Text>
                <Text style={styles.rowDesc}>{t.readinessSubtitle}</Text>
              </View>
              <ChevronRightIcon size={16} color={Colors.textMuted} />
            </TouchableOpacity>

            <View style={styles.rowDivider} />

            {/* 2. Safe Places */}
            <TouchableOpacity 
              style={styles.groupedRow} 
              onPress={() => setIsSafePlacesOpen(true)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={t.safePlacesTitle}
            >
              <View style={[styles.iconWell, { borderColor: 'rgba(56, 189, 248, 0.3)' }]}>
                <SafePlacesIcon size={18} color="#38BDF8" />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>{t.safePlacesTitle}</Text>
                <Text style={styles.rowDesc}>{t.safePlacesSubtitle}</Text>
              </View>
              <ChevronRightIcon size={16} color={Colors.textMuted} />
            </TouchableOpacity>

            <View style={styles.rowDivider} />

            {/* 3. Offline Information */}
            <TouchableOpacity 
              style={styles.groupedRow} 
              onPress={() => setIsOfflineInfoOpen(true)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={t.offlineInfoTitle}
            >
              <View style={[styles.iconWell, { borderColor: 'rgba(245, 158, 11, 0.3)' }]}>
                <OfflineInfoIcon size={18} color="#FDE68A" />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>{t.offlineInfoTitle}</Text>
                <Text style={styles.rowDesc}>{t.offlineInfoSubtitle}</Text>
              </View>
              <ChevronRightIcon size={16} color={Colors.textMuted} />
            </TouchableOpacity>

            <View style={styles.rowDivider} />

            {/* 4. Language Switch */}
            <TouchableOpacity 
              style={styles.groupedRow} 
              onPress={toggleLanguage}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={t.languageLabel}
            >
              <View style={[styles.iconWell, { borderColor: 'rgba(198, 205, 215, 0.2)' }]}>
                <LanguageIcon size={18} color="#C6CDD7" />
              </View>
              <View style={styles.rowContent}>
                <Text style={styles.rowTitle}>{t.languageLabel}</Text>
                <Text style={styles.rowDesc}>
                  {language === 'en' ? 'Active: English (Switch to Norsk)' : 'Aktivt: Norsk (Bytt til English)'}
                </Text>
              </View>
              <ChevronRightIcon size={16} color={Colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sync & Local Storage Status */}
        <View style={styles.metadataCard}>
          <View style={styles.metaRow}>
            <View style={styles.metaDot} />
            <Text style={styles.metaText}>{offlineCacheStatus}</Text>
          </View>
          <Text style={styles.metaTime}>{lastSyncTimestamp}</Text>
        </View>

        {/* Refined Academic & Demonstration Simulator Drawer */}
        <View style={styles.simulatorSection}>
          <TouchableOpacity 
            style={styles.simulatorHeaderToggle}
            onPress={() => setIsSimulatorExpanded(!isSimulatorExpanded)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Toggle HVL platform simulator controls"
          >
            <View style={styles.simHeaderLeft}>
              <View style={styles.simTagBadge}>
                <Text style={styles.simTagText}>HVL PROTOTYPE</Text>
              </View>
              <Text style={styles.simHeaderTitle}>Demonstration Controls</Text>
            </View>
            <Text style={styles.simToggleText}>
              {isSimulatorExpanded ? 'HIDE ▲' : 'SHOW ▼'}
            </Text>
          </TouchableOpacity>

          {isSimulatorExpanded && (
            <View style={styles.simulatorBody}>
              <Text style={styles.simulatorDesc}>{t.simDesc}</Text>

              <TouchableOpacity 
                style={styles.simulateAlertButton}
                onPress={handleStartFlåm}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Trigger Flåm passenger vessel collision scenario"
              >
                <View style={styles.alertButtonBeacon} />
                <Text style={styles.simulateAlertButtonText}>{t.startScenarioBtn}</Text>
              </TouchableOpacity>

              <View style={styles.simulatorRow}>
                <TouchableOpacity 
                  style={styles.simSecondaryButton}
                  onPress={toggleDegradedConnection}
                  activeOpacity={0.8}
                  accessibilityRole="button"
                  accessibilityLabel="Toggle degraded connection simulation"
                >
                  <Text style={styles.simSecondaryButtonText}>
                    {isDegradedConnection ? t.simRestoreBtn : t.simOfflineBtn}
                  </Text>
                </TouchableOpacity>

                {hasActiveIncident && (
                  <TouchableOpacity 
                    style={[styles.simSecondaryButton, { borderColor: Colors.emergencyRed }]}
                    onPress={() => router.push('/alert')}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel="Navigate to active emergency alert screen"
                  >
                    <Text style={[styles.simSecondaryButtonText, { color: Colors.emergencyRed }]}>
                      {t.viewActiveAlertBtn}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>

        {/* Modals */}
        <ReadinessModal 
          visible={isReadinessOpen} 
          onClose={() => setIsReadinessOpen(false)} 
        />
        <SafePlacesModal 
          visible={isSafePlacesOpen} 
          onClose={() => setIsSafePlacesOpen(false)} 
        />
        <OfflineInfoModal 
          visible={isOfflineInfoOpen} 
          onClose={() => setIsOfflineInfoOpen(false)} 
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
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xxl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingVertical: 2,
  },
  officialPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  norwayFlagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#BA1E29',
  },
  officialPillText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 9,
    letterSpacing: 1,
    fontWeight: '700',
  },
  sectorTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  sectorTagText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingBottom: Spacing.xs,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandTitles: {
    justifyContent: 'center',
  },
  brandTitle: {
    ...Typography.headline,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
    fontWeight: '700',
    fontSize: 18,
  },
  brandSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 9,
    letterSpacing: 0.8,
    fontWeight: '600',
    marginTop: 1,
  },
  langPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    minHeight: 34,
  },
  langText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  degradedBanner: {
    backgroundColor: Colors.warningAmberDark,
    borderColor: Colors.warningAmberBorder,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  degradedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  degradedDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.warningAmber,
  },
  degradedTitle: {
    ...Typography.subhead,
    color: Colors.warningAmberText,
    fontWeight: '700',
    fontSize: 13,
  },
  degradedSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
    lineHeight: 16,
  },
  safeCard: {
    backgroundColor: '#0D1B13',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.35)',
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  safeCardGlowOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(110, 231, 183, 0.3)',
  },
  safeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  statusPulseDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#34D399',
    marginRight: 6,
  },
  statusPillText: {
    ...Typography.caption,
    color: '#6EE7B7',
    fontWeight: '800',
    letterSpacing: 0.5,
    fontSize: 10,
  },
  statusTimestamp: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
  },
  safeHeroTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  safeHeroDesc: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  locationBar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: Spacing.sm,
  },
  locationLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 9,
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  locationValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  locationValue: {
    ...Typography.subhead,
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: 13,
  },
  gpsActiveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  servicesSection: {
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: Spacing.xs,
    fontSize: 10,
    fontWeight: '700',
  },
  groupedListContainer: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  groupedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 14,
    minHeight: 64,
  },
  rowDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginLeft: 58,
  },
  iconWell: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rowContent: {
    flex: 1,
  },
  rowTitle: {
    ...Typography.subhead,
    color: Colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  rowDesc: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
    fontSize: 11,
  },
  metadataCard: {
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metaDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
    marginRight: 6,
  },
  metaText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 11,
  },
  metaTime: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
  },
  simulatorSection: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  simulatorHeaderToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    backgroundColor: Colors.surfaceRaised,
  },
  simHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  simTagBadge: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
  },
  simTagText: {
    ...Typography.caption,
    color: '#F87171',
    fontWeight: '800',
    fontSize: 9,
    letterSpacing: 0.5,
  },
  simHeaderTitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 12,
  },
  simToggleText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
  },
  simulatorBody: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  simulatorDesc: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
    lineHeight: 16,
    fontSize: 11,
  },
  simulateAlertButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.sm,
    minHeight: 48,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  alertButtonBeacon: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  simulateAlertButtonText: {
    ...Typography.headline,
    color: '#FFFFFF',
    fontWeight: '800',
    letterSpacing: 0.8,
    fontSize: 14,
  },
  simulatorRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  simSecondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceRaised,
    minHeight: 42,
  },
  simSecondaryButtonText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: 11,
  },
});
