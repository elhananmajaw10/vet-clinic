import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, name, email, password, phone, role } = req.body;
    
    // Check if username or email already exists
    const userExists = await User.findOne({
      $or: [{ email }, { username }]
    });
    
    if (userExists) {
      if (userExists.email === email) {
        return res.status(400).json({ message: 'Email already exists' });
      }
      if (userExists.username === username) {
        return res.status(400).json({ message: 'Username already exists' });
      }
    }

    const user = await User.create({
      username,
      name,
      email,
      password,
      phone,
      role: role || 'user'
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '30d',
    });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login with username
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user || !(await user.correctPassword(password))) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '30d',
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;