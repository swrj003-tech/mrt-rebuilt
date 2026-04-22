export const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Home & Kitchen', slug: 'home-kitchen', image: '/assets/categories/home-kitchen.png', theme: { primary: '#1e293b', secondary: '#f8fafc', title: 'Home & Kitchen', subtitle: 'Premium living essentials' } },
  { id: 2, name: 'Beauty & Personal Care', slug: 'beauty-personal-care', image: '/assets/categories/beauty-skincare.png', theme: { primary: '#1e293b', secondary: '#f8fafc', title: 'Beauty & Personal Care', subtitle: 'Radiant essentials' } },
  { id: 3, name: 'Health & Wellness', slug: 'health-wellness', image: '/assets/categories/health-wellness.png', theme: { primary: '#1e293b', secondary: '#f8fafc', title: 'Health & Wellness', subtitle: 'Pure vitality' } },
  { id: 4, name: 'Pet Supplies', slug: 'pet-supplies', image: '/assets/categories/pet-supplies.png', theme: { primary: '#1e293b', secondary: '#f8fafc', title: 'Pet Supplies', subtitle: 'Loyal companion gear' } }
];

export const FALLBACK_PRODUCTS = [
  { 
    id: 101, 
    name: 'Premium Kitchen Set', 
    slug: 'premium-kitchen-set', 
    price: 129.99, 
    image: '/assets/products/placeholder.png', 
    badge: 'Best Seller', 
    ratingValue: 4.9, 
    category: { slug: 'home-kitchen', name: 'Home & Kitchen' },
    shortBenefit: 'Unmatched durability and style'
  },
  { 
    id: 102, 
    name: 'Skincare Essentials', 
    slug: 'skincare-essentials', 
    price: 49.99, 
    image: '/assets/products/placeholder.png', 
    badge: 'Popular', 
    ratingValue: 4.8, 
    category: { slug: 'beauty-personal-care', name: 'Beauty & Personal Care' },
    shortBenefit: 'Natural glow for all skin types'
  },
  { 
    id: 103, 
    name: 'Wellness Kit', 
    slug: 'wellness-kit', 
    price: 89.99, 
    image: '/assets/products/placeholder.png', 
    badge: 'New', 
    ratingValue: 5.0, 
    category: { slug: 'health-wellness', name: 'Health & Wellness' },
    shortBenefit: 'Complete recovery solution'
  }
];

export const FALLBACK_TESTIMONIALS = [
  { id: 1, name: 'Sarah J.', location: 'United States', quote: 'Absolutely love the quality of the home essentials. The delivery was fast and the products are stunning.', rating: 5 },
  { id: 2, name: 'Ahmed K.', location: 'Dubai, UAE', quote: 'mrt International has become my go-to for unique tech accessories. Truly global service.', rating: 5 },
  { id: 3, name: 'Elena R.', location: 'London, UK', quote: 'The beauty products are artisanal and perform better than high-street brands. Exquisite selection.', rating: 5 }
];
