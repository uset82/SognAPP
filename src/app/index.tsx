import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEmergency } from '../context/EmergencyContext';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { CalmLocalMapCard } from '../components/ui/CalmLocalMapCard';
import { ReadinessModal } from '../components/modals/ReadinessModal';
import { SafePlacesModal } from '../components/modals/SafePlacesModal';
import { OfflineInfoModal } from '../components/modals/OfflineInfoModal';

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

  const handleStartFlåm = () => {
    triggerFlamScenario();
    router.push('/alert');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Training Mode Banner */}
        <View style={styles.testBanner} accessible accessibilityRole="text">
          <Text style={styles.testBannerText}>{t.trainingMode}</Text>
        </View>

        {/* Brand Header */}
        <View style={styles.header}>
          <View style={styles.logoRow}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoIcon}>S</Text>
            </View>
            <View>
              <Text style={styles.brandTitle}>{t.brandTitle}</Text>
              <Text style={styles.brandSubtitle}>{t.brandSubtitle}</Text>
            </View>
          </View>

          {/* Language Toggle */}
          <TouchableOpacity 
            style={styles.langPill} 
            onPress={toggleLanguage}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel={`Toggle language. Current: ${language.toUpperCase()}`}
          >
            <Text style={styles.langText}>
              {language === 'en' ? 'NO / EN' : 'EN / NO'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Degraded Connection Banner */}
        {isDegradedConnection && (
          <View style={styles.degradedBanner} accessible accessibilityRole="alert">
            <Text style={styles.degradedTitle}>{t.limitedConnectionTitle}</Text>
            <Text style={styles.degradedSub}>{t.limitedConnectionSub}</Text>
          </View>
        )}

        {/* SAFE Hero Card */}
        <View style={styles.safeCard} accessible accessibilityRole="summary">
          <View style={styles.statusPill}>
            <View style={styles.statusDot} />
            <Text style={styles.statusPillText}>{t.allClear}</Text>
          </View>

          <Text style={styles.safeHeroTitle}>{t.safeTitle}</Text>
          <Text style={styles.safeHeroDesc}>{t.safeSubtitle}</Text>

          <View style={styles.locationBar}>
            <Text style={styles.locationLabel}>{t.monitoredZoneLabel}</Text>
            <Text style={styles.locationValue}>{t.monitoredZoneValue}</Text>
          </View>
        </View>

        {/* Calm Local Situation Map */}
        <CalmLocalMapCard 
          safeZones={safeZones}
          userLocationName="Flåm Kai / Sentrum"
          statusText={t.normalMaritimeStatus}
          onPressExplore={() => setIsSafePlacesOpen(true)}
        />

        {/* Utility Items: 4 Essential Civilian Services */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionLabel}>
            {language === 'no' ? 'BEREDSKAP & INFORMASJON' : 'PREPAREDNESS & UTILITIES'}
          </Text>

          {/* 1. Emergency Readiness */}
          <TouchableOpacity 
            style={styles.serviceCard} 
            onPress={() => setIsReadinessOpen(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={t.readinessTitle}
          >
            <View style={styles.serviceIconContainer}>
              <Text style={styles.serviceIcon}>R</Text>
            </View>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceTitle}>{t.readinessTitle}</Text>
              <Text style={styles.serviceDesc}>{t.readinessSubtitle}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* 2. Safe Places */}
          <TouchableOpacity 
            style={styles.serviceCard} 
            onPress={() => setIsSafePlacesOpen(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={t.safePlacesTitle}
          >
            <View style={styles.serviceIconContainer}>
              <Text style={styles.serviceIcon}>S</Text>
            </View>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceTitle}>{t.safePlacesTitle}</Text>
              <Text style={styles.serviceDesc}>{t.safePlacesSubtitle}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* 3. Offline Information */}
          <TouchableOpacity 
            style={styles.serviceCard} 
            onPress={() => setIsOfflineInfoOpen(true)}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={t.offlineInfoTitle}
          >
            <View style={styles.serviceIconContainer}>
              <Text style={styles.serviceIcon}>O</Text>
            </View>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceTitle}>{t.offlineInfoTitle}</Text>
              <Text style={styles.serviceDesc}>{t.offlineInfoSubtitle}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* 4. Language Selection */}
          <TouchableOpacity 
            style={styles.serviceCard} 
            onPress={toggleLanguage}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={t.languageLabel}
          >
            <View style={styles.serviceIconContainer}>
              <Text style={styles.serviceIcon}>L</Text>
            </View>
            <View style={styles.serviceContent}>
              <Text style={styles.serviceTitle}>{t.languageLabel}</Text>
              <Text style={styles.serviceDesc}>
                {language === 'en' ? 'Active: English (Switch to Norsk)' : 'Aktivt: Norsk (Bytt til English)'}
              </Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Sync & Cache Metadata */}
        <View style={styles.metadataCard}>
          <View style={styles.metaRow}>
            <View style={styles.metaDot} />
            <Text style={styles.metaText}>{offlineCacheStatus}</Text>
          </View>
          <Text style={styles.metaTime}>{lastSyncTimestamp}</Text>
        </View>

        {/* Simulator Controls (HVL Classroom Testing) */}
        <View style={styles.simulatorSection}>
          <Text style={styles.simulatorSectionTitle}>{t.simTitle}</Text>
          <Text style={styles.simulatorDesc}>{t.simDesc}</Text>

          <TouchableOpacity 
            style={styles.simulateAlertButton}
            onPress={handleStartFlåm}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Trigger Flåm passenger vessel collision scenario"
          >
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
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  testBanner: {
    backgroundColor: Colors.surfaceSubtle,
    paddingVertical: 6,
    paddingHorizontal: Spacing.sm,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  testBannerText: {
    ...Typography.caption,
    color: Colors.textMuted,
    letterSpacing: 1,
    fontSize: 10,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  brandTitle: {
    ...Typography.headline,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  langPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.surface,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
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
  degradedTitle: {
    ...Typography.subhead,
    color: Colors.warningAmberText,
    fontWeight: '700',
    marginBottom: 2,
  },
  degradedSub: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  safeCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.safetyGreenBorder,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.safetyGreenDark,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.safetyGreenText,
    marginRight: 6,
  },
  statusPillText: {
    ...Typography.caption,
    color: Colors.safetyGreenText,
    fontWeight: '700',
  },
  safeHeroTitle: {
    ...Typography.hero,
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  safeHeroDesc: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  locationBar: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  locationLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
    letterSpacing: 0.5,
  },
  locationValue: {
    ...Typography.subhead,
    color: Colors.textPrimary,
    marginTop: 2,
    fontWeight: '600',
  },
  servicesSection: {
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    fontSize: 11,
  },
  serviceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    minHeight: 64,
  },
  serviceIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  serviceIcon: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  serviceContent: {
    flex: 1,
  },
  serviceTitle: {
    ...Typography.subhead,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  serviceDesc: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginTop: 2,
    fontSize: 11,
  },
  chevron: {
    fontSize: 20,
    color: Colors.textMuted,
    marginLeft: Spacing.sm,
  },
  metadataCard: {
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
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
    backgroundColor: Colors.safetyGreenText,
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
    fontSize: 11,
  },
  simulatorSection: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
  },
  simulatorSectionTitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  simulatorDesc: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.md,
    lineHeight: 18,
    fontSize: 11,
  },
  simulateAlertButton: {
    backgroundColor: Colors.emergencyRed,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    minHeight: 52,
  },
  simulateAlertButtonText: {
    ...Typography.headline,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
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
    minHeight: 48,
  },
  simSecondaryButtonText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
});
