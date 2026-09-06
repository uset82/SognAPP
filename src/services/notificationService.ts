import { Platform, Linking } from 'react-native';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { Incident } from '../types/incident';

const PUSH_TOKEN_STORAGE_KEY = '@sogn_safe_push_token';
const PERMISSION_STATUS_KEY = '@sogn_safe_notification_permission';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
      priority: Notifications.AndroidNotificationPriority.MAX,
    }),
  });
}

export interface NotificationPermissionResult {
  status: Notifications.PermissionStatus;
  granted: boolean;
  canAskAgain: boolean;
}

/**
 * Request iOS notification permissions with alert, sound, and badge
 */
export async function requestNotificationPermissions(): Promise<NotificationPermissionResult> {
  if (Platform.OS === 'web') {
    return {
      status: Notifications.PermissionStatus.GRANTED,
      granted: true,
      canAskAgain: true,
    };
  }

  const existing = await Notifications.getPermissionsAsync();
  let finalStatus = existing.status;

  if (existing.status !== 'granted') {
    const requested = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
      },
    });
    finalStatus = requested.status;
  }

  const isGranted = finalStatus === 'granted';
  await AsyncStorage.setItem(PERMISSION_STATUS_KEY, finalStatus);

  return {
    status: finalStatus,
    granted: isGranted,
    canAskAgain: existing.canAskAgain,
  };
}

/**
 * Retrieve cached permission status from local storage
 */
export async function getCachedPermissionStatus(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(PERMISSION_STATUS_KEY);
  } catch {
    return null;
  }
}

/**
 * Obtain push token for physical test device or return mock simulator token
 */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return 'web-mock-push-token';
  }

  try {
    const permissions = await Notifications.getPermissionsAsync();
    if (permissions.status !== 'granted') {
      return null;
    }

    // Try to get Expo Push Token
    let token: string | null = null;
    try {
      const response = await Notifications.getExpoPushTokenAsync();
      token = response.data;
    } catch {
      // In local simulator or standalone without Expo project ID, use device fallback token
      token = `SIMULATOR-DEVICE-TOKEN-${Platform.OS.toUpperCase()}-${Date.now()}`;
    }

    if (token) {
      await AsyncStorage.setItem(PUSH_TOKEN_STORAGE_KEY, token);
    }
    return token;
  } catch {
    return null;
  }
}

/**
 * Read cached push token
 */
export async function getCachedPushToken(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(PUSH_TOKEN_STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * Open iOS App Settings when permission is permanently denied
 */
export function openDeviceSettings(): void {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
}

/**
 * Dispatch an immediate test emergency notification (works on physical iPhone and Simulator)
 */
export async function triggerLocalTestEmergencyNotification(incident: Incident): Promise<string | null> {
  if (Platform.OS === 'web') {
    return null;
  }

  try {
    const permission = await requestNotificationPermissions();
    if (!permission.granted) {
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: `EMERGENCY ALERT: ${incident.title.toUpperCase()}`,
        body: incident.shortDescription,
        data: {
          incidentId: incident.id,
          route: '/alert',
          severity: incident.severity,
        },
        sound: 'default',
        priority: 'high',
      },
      trigger: null,
    });

    return notificationId;
  } catch {
    return null;
  }
}

/**
 * Register notification interaction listeners for foreground and tap responses
 */
export function registerNotificationListeners(
  onNotificationReceived?: (notification: Notifications.Notification) => void,
  onIncidentDeepLink?: (incidentId: string) => void
): () => void {
  if (Platform.OS === 'web') {
    return () => undefined;
  }

  const receivedSubscription = Notifications.addNotificationReceivedListener((notification) => {
    onNotificationReceived?.(notification);
  });

  // Notification tap / interaction listener
  const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    if (data?.route === '/alert') {
      onIncidentDeepLink?.(data.incidentId as string);
      router.push('/alert');
    }
  });

  return () => {
    receivedSubscription.remove();
    responseSubscription.remove();
  };
}
