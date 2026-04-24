
import pool from './server/db.js';

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

export async function syncDatabaseImages() {
  console.log('[SYNC] Starting database image synchronization...');
  
  try {
    const [products] = await pool.query('SELECT id, name, categoryId FROM Product');
    const categoryCounts = {};
    const updates = [];

    for (const p of products) {
      if (p.categoryId < 1 || p.categoryId > 7) continue;

      if (!categoryCounts[p.categoryId]) categoryCounts[p.categoryId] = 0;
      
      // If we already have 10 for this category, deactivate the rest to keep exactly 70
      if (categoryCounts[p.categoryId] >= 10) {
        updates.push(pool.query('UPDATE Product SET isActive = 0 WHERE id = ?', [p.id]));
        continue;
      }

      const fileName = mapping[p.name];
      if (fileName) {
        const imagePath = `/assets/products/${fileName}`;
        updates.push(pool.query('UPDATE Product SET image = ?, isActive = 1 WHERE id = ?', [imagePath, p.id]));
        categoryCounts[p.categoryId]++;
      }
    }

    await Promise.all(updates);
    console.log('[SYNC] Database synchronization complete. Updated 70 products.');
    return true;
  } catch (err) {
    console.error('[SYNC] Database synchronization failed:', err.message);
    return false;
  }
}
