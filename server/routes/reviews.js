import express from 'express';
import pool from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { cleanString, clampInt, quoteId, resolveTables } from '../utils/sql.js';

const router = express.Router();

function plainText(value, maxLength) {
  return cleanString(value, maxLength).replace(/[<>]/g, '');
}

router.get('/:productId', async (req, res) => {
  const productId = Number.parseInt(req.params.productId, 10);
  if (!Number.isFinite(productId)) return res.status(400).json({ error: 'Invalid product ID' });

  try {
    const tables = await resolveTables(pool, ['Review']);
    const [reviews] = await pool.query(
      `SELECT id, userName, rating, comment, isVerified, productId, createdAt
       FROM ${quoteId(tables.Review)}
       WHERE productId = ? AND isVerified = 1
       ORDER BY createdAt DESC`,
      [productId]
    );
    res.json(reviews);
  } catch (err) {
    console.error('[REVIEWS] Fetch failed:', err.message);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

router.post('/', async (req, res) => {
  const productId = Number.parseInt(req.body.productId, 10);
  const userName = plainText(req.body.userName, 120);
  const rating = clampInt(req.body.rating, 5, 1, 5);
  const comment = plainText(req.body.comment, 2000);

  if (!Number.isFinite(productId) || !userName || !comment) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const tables = await resolveTables(pool, ['Review', 'Product']);
    const [result] = await pool.query(
      `INSERT INTO ${quoteId(tables.Review)} (productId, userName, rating, comment, isVerified) VALUES (?, ?, ?, ?, 0)`,
      [productId, userName, rating, comment]
    );

    const [[avg]] = await pool.query(
      `SELECT AVG(rating) as ratingValue FROM ${quoteId(tables.Review)} WHERE productId = ? AND isVerified = 1`,
      [productId]
    );
    if (avg?.ratingValue) {
      await pool.query(
        `UPDATE ${quoteId(tables.Product)} SET ratingValue = ? WHERE id = ?`,
        [Number(avg.ratingValue).toFixed(2), productId]
      );
    }

    res.status(201).json({ id: result.insertId, productId, userName, rating, comment, isVerified: false });
  } catch (err) {
    console.error('[REVIEWS] Create failed:', err.message);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid review ID' });

  try {
    const tables = await resolveTables(pool, ['Review']);
    await pool.query(`DELETE FROM ${quoteId(tables.Review)} WHERE id = ?`, [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('[REVIEWS] Delete failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
