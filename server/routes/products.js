import express from 'express';
import pool from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { refreshInternalCache } from '../cache_service.js';
import { clampInt, cleanString, getColumns, parseJson, quoteId, resolveTables } from '../utils/sql.js';

const router = express.Router();

function slugify(value) {
  return cleanString(value, 180).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function formatProduct(product) {
  return {
    ...product,
    keyBenefits: parseJson(product.keyBenefits, []),
    tags: parseJson(product.tags, []),
    category: product.categoryId ? {
      id: product.categoryId,
      name: product.categoryName,
      slug: product.categorySlug,
    } : null,
  };
}

function productPayload(body, columns, existing = {}) {
  const values = {
    name: cleanString(body.name ?? existing.name, 180),
    slug: slugify(body.slug || body.name || existing.name),
    description: cleanString(body.description ?? existing.description, 5000),
    shortBenefit: cleanString(body.shortBenefit || body.shortDescription || existing.shortBenefit, 500),
    shortDescription: cleanString(body.shortDescription || body.shortBenefit || existing.shortDescription, 500),
    price: Number.parseFloat(body.price) || 0,
    originalPrice: body.originalPrice ? Number.parseFloat(body.originalPrice) || null : null,
    currency: cleanString(body.currency || existing.currency || 'USD', 10).toUpperCase(),
    image: cleanString(body.image ?? existing.image, 500) || null,
    badge: cleanString(body.badge ?? existing.badge, 100) || null,
    affiliateUrl: cleanString(body.affiliateUrl ?? existing.affiliateUrl, 1000) || null,
    secondaryUrl: cleanString(body.secondaryUrl ?? existing.secondaryUrl, 1000) || null,
    isActive: body.isActive === false ? 0 : 1,
    sortOrder: Number.parseInt(body.sortOrder, 10) || 0,
    ratingValue: Number.parseFloat(body.ratingValue) || 5,
    ratingText: cleanString(body.ratingText || existing.ratingText || '4.8/5 Recommended', 100),
    categoryId: Number.parseInt(body.categoryId ?? existing.categoryId, 10),
    keyBenefits: JSON.stringify(Array.isArray(body.keyBenefits)
      ? body.keyBenefits
      : String(body.keyBenefits || existing.keyBenefits || '').split('\n').map((x) => x.trim()).filter(Boolean)),
    tags: JSON.stringify(Array.isArray(body.tags)
      ? body.tags
      : String(body.tags || existing.tags || '').split(',').map((x) => x.trim()).filter(Boolean)),
    updatedAt: new Date(),
  };

  if (!values.name || !Number.isFinite(values.categoryId)) {
    const error = new Error('Product name and category are required');
    error.status = 400;
    throw error;
  }

  return Object.fromEntries(
    Object.entries(values).filter(([key, value]) => columns.has(key) && value !== undefined)
  );
}

async function loadProductById(table, id) {
  const [rows] = await pool.query(`SELECT * FROM ${quoteId(table)} WHERE id = ? LIMIT 1`, [id]);
  return rows[0] || null;
}

router.get('/', async (req, res) => {
  try {
    const { Product, Category } = await resolveTables(pool, ['Product', 'Category']);
    const limit = clampInt(req.query.limit, 200, 1, 200);
    const page = clampInt(req.query.page, 1, 1, 10000);
    const offset = (page - 1) * limit;

    let where = 'WHERE 1=1';
    const params = [];
    if (req.query.category) {
      where += ' AND c.slug = ?';
      params.push(cleanString(req.query.category, 180));
    }
    if (req.query.search) {
      where += ' AND (p.name LIKE ? OR p.description LIKE ? OR p.shortBenefit LIKE ?)';
      const query = `%${cleanString(req.query.search, 180)}%`;
      params.push(query, query, query);
    }

    const [products] = await pool.query(
      `SELECT p.*, c.name as categoryName, c.slug as categorySlug
       FROM ${quoteId(Product)} p
       LEFT JOIN ${quoteId(Category)} c ON p.categoryId = c.id
       ${where}
       ORDER BY p.sortOrder ASC, p.id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total
       FROM ${quoteId(Product)} p
       LEFT JOIN ${quoteId(Category)} c ON p.categoryId = c.id
       ${where}`,
      params
    );

    res.json({ products: products.map(formatProduct), total, page });
  } catch (err) {
    console.error('[PRODUCTS] List failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { Product } = await resolveTables(pool, ['Product']);
    const columns = await getColumns(pool, Product);
    const payload = productPayload(req.body, columns);
    const keys = Object.keys(payload);

    const [result] = await pool.query(
      `INSERT INTO ${quoteId(Product)} (${keys.map(quoteId).join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`,
      keys.map((key) => payload[key])
    );

    refreshInternalCache();
    res.status(201).json({ id: result.insertId, name: payload.name });
  } catch (err) {
    console.error('[PRODUCTS] Create failed:', err.message);
    res.status(err.status || 500).json({ error: err.status ? err.message : 'Server error' });
  }
});

router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid product ID' });

    const { Product } = await resolveTables(pool, ['Product']);
    const existing = await loadProductById(Product, id);
    if (!existing) return res.status(404).json({ error: 'Product not found' });

    const columns = await getColumns(pool, Product);
    const payload = productPayload(req.body, columns, existing);
    const keys = Object.keys(payload);

    await pool.query(
      `UPDATE ${quoteId(Product)} SET ${keys.map((key) => `${quoteId(key)} = ?`).join(', ')} WHERE id = ?`,
      [...keys.map((key) => payload[key]), id]
    );

    refreshInternalCache();
    res.json({ success: true });
  } catch (err) {
    console.error('[PRODUCTS] Update failed:', err.message);
    res.status(err.status || 500).json({ error: err.status ? err.message : 'Server error' });
  }
});

router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid product ID' });
    const { Product } = await resolveTables(pool, ['Product']);
    await pool.query(`DELETE FROM ${quoteId(Product)} WHERE id = ?`, [id]);
    refreshInternalCache();
    res.json({ success: true });
  } catch (err) {
    console.error('[PRODUCTS] Delete failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
