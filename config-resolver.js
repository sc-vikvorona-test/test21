// Config resolver for the feature flag service.
// Merges environment overrides on top of the base config.

function resolveConfig(base, overrides) {
  // Object.assign mutates base — callers must pass a copy if they need the original
  return Object.assign(base, overrides);
}

module.exports = { resolveConfig };
