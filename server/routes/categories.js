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
    category: list.includes('category') ? tables.find(t => Object.values(t)[0].toLowerCase() === 'category')[Object.keys(tables[0])[0]] : 'Category',
    theme: list.includes('categorytheme') ? tables.find(t => Object.values(t)[0].toLowerCase() === 'categorytheme')[Object.keys(tables[0])[0]] : 'CategoryTheme',
    product: list.includes('product') ? tables.find(t => Object.values(t)[0].toLowerCase() === 'product')[Object.keys(tables[0])[0]] : 'Product'
  };
}

// Public: List all categories
router.get('/', async (req, res) => {
  try {
    const { category, theme, product } = await getTables();
    const [categories] = await pool.query(`
      SELECT c.*, t.title, t.subtitle, t.primary, t.secondary, t.seoTitle, t.seoIntro,
      (SELECT COUNT(*) FROM ${product} p WHERE p.categoryId = c.id) as productCount
      FROM ${category} c 
      LEFT JOIN ${theme} t ON c.id = t.categoryId 
      ORDER BY c.sortOrder ASC
    `);
    
    // Format to match old Prisma structure for frontend compatibility
    const formatted = categories.map(c => ({
      ...c,
      theme: {
        title: c.title,
        subtitle: c.subtitle,
        primary: c.primary,
        secondary: c.secondary,
        seoTitle: c.seoTitle,
        seoIntro: c.seoIntro
      },
      _count: { products: c.productCount }
    }));

    res.json(formatted);
  } catch (err) {
    console.error('[CATEGORIES] Fetch Error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Public: Get category by slug with products
router.get('/:slug', async (req, res) => {
  try {
    const { category, theme, product } = await getTables();
    const [rows] = await pool.query(`SELECT * FROM ${category} WHERE slug = ?`, [req.params.slug]);
    const cat = rows[0];
    
    if (!cat) return res.status(404).json({ error: 'Category not found' });

    const [themes] = await pool.query(`SELECT * FROM ${theme} WHERE categoryId = ?`, [cat.id]);
    const [products] = await pool.query(`SELECT * FROM ${product} WHERE categoryId = ? AND isActive = 1 ORDER BY sortOrder ASC`, [cat.id]);

    const result = {
      ...cat,
      theme: themes[0] || null,
      products: products.map(p => ({
        ...p,
        keyBenefits: p.keyBenefits ? JSON.parse(p.keyBenefits) : [],
        tags: p.tags ? JSON.parse(p.tags) : []
      }))
    };

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Create category
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, slug, image, sortOrder, theme } = req.body;
    const finalSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const { category, theme: themeTable } = await getTables();

    const [result] = await pool.query(
      `INSERT INTO ${category} (name, slug, image, sortOrder) VALUES (?, ?, ?, ?)`,
      [name, finalSlug, image || null, sortOrder || 0]
    );
    const catId = result.insertId;

    if (theme) {
      await pool.query(
        `INSERT INTO ${themeTable} (categoryId, title, subtitle, \`primary\`, \`secondary\`, seoTitle, seoIntro) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [catId, theme.title || name, theme.subtitle || '', theme.primary || '#914d00', theme.secondary || '#f28c28', theme.seoTitle || null, theme.seoIntro || null]
      );
    }

    refreshInternalCache();
    res.status(201).json({ id: catId, name, slug: finalSlug });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete category
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { category } = await getTables();
    await pool.query(`DELETE FROM ${category} WHERE id = ?`, [req.params.id]);
    refreshInternalCache();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
