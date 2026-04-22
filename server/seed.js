import prisma from './db.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🚀 Finalizing mrt International Catalog with Categorical Structures...');

  // Simple clean
  await prisma.review.deleteMany();
  await prisma.comparisonItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.affiliateClick.deleteMany();
  await prisma.product.deleteMany();
  await prisma.categoryTheme.deleteMany();
  await prisma.category.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.user.deleteMany();

  // Admin User
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@mrt.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  const passwordHash = await bcrypt.hash(adminPass, 10);
  await prisma.user.create({ data: { email: adminEmail, passwordHash, name: 'mrt International Admin', role: 'ADMIN' } });

  // 1. Categories
  const categories = [
    { name: 'Home & Kitchen', slug: 'home-kitchen', image: '/assets/categories/home-kitchen.png', sortOrder: 1 },
    { name: 'Beauty & Personal Care', slug: 'beauty-personal-care', image: '/assets/categories/beauty-skincare.png', sortOrder: 2 },
    { name: 'Health & Wellness', slug: 'health-wellness', image: '/assets/categories/health-wellness.png', sortOrder: 3 },
    { name: 'Pet Supplies', slug: 'pet-supplies', image: '/assets/categories/pet-supplies.png', sortOrder: 4 },
    { name: 'Baby & Kids Essentials', slug: 'baby-kids-essentials', image: '/assets/categories/baby-products.png', sortOrder: 5 },
    { name: 'Electronics & Accessories', slug: 'electronics-accessories', image: '/assets/categories/electronics.png', sortOrder: 6 },
    { name: 'Sports & Fitness', slug: 'sports-fitness', image: '/assets/categories/sports-fitness.png', sortOrder: 7 },
  ];

  const catMap = {};
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    catMap[cat.name.trim()] = created.id;
  }

  // 2. Themes (SEO Titles & Intros)
  const themes = [
    { name: 'Home & Kitchen', title: 'Home & Kitchen', seoTitle: 'Top 10 Best Home & Kitchen Products (2026)', seoIntro: 'Discover the most useful, trending, and top-rated home & kitchen products carefully selected for quality and value.' },
    { name: 'Beauty & Personal Care', title: 'Beauty & Personal Care', seoTitle: 'Top 10 Best Beauty & Personal Care Products (2026)', seoIntro: 'Pristine formulas and artisanal tools for a radiant, global aesthetic. Curated for performance and beauty.' },
    { name: 'Health & Wellness', title: 'Health & Wellness', seoTitle: 'Top 10 Best Health & Wellness Products (2026)', seoIntro: 'Advanced recovery tools and wellness essentials designed for vitality and refined personal standards.' },
    { name: 'Pet Supplies', title: 'Pet Supplies', seoTitle: 'Top 10 Best Pet Supplies (2026)', seoIntro: 'Sophisticated gear and essentials for your most loyal companions. Tested for safety and comfort.' },
    { name: 'Baby & Kids Essentials', title: 'Baby & Kids Essentials', seoTitle: 'Top 10 Best Baby & Kids Essentials (2026)', seoIntro: 'Ergonomic designs and safety-first grooming tools for modern parents and their little ones.' },
    { name: 'Electronics & Accessories', title: 'Electronics & Accessories', seoTitle: 'Top 10 Best Electronics & Accessories (2026)', seoIntro: 'Performance-driven digital gear and high-performance accessories for the modern elite tech setup.' },
    { name: 'Sports & Fitness', title: 'Sports & Fitness', seoTitle: 'Top 10 Best Sports & Fitness Products (2026)', seoIntro: 'Professional-grade equipment and support gear selected for peak athletic performance and recovery.' },
  ];

  for (const t of themes) {
    await prisma.categoryTheme.create({
      data: {
        primary: '#914d00', secondary: '#f28c28',
        title: t.title, subtitle: 'Elite Selection',
        seoTitle: t.seoTitle, seoIntro: t.seoIntro,
        categoryId: catMap[t.name.trim()]
      }
    });
  }

  // 3. Image Mapping (Explicit)
  const imageMap = {
    "Hair Straightener Brush": "hair-straightener-brush.png",
    "LED Makeup Mirror": "led-makeup-mirror.png",
    "Heatless Hair Curlers": "heatless-curlers.png",
    "Blackhead Remover Vacuum": "blackhead-remover.png",
    "Electric Eyebrow Trimmer": "eyebrow-trimmer.png",
    "Makeup Brush Set": "makeup-brush-set.png",
    "Cosmetic Organizer": "cosmetic-organizer.png",
    "Memory Foam Pillow": "memory-foam-pillow.png",
    "Foam Roller": "foam-roller.png",
    "Weighted Blanket": "weighted-blanket.png",
    "Eye Massager": "eye-massager.png",
    "White Noise Machine": "white-noise-machine.png",
    "Lumbar Support Cushion": "lumbar-support-cushion.png",
    "Pet Hair Remover Roller": "pet-hair-remover-roller.png",
    "Self-Cleaning Grooming Brush": "self-cleaning-grooming-brush.png",
    "Pet Water Fountain": "pet-water-fountain.png",
    "Interactive Dog Toy": "interactive-dog-toy.png",
    "Cat Laser Toy": "cat-laser-toy.png",
    "Portable Pet Water Bottle": "portable-pet-water-bottle.png",
    "Slow Feeder Bowl": "slow-feeder-bowl.png",
    "Pet Nail Clipper": "pet-nail-clipper.png",
    "Pet Bed": "pet-bed.png",
    "Silicone Feeding Set": "silicone-feeding-set.png",
    "Baby Diaper Bag": "baby-diaper-bag.png",
    "Portable Changing Mat": "portable-changing-mat.png",
    "Cabinet Safety Locks": "cabinet-safety-locks.png",
    "Baby Bottle Warmer": "baby-bottle-warmer.png",
    "Stroller Organizer": "stroller-organizer.png",
    "Baby Toy Set": "baby-toy-set.png",
    "Baby Grooming Kit": "baby-grooming-kit.png",
    "Power Bank": "power-bank.png",
    "Bluetooth Speaker": "bluetooth-speaker.png",
    "Smart LED Strip Lights": "smart-led-strip-lights.png",
    "Mini Projector": "mini-projector.png",
    "Laptop Stand": "laptop-stand.png",
    "Phone Stand": "magnetic-phone-mount.png",
    "Adjustable Dumbbells": "adjustable-dumbbells.png",
    "Ab Roller": "ab-roller.png",
    "Push-Up Board": "push-up-board.png",
    "Gym Gloves": "gym-gloves.png",
    "Water Bottle": "insulated-water-bottle.png",
    "Vegetable Chopper": "vegetable-chopper.png",
    "Electric Spin Scrubber": "electric_spin_scrubber.png",
    "Vacuum Storage Bags": "vacuum-bags.png",
    "Air Fryer Accessories Set": "air-fryer-accessories.png",
    "Oil Spray Bottle": "oil-spray-bottle.png",
    "Smart Plug": "smart-plug.png",
    "LED Motion Sensor Lights": "motion-lights.png",
    "Microfiber Cleaning Cloth Pack": "microfiber-cloths.png",
    "Digital Kitchen Scale": "digital-scale.png",
    "Under Sink Organizer": "under-sink-organizer.png",
    "Ice Face Roller": "ice_face_roller.png",
    "Facial Cleansing Brush": "sonic-facial-cleansing-brush.jpg",
    "Electric Toothbrush": "electric-toothbrush.png",
    "Neck & Shoulder Massager": "neck-massager.png",
    "Posture Corrector": "posture-corrector.png",
    "Massage Gun": "massage-gun.png",
    "Aromatherapy Diffuser": "aromatherapy-diffuser-luxury.jpg",
    "Automatic Pet Feeder": "pet-feeder.png",
    "Baby Nail Trimmer": "baby-clipper-premium.png",
    "Baby Bath Support": "baby-bath-support.png",
    "Wireless Earbuds": "wireless_earbuds.png",
    "Fast Wireless Charger": "3-in-1-charging-station.png",
    "Car Phone Mount": "magnetic-phone-mount.png",
    "Charging Hub": "carbon-fiber-charging-hub.jpg",
    "Resistance Bands": "resistance_bands.png",
    "Yoga Mat": "yoga-mat.png",
    "Jump Rope": "weighted-jump-rope.png"
  };

  // 4. Products

  const productData = [
    // Home & Kitchen
    { cat: 'Home & Kitchen', badge: 'Top Picks', name: 'Vegetable Chopper', url: 'https://amzn.to/4mgjKOK', desc: 'Saves time in meal preparation and easy to use.', benefits: ['Time Saver', 'Multi-Blade', 'Dishwasher Safe'] },
    { cat: 'Home & Kitchen', badge: 'Top Picks', name: 'Electric Spin Scrubber', url: 'https://amzn.to/4vayOS5', desc: 'Powerful cordless scrubber for deep cleaning.', benefits: ['Cordless', 'High Torque', 'Versatile Heads'] },
    { cat: 'Home & Kitchen', badge: 'Top Picks', name: 'Vacuum Storage Bags', url: 'https://amzn.to/3NQUaDg', desc: 'Triple-seal technology for maximum compression.', benefits: ['80% Space Saved', 'Durable Plastic', 'Travel Sized'] },
    { cat: 'Home & Kitchen', badge: 'Top Picks', name: 'Air Fryer Accessories Set', url: 'https://amzn.to/47J01RH', desc: 'Compatible with most air fryers for gourmet results.', benefits: ['Teflon-Free', 'Dishwasher Safe', 'Elite Baking Kit'] },
    { cat: 'Home & Kitchen', badge: 'Trending Now', name: 'Oil Spray Bottle', url: 'https://amzn.to/3OmAkQo', desc: 'Uniform spray for healthy and efficient cooking.', benefits: ['BPA-Free', 'Eco-Friendly', 'Perfect Mist'] },
    { cat: 'Home & Kitchen', badge: 'Trending Now', name: 'Smart Plug', url: 'https://amzn.to/3PU7kzZ', desc: 'Voice control and schedule-based home automation.', benefits: ['Alexa Ready', 'Energy Monitor', 'Mini Design'] },
    { cat: 'Home & Kitchen', badge: 'Trending Now', name: 'LED Motion Sensor Lights', url: 'https://amzn.to/41hGtjS', desc: 'Rechargeable wireless lighting for cabinets.', benefits: ['USB-C Charging', 'Ultra-Thin', 'Magnetic Mount'] },
    { cat: 'Home & Kitchen', badge: 'Trending Now', name: 'Microfiber Cleaning Cloth Pack', url: 'https://amzn.to/4cdP3Fi', desc: 'Lint-free and ultra-absorbent for all surfaces.', benefits: ['Scratch-Free', 'Washable', 'Great Value'] },
    { cat: 'Home & Kitchen', badge: "Editor's Choice", name: 'Digital Kitchen Scale', url: 'https://amzn.to/3PSpaDq', desc: 'High-precision sensors for accurate measuring.', benefits: ['Slim Profile', 'Easy Clean', 'Auto-Tare'] },
    { cat: 'Home & Kitchen', badge: "Editor's Choice", name: 'Under Sink Organizer', url: 'https://amzn.to/3NQUTEu', desc: 'Two-tier storage solution with pull-out drawers.', benefits: ['Rust-Resistant', 'Sturdy Build', 'Space Saver'] },
    
    // Beauty & Personal Care
    { cat: 'Beauty & Personal Care', badge: 'Top Picks', name: 'Ice Face Roller', url: 'https://amzn.to/4sj2ytg', desc: 'Reduces puffiness and refreshes skin instantly.', benefits: ['Soothing', 'Durable Refills', 'Travel Friendly'] },
    { cat: 'Beauty & Personal Care', badge: 'Top Picks', name: 'Facial Cleansing Brush', url: 'https://amzn.to/4dwEOOH', desc: 'Deep ultrasonic cleaning for radiant skin.', benefits: ['Waterproof', 'Silicone Bristles', 'Compact'] },
    { cat: 'Beauty & Personal Care', badge: 'Top Picks', name: 'Hair Straightener Brush', url: 'https://amzn.to/48jgyvP', desc: 'Quick heating and ceramic protection.', benefits: ['Ionic Tech', 'No-Tangle', 'Auto Shut-off'] },
    { cat: 'Beauty & Personal Care', badge: 'Top Picks', name: 'LED Makeup Mirror', url: 'https://amzn.to/4vfzipZ', desc: 'Adjustable brightness and high-definition clarity.', benefits: ['Touch Screen', '3X Magnification', 'USB Powered'] },
    { cat: 'Beauty & Personal Care', badge: 'Trending Now', name: 'Heatless Hair Curlers', url: 'https://amzn.to/4migCSr', desc: 'Damage-free styling while you sleep.', benefits: ['Silk Lining', 'Extra Long', 'No Heat needed'] },
    { cat: 'Beauty & Personal Care', badge: 'Trending Now', name: 'Blackhead Remover Vacuum', url: 'https://amzn.to/4ve7ylD', desc: 'Professional pore vacuum with suction levels.', benefits: ['5 Probe Heads', 'Rechargeable', 'Pain-Free'] },
    { cat: 'Beauty & Personal Care', badge: 'Trending Now', name: 'Electric Toothbrush', url: 'https://amzn.to/4vaA3AJ', desc: 'Sonic vibration for a deeper clean.', benefits: ['Long Battery', 'Smart Timer', 'Soft Bristles'] },
    { cat: 'Beauty & Personal Care', badge: "Editor's Choice", name: 'Electric Eyebrow Trimmer', url: 'https://amzn.to/4seAiYR', desc: 'Pain-free precision trimming for daily use.', benefits: ['Hypoallergenic', 'LED Light', 'Compact'] },
    { cat: 'Beauty & Personal Care', badge: "Editor's Choice", name: 'Makeup Brush Set', url: 'https://amzn.to/4sW28dh', desc: 'Professional synthetic bristles for flawless application.', benefits: ['Vegan', 'Super Soft', 'Elite Holder'] },
    { cat: 'Beauty & Personal Care', badge: "Editor's Choice", name: 'Cosmetic Organizer', url: 'https://amzn.to/4tytGFH', desc: 'Rotating 360-degree vanity storage.', benefits: ['Space Efficient', 'Transparent', 'Adjustable'] },

    // Health & Wellness
    { cat: 'Health & Wellness', badge: 'Top Picks', name: 'Neck & Shoulder Massager', url: 'https://amzn.to/4bUeFbj', desc: 'Shiatsu massage with deep heat therapy.', benefits: ['Deep Recovery', 'Heat Mode', 'Auto-Reverse'] },
    { cat: 'Health & Wellness', badge: 'Top Picks', name: 'Posture Corrector', url: 'https://amzn.to/4mfhIhB', desc: 'Adjustable support for spine alignment.', benefits: ['Breathable', 'Invisible Under', 'Quick Fix'] },
    { cat: 'Health & Wellness', badge: 'Top Picks', name: 'Massage Gun', url: 'https://amzn.to/41iIMTD', desc: 'Deep tissue percussion therapy for muscles.', benefits: ['6 Speed Levels', 'Ultra-Quiet', '4 Attachments'] },
    { cat: 'Health & Wellness', badge: 'Top Picks', name: 'Memory Foam Pillow', url: 'https://amzn.to/4sP2liu', desc: 'Ergonomic contour for neck support.', benefits: ['Cooling Gel', 'Eco-Friendly', 'Perfect Softness'] },
    { cat: 'Health & Wellness', badge: 'Trending Now', name: 'Aromatherapy Diffuser', url: 'https://amzn.to/47JWi6m', desc: 'Essential oil diffuser with color LED lights.', benefits: ['BPA-Free', 'Auto Shut-off', 'Super Quiet'] },
    { cat: 'Health & Wellness', badge: 'Trending Now', name: 'Foam Roller', url: 'https://amzn.to/4vee8bR', desc: 'High-density trigger point therapy.', benefits: ['Muscle Relief', 'Reinforced Core', 'Eco-PVC'] },
    { cat: 'Health & Wellness', badge: 'Trending Now', name: 'Weighted Blanket', url: 'https://amzn.to/4cuuq8Y', desc: 'Deep pressure stimulation for better sleep.', benefits: ['Glass Beads', 'Breathable', 'Elite Comfort'] },
    { cat: 'Health & Wellness', badge: "Editor's Choice", name: 'Eye Massager', url: 'https://amzn.to/4sjeTgW', desc: 'Stress and fatigue relief with heat therapy.', benefits: ['Bluetooth Music', 'Warm Compress', 'Foldable'] },
    { cat: 'Health & Wellness', badge: "Editor's Choice", name: 'White Noise Machine', url: 'https://amzn.to/3PWkxbo', desc: 'Variety of soothing sounds for relaxation.', benefits: ['Non-Looping', 'Night Light', 'Compact Design'] },
    { cat: 'Health & Wellness', badge: "Editor's Choice", name: 'Lumbar Support Cushion', url: 'https://amzn.to/4vdRQXB', desc: 'Orthopedic design for ergonomic seating.', benefits: ['100% Memory Foam', 'Breathable Cover', 'Strap-On Fix'] },

    // Pet Supplies
    { cat: 'Pet Supplies', badge: 'Top Picks', name: 'Pet Hair Remover Roller', url: 'https://amzn.to/4sCm3NL', desc: 'Reusable lint roller for pet fur removal.', benefits: ['No Tape Needed', 'Durable Handle', 'Instant Clean'] },
    { cat: 'Pet Supplies', badge: 'Top Picks', name: 'Self-Cleaning Grooming Brush', url: 'https://amzn.to/4mfdKWt', desc: 'One-click hair removal for easy grooming.', benefits: ['Gentle Bristles', 'No Skin Hurt', 'Quick Release'] },
    { cat: 'Pet Supplies', badge: 'Top Picks', name: 'Automatic Pet Feeder', url: 'https://amzn.to/41iJvEl', desc: 'Scheduled smart portion control for pets.', benefits: ['App Control', 'Dual Power', 'Stainless Bowl'] },
    { cat: 'Pet Supplies', badge: 'Top Picks', name: 'Pet Water Fountain', url: 'https://amzn.to/3PSASxU', desc: 'Triple-filtered continuous flowing water.', benefits: ['BPA-Free', 'Silent Pump', 'Elite Filtration'] },
    { cat: 'Pet Supplies', badge: 'Trending Now', name: 'Interactive Dog Toy', url: 'https://amzn.to/4mfmbAR', desc: 'Indestructible treat-dispensing smart toy.', benefits: ['Tough Rubber', 'Mental Health', 'Safe Material'] },
    { cat: 'Pet Supplies', badge: 'Trending Now', name: 'Cat Laser Toy', url: 'https://amzn.to/47Hm0bJ', desc: 'Automatic rotating laser for cat exercise.', benefits: ['Adjustable Speed', 'Timer Set', 'USB Charge'] },
    { cat: 'Pet Supplies', badge: 'Trending Now', name: 'Portable Pet Water Bottle', url: 'https://amzn.to/4drRB4S', desc: 'Leek-proof travel dispenser for walks.', benefits: ['One-Hand Seal', 'Carbon Filter', 'Elite Grade'] },
    { cat: 'Pet Supplies', badge: "Editor's Choice", name: 'Slow Feeder Bowl', url: 'https://amzn.to/4mbNWue', desc: 'Prevents choking and aids in healthy digestion.', benefits: ['Anti-Slip', 'BPA-Free', 'Fun Design'] },
    { cat: 'Pet Supplies', badge: "Editor's Choice", name: 'Pet Nail Clipper', url: 'https://amzn.to/4sRqXHj', desc: 'Safe precision trimmer with safety guard.', benefits: ['Sharp Blades', 'Lockable', 'Easy Grip'] },
    { cat: 'Pet Supplies', badge: "Editor's Choice", name: 'Pet Bed', url: 'https://amzn.to/4soPJh3', desc: 'Orthopedic memory foam for maximum comfort.', benefits: ['Washable Cover', 'Nonslip Base', 'Elite Softness'] },

    // Baby Essentials
    { cat: 'Baby & Kids Essentials', badge: 'Top Picks', name: 'Baby Nail Trimmer', url: 'https://amzn.to/4sgYlpK', desc: 'Safe electric file for infant nail care.', benefits: ['Ultra-Quiet', '6 Heads', 'Night Light'] },
    { cat: 'Baby & Kids Essentials', badge: 'Top Picks', name: 'Silicone Feeding Set', url: 'https://amzn.to/48z3NNN', desc: 'BPA-free suction layout for baby transition.', benefits: ['Microwave Safe', 'Unbreakable', 'Elite Comfort'] },
    { cat: 'Baby & Kids Essentials', badge: 'Top Picks', name: 'Baby Diaper Bag', url: 'https://amzn.to/3OkGAIp', desc: 'Spacious diaper backpack with changing pad.', benefits: ['Insulated Pockets', 'Waterproof', 'Stroller Straps'] },
    { cat: 'Baby & Kids Essentials', badge: 'Top Picks', name: 'Portable Changing Mat', url: 'https://amzn.to/4c8AHWJ', desc: 'Waterproof travel mat for quick diaper swaps.', benefits: ['Foldable', 'Cushioned', 'Easy Clean'] },
    { cat: 'Baby & Kids Essentials', badge: 'Trending Now', name: 'Cabinet Safety Locks', url: 'https://amzn.to/4t1fyF2', desc: 'Childproofing magnetic locks for furniture.', benefits: ['No Tools Required', 'Invisible', 'Safe Glue'] },
    { cat: 'Baby & Kids Essentials', badge: 'Trending Now', name: 'Baby Bottle Warmer', url: 'https://amzn.to/4sP3vdQ', desc: 'Quick and even heat for milk and food.', benefits: ['LCD Display', 'Steam Clean', 'Auto Shut-off'] },
    { cat: 'Baby & Kids Essentials', badge: 'Trending Now', name: 'Baby Bath Support', url: 'https://amzn.to/4ve9vOZ', desc: 'Ergonomic tub insert for infant safety.', benefits: ['Anti-Slip', 'Soft Touch', 'Mold Resistant'] },
    { cat: 'Baby & Kids Essentials', badge: "Editor's Choice", name: 'Stroller Organizer', url: 'https://amzn.to/4cuvnhy', desc: 'Universal storage with insulated cup holders.', benefits: ['Fast Install', 'Elite Design', 'Durable Mesh'] },
    { cat: 'Baby & Kids Essentials', badge: "Editor's Choice", name: 'Baby Toy Set', url: 'https://amzn.to/3PTsPkm', desc: 'Sensory and developmental learning toys.', benefits: ['Non-Toxic', 'Soft Edges', 'Colorful'] },
    { cat: 'Baby & Kids Essentials', badge: "Editor's Choice", name: 'Baby Grooming Kit', url: 'https://amzn.to/4cbFKFG', desc: 'Complete set for baby health and hygiene.', benefits: ['Travel Case', 'Precision Tools', 'BPA-Free'] },

    // Electronics 
    { cat: 'Electronics & Accessories', badge: 'Top Picks', name: 'Wireless Earbuds', url: 'https://amzn.to/4ccwbqa', desc: 'Active noise cancelling and deep bass.', benefits: ['40H Playtime', 'Hi-Res Audio', 'IPX7 Water'] },
    { cat: 'Electronics & Accessories', badge: 'Top Picks', name: 'Fast Wireless Charger', url: 'https://amzn.to/4dQO28H', desc: '15W rapid charging for all Qi devices.', benefits: ['Case Friendly', 'Sleep Mode', 'Overheat Protect'] },
    { cat: 'Electronics & Accessories', badge: 'Top Picks', name: 'Power Bank', url: 'https://amzn.to/4tCD5w5', desc: 'Portable high-capacity charging block.', benefits: ['20W Fast Out', 'Dual Port', 'Slim Tech'] },
    { cat: 'Electronics & Accessories', badge: 'Top Picks', name: 'Bluetooth Speaker', url: 'https://amzn.to/4mbyWMO', desc: 'Crystal clear sound with long-range BT.', benefits: ['Rugged Build', 'RGB Lights', 'Extreme Bass'] },
    { cat: 'Electronics & Accessories', badge: 'Trending Now', name: 'Smart LED Strip Lights', url: 'https://amzn.to/41hOMvW', desc: 'Sync with music and remote app control.', benefits: ['Wifi Link', 'Dimmable', '16M Colors'] },
    { cat: 'Electronics & Accessories', badge: 'Trending Now', name: 'Car Phone Mount', url: 'https://amzn.to/4teXqb3', desc: 'Universal magnetic phone holder for cars.', benefits: ['360 Rotation', 'N52 Magnet', 'Dashboard Fit'] },
    { cat: 'Electronics & Accessories', badge: 'Trending Now', name: 'Charging Hub', url: 'https://amzn.to/4mkil9Y', desc: 'Multi-port USB desktop power station.', benefits: ['GaN Tech', 'Compact', 'Safe Load'] },
    { cat: 'Electronics & Accessories', badge: "Editor's Choice", name: 'Mini Projector', url: 'https://amzn.to/4sgFueI', desc: 'Portable home theater for bedroom or travel.', benefits: ['1080P Support', 'Big Screen', 'Elite Lenses'] },
    { cat: 'Electronics & Accessories', badge: "Editor's Choice", name: 'Laptop Stand', url: 'https://amzn.to/41PFXcP', desc: 'Ergonomic aluminum cooling riser.', benefits: ['Heat Dissipation', 'Adjustable Height', 'Solid Metal'] },
    { cat: 'Electronics & Accessories', badge: "Editor's Choice", name: 'Phone Stand', url: 'https://amzn.to/47KCkbN', desc: 'Universal adjustable foldable holder.', benefits: ['Nonslip', 'Tablet Ready', 'Elite Quality'] },

    // Sports
    { cat: 'Sports & Fitness', badge: 'Top Picks', name: 'Resistance Bands', url: 'https://amzn.to/4csnjxL', desc: 'Heavy-duty latex-free fitness bands.', benefits: ['Elite Tension', 'Non-Snap', 'Travel Pouch'] },
    { cat: 'Sports & Fitness', badge: 'Top Picks', name: 'Massage Gun', url: 'https://amzn.to/4t2EnR8', desc: 'Percussion tissue therapy for deep relief.', benefits: ['Pro-Grade', '8 Heads', 'Quiet Glide'] },
    { cat: 'Sports & Fitness', badge: 'Top Picks', name: 'Yoga Mat', url: 'https://amzn.to/47KcdSc', desc: 'Non-slip high-density eco-friendly mat.', benefits: ['6mm Thick', 'Eco-TPE', 'Body Alignment'] },
    { cat: 'Sports & Fitness', badge: 'Top Picks', name: 'Adjustable Dumbbells', url: 'https://amzn.to/4vggOWa', desc: 'Rapid weight selection for compact gyms.', benefits: ['Space Saving', 'Locking Grip', 'Durable Steel'] },
    { cat: 'Sports & Fitness', badge: 'Trending Now', name: 'Ab Roller', url: 'https://amzn.to/3OpiNHd', desc: 'Core strengthening with ergonomic handles.', benefits: ['Steady Base', 'Knee Pad Included', 'No Noise'] },
    { cat: 'Sports & Fitness', badge: 'Trending Now', name: 'Jump Rope', url: 'https://amzn.to/4bUqYV0', desc: 'Weighted speed rope for cardio training.', benefits: ['Ball Bearing', 'Adjustable', 'Tangle-Free'] },
    { cat: 'Sports & Fitness', badge: 'Trending Now', name: 'Foam Roller', url: 'https://amzn.to/3PLBzJp', desc: 'Trigger point therapy for fast recovery.', benefits: ['Elite Grid', 'Tough Core', 'Portable'] },
    { cat: 'Sports & Fitness', badge: "Editor's Choice", name: 'Push-Up Board', url: 'https://amzn.to/4trnFKQ', desc: 'Color-coded muscle target system.', benefits: ['Easy Fold', 'Nonslip', 'Chest Specific'] },
    { cat: 'Sports & Fitness', badge: "Editor's Choice", name: 'Gym Gloves', url: 'https://amzn.to/4cbGYAM', desc: 'Weightlifting protection with wrist support.', benefits: ['Padded Palm', 'Breathable', 'Elite Grip'] },
    { cat: 'Sports & Fitness', badge: "Editor's Choice", name: 'Water Bottle', url: 'https://amzn.to/41MUm9M', desc: 'Insulated stainless steel for extreme tasks.', benefits: ['24H Cold', 'Leak Proof', 'BPA-Free'] },
  ];

  for (let i = 0; i < productData.length; i++) {
    const p = productData[i];
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    
    const imageFileName = imageMap[p.name] || 'premium_product_placeholder.png';
    const imagePath = `/assets/products/${imageFileName}`;

    await prisma.product.create({
      data: {
        name: p.name,
        slug: `${slug}-${i}-${Math.floor(Math.random()*1000)}`,
        description: p.desc,
        shortBenefit: p.desc,
        price: 39.99 + (i % 5 * 10),
        image: imagePath,
        badge: p.badge,
        affiliateUrl: p.url,
        isActive: true,
        sortOrder: i,
        ratingValue: 4.8 + (Math.random() * 0.2),
        categoryId: catMap[p.cat.trim()],
        keyBenefits: JSON.stringify(p.benefits)
      }
    });

  }

  // 4. Testimonials
  await prisma.testimonial.createMany({
    data: [
      { name: 'Michael T.', location: 'Texas, USA', text: 'I wasn’t expecting this level of quality at this price point. Everything arrived in perfect condition. Will definitely order again.', region: 'us', rating: 5, sortOrder: 1 },
      { name: 'Jessica L.', location: 'California, USA', text: 'The ordering process was simple, and the delivery was faster than expected. Great service overall.', region: 'us', rating: 5, sortOrder: 2 },
      { name: 'David R.', location: 'New York, USA', text: 'I’ve tried several online stores, but this one stands out for its professionalism and product selection. Highly recommended.', region: 'us', rating: 5, sortOrder: 3 },
      { name: 'Emily S.', location: 'Florida, USA', text: 'Affordable pricing without compromising on quality. Exactly what I was looking for.', region: 'us', rating: 5, sortOrder: 4 },
      { name: 'Ahmed K.', location: 'Abu Dhabi, UAE', text: 'The team was very responsive, and the entire process was handled professionally. Great experience.', region: 'ae', rating: 5, sortOrder: 5 },
      { name: 'Sara M.', location: 'Dubai, UAE', text: 'Product quality exceeded expectations, and delivery was on time. Will recommend to others.', region: 'ae', rating: 5, sortOrder: 6 },
      { name: 'Hassan A.', location: 'Sharjah, UAE', text: 'Everything was exactly as described. It’s good to see a company that delivers what it promises.', region: 'ae', rating: 5, sortOrder: 7 },
      { name: 'Fatima R.', location: 'Al Ain, UAE', text: 'Easy to navigate website and smooth checkout process. Very satisfied.', region: 'ae', rating: 5, sortOrder: 8 }
    ]
  });

  console.log(`🌟 Seeding Complete. ${productData.length} Products Curated into categorical sections.`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
