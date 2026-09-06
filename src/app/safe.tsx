import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEmergency } from '../context/EmergencyContext';
import { Colors } from '../constants/theme';
import { AppChrome, CivicAtmosphere, CivicButton, GlassSurface, ScreenEnter, ScreenScroll, ShieldCheckBadge } from '../components/ui';

export default function SafeConfirmationScreen() {
  const router = useRouter();
  const { incident, reportIAmSafe, t, clearScenario, enrichedZones, selectedZoneId } = useEmergency();

  useEffect(() => {
    reportIAmSafe();
  }, [reportIAmSafe]);

  const shelter =
    enrichedZones.find((zone) => zone.id === selectedZoneId) ||
    incident?.primarySafeZone;

  const handleReturnHome = () => {
    clearScenario();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <CivicAtmosphere>
      <ScreenEnter>
        <ScreenScroll contentContainerStyle={styles.container}>
          <AppChrome title={t.brandTitle} centered compact />
          <View style={styles.content}>
            <ShieldCheckBadge size={72} badgeColor={Colors.safetyGreen} checkColor={Colors.textOnColor} />
            <Text style={styles.headline}>{t.safeRecorded}</Text>
            <Text style={styles.subtext}>{t.safeRecordedBody}</Text>
            <GlassSurface tone="mint" glow="safe" style={styles.card}>
              <View style={styles.cardInner}>
                <View style={styles.row}>
                  <Text style={styles.infoTitle}>{t.registeredShelter}</Text>
                  <View style={styles.pill}>
                    <Text style={styles.pillText}>{t.confirmed}</Text>
                  </View>
                </View>
                <Text style={styles.shelter}>{shelter?.name || 'Flåm School'}</Text>
                <Text style={styles.body}>{t.remainUntilCleared}</Text>
              </View>
            </GlassSurface>
          </View>
          <CivicButton
            title={t.returnDashboard}
            variant="primary-safety"
            onPress={handleReturnHome}
            style={styles.cta}
          />
        </ScreenScroll>
      </ScreenEnter>
      </CivicAtmosphere>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.canvas,
  },
  container: {
    paddingBottom: 40,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  headline: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.safetyGreen,
    textAlign: 'center',
    letterSpacing: 0.3,
    marginTop: 20,
  },
  subtext: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 24,
  },
  card: {
    width: '100%',
  },
  cardInner: {
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  pill: {
    backgroundColor: Colors.safetyGreenBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  pillText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.safetyGreen,
  },
  shelter: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  cta: {
    marginHorizontal: 20,
    marginTop: 28,
  },
});
