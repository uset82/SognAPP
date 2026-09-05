import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEmergency } from '../context/EmergencyContext';
import { SognSafeLogo } from '../components/brand';
import { CivicRouteMapCard } from '../components/ui/CivicRouteMapCard';
import {
  UpArrowNavIcon,
  ShelterGroupIcon,
  AlertTriangleSolidIcon,
  MedicalCrossIcon,
  LocationPinIcon,
  CircularIconContainer,
} from '../components/ui/CivicIcons';

interface NavigationStep {
  stepIndex: number;
  totalSteps: number;
  directionTitle: string;
  directionSubtitle: string;
  remainingMeters: number;
  remainingMinutes: number;
}

const STEPS: NavigationStep[] = [
  {
    stepIndex: 1,
    totalSteps: 2,
    directionTitle: 'CONTINUE NORTH',
    directionSubtitle: 'Turn left in 120 m',
    remainingMeters: 520,
    remainingMinutes: 6,
  },
  {
    stepIndex: 2,
    totalSteps: 2,
    directionTitle: 'TURN LEFT INTO FLÅM SCHOOL',
    directionSubtitle: 'Main entrance to assembly shelter',
    remainingMeters: 140,
    remainingMinutes: 2,
  },
];

export default function EvacuateScreen() {
  const router = useRouter();
  const { incident, language, reportIAmSafe } = useEmergency();
  const isNorwegian = language === 'no';
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const activeStep = STEPS[currentStepIndex];

  const handleNextStep = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      reportIAmSafe();
      router.push('/safe');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Header Bar */}
        <View style={styles.topHeaderBar}>
          <View style={styles.brandTitleCol}>
            <SognSafeLogo size={36} variant="master" />
            <Text style={styles.brandTitleText}>SOGN SAFE</Text>
          </View>

          <View style={styles.locationPill}>
            <LocationPinIcon size={14} color="#374151" />
            <Text style={styles.locationPillText}>Inner Sogn</Text>
          </View>
        </View>

        {/* Green Navigation Instruction Banner */}
        <TouchableOpacity
          style={styles.navBanner}
          onPress={handleNextStep}
          activeOpacity={0.9}
        >
          <UpArrowNavIcon size={38} color="#FFFFFF" />
          <View style={styles.navBannerTextCol}>
            <Text style={styles.navBannerMainText}>
              {isNorwegian && activeStep.stepIndex === 1 ? 'FORTSETT NORD' : activeStep.directionTitle}
            </Text>
            <Text style={styles.navBannerSubText}>
              {isNorwegian && activeStep.stepIndex === 1 ? 'Sving til venstre om 120 m' : activeStep.directionSubtitle}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Safe Area Destination Strip */}
        <View style={styles.destinationCard}>
          <CircularIconContainer size={42} bgColor="#1B5E36">
            <ShelterGroupIcon size={22} color="#FFFFFF" />
          </CircularIconContainer>

          <View style={styles.destinationMainCol}>
            <Text style={styles.destinationName}>Flåm School</Text>
            <Text style={styles.destinationSub}>
              {isNorwegian ? 'Trygg sone' : 'Safe Area'}
            </Text>
          </View>

          <View style={styles.remainingCol}>
            <Text style={styles.remainingLabel}>
              {isNorwegian ? 'Gjenstående' : 'Remaining'}
            </Text>
            <Text style={styles.remainingValue}>
              {activeStep.remainingMeters} m · {activeStep.remainingMinutes} min
            </Text>
          </View>

          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>SAFE AREA OPEN</Text>
          </View>
        </View>

        {/* Turn-by-Turn Map */}
        <View style={styles.mapContainer}>
          <CivicRouteMapCard 
            mode="turn-by-turn" 
            destinationName="Flåm School"
            userStep={activeStep.stepIndex}
          />
        </View>

        {/* Amber Hazard Warning Card */}
        <View style={styles.amberWarningCard}>
          <AlertTriangleSolidIcon size={28} color="#D97706" />
          <View style={styles.amberTextCol}>
            <Text style={styles.amberTitle}>
              {isNorwegian 
                ? 'IKKE GÅ TILBAKE MOT KAIEN' 
                : 'DO NOT RETURN TOWARD THE WATERFRONT'}
            </Text>
            <Text style={styles.amberSub}>
              {isNorwegian 
                ? 'Følg den angitte trygge ruten.' 
                : 'Follow the safe route.'}
            </Text>
          </View>
        </View>

        {/* Red Need Help Button */}
        <TouchableOpacity
          style={styles.needHelpButton}
          onPress={() => router.push('/help')}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={isNorwegian ? 'Jeg trenger hjelp' : 'I need help'}
        >
          <View style={styles.helpButtonLeft}>
            <MedicalCrossIcon size={22} color="#FFFFFF" />
            <Text style={styles.helpButtonText}>
              {isNorwegian ? 'JEG TRENGER HJELP' : 'I NEED HELP'}
            </Text>
          </View>
          <Text style={styles.helpChevron}>›</Text>
        </TouchableOpacity>

        {/* Arrived at safe destination button */}
        <TouchableOpacity
          style={styles.arrivedButton}
          onPress={handleNextStep}
          activeOpacity={0.8}
        >
          <Text style={styles.arrivedButtonText}>
            {currentStepIndex < STEPS.length - 1
              ? (isNorwegian ? 'Neste navigasjonssteg →' : 'Next Navigation Step →')
              : (isNorwegian ? '✅ BEKREFT ANKOMMET TRYGGESTED' : '✅ CONFIRM ARRIVAL AT SAFE AREA')}
          </Text>
        </TouchableOpacity>

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {isNorwegian ? 'Sist verifisert oppdatering · 14:47' : 'Last verified update · 14:47'}
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
    paddingBottom: 12,
  },
  brandTitleCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  brandTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.5,
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
  navBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: '#1B5E36',
    marginHorizontal: 16,
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 18,
    shadowColor: '#1B5E36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  navBannerTextCol: {
    flex: 1,
  },
  navBannerMainText: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  navBannerSubText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#D1FAE5',
    marginTop: 3,
  },
  destinationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  destinationMainCol: {
    flex: 1,
  },
  destinationName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  destinationSub: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  remainingCol: {
    alignItems: 'flex-end',
  },
  remainingLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  remainingValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
    marginTop: 1,
  },
  statusPill: {
    backgroundColor: '#EDF5EE',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1B5E36',
    letterSpacing: 0.3,
  },
  mapContainer: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  amberWarningCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  amberTextCol: {
    flex: 1,
  },
  amberTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#92400E',
    letterSpacing: 0.2,
  },
  amberSub: {
    fontSize: 12,
    color: '#78350F',
    marginTop: 2,
  },
  needHelpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#C5221F',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#C5221F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  helpButtonLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  helpButtonText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  helpChevron: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 26,
  },
  arrivedButton: {
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  arrivedButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1B5E36',
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
