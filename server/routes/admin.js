import express from 'express';
import pool from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Helper: Get table names dynamically
async function getTables() {
  const [tables] = await pool.query('SHOW TABLES');
  const rawList = tables.map(t => Object.values(t)[0]);
  const lowerList = rawList.map(t => t.toLowerCase());
  
  const findTable = (target) => {
    const idx = lowerList.indexOf(target.toLowerCase());
    return idx !== -1 ? rawList[idx] : target;
  };

  return {
    product: findTable('Product'),
    category: findTable('Category'),
    click: findTable('AffiliateClick'),
    sub: findTable('NewsletterSub'),
    testimonial: findTable('Testimonial'),
    message: findTable('ContactMessage')
  };
}

// Root ping for CMS health check
router.get('/', (req, res) => res.json({ status: 'MRT Admin API Active', version: '2.5.0 (Raw SQL)' }));

// GET /api/admin/stats - Consolidated dashboard metrics (REWRITTEN FOR SQL)
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const { product, category, click, sub, testimonial, message } = await getTables();
    
    const [[{ pCount }], [{ cCount }], [{ clCount }], [{ sCount }], [{ tCount }], [{ mCount }]] = await Promise.all([
      pool.query(`SELECT COUNT(*) as pCount FROM ${product}`),
      pool.query(`SELECT COUNT(*) as cCount FROM ${category}`),
      pool.query(`SELECT COUNT(*) as clCount FROM ${click}`),
      pool.query(`SELECT COUNT(*) as sCount FROM ${sub}`),
      pool.query(`SELECT COUNT(*) as tCount FROM ${testimonial}`),
      pool.query(`SELECT COUNT(*) as mCount FROM ${message}`).catch(() => [[{ mCount: 0 }]])
    ]);

    // Simplified recent clicks for dashboard
    const [recentClicks] = await pool.query(`
      SELECT c.*, p.name as productName, p.image as productImage 
      FROM ${click} c 
      LEFT JOIN ${product} p ON c.productId = p.id 
      ORDER BY c.clickedAt DESC LIMIT 10
    `).catch(() => [[]]);

    res.json({
      productCount: pCount,
      categoryCount: cCount,
      clickCount: clCount,
      subscriberCount: sCount,
      testimonialCount: tCount,
      messageCount: mCount,
      recentClicks
    });
  } catch (err) {
    console.error('Admin Stats Error:', err);
    res.status(500).json({ error: 'Failed to fetch admin statistics' });
  }
});

// GET /api/admin/analytics - Detailed click data for charts
router.get('/analytics', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { product, category, click } = await getTables();
    const [clicks] = await pool.query(`SELECT * FROM ${click} ORDER BY clickedAt DESC LIMIT 500`);
    const [categoryDistribution] = await pool.query(`SELECT categoryId, COUNT(*) as _count FROM ${product} GROUP BY categoryId`);
    res.json({ clicks, categoryDistribution });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
