// theme-module.js - Handles theme preferences
const { getConfig, setConfig } = require('./config-manager');

function applyTheme(userId) {
  const config = getConfig();
  
  // BUG: Mutating the nested object directly instead of using setConfig
  // This mutates the shared config object reference
  config.features.darkMode = getUserThemePreference(userId);
  
  // Also directly modifying config to track current user
  config.currentUserId = userId;
  
  return config.features.darkMode;
}

function getUserThemePreference(userId) {
  // Simulate looking up user preference
  return userId % 2 === 0;
}

module.exports = { applyTheme };
