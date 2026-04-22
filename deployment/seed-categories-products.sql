-- ============================================
-- MRT International - Category & Product Seed Data
-- Based on the refined category structure document
-- ============================================

-- ============================================
-- CATEGORIES
-- ============================================

INSERT INTO `Category` (`name`, `slug`, `image`, `sortOrder`) VALUES
('Home & Kitchen', 'home-kitchen', '/assets/categories/home-kitchen.jpg', 1),
('Beauty & Personal Care', 'beauty-personal-care', '/assets/categories/beauty.jpg', 2),
('Health & Wellness', 'health-wellness', '/assets/categories/health.jpg', 3),
('Pet Supplies', 'pet-supplies', '/assets/categories/pets.jpg', 4),
('Baby & Kids Essentials', 'baby-kids', '/assets/categories/baby.jpg', 5),
('Electronics & Accessories', 'electronics', '/assets/categories/electronics.jpg', 6),
('Sports & Fitness', 'sports-fitness', '/assets/categories/sports.jpg', 7);

-- ============================================
-- CATEGORY THEMES
-- ============================================

INSERT INTO `CategoryTheme` (`primary`, `secondary`, `title`, `subtitle`, `seoTitle`, `seoIntro`, `categoryId`) VALUES
-- Home & Kitchen
('#914d00', '#f28c28', 'Home & Kitchen Essentials', 'Transform your living space', 'Top 10 Best Home & Kitchen Products (2026)', 'Discover the most useful, trending, and top-rated home & kitchen products carefully selected for quality and value.', 1),

-- Beauty & Personal Care
('#c2185b', '#f06292', 'Beauty & Personal Care', 'Enhance your natural beauty', 'Top 10 Best Beauty & Personal Care Products (2026)', 'Discover the most useful, trending, and top-rated beauty & personal care products carefully selected for quality and value.', 2),

-- Health & Wellness
('#00796b', '#4db6ac', 'Health & Wellness', 'Prioritize your wellbeing', 'Top 10 Best Health & Wellness Products (2026)', 'Discover the most useful, trending, and top-rated health & wellness products carefully selected for quality and value.', 3),

-- Pet Supplies
('#5d4037', '#a1887f', 'Pet Supplies', 'Everything for your furry friends', 'Top 10 Best Pet Supplies (2026)', 'Discover the most useful, trending, and top-rated pet supplies carefully selected for quality and value.', 4),

-- Baby & Kids
('#1976d2', '#64b5f6', 'Baby & Kids Essentials', 'Safe and practical for little ones', 'Top 10 Best Baby & Kids Products (2026)', 'Discover the most useful, trending, and top-rated baby & kids products carefully selected for quality and value.', 5),

-- Electronics
('#455a64', '#78909c', 'Electronics & Accessories', 'Stay connected and powered', 'Top 10 Best Electronics & Accessories (2026)', 'Discover the most useful, trending, and top-rated electronics & accessories carefully selected for quality and value.', 6),

-- Sports & Fitness
('#d32f2f', '#ef5350', 'Sports & Fitness', 'Achieve your fitness goals', 'Top 10 Best Sports & Fitness Products (2026)', 'Discover the most useful, trending, and top-rated sports & fitness products carefully selected for quality and value.', 7);

-- ============================================
-- PRODUCTS - HOME & KITCHEN
-- ============================================

INSERT INTO `Product` (`name`, `slug`, `shortBenefit`, `price`, `image`, `badge`, `affiliateUrl`, `isActive`, `sortOrder`, `ratingValue`, `tags`, `keyBenefits`, `categoryId`) VALUES

-- Top Picks
('Vegetable Chopper', 'vegetable-chopper', 'A practical kitchen tool designed to make chopping faster, easier, and more convenient.', 29.99, '/assets/products/vegetable-chopper.jpg', 'Top Pick', 'https://amzn.to/4mgjKOK', TRUE, 1, 4.8, '["kitchen", "cooking", "time-saver"]', '["Saves time in meal preparation", "Easy to use and clean", "Compact and kitchen-friendly design"]', 1),

('Electric Spin Scrubber', 'electric-spin-scrubber', 'Powerful cleaning tool for effortless scrubbing.', 39.99, '/assets/products/spin-scrubber.jpg', 'Top Pick', 'https://amzn.to/4vayOS5', TRUE, 2, 4.7, '["cleaning", "bathroom", "kitchen"]', '["Reduces cleaning effort", "Multiple brush heads included", "Rechargeable battery"]', 1),

('Vacuum Storage Bags', 'vacuum-storage-bags', 'Space-saving storage solution for clothes and bedding.', 24.99, '/assets/products/vacuum-bags.jpg', 'Top Pick', 'https://amzn.to/3NQUaDg', TRUE, 3, 4.6, '["storage", "organization", "space-saver"]', '["Saves up to 80% storage space", "Protects from moisture and dust", "Reusable and durable"]', 1),

('Air Fryer Accessories Set', 'air-fryer-accessories', 'Complete accessory kit for your air fryer.', 34.99, '/assets/products/air-fryer-set.jpg', 'Top Pick', 'https://amzn.to/47J01RH', TRUE, 4, 4.7, '["cooking", "air-fryer", "accessories"]', '["Expands air fryer capabilities", "Non-stick coating", "Dishwasher safe"]', 1),

-- Trending Now
('Oil Spray Bottle', 'oil-spray-bottle', 'Control oil portions with precision spray.', 12.99, '/assets/products/oil-spray.jpg', 'Trending Now', 'https://amzn.to/3OmAkQo', TRUE, 5, 4.5, '["cooking", "healthy", "kitchen"]', '["Reduces oil consumption", "Even spray distribution", "Easy to refill"]', 1),

('Smart Plug', 'smart-plug', 'Control your devices remotely with voice or app.', 19.99, '/assets/products/smart-plug.jpg', 'Trending Now', 'https://amzn.to/3PU7kzZ', TRUE, 6, 4.6, '["smart-home", "automation", "energy-saving"]', '["Voice control compatible", "Schedule on/off times", "Energy monitoring"]', 1),

('LED Motion Sensor Lights', 'led-motion-lights', 'Automatic lighting for hallways and closets.', 22.99, '/assets/products/motion-lights.jpg', 'Trending Now', 'https://amzn.to/41hGtjS', TRUE, 7, 4.5, '["lighting", "motion-sensor", "battery"]', '["Hands-free operation", "Energy efficient", "Easy installation"]', 1),

('Microfiber Cleaning Cloth Pack', 'microfiber-cloths', 'Ultra-absorbent cleaning cloths for all surfaces.', 15.99, '/assets/products/microfiber-cloths.jpg', 'Trending Now', 'https://amzn.to/4cdP3Fi', TRUE, 8, 4.7, '["cleaning", "reusable", "eco-friendly"]', '["Lint-free cleaning", "Machine washable", "Multi-purpose use"]', 1),

-- Editor's Choice
('Digital Kitchen Scale', 'digital-kitchen-scale', 'Precise measurements for perfect cooking results.', 18.99, '/assets/products/kitchen-scale.jpg', 'Editor\'s Choice', 'https://amzn.to/3PSpaDq', TRUE, 9, 4.8, '["cooking", "baking", "precision"]', '["Accurate to 1g", "Tare function", "Easy-to-read display"]', 1),

('Under Sink Organizer', 'under-sink-organizer', 'Maximize storage space under your sink.', 27.99, '/assets/products/sink-organizer.jpg', 'Editor\'s Choice', 'https://amzn.to/3NQUTEu', TRUE, 10, 4.6, '["storage", "organization", "kitchen"]', '["Adjustable shelves", "Rust-resistant", "Easy assembly"]', 1);

-- ============================================
-- PRODUCTS - BEAUTY & PERSONAL CARE
-- ============================================

INSERT INTO `Product` (`name`, `slug`, `shortBenefit`, `price`, `image`, `badge`, `affiliateUrl`, `isActive`, `sortOrder`, `ratingValue`, `tags`, `keyBenefits`, `categoryId`) VALUES

-- Top Picks
('Ice Face Roller', 'ice-face-roller', 'Reduce puffiness and refresh your skin.', 16.99, '/assets/products/ice-roller.jpg', 'Top Pick', 'https://amzn.to/4sj2ytg', TRUE, 1, 4.7, '["skincare", "beauty", "facial"]', '["Reduces facial puffiness", "Soothes skin irritation", "Improves circulation"]', 2),

('Facial Cleansing Brush', 'facial-cleansing-brush', 'Deep clean your pores for radiant skin.', 24.99, '/assets/products/cleansing-brush.jpg', 'Top Pick', 'https://amzn.to/4dwEOOH', TRUE, 2, 4.6, '["skincare", "cleansing", "electric"]', '["6x better cleansing", "Gentle on skin", "Waterproof design"]', 2),

('Hair Straightener Brush', 'hair-straightener-brush', 'Straighten hair quickly without damage.', 32.99, '/assets/products/straightener-brush.jpg', 'Top Pick', 'https://amzn.to/48jgyvP', TRUE, 3, 4.5, '["hair", "styling", "straightener"]', '["Fast heating technology", "Anti-scald design", "Reduces frizz"]', 2),

('LED Makeup Mirror', 'led-makeup-mirror', 'Perfect lighting for flawless makeup application.', 29.99, '/assets/products/makeup-mirror.jpg', 'Top Pick', 'https://amzn.to/4vfzipZ', TRUE, 4, 4.8, '["makeup", "mirror", "lighting"]', '["Adjustable brightness", "360° rotation", "Touch control"]', 2),

-- Trending Now
('Heatless Hair Curlers', 'heatless-curlers', 'Create beautiful curls without heat damage.', 14.99, '/assets/products/heatless-curlers.jpg', 'Trending Now', 'https://amzn.to/4migCSr', TRUE, 5, 4.6, '["hair", "curling", "no-heat"]', '["No heat damage", "Comfortable overnight wear", "Long-lasting curls"]', 2),

('Blackhead Remover Vacuum', 'blackhead-remover', 'Extract blackheads and deep clean pores.', 27.99, '/assets/products/blackhead-vacuum.jpg', 'Trending Now', 'https://amzn.to/4ve7ylD', TRUE, 6, 4.4, '["skincare", "pore-care", "electric"]', '["5 suction levels", "Multiple probe heads", "USB rechargeable"]', 2),

('Electric Toothbrush', 'electric-toothbrush', 'Superior cleaning for healthier teeth and gums.', 34.99, '/assets/products/electric-toothbrush.jpg', 'Trending Now', 'https://amzn.to/4vaA3AJ', TRUE, 7, 4.7, '["dental", "oral-care", "electric"]', '["Removes 10x more plaque", "Built-in timer", "Long battery life"]', 2),

-- Editor's Choice
('Electric Eyebrow Trimmer', 'eyebrow-trimmer', 'Precise eyebrow shaping made easy.', 19.99, '/assets/products/eyebrow-trimmer.jpg', 'Editor\'s Choice', 'https://amzn.to/4seAiYR', TRUE, 8, 4.6, '["grooming", "eyebrows", "trimmer"]', '["Painless trimming", "LED light", "Portable design"]', 2),

('Makeup Brush Set', 'makeup-brush-set', 'Professional quality brushes for every look.', 22.99, '/assets/products/brush-set.jpg', 'Editor\'s Choice', 'https://amzn.to/4sW28dh', TRUE, 9, 4.7, '["makeup", "brushes", "professional"]', '["Soft synthetic bristles", "Complete set", "Includes storage case"]', 2),

('Cosmetic Organizer', 'cosmetic-organizer', 'Keep your beauty products organized and accessible.', 25.99, '/assets/products/cosmetic-organizer.jpg', 'Editor\'s Choice', 'https://amzn.to/4tytGFH', TRUE, 10, 4.5, '["storage", "organization", "makeup"]', '["Multiple compartments", "Rotating design", "Durable acrylic"]', 2);

-- ============================================
-- PRODUCTS - HEALTH & WELLNESS
-- ============================================

INSERT INTO `Product` (`name`, `slug`, `shortBenefit`, `price`, `image`, `badge`, `affiliateUrl`, `isActive`, `sortOrder`, `ratingValue`, `tags`, `keyBenefits`, `categoryId`) VALUES

-- Top Picks
('Neck & Shoulder Massager', 'neck-shoulder-massager', 'Relieve tension and muscle pain effectively.', 44.99, '/assets/products/neck-massager.jpg', 'Top Pick', 'https://amzn.to/4bUeFbj', TRUE, 1, 4.7, '["massage", "pain-relief", "wellness"]', '["Deep tissue massage", "Heat therapy", "Adjustable intensity"]', 3),

('Posture Corrector', 'posture-corrector', 'Improve posture and reduce back pain.', 21.99, '/assets/products/posture-corrector.jpg', 'Top Pick', 'https://amzn.to/4mfhIhB', TRUE, 2, 4.5, '["posture", "back-support", "health"]', '["Comfortable to wear", "Adjustable straps", "Breathable material"]', 3),

('Massage Gun', 'massage-gun', 'Professional-grade muscle recovery tool.', 79.99, '/assets/products/massage-gun.jpg', 'Top Pick', 'https://amzn.to/41iIMTD', TRUE, 3, 4.8, '["massage", "recovery", "fitness"]', '["6 speed settings", "Multiple massage heads", "Quiet operation"]', 3),

('Memory Foam Pillow', 'memory-foam-pillow', 'Ergonomic support for better sleep.', 36.99, '/assets/products/memory-pillow.jpg', 'Top Pick', 'https://amzn.to/4sP2liu', TRUE, 4, 4.6, '["sleep", "pillow", "comfort"]', '["Contoured design", "Breathable cover", "Hypoallergenic"]', 3),

-- Trending Now
('Aromatherapy Diffuser', 'aromatherapy-diffuser', 'Create a calming atmosphere at home.', 28.99, '/assets/products/diffuser.jpg', 'Trending Now', 'https://amzn.to/47JWi6m', TRUE, 5, 4.7, '["aromatherapy", "wellness", "relaxation"]', '["7 LED color options", "Auto shut-off", "Whisper quiet"]', 3),

('Foam Roller', 'foam-roller', 'Self-massage tool for muscle recovery.', 24.99, '/assets/products/foam-roller.jpg', 'Trending Now', 'https://amzn.to/4vee8bR', TRUE, 6, 4.6, '["fitness", "recovery", "massage"]', '["High-density foam", "Textured surface", "Lightweight and portable"]', 3),

('Weighted Blanket', 'weighted-blanket', 'Improve sleep quality and reduce anxiety.', 59.99, '/assets/products/weighted-blanket.jpg', 'Trending Now', 'https://amzn.to/4cuuq8Y', TRUE, 7, 4.7, '["sleep", "anxiety", "comfort"]', '["Even weight distribution", "Breathable fabric", "Multiple weight options"]', 3),

-- Editor's Choice
('Eye Massager', 'eye-massager', 'Reduce eye strain and improve relaxation.', 42.99, '/assets/products/eye-massager.jpg', 'Editor\'s Choice', 'https://amzn.to/4sjeTgW', TRUE, 8, 4.5, '["massage", "eye-care", "relaxation"]', '["Heat compression", "Bluetooth music", "Rechargeable"]', 3),

('White Noise Machine', 'white-noise-machine', 'Better sleep with soothing sounds.', 32.99, '/assets/products/white-noise.jpg', 'Editor\'s Choice', 'https://amzn.to/3PWkxbo', TRUE, 9, 4.6, '["sleep", "sound", "relaxation"]', '["20+ sound options", "Timer function", "Compact design"]', 3),

('Lumbar Support Cushion', 'lumbar-cushion', 'Ergonomic back support for office and car.', 29.99, '/assets/products/lumbar-cushion.jpg', 'Editor\'s Choice', 'https://amzn.to/4vdRQXB', TRUE, 10, 4.7, '["back-support", "ergonomic", "comfort"]', '["Memory foam construction", "Adjustable strap", "Breathable mesh"]', 3);

-- ============================================
-- VERIFICATION QUERY
-- ============================================
-- Run this to verify data insertion:
-- SELECT c.name as category, COUNT(p.id) as product_count 
-- FROM Category c 
-- LEFT JOIN Product p ON c.id = p.categoryId 
-- GROUP BY c.id, c.name 
-- ORDER BY c.sortOrder;
