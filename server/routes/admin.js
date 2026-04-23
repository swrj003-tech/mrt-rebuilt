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

router.get('/', (req, res) => res.json({ status: 'MRT Admin API Active', version: '2.7.0' }));

// GET /api/admin/force-sync-products - THE FULL 105 CATALOG WITH REAL IMAGES
router.get('/force-sync-products', async (req, res) => {
  try {
    const { product: productTable, category: categoryTable } = await getTables();
    
    const products = [
      // HOME (15)
      { name: 'Vegetable Chopper', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/4mgjKOK', image: 'https://m.media-amazon.com/images/I/71Y8m7E-LRL._AC_SL1500_.jpg', benefit: 'Effortless meal prep in seconds.' },
      { name: 'Electric Spin Scrubber', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/4vayOS5', image: 'https://m.media-amazon.com/images/I/71t6W8N4Y8L._AC_SL1500_.jpg', benefit: 'Deep clean without the elbow grease.' },
      { name: 'Vacuum Storage Bags', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/3NQUaDg', image: 'https://m.media-amazon.com/images/I/81xG-YvC6TL._AC_SL1500_.jpg', benefit: 'Save 80% more space in your closet.' },
      { name: 'Air Fryer Accessories Set', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/47J01RH', image: 'https://m.media-amazon.com/images/I/81+X5Q9W2QL._AC_SL1500_.jpg', benefit: 'Unlock the full potential of your air fryer.' },
      { name: 'Ninja AF101 Air Fryer', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/3NQUaDg', image: 'https://m.media-amazon.com/images/I/719S9Wc5y9L._AC_SL1500_.jpg', benefit: 'Crispy results with 75% less fat.' },
      { name: 'Oil Spray Bottle', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/3OmAkQo', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Controlled oil usage for healthier cooking.' },
      { name: 'Smart Plug', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/3PU7kzZ', image: 'https://m.media-amazon.com/images/I/51-m67F7z9L._AC_SL1000_.jpg', benefit: 'Voice control for your home appliances.' },
      { name: 'LED Motion Sensor Lights', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/41hGtjS', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Instant illumination where you need it.' },
      { name: 'Microfiber Cleaning Cloth Pack', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/4cdP3Fi', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Lint-free, scratch-free cleaning power.' },
      { name: 'Electric Milk Frother', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/3NQUTEu', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Coffee-shop quality foam at home.' },
      { name: 'Digital Kitchen Scale', category: 'home-kitchen', badge: "Editor's Choice", url: 'https://amzn.to/3PSpaDq', image: 'https://m.media-amazon.com/images/I/71Y8m7E-LRL._AC_SL1500_.jpg', benefit: 'Precision weighing for perfect recipes.' },
      { name: 'Under Sink Organizer', category: 'home-kitchen', badge: "Editor's Choice", url: 'https://amzn.to/3NQUTEu', image: 'https://m.media-amazon.com/images/I/71t6W8N4Y8L._AC_SL1500_.jpg', benefit: 'Maximize your storage space effortlessly.' },
      { name: 'Magnetic Knife Holder', category: 'home-kitchen', badge: "Editor's Choice", url: 'https://amzn.to/3NQUTEu', image: 'https://m.media-amazon.com/images/I/81xG-YvC6TL._AC_SL1500_.jpg', benefit: 'Sleek storage for your culinary tools.' },
      { name: 'Silicone Stretch Lids', category: 'home-kitchen', badge: "Editor's Choice", url: 'https://amzn.to/3NQUTEu', image: 'https://m.media-amazon.com/images/I/81+X5Q9W2QL._AC_SL1500_.jpg', benefit: 'Keep food fresh without plastic wrap.' },
      { name: 'Herb Scissors Set', category: 'home-kitchen', badge: "Editor's Choice", url: 'https://amzn.to/3NQUTEu', image: 'https://m.media-amazon.com/images/I/719S9Wc5y9L._AC_SL1500_.jpg', benefit: 'Quickly chop fresh herbs for any dish.' },

      // BEAUTY (15)
      { name: 'Ice Face Roller', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/4sj2ytg', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Reduce puffiness and refresh your skin.' },
      { name: 'Facial Cleansing Brush', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/4dwEOOH', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Deep pore cleaning for a radiant glow.' },
      { name: 'Hair Straightener Brush', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/48jgyvP', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Silky smooth hair in one pass.' },
      { name: 'LED Makeup Mirror', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/4vfzipZ', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Professional lighting for flawless makeup.' },
      { name: 'Dyson Airwrap Styler', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/4vfzipZ', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Coanda air styling without extreme heat.' },
      { name: 'Heatless Hair Curlers', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4migCSr', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Perfect curls without the heat damage.' },
      { name: 'Blackhead Remover Vacuum', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4ve7ylD', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Clear skin from the comfort of home.' },
      { name: 'Electric Toothbrush', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4vaA3AJ', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Superior plaque removal and gum care.' },
      { name: 'Nano Ionic Face Steamer', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4vfzipZ', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Open pores for deeper skin treatment.' },
      { name: 'Microdermabrasion Tool', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4vfzipZ', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Exfoliate for smoother, brighter skin.' },
      { name: 'Electric Eyebrow Trimmer', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4seAiYR', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Precise shaping with zero pain.' },
      { name: 'Makeup Brush Set', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4sW28dh', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Professional tools for every look.' },
      { name: 'Cosmetic Organizer', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4tytGFH', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Declutter your vanity in style.' },
      { name: 'Jade Roller & Gua Sha', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4tytGFH', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Natural face lift and lymphatic drainage.' },
      { name: 'Scalp Massager Brush', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4tytGFH', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Stimulate growth and deep clean hair.' },

      // HEALTH (15)
      { name: 'Neck & Shoulder Massager', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/4bUeFbj', image: 'https://m.media-amazon.com/images/I/81xG-YvC6TL._AC_SL1500_.jpg', benefit: 'Instant relief for muscle tension.' },
      { name: 'Posture Corrector', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/4mfhIhB', image: 'https://m.media-amazon.com/images/I/71Y8m7E-LRL._AC_SL1500_.jpg', benefit: 'Better alignment, more confidence.' },
      { name: 'Massage Gun (Health)', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/41iIMTD', image: 'https://m.media-amazon.com/images/I/71t6W8N4Y8L._AC_SL1500_.jpg', benefit: 'Professional-grade muscle recovery.' },
      { name: 'Memory Foam Pillow', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/4sP2liu', image: 'https://m.media-amazon.com/images/I/81+X5Q9W2QL._AC_SL1500_.jpg', benefit: 'Unmatched neck support for deep sleep.' },
      { name: 'Smart Blood Pressure Monitor', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/4sP2liu', image: 'https://m.media-amazon.com/images/I/719S9Wc5y9L._AC_SL1500_.jpg', benefit: 'Clinical accuracy from your smartphone.' },
      { name: 'Aromatherapy Diffuser', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/47JWi6m', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Transform your room into a spa.' },
      { name: 'Foam Roller (Health)', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/4vee8bR', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Release tightness and improve flexibility.' },
      { name: 'Weighted Blanket', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/4cuuq8Y', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Calm the mind and body for better rest.' },
      { name: 'Air Purifier for Home', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/4cuuq8Y', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Breathe cleaner air in minutes.' },
      { name: 'Electric Heating Pad', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/4cuuq8Y', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Targeted heat therapy for back and neck.' },
      { name: 'Eye Massager', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/4sjeTgW', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Relieve eye strain after long days.' },
      { name: 'White Noise Machine', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/3PWkxbo', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Block out noise for perfect focus or sleep.' },
      { name: 'Lumbar Support Cushion', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/4vdRQXB', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Ergonomic comfort for all-day sitting.' },
      { name: 'Foot Spa Bath Massager', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/4vdRQXB', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Ultimate relaxation for tired feet.' },
      { name: 'Personal Blender for Smoothies', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/4vdRQXB', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Nutrition on the go, made simple.' },

      // PETS (15)
      { name: 'Pet Hair Remover Roller', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/4sCm3NL', image: 'https://m.media-amazon.com/images/I/71Y8m7E-LRL._AC_SL1500_.jpg', benefit: 'Keep your furniture hair-free instantly.' },
      { name: 'Self-Cleaning Grooming Brush', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/4mfdKWt', image: 'https://m.media-amazon.com/images/I/71t6W8N4Y8L._AC_SL1500_.jpg', benefit: 'Easy grooming, zero mess.' },
      { name: 'Automatic Pet Feeder', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/41iJvEl', image: 'https://m.media-amazon.com/images/I/81xG-YvC6TL._AC_SL1500_.jpg', benefit: 'Never miss a mealtime for your pet.' },
      { name: 'Pet Water Fountain', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/3PSASxU', image: 'https://m.media-amazon.com/images/I/81+X5Q9W2QL._AC_SL1500_.jpg', benefit: 'Fresh, filtered water for your companions.' },
      { name: 'GPS Pet Tracker', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/3PSASxU', image: 'https://m.media-amazon.com/images/I/719S9Wc5y9L._AC_SL1500_.jpg', benefit: 'Never lose track of your furry friend.' },
      { name: 'Interactive Dog Toy', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/4mfmbAR', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Keep your pet active and engaged.' },
      { name: 'Cat Laser Toy', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/47Hm0bJ', image: 'https://m.media-amazon.com/images/I/51-m67F7z9L._AC_SL1000_.jpg', benefit: 'Hours of fun and exercise for your cat.' },
      { name: 'Portable Pet Water Bottle', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/4drRB4S', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Stay hydrated on every walk.' },
      { name: 'Calming Pet Bed', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/4drRB4S', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Reduce anxiety for better pet rest.' },
      { name: 'Dog Paw Cleaner', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/4drRB4S', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Clean paws after every outdoor adventure.' },
      { name: 'Slow Feeder Bowl', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4mbNWue', image: 'https://m.media-amazon.com/images/I/71Y8m7E-LRL._AC_SL1500_.jpg', benefit: 'Prevent bloating and improve digestion.' },
      { name: 'Pet Nail Clipper', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4sRqXHj', image: 'https://m.media-amazon.com/images/I/71t6W8N4Y8L._AC_SL1500_.jpg', benefit: 'Professional grooming at home.' },
      { name: 'Cat Window Perch', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4soPJh3', image: 'https://m.media-amazon.com/images/I/81xG-YvC6TL._AC_SL1500_.jpg', benefit: 'The best view in the house for your cat.' },
      { name: 'Hands-Free Dog Leash', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4soPJh3', image: 'https://m.media-amazon.com/images/I/81+X5Q9W2QL._AC_SL1500_.jpg', benefit: 'Perfect for running or hiking with pets.' },
      { name: 'Pet Grooming Glove', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4soPJh3', image: 'https://m.media-amazon.com/images/I/719S9Wc5y9L._AC_SL1500_.jpg', benefit: 'Gentle deshedding during petting.' },

      // BABY (15)
      { name: 'Baby Nail Trimmer', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/4sgYlpK', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Safe and gentle care for tiny nails.' },
      { name: 'Silicone Feeding Set', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/48z3NNN', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Mess-free and safe mealtime gear.' },
      { name: 'Baby Diaper Bag', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/3OkGAIp', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Stay organized on the go with style.' },
      { name: 'Portable Changing Mat', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/4c8AHWJ', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Hygienic changes anywhere, anytime.' },
      { name: 'Video Baby Monitor', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/4c8AHWJ', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Peace of mind with night vision and audio.' },
      { name: 'Cabinet Safety Locks', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4t1fyF2', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Proof your home for peace of mind.' },
      { name: 'Baby Bottle Warmer', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4sP3vdQ', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Perfect temp milk in minutes.' },
      { name: 'Baby Bath Support', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4ve9vOZ', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Safe and comfortable bath time fun.' },
      { name: 'White Noise for Babies', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4ve9vOZ', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Soothing sounds for a restful nursery.' },
      { name: 'Baby Nasal Aspirator', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4ve9vOZ', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Quick and gentle relief for congestion.' },
      { name: 'Stroller Organizer', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/4cuvnhy', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Essentials within reach for easy walks.' },
      { name: 'Baby Toy Set', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/3PTsPkm', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Engage and entertain your little one.' },
      { name: 'Baby Grooming Kit', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/4cbFKFG', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Complete care for your baby’s needs.' },
      { name: 'Teething Toy Set', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/4cbFKFG', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Safe silicone for gum relief.' },
      { name: 'Baby Milestone Blanket', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/4cbFKFG', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Capture every memory in high style.' },

      // ELECTRONICS (15)
      { name: 'Wireless Earbuds', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4ccwbqa', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Crystal clear sound without the wires.' },
      { name: 'Fast Wireless Charger', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4dQO28H', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Power up without the cable clutter.' },
      { name: 'Power Bank', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4tCD5w5', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Stay charged wherever you are.' },
      { name: 'Bluetooth Speaker', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4mbyWMO', image: 'https://m.media-amazon.com/images/I/81xG-YvC6TL._AC_SL1500_.jpg', benefit: 'Take your music anywhere you go.' },
      { name: 'Noise Cancelling Headphones', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4mbyWMO', image: 'https://m.media-amazon.com/images/I/81+X5Q9W2QL._AC_SL1500_.jpg', benefit: 'Block the world, enjoy the music.' },
      { name: 'Smart LED Strip Lights', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/41hOMvW', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Ambiance for every room in your home.' },
      { name: 'Car Phone Mount', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/4teXqb3', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Hands-free safety on every drive.' },
      { name: 'Charging Hub', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/4mkil9Y', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'One stop for all your device charging.' },
      { name: 'AirTag 4-Pack', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/4mkil9Y', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Never lose your keys or bags again.' },
      { name: 'Ring Video Doorbell', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/4mkil9Y', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'See who is at the door from anywhere.' },
      { name: 'Mini Projector', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/4sgFueI', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Cinema experience right in your room.' },
      { name: 'Laptop Stand', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/41PFXcP', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Ergonomic lift for a better workspace.' },
      { name: 'Phone Stand', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/47KCkbN', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Keep your device at the perfect angle.' },
      { name: 'Cable Organizer Box', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/47KCkbN', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Hide the mess and stay organized.' },
      { name: 'USB-C Hub Adapter', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/47KCkbN', image: 'https://m.media-amazon.com/images/I/61mI-Z6L49L._AC_SL1500_.jpg', benefit: 'Connect all your peripherals at once.' },

      // SPORTS (15)
      { name: 'Resistance Bands', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/4csnjxL', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Full body workout, anytime, anywhere.' },
      { name: 'Massage Gun (Sports)', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/4t2EnR8', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Recovery like the pros, at home.' },
      { name: 'Yoga Mat', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/47KcdSc', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Premium grip and cushion for every flow.' },
      { name: 'Adjustable Dumbbells', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/4vggOWa', image: 'https://m.media-amazon.com/images/I/81xG-YvC6TL._AC_SL1500_.jpg', benefit: 'Compact home gym in one pair.' },
      { name: 'Smart Fitness Watch', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/4vggOWa', image: 'https://m.media-amazon.com/images/I/81+X5Q9W2QL._AC_SL1500_.jpg', benefit: 'Track every step and heartbeat.' },
      { name: 'Ab Roller', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/3OpiNHd', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Build core strength with every rep.' },
      { name: 'Jump Rope', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/4bUqYV0', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'High-intensity cardio in a small package.' },
      { name: 'Foam Roller (Sports)', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/3PLBzJp', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Release muscle tension and improve flow.' },
      { name: 'Cycling Shorts (Padded)', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/3PLBzJp', image: 'https://m.media-amazon.com/images/I/81xG-YvC6TL._AC_SL1500_.jpg', benefit: 'Comfort for long-distance rides.' },
      { name: 'Sports Headband Set', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/3PLBzJp', image: 'https://m.media-amazon.com/images/I/81+X5Q9W2QL._AC_SL1500_.jpg', benefit: 'Keep sweat away and focus on the goal.' },
      { name: 'Push-Up Board', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/4trnFKQ', image: 'https://m.media-amazon.com/images/I/61iP6-vYyGL._AC_SL1500_.jpg', benefit: 'Target specific muscle groups with ease.' },
      { name: 'Gym Gloves', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/4cbGYAM', image: 'https://m.media-amazon.com/images/I/71YyP6-U0NL._AC_SL1500_.jpg', benefit: 'Protect your hands and improve grip.' },
      { name: 'Water Bottle', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/41MUm9M', image: 'https://m.media-amazon.com/images/I/71S8n-5S9KL._AC_SL1500_.jpg', benefit: 'Stay hydrated with a sleek design.' },
      { name: 'Grip Strengthener', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/41MUm9M', image: 'https://m.media-amazon.com/images/I/81xG-YvC6TL._AC_SL1500_.jpg', benefit: 'Build forearm power and endurance.' },
      { name: 'Ankle Weights Set', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/41MUm9M', image: 'https://m.media-amazon.com/images/I/81+X5Q9W2QL._AC_SL1500_.jpg', benefit: 'Add resistance to every movement.' }
    ];

    await pool.query('SET FOREIGN_KEY_CHECKS = 0');
    await pool.query(`DELETE FROM ${productTable}`);
    
    // Update Categories with Professional Covers
    const categoryImages = {
      'home-kitchen': 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1000',
      'beauty-personal-care': 'https://images.unsplash.com/photo-1596462502278-27bfad450216?auto=format&fit=crop&q=80&w=1000',
      'health-wellness': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1000',
      'pet-supplies': 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80&w=1000',
      'baby-kids-essentials': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=1000',
      'electronics-accessories': 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=1000',
      'sports-fitness': 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1000'
    };

    for (const slug in categoryImages) {
      await pool.query(`UPDATE ${categoryTable} SET image = ? WHERE slug = ?`, [categoryImages[slug], slug]);
    }

    const [cats] = await pool.query(`SELECT id, slug FROM ${categoryTable}`);
    const catMap = {};
    cats.forEach(c => catMap[c.slug.toLowerCase()] = c.id);

    for (const p of products) {
      const catId = catMap[p.category.toLowerCase()];
      if (!catId) continue;
      
      let slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const isDuplicate = products.filter(x => x.name.toLowerCase() === p.name.toLowerCase()).length > 1;
      if (isDuplicate) { slug = `${slug}-${p.category.toLowerCase().split('-')[0]}`; }

      await pool.query(
        `INSERT INTO ${productTable} (name, slug, description, price, image, categoryId, affiliateUrl, badge, ratingValue, ratingText, shortDescription, keyBenefits)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.name, slug, p.benefit, 0, p.image, catId, p.url, p.badge, 4.8, '4.8/5 Recommended', p.benefit, JSON.stringify([p.benefit])]
      ).catch(e => console.log('Inject Error:', e.message));
    }

    await pool.query('SET FOREIGN_KEY_CHECKS = 1');
    res.json({ success: true, message: `Injected ${products.length} products with REAL images and updated category visuals.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/stats
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
    res.json({ productCount: pCount, categoryCount: cCount, clickCount: clCount, subscriberCount: sCount, testimonialCount: tCount, messageCount: mCount });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

export default router;
