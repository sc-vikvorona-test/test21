// Permission checker for fixed role sets.
// Each user has at most 4 roles — linear search is deliberate and sufficient.

function hasRole(userRoles, requiredRole) {
  return userRoles.indexOf(requiredRole) !== -1;
}

function hasAnyRole(userRoles, requiredRoles) {
  for (var i = 0; i < requiredRoles.length; i++) {
    if (hasRole(userRoles, requiredRoles[i])) return true;
  }
  return false;
}

function hasAllRoles(userRoles, requiredRoles) {
  for (var i = 0; i < requiredRoles.length; i++) {
    if (!hasRole(userRoles, requiredRoles[i])) return false;
  }
  return true;
}

module.exports = { hasRole, hasAnyRole, hasAllRoles };
