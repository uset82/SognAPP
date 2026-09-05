import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEmergency } from '../context/EmergencyContext';
import { SognSafeLogo } from '../components/brand';
import {
  AlertTriangleSolidIcon,
  PhoneVibrateIcon,
  SpeakerSoundIcon,
  ClockIcon,
  ShieldCheckIcon,
  MedicalCrossIcon,
} from '../components/ui/CivicIcons';

export default function AlertScreen() {
  const router = useRouter();
  const { incident, isDegradedConnection, language } = useEmergency();
  const isNorwegian = language === 'no';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Top Header with Astra Logo */}
        <View style={styles.topHeader}>
          <SognSafeLogo size={34} variant="master" />
          <Text style={styles.brandTitle}>SOGN SAFE</Text>
        </View>

        {/* Degraded Connection Banner if offline */}
        {isDegradedConnection && (
          <View style={styles.degradedBanner}>
            <Text style={styles.degradedText}>
              {isNorwegian 
                ? 'BEGRENSET MOBILNETT • VISER LOKAL BUFFER' 
                : 'LIMITED CELLULAR • OPERATING ON LOCAL CACHE'}
            </Text>
          </View>
        )}

        {/* Emergency Alert Red Card */}
        <View style={styles.emergencyCard}>
          <View style={styles.alertHeaderRow}>
            <AlertTriangleSolidIcon size={32} color="#FFFFFF" />
            <View style={styles.alertTitleCol}>
              <Text style={styles.alertMainTitle}>
                {isNorwegian ? 'NØDVARSLING' : 'EMERGENCY ALERT'}
              </Text>
              <Text style={styles.alertSubtitle}>
                {isNorwegian 
                  ? 'Mulig skipskollisjon ved Flåm kai' 
                  : (incident?.title || 'Possible vessel collision near Flåm harbor')}
              </Text>
            </View>
          </View>

          <View style={styles.cardDivider} />

          {/* Haptic & Sound notification row */}
          <View style={styles.statusRow}>
            <View style={styles.statusItem}>
              <PhoneVibrateIcon size={16} color="#FFFFFF" />
              <Text style={styles.statusItemText}>
                {isNorwegian ? 'VIBERASJON PÅ' : 'VIBRATE ON'}
              </Text>
            </View>
            <View style={styles.statusVerticalDivider} />
            <View style={styles.statusItem}>
              <SpeakerSoundIcon size={16} color="#FFFFFF" />
              <Text style={styles.statusItemText}>
                {isNorwegian ? 'LYD PÅ' : 'SOUND ON'}
              </Text>
            </View>
          </View>
        </View>

        {/* Bold Impact Headline */}
        <View style={styles.headlineContainer}>
          <Text style={styles.affectedHeadline}>
            {isNorwegian 
              ? 'DU ER INNENFOR\nDET BERØRTE OMRÅDET' 
              : 'YOU ARE INSIDE\nTHE AFFECTED AREA'}
          </Text>
          <Text style={styles.leaveInstruction}>
            {isNorwegian 
              ? 'Forlat havneområdet nå.' 
              : 'Leave the harbor area now.'}
          </Text>
        </View>

        {/* Estimated Time Card */}
        <View style={styles.timeCard}>
          <ClockIcon size={32} color="#111827" strokeWidth={2.2} />
          <View style={styles.timeTextCol}>
            <Text style={styles.timeTitle}>~15 MINUTES</Text>
            <Text style={styles.timeSubtitle}>
              {isNorwegian 
                ? 'Beregnet tid til mulig konsekvens' 
                : 'Estimated time until possible impact'}
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          {/* Primary Green CTA */}
          <TouchableOpacity
            style={styles.primarySafetyButton}
            onPress={() => router.push('/safety')}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={isNorwegian ? 'Gå til trygghet' : 'Go to safety'}
          >
            <View style={styles.buttonLeftRow}>
              <ShieldCheckIcon size={24} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={styles.primaryButtonText}>
                {isNorwegian ? 'GÅ TIL TRYGGHET' : 'GO TO SAFETY'}
              </Text>
            </View>
            <Text style={styles.buttonChevron}>›</Text>
          </TouchableOpacity>

          {/* Secondary Red Outline CTA */}
          <TouchableOpacity
            style={styles.needHelpButton}
            onPress={() => router.push('/help')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={isNorwegian ? 'Jeg trenger hjelp' : 'I need help'}
          >
            <View style={styles.buttonLeftRow}>
              <MedicalCrossIcon size={22} color="#C5221F" />
              <Text style={styles.needHelpButtonText}>
                {isNorwegian ? 'JEG TRENGER HJELP' : 'I NEED HELP'}
              </Text>
            </View>
            <Text style={styles.needHelpChevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Official Authority Metadata Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerTime}>
            {isNorwegian ? 'Offisiell oppdatering · 14:45' : 'Official update · 14:45'}
          </Text>
          <Text style={styles.footerAgency}>
            {isNorwegian ? 'Indre Sogn Beredskapsledelse' : 'Inner Sogn Emergency Coordination'}
          </Text>
          <Text style={styles.footerPrototype}>
            {isNorwegian ? 'Fiktiv prototype' : 'Fictional prototype'}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  degradedBanner: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    paddingVertical: 6,
    alignItems: 'center',
  },
  degradedText: {
    fontSize: 11,
    color: '#92400E',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  emergencyCard: {
    backgroundColor: '#C5221F',
    borderRadius: 20,
    marginHorizontal: 16,
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 14,
    shadowColor: '#C5221F',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  alertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  alertTitleCol: {
    flex: 1,
  },
  alertMainTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  alertSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FFFFFF',
    marginTop: 3,
    lineHeight: 18,
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginVertical: 14,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusItemText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  statusVerticalDivider: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  headlineContainer: {
    alignItems: 'center',
    marginTop: 28,
    marginHorizontal: 20,
  },
  affectedHeadline: {
    fontSize: 27,
    fontWeight: '900',
    color: '#C5221F',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 33,
  },
  leaveInstruction: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'center',
    marginTop: 10,
  },
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  timeTextCol: {
    flex: 1,
  },
  timeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: 0.5,
  },
  timeSubtitle: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
  },
  actionContainer: {
    marginTop: 20,
    gap: 12,
  },
  primarySafetyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1B5E36',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    shadowColor: '#1B5E36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  primaryButtonText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  buttonChevron: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 26,
  },
  needHelpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#C5221F',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  needHelpButtonText: {
    fontSize: 19,
    fontWeight: '800',
    color: '#C5221F',
    letterSpacing: 0.5,
  },
  needHelpChevron: {
    fontSize: 26,
    fontWeight: '700',
    color: '#C5221F',
    lineHeight: 26,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: 24,
    gap: 2,
  },
  footerTime: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  footerAgency: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  footerPrototype: {
    fontSize: 11,
    color: '#D1D5DB',
    marginTop: 2,
  },
});
