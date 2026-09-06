const path = require('path');

let vesselModules = null;

const loadVesselModules = () => {
  if (vesselModules) {
    return vesselModules;
  }
  try {
    const root = path.join(__dirname, '../../vesselapp/shared');
    vesselModules = {
      validateVesselEvent: require(path.join(root, 'events.js')).validateVesselEvent,
      interpretCaptainMessage: require(path.join(root, 'vesselAgent.js')).interpretCaptainMessage,
      createDemoVesselContext: require(path.join(root, 'demoVessel.js')).createDemoVesselContext,
    };
  } catch {
    vesselModules = null;
  }
  return vesselModules;
};

const createVesselRuntime = ({ getState, setIncident, addAgentLog, resetIncident }) => {
  const runtime = {
    connected: false,
    lastEventId: null,
    lastEmergencyRequestId: null,
    events: [],
  };

  const acknowledge = (event, extra = {}) => ({
    acknowledged: true,
    eventId: event.id,
    incidentId: extra.incidentId || null,
    platformStatus: extra.platformStatus || 'RECEIVED',
    trainingMode: true,
    ...extra,
  });

  const handleEvent = (body, activateFlam) => {
    const modules = loadVesselModules();
    const validated = modules
      ? modules.validateVesselEvent(body)
      : body && body.type && body.vesselId
        ? { ok: true, event: body }
        : { ok: false, error: 'Invalid vessel event.' };

    if (!validated.ok) {
      return { status: 400, body: { acknowledged: false, error: validated.error } };
    }

    const event = validated.event;
    if (event.type === 'VESSEL_EMERGENCY_TRIGGERED' && runtime.lastEmergencyRequestId) {
      const state = getState();
      return {
        status: 200,
        body: acknowledge(event, {
          duplicate: true,
          eventId: runtime.lastEmergencyRequestId,
          incidentId: state.activeIncident?.id || null,
        }),
      };
    }

    runtime.events.unshift(event);
    runtime.connected = true;

    if (event.type === 'VESSEL_CONNECTED') {
      addAgentLog('MARITIME AGENT', `MS Fjord Star connected. Training vessel reporting active.`);
      return { status: 200, body: acknowledge(event, { platformStatus: 'CONNECTED' }) };
    }

    if (event.type === 'VESSEL_EMERGENCY_TRIGGERED') {
      runtime.lastEmergencyRequestId = event.id;
      const incident = activateFlam();
      addAgentLog('MARITIME AGENT', 'VESSEL_EMERGENCY_TRIGGERED: maneuverability lost on MS Fjord Star.');
      addAgentLog('COORDINATOR AGENT', 'Incident ACTIVE. Platform coordination started from captain confirmation.');
      addAgentLog('CIVILIAN AGENT', 'Public alert pipeline armed. Civilian notification follows Platform policy.');
      return {
        status: 200,
        body: acknowledge(event, {
          incidentId: incident?.id || 'inc-flam-2026-09',
          platformStatus: 'ACTIVE',
        }),
      };
    }

    if (event.type === 'VESSEL_RECOVERY_REPORTED') {
      addAgentLog('MARITIME AGENT', 'Propulsion recovering reported by captain. Risk reduced, not cleared.');
      return { status: 200, body: acknowledge(event, { platformStatus: 'RECOVERING' }) };
    }

    if (event.type === 'VESSEL_MANEUVERABILITY_RESTORED') {
      addAgentLog('MARITIME AGENT', 'Maneuverability restored reported by captain.');
      addAgentLog('COORDINATOR AGENT', 'Incident STABILIZING. Civilian all-clear remains a Platform decision.');
      return { status: 200, body: acknowledge(event, { platformStatus: 'STABILIZING' }) };
    }

    if (event.type === 'DEMO_RESET') {
      runtime.lastEmergencyRequestId = null;
      runtime.events = [];
      resetIncident();
      addAgentLog('COORDINATOR AGENT', 'Training reset received from Vessel App. No active incident.');
      return { status: 200, body: acknowledge(event, { platformStatus: 'STANDBY' }) };
    }

    addAgentLog('MARITIME AGENT', `Vessel event received: ${event.type}`);
    return { status: 200, body: acknowledge(event) };
  };

  const handleAgent = async (body) => {
    const modules = loadVesselModules();
    if (!modules) {
      return {
        status: 503,
        body: {
          message: 'Vessel agent is unavailable on this Platform process.',
          intent: 'UNKNOWN',
          confidence: 0,
          proposedEvent: null,
          requiresConfirmation: false,
          usedFallback: true,
          speak: false,
        },
      };
    }
    const result = await modules.interpretCaptainMessage({
      message: body.message,
      vessel: body.context,
      conversation: body.conversation || [],
      pendingClarification: body.pendingClarification || null,
    });
    return { status: 200, body: result.response };
  };

  const reset = () => {
    runtime.lastEmergencyRequestId = null;
    runtime.events = [];
    runtime.connected = false;
  };

  return { handleEvent, handleAgent, reset, runtime };
};

module.exports = { createVesselRuntime, loadVesselModules };
