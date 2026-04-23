import express from 'express';
import pool from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { refreshInternalCache } from '../cache_service.js';

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
    category: findTable('Category')
  };
}

function parseJsonFields(p) {
  if (!p) return null;
  let keyBenefits = p.keyBenefits;
  if (typeof keyBenefits === 'string') {
    try { keyBenefits = JSON.parse(keyBenefits); } catch { keyBenefits = []; }
  }
  return {
    ...p,
    keyBenefits: keyBenefits || [],
    tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : (p.tags || [])
  };
}

// Public: List products with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 200, page = 1 } = req.query;
    const { product, category: catTable } = await getTables();
    
    let query = `SELECT p.*, c.name as categoryName, c.slug as categorySlug 
                 FROM ${product} p 
                 LEFT JOIN ${catTable} c ON p.categoryId = c.id 
                 WHERE 1=1`;
    const params = [];

    if (category) {
      query += ` AND c.slug = ?`;
      params.push(category);
    }
    if (search) {
      query += ` AND (p.name LIKE ? OR p.shortDescription LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY p.id DESC LIMIT ? OFFSET ?`;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    params.push(parseInt(limit), offset);

    const [products] = await pool.query(query, params);
    
    let countQuery = `SELECT COUNT(*) as total FROM ${product} p LEFT JOIN ${catTable} c ON p.categoryId = c.id WHERE 1=1`;
    if (category) countQuery += ` AND c.slug = ?`;
    const [[{ total }]] = await pool.query(countQuery, category ? [category] : []);

    res.json({
      products: products.map(parseJsonFields),
      total,
      page: parseInt(page)
    });
  } catch (err) {
    console.error('[PRODUCTS] List Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Create product
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { product } = await getTables();
    const d = req.body;
    const slug = d.slug || d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const [result] = await pool.query(
      `INSERT INTO ${product} (name, slug, description, price, image, categoryId, affiliateUrl, secondaryUrl, badge, ratingValue, ratingText, shortDescription, keyBenefits)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [d.name, slug, d.description || '', parseFloat(d.price) || 0, d.image, parseInt(d.categoryId), d.affiliateUrl, d.secondaryUrl, d.badge, parseFloat(d.ratingValue) || 5.0, d.ratingText || '4.8/5 Recommended', d.shortDescription, typeof d.keyBenefits === 'object' ? JSON.stringify(d.keyBenefits) : (d.keyBenefits || '[]')]
    );
    
    refreshInternalCache();
    res.status(201).json({ id: result.insertId, name: d.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update product (Unified Route)
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { product } = await getTables();
    const d = req.body;
    const slug = d.slug || d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    await pool.query(
      `UPDATE ${product} SET name=?, slug=?, description=?, price=?, image=?, categoryId=?, affiliateUrl=?, secondaryUrl=?, badge=?, ratingValue=?, ratingText=?, shortDescription=?, keyBenefits=? WHERE id=?`,
      [d.name, slug, d.description, parseFloat(d.price) || 0, d.image, parseInt(d.categoryId), d.affiliateUrl, d.secondaryUrl, d.badge, parseFloat(d.ratingValue) || 5.0, d.ratingText, d.shortDescription, typeof d.keyBenefits === 'object' ? JSON.stringify(d.keyBenefits) : (d.keyBenefits || '[]'), req.params.id]
    );
    
    refreshInternalCache();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete product
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { product } = await getTables();
    await pool.query(`DELETE FROM ${product} WHERE id = ?`, [req.params.id]);
    refreshInternalCache();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
