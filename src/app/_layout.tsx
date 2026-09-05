import React, { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { EmergencyProvider, useEmergency } from '../context/EmergencyContext';
import { Colors } from '../constants/theme';
import { registerNotificationListeners } from '../services/notificationService';

function AppNavigation() {
  const router = useRouter();
  const { triggerFlamScenario } = useEmergency();

  useEffect(() => {
    const unsubscribe = registerNotificationListeners(
      (notification) => {
        // When notification is received in foreground, trigger the incident in context
        triggerFlamScenario();
      },
      (incidentId) => {
        // When notification is tapped by user from background/lockscreen
        triggerFlamScenario();
        router.push('/alert');
      }
    );

    return () => {
      unsubscribe();
    };
  }, [triggerFlamScenario, router]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.canvas },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="index" />
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
    <SafeAreaProvider style={{ backgroundColor: Colors.canvas }}>
      <EmergencyProvider>
        <StatusBar style="light" />
        <AppNavigation />
      </EmergencyProvider>
    </SafeAreaProvider>
  );
}
