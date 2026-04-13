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
 */
router.post('/upload', async (req, res) => {
  try {
    const { userId } = req.body;
    const file = req.files && req.files.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    // Fix for issue 1: sanitize filename to prevent path traversal
    const filename = path.basename(file.name);
    const safeUserId = path.basename(userId);
    const uploadPath = path.join(UPLOAD_DIR, safeUserId, filename);

    // Create user directory if needed
    const userDir = path.join(UPLOAD_DIR, safeUserId);
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    // Issue 2: "Fix" — added MIME type check via file.mimetype
    // NOTE: This is a wrong fix — file.mimetype comes from the client's
    // Content-Type header and can be spoofed. Real fix would use magic bytes.
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.docx'];
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
    const ext = path.extname(filename).toLowerCase();
    const mimeType = file.mimetype; // Client-supplied, not validated against actual file content

    if (!allowedExtensions.includes(ext) || !allowedMimeTypes.includes(mimeType)) {
      return res.status(400).json({ error: 'File type not allowed' });
    }

    // Save file
    await file.mv(uploadPath);

    // Issue 3: Command injection still present — uploadPath not quoted
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

    res.json({ success: true, filename });
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

  // Fix issue 1 in download too
  const filePath = path.join(UPLOAD_DIR, path.basename(userId), path.basename(filename));

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
  const filePath = path.join(UPLOAD_DIR, path.basename(userId), path.basename(filename));

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
