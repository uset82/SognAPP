import React, { useEffect } from 'react';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmergencyProvider, useEmergency } from '../context/EmergencyContext';
import { Colors } from '../constants/theme';
import { WELCOME_SEEN_KEY } from '../constants/storage';
import { WebAppShell } from '../components/ui/WebAppShell';
import { registerNotificationListeners } from '../services/notificationService';

function AppNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const { triggerFlamScenario } = useEmergency();

  useEffect(() => {
    const unsubscribe = registerNotificationListeners(
      () => {
        triggerFlamScenario();
      },
      () => {
        triggerFlamScenario();
        router.replace('/alert');
      }
    );

    return () => {
      unsubscribe();
    };
  }, [triggerFlamScenario, router]);

  useEffect(() => {
    let cancelled = false;
    AsyncStorage.getItem(WELCOME_SEEN_KEY)
      .then((seen) => {
        if (cancelled) {
          return;
        }
        if (!seen && (pathname === '/' || pathname === '/index')) {
          router.replace('/welcome');
        }
      })
      .catch(() => undefined);

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { flex: 1, minHeight: 0, backgroundColor: Colors.canvasMint },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="welcome" options={{ animation: 'fade' }} />
      <Stack.Screen name="alert" options={{ animation: 'fade' }} />
      <Stack.Screen name="safety" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="evacuate" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="help" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="safe" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="permissions" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <WebAppShell>
      <SafeAreaProvider style={{ flex: 1, minHeight: 0, height: '100%', backgroundColor: Colors.canvas }}>
        <EmergencyProvider>
          <StatusBar style="dark" />
          <AppNavigation />
        </EmergencyProvider>
      </SafeAreaProvider>
    </WebAppShell>
  );
}
