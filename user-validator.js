// User validation utilities

function validateRegistrationInput(data) {
  if (!data.email || typeof data.email !== 'string') {
    return { valid: false, error: 'Email is required and must be a string' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: 'Email format is invalid' };
  }
  if (!data.username || data.username.trim().length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }
  if (!data.password || data.password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  return { valid: true };
}

function validateProfileUpdate(data) {
  if (!data.email || typeof data.email !== 'string') {
    return { valid: false, error: 'Email is required and must be a string' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: 'Email format is invalid' };
  }
  if (!data.username || data.username.trim().length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }
  if (data.bio && data.bio.length > 500) {
    return { valid: false, error: 'Bio must be 500 characters or fewer' };
  }
  return { valid: true };
}

function validateInviteInput(data) {
  if (!data.email || typeof data.email !== 'string') {
    return { valid: false, error: 'Email is required and must be a string' };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    return { valid: false, error: 'Email format is invalid' };
  }
  if (!data.role || !['admin', 'member', 'viewer'].includes(data.role)) {
    return { valid: false, error: 'Role must be admin, member, or viewer' };
  }
  return { valid: true };
}

module.exports = { validateRegistrationInput, validateProfileUpdate, validateInviteInput };
