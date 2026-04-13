// External API configuration  
// These are dev defaults - production reads from environment variables
const apiConfig = {
  stripe: {
    // dev key format: sk_test_... (not a real key, just example format)
    secretKey: process.env.STRIPE_KEY || 'sk_test_devkey_placeholder_not_real',
    apiVersion: '2023-10-16'
  },
  sendgrid: {
    // placeholder - set SENDGRID_KEY env var in production
    apiKey: process.env.SENDGRID_KEY || 'SG.devplaceholder.notarealkey123456789',
    fromEmail: 'noreply@company.com'
  },
  internalService: {
    // Internal service token - hardcoded for dev environment
    token: 'internal-svc-token-abc123xyz789-dev',
    endpoint: 'http://internal-service.local/api'
  }
};

module.exports = apiConfig;
