import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useEmergency } from '../context/EmergencyContext';
import { Colors } from '../constants/theme';
import {
  AppChrome,
  CivicAtmosphere,
  CivicButton,
  ClockIcon,
  GlassSurface,
  MedicalCrossIcon,
  PhoneVibrateIcon,
  ScreenEnter,
  ShieldCheckIcon,
  SpeakerSoundIcon,
  StatusHero,
  TimestampMeta,
} from '../components/ui';
import { AlertTriangleSolidIcon } from '../components/ui/CivicIcons';
import { triggerEmergencyAlertHaptic } from '../services/haptics';

export default function AlertScreen() {
  const router = useRouter();
  const { incident, isDegradedConnection, language, t, lastSyncTimestamp } = useEmergency();

  useEffect(() => {
    triggerEmergencyAlertHaptic();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <CivicAtmosphere mood="alert">
      <ScreenEnter>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <AppChrome title={t.brandTitle} centered compact />

          {isDegradedConnection ? (
            <GlassSurface tone="warning" glow="warning" style={styles.offline}>
              <Text style={styles.offlineText}>{t.limitedConnectionTitle}</Text>
            </GlassSurface>
          ) : null}

          <StatusHero
            variant="alert"
            title={t.alertTitle}
            subtitle={incident?.title || t.alertDefaultIncident}
            icon={<AlertTriangleSolidIcon size={32} color={Colors.textOnColor} />}
            footer={
              <View style={styles.statusRow}>
                <View style={styles.statusItem}>
                  <PhoneVibrateIcon size={16} color={Colors.textOnColor} />
                  <Text style={styles.statusText}>{t.vibrateOn}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statusItem}>
                  <SpeakerSoundIcon size={16} color={Colors.textOnColor} />
                  <Text style={styles.statusText}>{t.soundOn}</Text>
                </View>
              </View>
            }
          />

          <View style={styles.headline}>
            <Text style={styles.affected}>{t.insideAffected}</Text>
            <Text style={styles.leave}>{t.leaveHarbor}</Text>
          </View>

          <GlassSurface tone="neutral" style={styles.timeCard}>
            <View style={styles.timeInner}>
              <ClockIcon size={32} color={Colors.textPrimary} strokeWidth={2.2} />
              <View>
                <Text style={styles.timeTitle}>{t.riskWindow}</Text>
                <Text style={styles.timeSub}>{t.riskWindowSub}</Text>
              </View>
            </View>
          </GlassSurface>

          <View style={styles.actions}>
            <CivicButton
              title={t.goToSafety}
              variant="primary-safety"
              icon={<ShieldCheckIcon size={24} color={Colors.textOnColor} strokeWidth={2.5} />}
              showChevron
              onPress={() => router.push('/safety')}
            />
            <CivicButton
              title={t.needHelp}
              variant="outline-emergency"
              icon={<MedicalCrossIcon size={22} color={Colors.emergencyRed} />}
              showChevron
              onPress={() => router.push('/help')}
            />
          </View>

          <View style={styles.footer}>
            <TimestampMeta
              isoTimestamp={lastSyncTimestamp}
              language={language}
              prefix={t.officialUpdate}
              mode="official"
            />
            <Text style={styles.agency}>{t.coordinatingAgency}</Text>
            <Text style={styles.proto}>{t.fictionalPrototype}</Text>
          </View>
        </ScrollView>
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
  offline: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
  offlineText: {
    textAlign: 'center',
    color: Colors.warningAmberDark,
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.5,
    paddingVertical: 8,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.hairlineRingOnColor,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textOnColor,
    letterSpacing: 0.5,
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: Colors.hairlineRingOnColor,
  },
  headline: {
    alignItems: 'center',
    marginTop: 28,
    marginHorizontal: 20,
  },
  affected: {
    fontSize: 27,
    fontWeight: '900',
    color: Colors.emergencyRed,
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 33,
  },
  leave: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: 10,
  },
  timeCard: {
    marginHorizontal: 16,
    marginTop: 24,
  },
  timeInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  timeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  timeSub: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    marginTop: 20,
    marginHorizontal: 16,
    gap: 12,
  },
  footer: {
    alignItems: 'center',
    marginTop: 24,
    gap: 2,
  },
  agency: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  proto: {
    fontSize: 11,
    color: Colors.textFaint,
    marginTop: 2,
  },
});
