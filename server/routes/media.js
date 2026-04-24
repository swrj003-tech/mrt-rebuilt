import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import pool from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { cleanString, quoteId, resolveTable } from '../utils/sql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, '../../public/assets/uploads');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024, files: 10 },
  fileFilter: (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    cb(null, allowed.includes(file.mimetype));
  },
});

const router = express.Router();

async function ensureMediaTable() {
  await fs.mkdir(uploadDir, { recursive: true });
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${quoteId('MediaFile')} (
      id VARCHAR(191) NOT NULL PRIMARY KEY,
      filename VARCHAR(191) NOT NULL,
      originalName VARCHAR(191) NOT NULL,
      mimeType VARCHAR(191) NOT NULL,
      size INT NOT NULL,
      url VARCHAR(500) NOT NULL,
      altText VARCHAR(191) NOT NULL DEFAULT '',
      uploadedBy VARCHAR(191) NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_media_created (createdAt)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}

router.post('/upload', authMiddleware, adminOnly, upload.array('files', 10), async (req, res) => {
  try {
    await ensureMediaTable();
    if (!req.files?.length) return res.status(400).json({ error: 'No supported images provided' });

    const table = await resolveTable(pool, 'MediaFile');
    const files = [];

    for (const file of req.files) {
      const id = crypto.randomUUID();
      const filename = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.webp`;
      const outputPath = path.join(uploadDir, filename);

      await sharp(file.buffer)
        .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 84 })
        .toFile(outputPath);

      const media = {
        id,
        filename,
        originalName: cleanString(file.originalname, 180),
        mimeType: 'image/webp',
        size: file.size,
        url: `/assets/uploads/${filename}`,
        altText: cleanString(req.body.altText, 180),
        uploadedBy: String(req.user?.id || ''),
      };

      await pool.query(
        `INSERT INTO ${quoteId(table)} (id, filename, originalName, mimeType, size, url, altText, uploadedBy) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [media.id, media.filename, media.originalName, media.mimeType, media.size, media.url, media.altText, media.uploadedBy]
      );

      files.push(media);
    }

    res.status(201).json(files);
  } catch (err) {
    console.error('[MEDIA] Upload failed:', err.message);
    res.status(500).json({ error: 'Upload failed' });
  }
});

router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    await ensureMediaTable();
    const table = await resolveTable(pool, 'MediaFile');
    const [files] = await pool.query(`SELECT * FROM ${quoteId(table)} ORDER BY createdAt DESC LIMIT 100`);
    res.json(files);
  } catch (err) {
    console.error('[MEDIA] List failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await ensureMediaTable();
    const table = await resolveTable(pool, 'MediaFile');
    const id = cleanString(req.params.id, 191);
    const [rows] = await pool.query(`SELECT filename FROM ${quoteId(table)} WHERE id = ?`, [id]);
    await pool.query(`DELETE FROM ${quoteId(table)} WHERE id = ?`, [id]);
    if (rows[0]?.filename) {
      await fs.unlink(path.join(uploadDir, rows[0].filename)).catch(() => {});
    }
    res.json({ success: true });
  } catch (err) {
    console.error('[MEDIA] Delete failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
