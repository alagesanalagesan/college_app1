// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  registerNo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  name: { type: String },
  email: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
