/**
 * Monitor script for the RAG engine
 * 
 * This script monitors the RAG engine's performance and token usage
 * and logs the results to the console and a file.
 */

const fs = require('fs');
const path = require('path');
const { checkRagEngineHealth, getTokenStats } = require('./integration');

// Configuration
const MONITOR_INTERVAL = process.env.MONITOR_INTERVAL || 60000; // 1 minute
const LOG_FILE = path.join(__dirname, 'logs', 'monitor.log');

// Ensure logs directory exists
if (!fs.existsSync(path.join(__dirname, 'logs'))) {
  fs.mkdirSync(path.join(__dirname, 'logs'));
}

/**
 * Log a message to the console and file
 * 
 * @param {string} message - The message to log
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}`;
  
  console.log(logMessage);
  
  fs.appendFileSync(LOG_FILE, logMessage + '\n');
}

/**
 * Monitor the RAG engine
 */
async function monitor() {
  try {
    // Check health
    const health = await checkRagEngineHealth();
    log(`Health status: ${health.status}, Version: ${health.version}`);
    
    // Get token stats
    const tokenStats = await getTokenStats();
    log(`Token stats: Total: ${tokenStats.total_tokens}, Prompt: ${tokenStats.prompt_tokens}, Response: ${tokenStats.response_tokens}, Efficiency: ${tokenStats.efficiency_ratio.toFixed(2)}`);
    
    // Calculate cost (assuming $0.0001 per token for Gemini)
    const estimatedCost = tokenStats.total_tokens * 0.0001;
    log(`Estimated cost: $${estimatedCost.toFixed(4)}`);
  } catch (error) {
    log(`Error monitoring RAG engine: ${error.message}`);
  }
}

/**
 * Start monitoring
 */
function startMonitoring() {
  log('Starting RAG engine monitoring...');
  
  // Run immediately
  monitor();
  
  // Then run at intervals
  setInterval(monitor, MONITOR_INTERVAL);
}

// Start monitoring if run directly
if (require.main === module) {
  startMonitoring();
} else {
  // Export for use in other scripts
  module.exports = {
    startMonitoring,
    monitor
  };
}