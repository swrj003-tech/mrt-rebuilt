import express from 'express';
import crypto from 'crypto';
import pool from '../db.js';
import { cleanString, isEmail, quoteId, resolveTable } from '../utils/sql.js';

const router = express.Router();

function plainText(value, maxLength) {
  return cleanString(value, maxLength).replace(/[<>]/g, '');
}

async function ensureContactTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${quoteId('ContactMessage')} (
      id VARCHAR(191) NOT NULL PRIMARY KEY,
      name VARCHAR(191) NOT NULL,
      email VARCHAR(191) NOT NULL,
      phone VARCHAR(191) NULL,
      subject VARCHAR(191) NULL,
      message TEXT NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'new',
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_contact_created (createdAt)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}

router.post('/', async (req, res) => {
  try {
    await ensureContactTable();
    const table = await resolveTable(pool, 'ContactMessage');
    const name = plainText(req.body.name, 120);
    const email = cleanString(req.body.email, 180).toLowerCase();
    const phone = plainText(req.body.phone, 60);
    const subject = plainText(req.body.subject, 180);
    const message = plainText(req.body.message, 5000);

    if (!name || !isEmail(email) || !message) {
      return res.status(400).json({ success: false, error: 'Please provide a valid name, email, and message.' });
    }

    await pool.query(
      `INSERT INTO ${quoteId(table)} (id, name, email, phone, subject, message, status) VALUES (?, ?, ?, ?, ?, ?, 'new')`,
      [crypto.randomUUID(), name, email, phone || null, subject || null, message]
    );

    res.status(201).json({ success: true, message: 'Message sent' });
  } catch (error) {
    console.error('[CONTACT] Submission failed:', error.message);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
