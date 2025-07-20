const express = require('express');
const router = express.Router();
const {
  studentLoginHandler,
  wardenLoginHandler
} = require('../controllers/authController');

// Student login route
router.post('/student/login', studentLoginHandler);

// Warden login route
router.post('/warden/login', wardenLoginHandler);

module.exports = router;
