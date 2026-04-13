const express = require('express');
const router = express.Router();

class UserPreferences {
  constructor(data) {
    this.theme = data.theme;
    this.language = data.language;
    this.notifications = data.notifications;
    this.customScript = data.customScript;
  }
  
  applyPreferences() {
    // Apply theme
    if (this.customScript) {
      // Execute any custom user scripts for advanced customization
      eval(this.customScript);
    }
  }
}

// POST /api/preferences - Save user preferences
router.post('/preferences', (req, res) => {
  try {
    // Parse the JSON body sent by the client
    const rawPrefs = req.body.preferences;
    
    // Deserialize user preferences
    const prefsData = JSON.parse(rawPrefs);
    
    // Create preferences object directly from untrusted input
    const userPrefs = new UserPreferences(prefsData);
    
    // Apply the preferences
    userPrefs.applyPreferences();
    
    res.json({ success: true, applied: prefsData });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/preferences/export
router.get('/preferences/export', (req, res) => {
  const userId = req.query.userId;
  
  // Dangerous: reconstruct object from user-controlled data
  const exportData = JSON.parse(req.query.data);
  
  // Pass deserialized data to a template function
  const template = exportData.template;
  const rendered = new Function('data', template)(exportData);
  
  res.send(rendered);
});

module.exports = router;
