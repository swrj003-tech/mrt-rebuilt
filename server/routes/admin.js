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
router.get('/force-sync-products', async (req, res) => {
  try {
    const { product: productTable, category: categoryTable } = await getTables();
    
    const products = [
      // HOME & KITCHEN (15)
      { name: 'Vegetable Chopper', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/4mgjKOK', benefit: 'Effortless meal prep in seconds.' },
      { name: 'Electric Spin Scrubber', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/4vayOS5', benefit: 'Deep clean without the elbow grease.' },
      { name: 'Vacuum Storage Bags', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/3NQUaDg', benefit: 'Save 80% more space in your closet.' },
      { name: 'Air Fryer Accessories Set', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/47J01RH', benefit: 'Unlock the full potential of your air fryer.' },
      { name: 'Ninja AF101 Air Fryer', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/3NQUaDg', benefit: 'Crispy results with 75% less fat.' },
      { name: 'Oil Spray Bottle', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/3OmAkQo', benefit: 'Controlled oil usage for healthier cooking.' },
      { name: 'Smart Plug', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/3PU7kzZ', benefit: 'Voice control for your home appliances.' },
      { name: 'LED Motion Sensor Lights', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/41hGtjS', benefit: 'Instant illumination where you need it.' },
      { name: 'Microfiber Cleaning Cloth Pack', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/4cdP3Fi', benefit: 'Lint-free, scratch-free cleaning power.' },
      { name: 'Electric Milk Frother', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/3NQUTEu', benefit: 'Coffee-shop quality foam at home.' },
      { name: 'Digital Kitchen Scale', category: 'home-kitchen', badge: "Editor's Choice", url: 'https://amzn.to/3PSpaDq', benefit: 'Precision weighing for perfect recipes.' },
      { name: 'Under Sink Organizer', category: 'home-kitchen', badge: "Editor's Choice", url: 'https://amzn.to/3NQUTEu', benefit: 'Maximize your storage space effortlessly.' },
      { name: 'Magnetic Knife Holder', category: 'home-kitchen', badge: "Editor's Choice", url: 'https://amzn.to/3NQUTEu', benefit: 'Sleek storage for your culinary tools.' },
      { name: 'Silicone Stretch Lids', category: 'home-kitchen', badge: "Editor's Choice", url: 'https://amzn.to/3NQUTEu', benefit: 'Keep food fresh without plastic wrap.' },
      { name: 'Herb Scissors Set', category: 'home-kitchen', badge: "Editor's Choice", url: 'https://amzn.to/3NQUTEu', benefit: 'Quickly chop fresh herbs for any dish.' },

      // BEAUTY (15)
      { name: 'Ice Face Roller', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/4sj2ytg', benefit: 'Reduce puffiness and refresh your skin.' },
      { name: 'Facial Cleansing Brush', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/4dwEOOH', benefit: 'Deep pore cleaning for a radiant glow.' },
      { name: 'Hair Straightener Brush', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/48jgyvP', benefit: 'Silky smooth hair in one pass.' },
      { name: 'LED Makeup Mirror', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/4vfzipZ', benefit: 'Professional lighting for flawless makeup.' },
      { name: 'Dyson Airwrap Styler', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/4vfzipZ', benefit: 'Coanda air styling without extreme heat.' },
      { name: 'Heatless Hair Curlers', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4migCSr', benefit: 'Perfect curls without the heat damage.' },
      { name: 'Blackhead Remover Vacuum', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4ve7ylD', benefit: 'Clear skin from the comfort of home.' },
      { name: 'Electric Toothbrush', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4vaA3AJ', benefit: 'Superior plaque removal and gum care.' },
      { name: 'Nano Ionic Face Steamer', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4vfzipZ', benefit: 'Open pores for deeper skin treatment.' },
      { name: 'Microdermabrasion Tool', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4vfzipZ', benefit: 'Exfoliate for smoother, brighter skin.' },
      { name: 'Electric Eyebrow Trimmer', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4seAiYR', benefit: 'Precise shaping with zero pain.' },
      { name: 'Makeup Brush Set', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4sW28dh', benefit: 'Professional tools for every look.' },
      { name: 'Cosmetic Organizer', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4tytGFH', benefit: 'Declutter your vanity in style.' },
      { name: 'Jade Roller & Gua Sha', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4tytGFH', benefit: 'Natural face lift and lymphatic drainage.' },
      { name: 'Scalp Massager Brush', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4tytGFH', benefit: 'Stimulate growth and deep clean hair.' },

      // HEALTH (15)
      { name: 'Neck & Shoulder Massager', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/4bUeFbj', benefit: 'Instant relief for muscle tension.' },
      { name: 'Posture Corrector', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/4mfhIhB', benefit: 'Better alignment, more confidence.' },
      { name: 'Massage Gun', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/41iIMTD', benefit: 'Professional-grade muscle recovery.' },
      { name: 'Memory Foam Pillow', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/4sP2liu', benefit: 'Unmatched neck support for deep sleep.' },
      { name: 'Smart Blood Pressure Monitor', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/4sP2liu', benefit: 'Clinical accuracy from your smartphone.' },
      { name: 'Aromatherapy Diffuser', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/47JWi6m', benefit: 'Transform your room into a spa.' },
      { name: 'Foam Roller', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/4vee8bR', benefit: 'Release tightness and improve flexibility.' },
      { name: 'Weighted Blanket', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/4cuuq8Y', benefit: 'Calm the mind and body for better rest.' },
      { name: 'Air Purifier for Home', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/4cuuq8Y', benefit: 'Breathe cleaner air in minutes.' },
      { name: 'Electric Heating Pad', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/4cuuq8Y', benefit: 'Targeted heat therapy for back and neck.' },
      { name: 'Eye Massager', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/4sjeTgW', benefit: 'Relieve eye strain after long days.' },
      { name: 'White Noise Machine', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/3PWkxbo', benefit: 'Block out noise for perfect focus or sleep.' },
      { name: 'Lumbar Support Cushion', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/4vdRQXB', benefit: 'Ergonomic comfort for all-day sitting.' },
      { name: 'Foot Spa Bath Massager', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/4vdRQXB', benefit: 'Ultimate relaxation for tired feet.' },
      { name: 'Personal Blender for Smoothies', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/4vdRQXB', benefit: 'Nutrition on the go, made simple.' },

      // PETS (15)
      { name: 'Pet Hair Remover Roller', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/4sCm3NL', benefit: 'Keep your furniture hair-free instantly.' },
      { name: 'Self-Cleaning Grooming Brush', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/4mfdKWt', benefit: 'Easy grooming, zero mess.' },
      { name: 'Automatic Pet Feeder', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/41iJvEl', benefit: 'Never miss a mealtime for your pet.' },
      { name: 'Pet Water Fountain', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/3PSASxU', benefit: 'Fresh, filtered water for your companions.' },
      { name: 'GPS Pet Tracker', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/3PSASxU', benefit: 'Never lose track of your furry friend.' },
      { name: 'Interactive Dog Toy', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/4mfmbAR', benefit: 'Keep your pet active and engaged.' },
      { name: 'Cat Laser Toy', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/47Hm0bJ', benefit: 'Hours of fun and exercise for your cat.' },
      { name: 'Portable Pet Water Bottle', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/4drRB4S', benefit: 'Stay hydrated on every walk.' },
      { name: 'Calming Pet Bed', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/4drRB4S', benefit: 'Reduce anxiety for better pet rest.' },
      { name: 'Dog Paw Cleaner', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/4drRB4S', benefit: 'Clean paws after every outdoor adventure.' },
      { name: 'Slow Feeder Bowl', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4mbNWue', benefit: 'Prevent bloating and improve digestion.' },
      { name: 'Pet Nail Clipper', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4sRqXHj', benefit: 'Professional grooming at home.' },
      { name: 'Cat Window Perch', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4soPJh3', benefit: 'The best view in the house for your cat.' },
      { name: 'Hands-Free Dog Leash', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4soPJh3', benefit: 'Perfect for running or hiking with pets.' },
      { name: 'Pet Grooming Glove', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4soPJh3', benefit: 'Gentle deshedding during petting.' },

      // BABY (15)
      { name: 'Baby Nail Trimmer', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/4sgYlpK', benefit: 'Safe and gentle care for tiny nails.' },
      { name: 'Silicone Feeding Set', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/48z3NNN', benefit: 'Mess-free and safe mealtime gear.' },
      { name: 'Baby Diaper Bag', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/3OkGAIp', benefit: 'Stay organized on the go with style.' },
      { name: 'Portable Changing Mat', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/4c8AHWJ', benefit: 'Hygienic changes anywhere, anytime.' },
      { name: 'Video Baby Monitor', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/4c8AHWJ', benefit: 'Peace of mind with night vision and audio.' },
      { name: 'Cabinet Safety Locks', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4t1fyF2', benefit: 'Proof your home for peace of mind.' },
      { name: 'Baby Bottle Warmer', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4sP3vdQ', benefit: 'Perfect temp milk in minutes.' },
      { name: 'Baby Bath Support', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4ve9vOZ', benefit: 'Safe and comfortable bath time fun.' },
      { name: 'White Noise for Babies', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4ve9vOZ', benefit: 'Soothing sounds for a restful nursery.' },
      { name: 'Baby Nasal Aspirator', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4ve9vOZ', benefit: 'Quick and gentle relief for congestion.' },
      { name: 'Stroller Organizer', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/4cuvnhy', benefit: 'Essentials within reach for easy walks.' },
      { name: 'Baby Toy Set', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/3PTsPkm', benefit: 'Engage and entertain your little one.' },
      { name: 'Baby Grooming Kit', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/4cbFKFG', benefit: 'Complete care for your baby’s needs.' },
      { name: 'Teething Toy Set', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/4cbFKFG', benefit: 'Safe silicone for gum relief.' },
      { name: 'Baby Milestone Blanket', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/4cbFKFG', benefit: 'Capture every memory in high style.' },

      // ELECTRONICS (15)
      { name: 'Wireless Earbuds', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4ccwbqa', benefit: 'Crystal clear sound without the wires.' },
      { name: 'Fast Wireless Charger', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4dQO28H', benefit: 'Power up without the cable clutter.' },
      { name: 'Power Bank', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4tCD5w5', benefit: 'Stay charged wherever you are.' },
      { name: 'Bluetooth Speaker', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4mbyWMO', benefit: 'Take your music anywhere you go.' },
      { name: 'Noise Cancelling Headphones', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4mbyWMO', benefit: 'Block the world, enjoy the music.' },
      { name: 'Smart LED Strip Lights', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/41hOMvW', benefit: 'Ambiance for every room in your home.' },
      { name: 'Car Phone Mount', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/4teXqb3', benefit: 'Hands-free safety on every drive.' },
      { name: 'Charging Hub', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/4mkil9Y', benefit: 'One stop for all your device charging.' },
      { name: 'AirTag 4-Pack', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/4mkil9Y', benefit: 'Never lose your keys or bags again.' },
      { name: 'Ring Video Doorbell', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/4mkil9Y', benefit: 'See who is at the door from anywhere.' },
      { name: 'Mini Projector', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/4sgFueI', benefit: 'Cinema experience right in your room.' },
      { name: 'Laptop Stand', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/41PFXcP', benefit: 'Ergonomic lift for a better workspace.' },
      { name: 'Phone Stand', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/47KCkbN', benefit: 'Keep your device at the perfect angle.' },
      { name: 'Cable Organizer Box', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/47KCkbN', benefit: 'Hide the mess and stay organized.' },
      { name: 'USB-C Hub Adapter', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/47KCkbN', benefit: 'Connect all your peripherals at once.' },

      // SPORTS (15)
      { name: 'Resistance Bands', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/4csnjxL', benefit: 'Full body workout, anytime, anywhere.' },
      { name: 'Massage Gun', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/4t2EnR8', benefit: 'Recovery like the pros, at home.' },
      { name: 'Yoga Mat', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/47KcdSc', benefit: 'Premium grip and cushion for every flow.' },
      { name: 'Adjustable Dumbbells', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/4vggOWa', benefit: 'Compact home gym in one pair.' },
      { name: 'Smart Fitness Watch', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/4vggOWa', benefit: 'Track every step and heartbeat.' },
      { name: 'Ab Roller', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/3OpiNHd', benefit: 'Build core strength with every rep.' },
      { name: 'Jump Rope', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/4bUqYV0', benefit: 'High-intensity cardio in a small package.' },
      { name: 'Foam Roller', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/3PLBzJp', benefit: 'Release muscle tension and improve flow.' },
      { name: 'Cycling Shorts (Padded)', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/3PLBzJp', benefit: 'Comfort for long-distance rides.' },
      { name: 'Sports Headband Set', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/3PLBzJp', benefit: 'Keep sweat away and focus on the goal.' },
      { name: 'Push-Up Board', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/4trnFKQ', benefit: 'Target specific muscle groups with ease.' },
      { name: 'Gym Gloves', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/4cbGYAM', benefit: 'Protect your hands and improve grip.' },
      { name: 'Water Bottle', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/41MUm9M', benefit: 'Stay hydrated with a sleek design.' },
      { name: 'Grip Strengthener', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/41MUm9M', benefit: 'Build forearm power and endurance.' },
      { name: 'Ankle Weights Set', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/41MUm9M', benefit: 'Add resistance to every movement.' }
    ];

    // Get categories mapping
    const [cats] = await pool.query(`SELECT id, slug FROM ${categoryTable}`);
    const catMap = {};
    cats.forEach(c => catMap[c.slug.toLowerCase()] = c.id);

    // Auto-Heal Database Schema (Create missing columns if needed)
    const [cols] = await pool.query(`SHOW COLUMNS FROM ${productTable}`);
    const colNames = cols.map(c => c.Field);
    
    if (!colNames.includes('ratingText')) await pool.query(`ALTER TABLE ${productTable} ADD COLUMN ratingText VARCHAR(255) DEFAULT '4.8/5 Recommended'`);
    if (!colNames.includes('shortDescription')) await pool.query(`ALTER TABLE ${productTable} ADD COLUMN shortDescription TEXT`);
    if (!colNames.includes('secondaryUrl')) await pool.query(`ALTER TABLE ${productTable} ADD COLUMN secondaryUrl TEXT`);
    if (!colNames.includes('keyBenefits')) await pool.query(`ALTER TABLE ${productTable} ADD COLUMN keyBenefits TEXT`);

    // Force Unlock Database Constraints for Cleanup
    await pool.query('SET FOREIGN_KEY_CHECKS = 0');

    // Clean existing products and metadata
    await pool.query(`DELETE FROM ${productTable}`);
    
    // Clean up "Test Category" and related data
    await pool.query(`DELETE FROM ${categoryTable} WHERE slug = 'test-category' OR name LIKE '%Test%'`);

    // Re-enable constraints
    await pool.query('SET FOREIGN_KEY_CHECKS = 1');

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

    res.json({ success: true, message: `Injected ${products.length} products successfully and cleaned up ghost categories.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
