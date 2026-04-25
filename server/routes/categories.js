import express from 'express';
import pool from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { refreshInternalCache } from '../cache_service.js';
import { cleanString, getColumns, parseJson, quoteId, resolveTables } from '../utils/sql.js';

const router = express.Router();

function slugify(value) {
  return cleanString(value, 180).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function formatCategory(category) {
  return {
    ...category,
    theme: {
      title: category.themeTitle || category.title || category.name,
      subtitle: category.subtitle,
      primary: category.primary,
      secondary: category.secondary,
      seoTitle: category.seoTitle,
      seoIntro: category.seoIntro,
    },
    _count: { products: category.productCount || 0 },
  };
}

async function hasTable(table) {
  try {
    await pool.query(`SHOW COLUMNS FROM ${quoteId(table)}`);
    return true;
  } catch {
    return false;
  }
}

router.get('/', async (req, res) => {
  try {
    const { Category, CategoryTheme, Product } = await resolveTables(pool, ['Category', 'CategoryTheme', 'Product']);
    const themeExists = await hasTable(CategoryTheme);
    const productExists = await hasTable(Product);

    const themeSelect = themeExists
      ? ', t.title as themeTitle, t.subtitle, t.primary, t.secondary, t.seoTitle, t.seoIntro'
      : ', NULL as themeTitle, NULL as subtitle, NULL as primary, NULL as secondary, NULL as seoTitle, NULL as seoIntro';
    const themeJoin = themeExists ? `LEFT JOIN ${quoteId(CategoryTheme)} t ON c.id = t.categoryId` : '';
    const productCount = productExists
      ? `(SELECT COUNT(*) FROM ${quoteId(Product)} p WHERE p.categoryId = c.id) as productCount`
      : '0 as productCount';

    const [categories] = await pool.query(
      `SELECT c.*, ${productCount} ${themeSelect}
       FROM ${quoteId(Category)} c
       ${themeJoin}
       ORDER BY c.sortOrder ASC, c.id ASC`
    );

    res.json(categories.map(formatCategory));
  } catch (err) {
    console.error('[CATEGORIES] Fetch failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const { Category, CategoryTheme, Product } = await resolveTables(pool, ['Category', 'CategoryTheme', 'Product']);
    const [rows] = await pool.query(`SELECT * FROM ${quoteId(Category)} WHERE slug = ? LIMIT 1`, [cleanString(req.params.slug, 180)]);
    const category = rows[0];
    if (!category) return res.status(404).json({ error: 'Category not found' });

    let theme = null;
    if (await hasTable(CategoryTheme)) {
      const [themes] = await pool.query(`SELECT * FROM ${quoteId(CategoryTheme)} WHERE categoryId = ? LIMIT 1`, [category.id]);
      theme = themes[0] || null;
    }

    const [products] = await pool.query(
      `SELECT * FROM ${quoteId(Product)} WHERE categoryId = ? AND isActive = 1 ORDER BY sortOrder ASC, id DESC`,
      [category.id]
    );

    res.json({
      ...category,
      theme,
      products: products.map((product) => ({
        ...product,
        keyBenefits: parseJson(product.keyBenefits, []),
        tags: parseJson(product.tags, []),
      })),
    });
  } catch (err) {
    console.error('[CATEGORIES] Fetch one failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { Category, CategoryTheme } = await resolveTables(pool, ['Category', 'CategoryTheme']);
    const columns = await getColumns(pool, Category);
    const name = cleanString(req.body.name, 180);
    if (!name) return res.status(400).json({ error: 'Category name is required' });

    const payload = {
      name,
      slug: slugify(req.body.slug || name),
      image: cleanString(req.body.image, 500) || null,
      description: cleanString(req.body.description, 1000) || null,
      sortOrder: Number.parseInt(req.body.sortOrder, 10) || 0,
      updatedAt: new Date(),
    };
    const keys = Object.keys(payload).filter((key) => columns.has(key));

    const [result] = await pool.query(
      `INSERT INTO ${quoteId(Category)} (${keys.map(quoteId).join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`,
      keys.map((key) => payload[key])
    );

    if (req.body.theme && await hasTable(CategoryTheme)) {
      const theme = req.body.theme;
      await pool.query(
        `INSERT INTO ${quoteId(CategoryTheme)} (categoryId, title, subtitle, ${quoteId('primary')}, ${quoteId('secondary')}, seoTitle, seoIntro)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), subtitle = VALUES(subtitle), ${quoteId('primary')} = VALUES(${quoteId('primary')}), ${quoteId('secondary')} = VALUES(${quoteId('secondary')}), seoTitle = VALUES(seoTitle), seoIntro = VALUES(seoIntro)`,
        [result.insertId, cleanString(theme.title || name, 180), cleanString(theme.subtitle, 300), cleanString(theme.primary || '#914d00', 50), cleanString(theme.secondary || '#f28c28', 50), cleanString(theme.seoTitle, 180) || null, cleanString(theme.seoIntro, 1000) || null]
      );
    }

    refreshInternalCache();
    res.status(201).json({ id: result.insertId, name, slug: payload.slug });
  } catch (err) {
    console.error('[CATEGORIES] Create failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid category ID' });

    const { Category, CategoryTheme } = await resolveTables(pool, ['Category', 'CategoryTheme']);
    const columns = await getColumns(pool, Category);
    const payload = {
      name: cleanString(req.body.name, 180),
      slug: slugify(req.body.slug || req.body.name),
      image: cleanString(req.body.image, 500) || null,
      description: cleanString(req.body.description, 1000) || null,
      sortOrder: Number.parseInt(req.body.sortOrder, 10) || 0,
      updatedAt: new Date(),
    };
    const keys = Object.keys(payload).filter((key) => columns.has(key) && payload[key] !== '');
    if (!keys.length) return res.status(400).json({ error: 'No category fields to update' });

    await pool.query(
      `UPDATE ${quoteId(Category)} SET ${keys.map((key) => `${quoteId(key)} = ?`).join(', ')} WHERE id = ?`,
      [...keys.map((key) => payload[key]), id]
    );

    if (req.body.theme && await hasTable(CategoryTheme)) {
      const theme = req.body.theme;
      await pool.query(
        `INSERT INTO ${quoteId(CategoryTheme)} (categoryId, title, subtitle, ${quoteId('primary')}, ${quoteId('secondary')}, seoTitle, seoIntro)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE title = VALUES(title), subtitle = VALUES(subtitle), ${quoteId('primary')} = VALUES(${quoteId('primary')}), ${quoteId('secondary')} = VALUES(${quoteId('secondary')}), seoTitle = VALUES(seoTitle), seoIntro = VALUES(seoIntro)`,
        [id, cleanString(theme.title || payload.name, 180), cleanString(theme.subtitle, 300), cleanString(theme.primary || '#914d00', 50), cleanString(theme.secondary || '#f28c28', 50), cleanString(theme.seoTitle, 180) || null, cleanString(theme.seoIntro, 1000) || null]
      );
    }

    refreshInternalCache();
    res.json({ success: true, id });
  } catch (err) {
    console.error('[CATEGORIES] Update failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid category ID' });
    
    const { Category, Product, CategoryTheme } = await resolveTables(pool, ['Category', 'Product', 'CategoryTheme']);
    
    // 1. Delete associated products
    if (await hasTable(Product)) {
      await pool.query(`DELETE FROM ${quoteId(Product)} WHERE categoryId = ?`, [id]);
    }
    
    // 2. Delete associated theme
    if (await hasTable(CategoryTheme)) {
      await pool.query(`DELETE FROM ${quoteId(CategoryTheme)} WHERE categoryId = ?`, [id]);
    }

    // 3. Delete category itself
    await pool.query(`DELETE FROM ${quoteId(Category)} WHERE id = ?`, [id]);
    
    refreshInternalCache();
    res.json({ success: true });
  } catch (err) {
    console.error('[CATEGORIES] Delete failed:', err.message);
    res.status(500).json({ error: 'Server error: ' + err.message });
  }
});

export default router;
