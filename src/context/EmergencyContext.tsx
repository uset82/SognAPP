import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import { Incident, SafeZone, EvacuationRoute, HelpCondition, HelpRequest } from '../types/incident';
import { Language, TranslationStrings, translations } from '../constants/translations';
import {
  triggerSafetyConfirmationHaptic,
  triggerWarningHaptic,
} from '../services/haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  registerDeviceWithSimulator,
  fetchIncidentFromSimulator,
  startScenarioOnSimulator,
  transmitHelpRequestToSimulator,
  transmitSafeReportToSimulator,
} from '../services/api';
import { getCachedPushToken, triggerLocalTestEmergencyNotification } from '../services/notificationService';
import { playEmergencyAlert, stopEmergencyAlert } from '../services/alertSound';
import {
  Coordinates,
  SCENARIO_QUAY_COORDINATES,
  getCurrentCivicLocation,
  projectCoordsToSchematic,
  calculateHaversineDistanceMeters,
  estimateWalkingMinutes,
  SchematicOffset,
} from '../services/locationService';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

interface EmergencyContextType {
  hasActiveIncident: boolean;
  incident: Incident | null;
  activeHelpRequest: HelpRequest | null;
  isDegradedConnection: boolean;
  isSafeReported: boolean;
  testMode: boolean;
  language: Language;
  t: TranslationStrings;
  safeZones: SafeZone[];
  lastSyncTimestamp: string;
  offlineCacheStatus: string;
  civicCoords: Coordinates;
  civicOffset: SchematicOffset;
  locationPermissionGranted: boolean;
  notificationPermissionGranted: boolean;
  selectedZoneId: string;
  enrichedZones: SafeZone[];

  triggerVesselEmergencyScenario: () => Promise<void>;
  clearScenario: () => void;
  submitHelpRequest: (condition: HelpCondition) => Promise<void>;
  acknowledgeHelpRequest: () => void;
  reportIAmSafe: () => Promise<void>;
  toggleDegradedConnection: () => void;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  setSelectedZoneId: (id: string) => void;
  refreshPermissions: () => Promise<void>;
}

export const verifiedSafeZones: SafeZone[] = [
  {
    id: 'safe-fjordvik-school',
    name: 'Fjordvik Skule & Samfunnshus',
    distanceMeters: 650,
    walkMinutes: 8,
    status: 'OPEN_AND_CONFIRMED',
    shortDescription: 'Primary heated civic assembly shelter with designated first aid point and emergency water supply.',
    address: 'Kaivegen 12, 5743 Fjordvik',
    elevationMeters: 18,
    capacity: 450,
    facilities: ['Heated Assembly Hall', 'Paramedic First Aid', 'Backup Generator', 'Drinking Water'],
    latitude: 60.8628,
    longitude: 7.1132,
    confirmedTimestamp: '14:42',
  },
  {
    id: 'safe-fjordvik-heights',
    name: 'Fjordvik Heights Assembly Ground',
    distanceMeters: 850,
    walkMinutes: 11,
    status: 'OPEN_AND_CONFIRMED',
    shortDescription: 'Elevated outdoor assembly area 45 meters above sea level, completely clear of harbor surge or fuel smoke.',
    address: 'Fjordvik Heights, 5743 Fjordvik',
    elevationMeters: 45,
    capacity: 800,
    facilities: ['High Ground Elevation', 'Clear Line of Sight', 'Emergency Lighting', 'Helicopter Winch Zone'],
    latitude: 60.8655,
    longitude: 7.1210,
    confirmedTimestamp: '14:44',
  },
  {
    id: 'safe-nordvikhallen',
    name: 'Nordvikhallen Regional Shelter',
    distanceMeters: 9400,
    walkMinutes: 115,
    status: 'STANDBY',
    shortDescription: 'Major municipal disaster reception sports complex with large sleeping quarters, kitchen, and triage.',
    address: 'Skulevegen 6, 5745 Nordvik',
    elevationMeters: 25,
    capacity: 1200,
    facilities: ['Regional Triage Station', 'Full Kitchen & Beds', 'Bus Evacuation Destination', 'Red Cross Unit'],
    latitude: 60.9062,
    longitude: 7.1884,
    confirmedTimestamp: '14:30',
  },
];

const defaultSafeZone: SafeZone = verifiedSafeZones[0];

const defaultRoute: EvacuationRoute = {
  routeId: 'route-fjordvik-01',
  destinationSafeZone: defaultSafeZone,
  remainingDistanceMeters: 520,
  estimatedWalkingMinutes: 6,
  primaryInstruction: 'CONTINUE NORTH',
  secondaryInstruction: 'Turn left in 120 m away from the waterfront kai',
  routeStatus: 'CLEAR',
  blockedAreas: ['Fjordvik Kai 1-3'],
  verifiedTimestamp: '14:47',
};

export const vesselIncidentMock: Incident = {
  id: 'inc-fjordvik-2026-11',
  title: 'Engine-room fire aboard MS Nordic Horizon',
  shortDescription: 'Engine-room fire with smoke on two decks. Vessel heading for Fjordvik quay with 3,200 passengers and 1,100 crew.',
  type: 'VESSEL_FIRE',
  severity: 'CRITICAL',
  status: 'ACTIVE',
  locationName: 'Fjordvik quay',
  affectedZoneName: 'Inner Kai Waterfront Zone A',
  createdTimestamp: '14:40',
  lastVerifiedTimestamp: '14:47',
  primarySafeZone: defaultSafeZone,
  defaultRoute: defaultRoute,
  isInsideAffectedZone: true,
};

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

const enrichZones = (coords: Coordinates): SafeZone[] =>
  verifiedSafeZones.map((zone) => {
    const distanceMeters = calculateHaversineDistanceMeters(coords, {
      latitude: zone.latitude,
      longitude: zone.longitude,
    });
    return {
      ...zone,
      distanceMeters,
      walkMinutes: estimateWalkingMinutes(distanceMeters, zone.elevationMeters ?? 10),
    };
  });

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasActiveIncident, setHasActiveIncident] = useState(false);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [activeHelpRequest, setActiveHelpRequest] = useState<HelpRequest | null>(null);
  const [isDegradedConnection, setIsDegradedConnection] = useState(false);
  const [isSafeReported, setIsSafeReported] = useState(false);
  const [testMode] = useState(true);
  const [language, setLanguageState] = useState<Language>('en');
  const [safeZones, setSafeZones] = useState<SafeZone[]>(verifiedSafeZones);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState(new Date().toISOString());
  const [offlineCacheStatus] = useState('Up to date • Stored locally on device');
  const [civicCoords, setCivicCoords] = useState<Coordinates>(SCENARIO_QUAY_COORDINATES);
  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false);
  const [notificationPermissionGranted, setNotificationPermissionGranted] = useState(false);
  const [selectedZoneId, setSelectedZoneId] = useState(defaultSafeZone.id);
  const localScenarioLock = useRef(false);
  const followingRemoteIncident = useRef(false);

  const persistLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem('@sogn_safe_language', lang).catch(() => undefined);
  };

  const refreshPermissions = useCallback(async () => {
    if (Platform.OS === 'web') {
      setLocationPermissionGranted(true);
      setNotificationPermissionGranted(true);
      return;
    }

    try {
      const loc = await Location.getForegroundPermissionsAsync();
      setLocationPermissionGranted(loc.status === 'granted');
    } catch {
      setLocationPermissionGranted(false);
    }
    try {
      const notif = await Notifications.getPermissionsAsync();
      setNotificationPermissionGranted(notif.status === 'granted');
    } catch {
      setNotificationPermissionGranted(false);
    }
  }, []);

  useEffect(() => {
    async function loadStoredState() {
      try {
        const storedLang = await AsyncStorage.getItem('@sogn_safe_language');
        if (storedLang === 'en' || storedLang === 'no') {
          setLanguageState(storedLang);
        }
        // Start fresh in calm SAFE / READY mode by default (no active alert in the beginning).
        await AsyncStorage.removeItem('@sogn_safe_cached_incident').catch(() => undefined);
        const storedZone = await AsyncStorage.getItem('@sogn_safe_selected_zone');
        if (storedZone) {
          setSelectedZoneId(storedZone);
        }

        const civic = await getCurrentCivicLocation();
        setCivicCoords(civic.coords);
        setLocationPermissionGranted(civic.permissionGranted);
        setSafeZones(enrichZones(civic.coords));
        setLastSyncTimestamp(new Date().toISOString());

        await refreshPermissions();

        const pushToken = await getCachedPushToken();
        await registerDeviceWithSimulator('IPHONE-TEST-01', pushToken);
      } catch {
        setSafeZones(enrichZones(SCENARIO_QUAY_COORDINATES));
      }
    }
    loadStoredState();

    const isLocalSimulatorAvailable =
      Platform.OS !== 'web' ||
      (typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'));

    if (!isLocalSimulatorAvailable) {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const remoteState = await fetchIncidentFromSimulator();
        if (remoteState) {
          setLastSyncTimestamp(new Date().toISOString());
          if (typeof remoteState.isDegradedConnection === 'boolean') {
            setIsDegradedConnection(remoteState.isDegradedConnection);
          }
          if (remoteState.hasActiveIncident && remoteState.incident) {
            followingRemoteIncident.current = true;
            localScenarioLock.current = false;
            setIncident(remoteState.incident);
            setHasActiveIncident(true);
          } else if (!remoteState.hasActiveIncident && !localScenarioLock.current) {
            if (followingRemoteIncident.current && !isSafeReported) {
              followingRemoteIncident.current = false;
              setHasActiveIncident(false);
              setIncident(null);
            }
          }
        }
      } catch {
        // Offline or detached mode
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isSafeReported, refreshPermissions]);

  const toggleLanguage = () => {
    persistLanguage(language === 'en' ? 'no' : 'en');
  };

  const t = translations[language];
  const civicOffset = projectCoordsToSchematic(civicCoords);
  const enrichedZones = safeZones;

  const triggerVesselEmergencyScenario = async () => {
    localScenarioLock.current = true;
    followingRemoteIncident.current = false;
    setIncident(vesselIncidentMock);
    setHasActiveIncident(true);
    setIsSafeReported(false);
    setActiveHelpRequest(null);
    setLastSyncTimestamp(new Date().toISOString());
    AsyncStorage.setItem('@sogn_safe_cached_incident', JSON.stringify(vesselIncidentMock)).catch(() => undefined);
    await playEmergencyAlert();
    await triggerLocalTestEmergencyNotification(vesselIncidentMock);
    await startScenarioOnSimulator();
  };

  const clearScenario = () => {
    localScenarioLock.current = false;
    followingRemoteIncident.current = false;
    setHasActiveIncident(false);
    setIncident(null);
    setActiveHelpRequest(null);
    setIsSafeReported(false);
    void stopEmergencyAlert();
    triggerSafetyConfirmationHaptic();
    AsyncStorage.removeItem('@sogn_safe_cached_incident').catch(() => undefined);
  };

  const submitHelpRequest = async (condition: HelpCondition) => {
    const locationName = 'Fjordvik Kai / Sentrum';
    const newRequest: HelpRequest = {
      id: `help-${Date.now().toString().slice(-4)}`,
      incidentId: incident?.id || 'inc-test',
      condition,
      state: 'RECEIVED',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      approximateLocation: {
        name: locationName,
        latitude: civicCoords.latitude,
        longitude: civicCoords.longitude,
      },
      deviceId: 'IPHONE-TEST-01',
    };
    setActiveHelpRequest(newRequest);
    await transmitHelpRequestToSimulator(condition, 'IPHONE-TEST-01', locationName);

    setTimeout(() => {
      setActiveHelpRequest((prev) =>
        prev
          ? {
              ...prev,
              state: 'ACKNOWLEDGED',
              acknowledgedTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              responderNote: 'Hovedredningssentralen / Local response team has registered your location.',
            }
          : null
      );
    }, 2000);
  };

  const acknowledgeHelpRequest = () => {
    if (activeHelpRequest) {
      setActiveHelpRequest({
        ...activeHelpRequest,
        state: 'ACKNOWLEDGED',
        acknowledgedTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }
  };

  const reportIAmSafe = async () => {
    setIsSafeReported(true);
    triggerSafetyConfirmationHaptic();
    await transmitSafeReportToSimulator('IPHONE-TEST-01', 'Fjordvik Skule & Samfunnshus');
  };

  const toggleDegradedConnection = () => {
    setIsDegradedConnection((prev) => {
      const next = !prev;
      if (next) triggerWarningHaptic();
      return next;
    });
  };

  const handleSelectZone = (id: string) => {
    setSelectedZoneId(id);
    AsyncStorage.setItem('@sogn_safe_selected_zone', id).catch(() => undefined);
  };

  return (
    <EmergencyContext.Provider
      value={{
        hasActiveIncident,
        incident,
        activeHelpRequest,
        isDegradedConnection,
        isSafeReported,
        testMode,
        language,
        t,
        safeZones,
        lastSyncTimestamp,
        offlineCacheStatus,
        civicCoords,
        civicOffset,
        locationPermissionGranted,
        notificationPermissionGranted,
        selectedZoneId,
        enrichedZones,
        triggerVesselEmergencyScenario,
        clearScenario,
        submitHelpRequest,
        acknowledgeHelpRequest,
        reportIAmSafe,
        toggleDegradedConnection,
        toggleLanguage,
        setLanguage: persistLanguage,
        setSelectedZoneId: handleSelectZone,
        refreshPermissions,
      }}
    >
      {children}
    </EmergencyContext.Provider>
  );
};

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};
