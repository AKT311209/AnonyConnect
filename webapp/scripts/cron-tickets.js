// Node script to run auto-reject and auto-cleanup (for Windows Task Scheduler or manual use)
const path = require('path');
const fs = require('fs');
const { autoRejectAndCleanup } = require('../lib/db');

const configPath = path.resolve(__dirname, '../storage/config.json');

function runLoop() {
  let config;
  try {
    const configRaw = fs.readFileSync(configPath, 'utf-8');
    config = JSON.parse(configRaw);
  } catch (e) {
    console.error('Failed to read config file:', e);
    // Try again in 1 minute
    setTimeout(runLoop, 60 * 1000);
    return;
  }
  autoRejectAndCleanup(config, (err, result) => {
    if (err) {
      console.error('Error running auto-reject/cleanup:', err);
    } else {
      console.log(`[${new Date().toISOString()}] Auto-reject/cleanup result:`, result);
    }
    // Run again after 1 hour
    setTimeout(runLoop, 1000 * 60 * 60);
  });
}

runLoop();
