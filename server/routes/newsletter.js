import express from 'express';
import prisma from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/subscribe', async (req, res) => {
  try {
    const { email, source } = req.body;
    if (!email || !email.includes('@')) return res.status(400).json({ error: 'Valid email required' });
    const sub = await prisma.newsletterSub.upsert({ // FIXED: Matches schema model name
      where: { email },
      update: { email }, // Simplified as schema doesn't have isActive/source
      create: { email },
    });
    res.status(201).json({ success: true, id: sub.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/subscribers', authMiddleware, adminOnly, async (req, res) => {
  try {
    const subs = await prisma.newsletterSub.findMany({ orderBy: { createdAt: 'desc' } }); // FIXED
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
