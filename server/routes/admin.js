import express from 'express';
import prisma from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = express.Router();
 
// Root ping for CMS health check
router.get('/', (req, res) => res.json({ status: 'MRT Admin API Active', version: '2.1.0' }));
 
// GET /api/admin/stats - Consolidated dashboard metrics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const [productCount, categoryCount, clickCount, subscriberCount, testimonialCount, reviewCount, messageCount] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.affiliateClick.count(),
      prisma.newsletterSub.count(),
      prisma.testimonial.count(),
      prisma.review.count(),
      prisma.contactMessage.count(),
    ]);

    const recentClicks = await prisma.affiliateClick.findMany({
      take: 10,
      orderBy: { clickedAt: 'desc' }, // AffiliateClick uses clickedAt, not createdAt
      include: { product: { select: { name: true, image: true, categoryId: true } } },
    });

    res.json({
      productCount,
      categoryCount,
      clickCount,
      subscriberCount,
      testimonialCount,
      reviewCount,
      messageCount,
      recentClicks,
    });
  } catch (err) {
    console.error('Admin Stats Error:', err);
    res.status(500).json({ error: 'Failed to fetch admin statistics' });
  }
});

// GET /api/admin/analytics - Detailed click data for charts
router.get('/analytics', authMiddleware, adminOnly, async (req, res) => {
  try {
    // FIXED: AffiliateClick schema has 'clickedAt', not 'createdAt'
    const clicks = await prisma.affiliateClick.findMany({
      take: 1000,
      orderBy: { clickedAt: 'desc' },
      include: { product: { select: { name: true, categoryId: true } } },
    });

    const categoryDistribution = await prisma.product.groupBy({
      by: ['categoryId'],
      _count: true,
    });

    res.json({ clicks, categoryDistribution });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// GET /api/admin/reviews - All reviews for moderation
router.get('/reviews', authMiddleware, adminOnly, async (req, res) => {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      include: { product: { select: { name: true, image: true } } },
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch all reviews' });
  }
});

router.get('/messages', authMiddleware, adminOnly, async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(messages);
  } catch (error) {
    console.error('Admin Messages Error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// POST /api/admin/reviews/:id/verify - Moderation
router.post('/reviews/:id/verify', authMiddleware, adminOnly, async (req, res) => {
  try {
    // FIXED: parseInt — Prisma expects Int, req.params.id is always a string
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid review ID' });

    const review = await prisma.review.update({
      where: { id },
      data: { isVerified: true },
    });
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: 'Failed to verify review' });
  }
});

export default router;
