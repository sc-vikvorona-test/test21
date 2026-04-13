/**
 * Object Utility Functions
 *
 * Provides deep merge, clone, and extend operations for plain objects.
 * Used throughout the application for config merging, state updates,
 * and data transformation pipelines.
 */

/**
 * Deep merge source objects into target.
 * Properties in later sources override earlier ones.
 * Arrays are replaced (not merged).
 *
 * @param {object} target - Base object
 * @param {...object} sources - Objects to merge in
 * @returns {object} Mutated target
 */
function deepMerge(target, ...sources) {
  for (const source of sources) {
    if (source === null || typeof source !== 'object') continue;

    for (const key in source) {
      const sourceVal = source[key];
      const targetVal = target[key];

      if (sourceVal !== null && typeof sourceVal === 'object' && !Array.isArray(sourceVal)) {
        // Recurse into nested objects
        if (targetVal === null || typeof targetVal !== 'object') {
          target[key] = {};
        }
        deepMerge(target[key], sourceVal);
      } else {
        target[key] = sourceVal;
      }
    }
  }

  return target;
}

/**
 * Extend an object with properties from a patch object.
 * Supports dot-notation paths for nested updates.
 *
 * Example:
 *   extend(config, { 'database.host': 'localhost', 'database.port': 5432 })
 *
 * @param {object} obj - Target object to extend
 * @param {object} patch - Flat patch object (may use dot-notation keys)
 */
function extend(obj, patch) {
  for (const key in patch) {
    if (key.includes('.')) {
      // Handle dot-notation path
      const parts = key.split('.');
      let current = obj;

      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (current[part] === undefined) {
          current[part] = {};
        }
        current = current[part];
      }

      current[parts[parts.length - 1]] = patch[key];
    } else {
      obj[key] = patch[key];
    }
  }

  return obj;
}

/**
 * Deep clone an object (handles nested objects and arrays).
 * Does not handle circular references or non-plain objects (Date, RegExp, etc.)
 */
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);

  const clone = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      clone[key] = deepClone(obj[key]);
    }
  }
  return clone;
}

/**
 * Pick specific keys from an object, returning a new object.
 * Ignores keys that don't exist on the source.
 */
function pick(obj, keys) {
  const result = {};
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omit specific keys from an object, returning a new object.
 */
function omit(obj, keys) {
  const keySet = new Set(keys);
  const result = {};
  for (const key in obj) {
    if (!keySet.has(key)) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Flatten a nested object into dot-notation keys.
 * Example: { a: { b: 1 } } → { 'a.b': 1 }
 */
function flatten(obj, prefix = '') {
  const result = {};

  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];

    if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
      Object.assign(result, flatten(val, fullKey));
    } else {
      result[fullKey] = val;
    }
  }

  return result;
}

module.exports = { deepMerge, extend, deepClone, pick, omit, flatten };
