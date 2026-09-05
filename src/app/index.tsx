import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEmergency } from '../context/EmergencyContext';
import { Colors } from '../constants/theme';
import { CalmLocalMapCard } from '../components/ui/CalmLocalMapCard';
import { SognSafeLogo } from '../components/brand';
import { ReadinessModal } from '../components/modals/ReadinessModal';
import { SafePlacesModal } from '../components/modals/SafePlacesModal';
import { OfflineInfoModal } from '../components/modals/OfflineInfoModal';
import {
  ShieldCheckBadge,
  CircularIconContainer,
  ClipboardCheckIcon,
  ShelterGroupIcon,
  BookOpenIcon,
  GlobeGridIcon,
  DownloadCheckIcon,
  CheckCircleSolidIcon,
  LocationPinIcon,
  ChevronRightIcon,
  AlertTriangleSolidIcon,
} from '../components/ui/CivicIcons';

export default function ReadyScreen() {
  const router = useRouter();
  const { 
    hasActiveIncident, 
    isDegradedConnection, 
    triggerFlamScenario, 
    language,
    toggleLanguage,
    t,
    safeZones,
    lastSyncTimestamp,
  } = useEmergency();

  const isNorwegian = language === 'no';
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
        {/* Top Header Bar (Astra Logo + Title + District Pill) */}
        <View style={styles.topHeaderBar}>
          <View style={styles.brandTitleCol}>
            <SognSafeLogo size={42} variant="master" />
            <View style={styles.titleTextCol}>
              <Text style={styles.appTitleText}>SOGN SAFE</Text>
              <Text style={styles.appSubtitleText}>
                {isNorwegian ? 'Sivil beredskapsapp' : 'Civilian Emergency App'}
              </Text>
            </View>
          </View>

          <View style={styles.locationPill}>
            <LocationPinIcon size={14} color="#374151" />
            <Text style={styles.locationPillText}>Inner Sogn</Text>
          </View>
        </View>

        {/* Degraded Connection Banner if offline */}
        {isDegradedConnection && (
          <View style={styles.degradedBanner}>
            <AlertTriangleSolidIcon size={16} color="#D97706" />
            <Text style={styles.degradedBannerText}>
              {isNorwegian 
                ? 'Begrenset mobilnett • Viser lokal buffer' 
                : 'Limited cellular network • Operating on local cache'}
            </Text>
          </View>
        )}

        {/* Active Incident Quick Banner if one is triggered */}
        {hasActiveIncident && (
          <TouchableOpacity 
            style={styles.activeEmergencyBanner}
            onPress={() => router.push('/alert')}
            activeOpacity={0.85}
          >
            <View style={styles.activeEmergencyLeft}>
              <AlertTriangleSolidIcon size={20} color="#FFFFFF" />
              <View style={styles.activeEmergencyTextCol}>
                <Text style={styles.activeEmergencyTitle}>
                  {isNorwegian ? 'AKTIV NØDVARSLING' : 'ACTIVE EMERGENCY ALERT'}
                </Text>
                <Text style={styles.activeEmergencySub}>
                  {isNorwegian ? 'Trykk for å se evakueringsrute' : 'Tap to open emergency route'}
                </Text>
              </View>
            </View>
            <ChevronRightIcon size={18} color="#FFFFFF" />
          </TouchableOpacity>
        )}

        {/* Hero SAFE Card (Soft mint background, shield badge, bold SAFE text) */}
        <View style={styles.safeHeroCard} accessible accessibilityRole="summary">
          <ShieldCheckBadge size={54} badgeColor="#1B5E36" checkColor="#FFFFFF" />
          <View style={styles.safeHeroTextCol}>
            <Text style={styles.safeHeroTitle}>SAFE</Text>
            <Text style={styles.safeHeroSub}>
              {isNorwegian 
                ? 'Ingen aktiv nødssituasjon i ditt område.' 
                : 'No active emergency in your area.'}
            </Text>
          </View>
        </View>

        {/* Fjord Map Card */}
        <View style={styles.mapContainer}>
          <CalmLocalMapCard 
            safeZones={safeZones}
            userLocationName="Sogndal / Indre Sogn"
            statusText={isNorwegian ? 'Normale forhold' : 'Nominal status'}
            onPressExplore={() => setIsSafePlacesOpen(true)}
          />
        </View>

        {/* Utility Menu List (4 Crisp White Cards) */}
        <View style={styles.utilityListSection}>
          {/* 1. Emergency Readiness */}
          <TouchableOpacity 
            style={styles.utilityCard}
            onPress={() => setIsReadinessOpen(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={isNorwegian ? 'Egenberedskap' : 'Emergency readiness'}
          >
            <View style={styles.utilityCardLeft}>
              <CircularIconContainer size={42} bgColor="#EBF5EE">
                <ClipboardCheckIcon size={22} color="#1B5E36" />
              </CircularIconContainer>
              <Text style={styles.utilityCardLabel}>
                {isNorwegian ? 'Egenberedskap' : 'Emergency readiness'}
              </Text>
            </View>
            <ChevronRightIcon size={18} color="#9CA3AF" />
          </TouchableOpacity>

          {/* 2. Safe Places */}
          <TouchableOpacity 
            style={styles.utilityCard}
            onPress={() => setIsSafePlacesOpen(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={isNorwegian ? 'Trygge steder' : 'Safe places'}
          >
            <View style={styles.utilityCardLeft}>
              <CircularIconContainer size={42} bgColor="#EBF5EE">
                <ShelterGroupIcon size={22} color="#1B5E36" />
              </CircularIconContainer>
              <Text style={styles.utilityCardLabel}>
                {isNorwegian ? 'Trygge steder' : 'Safe places'}
              </Text>
            </View>
            <ChevronRightIcon size={18} color="#9CA3AF" />
          </TouchableOpacity>

          {/* 3. Offline Information */}
          <TouchableOpacity 
            style={styles.utilityCard}
            onPress={() => setIsOfflineInfoOpen(true)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={isNorwegian ? 'Frakoblet informasjon' : 'Offline information'}
          >
            <View style={styles.utilityCardLeft}>
              <CircularIconContainer size={42} bgColor="#EBF5EE">
                <BookOpenIcon size={22} color="#1B5E36" />
              </CircularIconContainer>
              <Text style={styles.utilityCardLabel}>
                {isNorwegian ? 'Frakoblet informasjon' : 'Offline information'}
              </Text>
            </View>
            <ChevronRightIcon size={18} color="#9CA3AF" />
          </TouchableOpacity>

          {/* 4. Language Selection */}
          <TouchableOpacity 
            style={styles.utilityCard}
            onPress={toggleLanguage}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={`Language: ${isNorwegian ? 'Norsk' : 'English'}`}
          >
            <View style={styles.utilityCardLeft}>
              <CircularIconContainer size={42} bgColor="#EBF5EE">
                <GlobeGridIcon size={22} color="#1B5E36" />
              </CircularIconContainer>
              <Text style={styles.utilityCardLabel}>
                {isNorwegian ? 'Språk' : 'Language'}
              </Text>
            </View>
            <View style={styles.languageRightRow}>
              <Text style={styles.languageActiveText}>
                {isNorwegian ? 'Norsk' : 'English'}
              </Text>
              <ChevronRightIcon size={18} color="#9CA3AF" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Emergency Information Downloaded Status Card */}
        <View style={styles.cacheStatusCard}>
          <View style={styles.cacheStatusLeft}>
            <CircularIconContainer size={42} bgColor="#EBF5EE">
              <DownloadCheckIcon size={22} color="#1B5E36" />
            </CircularIconContainer>
            <View style={styles.cacheStatusTextCol}>
              <Text style={styles.cacheStatusTitle}>
                {isNorwegian ? 'Nødinformasjon lastet ned' : 'Emergency information downloaded'}
              </Text>
              <Text style={styles.cacheStatusSubtitle}>
                {isNorwegian ? 'Oppdatert for 8 minutter siden' : 'Updated 8 minutes ago'}
              </Text>
            </View>
          </View>
          <CheckCircleSolidIcon size={24} color="#1B5E36" />
        </View>

        {/* Discreet Simulation Trigger for Testing Evaluators */}
        <TouchableOpacity 
          style={styles.simulationBar}
          onPress={handleStartFlåm}
          activeOpacity={0.8}
        >
          <Text style={styles.simulationBarText}>
            {isNorwegian 
              ? '🚨 SIMULER FLÅM NØDVARSLING' 
              : '🚨 SIMULATE FLÅM EMERGENCY ALERT'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FBFBFA',
  },
  container: {
    paddingBottom: 40,
  },
  topHeaderBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  brandTitleCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  titleTextCol: {
    justifyContent: 'center',
  },
  appTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.5,
  },
  appSubtitleText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '400',
    marginTop: 1,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  locationPillText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1F2937',
  },
  degradedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  degradedBannerText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '600',
    flex: 1,
  },
  activeEmergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#C5221F',
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#C5221F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  activeEmergencyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  activeEmergencyTextCol: {
    flex: 1,
  },
  activeEmergencyTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  activeEmergencySub: {
    fontSize: 12,
    color: '#FEE2E2',
    marginTop: 2,
  },
  safeHeroCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDF5EE',
    borderRadius: 22,
    marginHorizontal: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 16,
  },
  safeHeroTextCol: {
    flex: 1,
  },
  safeHeroTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#1B5E36',
    letterSpacing: 0.5,
  },
  safeHeroSub: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '400',
    marginTop: 3,
    lineHeight: 19,
  },
  mapContainer: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  utilityListSection: {
    marginTop: 14,
    gap: 10,
  },
  utilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  utilityCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  utilityCardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  languageRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  languageActiveText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1B5E36',
  },
  cacheStatusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cacheStatusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  cacheStatusTextCol: {
    flex: 1,
  },
  cacheStatusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  cacheStatusSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  simulationBar: {
    marginHorizontal: 16,
    marginTop: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
    borderRadius: 14,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  simulationBarText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#C5221F',
    letterSpacing: 0.5,
  },
});
