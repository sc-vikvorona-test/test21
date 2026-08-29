/**
 * Removes the trailing slash from a URL path, if present.
 * @param {string} url
 * @returns {string}
 */
function stripTrailingSlash(url) {
  return url.replace(/\/+$/, '');
}

/**
 * Joins a base URL and a path segment, ensuring exactly one slash between them.
 * @param {string} base
 * @param {string} path
 * @returns {string}
 */
function joinUrl(base, path) {
  return stripTrailingSlash(base) + '/' + path.replace(/^\/+/, '');
}

module.exports = { stripTrailingSlash, joinUrl };
