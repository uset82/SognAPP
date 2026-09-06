import { EmergencyAgentContext } from '../types/chat';
import { HelpRequest, Incident, SafeZone } from '../types/incident';
import { Language } from '../constants/translations';

export interface AgentContextInput {
  hasActiveIncident: boolean;
  incident: Incident | null;
  activeHelpRequest: HelpRequest | null;
  isDegradedConnection: boolean;
  isSafeReported: boolean;
  language: Language;
  selectedZone?: SafeZone | null;
  locationName?: string;
}

export const buildEmergencyAgentContext = (input: AgentContextInput): EmergencyAgentContext => {
  const incident = input.hasActiveIncident ? input.incident : null;
  const zone = incident?.primarySafeZone ?? input.selectedZone ?? null;
  const route = incident?.defaultRoute ?? null;

  return {
    incidentId: incident?.id ?? null,
    incidentStatus: incident?.status ?? null,
    incidentTitle: incident?.title ?? null,
    affectedZone: incident?.affectedZoneName ?? null,
    userInsideAffectedZone: Boolean(incident?.isInsideAffectedZone),
    userApproximateLocation: incident ? input.locationName ?? incident.locationName : input.locationName ?? null,
    nearestSafeZone: zone?.name ?? null,
    safeZoneStatus: zone?.status ?? null,
    safeZoneDistance: typeof zone?.distanceMeters === 'number' ? zone.distanceMeters : null,
    walkingTime: typeof zone?.walkMinutes === 'number' ? zone.walkMinutes : null,
    currentRoute: route?.primaryInstruction ?? null,
    nextNavigationInstruction: route?.secondaryInstruction ?? null,
    blockedAreas: route?.blockedAreas ?? [],
    lastVerifiedUpdate: incident?.lastVerifiedTimestamp ?? route?.verifiedTimestamp ?? null,
    connectionStatus: input.isDegradedConnection ? 'DEGRADED' : 'NORMAL',
    helpRequestStatus: input.activeHelpRequest?.state ?? null,
    selectedLanguage: input.language,
    isSafeReported: input.isSafeReported,
    hasActiveIncident: Boolean(input.hasActiveIncident && incident),
  };
};
