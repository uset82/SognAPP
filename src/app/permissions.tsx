import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Colors, Spacing } from '../constants/theme';
import { CivicButton, GlassSurface, ScreenEnter, StatusBanner } from '../components/ui';
import {
  getCachedPushToken,
  openDeviceSettings,
  registerForPushNotificationsAsync,
  requestNotificationPermissions,
  triggerLocalTestEmergencyNotification,
} from '../services/notificationService';
import { useEmergency, flamIncidentMock } from '../context/EmergencyContext';

export default function PermissionsScreen() {
  const router = useRouter();
  const { incident, t, refreshPermissions } = useEmergency();
  const [notifStatus, setNotifStatus] = useState('UNDETERMINED');
  const [locStatus, setLocStatus] = useState('UNDETERMINED');
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    getCachedPushToken().then((token) => {
      if (token) setPushToken(token);
    });
    refreshPermissions();
  }, [refreshPermissions]);

  const handleRequestNotifications = async () => {
    const result = await requestNotificationPermissions();
    setNotifStatus(result.status);
    if (result.granted) {
      const token = await registerForPushNotificationsAsync();
      setPushToken(token);
    }
    await refreshPermissions();
  };

  const handleRequestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocStatus(status);
    } catch {
      setLocStatus('DENIED');
    }
    await refreshPermissions();
  };

  const handleEnableAll = async () => {
    setIsRequesting(true);
    await handleRequestNotifications();
    await handleRequestLocation();
    setIsRequesting(false);
  };

  const handleSendTestAlert = async () => {
    await triggerLocalTestEmergencyNotification(incident || flamIncidentMock);
    setTestSent(true);
  };

  const isDenied = notifStatus === 'denied';
  const isGranted = notifStatus === 'granted';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScreenEnter>
        <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
          <Text style={styles.brand}>{t.brandTitle}</Text>
          <Text style={styles.heading}>{t.permissionsHeading}</Text>
          <Text style={styles.lead}>{t.permissionsLead}</Text>

          <GlassSurface tone="neutral" style={styles.card}>
            <View style={styles.cardInner}>
              <Text style={styles.cardTitle}>{t.notifTitle}</Text>
              <Text style={styles.cardBody}>{t.notifBody}</Text>
              <Text style={styles.status}>
                {isGranted ? t.statusGranted : isDenied ? t.statusDenied : t.statusPending}
              </Text>
              {isDenied ? (
                <CivicButton title={t.openIosSettings} variant="outline-emergency" onPress={openDeviceSettings} />
              ) : null}
              {isGranted && pushToken ? (
                <Text style={styles.token} numberOfLines={1}>{pushToken}</Text>
              ) : null}
            </View>
          </GlassSurface>

          <GlassSurface tone="mint" style={styles.card}>
            <View style={styles.cardInner}>
              <Text style={styles.cardTitle}>{t.locationTitle}</Text>
              <Text style={styles.cardBody}>{t.locationBody}</Text>
              <Text style={styles.status}>
                {locStatus === 'granted' ? t.statusGranted : locStatus === 'denied' ? t.statusDenied : t.statusPending}
              </Text>
            </View>
          </GlassSurface>

          <StatusBanner
            variant="safety"
            badge={t.trainingMode}
            title={t.fictionalPrototype}
            description={t.trainingDisclaimer}
          />

          {isGranted ? (
            <CivicButton
              title={testSent ? t.testDispatched : t.sendTestPush}
              variant="outline-neutral"
              onPress={handleSendTestAlert}
              style={styles.gap}
            />
          ) : null}

          <View style={styles.actions}>
            <CivicButton
              title={isGranted ? t.continueToApp : t.enablePermissions}
              variant="primary-safety"
              onPress={isGranted ? () => router.replace('/') : handleEnableAll}
              disabled={isRequesting}
            />
            {!isGranted ? (
              <CivicButton
                title={t.continueWithout}
                variant="outline-neutral"
                onPress={() => router.replace('/')}
              />
            ) : null}
          </View>
        </ScrollView>
      </ScreenEnter>
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
  brand: {
    fontSize: 11,
    letterSpacing: 1,
    color: Colors.textMuted,
    fontWeight: '700',
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 8,
  },
  lead: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
    marginTop: 8,
  },
  card: {
    marginBottom: 12,
  },
  cardInner: {
    padding: 16,
    gap: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cardBody: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  status: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.safetyGreen,
  },
  token: {
    fontSize: 10,
    color: Colors.safetyGreen,
    fontFamily: 'monospace',
  },
  gap: {
    marginTop: 8,
  },
  actions: {
    marginTop: 16,
    gap: 10,
  },
});
