const Student = require('../models/Student');

const getProfile = async (req, res) => {
  try {
    const { registerNo } = req.body;
    
    console.log('Received getprofile request for:', registerNo);
    
    if (!registerNo) {
      return res.status(400).json({ success: false, message: 'registerNo is required' });
    }

    const student = await Student.findOne({ registerNo });
    
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    
    console.log(`Get profile request for Register No: ${registerNo}`);
    res.json({ 
      success: true, 
      student: {
        name: student.name,
        grade: student.grade,
        attendance: student.attendance,
        courses: student.courses,
        registerNo: student.registerNo,
        dob: student.dob,
        fees: student.fees
      }
    });
    
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getProfile
};