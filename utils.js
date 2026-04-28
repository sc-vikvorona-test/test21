// Utility helpers

export function formatCount(n) {
  return `${n} time${n === 1 ? '' : 's'}`;
}

export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
