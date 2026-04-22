import express from 'express';
import prisma from '../db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Required fields missing.' });
    }

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
      },
    });

    res.status(201).json({ success: true, message: 'Message sent' });
  } catch (error) {
    console.error('Contact form submission failed:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
