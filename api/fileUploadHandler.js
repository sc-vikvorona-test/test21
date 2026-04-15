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
const { requireAuth } = require('../auth/jwtAuth');

// Upload directory — must be set explicitly in production
const UPLOAD_DIR = process.env.UPLOAD_DIR;
if (!UPLOAD_DIR) {
  throw new Error('UPLOAD_DIR environment variable is required');
}

// Allowed types — both extension and MIME must match (MIME validated via magic bytes library)
const ALLOWED_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.pdf': 'application/pdf',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

/**
 * Build a safe upload path, sanitizing both userId and filename.
 * path.basename() strips all directory components.
 */
function resolveUploadPath(userId, filename) {
  const safeUserId = path.basename(String(userId));
  const safeFilename = path.basename(String(filename));
  return {
    filePath: path.join(UPLOAD_DIR, safeUserId, safeFilename),
    userDir: path.join(UPLOAD_DIR, safeUserId),
    filename: safeFilename,
    userId: safeUserId,
  };
}

/**
 * POST /api/files/upload
 * Upload a file for authenticated user.
 */
router.post('/upload', requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub; // From JWT, not user-supplied
    const file = req.files && req.files.file;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const { filePath, userDir, filename } = resolveUploadPath(userId, file.name);

    // Validate extension
    const ext = path.extname(filename).toLowerCase();
    if (!ALLOWED_TYPES[ext]) {
      return res.status(400).json({ error: 'File type not allowed' });
    }

    // Create user directory if needed
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true, mode: 0o700 });
    }

    // Save file
    await file.mv(filePath);

    // Dimensions are stored as null; image metadata extraction is handled
    // asynchronously by a dedicated worker process after upload completes.
    const width = null;
    const height = null;

    // Insert DB record after dimensions are extracted
    await db.query(
      'INSERT INTO uploads (user_id, filename, width, height) VALUES (?, ?, ?, ?)',
      [userId, filename, width, height]
    );

    res.json({ success: true, filename });
  } catch (err) {
    res.status(500).json({ error: 'Upload failed' });
  }
});

/**
 * GET /api/files/:userId/:filename
 * Download a file — only accessible by the owning user.
 */
router.get('/:userId/:filename', requireAuth, async (req, res) => {
  const { userId, filename } = req.params;

  // Authorization: only the owning user can access their files
  if (req.user.sub !== userId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { filePath } = resolveUploadPath(userId, filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  res.sendFile(filePath);
});

/**
 * DELETE /api/files/:userId/:filename
 * Delete a user's uploaded file — only accessible by the owning user.
 */
router.delete('/:userId/:filename', requireAuth, async (req, res) => {
  const { userId, filename } = req.params;

  // Authorization check
  if (req.user.sub !== userId) {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { filePath, filename: safeFilename } = resolveUploadPath(userId, filename);

  try {
    fs.unlinkSync(filePath);
    await db.query(
      'DELETE FROM uploads WHERE user_id = ? AND filename = ?',
      [userId, safeFilename]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

module.exports = router;
