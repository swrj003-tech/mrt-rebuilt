import express from 'express';
import pool from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { refreshInternalCache } from '../cache_service.js';
import { cleanString, getColumns, quoteId, resolveTable } from '../utils/sql.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const table = await resolveTable(pool, 'Testimonial');
    const columns = await getColumns(pool, table);
    const activeWhere = columns.has('isActive') ? 'WHERE isActive = 1' : '';
    const [rows] = await pool.query(
      `SELECT * FROM ${quoteId(table)} ${activeWhere} ORDER BY sortOrder ASC, id ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error('[TESTIMONIALS] Fetch failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const table = await resolveTable(pool, 'Testimonial');
    const columns = await getColumns(pool, table);
    const payload = {
      name: cleanString(req.body.name, 180),
      location: cleanString(req.body.location, 180) || null,
      quote: cleanString(req.body.quote, 500) || null,
      text: cleanString(req.body.text, 1000) || null,
      region: cleanString(req.body.region || 'us', 30),
      isActive: req.body.isActive === false ? 0 : 1,
      rating: Number.parseInt(req.body.rating, 10) || 5,
      sortOrder: Number.parseInt(req.body.sortOrder, 10) || 0,
    };
    if (!payload.name) return res.status(400).json({ error: 'Name is required' });
    const keys = Object.keys(payload).filter((key) => columns.has(key));

    const [result] = await pool.query(
      `INSERT INTO ${quoteId(table)} (${keys.map(quoteId).join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`,
      keys.map((key) => payload[key])
    );
    refreshInternalCache();
    res.status(201).json({ id: result.insertId, name: payload.name });
  } catch (err) {
    console.error('[TESTIMONIALS] Create failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid testimonial ID' });
    const table = await resolveTable(pool, 'Testimonial');
    await pool.query(`DELETE FROM ${quoteId(table)} WHERE id = ?`, [id]);
    refreshInternalCache();
    res.json({ success: true });
  } catch (err) {
    console.error('[TESTIMONIALS] Delete failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
