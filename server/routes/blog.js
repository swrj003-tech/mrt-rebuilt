import express from 'express';
import pool from '../db.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import { refreshInternalCache } from '../cache_service.js';
import { quoteId } from '../utils/sql.js';

const router = express.Router();

// Helper: Get table names dynamically (Super-Discovery)
async function getTables() {
  const [tables] = await pool.query('SHOW TABLES');
  const rawList = tables.map(t => Object.values(t)[0]);
  const lowerList = rawList.map(t => t.toLowerCase());
  const findTable = (target) => {
    const idx = lowerList.indexOf(target.toLowerCase());
    return idx !== -1 ? rawList[idx] : target;
  };

  // Auto-Create BlogPost table if missing
  const blogTableName = findTable('BlogPost');
  if (!rawList.includes(blogTableName) && !lowerList.includes('blogpost')) {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS BlogPost (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        coverImage VARCHAR(255),
        author VARCHAR(100) DEFAULT 'MRT Editorial',
        isPublished BOOLEAN DEFAULT false,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    return { blog: 'BlogPost' };
  }

  return { blog: blogTableName };
}

// PUBLIC: Get all published posts
router.get('/', async (req, res) => {
  try {
    const t = await getTables();
    const [posts] = await pool.query(`SELECT * FROM ${t.blog} WHERE isPublished = true ORDER BY createdAt DESC`);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// ADMIN: Get all posts (Drafts included)
router.get('/admin/all', authMiddleware, adminOnly, async (req, res) => {
  try {
    const t = await getTables();
    const [posts] = await pool.query(`SELECT * FROM ${t.blog} ORDER BY createdAt DESC`);
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// PUBLIC: Get one published post by slug
router.get('/:slug', async (req, res) => {
  try {
    const t = await getTables();
    const slug = String(req.params.slug || '').trim();
    if (!slug) return res.status(400).json({ error: 'Missing blog slug' });

    const [posts] = await pool.query(
      `SELECT * FROM ${quoteId(t.blog)} WHERE slug = ? AND isPublished = 1 LIMIT 1`,
      [slug]
    );

    if (!posts[0]) return res.status(404).json({ error: 'Post not found' });
    res.json(posts[0]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch blog post' });
  }
});

// ADMIN: Create a new post
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const t = await getTables();
    const { title, slug, excerpt, content, coverImage, author, isPublished } = req.body;
    const postSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const [result] = await pool.query(
      `INSERT INTO ${t.blog} (title, slug, excerpt, content, coverImage, author, isPublished) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, postSlug, excerpt || content.substring(0, 160), content, coverImage || null, author || 'MRT Editorial', isPublished ? 1 : 0]
    );
    
    refreshInternalCache();
    res.status(201).json({ id: result.insertId, title });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Update a post
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const t = await getTables();
    const { title, slug, excerpt, content, coverImage, author, isPublished } = req.body;
    
    await pool.query(
      `UPDATE ${t.blog} SET title=?, slug=?, excerpt=?, content=?, coverImage=?, author=?, isPublished=? WHERE id=?`,
      [title, slug, excerpt, content, coverImage, author, isPublished ? 1 : 0, req.params.id]
    );
    
    refreshInternalCache();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ADMIN: Delete a post
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const t = await getTables();
    await pool.query(`DELETE FROM ${t.blog} WHERE id = ?`, [req.params.id]);
    refreshInternalCache();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
