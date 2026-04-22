import { Router } from 'express';
import prisma from '../db.js';
import { refreshInternalCache } from '../cache_service.js';

const router = Router();

// PUBLIC: Get all published blog posts
router.get('/', async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (err) {
    console.error('Blog fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch blog posts' });
  }
});

// PUBLIC: Get a single blog post by slug
router.get('/post/:slug', async (req, res) => {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug: req.params.slug },
    });
    if (!post || !post.isPublished) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// ADMIN: Get all blog posts (including drafts)
router.get('/admin/all', async (req, res) => {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// ADMIN: Create a new blog post
router.post('/', async (req, res) => {
  try {
    const { title, slug, excerpt, content, coverImage, author, isPublished } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }
    const postSlug = slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: postSlug,
        excerpt: excerpt || content.substring(0, 160),
        content,
        coverImage: coverImage || null,
        author: author || 'MRT Editorial',
        isPublished: isPublished || false,
      },
    });
    refreshInternalCache();
    res.status(201).json(post);
  } catch (err) {
    console.error('Blog create error:', err);
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'A post with this slug already exists' });
    }
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// ADMIN: Update a blog post
router.put('/:id', async (req, res) => {
  try {
    const { title, slug, excerpt, content, coverImage, author, isPublished } = req.body;
    const post = await prisma.blogPost.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content && { content }),
        ...(coverImage !== undefined && { coverImage }),
        ...(author && { author }),
        ...(isPublished !== undefined && { isPublished }),
      },
    });
    res.json(post);
  } catch (err) {
    console.error('Blog update error:', err);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// ADMIN: Delete a blog post
router.delete('/:id', async (req, res) => {
  try {
    await prisma.blogPost.delete({
      where: { id: parseInt(req.params.id) },
    });
    refreshInternalCache();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

export default router;
