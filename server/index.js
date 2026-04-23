import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';
import cacheService from './cache_service.js';

// --- ROUTERS ---
import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import blogRouter from './routes/blog.js';
import testimonialRouter from './routes/testimonials.js';
import uploadRouter from './routes/upload.js';
import mediaRouter from './routes/media.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// PRODUCTION: Minimal Middleware for Hostinger Stability
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// --- INITIALIZE NUCLEAR STABILITY CACHE ---
cacheService.refreshInternalCache().then(() => {
  cacheService.startBackgroundCacheLoop(5 * 60 * 1000); // 5 min interval
});

// --- PUBLIC HIGH-SPEED API (Served from Memory) ---

app.get('/api/categories', (req, res) => {
  res.json(cacheService.internalCache.categories || []);
});

app.get('/api/products', (req, res) => {
  const { category, search, limit = 50 } = req.query;
  let products = cacheService.internalCache.products || [];

  if (category) products = products.filter(p => p.category && p.category.slug === category);
  if (search) products = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  // Ensure consistent response structure for frontend
  res.json({
    products: products.slice(0, parseInt(limit)),
    total: products.length,
    status: cacheService.internalCache.status
  });
});

app.get('/api/testimonials', (req, res) => {
  res.json(cacheService.internalCache.testimonials || []);
});

app.get('/api/blog', (req, res) => {
  res.json(cacheService.internalCache.blog || []);
});

app.get('/api/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS result');
    res.json({ status: 'connected', result: rows[0].result, db: process.env.DATABASE_URL?.split('@')[1] });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message, stack: err.stack });
  }
});

app.get('/api/debug-db', async (req, res) => {
  try {
    const [tables] = await pool.query('SHOW TABLES');
    const tableNames = tables.map(t => Object.values(t)[0]);
    const stats = {};
    for (const name of tableNames) {
      const [[{ count }]] = await pool.query(`SELECT COUNT(*) as count FROM ${name}`);
      stats[name] = count;
    }
    res.json({ tables: stats, env: process.env.NODE_ENV, port: PORT });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    cache: cacheService.internalCache.status,
    lastRefresh: cacheService.internalCache.lastRefreshed
  });
});

// --- ADMIN & CRUD ROUTERS ---
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/blog', blogRouter);
app.use('/api/testimonials', testimonialRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/media', mediaRouter);

// --- STATIC ASSETS & SPA ROUTING ---
const distPath = path.join(__dirname, '..', 'dist');
const publicPath = path.join(__dirname, '..', 'public');

app.use(express.static(distPath));
app.use(express.static(publicPath));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Specific handler for /admin to ensure the dashboard loads
app.get('/admin', (req, res) => {
  res.sendFile(path.join(distPath, 'admin/index.html'));
});
app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(distPath, 'admin/index.html'));
});

// Universal SPA Fallback for the main site
app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 MRT Server running on http://localhost:${PORT}`);
    console.log(`📁 Serving from: ${distPath}`);
  });
}

export default app;
