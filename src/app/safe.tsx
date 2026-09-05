import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEmergency } from '../context/EmergencyContext';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { EmergencyButton } from '../components/ui';

export default function SafeConfirmationScreen() {
  const router = useRouter();
  const { incident, reportIAmSafe, language } = useEmergency();
  const isNorwegian = language === 'no';

  useEffect(() => {
    reportIAmSafe();
  }, [reportIAmSafe]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.iconCircle}>
            <View style={styles.checkInnerBadge} />
          </View>

          <Text style={styles.headline}>
            {isNorwegian ? 'STATUS: TRYGG REGISTRERT' : 'SAFE STATUS RECORDED'}
          </Text>
          
          <Text style={styles.subtext}>
            {isNorwegian
              ? 'Din status er formidlet til beredskapsledelsen. Du er registrert som gjort rede for i trygt samlingsområde.'
              : 'Your status has been transmitted to authorities. You are registered as accounted for in the safe assembly area.'}
          </Text>

          <View style={styles.infoCard}>
            <View style={styles.shelterHeaderRow}>
              <Text style={styles.infoTitle}>
                {isNorwegian ? 'REGISTRERT SAMLINGSSTED' : 'REGISTERED ASSEMBLY SHELTER'}
              </Text>
              <Text style={styles.shelterTime}>
                {isNorwegian ? 'BEKREFTET' : 'CONFIRMED'}
              </Text>
            </View>
            <Text style={styles.shelterName}>
              {incident?.primarySafeZone?.name || 'Flåm Skule & Samfunnshus'}
            </Text>
            <Text style={styles.infoBody}>
              {isNorwegian
                ? 'Vennligst bli værende i samlingsområdet inntil nødetatene eller kommunen bekrefter at havneområdet er sikret.'
                : 'Please remain in the safe assembly area until emergency personnel confirm the harbor zone is cleared.'}
            </Text>
          </View>
        </View>

        <EmergencyButton
          title={isNorwegian ? 'TILBAKE TIL HOVEDSKJERM' : 'RETURN TO DASHBOARD'}
          subtitle={isNorwegian ? 'Sivil beredskapsovervåking aktiv' : 'Civilian safety monitoring active'}
          variant="outline-neutral"
          onPress={() => router.replace('/')}
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
    flexGrow: 1,
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.safetyGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  checkInnerBadge: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  headline: {
    ...Typography.title1,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtext: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xxl,
    paddingHorizontal: Spacing.md,
  },
  infoCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.safetyGreenBorder,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  infoTitle: {
    ...Typography.caption,
    color: Colors.safetyGreenText,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  shelterHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  shelterTime: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  shelterName: {
    ...Typography.title2,
    color: Colors.textPrimary,
    fontWeight: '800',
    marginBottom: Spacing.sm,
  },
  infoBody: {
    ...Typography.body,
    color: Colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
});
