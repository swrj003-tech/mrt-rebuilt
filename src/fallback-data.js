/**
 * Fallback Data for MRT International
 * Used when the backend API returns a 504 Gateway Timeout or other error.
 * Ensures the site never looks empty or broken.
 */
export const FALLBACK_PRODUCTS = [
  {
    id: 'f1',
    name: 'Elegant Marble Coaster Set',
    price: 45.00,
    image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=800',
    category: { name: 'Home & Kitchen', slug: 'home-kitchen' },
    badge: 'Bestseller',
    reviewCount: 124,
    description: 'Handcrafted natural marble coasters with gold-rimmed edges. Perfect for a luxury home aesthetic.',
    keyBenefits: ['Natural Marble', 'Heat Resistant', 'Elegant Design']
  },
  {
    id: 'f2',
    name: 'Silk Sleep Mask & Pillowcase',
    price: 68.00,
    image: 'https://images.unsplash.com/photo-1590736704610-d0966f36306c?auto=format&fit=crop&q=80&w=800',
    category: { name: 'Beauty & Personal Care', slug: 'beauty-personal-care' },
    badge: 'Luxury',
    reviewCount: 420,
    description: '100% Mulberry silk for the ultimate beauty sleep and hair protection.',
    keyBenefits: ['100% Mulberry Silk', 'Anti-aging', 'Hair Friendly']
  },
  {
    id: 'f3',
    name: 'Minimalist Ceramic Vase',
    price: 32.00,
    image: 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800',
    category: { name: 'Home & Kitchen', slug: 'home-kitchen' },
    badge: 'Designer Choice',
    reviewCount: 89,
    description: 'Hand-thrown ceramic vase with a matte finish. A versatile piece for any interior style.',
    keyBenefits: ['Hand-thrown', 'Matte Finish', 'Versatile Style']
  },
  {
    id: 'f4',
    name: 'Organic Lavender Diffuser',
    price: 38.00,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    category: { name: 'Health & Wellness', slug: 'health-wellness' },
    badge: 'Top Rated',
    reviewCount: 256,
    description: 'Sustainably sourced lavender essential oil diffuser to create a calming sanctuary in your home.',
    keyBenefits: ['Sustainably Sourced', 'Calming Effect', 'Natural Oils']
  },
  {
    id: 'f5',
    name: 'Premium Leather Pet Carrier',
    price: 185.00,
    image: 'https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?auto=format&fit=crop&q=80&w=800',
    category: { name: 'Pet Supplies', slug: 'pet-supplies' },
    badge: 'New Arrival',
    reviewCount: 45,
    description: 'Italian leather travel carrier for small pets. Durable, ventilating, and exceptionally stylish.',
    keyBenefits: ['Italian Leather', 'Ventilated', 'Durable Hardware']
  },
  {
    id: 'f6',
    name: 'Minimalist Smart Watch',
    price: 249.00,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    category: { name: 'Electronics & Accessories', slug: 'electronics-accessories' },
    badge: 'Tech Award',
    reviewCount: 1530,
    description: 'The ultimate blend of classic watch design and modern smart connectivity.',
    keyBenefits: ['AMOLED Display', 'Health Tracking', '7-Day Battery']
  },
  {
    id: 'f7',
    name: 'Golden Hour Scented Candle',
    price: 28.00,
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800',
    category: { name: 'Home & Kitchen', slug: 'home-kitchen' },
    badge: 'Trending',
    reviewCount: 512,
    description: 'Notes of sandalwood, amber, and vanilla to capture the essence of the golden hour.',
    keyBenefits: ['Soy Wax', '60hr Burn Time', 'Natural Scent']
  },
  {
    id: 'f8',
    name: 'Matte Black Yoga Mat',
    price: 75.00,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800',
    category: { name: 'Sports & Fitness', slug: 'sports-fitness' },
    badge: 'Pro Grade',
    reviewCount: 302,
    description: 'High-density natural rubber mat with stay-dry grip technology for professional yogis.',
    keyBenefits: ['Natural Rubber', 'Non-Slip Grip', 'Extra Thick']
  }
];
