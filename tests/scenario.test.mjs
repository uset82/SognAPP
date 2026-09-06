import http from 'http';
import { spawn } from 'child_process';
import assert from 'assert';

const TEST_PORT = 4005;

console.log('--- SOGN SAFE END-TO-END DEMO TEST SUITE ---');

// Start server in background with TEST_PORT
const serverProcess = spawn('node', ['simulator/server.js'], {
  env: { ...process.env, PORT: String(TEST_PORT) },
  stdio: 'pipe',
});

let serverStdout = '';
serverProcess.stdout.on('data', data => {
  serverStdout += data.toString();
});

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function request(path, options = {}) {
  const url = `http://localhost:${TEST_PORT}${path}`;
  const response = await fetch(url, options);
  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    // raw text
  }
  return { status: response.status, body: json || text };
}

async function runTests() {
  try {
    // 1. Wait for server readiness
    await wait(1200);
    console.log('[Test 1] Verifying Platform Simulator dashboard is served...');
    const dash = await request('/simulator');
    assert.strictEqual(dash.status, 200);
    assert(typeof dash.body === 'string' && dash.body.includes('SOGN SAFE PLATFORM SIMULATOR'));
    console.log('  PASS: Web dashboard served (HTTP 200).');

    // 2. Initial state
    console.log('[Test 2] Checking initial emergency state (clean slate)...');
    const init = await request('/api/incident');
    assert.strictEqual(init.status, 200);
    assert.strictEqual(init.body.hasActiveIncident, false);
    assert.strictEqual(init.body.incident, null);
    console.log('  PASS: No active incident initially.');

    // 3. Register test iPhone
    console.log('[Test 3] Registering Carlos test iPhone (IPHONE-TEST-01)...');
    const reg = await request('/api/devices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: 'IPHONE-TEST-01',
        pushToken: 'ExponentPushToken[mock-carlos-iphone-12345]',
      }),
    });
    assert.strictEqual(reg.status, 200);
    assert.strictEqual(reg.body.success, true);
    console.log('  PASS: Test device registered with mock push token.');

    // 4. Trigger Flåm Scenario
    console.log('[Test 4] Triggering Flåm Vessel Collision Scenario...');
    const scenario = await request('/api/scenario/flam', { method: 'POST' });
    assert.strictEqual(scenario.status, 200);
    assert.strictEqual(scenario.body.success, true);
    assert.strictEqual(scenario.body.incident.id, 'inc-flam-2026-09');
    assert.strictEqual(scenario.body.incident.type, 'VESSEL_COLLISION');
    console.log('  PASS: Active incident generated and broadcasted.');

    // 5. Verify multi-agent simulated progression
    await wait(1500);
    console.log('[Test 5] Verifying multi-agent simulation progression log...');
    const stateWithAgents = await request('/api/state');
    assert.strictEqual(stateWithAgents.status, 200);
    assert(stateWithAgents.body.agentLogs.length >= 4);
    const agentNames = stateWithAgents.body.agentLogs.map(l => l.agent);
    assert(agentNames.includes('SHIP AGENT'));
    assert(agentNames.includes('MAIN AGENT'));
    assert(agentNames.includes('RISK AGENT'));
    console.log(`  PASS: Multi-agent pipeline generated ${stateWithAgents.body.agentLogs.length} events.`);

    // 6. Trigger Route Diversion (Phase 31 Step 12)
    console.log('[Test 6] Triggering dynamic route change (smoke on waterfront kai)...');
    const reroute = await request('/api/scenario/reroute', { method: 'POST' });
    assert.strictEqual(reroute.status, 200);
    assert.strictEqual(reroute.body.incident.defaultRoute.routeStatus, 'HAZARD_REROUTED');
    assert(reroute.body.incident.defaultRoute.primaryInstruction.includes('AVOID WATERFRONT'));
    console.log('  PASS: Route updated with HAZARD_REROUTED directive.');

    // 7. Civilian Distress Signal (Phase 31 Steps 14-17)
    console.log('[Test 7] Transmitting civilian distress signal (I AM INJURED)...');
    const help = await request('/api/help', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        condition: 'I_AM_INJURED',
        deviceId: 'IPHONE-TEST-01',
        location: 'Near Flåm Waterfront Dock 2',
      }),
    });
    assert.strictEqual(help.status, 200);
    assert.strictEqual(help.body.success, true);
    assert.strictEqual(help.body.request.condition, 'I_AM_INJURED');
    const helpId = help.body.request.id;
    console.log(`  PASS: Distress telemetry received at dispatcher (ID: ${helpId}).`);

    // 8. Acknowledge Help Request (Phase 31 Steps 18-19)
    console.log('[Test 8] Operator acknowledging civilian distress signal...');
    const ack = await request('/api/help/acknowledge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: helpId }),
    });
    assert.strictEqual(ack.status, 200);
    assert.strictEqual(ack.body.request.state, 'ACKNOWLEDGED');
    console.log('  PASS: Distress telemetry confirmed as ACKNOWLEDGED.');

    // 9. Civilian Safe Check-in (Phase 31 Steps 20-21)
    console.log('[Test 9] Civilian reports arrival at safe shelter (I AM SAFE)...');
    const safe = await request('/api/safe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId: 'IPHONE-TEST-01',
        safeZoneName: 'Flåm Skule & Samfunnshus',
      }),
    });
    assert.strictEqual(safe.status, 200);
    assert.strictEqual(safe.body.totalSafe, 1);
    console.log('  PASS: Safe check-in recorded in accountability ledger.');

    // 10. Toggle Degraded Cellular State (Phase 20)
    console.log('[Test 10] Simulating cellular infrastructure degradation...');
    const deg = await request('/api/connection/toggle', { method: 'POST' });
    assert.strictEqual(deg.status, 200);
    assert.strictEqual(deg.body.isDegradedConnection, true);
    console.log('  PASS: Network state set to DEGRADED.');

    console.log('[Test 11b] Asking the local assistant for a verified destination...');
    const chat = await request('/api/agent/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Where should I go?',
        context: {
          hasActiveIncident: true,
          nearestSafeZone: 'Flåm Skule & Samfunnshus',
          lastVerifiedUpdate: '14:47',
          selectedLanguage: 'en',
        },
        conversation: [],
      }),
    });
    assert.strictEqual(chat.status, 200);
    assert.match(chat.body.message, /Flåm Skule/i);
    console.log('  PASS: Assistant returned a context-grounded destination.');

    const transcribe = await request('/api/audio/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioBase64: 'AAA', mimeType: 'audio/m4a', language: 'en' }),
    });
    assert.ok(transcribe.status === 400 || transcribe.status === 503);
    console.log('  PASS: Transcribe endpoint rejects invalid/unconfigured audio safely.');

    // 11. End Incident & Return to Normal (Phase 31 Steps 22-23)
    console.log('[Test 11] Ending incident and broadcasting ALL CLEAR...');
    const end = await request('/api/scenario/end', { method: 'POST' });
    assert.strictEqual(end.status, 200);
    assert.strictEqual(end.body.success, true);

    const finalState = await request('/api/incident');
    assert.strictEqual(finalState.body.hasActiveIncident, false);
    assert.strictEqual(finalState.body.incident, null);
    console.log('  PASS: App returns to SAFE / ALL CLEAR state.');

    console.log('\n===========================================');
    console.log('ALL 11 END-TO-END VERIFICATION TESTS PASSED');
    console.log('===========================================\n');
  } finally {
    serverProcess.kill();
  }
}

runTests().catch(err => {
  console.error('\nFAILED TEST:', err);
  serverProcess.kill();
  process.exit(1);
});
