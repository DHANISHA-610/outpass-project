const mongoose = require('mongoose');

const outpassSchema = new mongoose.Schema({
  name: String,
  studentId: String,
  department: String,
  reason: String,
  date: String,
  time: String,
  status: { type: String, default: 'pending' }
});

module.exports = mongoose.model('Outpass', outpassSchema);
