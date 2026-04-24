import express from 'express';
import pool from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { cleanString, isEmail, quoteId, resolveTable } from '../utils/sql.js';

const router = express.Router();

async function ensureNewsletterTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS ${quoteId('NewsletterSub')} (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_newsletter_email (email)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `);
}

router.post('/subscribe', async (req, res) => {
  try {
    await ensureNewsletterTable();
    const table = await resolveTable(pool, 'NewsletterSub');
    const email = cleanString(req.body.email, 180).toLowerCase();
    if (!isEmail(email)) return res.status(400).json({ error: 'Valid email required' });

    const [result] = await pool.query(
      `INSERT INTO ${quoteId(table)} (email) VALUES (?) ON DUPLICATE KEY UPDATE email = VALUES(email)`,
      [email]
    );

    res.status(201).json({ success: true, id: result.insertId || null });
  } catch (err) {
    console.error('[NEWSLETTER] Subscribe failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/subscribers', authMiddleware, adminOnly, async (req, res) => {
  try {
    await ensureNewsletterTable();
    const table = await resolveTable(pool, 'NewsletterSub');
    const [subs] = await pool.query(`SELECT * FROM ${quoteId(table)} ORDER BY createdAt DESC LIMIT 1000`);
    res.json(subs);
  } catch (err) {
    console.error('[NEWSLETTER] List failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/subscribers/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid subscriber ID' });
    const table = await resolveTable(pool, 'NewsletterSub');
    await pool.query(`DELETE FROM ${quoteId(table)} WHERE id = ?`, [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('[NEWSLETTER] Delete failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
