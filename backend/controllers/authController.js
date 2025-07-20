const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Student login handler
exports.studentLoginHandler = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, role: 'student' });

    if (!user) return res.status(404).json({ msg: 'Student not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role: user.role, username: user.username });
  } catch (error) {
    console.error("Student Login Error:", error);
    res.status(500).json({ msg: 'Server error' });
  }
};

// Warden login handler
exports.wardenLoginHandler = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, role: 'warden' });

    if (!user) return res.status(404).json({ msg: 'Warden not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role: user.role, username: user.username });
  } catch (error) {
    console.error("Warden Login Error:", error);
    res.status(500).json({ msg: 'Server error' });
  }
};
