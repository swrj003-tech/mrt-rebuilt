import pool from './db.js';
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
  console.log('[CACHE] Refreshing in-memory data via Raw SQL...');
  try {
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Database timeout (5s)')), 5000));
    
    const fetchData = async () => {
      // --- TABLE DISCOVERY LOGIC ---
      const [tables] = await pool.query('SHOW TABLES');
      const tableList = tables.map(t => Object.values(t)[0].toLowerCase());
      
      const getTableName = (base) => {
        if (tableList.includes(base.toLowerCase())) {
          return tables.find(t => Object.values(t)[0].toLowerCase() === base.toLowerCase())[Object.keys(tables[0])[0]];
        }
        return base;
      };

      const productTable = getTableName('Product');
      const categoryTable = getTableName('Category');
      const testimonialTable = getTableName('Testimonial');
      const blogTable = getTableName('BlogPost');

      console.log(`[DB] Using tables: ${productTable}, ${categoryTable}`);

      const [products] = await pool.query(`SELECT p.*, c.slug as cat_slug, c.name as cat_name FROM ${productTable} p LEFT JOIN ${categoryTable} c ON p.categoryId = c.id ORDER BY p.sortOrder ASC`);
      const [categories] = await pool.query(`SELECT * FROM ${categoryTable} ORDER BY sortOrder ASC`);
      const [testimonials] = await pool.query(`SELECT * FROM ${testimonialTable} WHERE isActive = 1 ORDER BY sortOrder ASC`);
      const [blog] = await pool.query(`SELECT * FROM ${blogTable} WHERE isPublished = 1 ORDER BY createdAt DESC`);
      
      return {
        products: products.map(p => ({ ...p, category: { slug: p.cat_slug, name: p.cat_name } })),
        categories,
        testimonials,
        blog
      };
    };

    const data = await Promise.race([fetchData(), timeout]);

    internalCache.products = data.products;
    internalCache.categories = data.categories;
    internalCache.testimonials = data.testimonials;
    internalCache.blog = data.blog;
    internalCache.lastRefreshed = new Date();
    internalCache.status = 'ready';
    console.log(`[CACHE] Success! Serving ${data.products.length} products via Raw SQL.`);
    
    return true;
  } catch (err) {
    console.error('[CACHE] Raw SQL Failed! Entering fail-over mode:', err.message);
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
