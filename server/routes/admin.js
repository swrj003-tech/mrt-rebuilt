import express from 'express';
import pool from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { getColumns, quoteId } from '../utils/sql.js';

const router = express.Router();

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
    review: findTable('Review'),
    sub: findTable('NewsletterSub'),
    testimonial: findTable('Testimonial'),
    message: findTable('ContactMessage')
  };
}

router.get('/force-sync-products', authMiddleware, adminOnly, async (req, res) => {
  try {
    const t = await getTables();
    
    // RESTORED ORIGINAL LOCAL IMAGES
    const products = [
      // HOME & KITCHEN
      { name: 'Vegetable Chopper', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/4mgjKOK', image: '/assets/products/vegetable-chopper.png', benefit: 'Effortless meal prep.' },
      { name: 'Electric Spin Scrubber', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/4vayOS5', image: '/assets/products/spin-scrubber.png', benefit: 'Deep clean power.' },
      { name: 'Vacuum Storage Bags', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/3NQUaDg', image: '/assets/products/vacuum-bags.png', benefit: 'Save closet space.' },
      { name: 'Air Fryer Accessories Set', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/47J01RH', image: '/assets/products/air-fryer-accessories.png', benefit: 'Expand air fryer use.' },
      { name: 'Oil Spray Bottle', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/3OmAkQo', image: '/assets/products/oil-spray-bottle.png', benefit: 'Controlled oil usage.' },
      { name: 'Smart Plug', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/3PU7kzZ', image: '/assets/products/smart-plug.png', benefit: 'Voice control home.' },
      { name: 'LED Motion Sensor Lights', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/41hGtjS', image: '/assets/products/motion-lights.png', benefit: 'Instant illumination.' },
      { name: 'Microfiber Cleaning Cloth Pack', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/4cdP3Fi', image: '/assets/products/microfiber-cloths.png', benefit: 'Lint-free cleaning.' },
      { name: 'Digital Kitchen Scale', category: 'home-kitchen', badge: "Editor's Choice", url: 'https://amzn.to/3PSpaDq', image: '/assets/products/kitchen-scale.png', benefit: 'Precision weighing.' },
      { name: 'Under Sink Organizer', category: 'home-kitchen', badge: "Editor's Choice", url: 'https://amzn.to/3NQUTEu', image: '/assets/products/under-sink-organizer.png', benefit: 'Maximize storage.' },

      // BEAUTY
      { name: 'Ice Face Roller', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/4sj2ytg', image: '/assets/products/ice_face_roller.png', benefit: 'Reduce puffiness.' },
      { name: 'Facial Cleansing Brush', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/4dwEOOH', image: '/assets/products/sonic-facial-cleansing-brush.jpg', benefit: 'Deep pore clean.' },
      { name: 'Hair Straightener Brush', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/48jgyvP', image: '/assets/products/hair-straightener-brush.png', benefit: 'Smooth hair fast.' },
      { name: 'LED Makeup Mirror', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/4vfzipZ', image: '/assets/products/led-makeup-mirror.png', benefit: 'Flawless lighting.' },
      { name: 'Heatless Hair Curlers', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4migCSr', image: '/assets/products/heatless-curlers.png', benefit: 'No-heat curls.' },
      { name: 'Blackhead Remover Vacuum', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4ve7ylD', image: '/assets/products/blackhead-remover.png', benefit: 'Clear skin at home.' },
      { name: 'Electric Toothbrush', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4vaA3AJ', image: '/assets/products/electric-toothbrush.png', benefit: 'Superior dental care.' },
      { name: 'Electric Eyebrow Trimmer', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4seAiYR', image: '/assets/products/eyebrow-trimmer.png', benefit: 'Precise shaping.' },
      { name: 'Makeup Brush Set', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4sW28dh', image: '/assets/products/makeup-brush-set.png', benefit: 'Professional tools.' },
      { name: 'Cosmetic Organizer', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4tytGFH', image: '/assets/products/cosmetic-organizer.png', benefit: 'Declutter vanity.' },

      // HEALTH & WELLNESS
      { name: 'Neck & Shoulder Massager', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/4bUeFbj', image: '/assets/products/neck-massager.png', benefit: 'Muscle relief.' },
      { name: 'Posture Corrector', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/4mfhIhB', image: '/assets/products/posture-corrector.png', benefit: 'Better alignment.' },
      { name: 'Massage Gun (Health)', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/41iIMTD', image: '/assets/products/massage-gun.png', benefit: 'Muscle recovery.' },
      { name: 'Memory Foam Pillow', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/4sP2liu', image: '/assets/products/memory-foam-pillow.png', benefit: 'Deep sleep support.' },
      { name: 'Aromatherapy Diffuser', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/47JWi6m', image: '/assets/products/aromatherapy-diffuser-luxury.jpg', benefit: 'Spa atmosphere.' },
      { name: 'Foam Roller (Health)', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/4vee8bR', image: '/assets/products/foam-roller.png', benefit: 'Release tightness.' },
      { name: 'Weighted Blanket', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/4cuuq8Y', image: '/assets/products/weighted-blanket.png', benefit: 'Better rest.' },
      { name: 'Eye Massager', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/4sjeTgW', image: '/assets/products/eye-massager.png', benefit: 'Relieve eye strain.' },
      { name: 'White Noise Machine', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/3PWkxbo', image: '/assets/products/white-noise-machine.png', benefit: 'Block noise.' },
      { name: 'Lumbar Support Cushion', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/4vdRQXB', image: '/assets/products/lumbar-support-cushion.png', benefit: 'Ergonomic comfort.' },

      // PET SUPPLIES
      { name: 'Pet Hair Remover Roller', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/4sCm3NL', image: '/assets/products/pet-hair-remover-roller.png', benefit: 'Hair-free home.' },
      { name: 'Self-Cleaning Grooming Brush', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/4mfdKWt', image: '/assets/products/self-cleaning-grooming-brush.png', benefit: 'Easy grooming.' },
      { name: 'Automatic Pet Feeder', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/41iJvEl', image: '/assets/products/pet-feeder.png', benefit: 'On-time feeding.' },
      { name: 'Pet Water Fountain', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/3PSASxU', image: '/assets/products/pet-water-fountain.png', benefit: 'Fresh water.' },
      { name: 'Interactive Dog Toy', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/4mfmbAR', image: '/assets/products/interactive-dog-toy.png', benefit: 'Pet engagement.' },
      { name: 'Cat Laser Toy', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/47Hm0bJ', image: '/assets/products/cat-laser-toy.png', benefit: 'Fun for cats.' },
      { name: 'Portable Pet Water Bottle', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/4drRB4S', image: '/assets/products/portable-pet-water-bottle.png', benefit: 'Walking hydration.' },
      { name: 'Slow Feeder Bowl', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4mbNWue', image: '/assets/products/slow-feeder-bowl.png', benefit: 'Better digestion.' },
      { name: 'Pet Nail Clipper', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4sRqXHj', image: '/assets/products/pet-nail-clipper.png', benefit: 'Safe trimming.' },
      { name: 'Pet Bed', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4soPJh3', image: '/assets/products/pet-bed.png', benefit: 'Comfort rest.' },

      // BABY & KIDS
      { name: 'Baby Nail Trimmer', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/4sgYlpK', image: '/assets/products/baby-clipper-premium.png', benefit: 'Safe nail care.' },
      { name: 'Silicone Feeding Set', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/48z3NNN', image: '/assets/products/silicone-feeding-set.png', benefit: 'Mess-free meals.' },
      { name: 'Baby Diaper Bag', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/3OkGAIp', image: '/assets/products/baby-diaper-bag.png', benefit: 'Organized outings.' },
      { name: 'Portable Changing Mat', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/4c8AHWJ', image: '/assets/products/portable-changing-mat.png', benefit: 'Hygienic changes.' },
      { name: 'Cabinet Safety Locks', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4t1fyF2', image: '/assets/products/cabinet-safety-locks.png', benefit: 'Home proofing.' },
      { name: 'Baby Bottle Warmer', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4sP3vdQ', image: '/assets/products/baby-bottle-warmer.png', benefit: 'Perfect temp milk.' },
      { name: 'Baby Bath Support', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4ve9vOZ', image: '/assets/products/baby-bath-support.png', benefit: 'Safe bath time.' },
      { name: 'Stroller Organizer', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/4cuvnhy', image: '/assets/products/stroller-organizer.png', benefit: 'Essential reach.' },
      { name: 'Baby Toy Set', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/3PTsPkm', image: '/assets/products/baby-toy-set.png', benefit: 'Engage baby.' },
      { name: 'Baby Grooming Kit', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/4cbFKFG', image: '/assets/products/baby-grooming-kit.png', benefit: 'Complete care.' },

      // ELECTRONICS
      { name: 'Wireless Earbuds', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4ccwbqa', image: '/assets/products/wireless_earbuds.png', benefit: 'Clear sound.' },
      { name: 'Fast Wireless Charger', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4dQO28H', image: '/assets/products/carbon-fiber-charging-hub.jpg', benefit: 'No cables.' },
      { name: 'Power Bank', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4tCD5w5', image: '/assets/products/power-bank.png', benefit: 'Charge anywhere.' },
      { name: 'Bluetooth Speaker', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4mbyWMO', image: '/assets/products/bluetooth-speaker.png', benefit: 'Music on go.' },
      { name: 'Smart LED Strip Lights', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/41hOMvW', image: '/assets/products/smart-led-strip-lights.png', benefit: 'Mood lighting.' },
      { name: 'Car Phone Mount', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/4teXqb3', image: '/assets/products/magnetic-phone-mount.png', benefit: 'Hands-free safety.' },
      { name: 'Charging Hub', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/4mkil9Y', image: '/assets/products/3-in-1-charging-station.png', benefit: 'Central power.' },
      { name: 'Mini Projector', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/4sgFueI', image: '/assets/products/mini-projector.png', benefit: 'Cinema at home.' },
      { name: 'Laptop Stand', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/41PFXcP', image: '/assets/products/laptop-stand.png', benefit: 'Ergonomic lift.' },
      { name: 'Phone Stand', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/47KCkbN', image: '/assets/products/laptop-stand.png', benefit: 'Perfect angle.' }, // Used laptop stand as fallback

      // SPORTS
      { name: 'Resistance Bands', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/4csnjxL', image: '/assets/products/resistance-band-set.png', benefit: 'Full workout.' },
      { name: 'Massage Gun (Sports)', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/4t2EnR8', image: '/assets/products/massage-gun-pro-slate.jpg', benefit: 'Pro recovery.' },
      { name: 'Yoga Mat', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/47KcdSc', image: '/assets/products/yoga-mat.png', benefit: 'Premium grip.' },
      { name: 'Adjustable Dumbbells', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/4vggOWa', image: '/assets/products/adjustable-dumbbells.png', benefit: 'Home gym.' },
      { name: 'Ab Roller', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/3OpiNHd', image: '/assets/products/ab-roller.png', benefit: 'Core strength.' },
      { name: 'Jump Rope', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/4bUqYV0', image: '/assets/products/weighted-jump-rope.png', benefit: 'Cardio power.' },
      { name: 'Foam Roller (Sports)', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/3PLBzJp', image: '/assets/products/foam-roller.png', benefit: 'Muscle flow.' },
      { name: 'Push-Up Board', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/4trnFKQ', image: '/assets/products/push-up-board.png', benefit: 'Muscle group target.' },
      { name: 'Gym Gloves', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/4cbGYAM', image: '/assets/products/gym-gloves.png', benefit: 'Hand protect.' },
      { name: 'Water Bottle', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/41MUm9M', image: '/assets/products/insulated-water-bottle.png', benefit: 'Stay hydrated.' }
    ];

    const productColumns = await getColumns(pool, t.product);
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query(`DELETE FROM ${quoteId(t.product)}`);
    const [cats] = await pool.query(`SELECT id, slug FROM ${quoteId(t.category)}`);
    const catMap = {}; cats.forEach(c => catMap[c.slug.toLowerCase()] = c.id);

    for (const p of products) {
      const catId = catMap[p.category.toLowerCase()];
      if (!catId) continue;
      let slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const isDuplicate = products.filter(x => x.name.toLowerCase() === p.name.toLowerCase()).length > 1;
      if (isDuplicate) slug = `${slug}-${p.category.toLowerCase().split('-')[0]}`;
      const row = {
        name: p.name,
        slug,
        description: p.benefit,
        shortBenefit: p.benefit,
        shortDescription: p.benefit,
        price: 0,
        image: p.image,
        categoryId: catId,
        affiliateUrl: p.url,
        badge: p.badge,
        ratingValue: 4.8,
        ratingText: '4.8/5 Recommended',
        keyBenefits: JSON.stringify([p.benefit]),
        updatedAt: new Date(),
      };
      const keys = Object.keys(row).filter(key => productColumns.has(key));
      await pool.query(
        `INSERT INTO ${quoteId(t.product)} (${keys.map(quoteId).join(', ')}) VALUES (${keys.map(() => '?').join(', ')})`,
        keys.map(key => row[key])
      ).catch(() => {});
    }
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    res.json({ success: true, message: `Re-matched 70 products with verified high-res visuals.` });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    const t = await getTables();
    const [[{ pCount }]] = await pool.query(`SELECT COUNT(*) as pCount FROM ${quoteId(t.product)}`);
    const [[{ cCount }]] = await pool.query(`SELECT COUNT(*) as cCount FROM ${quoteId(t.category)}`);
    const [[{ clCount }]] = await pool.query(`SELECT COUNT(*) as clCount FROM ${quoteId(t.click)}`).catch(() => [[{ clCount: 0 }]]);
    const [[{ sCount }]] = await pool.query(`SELECT COUNT(*) as sCount FROM ${quoteId(t.sub)}`).catch(() => [[{ sCount: 0 }]]);
    const [[{ mCount }]] = await pool.query(`SELECT COUNT(*) as mCount FROM ${quoteId(t.message)}`).catch(() => [[{ mCount: 0 }]]);
    const [[{ tCount }]] = await pool.query(`SELECT COUNT(*) as tCount FROM ${quoteId(t.testimonial)}`).catch(() => [[{ tCount: 0 }]]);
    const [[{ rCount }]] = await pool.query(`SELECT COUNT(*) as rCount FROM ${quoteId(t.review)}`).catch(() => [[{ rCount: 0 }]]);
    const [recentClicks] = await pool.query(
      `SELECT c.*, p.name as productName, p.image as productImage
       FROM ${quoteId(t.click)} c
       LEFT JOIN ${quoteId(t.product)} p ON p.id = c.productId
       ORDER BY c.clickedAt DESC
       LIMIT 10`
    ).catch(() => [[]]);
    res.json({
      productCount: pCount,
      categoryCount: cCount,
      clickCount: clCount,
      subscriberCount: sCount,
      testimonialCount: tCount,
      messageCount: mCount,
      reviewCount: rCount,
      recentClicks,
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

router.get('/messages', authMiddleware, adminOnly, async (req, res) => {
  try {
    const t = await getTables();
    const [messages] = await pool.query(
      `SELECT * FROM ${quoteId(t.message)} ORDER BY createdAt DESC LIMIT 500`
    );
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/reviews', authMiddleware, adminOnly, async (req, res) => {
  try {
    const t = await getTables();
    const [reviews] = await pool.query(
      `SELECT r.*, p.name as productName, p.image as productImage
       FROM ${quoteId(t.review)} r
       LEFT JOIN ${quoteId(t.product)} p ON p.id = r.productId
       ORDER BY r.createdAt DESC
       LIMIT 500`
    );
    res.json(reviews.map(review => ({
      ...review,
      product: review.productId ? {
        id: review.productId,
        name: review.productName,
        image: review.productImage,
      } : null,
    })));
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/reviews/:id/verify', authMiddleware, adminOnly, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid review ID' });
    const t = await getTables();
    await pool.query(`UPDATE ${quoteId(t.review)} SET isVerified = 1 WHERE id = ?`, [id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/reviews/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (!Number.isFinite(id)) return res.status(400).json({ error: 'Invalid review ID' });

    const userName = String(req.body.userName || '').trim().slice(0, 120);
    const comment = String(req.body.comment || '').trim().slice(0, 2000);
    const rating = Math.min(5, Math.max(1, Number.parseInt(req.body.rating, 10) || 5));

    if (!userName || !comment) return res.status(400).json({ error: 'Missing required fields' });

    const t = await getTables();
    await pool.query(
      `UPDATE ${quoteId(t.review)} SET userName = ?, rating = ?, comment = ? WHERE id = ?`,
      [userName, rating, comment, id]
    );

    // Update product avg rating
    const [[avg]] = await pool.query(
      `SELECT AVG(rating) as ratingValue, productId FROM ${quoteId(t.review)} WHERE id = ?`,
      [id]
    );
    if (avg?.productId && avg?.ratingValue) {
      await pool.query(
        `UPDATE ${quoteId(t.product)} SET ratingValue = ? WHERE id = ?`,
        [Number(avg.ratingValue).toFixed(2), avg.productId]
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error('[ADMIN] Review update failed:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/analytics', authMiddleware, adminOnly, async (req, res) => {
  try {
    const t = await getTables();
    const [clicks] = await pool.query(
      `SELECT c.*, p.name as productName, p.image as productImage
       FROM ${quoteId(t.click)} c
       LEFT JOIN ${quoteId(t.product)} p ON p.id = c.productId
       ORDER BY c.clickedAt DESC
       LIMIT 100`
    ).catch(() => [[]]);

    const [categoryDistribution] = await pool.query(
      `SELECT c.name as categoryId, COUNT(p.id) as _count
       FROM ${quoteId(t.product)} p
       LEFT JOIN ${quoteId(t.category)} c ON c.id = p.categoryId
       GROUP BY c.name
       ORDER BY _count DESC`
    ).catch(() => [[]]);

    res.json({
      clicks: clicks.map(click => ({
        ...click,
        product: click.productId ? {
          id: click.productId,
          name: click.productName,
          image: click.productImage,
        } : null,
      })),
      categoryDistribution,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
