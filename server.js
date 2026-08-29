const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;
const VERSION = '1.0.0';

app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Hello World',
    timestamp: new Date().toISOString(),
    version: VERSION,
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
