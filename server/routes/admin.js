import express from 'express';
import pool from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// Helper: Get table names dynamically
async function getTables() {
  const [tables] = await pool.query('SHOW TABLES');
  const rawList = tables.map(t => Object.values(t)[0]);
  const lowerList = rawList.map(t => t.toLowerCase());
  
  const findTable = (target) => {
    const idx = lowerList.indexOf(target.toLowerCase());
    return idx !== -1 ? rawList[idx] : target;
  };

  return {
    product: findTable('Product'),
    category: findTable('Category'),
    click: findTable('AffiliateClick'),
    sub: findTable('NewsletterSub'),
    testimonial: findTable('Testimonial'),
    message: findTable('ContactMessage')
  };
}

// Root ping for CMS health check
router.get('/', (req, res) => res.json({ status: 'MRT Admin API Active', version: '2.5.0 (Raw SQL)' }));

// GET /api/admin/stats - Consolidated dashboard metrics (REWRITTEN FOR SQL)
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const { product, category, click, sub, testimonial, message } = await getTables();
    
    const [[{ pCount }], [{ cCount }], [{ clCount }], [{ sCount }], [{ tCount }], [{ mCount }]] = await Promise.all([
      pool.query(`SELECT COUNT(*) as pCount FROM ${product}`),
      pool.query(`SELECT COUNT(*) as cCount FROM ${category}`),
      pool.query(`SELECT COUNT(*) as clCount FROM ${click}`),
      pool.query(`SELECT COUNT(*) as sCount FROM ${sub}`),
      pool.query(`SELECT COUNT(*) as tCount FROM ${testimonial}`),
      pool.query(`SELECT COUNT(*) as mCount FROM ${message}`).catch(() => [[{ mCount: 0 }]])
    ]);

    // Simplified recent clicks for dashboard
    const [recentClicks] = await pool.query(`
      SELECT c.*, p.name as productName, p.image as productImage 
      FROM ${click} c 
      LEFT JOIN ${product} p ON c.productId = p.id 
      ORDER BY c.clickedAt DESC LIMIT 10
    `).catch(() => [[]]);

    res.json({
      productCount: pCount,
      categoryCount: cCount,
      clickCount: clCount,
      subscriberCount: sCount,
      testimonialCount: tCount,
      messageCount: mCount,
      recentClicks
    });
  } catch (err) {
    console.error('Admin Stats Error:', err);
    res.status(500).json({ error: 'Failed to fetch admin statistics' });
  }
});

// GET /api/admin/analytics - Detailed click data for charts
router.get('/analytics', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { product, category, click } = await getTables();
    const [clicks] = await pool.query(`SELECT * FROM ${click} ORDER BY clickedAt DESC LIMIT 500`);
    const [categoryDistribution] = await pool.query(`SELECT categoryId, COUNT(*) as _count FROM ${product} GROUP BY categoryId`);
    res.json({ clicks, categoryDistribution });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// GET /api/admin/force-sync-products - Secret sync route to populate DB from browser
router.get('/force-sync-products', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { product: productTable, category: categoryTable } = await getTables();
    
    const products = [
      // HOME & KITCHEN
      { name: 'Vegetable Chopper', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/4mgjKOK', benefit: 'Effortless meal prep in seconds.' },
      { name: 'Electric Spin Scrubber', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/4vayOS5', benefit: 'Deep clean without the elbow grease.' },
      { name: 'Vacuum Storage Bags', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/3NQUaDg', benefit: 'Save 80% more space in your closet.' },
      { name: 'Air Fryer Accessories Set', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/47J01RH', benefit: 'Unlock the full potential of your air fryer.' },
      { name: 'Oil Spray Bottle', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/3OmAkQo', benefit: 'Controlled oil usage for healthier cooking.' },
      { name: 'Smart Plug', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/3PU7kzZ', benefit: 'Voice control for your home appliances.' },
      { name: 'LED Motion Sensor Lights', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/41hGtjS', benefit: 'Instant illumination where you need it.' },
      { name: 'Microfiber Cleaning Cloth Pack', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/4cdP3Fi', benefit: 'Lint-free, scratch-free cleaning power.' },
      { name: 'Digital Kitchen Scale', category: 'home-kitchen', badge: "Editor's Choice", url: 'https://amzn.to/3PSpaDq', benefit: 'Precision weighing for perfect recipes.' },
      { name: 'Under Sink Organizer', category: 'home-kitchen', badge: "Editor's Choice", url: 'https://amzn.to/3NQUTEu', benefit: 'Maximize your storage space effortlessly.' },

      // BEAUTY
      { name: 'Ice Face Roller', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/4sj2ytg', benefit: 'Reduce puffiness and refresh your skin.' },
      { name: 'Facial Cleansing Brush', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/4dwEOOH', benefit: 'Deep pore cleaning for a radiant glow.' },
      { name: 'Hair Straightener Brush', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/48jgyvP', benefit: 'Silky smooth hair in one pass.' },
      { name: 'LED Makeup Mirror', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/4vfzipZ', benefit: 'Professional lighting for flawless makeup.' },
      { name: 'Heatless Hair Curlers', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4migCSr', benefit: 'Perfect curls without the heat damage.' },
      { name: 'Blackhead Remover Vacuum', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4ve7ylD', benefit: 'Clear skin from the comfort of home.' },
      { name: 'Electric Toothbrush', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4vaA3AJ', benefit: 'Superior plaque removal and gum care.' },
      { name: 'Electric Eyebrow Trimmer', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4seAiYR', benefit: 'Precise shaping with zero pain.' },
      { name: 'Makeup Brush Set', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4sW28dh', benefit: 'Professional tools for every look.' },
      { name: 'Cosmetic Organizer', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4tytGFH', benefit: 'Declutter your vanity in style.' },

      // HEALTH
      { name: 'Neck & Shoulder Massager', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/4bUeFbj', benefit: 'Instant relief for muscle tension.' },
      { name: 'Posture Corrector', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/4mfhIhB', benefit: 'Better alignment, more confidence.' },
      { name: 'Massage Gun', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/41iIMTD', benefit: 'Professional-grade muscle recovery.' },
      { name: 'Memory Foam Pillow', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/4sP2liu', benefit: 'Unmatched neck support for deep sleep.' },
      { name: 'Aromatherapy Diffuser', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/47JWi6m', benefit: 'Transform your room into a spa.' },
      { name: 'Foam Roller', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/4vee8bR', benefit: 'Release tightness and improve flexibility.' },
      { name: 'Weighted Blanket', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/4cuuq8Y', benefit: 'Calm the mind and body for better rest.' },
      { name: 'Eye Massager', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/4sjeTgW', benefit: 'Relieve eye strain after long days.' },
      { name: 'White Noise Machine', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/3PWkxbo', benefit: 'Block out noise for perfect focus or sleep.' },
      { name: 'Lumbar Support Cushion', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/4vdRQXB', benefit: 'Ergonomic comfort for all-day sitting.' },

      // PETS
      { name: 'Pet Hair Remover Roller', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/4sCm3NL', benefit: 'Keep your furniture hair-free instantly.' },
      { name: 'Self-Cleaning Grooming Brush', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/4mfdKWt', benefit: 'Easy grooming, zero mess.' },
      { name: 'Automatic Pet Feeder', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/41iJvEl', benefit: 'Never miss a mealtime for your pet.' },
      { name: 'Pet Water Fountain', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/3PSASxU', benefit: 'Fresh, filtered water for your companions.' },
      { name: 'Interactive Dog Toy', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/4mfmbAR', benefit: 'Keep your pet active and engaged.' },
      { name: 'Cat Laser Toy', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/47Hm0bJ', benefit: 'Hours of fun and exercise for your cat.' },
      { name: 'Portable Pet Water Bottle', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/4drRB4S', benefit: 'Stay hydrated on every walk.' },
      { name: 'Slow Feeder Bowl', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4mbNWue', benefit: 'Prevent bloating and improve digestion.' },
      { name: 'Pet Nail Clipper', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4sRqXHj', benefit: 'Professional grooming at home.' },
      { name: 'Pet Bed', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4soPJh3', benefit: 'The ultimate comfort for your furry friend.' },

      // BABY & KIDS
      { name: 'Baby Nail Trimmer', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/4sgYlpK', benefit: 'Safe and gentle care for tiny nails.' },
      { name: 'Silicone Feeding Set', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/48z3NNN', benefit: 'Mess-free and safe mealtime gear.' },
      { name: 'Baby Diaper Bag', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/3OkGAIp', benefit: 'Stay organized on the go with style.' },
      { name: 'Portable Changing Mat', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/4c8AHWJ', benefit: 'Hygienic changes anywhere, anytime.' },
      { name: 'Cabinet Safety Locks', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4t1fyF2', benefit: 'Proof your home for peace of mind.' },
      { name: 'Baby Bottle Warmer', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4sP3vdQ', benefit: 'Perfect temp milk in minutes.' },
      { name: 'Baby Bath Support', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4ve9vOZ', benefit: 'Safe and comfortable bath time fun.' },
      { name: 'Stroller Organizer', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/4cuvnhy', benefit: 'Essentials within reach for easy walks.' },
      { name: 'Baby Toy Set', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/3PTsPkm', benefit: 'Engage and entertain your little one.' },
      { name: 'Baby Grooming Kit', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/4cbFKFG', benefit: 'Complete care for your baby’s needs.' },

      // ELECTRONICS
      { name: 'Wireless Earbuds', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4ccwbqa', benefit: 'Crystal clear sound without the wires.' },
      { name: 'Fast Wireless Charger', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4dQO28H', benefit: 'Power up without the cable clutter.' },
      { name: 'Power Bank', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4tCD5w5', benefit: 'Stay charged wherever you are.' },
      { name: 'Bluetooth Speaker', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4mbyWMO', benefit: 'Take your music anywhere you go.' },
      { name: 'Smart LED Strip Lights', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/41hOMvW', benefit: 'Ambiance for every room in your home.' },
      { name: 'Car Phone Mount', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/4teXqb3', benefit: 'Hands-free safety on every drive.' },
      { name: 'Charging Hub', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/4mkil9Y', benefit: 'One stop for all your device charging.' },
      { name: 'Mini Projector', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/4sgFueI', benefit: 'Cinema experience right in your room.' },
      { name: 'Laptop Stand', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/41PFXcP', benefit: 'Ergonomic lift for a better workspace.' },
      { name: 'Phone Stand', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/47KCkbN', benefit: 'Keep your device at the perfect angle.' },

      // SPORTS
      { name: 'Resistance Bands', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/4csnjxL', benefit: 'Full body workout, anytime, anywhere.' },
      { name: 'Massage Gun', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/4t2EnR8', benefit: 'Recovery like the pros, at home.' },
      { name: 'Yoga Mat', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/47KcdSc', benefit: 'Premium grip and cushion for every flow.' },
      { name: 'Adjustable Dumbbells', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/4vggOWa', benefit: 'Compact home gym in one pair.' },
      { name: 'Ab Roller', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/3OpiNHd', benefit: 'Build core strength with every rep.' },
      { name: 'Jump Rope', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/4bUqYV0', benefit: 'High-intensity cardio in a small package.' },
      { name: 'Foam Roller', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/3PLBzJp', benefit: 'Release muscle tension and improve flow.' },
      { name: 'Push-Up Board', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/4trnFKQ', benefit: 'Target specific muscle groups with ease.' },
      { name: 'Gym Gloves', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/4cbGYAM', benefit: 'Protect your hands and improve grip.' },
      { name: 'Water Bottle', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/41MUm9M', benefit: 'Stay hydrated with a sleek design.' }
    ];

    // Get categories mapping
    const [cats] = await pool.query(`SELECT id, slug FROM ${categoryTable}`);
    const catMap = {};
    cats.forEach(c => catMap[c.slug.toLowerCase()] = c.id);

    // Clean existing
    await pool.query(`DELETE FROM ${productTable}`);

    // Insert new
    for (const p of products) {
      const catId = catMap[p.category.toLowerCase()];
      if (!catId) continue;
      const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await pool.query(
        `INSERT INTO ${productTable} (name, slug, description, price, image, categoryId, affiliateUrl, badge, ratingValue, ratingText, shortDescription, keyBenefits)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.name, slug, p.benefit, 0, `/assets/products/placeholder.png`, catId, p.url, p.badge, 4.8, '4.8/5 Recommended', p.benefit, JSON.stringify([p.benefit])]
      );
    }

    res.json({ success: true, message: `Injected ${products.length} products successfully.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
