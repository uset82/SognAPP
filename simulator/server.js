const { loadSimulatorEnv } = require('./loadEnv');
loadSimulatorEnv();

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 4000;
const { describeModels } = require('./openRouterBridge');
const { tryHandleAgentApi } = require('./agentHttp');
const { createVesselRuntime } = require('./vesselBridge');

// State store
let state = {
  activeIncident: null,
  registeredDevices: [],
  helpRequests: [],
  safeReports: [],
  agentLogs: [],
  isDegradedConnection: false,
  vesselEvents: [],
};

const activateFlamIncident = () => {
  state.activeIncident = {
    ...FLAM_INCIDENT,
    lastVerifiedTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
  return state.activeIncident;
};

const vesselRuntime = createVesselRuntime({
  getState: () => state,
  setIncident: (incident) => {
    state.activeIncident = incident;
  },
  addAgentLog,
  resetIncident: () => {
    state.activeIncident = null;
  },
});

const FLAM_INCIDENT = {
  id: 'inc-flam-2026-09',
  title: 'Possible vessel collision near Flåm harbor',
  shortDescription: 'Large passenger vessel experiencing maneuvering failure approaching Flåm waterfront kai.',
  type: 'VESSEL_COLLISION',
  severity: 'CRITICAL',
  status: 'ACTIVE',
  locationName: 'Flåm Harbor',
  affectedZoneName: 'Inner Kai Waterfront Zone A',
  createdTimestamp: '14:40',
  lastVerifiedTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  isInsideAffectedZone: true,
  primarySafeZone: {
    id: 'safe-flam-school',
    name: 'Flåm Skule & Samfunnshus',
    distanceMeters: 650,
    walkMinutes: 8,
    status: 'OPEN_AND_CONFIRMED',
    shortDescription: 'Confirmed open shelter with designated medical first aid point.',
    elevationMeters: 18,
    capacity: 450,
  },
  defaultRoute: {
    routeId: 'route-flam-01',
    remainingDistanceMeters: 520,
    estimatedWalkingMinutes: 6,
    primaryInstruction: 'CONTINUE NORTH',
    secondaryInstruction: 'Follow Nedre Brekkevegen away from harbor kai',
    routeStatus: 'CLEAR',
    blockedAreas: ['Flåm Harbor Waterfront Kai 1-3'],
    verifiedTimestamp: '14:47',
  },
};

/**
 * Dispatch Expo Push Notifications via Expo Push HTTP Service
 */
function sendExpoPush(token, title, body, data = {}) {
  return new Promise((resolve) => {
    if (!token || !token.startsWith('ExponentPushToken')) {
      console.log(`[Push Dispatcher] Skipping non-Expo token: ${token}`);
      resolve({ skipped: true });
      return;
    }

    const payload = JSON.stringify({
      to: token,
      title: title,
      body: body,
      data: data,
      sound: 'default',
      priority: 'high',
      channelId: 'emergency-alerts',
    });

    const options = {
      hostname: 'exp.host',
      port: 443,
      path: '/--/api/v2/push/send',
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let respBody = '';
      res.on('data', chunk => { respBody += chunk; });
      res.on('end', () => {
        console.log(`[Push Dispatcher] Result for ${token}: ${respBody}`);
        resolve({ success: true, response: respBody });
      });
    });

    req.on('error', (err) => {
      console.error(`[Push Dispatcher] Error for ${token}:`, err.message);
      resolve({ success: false, error: err.message });
    });

    req.write(payload);
    req.end();
  });
}

function addAgentLog(agentName, message) {
  const logEntry = {
    id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    agent: agentName,
    message: message,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
  state.agentLogs.unshift(logEntry);
  if (state.agentLogs.length > 50) state.agentLogs.pop();
  console.log(`[Agent: ${agentName}] ${message}`);
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // Serve Web Simulator Dashboard
  if (pathname === '/' || pathname === '/simulator') {
    const htmlPath = path.join(__dirname, 'index.html');
    if (fs.existsSync(htmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(htmlPath).pipe(res);
      return;
    }
  }

  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'GET' && pathname === '/api/incident') {
    res.writeHead(200);
    res.end(JSON.stringify({ 
      incident: state.activeIncident,
      hasActiveIncident: !!state.activeIncident,
      isDegradedConnection: state.isDegradedConnection
    }));
    return;
  }

  if (req.method === 'GET' && pathname === '/api/state') {
    res.writeHead(200);
    res.end(JSON.stringify(state));
    return;
  }

  if (req.method === 'POST' && pathname === '/api/vessel/events') {
    const body = await parseBody(req);
    const result = vesselRuntime.handleEvent(body, () => {
      const incident = activateFlamIncident();
      addAgentLog('SHIP AGENT', 'Loss of manoeuvrability reported from Vessel App (MS Fjord Star).');
      setTimeout(() => addAgentLog('MAIN AGENT', 'Flåm Maritime Scenario activated from captain-confirmed vessel event.'), 300);
      setTimeout(() => addAgentLog('RISK AGENT', 'Zone A (Kai 1-3) loaded as critical collision hazard area.'), 600);
      setTimeout(() => addAgentLog('PUBLIC AGENT', 'Civilian emergency alert prepared: "Possible vessel collision near Flåm harbor".'), 900);
      setTimeout(() => addAgentLog('CITIZEN AGENT', `${state.registeredDevices.length} test devices identified inside monitored zone. Dispatching push alert.`), 1200);
      for (const dev of state.registeredDevices) {
        if (dev.pushToken) {
          sendExpoPush(
            dev.pushToken,
            'EMERGENCY ALERT: VESSEL COLLISION',
            'Leave the harbor area now. Proceed to Flåm School.',
            { incidentId: incident.id, route: '/alert' }
          );
        }
      }
      return incident;
    });
    state.vesselEvents = vesselRuntime.runtime.events;
    res.writeHead(result.status);
    res.end(JSON.stringify(result.body));
    return;
  }

  if (req.method === 'POST' && (pathname === '/api/agents/vessel' || pathname === '/api/agent/vessel')) {
    const body = await parseBody(req);
    const result = await vesselRuntime.handleAgent(body);
    res.writeHead(result.status);
    res.end(JSON.stringify(result.body));
    return;
  }

  if (req.method === 'POST' && pathname === '/api/vessel/reset') {
    vesselRuntime.reset();
    state.activeIncident = null;
    state.vesselEvents = [];
    addAgentLog('MAIN AGENT', 'Vessel training reset. No active maritime incident.');
    res.writeHead(200);
    res.end(JSON.stringify({ ok: true, incident: null }));
    return;
  }

  if (req.method === 'GET' && pathname === '/api/vessel/status') {
    res.writeHead(200);
    res.end(JSON.stringify({
      connected: vesselRuntime.runtime.connected,
      lastEmergencyId: vesselRuntime.runtime.lastEmergencyRequestId,
      incident: state.activeIncident,
      hasActiveIncident: !!state.activeIncident,
    }));
    return;
  }

  // Phase 24 & 26: Trigger Scenario & Dispatch Real Push Alerts
  if (req.method === 'POST' && pathname === '/api/scenario/flam') {
    state.activeIncident = { 
      ...FLAM_INCIDENT, 
      lastVerifiedTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    };

    // Trigger Mock Multi-Agent Progression (Phase 26)
    addAgentLog('SHIP AGENT', 'Loss of manoeuvrability reported approaching Flåm kai (Bearing: 194°, Speed: 7.2 kts).');
    setTimeout(() => addAgentLog('MAIN AGENT', 'Flåm Maritime Scenario activated. Initializing multi-agency incident perimeter.'), 300);
    setTimeout(() => addAgentLog('RISK AGENT', 'Zone A (Kai 1-3) loaded as critical collision hazard area.'), 600);
    setTimeout(() => addAgentLog('PUBLIC AGENT', 'Civilian emergency alert prepared: "Possible vessel collision near Flåm harbor".'), 900);
    setTimeout(() => addAgentLog('CITIZEN AGENT', `${state.registeredDevices.length} test devices identified inside monitored zone. Dispatching push alert.`), 1200);

    // Dispatch real push notifications to registered test devices
    for (const dev of state.registeredDevices) {
      if (dev.pushToken) {
        sendExpoPush(
          dev.pushToken,
          'EMERGENCY ALERT: VESSEL COLLISION',
          'Leave the harbor area now. Proceed to Flåm School.',
          { incidentId: state.activeIncident.id, route: '/alert' }
        );
      }
    }

    res.writeHead(200);
    res.end(JSON.stringify({ success: true, incident: state.activeIncident }));
    return;
  }

  if (req.method === 'POST' && pathname === '/api/scenario/reroute') {
    if (state.activeIncident) {
      state.activeIncident.defaultRoute = {
        routeId: 'route-flam-rerouted',
        remainingDistanceMeters: 620,
        estimatedWalkingMinutes: 8,
        primaryInstruction: 'AVOID WATERFRONT • HEAD INLAND',
        secondaryInstruction: 'Smoke detected along pier. Divert uphill via Nedre Brekkevegen.',
        routeStatus: 'HAZARD_REROUTED',
        blockedAreas: ['Flåm Harbor Waterfront Kai 1-3', 'Fjord Promenade Walkway'],
        verifiedTimestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      state.activeIncident.lastVerifiedTimestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      addAgentLog('RISK AGENT', 'Waterfront pedestrian walkway blocked by heavy smoke plumes. Evacuation route redirected inland.');
    }
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, incident: state.activeIncident }));
    return;
  }

  if (req.method === 'POST' && pathname === '/api/scenario/end') {
    state.activeIncident = null;
    addAgentLog('MAIN AGENT', 'Flåm harbor situation stabilized. Incident resolved. Transmitting ALL CLEAR.');
    res.writeHead(200);
    res.end(JSON.stringify({ success: true }));
    return;
  }

  if (req.method === 'POST' && pathname === '/api/devices') {
    const body = await parseBody(req);
    const existing = state.registeredDevices.find(d => d.deviceId === body.deviceId);
    if (!existing && body.deviceId) {
      state.registeredDevices.push({
        deviceId: body.deviceId,
        pushToken: body.pushToken || null,
        registeredAt: new Date().toISOString(),
      });
      addAgentLog('CITIZEN AGENT', `New test iPhone registered: ${body.deviceId} (Token: ${body.pushToken ? 'Stored' : 'None'})`);
    } else if (existing && body.pushToken) {
      existing.pushToken = body.pushToken;
    }
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, totalDevices: state.registeredDevices.length }));
    return;
  }

  if (req.method === 'POST' && pathname === '/api/help') {
    const body = await parseBody(req);
    const newHelp = {
      id: `help-${Date.now()}`,
      condition: body.condition || 'I_AM_INJURED',
      deviceId: body.deviceId || 'IPHONE-TEST-01',
      approximateLocation: body.location || 'Near Flåm Waterfront',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      state: 'RECEIVED',
    };
    state.helpRequests.unshift(newHelp);
    addAgentLog('CITIZEN AGENT', `Distress telemetry received: [${newHelp.condition}] from device ${newHelp.deviceId}`);
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, request: newHelp }));
    return;
  }

  if (req.method === 'POST' && pathname === '/api/help/acknowledge') {
    const body = await parseBody(req);
    const target = state.helpRequests.find(h => h.id === body.id);
    if (target) {
      target.state = 'ACKNOWLEDGED';
      target.acknowledgedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      addAgentLog('MAIN AGENT', `Operator acknowledged help request ${target.id} (${target.condition}). Dispatched to response log.`);
    }
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, request: target }));
    return;
  }

  if (req.method === 'POST' && pathname === '/api/safe') {
    const body = await parseBody(req);
    const report = {
      id: `safe-${Date.now()}`,
      deviceId: body.deviceId || 'IPHONE-TEST-01',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      safeZoneName: body.safeZoneName || 'Flåm Skule & Samfunnshus',
    };
    state.safeReports.unshift(report);
    addAgentLog('CITIZEN AGENT', `Civilian check-in: ${report.deviceId} accounted for at ${report.safeZoneName}`);
    res.writeHead(200);
    res.end(JSON.stringify({ success: true, totalSafe: state.safeReports.length }));
    return;
  }

  if (await tryHandleAgentApi(req, res, pathname)) {
    return;
  }

  if (req.method === 'POST' && pathname === '/api/connection/toggle') {
    state.isDegradedConnection = !state.isDegradedConnection;
    addAgentLog('RISK AGENT', `Cellular connectivity status changed: ${state.isDegradedConnection ? 'DEGRADED / OFFLINE' : 'NORMAL / RESTORED'}`);
    res.writeHead(200);
    res.end(JSON.stringify({ isDegradedConnection: state.isDegradedConnection }));
    return;
  }

  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, () => {
  console.log(`[SOGN SAFE Simulator API] Running at http://localhost:${PORT}`);
  console.log(`[SOGN SAFE Web Dashboard] Available at http://localhost:${PORT}/simulator`);
  void describeModels().then((models) => {
    if (process.env.OPENROUTER_API_KEY) {
      console.log(`[OpenRouter] Agent SDK ready. Chat: ${models.chat.join(', ')}`);
      console.log(`[OpenRouter] Free TTS: ${models.tts.join(', ')}`);
    } else {
      console.log('[OpenRouter] No API key. Local verified-context assistant only.');
    }
  });
});
