import express from 'express';
import pool from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { refreshInternalCache } from '../cache_service.js';

const router = express.Router();

// Helper: Get table names dynamically
async function getTables() {
  const [tables] = await pool.query('SHOW TABLES');
  const list = tables.map(t => Object.values(t)[0].toLowerCase());
  return {
    testimonial: list.includes('testimonial') ? tables.find(t => Object.values(t)[0].toLowerCase() === 'testimonial')[Object.keys(tables[0])[0]] : 'Testimonial'
  };
}

// Public: List all active testimonials
router.get('/', async (req, res) => {
  try {
    const { testimonial } = await getTables();
    const [rows] = await pool.query(`SELECT * FROM ${testimonial} WHERE isActive = 1 ORDER BY sortOrder ASC`);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Create testimonial
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { testimonial } = await getTables();
    const { name, location, quote, text, region, isActive, sortOrder } = req.body;
    const [result] = await pool.query(
      `INSERT INTO ${testimonial} (name, location, quote, text, region, isActive, sortOrder) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, location, quote, text, region || 'us', isActive !== false ? 1 : 0, sortOrder || 0]
    );
    refreshInternalCache();
    res.status(201).json({ id: result.insertId, name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete testimonial
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { testimonial } = await getTables();
    await pool.query(`DELETE FROM ${testimonial} WHERE id = ?`, [req.params.id]);
    refreshInternalCache();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
