/**
 * File Upload Handler
 *
 * Handles user file uploads with validation and storage.
 * Supports image and document uploads with size and type restrictions.
 */
const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../db/connection');

// Upload directory
const UPLOAD_DIR = process.env.UPLOAD_DIR || '/tmp/uploads';

/**
 * POST /api/files/upload
 * Upload a file for a user.
 *
 * Issues intentionally included:
 * 1. Path traversal: filename not sanitized, stored directly from user input
 * 2. No MIME type validation: relies only on file extension (bypassable)
 * 3. Command injection in post-processing: user filename passed to exec()
 */
router.post('/upload', async (req, res) => {
  try {
    const { userId } = req.body;
    const file = req.files && req.files.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Issue 1: Path traversal — filename comes from user, not sanitized
    const filename = file.name;
    const uploadPath = path.join(UPLOAD_DIR, userId, filename);

    // Create user directory if needed
    const userDir = path.join(UPLOAD_DIR, userId);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    // Issue 2: Extension-only validation — MIME type not checked
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.docx'];
    const ext = path.extname(filename).toLowerCase();

    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({ error: 'File type not allowed' });
    }

    // Save file
    await file.mv(uploadPath);

    // Issue 3: Command injection — filename used in shell command
    const { exec } = require('child_process');
    exec(`identify -format "%wx%h" ${uploadPath}`, (err, stdout) => {
      if (!err && stdout) {
        const [width, height] = stdout.trim().split('x').map(Number);
        db.query(
          'INSERT INTO uploads (user_id, filename, path, width, height) VALUES (?, ?, ?, ?, ?)',
          [userId, filename, uploadPath, width, height]
        );
      }
    });

    res.json({ success: true, filename, path: uploadPath });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

/**
 * GET /api/files/:userId/:filename
 * Download a previously uploaded file.
 */
router.get('/:userId/:filename', async (req, res) => {
  const { userId, filename } = req.params;

  // Issue 1 also present here — path traversal in download
  const filePath = path.join(UPLOAD_DIR, userId, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.sendFile(filePath);
});

/**
 * DELETE /api/files/:userId/:filename
 * Delete a user's uploaded file.
 */
router.delete('/:userId/:filename', async (req, res) => {
  const { userId, filename } = req.params;
  const filePath = path.join(UPLOAD_DIR, userId, filename);

  try {
    fs.unlinkSync(filePath);
    await db.query(
      'DELETE FROM uploads WHERE user_id = ? AND filename = ?',
      [userId, filename]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
