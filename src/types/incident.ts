export type IncidentSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type IncidentStatus = 'ACTIVE' | 'RESOLVED' | 'STANDBY';

export type EvacuationState = 'NONE' | 'INSIDE_AFFECTED_AREA' | 'EVACUATING' | 'SAFE';

export interface SafeZone {
  id: string;
  name: string;
  distanceMeters: number;
  walkMinutes: number;
  status: 'OPEN_AND_CONFIRMED' | 'STANDBY' | 'FULL';
  shortDescription: string;
  address?: string;
  elevationMeters?: number;
  capacity?: number;
  facilities?: string[];
  latitude: number;
  longitude: number;
  confirmedTimestamp: string;
}

export interface EvacuationRoute {
  routeId: string;
  destinationSafeZone: SafeZone;
  remainingDistanceMeters: number;
  estimatedWalkingMinutes: number;
  primaryInstruction: string;
  secondaryInstruction: string;
  routeStatus: 'CLEAR' | 'CAUTION' | 'BLOCKED' | 'HAZARD_REROUTED';
  blockedAreas?: string[];
  verifiedTimestamp: string;
}

export interface Incident {
  id: string;
  title: string;
  shortDescription: string;
  type: 'VESSEL_COLLISION' | 'LANDSLIDE' | 'FLOOD' | 'HARBOR_INCIDENT' | 'DRILL';
  severity: IncidentSeverity;
  status: IncidentStatus;
  locationName: string;
  affectedZoneName: string;
  createdTimestamp: string;
  lastVerifiedTimestamp: string;
  primarySafeZone: SafeZone;
  defaultRoute: EvacuationRoute;
  isInsideAffectedZone: boolean;
}

export type HelpCondition = 
  | 'I_AM_INJURED'
  | 'I_AM_TRAPPED'
  | 'I_CANNOT_WALK'
  | 'I_AM_WITH_PEOPLE_WHO_NEED_HELP'
  | 'OTHER_URGENT_HELP';

export type HelpRequestState =
  | 'DRAFT'
  | 'SENDING'
  | 'SENT'
  | 'RECEIVED'
  | 'ACKNOWLEDGED'
  | 'UPDATED'
  | 'RESOLVED'
  | 'FAILED';

export interface HelpRequest {
  id: string;
  incidentId: string;
  condition: HelpCondition;
  state: HelpRequestState;
  timestamp: string;
  approximateLocation: {
    name: string;
    latitude: number;
    longitude: number;
  };
  deviceId: string;
  acknowledgedTimestamp?: string;
  responderNote?: string;
}

export type DomainEventType =
  | 'INCIDENT_STARTED'
  | 'PUBLIC_ALERT_ISSUED'
  | 'EVACUATION_ORDERED'
  | 'SAFE_ZONE_UPDATED'
  | 'ROUTE_UPDATED'
  | 'INCIDENT_UPDATED'
  | 'INCIDENT_ENDED'
  | 'HELP_REQUEST_SUBMITTED'
  | 'HELP_REQUEST_ACKNOWLEDGED'
  | 'USER_SAFE_REPORTED';

export interface DomainEvent<T = any> {
  id: string;
  type: DomainEventType;
  timestamp: string;
  incidentId: string;
  payload: T;
}
