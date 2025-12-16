const express = require('express');
const router = express.Router();
const { sendAttendanceOTP, markAttendance } = require('../controllers/attendanceController');

router.post('/send-attendance-otp', sendAttendanceOTP);
router.post('/mark-attendance', markAttendance);

module.exports = router;