import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { Colors, Spacing, Typography, BorderRadius } from '../constants/theme';
import { EmergencyButton, StatusBanner } from '../components/ui';
import { 
  requestNotificationPermissions, 
  registerForPushNotificationsAsync, 
  openDeviceSettings, 
  triggerLocalTestEmergencyNotification,
  getCachedPushToken
} from '../services/notificationService';
import { useEmergency } from '../context/EmergencyContext';

export default function PermissionsScreen() {
  const router = useRouter();
  const { incident, flamIncidentMock } = useEmergency() as any;
  const [notifStatus, setNotifStatus] = useState<string>('UNDETERMINED');
  const [locStatus, setLocStatus] = useState<string>('UNDETERMINED');
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [testSent, setTestSent] = useState(false);

  useEffect(() => {
    // Check initial cached token
    getCachedPushToken().then((token) => {
      if (token) setPushToken(token);
    });
  }, []);

  const handleRequestNotifications = async () => {
    setIsRequesting(true);
    const result = await requestNotificationPermissions();
    setNotifStatus(result.status);

    if (result.granted) {
      const token = await registerForPushNotificationsAsync();
      setPushToken(token);
    }
    setIsRequesting(false);
  };

  const handleRequestLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocStatus(status);
    } catch {
      setLocStatus('DENIED');
    }
  };

  const handleEnableAll = async () => {
    setIsRequesting(true);
    await handleRequestNotifications();
    await handleRequestLocation();
    setIsRequesting(false);
  };

  const handleSendTestAlert = async () => {
    const activeInc = incident || flamIncidentMock;
    await triggerLocalTestEmergencyNotification(activeInc);
    setTestSent(true);
  };

  const isDenied = notifStatus === 'denied';
  const isGranted = notifStatus === 'granted';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.brandTitle}>SOGN SAFE</Text>
          <Text style={styles.brandSubtitle}>CIVIC PREPAREDNESS ONBOARDING</Text>
        </View>

        <Text style={styles.heading}>PERMISSIONS FOR CIVILIAN SAFETY</Text>
        <Text style={styles.leadText}>
          SOGN SAFE requires two permissions to alert civilians during maritime or coastal incidents in Inner Sogn.
        </Text>

        {/* Permission 1: Emergency Notifications */}
        <View style={styles.permissionCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconCircle}>
              <Text style={styles.cardIcon}>N</Text>
            </View>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Emergency Warnings</Text>
              <Text style={[styles.cardBadge, isGranted && styles.cardBadgeGranted]}>
                {isGranted ? 'ACTIVE' : 'CRITICAL'}
              </Text>
            </View>
          </View>

          <Text style={styles.cardBody}>
            Immediately displays alert banners and plays warning sounds when an active vessel collision or harbor hazard affects Flåm.
          </Text>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>STATUS:</Text>
            <Text style={[styles.statusValue, isGranted && styles.statusGranted, isDenied && styles.statusDenied]}>
              {isGranted ? 'GRANTED' : isDenied ? 'DENIED BY USER' : 'NOT CONFIGURED'}
            </Text>
          </View>

          {isDenied && (
            <View style={styles.deniedGuidanceBox}>
              <Text style={styles.deniedGuidanceText}>
                Notifications are disabled in iOS Settings. Tap below to enable emergency alerts.
              </Text>
              <TouchableOpacity 
                style={styles.openSettingsBtn}
                onPress={openDeviceSettings}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Open iOS system settings"
              >
                <Text style={styles.openSettingsBtnText}>OPEN IOS SETTINGS</Text>
              </TouchableOpacity>
            </View>
          )}

          {isGranted && pushToken && (
            <View style={styles.tokenBox}>
              <Text style={styles.tokenLabel}>SIMULATOR TEST TOKEN REGISTERED:</Text>
              <Text style={styles.tokenValue} numberOfLines={1}>{pushToken}</Text>
            </View>
          )}
        </View>

        {/* Permission 2: Foreground Emergency Positioning */}
        <View style={styles.permissionCard}>
          <View style={styles.cardHeaderRow}>
            <View style={styles.iconCircle}>
              <Text style={styles.cardIcon}>L</Text>
            </View>
            <View style={styles.cardTitleContainer}>
              <Text style={styles.cardTitle}>Local Safety Guidance</Text>
              <Text style={styles.cardBadge}>FOREGROUND ONLY</Text>
            </View>
          </View>

          <Text style={styles.cardBody}>
            Calculates walking distance to the nearest verified assembly shelter in Flåm and attaches approximate coordinates only when you submit &quot;I NEED HELP&quot;.
          </Text>

          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>PRIVACY GUARANTEE:</Text>
            <Text style={styles.privacyNote}>No background tracking. Coordinates stay local on device.</Text>
          </View>
        </View>

        {/* Prototype Disclaimer */}
        <StatusBanner
          variant="safety"
          badge="STUDENT INNOVATION PROTOTYPE"
          title="Fictional Simulation Environment"
          description="SOGN SAFE receives simulated test events for HVL INN524. It is not connected to real 112/HRS services."
        />

        {/* Test Alert Dispatcher Button */}
        {isGranted && (
          <View style={styles.testDispatchSection}>
            <TouchableOpacity
              style={styles.testDispatchButton}
              onPress={handleSendTestAlert}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Send test emergency push notification"
            >
              <Text style={styles.testDispatchButtonText}>
                {testSent ? 'TEST ALERT DISPATCHED (TAP BANNER)' : 'SEND TEST PUSH ALERT TO THIS IPHONE'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Primary Actions */}
        <View style={styles.actionContainer}>
          <EmergencyButton
            title={isGranted ? 'CONTINUE TO SOGN SAFE' : 'ENABLE EMERGENCY PERMISSIONS'}
            subtitle={isGranted ? 'Permissions verified' : 'Authorize notifications & local guidance'}
            variant="primary-safety"
            onPress={isGranted ? () => router.replace('/') : handleEnableAll}
            disabled={isRequesting}
          />

          {!isGranted && (
            <EmergencyButton
              title="CONTINUE WITHOUT PERMISSIONS"
              subtitle="Manual shelter navigation only"
              variant="outline-neutral"
              onPress={() => router.replace('/')}
            />
          )}
        </View>
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
  header: {
    marginBottom: Spacing.md,
  },
  brandTitle: {
    ...Typography.caption,
    color: Colors.textMuted,
    letterSpacing: 1,
    fontSize: 11,
  },
  brandSubtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 10,
    marginTop: 2,
  },
  heading: {
    ...Typography.title1,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  leadText: {
    ...Typography.body,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.lg,
  },
  permissionCard: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardIcon: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  cardTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTitle: {
    ...Typography.headline,
    color: Colors.textPrimary,
  },
  cardBadge: {
    ...Typography.caption,
    fontSize: 9,
    fontWeight: '800',
    color: Colors.warningAmberText,
    backgroundColor: Colors.warningAmberDark,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  cardBadgeGranted: {
    color: Colors.safetyGreenText,
    backgroundColor: Colors.safetyGreenDark,
  },
  cardBody: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  statusRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 10,
  },
  statusValue: {
    ...Typography.caption,
    color: Colors.warningAmberText,
    fontWeight: '700',
    fontSize: 10,
  },
  statusGranted: {
    color: Colors.safetyGreenText,
  },
  statusDenied: {
    color: Colors.emergencyRedText,
  },
  deniedGuidanceBox: {
    backgroundColor: 'rgba(217, 56, 41, 0.1)',
    borderWidth: 1,
    borderColor: Colors.emergencyRedBorder,
    borderRadius: BorderRadius.sm,
    padding: Spacing.sm,
    marginTop: Spacing.sm,
  },
  deniedGuidanceText: {
    ...Typography.caption,
    color: Colors.emergencyRedText,
    lineHeight: 16,
    marginBottom: Spacing.xs,
  },
  openSettingsBtn: {
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.emergencyRedBorder,
    paddingVertical: 8,
    borderRadius: BorderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  openSettingsBtnText: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 11,
  },
  tokenBox: {
    marginTop: Spacing.sm,
    padding: Spacing.xs,
    backgroundColor: Colors.surfaceRaised,
    borderRadius: BorderRadius.xs,
  },
  tokenLabel: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontSize: 9,
  },
  tokenValue: {
    ...Typography.caption,
    color: Colors.safetyGreenText,
    fontSize: 10,
    fontFamily: 'monospace',
    marginTop: 2,
  },
  privacyNote: {
    ...Typography.caption,
    color: Colors.safetyGreenText,
    fontSize: 10,
  },
  testDispatchSection: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  testDispatchButton: {
    backgroundColor: Colors.surfaceRaised,
    borderWidth: 1,
    borderColor: Colors.routeBlue,
    borderRadius: BorderRadius.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  testDispatchButtonText: {
    ...Typography.caption,
    color: Colors.routeBlue,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  actionContainer: {
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
});
