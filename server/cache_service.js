import prisma from './db.js';
import path from 'path';
import fs from 'fs/promises';

// --- IN-MEMORY CACHE STORAGE ---
export const internalCache = {
  products: [],
  categories: [],
  testimonials: [],
  blog: [],
  lastRefreshed: null,
  status: 'initializing'
};

/**
 * REFRESH CACHE: The core of 'Nuclear Stability'.
 * Fetches all data from DB and stores in memory.
 * If DB fails, stays on old data or falls back to public JSON.
 */
export async function refreshInternalCache() {
  console.log('[CACHE] Refreshing in-memory data for 100% Stability...');
  try {
    const [products, categories, testimonials, blog] = await Promise.all([
      prisma.product.findMany({ include: { category: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.category.findMany({ include: { theme: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.testimonial.findMany({ where: { isActive: true }, orderBy: { sortOrder: 'asc' } }),
      prisma.blogPost.findMany({ where: { isPublished: true }, orderBy: { createdAt: 'desc' } })
    ]);

    internalCache.products = products;
    internalCache.categories = categories;
    internalCache.testimonials = testimonials;
    internalCache.blog = blog;
    internalCache.lastRefreshed = new Date();
    internalCache.status = 'ready';
    console.log(`[CACHE] Success! Serving ${products.length} products with absolute speed.`);
    
    return true;
  } catch (err) {
    console.error('[CACHE] DB unreachable! Entering fail-over mode:', err.message);
    internalCache.status = 'fail-over';
    
    // --- EMERGENCY FAIL-OVER: Fall back to local JSON files ---
    try {
      const pPath = path.join(process.cwd(), 'public', 'api', 'products.json');
      const raw = await fs.readFile(pPath, 'utf8');
      const data = JSON.parse(raw);
      // Ensure we extract the products array if it's wrapped in an object
      internalCache.products = Array.isArray(data) ? data : (data.products || []);
      internalCache.categories = data.categories || [];
      console.log(`[CACHE] Fail-over loaded: ${internalCache.products.length} products from JSON`);
    } catch (fsErr) {
      console.error('[CACHE] Critical: Static products.json also missing.');
    }
    
    return false;
  }
}

/**
 * INIT BACKGROUND LOOP
 * Ensures data stays fresh without ever blocking a user request.
 */
export function startBackgroundCacheLoop(intervalMs = 300000) {
  // Initial fill
  refreshInternalCache();
  
  // Established 5-minute background loop
  setInterval(refreshInternalCache, intervalMs);
}

export default {
  internalCache,
  refreshInternalCache,
  startBackgroundCacheLoop
};
