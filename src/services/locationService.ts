import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { SafeZone } from '../types/incident';
import { verifiedSafeZones } from '../context/EmergencyContext';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Default classroom simulation coordinate: Flåm Kai / Sentrum
export const FLAM_WATERFRONT_COORDINATES: Coordinates = {
  latitude: 60.8635,
  longitude: 7.1145,
};

let simulatedLocationOverride: Coordinates | null = null;

/**
 * Set an in-memory test location override for simulation
 */
export function setSimulationLocationOverride(coords: Coordinates | null): void {
  simulatedLocationOverride = coords;
}

/**
 * Calculate distance between two coordinates in meters using the Haversine formula
 */
export function calculateHaversineDistanceMeters(
  coord1: Coordinates,
  coord2: Coordinates
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (coord1.latitude * Math.PI) / 180;
  const φ2 = (coord2.latitude * Math.PI) / 180;
  const Δφ = ((coord2.latitude - coord1.latitude) * Math.PI) / 180;
  const Δλ = ((coord2.longitude - coord1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Estimate walking minutes based on standard pedestrian speed (5 km/h) plus incline buffer
 */
export function estimateWalkingMinutes(distanceMeters: number, elevationGainMeters: number = 0): number {
  const flatMinutes = distanceMeters / 80; // ~4.8 km/h = 80 m/min
  const climbMinutes = elevationGainMeters / 10; // ~10m climb = +1 min
  return Math.max(1, Math.round(flatMinutes + climbMinutes));
}

/**
 * Request foreground GPS permission and acquire current position.
 * Strictly foreground-only: no background tracking is ever initiated.
 */
export async function getCurrentCivicLocation(): Promise<{
  coords: Coordinates;
  isSimulated: boolean;
  permissionGranted: boolean;
}> {
  if (simulatedLocationOverride) {
    return {
      coords: simulatedLocationOverride,
      isSimulated: true,
      permissionGranted: true,
    };
  }

  if (Platform.OS === 'web') {
    return {
      coords: FLAM_WATERFRONT_COORDINATES,
      isSimulated: true,
      permissionGranted: true,
    };
  }

  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      return {
        coords: FLAM_WATERFRONT_COORDINATES,
        isSimulated: true,
        permissionGranted: false,
      };
    }

    const loc = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      coords: {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      },
      isSimulated: false,
      permissionGranted: true,
    };
  } catch {
    return {
      coords: FLAM_WATERFRONT_COORDINATES,
      isSimulated: true,
      permissionGranted: false,
    };
  }
}

/**
 * Find the nearest confirmed open safe zone to a given coordinate
 */
export interface SchematicOffset {
  x: number;
  y: number;
}

/**
 * Project civic GPS onto the Flåm schematic so the YOU marker can move
 * without a real map SDK. Waterfront is the origin; offsets are clamped.
 */
export function projectCoordsToSchematic(
  coords: Coordinates,
  origin: Coordinates = FLAM_WATERFRONT_COORDINATES
): SchematicOffset {
  const metersEast = calculateHaversineDistanceMeters(origin, {
    latitude: origin.latitude,
    longitude: coords.longitude,
  });
  const metersNorth = calculateHaversineDistanceMeters(origin, {
    latitude: coords.latitude,
    longitude: origin.longitude,
  });
  const eastSign = coords.longitude >= origin.longitude ? 1 : -1;
  const northSign = coords.latitude >= origin.latitude ? 1 : -1;
  const scale = 0.045;
  return {
    x: Math.max(-36, Math.min(36, eastSign * metersEast * scale)),
    y: Math.max(-36, Math.min(36, -northSign * metersNorth * scale)),
  };
}

export function findNearestSafeZone(
  currentCoords: Coordinates,
  availableZones: SafeZone[] = verifiedSafeZones
): {
  nearestZone: SafeZone;
  distanceMeters: number;
  walkMinutes: number;
} {
  let closestZone = availableZones[0];
  let minDistance = Infinity;

  for (const zone of availableZones) {
    const dist = calculateHaversineDistanceMeters(currentCoords, {
      latitude: zone.latitude,
      longitude: zone.longitude,
    });
    if (dist < minDistance) {
      minDistance = dist;
      closestZone = zone;
    }
  }

  const walkMinutes = estimateWalkingMinutes(minDistance, closestZone.elevationMeters ?? 10);

  return {
    nearestZone: {
      ...closestZone,
      distanceMeters: minDistance,
      walkMinutes,
    },
    distanceMeters: minDistance,
    walkMinutes,
  };
}
