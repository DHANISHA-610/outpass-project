// const express = require("express");
// const router = express.Router();
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// const User = require("../models/user");
// require("dotenv").config();

// // REGISTER
// router.post("/register", async (req, res) => {
//   try {
//     const { username, password, role } = req.body;
//     if (!username || !password || !role)
//       return res.status(400).json({ message: "All fields are required" });

//     const existingUser = await User.findOne({ username });
//     if (existingUser)
//       return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ username, password: hashedPassword, role });
//     await newUser.save();

//     res.status(201).json({ message: "User registered successfully" });
//   } catch (error) {
//     console.error("Registration Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // GENERAL LOGIN (Optional, can be removed if separate routes used)
// router.post("/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user)
//       return res.status(401).json({ message: "Invalid credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(401).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { id: user._id, username: user.username, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({ token, message: "Login successful", role: user.role });
//   } catch (error) {
//     console.error("Login Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // STUDENT LOGIN
// router.post("/student/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username, role: "student" });
//     if (!user)
//       return res.status(401).json({ message: "Invalid student credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(401).json({ message: "Invalid password" });

//     const token = jwt.sign(
//       { id: user._id, username: user.username, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({ token, username: user.username, role: user.role });
//   } catch (err) {
//     res.status(500).json({ message: "Student login failed", error: err.message });
//   }
// });

// // WARDEN LOGIN
// router.post("/warden/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username, role: "warden" });
//     if (!user)
//       return res.status(401).json({ message: "Invalid warden credentials" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(401).json({ message: "Invalid password" });

//     const token = jwt.sign(
//       { id: user._id, username: user.username, role: user.role },
//       process.env.JWT_SECRET,
//       { expiresIn: "1d" }
//     );

//     res.json({ token, username: user.username, role: user.role });
//   } catch (err) {
//     res.status(500).json({ message: "Warden login failed", error: err.message });
//   }
// });

// module.exports = router;




const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

// ✅ REGISTER ROUTE
router.post('/register', async (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!['student', 'warden'].includes(role)) {
    return res.status(400).json({ message: 'Role must be student or warden' });
  }

  try {
    const existingUser = await User.findOne({ username, role });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id, username: newUser.username, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        username: newUser.username,
        role: newUser.role
      },
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ STUDENT LOGIN ROUTE
router.post('/student/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, role: 'student' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      username: user.username,
      role: user.role
    });
  } catch (err) {
    console.error('Student login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ WARDEN LOGIN ROUTE
router.post('/warden/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username, role: 'warden' });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      username: user.username,
      role: user.role
    });
  } catch (err) {
    console.error('Warden login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
