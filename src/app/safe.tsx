import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEmergency } from '../context/EmergencyContext';
import { SognSafeLogo } from '../components/brand';
import { ShieldCheckBadge } from '../components/ui/CivicIcons';

export default function SafeConfirmationScreen() {
  const router = useRouter();
  const { incident, reportIAmSafe, language, clearScenario } = useEmergency();
  const isNorwegian = language === 'no';

  useEffect(() => {
    reportIAmSafe();
  }, [reportIAmSafe]);

  const handleReturnHome = () => {
    clearScenario();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.topHeader}>
          <SognSafeLogo size={36} variant="master" />
          <Text style={styles.brandTitle}>SOGN SAFE</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.badgeWrapper}>
            <ShieldCheckBadge size={72} badgeColor="#1B5E36" checkColor="#FFFFFF" />
          </View>

          <Text style={styles.headline}>
            {isNorwegian ? 'STATUS: REGISTRERT TRYGG' : 'SAFE STATUS RECORDED'}
          </Text>
          
          <Text style={styles.subtext}>
            {isNorwegian
              ? 'Din status er formidlet til beredskapsledelsen. Du er registrert som gjort rede for i trygt samlingsområde.'
              : 'Your status has been transmitted to authorities. You are registered as accounted for in the safe assembly area.'}
          </Text>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <View style={styles.shelterHeaderRow}>
              <Text style={styles.infoTitle}>
                {isNorwegian ? 'REGISTRERT SAMLINGSSTED' : 'REGISTERED ASSEMBLY SHELTER'}
              </Text>
              <View style={styles.confirmedPill}>
                <Text style={styles.confirmedPillText}>
                  {isNorwegian ? 'BEKREFTET' : 'CONFIRMED'}
                </Text>
              </View>
            </View>
            <Text style={styles.shelterName}>
              {incident?.primarySafeZone?.name || 'Flåm School'}
            </Text>
            <Text style={styles.infoBody}>
              {isNorwegian
                ? 'Vennligst bli værende i samlingsområdet inntil nødetatene eller kommunen bekrefter at havneområdet er sikret.'
                : 'Please remain in the safe assembly area until emergency personnel confirm the harbor zone is cleared.'}
            </Text>
          </View>
        </View>

        {/* Primary Action Button */}
        <TouchableOpacity
          style={styles.returnButton}
          onPress={handleReturnHome}
          activeOpacity={0.85}
          accessibilityRole="button"
        >
          <Text style={styles.returnButtonText}>
            {isNorwegian ? 'TILBAKE TIL HOVEDSKJERM' : 'RETURN TO DASHBOARD'}
          </Text>
        </TouchableOpacity>
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.5,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  badgeWrapper: {
    marginBottom: 20,
  },
  headline: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1B5E36',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  subtext: {
    fontSize: 15,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 24,
  },
  infoCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  shelterHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6B7280',
    letterSpacing: 0.5,
  },
  confirmedPill: {
    backgroundColor: '#EDF5EE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  confirmedPillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1B5E36',
  },
  shelterName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 8,
  },
  infoBody: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  returnButton: {
    backgroundColor: '#1B5E36',
    marginHorizontal: 20,
    marginTop: 28,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1B5E36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  returnButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
