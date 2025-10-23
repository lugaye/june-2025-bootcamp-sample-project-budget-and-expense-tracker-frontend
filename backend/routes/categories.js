// routes/categories.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Get all categories
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Add category (admin/extendable — left open for demo)
router.post('/', auth, async (req, res) => {
  const { name, type } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO categories (name, type) VALUES (?,?)', [name, type]);
    res.json({ id: result.insertId, name, type });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
