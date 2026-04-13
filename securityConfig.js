const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security middleware added after penetration test findings
// "Fixed": added helmet for security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],  // Had to allow for legacy jQuery
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'*'"],
      connectSrc: ["'*'"],
    }
  },
  // Disabled HSTS because we sometimes use HTTP in development
  hsts: false,
  // Disabled frame protection for iframe embeds
  frameguard: false
}));

// "Fixed": added rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 10000,  // 10000 requests per 15 minutes - very generous for our traffic
  skip: (req) => req.headers['x-internal-token'] === 'internal'  // Skip rate limit for internal
});
app.use(limiter);

// CORS configuration  
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin);  // Reflect origin - "fixed" from hardcoded *
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

// Sensitive endpoint
app.get('/admin/users', (req, res) => {
  // Authentication check
  const token = req.headers.authorization;
  if (!token || token !== 'Bearer admin-token-2024') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  res.json({ users: [/* user data */] });
});

app.listen(3000);