// routes/budgets.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Create or update budget (month format: YYYY-MM)
router.post('/', auth, async (req, res) => {
  const { category_id, limit_amount, month } = req.body; // month = '2025-06'
  const user_id = req.user.userId;
  if (!category_id || !limit_amount || !month) return res.status(400).json({ message: 'Missing fields' });
  try {
    // Using INSERT ... ON DUPLICATE KEY UPDATE
    await pool.query(
      `INSERT INTO budgets (user_id, category_id, limit_amount, month)
       VALUES (?,?,?,?)
       ON DUPLICATE KEY UPDATE limit_amount = ?`,
      [user_id, category_id, limit_amount, month, limit_amount]
    );
    res.json({ message: 'Budget set' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get budgets for user
router.get('/', auth, async (req, res) => {
  const user_id = req.user.userId;
  try {
    const [rows] = await pool.query('SELECT b.*, c.name as category_name FROM budgets b JOIN categories c ON b.category_id = c.id WHERE b.user_id = ?', [user_id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
