import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';
import cacheService from './cache_service.js';

import authRouter from './routes/auth.js';
import adminRouter from './routes/admin.js';
import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import blogRouter from './routes/blog.js';
import testimonialRouter from './routes/testimonials.js';
import uploadRouter from './routes/upload.js';
import mediaRouter from './routes/media.js';
import contactRouter from './routes/contact.js';
import newsletterRouter from './routes/newsletter.js';
import reviewsRouter from './routes/reviews.js';
import affiliateRouter from './routes/affiliate.js';
import comparisonRouter from './routes/comparison.js';
import wishlistRouter from './routes/wishlist.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Trigger Hostinger Deployment
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

app.disable('x-powered-by');
app.set('trust proxy', 1);

const configuredOrigins = (process.env.CORS_ORIGINS || process.env.PRODUCTION_URL || 'https://mrtinternationalholding.com,https://www.mrtinternationalholding.com')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!isProduction || !origin || configuredOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('CORS origin denied'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

app.use(express.json({ limit: '1mb' }));
app.use('/api/', apiLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/contact', authLimiter);
app.use('/api/newsletter/subscribe', authLimiter);

cacheService.refreshInternalCache().then(() => {
  cacheService.startBackgroundCacheLoop(5 * 60 * 1000);
});

app.get('/api/categories', (req, res) => {
  res.json(cacheService.internalCache.categories || []);
});

app.get('/api/products', (req, res) => {
  const { category, search, limit = 50 } = req.query;
  let products = cacheService.internalCache.products || [];

  if (category) products = products.filter((p) => p.category && p.category.slug === category);
  if (search) {
    const query = String(search).toLowerCase();
    products = products.filter((p) => String(p.name || '').toLowerCase().includes(query));
  }

  const safeLimit = Math.min(Math.max(Number.parseInt(limit, 10) || 50, 1), 200);
  res.json({
    products: products.slice(0, safeLimit),
    total: products.length,
    status: cacheService.internalCache.status,
  });
});

app.get('/api/testimonials', (req, res) => {
  res.json(cacheService.internalCache.testimonials || []);
});

app.get('/api/blog', (req, res) => {
  res.json(cacheService.internalCache.blog || []);
});

if (!isProduction) {
  app.get('/api/test-db', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT 1 + 1 AS result');
      res.json({ status: 'connected', result: rows[0].result });
    } catch {
      res.status(500).json({ status: 'error' });
    }
  });

  app.get('/api/debug-db', async (req, res) => {
    try {
      const [tables] = await pool.query('SHOW TABLES');
      const tableNames = tables.map((table) => Object.values(table)[0]);
      const stats = {};
      for (const name of tableNames) {
        if (!/^[A-Za-z0-9_]+$/.test(name)) continue;
        const [[{ count }]] = await pool.query(`SELECT COUNT(*) as count FROM \`${name}\``);
        stats[name] = count;
      }
      res.json({ tables: stats, env: process.env.NODE_ENV || 'development' });
    } catch {
      res.status(500).json({ error: 'Debug check failed' });
    }
  });
}

app.get('/health', (req, res) => {
  res.json({
    status: cacheService.internalCache.status === 'ready' ? 'ready' : 'degraded',
    node: process.version,
  });
});

app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/blog', blogRouter);
app.use('/api/testimonials', testimonialRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/media', mediaRouter);
app.use('/api/contact', contactRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/affiliate', affiliateRouter);
app.use('/api/comparison', comparisonRouter);
app.use('/api/wishlist', wishlistRouter);

const distPath = path.join(__dirname, '..', 'dist');
const publicPath = path.join(__dirname, '..', 'public');
const uploadsPath = path.join(__dirname, '..', 'uploads');

const staticOptions = {
  dotfiles: 'deny',
  etag: true,
  maxAge: isProduction ? '1h' : 0,
};

app.use(express.static(distPath, staticOptions));
app.use(express.static(publicPath, staticOptions));
app.use('/uploads', express.static(uploadsPath, {
  dotfiles: 'deny',
  etag: true,
  maxAge: isProduction ? '30d' : 0,
}));

app.get('/admin', (req, res) => {
  res.sendFile(path.join(distPath, 'admin/index.html'));
});

app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(distPath, 'admin/index.html'));
});

app.get('*', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'));
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error('[SERVER]', err.message);
  res.status(err.status || 500).json({ error: 'Server error' });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MRT Server running on http://localhost:${PORT}`);
    console.log(`Serving static files from: ${distPath}`);
  });
}

export default app;
