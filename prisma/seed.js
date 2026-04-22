import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'dev.db');

const prisma = new PrismaClient();

const categories = [
  { slug: 'home-kitchen', name: 'Home & Kitchen', image: '/assets/categories/home-kitchen.png', theme: { primary: '#914d00', secondary: '#f28c28', title: 'Home & Kitchen', subtitle: 'Discover the most useful, trending, and top-rated home & kitchen products carefully selected for quality and value.', seoTitle: 'Top 10 Best Home & Kitchen Products (2026)', seoIntro: 'Discover the most useful, trending, and top-rated home & kitchen products carefully selected for quality and value.' } },
  { slug: 'beauty-personal-care', name: 'Beauty & Personal Care', image: '/assets/categories/beauty-skincare.png', theme: { primary: '#701b2f', secondary: '#ffb2bd', title: 'Beauty & Personal Care', subtitle: 'Discover the most useful, trending, and top-rated beauty & personal care products carefully selected for quality and value.', seoTitle: 'Top 10 Best Beauty & Personal Care Products (2026)', seoIntro: 'Discover the most useful, trending, and top-rated beauty & personal care products carefully selected for quality and value.' } },
  { slug: 'health-wellness', name: 'Health & Wellness', image: '/assets/categories/health-wellness.png', theme: { primary: '#006a6a', secondary: '#00cfcf', title: 'Health & Wellness', subtitle: 'Discover the most useful, trending, and top-rated health & wellness products carefully selected for quality and value.', seoTitle: 'Top 10 Best Health & Wellness Products (2026)', seoIntro: 'Discover the most useful, trending, and top-rated health & wellness products carefully selected for quality and value.' } },
  { slug: 'pet-supplies', name: 'Pet Supplies', image: '/assets/categories/pet-supplies.png', theme: { primary: '#3a6a00', secondary: '#8ce33a', title: 'Pet Supplies', subtitle: 'Discover the most useful, trending, and top-rated pet supplies carefully selected for quality and value.', seoTitle: 'Top 10 Best Pet Supplies Products (2026)', seoIntro: 'Discover the most useful, trending, and top-rated pet supplies carefully selected for quality and value.' } },
  { slug: 'baby-kids-essentials', name: 'Baby & Kids Essentials', image: '/assets/categories/baby-products.png', theme: { primary: '#004a77', secondary: '#7fbaff', title: 'Baby & Kids Essentials', subtitle: 'Discover the most useful, trending, and top-rated baby & kids essentials carefully selected for quality and value.', seoTitle: 'Top 10 Best Baby & Kids Essentials Products (2026)', seoIntro: 'Discover the most useful, trending, and top-rated baby & kids essentials carefully selected for quality and value.' } },
  { slug: 'electronics-accessories', name: 'Electronics & Accessories', image: '/assets/categories/electronics.png', theme: { primary: '#1f1b17', secondary: '#bf8f00', title: 'Electronics & Accessories', subtitle: 'Discover the most useful, trending, and top-rated electronics & accessories carefully selected for quality and value.', seoTitle: 'Top 10 Best Electronics & Accessories Products (2026)', seoIntro: 'Discover the most useful, trending, and top-rated electronics & accessories carefully selected for quality and value.' } },
  { slug: 'sports-fitness', name: 'Sports & Fitness', image: '/assets/categories/sports-fitness.png', theme: { primary: '#006e2a', secondary: '#55f985', title: 'Sports & Fitness', subtitle: 'Discover the most useful, trending, and top-rated sports & fitness products carefully selected for quality and value.', seoTitle: 'Top 10 Best Sports & Fitness Products (2026)', seoIntro: 'Discover the most useful, trending, and top-rated sports & fitness products carefully selected for quality and value.' } },
];

const products = [
  // --- HOME & KITCHEN ---
  { name: 'Vegetable Chopper', category: 'home-kitchen', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/4mgjKOK', shortBenefit: 'A practical kitchen tool designed to make chopping faster, easier, and more convenient.', keyBenefits: ['Saves time in meal preparation', 'Easy to use and clean', 'Compact and kitchen-friendly design'], image: '/assets/products/vegetable-chopper.png', price: 29.99, ratingValue: 4.8 },
  { name: 'Electric Spin Scrubber', category: 'home-kitchen', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/4vayOS5', shortBenefit: 'Powerful motorized cleaning brush for spotless surfaces without the scrubbing effort.', keyBenefits: ['Removes tough stains instantly', 'Includes multiple brush heads', 'Rechargeable and cordless'], image: '/assets/products/spin-scrubber.png', price: 39.99, ratingValue: 4.7 },
  { name: 'Vacuum Storage Bags', category: 'home-kitchen', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/3NQUaDg', shortBenefit: 'Maximise your closet space and protect seasonal clothing effectively.', keyBenefits: ['Saves up to 80% space', 'Airtight and waterproof protection', 'Durable and reusable material'], image: '/assets/products/vacuum-bags.png', price: 19.99, ratingValue: 4.8 },
  { name: 'Air Fryer Accessories Set', category: 'home-kitchen', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/47J01RH', shortBenefit: 'Expand your air frying capabilities with this versatile multi-piece accessory kit.', keyBenefits: ['Fits most standard air fryers', 'Non-stick and dishwasher safe', 'Includes baking pans and racks'], image: '/assets/products/air-fryer-accessories.png', price: 24.99, ratingValue: 4.9 },
  { name: 'Oil Spray Bottle', category: 'home-kitchen', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/3OmAkQo', shortBenefit: 'Perfectly mist oil for healthier cooking and precise portion control.', keyBenefits: ['Food-grade glass design', 'Even and fine mist spray', 'Great for air frying and salads'], image: '/assets/products/oil-spray-bottle.png', price: 14.99, ratingValue: 4.6 },
  { name: 'Smart Plug', category: 'home-kitchen', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/3PU7kzZ', shortBenefit: 'Control your home appliances remotely with voice or app commands.', keyBenefits: ['Compatible with Alexa/Google', 'Set automated schedules', 'Compact space-saving design'], image: '/assets/products/smart-plug.png', price: 12.99, ratingValue: 4.7 },
  { name: 'LED Motion Sensor Lights', category: 'home-kitchen', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/41hGtjS', shortBenefit: 'Bright, automatic illumination for closets, cabinets, and hallways.', keyBenefits: ['Auto-activation via motion', 'Easy magnetic installation', 'Rechargeable battery powered'], image: '/assets/products/motion-lights.png', price: 21.99, ratingValue: 4.8 },
  { name: 'Microfiber Cleaning Cloth Pack', category: 'home-kitchen', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/4cdP3Fi', shortBenefit: 'Ultra-absorbent and lint-free cloths for premium surface cleaning.', keyBenefits: ['Scratch-free on all surfaces', 'Highly absorbent material', 'Machine washable and durable'], image: '/assets/products/microfiber-cloths.png', price: 15.99, ratingValue: 4.9 },
  { name: 'Digital Kitchen Scale', category: 'home-kitchen', badge: "Editor's Choice", affiliateUrl: 'https://amzn.to/3PSpaDq', shortBenefit: 'High-precision sensor system for accurate baking and portioning.', keyBenefits: ['Accurate to the gram', 'Sleek stainless steel finish', 'Easy-to-read LCD display'], image: '/assets/products/kitchen-scale.png', price: 18.99, ratingValue: 4.8 },
  { name: 'Under Sink Organizer', category: 'home-kitchen', badge: "Editor's Choice", affiliateUrl: 'https://amzn.to/3NQUTEu', shortBenefit: 'Maximize cabinet storage space with a sliding two-tier shelf system.', keyBenefits: ['Sliding drawer access', 'Sturdy and rust-resistant', 'Quick tool-free assembly'], image: '/assets/products/under-sink-organizer.png', price: 29.99, ratingValue: 4.7 },

  // --- BEAUTY & PERSONAL CARE ---
  { name: 'Ice Face Roller', category: 'beauty-personal-care', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/4sj2ytg', shortBenefit: 'Instantly de-puff and revitalize your skin with cooling facial massage therapy.', keyBenefits: ['Reduces morning puffiness', 'Soothes inflamed skin', 'Ergonomic handle design'], image: '/assets/products/ice_face_roller.png', price: 12.99, ratingValue: 4.7 },
  { name: 'Facial Cleansing Brush', category: 'beauty-personal-care', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/4dwEOOH', shortBenefit: 'Deeply cleanses pores and removes makeup residue for a radiant complexion.', keyBenefits: ['Ultra-soft silicone bristles', 'Waterproof for shower use', 'Multiple vibration modes'], image: '/assets/products/sonic-facial-cleansing-brush.jpg', price: 24.99, ratingValue: 4.8 },
  { name: 'Hair Straightener Brush', category: 'beauty-personal-care', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/48jgyvP', shortBenefit: 'Smooth and straighten your hair effortlessly while brushing.', keyBenefits: ['Anti-scald safety design', 'Fast PTC heating tech', 'Leaves hair silky and shiny'], image: '/assets/products/straightener-brush.png', price: 34.99, ratingValue: 4.7 },
  { name: 'LED Makeup Mirror', category: 'beauty-personal-care', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/4vfzipZ', shortBenefit: 'Flawless makeup application with adjustable and natural LED lighting.', keyBenefits: ['Dimmable daylight LEDs', 'Smart touch controls', 'Adjustable viewing angles'], image: '/assets/products/led-mirror.png', price: 27.99, ratingValue: 4.9 },
  { name: 'Heatless Hair Curlers', category: 'beauty-personal-care', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/4migCSr', shortBenefit: 'Achieve stunning curls overnight without damaging your hair with heat.', keyBenefits: ['Zero heat damage protection', 'Comfortable to sleep in', 'Includes silk scrunchies'], image: '/assets/products/heatless-curlers.png', price: 15.99, ratingValue: 4.6 },
  { name: 'Blackhead Remover Vacuum', category: 'beauty-personal-care', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/4ve7ylD', shortBenefit: 'Extract impurities and clear clogged pores for smoother, clearer skin.', keyBenefits: ['Powerful vacuum suction', 'Multiple suction heads', 'USB rechargeable'], image: '/assets/products/blackhead-vacuum.png', price: 22.99, ratingValue: 4.5 },
  { name: 'Electric Toothbrush', category: 'beauty-personal-care', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/4vaA3AJ', shortBenefit: 'Professional sonic cleaning for whiter teeth and healthier gums.', keyBenefits: ['40,000 micro-brushes per min', 'Smart timer functionality', 'Long-lasting battery life'], image: '/assets/products/electric-toothbrush.png', price: 35.99, ratingValue: 4.8 },
  { name: 'Electric Eyebrow Trimmer', category: 'beauty-personal-care', badge: "Editor's Choice", affiliateUrl: 'https://amzn.to/4seAiYR', shortBenefit: 'Painlessly sculpt and shape your eyebrows with precision.', keyBenefits: ['Gentle on all skin types', 'Built-in LED light', 'Compact lipstick design'], image: '/assets/products/eyebrow-trimmer.png', price: 16.99, ratingValue: 4.7 },
  { name: 'Makeup Brush Set', category: 'beauty-personal-care', badge: "Editor's Choice", affiliateUrl: 'https://amzn.to/4sW28dh', shortBenefit: 'Premium synthetic brushes for a flawless and streak-free cosmetic application.', keyBenefits: ['Cruelty-free soft bristles', 'Includes all essential brushes', 'Durable wooden handles'], image: '/assets/products/brush-set.png', price: 21.99, ratingValue: 4.8 },
  { name: 'Cosmetic Organizer', category: 'beauty-personal-care', badge: "Editor's Choice", affiliateUrl: 'https://amzn.to/4tytGFH', shortBenefit: 'Keep your vanity clutter-free with a stylish clear acrylic display.', keyBenefits: ['360-degree rotating base', 'Adjustable shelf heights', 'High-capacity storage'], image: '/assets/products/cosmetic-organizer.png', price: 28.99, ratingValue: 4.9 },

  // --- HEALTH & WELLNESS ---
  { name: 'Neck & Shoulder Massager', category: 'health-wellness', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/4bUeFbj', shortBenefit: 'Relieve deep tissue tension with 3D shiatsu kneading and soothing heat.', keyBenefits: ['Deep kneading massage nodes', 'Optional heat therapy', 'Ergonomic armrest straps'], image: '/assets/products/neck-massager.png', price: 45.99, ratingValue: 4.8 },
  { name: 'Posture Corrector', category: 'health-wellness', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/4mfhIhB', shortBenefit: 'Train your spine and alleviate back pain with comfortable, discreet alignment.', keyBenefits: ['Invisible under clothing', 'Breathable and adjustable', 'Relieves chronic discomfort'], image: '/assets/products/posture-corrector.png', price: 18.99, ratingValue: 4.6 },
  { name: 'Massage Gun', category: 'health-wellness', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/41iIMTD', shortBenefit: 'Accelerate muscle recovery with high-intensity percussive therapy.', keyBenefits: ['Quiet glide technology', 'Interchangeable massage heads', 'Long-lasting battery'], image: '/assets/products/massage_gun.png', price: 65.99, ratingValue: 4.9 },
  { name: 'Memory Foam Pillow', category: 'health-wellness', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/4sP2liu', shortBenefit: 'Ergonomic neck support for a deeper, more restful night of sleep.', keyBenefits: ['Aligns the spine naturally', 'Cooling gel infusion', 'Hypoallergenic cover'], image: '/assets/products/memory-foam-pillow.png', price: 39.99, ratingValue: 4.8 },
  { name: 'Aromatherapy Diffuser', category: 'health-wellness', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/47JWi6m', shortBenefit: 'Create a calming spa environment with ultrasonic essential oil misting.', keyBenefits: ['Whisper-quiet operation', 'Multiple led light modes', 'Auto shut-off safety'], image: '/assets/products/diffuser.png', price: 29.99, ratingValue: 4.7 },
  { name: 'Foam Roller', category: 'health-wellness', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/4vee8bR', shortBenefit: 'Release myofascial tightness and improve flexibility before and after workouts.', keyBenefits: ['High-density EVA foam', 'Textured grip surface', 'Lightweight and portable'], image: '/assets/products/foam-roller-health.png', price: 22.99, ratingValue: 4.8 },
  { name: 'Weighted Blanket', category: 'health-wellness', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/4cuuq8Y', shortBenefit: 'Experience the calming sensation of deep touch pressure for better rest.', keyBenefits: ['Reduces sleep anxiety', 'Premium glass bead filling', 'Breathable cotton fabric'], image: '/assets/products/weighted-blanket.png', price: 49.99, ratingValue: 4.9 },
  { name: 'Eye Massager', category: 'health-wellness', badge: "Editor's Choice", affiliateUrl: 'https://amzn.to/4sjeTgW', shortBenefit: 'Soothe eye strain and headaches with gentle compression and heat.', keyBenefits: ['Warm compression therapy', 'Built-in bluetooth music', 'Foldable and portable'], image: '/assets/products/eye-massager.png', price: 55.99, ratingValue: 4.8 },
  { name: 'White Noise Machine', category: 'health-wellness', badge: "Editor's Choice", affiliateUrl: 'https://amzn.to/3PWkxbo', shortBenefit: 'Block out disruptive sounds and create a peaceful sleep environment.', keyBenefits: ['Multiple soothing sounds', 'Adjustable volume control', 'Compact travel size'], image: '/assets/products/white-noise-machine.png', price: 24.99, ratingValue: 4.7 },
  { name: 'Lumbar Support Cushion', category: 'health-wellness', badge: "Editor's Choice", affiliateUrl: 'https://amzn.to/4vdRQXB', shortBenefit: 'Maintain proper sitting posture and relieve lower back pressure at your desk.', keyBenefits: ['Premium memory foam core', 'Breathable mesh cover', 'Adjustable chair straps'], image: '/assets/products/lumbar-cushion.png', price: 27.99, ratingValue: 4.8 },

  // --- PET SUPPLIES ---
  { name: 'Pet Hair Remover Roller', category: 'pet-supplies', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/4sCm3NL', shortBenefit: 'Instantly clean fur from furniture and clothing with a simple back-and-forth motion.', keyBenefits: ['No adhesive tape needed', 'Reusable and durable', 'Easy-empty dust receptacle'], image: '/assets/products/pet-hair-roller.png', price: 18.99, ratingValue: 4.8 },
  { name: 'Self-Cleaning Grooming Brush', category: 'pet-supplies', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/4mfdKWt', shortBenefit: 'Effortlessly detangle coats and push a button to release collected fur.', keyBenefits: ['Gentle on pet skin', 'One-click cleaning button', 'Comfortable ergonomic grip'], image: '/assets/products/grooming-brush.png', price: 16.99, ratingValue: 4.7 },
  { name: 'Automatic Pet Feeder', category: 'pet-supplies', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/41iJvEl', shortBenefit: 'Ensure your pets never miss a meal with scheduled, portion-controlled feeding.', keyBenefits: ['Customizable feeding schedules', 'Voice recording feature', 'Anti-clog dispensing'], image: '/assets/products/auto-feeder.png', price: 59.99, ratingValue: 4.8 },
  { name: 'Pet Water Fountain', category: 'pet-supplies', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/3PSASxU', shortBenefit: 'Encourage healthier hydration with a continuous flow of filtered, fresh water.', keyBenefits: ['Multi-layer carbon filter', 'Ultra-quiet water pump', 'Large capacity basin'], image: '/assets/products/water-fountain.png', price: 34.99, ratingValue: 4.9 },
  { name: 'Interactive Dog Toy', category: 'pet-supplies', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/4mfmbAR', shortBenefit: 'Keep your dog mentally stimulated and physically active for hours.', keyBenefits: ['Unpredictable bounce patterns', 'Durable chew-resistant build', 'Treat-dispensing design'], image: '/assets/products/dog-toy.png', price: 14.99, ratingValue: 4.6 },
  { name: 'Cat Laser Toy', category: 'pet-supplies', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/47Hm0bJ', shortBenefit: 'Automated laser patterns to trigger your cat\'s natural hunting instincts.', keyBenefits: ['Randomized movement paths', 'Auto shut-off timer', 'Quiet motor operation'], image: '/assets/products/laser-toy.png', price: 21.99, ratingValue: 4.7 },
  { name: 'Portable Pet Water Bottle', category: 'pet-supplies', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/4drRB4S', shortBenefit: 'The perfect leak-proof travel companion for hydrating pets on the go.', keyBenefits: ['One-hand operation', 'Built-in drinking bowl', 'Secure lock key'], image: '/assets/products/water-bottle.png', price: 15.99, ratingValue: 4.8 },
  { name: 'Slow Feeder Bowl', category: 'pet-supplies', badge: "Editor's Choice", affiliateUrl: 'https://amzn.to/4mbNWue', shortBenefit: 'Prevent bloating and choking by slowing down rapid eating habits.', keyBenefits: ['Promotes healthy digestion', 'Non-slip rubber base', 'Food-safe bowl material'], image: '/assets/products/slow-feeder.png', price: 12.99, ratingValue: 4.8 },
  { name: 'Pet Nail Clipper', category: 'pet-supplies', badge: "Editor's Choice", affiliateUrl: 'https://amzn.to/4sRqXHj', shortBenefit: 'Safe and precise trimming with a built-in safety guard to prevent over-cutting.', keyBenefits: ['Sharp stainless steel blades', 'Safety stop feature', 'Comfort non-slip handles'], image: '/assets/products/nail-clipper.png', price: 13.99, ratingValue: 4.7 },
  { name: 'Pet Bed', category: 'pet-supplies', badge: "Editor's Choice", affiliateUrl: 'https://amzn.to/4soPJh3', shortBenefit: 'Ultra-soft calming bed designed to relieve pet anxiety and provide joint support.', keyBenefits: ['Plush faux fur finish', 'Raised orthopaedic rim', 'Machine washable cover'], image: '/assets/products/pet-bed.png', price: 42.99, ratingValue: 4.9 },

  // --- BABY & KIDS ESSENTIALS ---
  { name: 'Baby Nail Trimmer', category: 'baby-kids-essentials', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/4sgYlpK', shortBenefit: 'Safely and quietly file soft baby nails without accidental skin clipping.', keyBenefits: ['Whisper-quiet motor', 'Built-in LED front light', 'Multiple filing pads'], image: '/assets/products/baby-nail-trimmer.png', price: 19.99, ratingValue: 4.9 },
  { name: 'Silicone Feeding Set', category: 'baby-kids-essentials', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/48z3NNN', shortBenefit: 'Complete, mess-free beginning set for introducing solid foods to infants.', keyBenefits: ['Strong suction bowl base', '100% food-grade silicone', 'Dishwasher safe build'], image: '/assets/products/silicone-feeding-set.png', price: 29.99, ratingValue: 4.8 },
  { name: 'Baby Diaper Bag', category: 'baby-kids-essentials', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/3OkGAIp', shortBenefit: 'Stylish, high-capacity backpack with organized compartments for parenting on the go.', keyBenefits: ['Insulated bottle pockets', 'Waterproof exterior fabric', 'Stroller strap included'], image: '/assets/products/diaper-bag.png', price: 45.99, ratingValue: 4.9 },
  { name: 'Portable Changing Mat', category: 'baby-kids-essentials', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/4c8AHWJ', shortBenefit: 'A compact and hygienic portable station for quick diaper changes anywhere.', keyBenefits: ['Wipe-clean surface layer', 'Foldable compact design', 'Built-in wipes pocket'], image: '/assets/products/changing-mat.png', price: 22.99, ratingValue: 4.8 },
  { name: 'Cabinet Safety Locks', category: 'baby-kids-essentials', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/4t1fyF2', shortBenefit: 'Childproof your home with invisible, damage-free magnetic cabinet locks.', keyBenefits: ['Installs with 3M adhesive', 'Invisible from the outside', 'Keeps hazardous items secure'], image: '/assets/products/cabinet-locks.png', price: 16.99, ratingValue: 4.7 },
  { name: 'Baby Bottle Warmer', category: 'baby-kids-essentials', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/4sP3vdQ', shortBenefit: 'Fast, even heating to safely prepare breastmilk or formula without hot spots.', keyBenefits: ['Preserves milk nutrients', 'Fits most bottle sizes', 'Auto shut-off feature'], image: '/assets/products/bottle-warmer.png', price: 34.99, ratingValue: 4.8 },
  { name: 'Baby Bath Support', category: 'baby-kids-essentials', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/4ve9vOZ', shortBenefit: 'Ergonomic mesh support that cradles infants securely during bath time.', keyBenefits: ['Soft anti-slip material', 'Quick-drying mesh frame', 'Fits safely in adult tubs'], image: '/assets/products/bath-support.png', price: 26.99, ratingValue: 4.8 },
  { name: 'Stroller Organizer', category: 'baby-kids-essentials', badge: "Editor's Choice", affiliateUrl: 'https://amzn.to/4cuvnhy', shortBenefit: 'Keep your phone, keys, and drinks perfectly accessible while pushing the stroller.', keyBenefits: ['Universal fit straps', 'Insulated cup holders', 'Detachable wristlet pouch'], image: '/assets/products/stroller-organizer.png', price: 24.99, ratingValue: 4.7 },
  { name: 'Baby Toy Set', category: 'baby-kids-essentials', badge: "Editor's Choice", affiliateUrl: 'https://amzn.to/3PTsPkm', shortBenefit: 'Textured sensory toys designed to stimulate early cognitive and motor skills.', keyBenefits: ['BPA-free teething material', 'High-contrast colors', 'Easy for little hands to hold'], image: '/assets/products/baby-toy-set.png', price: 21.99, ratingValue: 4.8 },
  { name: 'Baby Grooming Kit', category: 'baby-kids-essentials', badge: "Editor's Choice", affiliateUrl: 'https://amzn.to/4cbFKFG', shortBenefit: 'The complete essential care kit to keep your infant groomed and healthy.', keyBenefits: ['Includes nasal aspirator', 'Soft bristle hairbrush', 'Travel-friendly storage case'], image: '/assets/products/grooming-kit.png', price: 18.99, ratingValue: 4.7 },

  // --- ELECTRONICS & ACCESSORIES ---
  { name: 'Wireless Earbuds', category: 'electronics-accessories', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/4ccwbqa', shortBenefit: 'Crystal-clear sound with active noise cancellation and an ergonomic fit.', keyBenefits: ['Active Noise Cancellation', '30-hour battery life case', 'Water and sweat resistant'], image: '/assets/products/wireless-earbuds.png', price: 49.99, ratingValue: 4.8 },
  { name: 'Fast Wireless Charger', category: 'electronics-accessories', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/4dQO28H', shortBenefit: 'Rapid 15W charging stand that powers your devices effortlessly and safely.', keyBenefits: ['Case-friendly charging', 'Overheat protection tech', 'Supports landscape viewing'], image: '/assets/products/wireless-charger.png', price: 29.99, ratingValue: 4.7 },
  { name: 'Power Bank', category: 'electronics-accessories', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/4tCD5w5', shortBenefit: 'High-capacity portable charger to keep your devices running all day long.', keyBenefits: ['Massive 20000mAh capacity', 'Dual USB fast charge ports', 'Slim and pocket-friendly'], image: '/assets/products/power-bank.png', price: 39.99, ratingValue: 4.8 },
  { name: 'Bluetooth Speaker', category: 'electronics-accessories', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/4mbyWMO', shortBenefit: 'Powerful 360-degree audio with deep bass in a rugged, waterproof shell.', keyBenefits: ['IPX7 waterproof rating', '24-hour playtime', 'Punchy bass radiators'], image: '/assets/products/bluetooth-speaker.png', price: 45.99, ratingValue: 4.9 },
  { name: 'Smart LED Strip Lights', category: 'electronics-accessories', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/41hOMvW', shortBenefit: 'Transform your room with multi-colored, app-controlled ambient lighting.', keyBenefits: ['Music sync capabilities', 'App and remote control', '16 million custom colors'], image: '/assets/products/led-strips.png', price: 24.99, ratingValue: 4.7 },
  { name: 'Car Phone Mount', category: 'electronics-accessories', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/4teXqb3', shortBenefit: 'Secure and ultra-stable magnetic mount for hands-free driving navigation.', keyBenefits: ['Powerful magnetic hold', '360-degree rotation joint', 'Easy air vent installation'], image: '/assets/products/car-mount.png', price: 19.99, ratingValue: 4.8 },
  { name: 'Charging Hub', category: 'electronics-accessories', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/4mkil9Y', shortBenefit: 'Consolidate all your cords into one sleek, 6-port desktop charging station.', keyBenefits: ['Smart output recognition', 'Compact desktop footprint', 'Charges multiple items fast'], image: '/assets/products/charging-hub.png', price: 34.99, ratingValue: 4.8 },
  { name: 'Mini Projector', category: 'electronics-accessories', badge: "Editor's Choice", affiliateUrl: 'https://amzn.to/4sgFueI', shortBenefit: 'Bring the cinema experience anywhere with this portable, HD-capable projector.', keyBenefits: ['Supports 1080p resolution', 'Connects via HDMI/USB', 'Built-in dual speakers'], image: '/assets/products/mini-projector.png', price: 69.99, ratingValue: 4.7 },
  { name: 'Laptop Stand', category: 'electronics-accessories', badge: "Editor's Choice", affiliateUrl: 'https://amzn.to/41PFXcP', shortBenefit: 'Elevate your screen to eye level to improve posture and laptop airflow.', keyBenefits: ['Ergonomic height adjustment', 'Premium aluminum alloy', 'Prevents overheating'], image: '/assets/products/laptop-stand.png', price: 32.99, ratingValue: 4.9 },
  { name: 'Phone Stand', category: 'electronics-accessories', badge: "Editor's Choice", affiliateUrl: 'https://amzn.to/47KCkbN', shortBenefit: 'A sturdy, fully adjustable desktop stand for video calls and media viewing.', keyBenefits: ['Angle and height adjustable', 'Anti-slip silicone pads', 'Foldable travel design'], image: '/assets/products/phone-stand.png', price: 14.99, ratingValue: 4.8 },

  // --- SPORTS & FITNESS ---
  { name: 'Resistance Bands', category: 'sports-fitness', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/4csnjxL', shortBenefit: 'A complete home gym in a bag, perfect for building strength and toning.', keyBenefits: ['Stackable up to 150 lbs', 'Made from natural latex', 'Includes handles and anchors'], image: '/assets/products/resistance_bands.png', price: 29.99, ratingValue: 4.8 },
  { name: 'Massage Gun', category: 'sports-fitness', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/4t2EnR8', shortBenefit: 'Professional percussive therapy to alleviate muscle soreness after heavy lifting.', keyBenefits: ['Up to 3200 percussions/min', 'Ultra-quiet brushless motor', 'Includes 6 massage heads'], image: '/assets/products/massage_gun.png', price: 59.99, ratingValue: 4.9 },
  { name: 'Yoga Mat', category: 'sports-fitness', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/47KcdSc', shortBenefit: 'Eco-friendly, extra-thick cushioning for yoga, pilates, and floor exercises.', keyBenefits: ['Non-slip textured surface', 'Alignment body lines', 'Tear-resistant TPE material'], image: '/assets/products/yoga-mat.png', price: 35.99, ratingValue: 4.8 },
  { name: 'Adjustable Dumbbells', category: 'sports-fitness', badge: 'Top Pick', affiliateUrl: 'https://amzn.to/4vggOWa', shortBenefit: 'Replace an entire rack of weights with one space-saving, dial-adjust system.', keyBenefits: ['Changes weight in seconds', 'Compact footprint design', 'Durable metal plates'], image: '/assets/products/adjustable-dumbbells.png', price: 129.99, ratingValue: 4.9 },
  { name: 'Ab Roller', category: 'sports-fitness', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/3OpiNHd', shortBenefit: 'Sculpt your core and build stability with this ultra-wide, non-skid ab wheel.', keyBenefits: ['Ultra-wide stable wheel', 'Ergonomic padded handles', 'Includes knee pad'], image: '/assets/products/ab-roller.png', price: 24.99, ratingValue: 4.7 },
  { name: 'Jump Rope', category: 'sports-fitness', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/4bUqYV0', shortBenefit: 'Blast calories and improve cardio endurance with a tangle-free speed rope.', keyBenefits: ['Adjustable steel wire cable', 'Smooth ball bearings', 'Comfortable memory foam grips'], image: '/assets/products/jump-rope.png', price: 12.99, ratingValue: 4.6 },
  { name: 'Foam Roller', category: 'sports-fitness', badge: 'Trending Now', affiliateUrl: 'https://amzn.to/3PLBzJp', shortBenefit: 'Deep tissue massage to speed up recovery and increase muscle flexibility.', keyBenefits: ['High-density EVA foam', 'Firm grid texture', 'Lightweight and durable'], image: '/assets/products/foam-roller-sports.png', price: 21.99, ratingValue: 4.8 },
  { name: 'Push-Up Board', category: 'sports-fitness', badge: "Editor's Choice", affiliateUrl: 'https://amzn.to/4trnFKQ', shortBenefit: 'Maximize your chest, shoulder, and triceps with color-coded training zones.', keyBenefits: ['Color-coded muscle targeting', 'Heavy-duty plug-and-press', 'Foldable for easy storage'], image: '/assets/products/push-up-board.png', price: 34.99, ratingValue: 4.8 },
  { name: 'Gym Gloves', category: 'sports-fitness', badge: "Editor's Choice", affiliateUrl: 'https://amzn.to/4cbGYAM', shortBenefit: 'Protect your hands from calluses and improve your grip during heavy lifts.', keyBenefits: ['Integrated wrist wrap support', 'Anti-slip silicone grip', 'Breathable mesh back'], image: '/assets/products/gym-gloves.png', price: 19.99, ratingValue: 4.7 },
  { name: 'Water Bottle', category: 'sports-fitness', badge: "Editor's Choice", affiliateUrl: 'https://amzn.to/41MUm9M', shortBenefit: 'Stay hydrated with a motivational time-marked, large capacity bottle.', keyBenefits: ['BPA-free tritan material', 'Motivational time markers', 'Leak-proof flip lid'], image: '/assets/products/sports-water-bottle.png', price: 16.99, ratingValue: 4.8 },
];

const testimonials = [
  // USA
  { name: 'Michael T.', location: 'Texas, USA', quote: 'Impressed with the Quality', text: 'I wasn’t expecting this level of quality at this price point. Everything arrived in perfect condition. Will definitely order again.', region: 'us', rating: 5, sortOrder: 1 },
  { name: 'Jessica L.', location: 'California, USA', quote: 'Smooth & Reliable Experience', text: 'The ordering process was simple, and the delivery was faster than expected. Great service overall.', region: 'us', rating: 5, sortOrder: 2 },
  { name: 'David R.', location: 'New York, USA', quote: 'Great Online Store', text: 'I’ve tried several online stores, but this one stands out for its professionalism and product selection. Highly recommended.', region: 'us', rating: 5, sortOrder: 3 },
  { name: 'Emily S.', location: 'Florida, USA', quote: 'Excellent Value for Money', text: 'Affordable pricing without compromising on quality. Exactly what I was looking for.', region: 'us', rating: 5, sortOrder: 4 },
  
  // UAE
  { name: 'Ahmed K.', location: 'Abu Dhabi', quote: 'Very Professional Service', text: 'The team was very responsive, and the entire process was handled professionally. Great experience.', region: 'ae', rating: 5, sortOrder: 5 },
  { name: 'Sara M.', location: 'Dubai', quote: 'Fast Delivery & Good Quality', text: 'Product quality exceeded expectations, and delivery was on time. Will recommend to others.', region: 'ae', rating: 5, sortOrder: 6 },
  { name: 'Hassan A.', location: 'Sharjah', quote: 'Reliable & Trustworthy', text: 'Everything was exactly as described. It’s good to see a company that delivers what it promises.', region: 'ae', rating: 5, sortOrder: 7 },
  { name: 'Fatima R.', location: 'Al Ain', quote: 'Seamless Shopping Experience', text: 'Easy to navigate website and smooth checkout process. Very satisfied.', region: 'ae', rating: 5, sortOrder: 8 }
];

async function main() {
  console.log('🌱 Seeding database...');

  // Wipe existing products and categories for a clean global standard sync
  console.log('🗑️ Wiping existing data...');
  await prisma.product.deleteMany({});
  await prisma.categoryTheme.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.testimonial.deleteMany({});
  console.log('✅ Database cleared');

  // Create admin user
  const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 10);
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@mrt.com' },
    update: {},
    create: { email: process.env.ADMIN_EMAIL || 'admin@mrt.com', passwordHash, name: 'Admin', role: 'ADMIN' },
  });
  console.log('✅ Admin user created');

  // Create categories with themes
  const categoryMap = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, image: cat.image },
      create: { 
        slug: cat.slug, name: cat.name, image: cat.image, sortOrder: categories.indexOf(cat),
        theme: { create: { title: cat.theme.title, subtitle: cat.theme.subtitle, primary: cat.theme.primary, secondary: cat.theme.secondary, seoTitle: cat.theme.seoTitle, seoIntro: cat.theme.seoIntro } }
      },
    });
    categoryMap[cat.slug] = created.id;
  }
  console.log(`✅ ${categories.length} categories created`);
  
  // Create products
  let productCount = 0;
  for (const p of products) {
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Math.random().toString(36).substr(2, 5);
    await prisma.product.create({
      data: {
        name: p.name, slug,
        shortBenefit: p.shortBenefit, description: p.shortBenefit,
        price: p.price, image: p.image,
        badge: p.badge,
        ratingValue: p.ratingValue || 4.5,
        categoryId: categoryMap[p.category],
        keyBenefits: JSON.stringify(p.keyBenefits),
        affiliateUrl: p.affiliateUrl,
        isActive: true,
      },
    });
    productCount++;
  }
  console.log(`✅ ${productCount} products created`);

  // Create testimonials
  for (const t of testimonials) {
    await prisma.testimonial.create({ data: t });
  }
  console.log(`✅ ${testimonials.length} testimonials created`);

  console.log('🎉 Database seeded successfully!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
