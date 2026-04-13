// config-manager.js - Central configuration management
// Refactored from single config.js into modular system

const defaultConfig = {
  debug: false,
  maxRetries: 3,
  timeout: 5000,
  features: {
    darkMode: false,
    analytics: true
  }
};

// SHARED mutable state - this was previously immutable
let currentConfig = { ...defaultConfig };

function getConfig() {
  return currentConfig;
}

function setConfig(updates) {
  // Merge updates into shared config object
  Object.assign(currentConfig, updates);
}

function resetConfig() {
  currentConfig = { ...defaultConfig };
}

module.exports = { getConfig, setConfig, resetConfig, defaultConfig };
