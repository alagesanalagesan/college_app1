const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  registerNo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  grade: { type: Number, required: true },
  attendance: { type: Number, required: true },
  courses: { type: Number, required: true },
  fees: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);