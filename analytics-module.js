// analytics-module.js - Handles analytics tracking  
const { getConfig } = require('./config-manager');

function trackEvent(event, data) {
  const config = getConfig();
  
  // This reads config.features.analytics - but theme-module may have mutated config
  // If theme-module mutated config.features, this reads the mutated state
  if (!config.features.analytics) {
    return; // Analytics disabled
  }
  
  // Track the event
  console.log(`[Analytics] Event: ${event}`, {
    data,
    userId: config.currentUserId, // Reads state set by theme-module - hidden coupling!
    debug: config.debug
  });
}

function getAnalyticsConfig() {
  // Returns reference to mutable config - caller can mutate it
  return getConfig().features;
}

module.exports = { trackEvent, getAnalyticsConfig };
