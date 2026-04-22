import express from 'express';
import crypto from 'crypto';
import prisma from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Public: Track click and redirect
router.get('/redirect/:productId', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    if (isNaN(productId)) return res.status(400).json({ error: 'Invalid product ID' });

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // AffiliateClick schema fields: productId (Int), ip (String?), userAgent (String?), clickedAt (DateTime)
    // REMOVED: source, ipHash, sessionId — not in AffiliateClick schema
    // ipHash → mapped to 'ip' (hashed for privacy)
    const ipHash = crypto.createHash('sha256').update(req.ip || 'unknown').digest('hex').slice(0, 16);

    await prisma.affiliateClick.create({
      data: {
        productId: product.id,
        ip: ipHash,                                              // schema field is 'ip', not 'ipHash'
        userAgent: (req.headers['user-agent'] || '').slice(0, 200),
        // REMOVED: source    — not in AffiliateClick schema
        // REMOVED: sessionId — not in AffiliateClick schema
      },
    });

    const redirectUrl = product.affiliateUrl
      || `https://wa.me/?text=I+am+interested+in+${encodeURIComponent(product.name)}`;
    res.redirect(302, redirectUrl);
  } catch (err) {
    console.error('Affiliate redirect error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin: Analytics overview
router.get('/analytics', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    // AffiliateClick only has 'clickedAt', not 'createdAt'
    const since = new Date(Date.now() - parseInt(days) * 86400000);

    const totalClicks = await prisma.affiliateClick.count({
      where: { clickedAt: { gte: since } },
    });

    const topProducts = await prisma.affiliateClick.groupBy({
      by: ['productId'],
      _count: { id: true },
      where: { clickedAt: { gte: since } },
      orderBy: { _count: { id: 'desc' } },
      take: 10,
    });

    const productDetails = await prisma.product.findMany({
      where: { id: { in: topProducts.map(t => t.productId) } },
      select: { id: true, name: true, image: true, price: true, badge: true },
    });

    const dailyClicks = await prisma.affiliateClick.groupBy({
      by: ['clickedAt'],
      _count: { id: true },
      where: { clickedAt: { gte: since } },
    });

    res.json({
      totalClicks,
      topProducts: topProducts.map(t => ({
        ...productDetails.find(p => p.id === t.productId),
        clicks: t._count.id,
      })),
      dailyClicks,
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
