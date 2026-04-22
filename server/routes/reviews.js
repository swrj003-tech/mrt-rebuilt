import express from 'express';
import prisma from '../db.js';
 
const router = express.Router();
 
// GET /api/reviews/:productId
router.get('/:productId', async (req, res) => {
  const id = parseInt(req.params.productId);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid product ID' });
 
  try {
    const reviews = await prisma.review.findMany({
      where: { productId: id },
      orderBy: { createdAt: 'desc' },
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});
 
// POST /api/reviews
router.post('/', async (req, res) => {
  const { productId, userName, rating, comment } = req.body;
 
  if (!productId || !userName || !rating || !comment) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
 
  const pId = parseInt(productId);
  if (isNaN(pId)) return res.status(400).json({ error: 'Invalid product ID' });
 
  try {
    const review = await prisma.review.create({
      data: {
        productId: pId,
        userName,
        rating: parseInt(rating),
        comment,
        isVerified: false,
      },
    });
 
    // Recalculate and update ratingValue on the product
    // NOTE: Only ratingValue exists on Product — reviewCount and rating do NOT.
    const allReviews = await prisma.review.findMany({ where: { productId: pId } });
    const avgRating = allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length;
 
    await prisma.product.update({
      where: { id: pId },
      data: {
        ratingValue: parseFloat(avgRating.toFixed(2)),
        // REMOVED: reviewCount — not a field on Product model
        // REMOVED: rating      — not a field on Product model (exists on Review, not Product)
      },
    });
 
    res.status(201).json(review);
  } catch (err) {
    console.error('Review Create Error:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});
 
export default router;
