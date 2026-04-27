import fs from 'fs';
import path from 'path';

// This matches the products array from inject_products.js
const products = [
  // HOME & KITCHEN
  { name: 'Vegetable Chopper', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/4mgjKOK', benefit: 'Effortless meal prep in seconds.', image: '/assets/products/vegetable-chopper.png' },
  { name: 'Electric Spin Scrubber', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/4vayOS5', benefit: 'Deep clean without the elbow grease.', image: '/assets/products/electric_spin_scrubber.png' },
  { name: 'Vacuum Storage Bags', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/3NQUaDg', benefit: 'Save 80% more space in your closet.', image: '/assets/products/vacuum-bags.png' },
  { name: 'Air Fryer Accessories Set', category: 'home-kitchen', badge: 'Top Pick', url: 'https://amzn.to/47J01RH', benefit: 'Unlock the full potential of your air fryer.', image: '/assets/products/air-fryer-accessories.png' },
  { name: 'Oil Spray Bottle', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/3OmAkQo', benefit: 'Controlled oil usage for healthier cooking.', image: '/assets/products/oil-spray-bottle.png' },
  { name: 'Smart Plug', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/3PU7kzZ', benefit: 'Voice control for your home appliances.', image: '/assets/products/smart-plug.png' },
  { name: 'LED Motion Sensor Lights', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/41hGtjS', benefit: 'Instant illumination where you need it.', image: '/assets/products/motion-lights.png' },
  { name: 'Microfiber Cleaning Cloth Pack', category: 'home-kitchen', badge: 'Trending Now', url: 'https://amzn.to/4cdP3Fi', benefit: 'Lint-free, scratch-free cleaning power.', image: '/assets/products/microfiber-cloths.png' },
  { name: 'Digital Kitchen Scale', category: 'home-kitchen', badge: "Editor's Choice", url: 'https://amzn.to/3PSpaDq', benefit: 'Precision weighing for perfect recipes.', image: '/assets/products/kitchen-scale.png' },
  { name: 'Under Sink Organizer', category: 'home-kitchen', badge: "Editor's Choice", url: 'https://amzn.to/3NQUTEu', benefit: 'Maximize your storage space effortlessly.', image: '/assets/products/under-sink-organizer.png' },

  // BEAUTY
  { name: 'Ice Face Roller', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/4sj2ytg', benefit: 'Reduce puffiness and refresh your skin.', image: '/assets/products/ice_face_roller.png' },
  { name: 'Facial Cleansing Brush', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/4dwEOOH', benefit: 'Deep pore cleaning for a radiant glow.', image: '/assets/products/sonic-facial-cleansing-brush.jpg' },
  { name: 'Hair Straightener Brush', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/48jgyvP', benefit: 'Silky smooth hair in one pass.', image: '/assets/products/hair-straightener-brush.png' },
  { name: 'LED Makeup Mirror', category: 'beauty-personal-care', badge: 'Top Pick', url: 'https://amzn.to/4vfzipZ', benefit: 'Professional lighting for flawless makeup.', image: '/assets/products/led-makeup-mirror.png' },
  { name: 'Heatless Hair Curlers', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4migCSr', benefit: 'Perfect curls without the heat damage.', image: '/assets/products/heatless-curlers.png' },
  { name: 'Blackhead Remover Vacuum', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4ve7ylD', benefit: 'Clear skin from the comfort of home.', image: '/assets/products/blackhead-remover.png' },
  { name: 'Electric Toothbrush', category: 'beauty-personal-care', badge: 'Trending Now', url: 'https://amzn.to/4vaA3AJ', benefit: 'Superior plaque removal and gum care.', image: '/assets/products/electric-toothbrush.png' },
  { name: 'Electric Eyebrow Trimmer', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4seAiYR', benefit: 'Precise shaping with zero pain.', image: '/assets/products/eyebrow-trimmer.png' },
  { name: 'Makeup Brush Set', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4sW28dh', benefit: 'Professional tools for every look.', image: '/assets/products/makeup-brush-set.png' },
  { name: 'Cosmetic Organizer', category: 'beauty-personal-care', badge: "Editor's Choice", url: 'https://amzn.to/4tytGFH', benefit: 'Declutter your vanity in style.', image: '/assets/products/cosmetic-organizer.png' },

  // HEALTH
  { name: 'Neck & Shoulder Massager', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/4bUeFbj', benefit: 'Instant relief for muscle tension.', image: '/assets/products/neck-massager.png' },
  { name: 'Posture Corrector', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/4mfhIhB', benefit: 'Better alignment, more confidence.', image: '/assets/products/posture-corrector.png' },
  { name: 'Massage Gun', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/41iIMTD', benefit: 'Professional-grade muscle recovery.', image: '/assets/products/massage-gun.png' },
  { name: 'Memory Foam Pillow', category: 'health-wellness', badge: 'Top Pick', url: 'https://amzn.to/4sP2liu', benefit: 'Unmatched neck support for deep sleep.', image: '/assets/products/memory-foam-pillow.png' },
  { name: 'Aromatherapy Diffuser', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/47JWi6m', benefit: 'Transform your room into a spa.', image: '/assets/products/aromatherapy-diffuser-luxury.jpg' },
  { name: 'Foam Roller', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/4vee8bR', benefit: 'Release tightness and improve flexibility.', image: '/assets/products/foam-roller.png' },
  { name: 'Weighted Blanket', category: 'health-wellness', badge: 'Trending Now', url: 'https://amzn.to/4cuuq8Y', benefit: 'Calm the mind and body for better rest.', image: '/assets/products/weighted-blanket.png' },
  { name: 'Eye Massager', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/4sjeTgW', benefit: 'Relieve eye strain after long days.', image: '/assets/products/eye-massager.png' },
  { name: 'White Noise Machine', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/3PWkxbo', benefit: 'Block out noise for perfect focus or sleep.', image: '/assets/products/white-noise-machine.png' },
  { name: 'Lumbar Support Cushion', category: 'health-wellness', badge: "Editor's Choice", url: 'https://amzn.to/4vdRQXB', benefit: 'Ergonomic comfort for all-day sitting.', image: '/assets/products/lumbar-support-cushion.png' },

  // PETS
  { name: 'Pet Hair Remover Roller', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/4sCm3NL', benefit: 'Keep your furniture hair-free instantly.', image: '/assets/products/pet-hair-remover-roller.png' },
  { name: 'Self-Cleaning Grooming Brush', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/4mfdKWt', benefit: 'Easy grooming, zero mess.', image: '/assets/products/self-cleaning-grooming-brush.png' },
  { name: 'Automatic Pet Feeder', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/41iJvEl', benefit: 'Never miss a mealtime for your pet.', image: '/assets/products/pet-feeder.png' },
  { name: 'Pet Water Fountain', category: 'pet-supplies', badge: 'Top Pick', url: 'https://amzn.to/3PSASxU', benefit: 'Fresh, filtered water for your companions.', image: '/assets/products/pet-water-fountain.png' },
  { name: 'Interactive Dog Toy', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/4mfmbAR', benefit: 'Keep your pet active and engaged.', image: '/assets/products/interactive-dog-toy.png' },
  { name: 'Cat Laser Toy', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/47Hm0bJ', benefit: 'Hours of fun and exercise for your cat.', image: '/assets/products/cat-laser-toy.png' },
  { name: 'Portable Pet Water Bottle', category: 'pet-supplies', badge: 'Trending Now', url: 'https://amzn.to/4drRB4S', benefit: 'Stay hydrated on every walk.', image: '/assets/products/portable-pet-water-bottle.png' },
  { name: 'Slow Feeder Bowl', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4mbNWue', benefit: 'Prevent bloating and improve digestion.', image: '/assets/products/slow-feeder-bowl.png' },
  { name: 'Pet Nail Clipper', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4sRqXHj', benefit: 'Professional grooming at home.', image: '/assets/products/pet-nail-clipper.png' },
  { name: 'Pet Bed', category: 'pet-supplies', badge: "Editor's Choice", url: 'https://amzn.to/4soPJh3', benefit: 'The ultimate comfort for your furry friend.', image: '/assets/products/pet-bed.png' },

  // BABY & KIDS
  { name: 'Baby Nail Trimmer', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/4sgYlpK', benefit: 'Safe and gentle care for tiny nails.', image: '/assets/products/baby-clipper-premium.png' },
  { name: 'Silicone Feeding Set', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/48z3NNN', benefit: 'Mess-free and safe mealtime gear.', image: '/assets/products/silicone-feeding-set.png' },
  { name: 'Baby Diaper Bag', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/3OkGAIp', benefit: 'Stay organized on the go with style.', image: '/assets/products/baby-diaper-bag.png' },
  { name: 'Portable Changing Mat', category: 'baby-kids-essentials', badge: 'Top Pick', url: 'https://amzn.to/4c8AHWJ', benefit: 'Hygienic changes anywhere, anytime.', image: '/assets/products/portable-changing-mat.png' },
  { name: 'Cabinet Safety Locks', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4t1fyF2', benefit: 'Proof your home for peace of mind.', image: '/assets/products/cabinet-safety-locks.png' },
  { name: 'Baby Bottle Warmer', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4sP3vdQ', benefit: 'Perfect temp milk in minutes.', image: '/assets/products/baby-bottle-warmer.png' },
  { name: 'Baby Bath Support', category: 'baby-kids-essentials', badge: 'Trending Now', url: 'https://amzn.to/4ve9vOZ', benefit: 'Safe and comfortable bath time fun.', image: '/assets/products/baby-bath-support.png' },
  { name: 'Stroller Organizer', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/4cuvnhy', benefit: 'Essentials within reach for easy walks.', image: '/assets/products/stroller-organizer.png' },
  { name: 'Baby Toy Set', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/3PTsPkm', benefit: 'Engage and entertain your little one.', image: '/assets/products/baby-toy-set.png' },
  { name: 'Baby Grooming Kit', category: 'baby-kids-essentials', badge: "Editor's Choice", url: 'https://amzn.to/4cbFKFG', benefit: 'Complete care for your baby’s needs.', image: '/assets/products/baby-grooming-kit.png' },

  // ELECTRONICS
  { name: 'Wireless Earbuds', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4ccwbqa', benefit: 'Crystal clear sound without the wires.', image: '/assets/products/wireless_earbuds.png' },
  { name: 'Fast Wireless Charger', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4dQO28H', benefit: 'Power up without the cable clutter.', image: '/assets/products/3-in-1-charging-station.png' },
  { name: 'Power Bank', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4tCD5w5', benefit: 'Stay charged wherever you are.', image: '/assets/products/power-bank.png' },
  { name: 'Bluetooth Speaker', category: 'electronics-accessories', badge: 'Top Pick', url: 'https://amzn.to/4mbyWMO', benefit: 'Take your music anywhere you go.', image: '/assets/products/bluetooth-speaker.png' },
  { name: 'Smart LED Strip Lights', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/41hOMvW', benefit: 'Ambiance for every room in your home.', image: '/assets/products/smart-led-strip-lights.png' },
  { name: 'Car Phone Mount', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/4teXqb3', benefit: 'Hands-free safety on every drive.', image: '/assets/products/magnetic-phone-mount.png' },
  { name: 'Charging Hub', category: 'electronics-accessories', badge: 'Trending Now', url: 'https://amzn.to/4mkil9Y', benefit: 'One stop for all your device charging.', image: '/assets/products/carbon-fiber-charging-hub.jpg' },
  { name: 'Mini Projector', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/4sgFueI', benefit: 'Cinema experience right in your room.', image: '/assets/products/mini-projector.png' },
  { name: 'Laptop Stand', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/41PFXcP', benefit: 'Ergonomic lift for a better workspace.', image: '/assets/products/laptop-stand.png' },
  { name: 'Phone Stand', category: 'electronics-accessories', badge: "Editor's Choice", url: 'https://amzn.to/47KCkbN', benefit: 'Keep your device at the perfect angle.', image: '/assets/products/magnetic-phone-mount.png' },

  // SPORTS
  { name: 'Resistance Bands', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/4csnjxL', benefit: 'Full body workout, anytime, anywhere.', image: '/assets/products/resistance-band-set.png' },
  { name: 'Massage Gun', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/4t2EnR8', benefit: 'Recovery like the pros, at home.', image: '/assets/products/massage-gun.png' },
  { name: 'Yoga Mat', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/47KcdSc', benefit: 'Premium grip and cushion for every flow.', image: '/assets/products/yoga-mat.png' },
  { name: 'Adjustable Dumbbells', category: 'sports-fitness', badge: 'Top Pick', url: 'https://amzn.to/4vggOWa', benefit: 'Compact home gym in one pair.', image: '/assets/products/adjustable-dumbbells.png' },
  { name: 'Ab Roller', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/3OpiNHd', benefit: 'Build core strength with every rep.', image: '/assets/products/ab-roller.png' },
  { name: 'Jump Rope', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/4bUqYV0', benefit: 'High-intensity cardio in a small package.', image: '/assets/products/weighted-jump-rope.png' },
  { name: 'Foam Roller', category: 'sports-fitness', badge: 'Trending Now', url: 'https://amzn.to/3PLBzJp', benefit: 'Release muscle tension and improve flow.', image: '/assets/products/foam-roller.png' },
  { name: 'Push-Up Board', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/4trnFKQ', benefit: 'Target specific muscle groups with ease.', image: '/assets/products/push-up-board.png' },
  { name: 'Gym Gloves', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/4cbGYAM', benefit: 'Protect your hands and improve grip.', image: '/assets/products/gym-gloves.png' },
  { name: 'Water Bottle', category: 'sports-fitness', badge: "Editor's Choice", url: 'https://amzn.to/41MUm9M', benefit: 'Stay hydrated with a sleek design.', image: '/assets/products/insulated-water-bottle.png' }
];

const categories = [
  { id: 1, name: 'Home & Kitchen', slug: 'home-kitchen', image: '/assets/editorial_v3/cat_home.png' },
  { id: 2, name: 'Beauty & Personal Care', slug: 'beauty-personal-care', image: '/assets/editorial_v3/cat_beauty.png' },
  { id: 3, name: 'Health & Wellness', slug: 'health-wellness', image: '/assets/editorial_v3/cat_health.png' },
  { id: 4, name: 'Pet Supplies', slug: 'pet-supplies', image: '/assets/editorial_v3/cat_pets.png' },
  { id: 5, name: 'Baby & Kids Essentials', slug: 'baby-kids-essentials', image: '/assets/editorial_v3/cat_kids.png' },
  { id: 6, name: 'Electronics & Accessories', slug: 'electronics-accessories', image: '/assets/editorial_v3/cat_tech.png' },
  { id: 7, name: 'Sports & Fitness', slug: 'sports-fitness', image: '/assets/editorial_v3/cat_garden.png' }
];

// Map products to the format expected by the frontend
const mappedProducts = products.map((p, index) => ({
  id: index + 1,
  name: p.name,
  slug: p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  description: p.benefit,
  shortDescription: p.benefit,
  price: 0,
  image: p.image,
  badge: p.badge,
  affiliateUrl: p.url,
  ratingValue: 4.8,
  ratingText: '4.8/5 Recommended',
  keyBenefits: [p.benefit],
  category: {
    slug: p.category,
    name: categories.find(c => c.slug === p.category)?.name || ''
  }
}));

const testimonials = [
  { id: 1, name: 'Sarah J.', location: 'New York, USA', quote: 'Absolutely love the quality!', text: 'The curated selection is amazing. Everything I bought exceeded my expectations.', region: 'us', rating: 5, isActive: 1, sortOrder: 1 },
  { id: 2, name: 'Ahmed K.', location: 'Dubai, UAE', quote: 'Fast delivery and great service.', text: 'MRT International is my go-to for unique home finds. The shipping to Dubai was incredibly fast.', region: 'ae', rating: 5, isActive: 1, sortOrder: 2 },
  { id: 3, name: 'Michael R.', location: 'London, UK', quote: 'Highly recommended.', text: 'Professional and reliable. The products are exactly as described and the support team is very helpful.', region: 'uk', rating: 4, isActive: 1, sortOrder: 3 },
  { id: 4, name: 'Elena V.', location: 'Milan, Italy', quote: 'Elegance in every detail.', text: 'I purchased several kitchen items and they are both functional and beautiful. Highly recommend!', region: 'eu', rating: 5, isActive: 1, sortOrder: 4 },
  { id: 5, name: 'David L.', location: 'Singapore', quote: 'The best tech gadgets.', text: 'Found some really unique electronics here that I couldn’t find anywhere else. Great quality.', region: 'asia', rating: 5, isActive: 1, sortOrder: 5 },
  { id: 6, name: 'Sophie M.', location: 'Paris, France', quote: 'Chic and useful.', text: 'The beauty products are top-notch. My skin has never looked better since using the facial brush.', region: 'eu', rating: 5, isActive: 1, sortOrder: 6 },
  { id: 7, name: 'James W.', location: 'Sydney, Australia', quote: 'Reliable global shipping.', text: 'Ordering from Australia was easy. No issues with customs and the product arrived in perfect condition.', region: 'au', rating: 4, isActive: 1, sortOrder: 7 },
  { id: 8, name: 'Priya S.', location: 'Mumbai, India', quote: 'Quality you can trust.', text: 'The pet supplies are very durable. My dog loves the interactive toys!', region: 'in', rating: 5, isActive: 1, sortOrder: 8 }
];

const failoverData = {
  products: mappedProducts,
  categories: categories,
  testimonials: testimonials,
  blog: []
};

const outputPath = path.join(process.cwd(), 'public', 'api', 'products.json');
fs.writeFileSync(outputPath, JSON.stringify(failoverData, null, 2));

console.log(`✅ Fail-over JSON generated with ${mappedProducts.length} products at ${outputPath}`);
