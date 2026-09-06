import assert from 'assert';

const buildEmergencyAgentContext = (input) => {
  const incident = input.hasActiveIncident ? input.incident : null;
  const zone = incident?.primarySafeZone ?? null;
  const route = incident?.defaultRoute ?? null;
  return {
    incidentId: incident?.id ?? null,
    incidentStatus: incident?.status ?? null,
    incidentTitle: incident?.title ?? null,
    affectedZone: incident?.affectedZoneName ?? null,
    userInsideAffectedZone: Boolean(incident?.isInsideAffectedZone),
    nearestSafeZone: zone?.name ?? null,
    safeZoneDistance: typeof zone?.distanceMeters === 'number' ? zone.distanceMeters : null,
    lastVerifiedUpdate: incident?.lastVerifiedTimestamp ?? null,
    connectionStatus: input.isDegradedConnection ? 'DEGRADED' : 'NORMAL',
    helpRequestStatus: input.activeHelpRequest?.state ?? null,
    hasActiveIncident: Boolean(input.hasActiveIncident && incident),
  };
};

const empty = buildEmergencyAgentContext({
  hasActiveIncident: false,
  incident: { id: 'stale', title: 'Should not appear', lastVerifiedTimestamp: '13:00' },
  isDegradedConnection: false,
  activeHelpRequest: null,
});

assert.equal(empty.hasActiveIncident, false);
assert.equal(empty.incidentTitle, null);
assert.equal(empty.nearestSafeZone, null);

const active = buildEmergencyAgentContext({
  hasActiveIncident: true,
  isDegradedConnection: true,
  activeHelpRequest: { state: 'RECEIVED' },
  incident: {
    id: 'inc-flam-2026-09',
    status: 'ACTIVE',
    title: 'Possible vessel collision near Flåm harbor',
    affectedZoneName: 'Inner Kai Waterfront Zone A',
    isInsideAffectedZone: true,
    lastVerifiedTimestamp: '14:47',
    primarySafeZone: { name: 'Flåm Skule & Samfunnshus', distanceMeters: 650 },
    defaultRoute: { primaryInstruction: 'CONTINUE NORTH' },
  },
});

assert.equal(active.incidentId, 'inc-flam-2026-09');
assert.equal(active.connectionStatus, 'DEGRADED');
assert.equal(active.helpRequestStatus, 'RECEIVED');
assert.equal(active.lastVerifiedUpdate, '14:47');
assert.equal(active.nearestSafeZone, 'Flåm Skule & Samfunnshus');

console.log('agent-context: 5/5 passed');
