export { requestAgentChat, transcribeAudioOnBackend } from './agentClient';

import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { HelpCondition, HelpRequest } from '../types/incident';

/**
 * Determine the local server URL:
 * - On web: http://localhost:4000
 * - On physical device or iOS simulator: use hostUri from Expo Constants or fallback to localhost
 */
function getSimulatorServerUrl(): string | null {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:4000';
      }
      // Remote deployment (e.g. sognsafe.canner.app) has no local simulator server
      return null;
    }
    return null;
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
  if (!BASE_URL) return false;
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

export async function startFlamScenarioOnSimulator(): Promise<boolean> {
  if (!BASE_URL) return false;
  try {
    const response = await fetch(`${BASE_URL}/api/scenario/flam`, {
      method: 'POST',
    });
    return response.ok;
  } catch {
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
  if (!BASE_URL) return null;
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
  if (!BASE_URL) return null;
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
  if (!BASE_URL) return false;
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
