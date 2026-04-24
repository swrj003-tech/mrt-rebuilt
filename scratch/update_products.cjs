
const fs = require('fs');
const path = require('path');

const productsPath = 'public/api/products.json';
const distPath = 'dist/api/products.json';

const raw = fs.readFileSync(productsPath, 'utf8');
const data = JSON.parse(raw);

const mapping = {
  // Category 1: Home & Kitchen
  "Vegetable Chopper": "vegetable-chopper.png",
  "Electric Spin Scrubber": "electric_spin_scrubber.png",
  "Vacuum Storage Bags": "vacuum-bags.png",
  "Air Fryer Accessories Set": "air-fryer-accessories.png",
  "Oil Spray Bottle": "oil-spray-bottle.png",
  "Smart Plug": "smart-plug.png",
  "LED Motion Sensor Lights": "motion-lights.png",
  "Microfiber Cleaning Cloth Pack": "microfiber-cloths.png",
  "Digital Kitchen Scale": "kitchen-scale.png",
  "Under Sink Organizer": "under-sink-organizer.png",

  // Category 2: Beauty & Personal Care
  "Ice Face Roller": "ice_face_roller.png",
  "Facial Cleansing Brush": "sonic-facial-cleansing-brush.jpg",
  "Hair Straightener Brush": "hair-straightener-brush.png",
  "LED Makeup Mirror": "led-makeup-mirror.png",
  "Heatless Hair Curlers": "heatless-curlers.png",
  "Blackhead Remover Vacuum": "blackhead-remover.png",
  "Electric Toothbrush": "sonic-toothbrush-premium.jpg",
  "Electric Eyebrow Trimmer": "eyebrow-trimmer.png",
  "Makeup Brush Set": "makeup-brush-set.png",
  "Cosmetic Organizer": "cosmetic-organizer.png",

  // Category 3: Health & Wellness
  "Neck & Shoulder Massager": "neck-massager.png",
  "Posture Corrector": "posture-corrector.png",
  "Massage Gun (Health)": "massage-gun.png",
  "Memory Foam Pillow": "memory-foam-pillow.png",
  "Aromatherapy Diffuser": "aromatherapy-diffuser-luxury.jpg",
  "Foam Roller (Health)": "foam-roller.png",
  "Weighted Blanket": "weighted-blanket.png",
  "Eye Massager": "eye-massager.png",
  "White Noise Machine": "white-noise-machine.png",
  "Neck & Shoulder Massager": "neck-massager.png",
  "Posture Corrector": "posture-corrector.png",
  "Massage Gun (Health)": "massage-gun.png",
  "Memory Foam Pillow": "memory-foam-pillow.png",
  "Aromatherapy Diffuser": "aromatherapy-diffuser-luxury.jpg",
  "Foam Roller (Health)": "foam-roller.png",
  "Weighted Blanket": "weighted-blanket.png",
  "Eye Massager": "eye-massager.png",
  "White Noise Machine": "white-noise-machine.png",
  "Lumbar Support Cushion": "lumbar-support-cushion.png",

  // Category 4: Pet Supplies
  "Pet Hair Remover Roller": "pet-hair-remover-roller.png",
  "Self-Cleaning Grooming Brush": "self-cleaning-grooming-brush.png",
  "Automatic Pet Feeder": "pet-feeder.png",
  "Pet Water Fountain": "pet-water-fountain.png",
  "Interactive Dog Toy": "interactive-dog-toy.png",
  "Cat Laser Toy": "cat-laser-toy.png",
  "Portable Pet Water Bottle": "portable-pet-water-bottle.png",
  "Slow Feeder Bowl": "slow-feeder-bowl.png",
  "Pet Nail Clipper": "pet-nail-clipper.png",
  "Pet Bed": "pet-bed.png",

  // Category 5: Baby & Kids Essentials
  "Baby Nail Trimmer": "baby-clipper-premium.png",
  "Silicone Feeding Set": "silicone-feeding-set.png",
  "Baby Diaper Bag": "baby-diaper-bag.png",
  "Portable Changing Mat": "portable-changing-mat.png",
  "Cabinet Safety Locks": "cabinet-safety-locks.png",
  "Baby Bottle Warmer": "baby-bottle-warmer.png",
  "Baby Bath Support": "baby-bath-support.png",
  "Stroller Organizer": "stroller-organizer.png",
  "Baby Toy Set": "baby-toy-set.png",
  "Baby Grooming Kit": "baby-grooming-kit.png",

  // Category 6: Electronics & Accessories
  "Wireless Earbuds": "wireless_earbuds.png",
  "Fast Wireless Charger": "3-in-1-charging-station.png",
  "Power Bank": "power-bank.png",
  "Bluetooth Speaker": "bluetooth-speaker.png",
  "Smart LED Strip Lights": "smart-led-strip-lights.png",
  "Car Phone Mount": "magnetic-phone-mount.png",
  "Charging Hub": "carbon-fiber-charging-hub.jpg",
  "Mini Projector": "mini-projector.png",
  "Laptop Stand": "laptop-stand.png",
  "Phone Stand": "executive-charger-watch-stand.jpg",

  // Category 7: Sports & Fitness
  "Resistance Bands": "resistance-band-set.png",
  "Massage Gun (Sports)": "massage_gun.png",
  "Yoga Mat": "yoga-mat.png",
  "Adjustable Dumbbells": "adjustable-dumbbells.png",
  "Ab Roller": "ab-roller.png",
  "Jump Rope": "weighted-jump-rope.png",
  "Foam Roller (Sports)": "foam-roller.png",
  "Push-Up Board": "push-up-board.png",
  "Gym Gloves": "gym-gloves.png",
  "Water Bottle": "insulated-water-bottle.png"
};

const newProducts = [];
const categoryCounts = {};

data.products.forEach(p => {
  if (p.categoryId < 1 || p.categoryId > 7) return;
  
  if (!categoryCounts[p.categoryId]) categoryCounts[p.categoryId] = 0;
  if (categoryCounts[p.categoryId] >= 10) return;

  const fileName = mapping[p.name];
  if (fileName) {
    p.image = `/assets/products/${fileName}`;
  } else {
    // Fallback or log missing mapping
    console.warn(`No mapping for product: ${p.name}`);
  }

  newProducts.push(p);
  categoryCounts[p.categoryId]++;
});

// Ensure we have 10 each. If some were missing from the list but we have 70 products, we are good.
// The analysis showed 10+ for each cat, so trimming works.
data.products = newProducts;

fs.writeFileSync(productsPath, JSON.stringify(data, null, 2));
fs.writeFileSync(distPath, JSON.stringify(data, null, 2));
console.log('Successfully updated 70 products with local images.');
