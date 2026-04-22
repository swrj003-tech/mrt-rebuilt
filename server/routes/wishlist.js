import express from 'express';
import prisma from '../db.js';

const router = express.Router();

function safeJsonParse(val, fallback) {
  try { return val ? JSON.parse(val) : fallback; } catch { return fallback; }
}

// GET /api/wishlist?sid=<deviceId>
router.get('/', async (req, res) => {
  try {
    // NOTE: Schema uses 'deviceId', not 'sessionId'.
    const deviceId = req.query.sid;
    if (!deviceId) return res.json([]);

    const items = await prisma.wishlistItem.findMany({
      where: { deviceId },
      include: {
        product: {
          include: { category: { select: { slug: true, name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    items.forEach(item => {
      item.product.keyBenefits = safeJsonParse(item.product.keyBenefits, []);
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/wishlist
router.post('/', async (req, res) => {
  try {
    // Accept either sessionId or deviceId from frontend
    const deviceId = req.body.sessionId || req.body.deviceId;
    const productId = parseInt(req.body.productId);

    if (!deviceId || isNaN(productId)) {
      return res.status(400).json({ error: 'deviceId (or sessionId) and productId required' });
    }

    // Use findFirst + create instead of upsert (schema has no @@unique on deviceId+productId)
    const existing = await prisma.wishlistItem.findFirst({
      where: { deviceId, productId },
    });

    if (existing) return res.status(201).json(existing);

    const item = await prisma.wishlistItem.create({
      data: { deviceId, productId },
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/wishlist/:productId?sid=<deviceId>
router.delete('/:productId', async (req, res) => {
  try {
    const deviceId = req.query.sid;
    const productId = parseInt(req.params.productId);

    if (!deviceId) return res.status(400).json({ error: 'sid required' });
    if (isNaN(productId)) return res.status(400).json({ error: 'Invalid product ID' });

    await prisma.wishlistItem.deleteMany({ where: { deviceId, productId } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
