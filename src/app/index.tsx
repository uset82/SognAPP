import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
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
  PhoneCallIcon,
  RadarReticleIcon,
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

  const isNorwegian = language === 'no';
  const [isReadinessOpen, setIsReadinessOpen] = useState(false);
  const [isSafePlacesOpen, setIsSafePlacesOpen] = useState(false);
  const [isOfflineInfoOpen, setIsOfflineInfoOpen] = useState(false);
  const [isSimulatorExpanded, setIsSimulatorExpanded] = useState(false);

  const handleStartFlåm = () => {
    triggerFlamScenario();
    router.push('/alert');
  };

  const handleCallEmergency = (number: string) => {
    Linking.openURL(`tel:${number}`).catch(() => {});
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Civic Authority Navigation Bar */}
        <View style={styles.topNavigation}>
          <View style={styles.topNavLeft}>
            <View style={styles.norwayPill}>
              <View style={styles.flagDotRed} />
              <View style={styles.flagDotBlue} />
              <Text style={styles.norwayPillText}>SIVILFORSVARET • INDRE SOGN</Text>
            </View>
          </View>
          
          <View style={styles.topNavRight}>
            <View style={styles.signalBadge}>
              <View style={styles.signalDot} />
              <Text style={styles.signalText}>5G SIKRET</Text>
            </View>

            {/* Segmented Language Selector */}
            <TouchableOpacity 
              style={styles.langSegment} 
              onPress={toggleLanguage}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`Bytt språk. Nåværende: ${language.toUpperCase()}`}
            >
              <Text style={[styles.langText, isNorwegian && styles.langActiveText]}>NO</Text>
              <Text style={styles.langDivider}>|</Text>
              <Text style={[styles.langText, !isNorwegian && styles.langActiveText]}>EN</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Brand Crest & District Identity */}
        <View style={styles.brandHeader}>
          <View style={styles.brandCrestRow}>
            <SognSafeLogo
              size={40}
              variant="small"
              accessibilityLabel={`${t.brandTitle} logo`}
            />
            <View style={styles.brandMeta}>
              <Text style={styles.brandTitleText}>{t.brandTitle}</Text>
              <Text style={styles.brandSectorText}>
                {isNorwegian 
                  ? 'OFFENTLIG KRISESYSTEM • SEKTOR 04-FLÅM' 
                  : 'CIVILIAN CRISIS SYSTEM • SECTOR 04-FLÅM'}
              </Text>
            </View>
          </View>
        </View>

        {/* Degraded Connectivity Warning */}
        {isDegradedConnection && (
          <View style={styles.degradedCard} accessible accessibilityRole="alert">
            <View style={styles.degradedHeaderRow}>
              <View style={styles.degradedBeaconDot} />
              <Text style={styles.degradedHeading}>{t.limitedConnectionTitle}</Text>
            </View>
            <Text style={styles.degradedBodyText}>{t.limitedConnectionSub}</Text>
          </View>
        )}

        {/* Luminous Bento SAFE Console (Primary Visual Anchor) */}
        <View style={styles.safeConsoleCard} accessible accessibilityRole="summary">
          <View style={styles.consoleGlowPool} />
          
          <View style={styles.consoleHeader}>
            <View style={styles.allClearBadge}>
              <View style={styles.pulsingGreenAura} />
              <View style={styles.greenCoreDot} />
              <Text style={styles.allClearBadgeText}>
                {isNorwegian ? 'ALT KLART • NORMAL SITUASJON' : 'ALL CLEAR • NOMINAL STATUS'}
              </Text>
            </View>
            <Text style={styles.liveClockText}>14:47 CET</Text>
          </View>

          <Text style={styles.safeHeadingText}>
            {isNorwegian ? 'INGEN FARE' : 'SAFE & SECURE'}
          </Text>
          <Text style={styles.safeSubheadText}>
            {isNorwegian 
              ? 'Ingen registrerte trusler eller evakueringsvarsler i Flåm, Aurland eller Nærøyfjorden.' 
              : 'No active hazards or civil alerts recorded in Flåm, Aurland, or the Nærøyfjord sector.'}
          </Text>

          {/* Live Sensor Telemetry Strip */}
          <View style={styles.sensorGrid}>
            <View style={styles.sensorColumn}>
              <Text style={styles.sensorLabel}>FJORDVASSDRAG</Text>
              <Text style={styles.sensorValue}>0.4m NORMAL</Text>
            </View>
            <View style={styles.sensorDivider} />
            <View style={styles.sensorColumn}>
              <Text style={styles.sensorLabel}>SKREDFARE</Text>
              <Text style={styles.sensorValue}>NIVÅ 1 (GRØNN)</Text>
            </View>
            <View style={styles.sensorDivider} />
            <View style={styles.sensorColumn}>
              <Text style={styles.sensorLabel}>NØDNETT</Text>
              <Text style={styles.sensorValue}>100% OPERATIVT</Text>
            </View>
          </View>
        </View>

        {/* Calm Local Situation Radar Map */}
        <CalmLocalMapCard 
          safeZones={safeZones}
          userLocationName="Flåm Sentrum / Kai"
          statusText={isNorwegian ? 'Normale maritime forhold • Havn åpen' : t.normalMaritimeStatus}
          onPressExplore={() => setIsSafePlacesOpen(true)}
        />

        {/* Luminous Glass Bento Section: Preparedness & Utilities */}
        <View style={styles.bentoSection}>
          <Text style={styles.bentoSectionLabel}>
            {isNorwegian ? 'SIVIL SIKKERHET & BEREDSKAP' : 'CIVILIAN PREPAREDNESS & UTILITIES'}
          </Text>

          {/* Bento Hero Tile: 72-Hour Survival Kit (Interactive Progress) */}
          <TouchableOpacity 
            style={styles.heroBentoTile} 
            onPress={() => setIsReadinessOpen(true)}
            activeOpacity={0.82}
            accessibilityRole="button"
            accessibilityLabel={t.readinessTitle}
          >
            <View style={styles.heroBentoTop}>
              <View style={styles.heroBentoIconWell}>
                <ReadinessIcon size={22} color="#34D399" />
              </View>
              <View style={styles.heroBentoTag}>
                <Text style={styles.heroBentoTagText}>DSB ANBEFALING</Text>
              </View>
            </View>

            <Text style={styles.heroBentoTitle}>{t.readinessTitle}</Text>
            <Text style={styles.heroBentoDesc}>
              {isNorwegian 
                ? 'Sjekkliste for 72-timers egenberedskap: drikkevann, mat, varme og batteriradio.' 
                : t.readinessSubtitle}
            </Text>

            {/* Checklist Progress Bar */}
            <View style={styles.checklistProgressRow}>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: '80%' }]} />
              </View>
              <Text style={styles.progressText}>4 / 5 KLARE</Text>
            </View>
          </TouchableOpacity>

          {/* Bento Split Row: Safe Places & Offline Info */}
          <View style={styles.bentoSplitRow}>
            {/* Split Tile 1: Safe Places */}
            <TouchableOpacity 
              style={styles.splitBentoTile}
              onPress={() => setIsSafePlacesOpen(true)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={t.safePlacesTitle}
            >
              <View style={[styles.splitIconWell, { borderColor: 'rgba(56, 189, 248, 0.3)' }]}>
                <SafePlacesIcon size={20} color="#38BDF8" />
              </View>
              <Text style={styles.splitTag}>+45m HØYDE</Text>
              <Text style={styles.splitTitle}>{t.safePlacesTitle}</Text>
              <Text style={styles.splitSubtitle}>
                {isNorwegian ? 'Flåm Skule & Fretheim' : 'Flåm School & Fretheim'}
              </Text>
              <View style={styles.splitActionLink}>
                <Text style={styles.splitActionText}>Se kart</Text>
                <ChevronRightIcon size={12} color="#38BDF8" />
              </View>
            </TouchableOpacity>

            {/* Split Tile 2: Offline Info */}
            <TouchableOpacity 
              style={styles.splitBentoTile}
              onPress={() => setIsOfflineInfoOpen(true)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={t.offlineInfoTitle}
            >
              <View style={[styles.splitIconWell, { borderColor: 'rgba(253, 230, 138, 0.3)' }]}>
                <OfflineInfoIcon size={20} color="#FDE68A" />
              </View>
              <Text style={[styles.splitTag, { color: '#FDE68A' }]}>OFFLINE KLAR</Text>
              <Text style={styles.splitTitle}>{t.offlineInfoTitle}</Text>
              <Text style={styles.splitSubtitle}>
                {isNorwegian ? 'Lokal nødprotokoll' : 'Cached protocols'}
              </Text>
              <View style={styles.splitActionLink}>
                <Text style={[styles.splitActionText, { color: '#FDE68A' }]}>Åpne guide</Text>
                <ChevronRightIcon size={12} color="#FDE68A" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Bento Tile 3: Fast Emergency Hotlines */}
          <View style={styles.hotlinesCard}>
            <Text style={styles.hotlinesTitle}>
              {isNorwegian ? 'NØDNUMRE (ETT-TRYKKS ANROP)' : 'DIRECT EMERGENCY HOTLINES'}
            </Text>
            <View style={styles.hotlinesRow}>
              <TouchableOpacity 
                style={styles.hotlineChip}
                onPress={() => handleCallEmergency('112')}
                activeOpacity={0.8}
              >
                <PhoneCallIcon size={12} color="#EF4444" />
                <Text style={styles.hotlineNumber}>112</Text>
                <Text style={styles.hotlineRole}>POLITI</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.hotlineChip}
                onPress={() => handleCallEmergency('113')}
                activeOpacity={0.8}
              >
                <PhoneCallIcon size={12} color="#10B981" />
                <Text style={styles.hotlineNumber}>113</Text>
                <Text style={styles.hotlineRole}>MEDISINSK</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.hotlineChip}
                onPress={() => handleCallEmergency('110')}
                activeOpacity={0.8}
              >
                <PhoneCallIcon size={12} color="#F59E0B" />
                <Text style={styles.hotlineNumber}>110</Text>
                <Text style={styles.hotlineRole}>BRANN</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.hotlineChip}
                onPress={() => handleCallEmergency('116117')}
                activeOpacity={0.8}
              >
                <PhoneCallIcon size={12} color="#38BDF8" />
                <Text style={styles.hotlineNumber}>116 117</Text>
                <Text style={styles.hotlineRole}>LEGEVAKT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Local Storage & Cache Telemetry */}
        <View style={styles.storageTelemetryBar}>
          <View style={styles.storageLeft}>
            <View style={styles.storageDot} />
            <Text style={styles.storageText}>{offlineCacheStatus}</Text>
          </View>
          <Text style={styles.storageSyncTime}>{lastSyncTimestamp}</Text>
        </View>

        {/* Tactical Simulator Console (HVL Academic Drill) */}
        <View style={styles.simulatorChassis}>
          <TouchableOpacity 
            style={styles.simulatorToggleHeader}
            onPress={() => setIsSimulatorExpanded(!isSimulatorExpanded)}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Åpne eller lukk simulatorkontroller"
          >
            <View style={styles.simTitleLeft}>
              <View style={styles.simAmberLamp} />
              <Text style={styles.simHeading}>HVL SIMULATOR & DRILL PANEL</Text>
            </View>
            <View style={styles.simToggleCapsule}>
              <Text style={styles.simToggleCapsuleText}>
                {isSimulatorExpanded ? 'LUKK ▲' : 'ÅPNE ▼'}
              </Text>
            </View>
          </TouchableOpacity>

          {isSimulatorExpanded && (
            <View style={styles.simulatorExpandedBody}>
              <Text style={styles.simInstructionText}>
                {isNorwegian 
                  ? 'Utløs simulerte kriser for å teste sivil evakueringsflyt, nødpush og kartruting.'
                  : t.simDesc}
              </Text>

              <TouchableOpacity 
                style={styles.triggerAlertButton}
                onPress={handleStartFlåm}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel="Start Flåm passasjerskip kollisjonsscenario"
              >
                <View style={styles.alertButtonAura} />
                <Text style={styles.triggerAlertButtonText}>
                  {isNorwegian ? '▶ START FLÅM SKIPSKOLLISJON' : t.startScenarioBtn}
                </Text>
              </TouchableOpacity>

              <View style={styles.simAuxRow}>
                <TouchableOpacity 
                  style={styles.simAuxButton}
                  onPress={toggleDegradedConnection}
                  activeOpacity={0.8}
                >
                  <Text style={styles.simAuxButtonText}>
                    {isDegradedConnection ? t.simRestoreBtn : t.simOfflineBtn}
                  </Text>
                </TouchableOpacity>

                {hasActiveIncident && (
                  <TouchableOpacity 
                    style={[styles.simAuxButton, { borderColor: '#EF4444' }]}
                    onPress={() => router.push('/alert')}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.simAuxButtonText, { color: '#EF4444' }]}>
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
    backgroundColor: '#07090C',
  },
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xxl,
  },
  topNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 2,
  },
  topNavLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  norwayPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.07)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  flagDotRed: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  flagDotBlue: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#38BDF8',
    marginLeft: -3,
  },
  norwayPillText: {
    ...Typography.caption,
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  topNavRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  signalBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.25)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  signalDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#34D399',
  },
  signalText: {
    ...Typography.caption,
    color: '#6EE7B7',
    fontSize: 9,
    fontWeight: '800',
  },
  langSegment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#131822',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    gap: 5,
  },
  langText: {
    ...Typography.caption,
    color: '#64748B',
    fontSize: 10,
    fontWeight: '700',
  },
  langActiveText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  langDivider: {
    color: '#334155',
    fontSize: 10,
  },
  brandHeader: {
    marginBottom: 14,
  },
  brandCrestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandMeta: {
    justifyContent: 'center',
  },
  brandTitleText: {
    ...Typography.title1,
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 0.5,
    fontSize: 22,
  },
  brandSectorText: {
    ...Typography.caption,
    color: '#94A3B8',
    fontSize: 9,
    letterSpacing: 1.2,
    fontWeight: '700',
    marginTop: 1,
  },
  degradedCard: {
    backgroundColor: '#261707',
    borderWidth: 1,
    borderColor: '#D97706',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  degradedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  degradedBeaconDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#F59E0B',
  },
  degradedHeading: {
    ...Typography.subhead,
    color: '#FDE68A',
    fontWeight: '800',
    fontSize: 13,
  },
  degradedBodyText: {
    ...Typography.caption,
    color: '#CBD5E1',
    fontSize: 11,
    lineHeight: 16,
  },
  safeConsoleCard: {
    backgroundColor: '#091610',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.4)',
    borderRadius: BorderRadius.xl,
    padding: 18,
    marginBottom: Spacing.md,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  consoleGlowPool: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(52, 211, 153, 0.6)',
  },
  consoleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  allClearBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  pulsingGreenAura: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(52, 211, 153, 0.25)',
    position: 'absolute',
    left: 7,
  },
  greenCoreDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
    marginRight: 7,
  },
  allClearBadgeText: {
    ...Typography.caption,
    color: '#A7F3D0',
    fontWeight: '900',
    letterSpacing: 0.8,
    fontSize: 10,
  },
  liveClockText: {
    ...Typography.caption,
    color: '#64748B',
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '700',
  },
  safeHeadingText: {
    fontSize: 34,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  safeSubheadText: {
    ...Typography.body,
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  sensorGrid: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    borderRadius: BorderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  sensorColumn: {
    flex: 1,
    alignItems: 'center',
  },
  sensorLabel: {
    ...Typography.caption,
    color: '#64748B',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  sensorValue: {
    ...Typography.caption,
    color: '#34D399',
    fontSize: 10,
    fontWeight: '800',
  },
  sensorDivider: {
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 2,
  },
  bentoSection: {
    marginBottom: Spacing.md,
  },
  bentoSectionLabel: {
    ...Typography.caption,
    color: '#64748B',
    letterSpacing: 1.2,
    marginBottom: 8,
    fontSize: 10,
    fontWeight: '800',
  },
  heroBentoTile: {
    backgroundColor: '#0F151F',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.35)',
    borderRadius: BorderRadius.xl,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  heroBentoTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heroBentoIconWell: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBentoTag: {
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.xs,
  },
  heroBentoTagText: {
    ...Typography.caption,
    color: '#6EE7B7',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  heroBentoTitle: {
    ...Typography.headline,
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    marginBottom: 4,
  },
  heroBentoDesc: {
    ...Typography.caption,
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 14,
  },
  checklistProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBarTrack: {
    flex: 1,
    height: 5,
    backgroundColor: '#1E293B',
    borderRadius: 2.5,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: 2.5,
  },
  progressText: {
    ...Typography.caption,
    color: '#34D399',
    fontSize: 10,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  bentoSplitRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  splitBentoTile: {
    flex: 1,
    backgroundColor: '#0F151F',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BorderRadius.xl,
    padding: 14,
    minHeight: 145,
  },
  splitIconWell: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  splitTag: {
    ...Typography.caption,
    color: '#38BDF8',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  splitTitle: {
    ...Typography.subhead,
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  splitSubtitle: {
    ...Typography.caption,
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
    marginBottom: 10,
  },
  splitActionLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 'auto',
  },
  splitActionText: {
    ...Typography.caption,
    color: '#38BDF8',
    fontSize: 10,
    fontWeight: '700',
  },
  hotlinesCard: {
    backgroundColor: '#0F151F',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: BorderRadius.xl,
    padding: 14,
  },
  hotlinesTitle: {
    ...Typography.caption,
    color: '#64748B',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  hotlinesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  hotlineChip: {
    flex: 1,
    backgroundColor: '#161F2E',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: BorderRadius.md,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  hotlineNumber: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
  },
  hotlineRole: {
    ...Typography.caption,
    color: '#64748B',
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  storageTelemetryBar: {
    backgroundColor: '#0B0F15',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    marginBottom: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  storageDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
    marginRight: 6,
  },
  storageText: {
    ...Typography.caption,
    color: '#94A3B8',
    fontSize: 10,
  },
  storageSyncTime: {
    ...Typography.caption,
    color: '#64748B',
    fontSize: 9,
    fontFamily: 'monospace',
  },
  simulatorChassis: {
    backgroundColor: '#0C1118',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.25)',
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
  },
  simulatorToggleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    backgroundColor: '#121924',
  },
  simTitleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  simAmberLamp: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#F59E0B',
  },
  simHeading: {
    ...Typography.caption,
    color: '#FDE68A',
    fontWeight: '800',
    fontSize: 11,
    letterSpacing: 0.8,
  },
  simToggleCapsule: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  simToggleCapsuleText: {
    ...Typography.caption,
    color: '#FDE68A',
    fontSize: 9,
    fontWeight: '800',
  },
  simulatorExpandedBody: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.06)',
  },
  simInstructionText: {
    ...Typography.caption,
    color: '#94A3B8',
    marginBottom: Spacing.md,
    lineHeight: 16,
    fontSize: 11,
  },
  triggerAlertButton: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    minHeight: 48,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  alertButtonAura: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: BorderRadius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  triggerAlertButtonText: {
    ...Typography.headline,
    color: '#FFFFFF',
    fontWeight: '900',
    letterSpacing: 0.8,
    fontSize: 13,
  },
  simAuxRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  simAuxButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingVertical: 10,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16202E',
    minHeight: 42,
  },
  simAuxButtonText: {
    ...Typography.caption,
    color: '#CBD5E1',
    fontWeight: '700',
    fontSize: 11,
  },
});
