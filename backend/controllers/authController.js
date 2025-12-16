const Student = require('../models/Student');

const login = async (req, res) => {
  try {
    const { registerNo, password } = req.body;
    console.log(`Login attempt for Register No: ${registerNo}`);

    if (!registerNo || !password) {
      return res.status(400).json({ success: false, message: 'registerNo and password required' });
    }

    // Find student in MongoDB
    const student = await Student.findOne({ registerNo, password });
    
    if (student) {
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        user: { registerNo: student.registerNo },
        token: 'dummy-jwt-token'
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid register number or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  login
};