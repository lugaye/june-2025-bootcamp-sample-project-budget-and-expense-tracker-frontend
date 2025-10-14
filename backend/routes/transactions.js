// routes/transactions.js
const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Create transaction
router.post('/', auth, async (req, res) => {
  const { category_id, type, amount, note, date } = req.body;
  const user_id = req.user.userId;
  if (!category_id || !amount || !date) return res.status(400).json({ message: 'Missing required' });
  try {
    const [result] = await pool.query(
      'INSERT INTO transactions (user_id, category_id, type, amount, note, date) VALUES (?,?,?,?,?,?)',
      [user_id, category_id, type, amount, note || '', date]
    );
    res.json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get transactions for user
router.get('/', auth, async (req, res) => {
  const user_id = req.user.userId;
  try {
    const [rows] = await pool.query(
      `SELECT t.*, c.name as category_name FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = ? ORDER BY t.date DESC LIMIT 200`, [user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete transaction
router.delete('/:id', auth, async (req, res) => {
  const user_id = req.user.userId;
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM transactions WHERE id = ? AND user_id = ?', [id, user_id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Summary (category totals)
router.get('/summary/by-category', auth, async (req, res) => {
  const user_id = req.user.userId;
  try {
    const [rows] = await pool.query(
      `SELECT c.name, c.type, SUM(t.amount) as total
       FROM transactions t
       JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = ?
       GROUP BY c.id`, [user_id]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
