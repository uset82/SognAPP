import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { HelpCondition, HelpRequest } from '../types/incident';

/**
 * Determine the local server URL:
 * - On web: http://localhost:4000
 * - On physical device or iOS simulator: use hostUri from Expo Constants or fallback to localhost
 */
function getSimulatorServerUrl(): string {
  if (Platform.OS === 'web') {
    return 'http://localhost:4000';
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    return `http://${ip}:4000`;
  }

  return 'http://localhost:4000';
}

const BASE_URL = getSimulatorServerUrl();

/**
 * Register test device and push token with the backend
 */
export async function registerDeviceWithSimulator(deviceId: string, pushToken?: string | null): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/devices`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, pushToken }),
    });
    return response.ok;
  } catch {
    // Offline or simulator server not running
    return false;
  }
}

/**
 * Fetch live incident state from the simulator dispatcher
 */
export async function fetchIncidentFromSimulator(): Promise<{
  incident: any | null;
  hasActiveIncident: boolean;
  isDegradedConnection: boolean;
} | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/incident`);
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Transmit civilian help request to simulator dispatch
 */
export async function transmitHelpRequestToSimulator(
  condition: HelpCondition,
  deviceId: string,
  locationName: string = 'Flåm Waterfront'
): Promise<HelpRequest | null> {
  try {
    const response = await fetch(`${BASE_URL}/api/help`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ condition, deviceId, location: locationName }),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return data.request;
  } catch {
    return null;
  }
}

/**
 * Transmit civilian safe arrival report
 */
export async function transmitSafeReportToSimulator(
  deviceId: string,
  safeZoneName: string = 'Flåm Skule & Samfunnshus'
): Promise<boolean> {
  try {
    const response = await fetch(`${BASE_URL}/api/safe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, safeZoneName }),
    });
    return response.ok;
  } catch {
    return false;
  }
}
