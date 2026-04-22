import express from 'express';
import prisma from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { refreshInternalCache } from '../cache_service.js';

const router = express.Router();

// Helper: safely parse product JSON fields that exist in the Product schema
function parseProductFields(p) {
  return {
    ...p,
    keyBenefits: safeJsonParse(p.keyBenefits, []),
    tags: safeJsonParse(p.tags, []),
    // REMOVED: pros / cons — not fields on Product model
  };
}

function safeJsonParse(val, fallback) {
  try { return val ? JSON.parse(val) : fallback; } catch { return fallback; }
}

// Public: List all categories with themes
router.get('/', async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { theme: true, _count: { select: { products: true } } },
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Public: Get category by slug with products
router.get('/:slug', async (req, res) => {
  try {
    const category = await prisma.category.findUnique({
      where: { slug: req.params.slug },
      include: {
        theme: true,
        products: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!category) return res.status(404).json({ error: 'Category not found' });

    // Only parse fields that actually exist on Product
    category.products = category.products.map(parseProductFields);

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Create category
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, slug, image, sortOrder, theme } = req.body;
    // REMOVED from data: description, parentId, metaTitle, metaDescription
    // — none of these exist on the Category model in schema.prisma.
    // To add them, uncomment in schema.prisma and run: npx prisma migrate dev
    const category = await prisma.category.create({
      data: {
        name,
        slug: slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        image: image || null,
        sortOrder: sortOrder || 0,
        ...(theme ? {
          theme: {
            create: {
              title: theme.title || name,
              subtitle: theme.subtitle || '',
              primary: theme.primary || '#914d00',
              secondary: theme.secondary || '#f28c28',
              seoTitle: theme.seoTitle || null,
              seoIntro: theme.seoIntro || null,
            },
          },
        } : {}),
      },
      include: { theme: true },
    });
    refreshInternalCache();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update category
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, slug, image, sortOrder, theme } = req.body;
    const id = parseInt(req.params.id);

    // REMOVED: description, parentId, metaTitle, metaDescription — not in Category schema
    const updateData = {};
    if (name !== undefined)      updateData.name      = name;
    if (slug !== undefined)      updateData.slug      = slug;
    if (image !== undefined)     updateData.image     = image;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;

    const category = await prisma.category.update({
      where: { id },
      data: updateData,
    });

    if (theme) {
      await prisma.categoryTheme.upsert({
        where: { categoryId: id },
        update: { ...theme },
        create: {
          categoryId: id,
          title: theme.title || category.name,
          subtitle: theme.subtitle || '',
          primary: theme.primary || '#914d00',
          secondary: theme.secondary || '#f28c28',
          ...theme,
        },
      });
    }

    refreshInternalCache();
    const full = await prisma.category.findUnique({
      where: { id },
      include: { theme: true },
    });
    res.json(full);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete category
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await prisma.category.delete({ where: { id: parseInt(req.params.id) } });
    refreshInternalCache();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
