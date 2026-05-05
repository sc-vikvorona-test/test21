/**
 * Formats a byte count as a human-readable string (e.g. 1024 → "1 KB").
 * Uses 1024-based division (binary prefix, not SI prefix).
 */
function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let i = 0;
  while (bytes >= 1024 && i < units.length - 1) {
    bytes /= 1024;
    i++;
  }
  return `${bytes.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

module.exports = { formatBytes };
