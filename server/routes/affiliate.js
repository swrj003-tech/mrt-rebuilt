import express from 'express';
import crypto from 'crypto';
import pool from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { clampInt, quoteId, resolveTables } from '../utils/sql.js';

const router = express.Router();

router.get('/redirect/:productId', async (req, res) => {
  try {
    const productId = Number.parseInt(req.params.productId, 10);
    if (!Number.isFinite(productId)) return res.status(400).json({ error: 'Invalid product ID' });

    const tables = await resolveTables(pool, ['Product', 'AffiliateClick']);
    const [products] = await pool.query(
      `SELECT id, name, affiliateUrl FROM ${quoteId(tables.Product)} WHERE id = ? AND isActive = 1 LIMIT 1`,
      [productId]
    );
    const product = products[0];
    if (!product) return res.status(404).json({ error: 'Product not found' });

    const ipHash = crypto.createHash('sha256').update(req.ip || 'unknown').digest('hex').slice(0, 32);
    await pool.query(
      `INSERT INTO ${quoteId(tables.AffiliateClick)} (productId, ip, userAgent) VALUES (?, ?, ?)`,
      [product.id, ipHash, String(req.headers['user-agent'] || '').slice(0, 500)]
    ).catch((err) => console.warn('[AFFILIATE] Click tracking failed:', err.message));

    const fallback = `https://wa.me/?text=I%20am%20interested%20in%20${encodeURIComponent(product.name)}`;
    res.redirect(302, product.affiliateUrl || fallback);
  } catch (err) {
    console.error('[AFFILIATE] Redirect failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/analytics', authMiddleware, adminOnly, async (req, res) => {
  try {
    const days = clampInt(req.query.days, 30, 1, 365);
    const tables = await resolveTables(pool, ['AffiliateClick', 'Product']);
    const [topProducts] = await pool.query(
      `SELECT p.id, p.name, p.image, COUNT(c.id) as clicks
       FROM ${quoteId(tables.AffiliateClick)} c
       LEFT JOIN ${quoteId(tables.Product)} p ON p.id = c.productId
       WHERE c.clickedAt >= DATE_SUB(NOW(), INTERVAL ? DAY)
       GROUP BY p.id, p.name, p.image
       ORDER BY clicks DESC
       LIMIT 10`,
      [days]
    );
    const [[{ totalClicks }]] = await pool.query(
      `SELECT COUNT(*) as totalClicks FROM ${quoteId(tables.AffiliateClick)} WHERE clickedAt >= DATE_SUB(NOW(), INTERVAL ? DAY)`,
      [days]
    );
    res.json({ totalClicks, topProducts });
  } catch (err) {
    console.error('[AFFILIATE] Analytics failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
