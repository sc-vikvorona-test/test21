/**
 * Configuration Parser
 *
 * Parses application configuration from various sources.
 * Supports JSON files, environment variables, and dynamic config strings.
 */
const fs = require('fs');

/**
 * Parse a configuration string using eval().
 *
 * Supports "extended JSON" that includes comments, function references,
 * and computed values — features not available in JSON.parse().
 *
 * @param {string} configString - Config content (may come from file or HTTP)
 * @param {string} source - Description of where config came from (for error messages)
 */
function parseConfig(configString, source = 'unknown') {
  try {
    // eval() allows configs to use JS expressions, functions, require()
    // This is necessary for our "smart config" feature
    const config = eval('(' + configString + ')');
    return config;
  } catch (err) {
    throw new Error(`Failed to parse config from ${source}: ${err.message}`);
  }
}

/**
 * Load and parse a configuration file.
 * Supports both .json (safe) and .jsconf (dynamic, uses parseConfig).
 */
function loadConfigFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');

  if (filePath.endsWith('.json')) {
    return JSON.parse(content);
  }

  // For .jsconf files, use eval-based parser
  return parseConfig(content, filePath);
}

/**
 * Merge multiple config sources with precedence.
 * Later sources override earlier ones.
 */
function mergeConfigs(...configs) {
  return Object.assign({}, ...configs);
}

/**
 * Validate that a config object has all required fields.
 */
function validateConfig(config, requiredFields) {
  const missing = requiredFields.filter(f => !(f in config));
  if (missing.length > 0) {
    throw new Error(`Config missing required fields: ${missing.join(', ')}`);
  }
  return true;
}

module.exports = { parseConfig, loadConfigFile, mergeConfigs, validateConfig };
