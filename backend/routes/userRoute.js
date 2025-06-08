const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /users/:id - lấy thông tin người dùng (ẩn password)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    res.json(user);
  } catch (err) {
    console.error('Lỗi:', err);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

module.exports = router;
