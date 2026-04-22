import express from 'express';
import prisma from '../db.js';

const router = express.Router();

// Helper: parse product JSON fields that exist in schema
function parseProductFields(p) {
  return {
    ...p,
    keyBenefits: safeJsonParse(p.keyBenefits, []),
    tags: safeJsonParse(p.tags, []),
    // REMOVED: pros / cons — not on Product model
  };
}

function safeJsonParse(val, fallback) {
  try { return val ? JSON.parse(val) : fallback; } catch { return fallback; }
}

// GET /api/comparison?sid=<deviceId>
router.get('/', async (req, res) => {
  try {
    // NOTE: Schema uses 'deviceId', not 'sessionId'. The frontend 'sid' query
    // param is treated as deviceId throughout this router.
    const deviceId = req.query.sid;
    if (!deviceId) return res.json([]);

    const items = await prisma.comparisonItem.findMany({
      where: { deviceId },
      include: {
        product: {
          include: { category: { select: { slug: true, name: true } } },
        },
      },
    });

    items.forEach(item => {
      item.product = parseProductFields(item.product);
    });

    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/comparison
router.post('/', async (req, res) => {
  try {
    // Accept either sessionId or deviceId from frontend
    const deviceId = req.body.sessionId || req.body.deviceId;
    const productId = parseInt(req.body.productId);

    if (!deviceId || isNaN(productId)) {
      return res.status(400).json({ error: 'deviceId (or sessionId) and productId required' });
    }

    const count = await prisma.comparisonItem.count({ where: { deviceId } });
    if (count >= 4) return res.status(400).json({ error: 'Maximum 4 products for comparison' });

    // Use findFirst + create instead of upsert (schema has no @@unique on deviceId+productId)
    const existing = await prisma.comparisonItem.findFirst({
      where: { deviceId, productId },
    });

    if (existing) return res.status(201).json(existing);

    const item = await prisma.comparisonItem.create({
      data: { deviceId, productId },
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/comparison/:productId?sid=<deviceId>
router.delete('/:productId', async (req, res) => {
  try {
    const deviceId = req.query.sid;
    const productId = parseInt(req.params.productId);

    if (!deviceId) return res.status(400).json({ error: 'sid required' });
    if (isNaN(productId)) return res.status(400).json({ error: 'Invalid product ID' });

    await prisma.comparisonItem.deleteMany({ where: { deviceId, productId } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
