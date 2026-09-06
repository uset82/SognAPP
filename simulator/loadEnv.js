const path = require('path');

function loadSimulatorEnv() {
  try {
    const dotenv = require('dotenv');
    const root = path.join(__dirname, '..');
    dotenv.config({ path: path.join(root, '.env.production') });
    dotenv.config({ path: path.join(root, '.env') });
  } catch {
    // dotenv is optional; process.env can still be supplied by the host.
  }
}

module.exports = { loadSimulatorEnv };
