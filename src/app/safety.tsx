import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEmergency } from '../context/EmergencyContext';
import { SognSafeLogo } from '../components/brand';
import { CivicRouteMapCard } from '../components/ui/CivicRouteMapCard';
import {
  ShieldCheckBadge,
  ShieldCheckIcon,
  WalkingPersonIcon,
  ClockIcon,
  CheckCircleSolidIcon,
  ArrowsSwapIcon,
  LocationPinIcon,
} from '../components/ui/CivicIcons';

export default function FindSafetyScreen() {
  const router = useRouter();
  const { incident, safeZones, language } = useEmergency();
  const isNorwegian = language === 'no';
  const [selectedZoneIndex, setSelectedZoneIndex] = useState(0);

  const activeZone = safeZones[selectedZoneIndex] || incident?.primarySafeZone;

  const handleNextSafeZone = () => {
    setSelectedZoneIndex((prev) => (prev + 1) % (safeZones.length || 1));
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

        {/* Nearest Safe Area Card */}
        <View style={styles.safeHeroCard}>
          <View style={styles.heroTopRow}>
            <ShieldCheckBadge size={48} badgeColor="#1B5E36" checkColor="#FFFFFF" />
            <View style={styles.heroTextCol}>
              <Text style={styles.heroPreHeading}>
                {isNorwegian ? 'NÆRMESTE TRYGGESTED' : 'NEAREST SAFE AREA'}
              </Text>
              <Text style={styles.heroDestinationTitle}>
                {activeZone?.name || (isNorwegian ? 'Flåm skule' : 'Flåm School')}
              </Text>
            </View>
          </View>

          {/* Three Metric Pills */}
          <View style={styles.metricPillsRow}>
            {/* Distance */}
            <View style={styles.metricPill}>
              <WalkingPersonIcon size={16} color="#111827" />
              <Text style={styles.metricPillText}>
                {activeZone?.distanceMeters || 650} m
              </Text>
            </View>

            {/* Walk Time */}
            <View style={styles.metricPill}>
              <ClockIcon size={16} color="#111827" />
              <Text style={styles.metricPillText}>
                {activeZone?.walkMinutes || 8} min walk
              </Text>
            </View>

            {/* Confirmed Status */}
            <View style={styles.metricPillConfirmed}>
              <CheckCircleSolidIcon size={16} color="#1B5E36" />
              <Text style={styles.metricPillConfirmedText}>
                {isNorwegian ? 'ÅPEN OG BEKREFTET' : 'OPEN AND CONFIRMED'}
              </Text>
            </View>
          </View>
        </View>

        {/* Route Overview Map */}
        <View style={styles.mapContainer}>
          <CivicRouteMapCard 
            mode="overview" 
            destinationName={activeZone?.name || 'Flåm School'} 
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {/* Primary Green CTA: START SAFE ROUTE */}
          <TouchableOpacity
            style={styles.startRouteButton}
            onPress={() => router.push('/evacuate')}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={isNorwegian ? 'Start trygg rute' : 'Start safe route'}
          >
            <ShieldCheckIcon size={24} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={styles.startRouteButtonText}>
              {isNorwegian ? 'START TRYGG RUTE' : 'START SAFE ROUTE'}
            </Text>
          </TouchableOpacity>

          {/* Secondary Button: Show another safe area */}
          <TouchableOpacity
            style={styles.switchZoneButton}
            onPress={handleNextSafeZone}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={isNorwegian ? 'Vis et annet trygt område' : 'Show another safe area'}
          >
            <ArrowsSwapIcon size={18} color="#111827" />
            <Text style={styles.switchZoneButtonText}>
              {isNorwegian ? 'Vis et annet trygt område' : 'Show another safe area'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {isNorwegian ? 'Sist verifisert oppdatering · 14:46' : 'Last verified update · 14:46'}
          </Text>
        </View>
      </ScrollView>
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
  safeHeroCard: {
    backgroundColor: '#EDF5EE',
    borderRadius: 22,
    marginHorizontal: 16,
    paddingHorizontal: 18,
    paddingVertical: 18,
    gap: 14,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  heroTextCol: {
    flex: 1,
  },
  heroPreHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1B5E36',
    letterSpacing: 0.6,
  },
  heroDestinationTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: '#111827',
    marginTop: 2,
  },
  metricPillsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  metricPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  metricPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  metricPillConfirmed: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  metricPillConfirmedText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1B5E36',
    letterSpacing: 0.3,
  },
  mapContainer: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionContainer: {
    marginTop: 16,
    gap: 10,
  },
  startRouteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#1B5E36',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingVertical: 18,
    shadowColor: '#1B5E36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startRouteButtonText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  switchZoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 14,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  switchZoneButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 18,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
