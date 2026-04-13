/**
 * Date Utility Functions
 *
 * Pure functions for date formatting, comparison, and manipulation.
 * No external dependencies — uses native Date API only.
 * All functions treat inputs as immutable and return new values.
 */

/**
 * Format a date as ISO 8601 date string (YYYY-MM-DD).
 *
 * @param {Date|string|number} date - Input date
 * @returns {string} Formatted date string
 * @throws {TypeError} If input cannot be converted to a valid date
 */
function toISODate(date) {
  const d = toDate(date);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a date as a human-readable string.
 *
 * @param {Date|string|number} date - Input date
 * @param {string} locale - BCP 47 locale tag (default: 'en-US')
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string}
 */
function formatDate(date, locale = 'en-US', options = { year: 'numeric', month: 'long', day: 'numeric' }) {
  const d = toDate(date);
  return new Intl.DateTimeFormat(locale, options).format(d);
}

/**
 * Return a relative time string ("2 days ago", "in 3 hours", etc.)
 *
 * @param {Date|string|number} date
 * @param {Date|string|number} relativeTo - Base date (defaults to now)
 * @returns {string}
 */
function timeAgo(date, relativeTo = new Date()) {
  const d = toDate(date);
  const base = toDate(relativeTo);
  const diffMs = base.getTime() - d.getTime();
  const absMs = Math.abs(diffMs);
  const isFuture = diffMs < 0;

  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  const MONTH = 30 * DAY;
  const YEAR = 365 * DAY;

  let amount;
  let unit;

  if (absMs < MINUTE) {
    return 'just now';
  } else if (absMs < HOUR) {
    amount = Math.round(absMs / MINUTE);
    unit = amount === 1 ? 'minute' : 'minutes';
  } else if (absMs < DAY) {
    amount = Math.round(absMs / HOUR);
    unit = amount === 1 ? 'hour' : 'hours';
  } else if (absMs < WEEK) {
    amount = Math.round(absMs / DAY);
    unit = amount === 1 ? 'day' : 'days';
  } else if (absMs < MONTH) {
    amount = Math.round(absMs / WEEK);
    unit = amount === 1 ? 'week' : 'weeks';
  } else if (absMs < YEAR) {
    amount = Math.round(absMs / MONTH);
    unit = amount === 1 ? 'month' : 'months';
  } else {
    amount = Math.round(absMs / YEAR);
    unit = amount === 1 ? 'year' : 'years';
  }

  return isFuture ? `in ${amount} ${unit}` : `${amount} ${unit} ago`;
}

/**
 * Add a duration to a date and return a new Date.
 *
 * @param {Date|string|number} date
 * @param {object} duration - { years?, months?, days?, hours?, minutes?, seconds? }
 * @returns {Date}
 */
function addDuration(date, duration) {
  const d = new Date(toDate(date).getTime()); // Clone

  if (duration.years) d.setUTCFullYear(d.getUTCFullYear() + duration.years);
  if (duration.months) d.setUTCMonth(d.getUTCMonth() + duration.months);
  if (duration.days) d.setUTCDate(d.getUTCDate() + duration.days);
  if (duration.hours) d.setUTCHours(d.getUTCHours() + duration.hours);
  if (duration.minutes) d.setUTCMinutes(d.getUTCMinutes() + duration.minutes);
  if (duration.seconds) d.setUTCSeconds(d.getUTCSeconds() + duration.seconds);

  return d;
}

/**
 * Check if a date falls within a range (inclusive).
 *
 * @param {Date|string|number} date
 * @param {Date|string|number} start - Range start
 * @param {Date|string|number} end - Range end
 * @returns {boolean}
 */
function isInRange(date, start, end) {
  const d = toDate(date).getTime();
  const s = toDate(start).getTime();
  const e = toDate(end).getTime();
  return d >= s && d <= e;
}

/**
 * Get the start of a calendar unit (day, week, month, year) in UTC.
 *
 * @param {Date|string|number} date
 * @param {'day'|'week'|'month'|'year'} unit
 * @returns {Date}
 */
function startOf(date, unit) {
  const d = toDate(date);

  switch (unit) {
    case 'day':
      return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
    case 'week': {
      const dayOfWeek = d.getUTCDay(); // 0 = Sunday
      return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - dayOfWeek));
    }
    case 'month':
      return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
    case 'year':
      return new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    default:
      throw new TypeError(`Unknown unit: ${unit}`);
  }
}

/**
 * Convert various input types to a Date object.
 * Throws TypeError if the result is not a valid date.
 *
 * @param {Date|string|number} value
 * @returns {Date}
 */
function toDate(value) {
  const d = value instanceof Date ? value : new Date(value);
  if (isNaN(d.getTime())) {
    throw new TypeError(`Invalid date: ${value}`);
  }
  return d;
}

module.exports = {
  toISODate,
  formatDate,
  timeAgo,
  addDuration,
  isInRange,
  startOf,
  toDate,
};
