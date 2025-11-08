import express from 'express';
import auth from '../middleware/auth.js';
import Content from '../models/Content.js';

const router = express.Router();

// Get content by page (public route)
router.get('/:page', async (req, res) => {
  try {
    const content = await Content.findOne({ page: req.params.page });
    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all content (admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const content = await Content.find().sort({ page: 1 });
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update content (admin only)
router.put('/:page', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const content = await Content.findOneAndUpdate(
      { page: req.params.page },
      { 
        ...req.body,
        lastUpdated: new Date()
      },
      { new: true, upsert: true, runValidators: true }
    );

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;