import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

/**
 * FEATURE GATE: Critical Alerts
 *
 * In V1, Apple Critical Alerts are NOT enabled.
 * Apple requires a special entitlement (com.apple.developer.usernotifications.critical-alerts)
 * granted only to approved public safety organizations. SOGN SAFE V1 operates strictly
 * within standard iOS notification channels and makes no false claim about bypassing
 * the hardware Silent switch or Focus modes.
 */
export const CRITICAL_ALERTS_FEATURE_FLAG = {
  enabled: false,
  entitlementId: 'com.apple.developer.usernotifications.critical-alerts',
  reason: 'V1 academic prototype operates under standard user-authorized notification channels.',
};

/**
 * Trigger urgent haptic pattern for incoming emergency incidents
 */
export async function triggerEmergencyAlertHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
  } catch {
    // Graceful fallback if device lacks haptic engine
  }
}

/**
 * Trigger reassuring haptic pattern for safe arrival or report confirmation
 */
export async function triggerSafetyConfirmationHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Graceful fallback
  }
}

/**
 * Trigger warning haptic pattern for degraded connectivity or cautionary alerts
 */
export async function triggerWarningHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  } catch {
    // Graceful fallback
  }
}

/**
 * Trigger crisp impact on primary emergency touch actions
 */
export async function triggerEmergencyImpactHaptic(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  } catch {
    // Graceful fallback
  }
}
