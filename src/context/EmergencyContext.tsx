import React, { createContext, useContext, useState, useEffect } from 'react';
import { Incident, SafeZone, EvacuationRoute, HelpCondition, HelpRequest } from '../types/incident';
import { Language, TranslationStrings, translations } from '../constants/translations';
import { 
  triggerEmergencyAlertHaptic, 
  triggerSafetyConfirmationHaptic, 
  triggerWarningHaptic 
} from '../services/haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  registerDeviceWithSimulator, 
  fetchIncidentFromSimulator, 
  transmitHelpRequestToSimulator, 
  transmitSafeReportToSimulator 
} from '../services/api';
import { getCachedPushToken } from '../services/notificationService';

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
  
  // Actions
  triggerFlamScenario: () => void;
  clearScenario: () => void;
  submitHelpRequest: (condition: HelpCondition) => Promise<void>;
  acknowledgeHelpRequest: () => void;
  reportIAmSafe: () => Promise<void>;
  toggleDegradedConnection: () => void;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
}

export const verifiedSafeZones: SafeZone[] = [
  {
    id: 'safe-flam-school',
    name: 'Flåm Skule & Samfunnshus',
    distanceMeters: 650,
    walkMinutes: 8,
    status: 'OPEN_AND_CONFIRMED',
    shortDescription: 'Primary heated civic assembly shelter with designated first aid point and emergency water supply.',
    address: 'Nedre Brekkevegen 12, 5743 Flåm',
    elevationMeters: 18,
    capacity: 450,
    facilities: ['Heated Assembly Hall', 'Paramedic First Aid', 'Backup Generator', 'Drinking Water'],
    latitude: 60.8628,
    longitude: 7.1132,
    confirmedTimestamp: '14:42',
  },
  {
    id: 'safe-fretheim-heights',
    name: 'Fretheim Høyde Assembly Ground',
    distanceMeters: 850,
    walkMinutes: 11,
    status: 'OPEN_AND_CONFIRMED',
    shortDescription: 'Elevated outdoor assembly area 45 meters above sea level, completely clear of harbor surge or fuel smoke.',
    address: 'Fretheimsberget, 5743 Flåm',
    elevationMeters: 45,
    capacity: 800,
    facilities: ['High Ground Elevation', 'Clear Line of Sight', 'Emergency Lighting', 'Helicopter Winch Zone'],
    latitude: 60.8655,
    longitude: 7.1210,
    confirmedTimestamp: '14:44',
  },
  {
    id: 'safe-aurlandshallen',
    name: 'Aurlandshallen Regional Shelter',
    distanceMeters: 9400,
    walkMinutes: 115,
    status: 'STANDBY',
    shortDescription: 'Major municipal disaster reception sports complex with large sleeping quarters, kitchen, and triage.',
    address: 'Skulevegen 6, 5745 Aurland',
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
  routeId: 'route-flam-01',
  destinationSafeZone: defaultSafeZone,
  remainingDistanceMeters: 520,
  estimatedWalkingMinutes: 6,
  primaryInstruction: 'CONTINUE NORTH',
  secondaryInstruction: 'Turn left in 120 m away from the waterfront kai',
  routeStatus: 'CLEAR',
  blockedAreas: ['Flåm Harbor Waterfront Kai 1-3'],
  verifiedTimestamp: '14:47',
};

export const flamIncidentMock: Incident = {
  id: 'inc-flam-2026-09',
  title: 'Possible vessel collision near Flåm harbor',
  shortDescription: 'Large passenger vessel experiencing maneuvering failure approaching Flåm kai.',
  type: 'VESSEL_COLLISION',
  severity: 'CRITICAL',
  status: 'ACTIVE',
  locationName: 'Flåm Harbor',
  affectedZoneName: 'Inner Kai Waterfront Zone A',
  createdTimestamp: '14:40',
  lastVerifiedTimestamp: '14:47',
  primarySafeZone: defaultSafeZone,
  defaultRoute: defaultRoute,
  isInsideAffectedZone: true,
};

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const EmergencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasActiveIncident, setHasActiveIncident] = useState(false);
  const [incident, setIncident] = useState<Incident | null>(null);
  const [activeHelpRequest, setActiveHelpRequest] = useState<HelpRequest | null>(null);
  const [isDegradedConnection, setIsDegradedConnection] = useState(false);
  const [isSafeReported, setIsSafeReported] = useState(false);
  const [testMode] = useState(true);
  const [language, setLanguage] = useState<Language>('en');
  const [safeZones] = useState<SafeZone[]>(verifiedSafeZones);
  const [lastSyncTimestamp] = useState('Today 20:45 CET');
  const [offlineCacheStatus] = useState('Up to date • Stored locally on device');

  // Hydrate from AsyncStorage on startup & register with simulator
  useEffect(() => {
    async function loadStoredState() {
      try {
        const storedLang = await AsyncStorage.getItem('@sogn_safe_language');
        if (storedLang === 'en' || storedLang === 'no') {
          setLanguage(storedLang);
        }
        const storedIncident = await AsyncStorage.getItem('@sogn_safe_cached_incident');
        if (storedIncident) {
          const parsed = JSON.parse(storedIncident);
          setIncident(parsed);
          setHasActiveIncident(true);
        }

        // Register device with simulator
        const pushToken = await getCachedPushToken();
        await registerDeviceWithSimulator('IPHONE-TEST-01', pushToken);
      } catch {
        // Fallback gracefully to default memory state
      }
    }
    loadStoredState();

    // Periodic sync with simulator dispatcher if reachable
    const interval = setInterval(async () => {
      try {
        const remoteState = await fetchIncidentFromSimulator();
        if (remoteState) {
          if (typeof remoteState.isDegradedConnection === 'boolean') {
            setIsDegradedConnection(remoteState.isDegradedConnection);
          }
          if (remoteState.hasActiveIncident && remoteState.incident) {
            setIncident(remoteState.incident);
            setHasActiveIncident(true);
          } else if (!remoteState.hasActiveIncident && !isSafeReported) {
            // If remote cleared incident and user is not mid-flow
            setHasActiveIncident(false);
            setIncident(null);
          }
        }
      } catch {
        // Offline or detached mode
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [isSafeReported]);

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === 'en' ? 'no' : 'en';
      AsyncStorage.setItem('@sogn_safe_language', next).catch(() => {});
      return next;
    });
  };

  const t = translations[language];

  const triggerFlamScenario = () => {
    setIncident(flamIncidentMock);
    setHasActiveIncident(true);
    setIsSafeReported(false);
    setActiveHelpRequest(null);
    triggerEmergencyAlertHaptic();
    AsyncStorage.setItem('@sogn_safe_cached_incident', JSON.stringify(flamIncidentMock)).catch(() => {});
  };

  const clearScenario = () => {
    setHasActiveIncident(false);
    setIncident(null);
    setActiveHelpRequest(null);
    setIsSafeReported(false);
    triggerSafetyConfirmationHaptic();
    AsyncStorage.removeItem('@sogn_safe_cached_incident').catch(() => {});
  };

  const submitHelpRequest = async (condition: HelpCondition) => {
    const newRequest: HelpRequest = {
      id: `help-${Date.now().toString().slice(-4)}`,
      incidentId: incident?.id || 'inc-test',
      condition,
      state: 'RECEIVED',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      approximateLocation: {
        name: 'Near Flåm Station / Waterfront Area',
        latitude: 60.8635,
        longitude: 7.1145,
      },
      deviceId: 'IPHONE-TEST-01',
    };
    setActiveHelpRequest(newRequest);

    // Transmit to simulator backend
    await transmitHelpRequestToSimulator(condition, 'IPHONE-TEST-01', 'Near Flåm Waterfront Area');

    // Simulate simulator acknowledgment after 2 seconds for classroom demo
    setTimeout(() => {
      setActiveHelpRequest((prev) => 
        prev ? {
          ...prev,
          state: 'ACKNOWLEDGED',
          acknowledgedTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          responderNote: 'Hovedredningssentralen / Local response team has registered your location.',
        } : null
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
    await transmitSafeReportToSimulator('IPHONE-TEST-01', 'Flåm Skule & Samfunnshus');
  };

  const toggleDegradedConnection = () => {
    setIsDegradedConnection((prev) => {
      const next = !prev;
      if (next) triggerWarningHaptic();
      return next;
    });
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
        triggerFlamScenario,
        clearScenario,
        submitHelpRequest,
        acknowledgeHelpRequest,
        reportIAmSafe,
        toggleDegradedConnection,
        toggleLanguage,
        setLanguage,
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
