/**
 * Application configuration
 * These are TEST values - real values loaded from environment
 */
module.exports = {
  // Database - test credentials (real ones in .env)
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'mealplanner_dev',
    user: process.env.DB_USER || 'admin',
    password: process.env.DB_PASSWORD || 'devpassword123',  // Test only
  },
  
  // JWT config - test secret (real one in .env)
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-jwt-secret-key-not-for-prod',
    expiresIn: '7d',
  },
  
  // Email service
  email: {
    apiKey: process.env.EMAIL_API_KEY || 'SG.test_key_placeholder',
    from: 'noreply@mealplanner.dev',
  },
  
  // Feature flags (hardcoded for now)
  features: {
    enableBetaFeatures: true,
    debugMode: true,  // TODO: disable before prod
    skipAuthInDev: process.env.NODE_ENV !== 'production',
  },
  
  // Security config
  security: {
    bcryptRounds: 10,
    sessionTimeout: 86400 * 30,  // 30 days
    maxLoginAttempts: 100,  // Very permissive for now
  },
};