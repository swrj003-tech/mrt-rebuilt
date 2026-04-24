import express from 'express';
import pool from '../db.js';
import { cleanString, parseJson, quoteId, resolveTables } from '../utils/sql.js';

const router = express.Router();

function formatItem(item) {
  return {
    ...item,
    product: item.productId ? {
      id: item.productId,
      name: item.productName,
      slug: item.productSlug,
      image: item.productImage,
      price: item.productPrice,
      affiliateUrl: item.affiliateUrl,
      keyBenefits: parseJson(item.keyBenefits, []),
      category: { slug: item.categorySlug, name: item.categoryName },
    } : null,
  };
}

router.get('/', async (req, res) => {
  try {
    const deviceId = cleanString(req.query.sid, 191);
    if (!deviceId) return res.json([]);
    const tables = await resolveTables(pool, ['WishlistItem', 'Product', 'Category']);
    const [items] = await pool.query(
      `SELECT w.*, p.name as productName, p.slug as productSlug, p.image as productImage, p.price as productPrice,
        p.affiliateUrl, p.keyBenefits, c.slug as categorySlug, c.name as categoryName
       FROM ${quoteId(tables.WishlistItem)} w
       LEFT JOIN ${quoteId(tables.Product)} p ON p.id = w.productId
       LEFT JOIN ${quoteId(tables.Category)} c ON c.id = p.categoryId
       WHERE w.deviceId = ?
       ORDER BY w.createdAt DESC`,
      [deviceId]
    );
    res.json(items.map(formatItem));
  } catch (err) {
    console.error('[WISHLIST] Fetch failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const deviceId = cleanString(req.body.sessionId || req.body.deviceId, 191);
    const productId = Number.parseInt(req.body.productId, 10);
    if (!deviceId || !Number.isFinite(productId)) {
      return res.status(400).json({ error: 'deviceId and productId required' });
    }

    const tables = await resolveTables(pool, ['WishlistItem']);
    const [existing] = await pool.query(
      `SELECT * FROM ${quoteId(tables.WishlistItem)} WHERE deviceId = ? AND productId = ? LIMIT 1`,
      [deviceId, productId]
    );
    if (existing[0]) return res.status(201).json(existing[0]);

    const [result] = await pool.query(
      `INSERT INTO ${quoteId(tables.WishlistItem)} (deviceId, productId) VALUES (?, ?)`,
      [deviceId, productId]
    );
    res.status(201).json({ id: result.insertId, deviceId, productId });
  } catch (err) {
    console.error('[WISHLIST] Create failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:productId', async (req, res) => {
  try {
    const deviceId = cleanString(req.query.sid, 191);
    const productId = Number.parseInt(req.params.productId, 10);
    if (!deviceId || !Number.isFinite(productId)) return res.status(400).json({ error: 'Invalid request' });
    const tables = await resolveTables(pool, ['WishlistItem']);
    await pool.query(
      `DELETE FROM ${quoteId(tables.WishlistItem)} WHERE deviceId = ? AND productId = ?`,
      [deviceId, productId]
    );
    res.json({ success: true });
  } catch (err) {
    console.error('[WISHLIST] Delete failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
