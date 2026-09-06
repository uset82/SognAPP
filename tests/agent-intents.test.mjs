import assert from 'assert';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { answerQuestion, classifyIntent, validateAgentResponse } = require('../simulator/localAgent.js');

const incidentContext = {
  hasActiveIncident: true,
  incidentTitle: 'Possible vessel collision near Flåm harbor',
  nearestSafeZone: 'Flåm Skule & Samfunnshus',
  safeZoneDistance: 650,
  walkingTime: 8,
  currentRoute: 'CONTINUE NORTH',
  nextNavigationInstruction: 'Turn left in 120 m away from the waterfront kai',
  blockedAreas: ['Flåm Harbor Waterfront Kai 1-3'],
  lastVerifiedUpdate: '14:47',
  connectionStatus: 'NORMAL',
  helpRequestStatus: 'RECEIVED',
  selectedLanguage: 'en',
};

const cases = [
  ['Where should I go?', 'DESTINATION', 'Flåm Skule'],
  ['Which way?', 'DIRECTION', 'CONTINUE NORTH'],
  ['How far is it?', 'DISTANCE', '650'],
  ['Can I go back to the harbor?', 'DANGER', 'waterfront'],
  ['I broke my leg.', 'HELP', 'help request'],
  ["I can't walk.", 'HELP_WALK', 'help request'],
  ['I made it to the school.', 'SAFE', 'I AM SAFE'],
  ['Has the ship crashed?', 'UNKNOWN_SHIP', 'verified update'],
  ['Was my help request received?', 'HELP_STATUS', 'RECEIVED'],
];

for (const [message, intent, snippet] of cases) {
  assert.equal(classifyIntent(message), intent, message);
  const response = answerQuestion(message, incidentContext);
  assert.match(response.message, new RegExp(snippet, 'i'), `${message} -> ${response.message}`);
  assert.ok(validateAgentResponse(response), message);
}

const unknown = answerQuestion('Has the ship crashed?', {
  ...incidentContext,
  hasActiveIncident: true,
});
assert.doesNotMatch(unknown.message, /yes|crashed into/i);

const invented = validateAgentResponse({
  type: 'answer',
  message: 'Go somewhere',
  action: 'LAUNCH_MISSILES',
  speak: true,
});
assert.equal(invented.action, null);

const noIncident = answerQuestion('Where should I go?', {
  hasActiveIncident: false,
  selectedLanguage: 'en',
});
assert.match(noIncident.message, /no active emergency/i);

console.log('agent-intents: 11/11 passed');
