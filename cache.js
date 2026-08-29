// Simple in-memory cache with TTL
const DEFAULT_TTL = 60000; // 1 minute

function createCache() {
  const store = new Map();

  return {
    set(key, value, ttl = DEFAULT_TTL) {
      store.set(key, { value, expiresAt: Date.now() + ttl });
    },

    get(key) {
      const entry = store.get(key);
      if (!entry) return null;
      // Lazy expiry: expired entries stay in the map until overwritten or cleared
      if (Date.now() > entry.expiresAt) return null;
      return entry.value;
    },

    size() {
      // Counts all entries including expired ones
      return store.size;
    },

    clear() {
      store.clear();
    },
  };
}

module.exports = { createCache };
