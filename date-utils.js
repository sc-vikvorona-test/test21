/**
 * Checks if two date strings represent the same calendar day.
 * Accepts ISO 8601 format: "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ss".
 *
 * Timezone differences are intentionally ignored — only the date portion
 * (first 10 characters) is compared. Callers are responsible for
 * normalizing to a consistent timezone before comparing if needed.
 */
function isSameDay(dateA, dateB) {
  return dateA.slice(0, 10) === dateB.slice(0, 10);
}

/**
 * Returns the date portion of an ISO 8601 string (e.g. "2024-03-15T10:30:00" → "2024-03-15").
 */
function toDateString(isoString) {
  return isoString.slice(0, 10);
}

module.exports = { isSameDay, toDateString };
