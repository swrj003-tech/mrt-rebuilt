import express from 'express';
import prisma from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { refreshInternalCache } from '../cache_service.js';

const router = express.Router();

// Public: List active testimonials (WITH DB FALLBACK)
router.get('/', async (req, res) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json(testimonials);
  } catch (err) {
    console.warn('[DB FALLBACK] Could not fetch testimonials, using starter set.');
    try {
      const { FALLBACK_TESTIMONIALS } = await import('./fallbackData.js');
      res.json(FALLBACK_TESTIMONIALS);
    } catch(e) {
      res.status(500).json({ error: 'Server error' });
    }
  }
});

// Admin: Create
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const t = await prisma.testimonial.create({ data: req.body });
    refreshInternalCache();
    res.status(201).json(t);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Update
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    // FIXED: parseInt — Prisma expects Int, req.params.id is always a string
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid testimonial ID' });

    const t = await prisma.testimonial.update({
      where: { id },
      data: req.body,
    });
    refreshInternalCache();
    res.json(t);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    // FIXED: parseInt — Prisma expects Int, req.params.id is always a string
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid testimonial ID' });

    await prisma.testimonial.delete({ where: { id } });
    refreshInternalCache();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
