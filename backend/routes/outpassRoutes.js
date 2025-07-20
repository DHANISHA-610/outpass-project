const express = require('express');
const router = express.Router();
const Outpass = require('../models/Outpass');
const auth = require('../middleware/authMiddleware');

// Submit outpass
router.post('/submit', auth, async (req, res) => {
  const outpass = new Outpass(req.body);
  await outpass.save();
  res.json({ msg: 'Outpass submitted' });
});

// Get all requests (warden only)
router.get('/requests', auth, async (req, res) => {
  if (req.user.role !== 'warden') return res.status(403).json({ msg: 'Access denied' });

  const requests = await Outpass.find();
  res.json(requests);
});

// Approve or disapprove
router.put('/update/:id', auth, async (req, res) => {
  const { status } = req.body;
  await Outpass.findByIdAndUpdate(req.params.id, { status });
  res.json({ msg: `Request ${status}` });
});

module.exports = router;
