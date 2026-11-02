import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Deployed demo hub. Override with EXPO_PUBLIC_SIMULATOR_URL when needed.
 * This keeps Canner/native builds connected even if the host does not expose
 * public build-time environment variables.
 */
export const DEFAULT_HUB_URL = 'https://sogn-safe-hub-production.up.railway.app';

/**
 * Resolve the shared hub:
 * - EXPO_PUBLIC_SIMULATOR_URL wins when set
 * - localhost web: http://localhost:4000
 * - deployed web: the Railway hub
 * - native dev: hostUri:4000
 * - native production: the Railway hub
 */
export function getHubUrl(): string {
  const configured = process.env.EXPO_PUBLIC_SIMULATOR_URL;
  if (configured) {
    return configured.replace(/\/$/, '');
  }

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:4000';
    }
    return DEFAULT_HUB_URL;
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    return `http://${hostUri.split(':')[0]}:4000`;
  }

  return DEFAULT_HUB_URL;
}
