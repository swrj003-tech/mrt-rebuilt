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
    product: list.includes('product') ? tables.find(t => Object.values(t)[0].toLowerCase() === 'product')[Object.keys(tables[0])[0]] : 'Product',
    category: list.includes('category') ? tables.find(t => Object.values(t)[0].toLowerCase() === 'category')[Object.keys(tables[0])[0]] : 'Category'
  };
}

function parseJsonFields(p) {
  if (!p) return null;
  return {
    ...p,
    keyBenefits: typeof p.keyBenefits === 'string' ? JSON.parse(p.keyBenefits) : (p.keyBenefits || []),
    tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : (p.tags || [])
  };
}

// Public: List products with filters
router.get('/', async (req, res) => {
  try {
    const { category, search, limit = 50, page = 1 } = req.query;
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
      query += ` AND (p.name LIKE ? OR p.description LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY p.sortOrder ASC LIMIT ? OFFSET ?`;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    params.push(parseInt(limit), offset);

    const [products] = await pool.query(query, params);
    const [[{ total }]] = await pool.query(`SELECT COUNT(*) as total FROM ${product} p LEFT JOIN ${catTable} c ON p.categoryId = c.id WHERE 1=1 ${category ? 'AND c.slug = ?' : ''}`, category ? [category] : []);

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

// Public: Get product by slug
router.get('/by-slug/:slug', async (req, res) => {
  try {
    const { product, category: catTable } = await getTables();
    const [rows] = await pool.query(`SELECT p.*, c.name as categoryName FROM ${product} p LEFT JOIN ${catTable} c ON p.categoryId = c.id WHERE p.slug = ?`, [req.params.slug]);
    if (!rows[0]) return res.status(404).json({ error: 'Product not found' });
    res.json(parseJsonFields(rows[0]));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Create product
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { product } = await getTables();
    const d = req.body;
    const slug = d.slug || d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const [result] = await pool.query(
      `INSERT INTO ${product} (name, slug, shortBenefit, description, price, image, badge, ratingValue, categoryId, tags, keyBenefits, affiliateUrl, isActive, sortOrder)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [d.name, slug, d.shortBenefit || '', d.description || '', d.price, d.image, d.badge, d.ratingValue || 5.0, d.categoryId, JSON.stringify(d.tags || []), JSON.stringify(d.keyBenefits || []), d.affiliateUrl, 1, d.sortOrder || 0]
    );
    
    refreshInternalCache();
    res.status(201).json({ id: result.insertId, name: d.name, slug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update product
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { product } = await getTables();
    const d = req.body;
    await pool.query(
      `UPDATE ${product} SET name=?, shortBenefit=?, description=?, price=?, image=?, badge=?, categoryId=?, tags=?, keyBenefits=?, affiliateUrl=?, sortOrder=? WHERE id=?`,
      [d.name, d.shortBenefit, d.description, d.price, d.image, d.badge, d.categoryId, JSON.stringify(d.tags || []), JSON.stringify(d.keyBenefits || []), d.affiliateUrl, d.sortOrder, req.params.id]
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
