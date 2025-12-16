const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  registerNo: { type: String, required: true },
  name: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD format
  timestamp: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent'], default: 'present' },
  markedWith: { type: String, default: 'class-otp' }
});

// Compound index to prevent duplicate attendance for same day
attendanceSchema.index({ registerNo: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);