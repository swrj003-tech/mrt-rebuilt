import express from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db.js';
import { generateToken, authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    // Discovery: Table name might be 'User' or 'user'
    let user;
    try {
      const [rows] = await pool.query('SELECT * FROM User WHERE email = ?', [email]);
      user = rows[0];
    } catch {
      const [rows] = await pool.query('SELECT * FROM user WHERE email = ?', [email]);
      user = rows[0];
    }

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.passwordHash || user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken(user);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  } catch (err) {
    console.error('[AUTH] Login Error:', err.message);
    res.status(500).json({ error: 'Server error during authentication' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    let user;
    try {
      const [rows] = await pool.query('SELECT id, email, name, role FROM User WHERE id = ?', [req.user.id]);
      user = rows[0];
    } catch {
      const [rows] = await pool.query('SELECT id, email, name, role FROM user WHERE id = ?', [req.user.id]);
      user = rows[0];
    }
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
