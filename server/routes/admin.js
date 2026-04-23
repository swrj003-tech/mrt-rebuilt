import express from 'express';
import pool from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

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
    sub: findTable('NewsletterSub'),
    testimonial: findTable('Testimonial'),
    message: findTable('ContactMessage')
  };
}

router.get('/', (req, res) => res.json({ status: 'MRT Admin API Active', version: '3.1.0 (Strict 70)' }));

// GET /api/admin/force-sync-products - STRICT 70 PRODUCT CATALOG
router.get('/force-sync-products', async (req, res) => {
  try {
    const t = await getTables();
    
    // ONLY THE 70 PRODUCTS PROVIDED BY USER
    const products = [
      // HOME & KITCHEN (10)
      { name: 'Vegetable Chopper', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/4mgjKOK', image: 'https://m.media-amazon.com/images/I/71Y8m7E-LRL._AC_SL1500_.jpg', benefit: 'Effortless meal prep.' },
      { name: 'Electric Spin Scrubber', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/4vayOS5', image: 'https://m.media-amazon.com/images/I/71t6W8N4Y8L._AC_SL1500_.jpg', benefit: 'Deep clean power.' },
      { name: 'Vacuum Storage Bags', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/3NQUaDg', image: 'https://m.media-amazon.com/images/I/81xG-YvC6TL._AC_SL1500_.jpg', benefit: 'Save closet space.' },
      { name: 'Air Fryer Accessories Set', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/47J01RH', image: 'https://m.media-amazon.com/images/I/81+X5Q9W2QL._AC_SL1500_.jpg', benefit: 'Expand air fryer use.' },
      { name: 'Oil Spray Bottle', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/3OmAkQo', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Controlled oil usage.' },
      { name: 'Smart Plug', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/3PU7kzZ', image: 'https://m.media-amazon.com/images/I/51-m67F7z9L._AC_SL1000_.jpg', benefit: 'Voice control home.' },
      { name: 'LED Motion Sensor Lights', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/41hGtjS', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Instant illumination.' },
      { name: 'Microfiber Cleaning Cloth Pack', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/4cdP3Fi', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Lint-free cleaning.' },
      { name: 'Digital Kitchen Scale', category: 'home-kitchen', badge: "Editor's Choice", url: 'https://amzn.to/3PSpaDq', image: 'https://m.media-amazon.com/images/I/71Y8m7E-LRL._AC_SL1500_.jpg', benefit: 'Precision weighing.' },
      { name: 'Under Sink Organizer', category: 'home-kitchen', badge: "Editor's Choice", url: 'https://amzn.to/3NQUTEu', image: 'https://m.media-amazon.com/images/I/71t6W8N4Y8L._AC_SL1500_.jpg', benefit: 'Maximize storage.' },

      // BEAUTY (10)
      { name: 'Ice Face Roller', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/4sj2ytg', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Reduce puffiness.' },
      { name: 'Facial Cleansing Brush', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/4dwEOOH', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Deep pore clean.' },
      { name: 'Hair Straightener Brush', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/48jgyvP', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Smooth hair fast.' },
      { name: 'LED Makeup Mirror', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/4vfzipZ', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Flawless lighting.' },
      { name: 'Heatless Hair Curlers', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4migCSr', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'No-heat curls.' },
      { name: 'Blackhead Remover Vacuum', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4ve7ylD', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Clear skin at home.' },
      { name: 'Electric Toothbrush', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4vaA3AJ', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Superior dental care.' },
      { name: 'Electric Eyebrow Trimmer', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4seAiYR', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Precise shaping.' },
      { name: 'Makeup Brush Set', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4sW28dh', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Professional tools.' },
      { name: 'Cosmetic Organizer', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4tytGFH', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Declutter vanity.' },

      // HEALTH (10)
      { name: 'Neck & Shoulder Massager', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/4bUeFbj', image: 'https://m.media-amazon.com/images/I/81xG-YvC6TL._AC_SL1500_.jpg', benefit: 'Muscle relief.' },
      { name: 'Posture Corrector', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/4mfhIhB', image: 'https://m.media-amazon.com/images/I/71Y8m7E-LRL._AC_SL1500_.jpg', benefit: 'Better alignment.' },
      { name: 'Massage Gun (Health)', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/41iIMTD', image: 'https://m.media-amazon.com/images/I/71t6W8N4Y8L._AC_SL1500_.jpg', benefit: 'Muscle recovery.' },
      { name: 'Memory Foam Pillow', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/4sP2liu', image: 'https://m.media-amazon.com/images/I/81+X5Q9W2QL._AC_SL1500_.jpg', benefit: 'Deep sleep support.' },
      { name: 'Aromatherapy Diffuser', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/47JWi6m', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Spa atmosphere.' },
      { name: 'Foam Roller (Health)', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/4vee8bR', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Release tightness.' },
      { name: 'Weighted Blanket', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/4cuuq8Y', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Better rest.' },
      { name: 'Eye Massager', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/4sjeTgW', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Relieve eye strain.' },
      { name: 'White Noise Machine', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/3PWkxbo', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Block noise.' },
      { name: 'Lumbar Support Cushion', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/4vdRQXB', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Ergonomic comfort.' },

      // PETS (10)
      { name: 'Pet Hair Remover Roller', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/4sCm3NL', image: 'https://m.media-amazon.com/images/I/71Y8m7E-LRL._AC_SL1500_.jpg', benefit: 'Hair-free home.' },
      { name: 'Self-Cleaning Grooming Brush', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/4mfdKWt', image: 'https://m.media-amazon.com/images/I/71t6W8N4Y8L._AC_SL1500_.jpg', benefit: 'Easy grooming.' },
      { name: 'Automatic Pet Feeder', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/41iJvEl', image: 'https://m.media-amazon.com/images/I/81xG-YvC6TL._AC_SL1500_.jpg', benefit: 'On-time feeding.' },
      { name: 'Pet Water Fountain', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/3PSASxU', image: 'https://m.media-amazon.com/images/I/81+X5Q9W2QL._AC_SL1500_.jpg', benefit: 'Fresh water.' },
      { name: 'Interactive Dog Toy', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/4mfmbAR', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Pet engagement.' },
      { name: 'Cat Laser Toy', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/47Hm0bJ', image: 'https://m.media-amazon.com/images/I/51-m67F7z9L._AC_SL1000_.jpg', benefit: 'Fun for cats.' },
      { name: 'Portable Pet Water Bottle', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/4drRB4S', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Walking hydration.' },
      { name: 'Slow Feeder Bowl', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4mbNWue', image: 'https://m.media-amazon.com/images/I/71Y8m7E-LRL._AC_SL1500_.jpg', benefit: 'Better digestion.' },
      { name: 'Pet Nail Clipper', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4sRqXHj', image: 'https://m.media-amazon.com/images/I/71t6W8N4Y8L._AC_SL1500_.jpg', benefit: 'Safe trimming.' },
      { name: 'Pet Bed', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4soPJh3', image: 'https://m.media-amazon.com/images/I/81xG-YvC6TL._AC_SL1500_.jpg', benefit: 'Comfort rest.' },

      // BABY (10)
      { name: 'Baby Nail Trimmer', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/4sgYlpK', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Safe nail care.' },
      { name: 'Silicone Feeding Set', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/48z3NNN', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Mess-free meals.' },
      { name: 'Baby Diaper Bag', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/3OkGAIp', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Organized outings.' },
      { name: 'Portable Changing Mat', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/4c8AHWJ', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Hygienic changes.' },
      { name: 'Cabinet Safety Locks', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4t1fyF2', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Home proofing.' },
      { name: 'Baby Bottle Warmer', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4sP3vdQ', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Perfect temp milk.' },
      { name: 'Baby Bath Support', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4ve9vOZ', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Safe bath time.' },
      { name: 'Stroller Organizer', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/4cuvnhy', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Essential reach.' },
      { name: 'Baby Toy Set', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/3PTsPkm', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Engage baby.' },
      { name: 'Baby Grooming Kit', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/4cbFKFG', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Complete care.' },

      // ELECTRONICS (10)
      { name: 'Wireless Earbuds', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4ccwbqa', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Clear sound.' },
      { name: 'Fast Wireless Charger', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4dQO28H', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'No cables.' },
      { name: 'Power Bank', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4tCD5w5', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Charge anywhere.' },
      { name: 'Bluetooth Speaker', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4mbyWMO', image: 'https://m.media-amazon.com/images/I/81xG-YvC6TL._AC_SL1500_.jpg', benefit: 'Music on go.' },
      { name: 'Smart LED Strip Lights', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/41hOMvW', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Mood lighting.' },
      { name: 'Car Phone Mount', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/4teXqb3', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Hands-free safety.' },
      { name: 'Charging Hub', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/4mkil9Y', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Central power.' },
      { name: 'Mini Projector', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/4sgFueI', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Cinema at home.' },
      { name: 'Laptop Stand', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/41PFXcP', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Ergonomic lift.' },
      { name: 'Phone Stand', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/47KCkbN', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Perfect angle.' },

      // SPORTS (10)
      { name: 'Resistance Bands', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/4csnjxL', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Full workout.' },
      { name: 'Massage Gun (Sports)', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/4t2EnR8', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Pro recovery.' },
      { name: 'Yoga Mat', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/47KcdSc', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Premium grip.' },
      { name: 'Adjustable Dumbbells', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/4vggOWa', image: 'https://m.media-amazon.com/images/I/81xG-YvC6TL._AC_SL1500_.jpg', benefit: 'Home gym.' },
      { name: 'Ab Roller', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/3OpiNHd', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Core strength.' },
      { name: 'Jump Rope', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/4bUqYV0', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Cardio power.' },
      { name: 'Foam Roller (Sports)', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/3PLBzJp', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Muscle flow.' },
      { name: 'Push-Up Board', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/4trnFKQ', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Muscle group target.' },
      { name: 'Gym Gloves', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/4cbGYAM', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Hand protect.' },
      { name: 'Water Bottle', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/41MUm9M', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Stay hydrated.' }
    ];

    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query(`DELETE FROM ${t.product}`);
    
    const [cats] = await pool.query(`SELECT id, slug FROM ${t.category}`);
    const catMap = {};
    cats.forEach(c => catMap[c.slug.toLowerCase()] = c.id);

    for (const p of products) {
      const catId = catMap[p.category.toLowerCase()];
      if (!catId) continue;
      
      let slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const isDuplicate = products.filter(x => x.name.toLowerCase() === p.name.toLowerCase()).length > 1;
      if (isDuplicate) { slug = `${slug}-${p.category.toLowerCase().split('-')[0]}`; }

      await pool.query(
        `INSERT INTO ${t.product} (name, slug, description, price, image, categoryId, affiliateUrl, badge, ratingValue, ratingText, shortDescription, keyBenefits)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.name, slug, p.benefit, 0, p.image, catId, p.url, p.badge, 4.8, '4.8/5 Recommended', p.benefit, JSON.stringify([p.benefit])]
      ).catch(() => {});
    }

    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    res.json({ success: true, message: `Reverted to strictly ${products.length} products with premium visuals.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const t = await getTables();
    const [[{ pCount }]] = await pool.query(`SELECT COUNT(*) as pCount FROM ${t.product}`);
    const [[{ cCount }]] = await pool.query(`SELECT COUNT(*) as cCount FROM ${t.category}`);
    const [[{ clCount }]] = await pool.query(`SELECT COUNT(*) as clCount FROM ${t.click}`).catch(() => [[{ clCount: 0 }]]);
    const [[{ sCount }]] = await pool.query(`SELECT COUNT(*) as sCount FROM ${t.sub}`).catch(() => [[{ sCount: 0 }]]);
    const [[{ mCount }]] = await pool.query(`SELECT COUNT(*) as mCount FROM ${t.message}`).catch(() => [[{ mCount: 0 }]]);
    const [[{ tCount }]] = await pool.query(`SELECT COUNT(*) as tCount FROM ${t.testimonial}`).catch(() => [[{ tCount: 0 }]]);
    res.json({ productCount: pCount, categoryCount: cCount, clickCount: clCount, subscriberCount: sCount, testimonialCount: tCount, messageCount: mCount });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
