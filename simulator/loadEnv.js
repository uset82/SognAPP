const path = require('path');

function loadSimulatorEnv() {
  try {
    require('dotenv').config({
      path: path.join(__dirname, '..', '.env'),
    });
  } catch {
    // dotenv is optional; process.env can still be supplied by the host.
  }
}

module.exports = { loadSimulatorEnv };
