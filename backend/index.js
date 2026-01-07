const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();

const dotenv = require('dotenv');
dotenv.config();

const crypto = require('crypto');
const nodemailer = require('nodemailer');

const PORT = 5000;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Student Schema
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

const Student = mongoose.model('Student', studentSchema);

// Attendance Schema
const attendanceSchema = new mongoose.Schema({
  registerNo: { type: String, required: true },
  name: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD format
  timestamp: { type: Date, required: true },
  status: { type: String, enum: ['present', 'absent'], default: 'present' },
  markedWith: { type: String, default: 'class-otp' } // Add this field
});

// Compound index to prevent duplicate attendance for same day
attendanceSchema.index({ registerNo: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Server running', time: new Date().toISOString() });
});

// Login endpoint
app.post('/login', async (req, res) => {
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
});

app.post('/getprofile', async (req, res) => {
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
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Store single class OTP
let classOtpData = null;

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to update student attendance percentage - ADD THIS
async function updateStudentAttendance(registerNo) {
  try {
    // Get total working days (count distinct dates)
    const totalDaysResult = await Attendance.aggregate([
      { $group: { _id: "$date" } },
      { $count: "totalDays" }
    ]);
    
    const totalDays = totalDaysResult.length > 0 ? totalDaysResult[0].totalDays : 1;
    
    // Get present days for this student
    const presentDays = await Attendance.countDocuments({ 
      registerNo, 
      status: 'present' 
    });
    
    // Calculate attendance percentage
    const attendancePercentage = totalDays > 0 
      ? Math.round((presentDays / totalDays) * 100) 
      : 0;

    // Update student's attendance percentage
    await Student.findOneAndUpdate(
      { registerNo },
      { attendance: attendancePercentage }
    );

    console.log(`Updated attendance for ${registerNo}: ${attendancePercentage}%`);
  } catch (error) {
    console.error('Error updating attendance percentage:', error);
  }
}

// Send SINGLE CLASS OTP to teacher
app.post('/send-attendance-otp', async (req, res) => {
  try {
    const { registerNo } = req.body;
    
    console.log('Class OTP request from:', registerNo);
    
    if (!registerNo) {
      return res.status(400).json({ 
        success: false, 
        message: 'Register number is required' 
      });
    }

    // Check if student exists
    const student = await Student.findOne({ registerNo });
    if (!student) {
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    // Check if class OTP already exists and is still valid
    if (classOtpData && new Date() < classOtpData.expiresAt) {
      console.log('Using existing class OTP:', classOtpData.otp);
      
      res.json({ 
        success: true, 
        message: 'Class verification code is available',
        isClassOtp: true
      });
      return;
    }

    // Generate NEW class OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes for class

    // Store class OTP
    classOtpData = {
      otp,
      expiresAt,
      createdAt: new Date(),
      totalUses: 0,
      usedBy: []
    };

    console.log(`🎯 New CLASS OTP Generated: ${otp} (Valid for 30 minutes)`);

    // Send email to TEACHER with class OTP
    const mailOptions = {
      from: `"GTN College Attendance System" <${process.env.EMAIL_USER}>`,
      to: process.env.CLASS_USER,
      subject: `📚 CLASS ATTENDANCE OTP - ${new Date().toLocaleDateString('en-IN')}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }
                .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .header { background: #2E86AB; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; margin: -30px -30px 20px -30px; }
                .class-otp { font-size: 42px; font-weight: bold; color: #2E86AB; text-align: center; margin: 25px 0; padding: 20px; background: #e3f2fd; border-radius: 15px; letter-spacing: 8px; border: 3px dashed #2E86AB; }
                .info-box { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
                .urgent { background: #fff3cd; border: 2px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 15px 0; font-weight: bold; }
                .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎓 GTN ARTS COLLEGE</h1>
                    <p>Class Attendance Verification System</p>
                </div>
                
                <h2>📚 TODAY'S CLASS VERIFICATION CODE</h2>
                
                <div class="urgent">
                    🎯 SHARE THIS CODE WITH THE ENTIRE CLASS
                </div>
                
                <div class="class-otp">${otp}</div>
                
                <div class="info-box">
                    <h3>📋 Code Information:</h3>
                    <p><strong>Valid For:</strong> Entire Class (All Students)</p>
                    <p><strong>Expires At:</strong> ${expiresAt.toLocaleTimeString('en-IN')}</p>
                    <p><strong>Duration:</strong> 30 minutes</p>
                    <p><strong>Requested By:</strong> ${student.registerNo} - ${student.name}</p>
                </div>
                
                <div class="urgent">
                    🔒 Students can use this SAME CODE to mark their attendance
                </div>
                
                <p><strong>📍 Announce this code to the class once.</strong></p>
                <p><strong>⏰ Code will automatically expire after 30 minutes.</strong></p>
                
                <div class="footer">
                    <p>This is an automated message from GTN College Class Attendance System.</p>
                    <p>Generated at: ${new Date().toLocaleString('en-IN')}</p>
                </div>
            </div>
        </body>
        </html>
      `
    };

    // Send email to teacher
    await transporter.sendMail(mailOptions);
    console.log(`✅ Class OTP email sent to teacher: ${otp}`);

    res.json({ 
      success: true, 
      message: 'Class verification code generated successfully!',
      isClassOtp: true
    });
    
  } catch (error) {
    console.error('Error sending class OTP:', error);
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate class verification code. Please try again.' 
    });
  }
});

// Mark Attendance with CLASS OTP
app.post('/mark-attendance', async (req, res) => {
  try {
    const { registerNo, otp } = req.body;
    
    console.log('🔍 Mark attendance request:', { registerNo, otp });
    
    if (!registerNo || !otp) {
      console.log('❌ Missing required fields');
      return res.status(400).json({ 
        success: false, 
        message: 'Register number and OTP are required' 
      });
    }

    // Check if student exists
    const student = await Student.findOne({ registerNo });
    if (!student) {
      console.log('❌ Student not found:', registerNo);
      return res.status(404).json({ 
        success: false, 
        message: 'Student not found' 
      });
    }

    console.log('✅ Student found:', student.name);

    // Check if class OTP exists and is valid
    if (!classOtpData) {
      console.log('❌ No class OTP available');
      return res.status(400).json({ 
        success: false, 
        message: 'No class verification code available. Please ask your teacher to generate one.' 
      });
    }

    // Check if class OTP expired
    if (new Date() > classOtpData.expiresAt) {
      console.log('❌ Class OTP expired');
      classOtpData = null;
      return res.status(400).json({ 
        success: false, 
        message: 'Class verification code has expired. Please ask your teacher for a new one.' 
      });
    }

    console.log('✅ Class OTP is valid');

    // Verify CLASS OTP
    if (classOtpData.otp !== otp) {
      console.log('❌ Invalid OTP. Provided:', otp, 'Expected:', classOtpData.otp);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid verification code. Please check the code announced in class.' 
      });
    }

    console.log('✅ OTP verified successfully');

    // Check if this student already used this OTP
    if (classOtpData.usedBy.includes(registerNo)) {
      console.log('❌ Student already used OTP:', registerNo);
      return res.status(400).json({ 
        success: false, 
        message: 'You have already marked attendance with this code.' 
      });
    }

    // Check if attendance already marked today
    const today = new Date().toISOString().split('T')[0];
    const existingAttendance = await Attendance.findOne({
      registerNo,
      date: today
    });

    if (existingAttendance) {
      console.log('❌ Attendance already marked for today:', registerNo);
      return res.status(400).json({ 
        success: false, 
        message: 'Attendance already marked for today.' 
      });
    }

    console.log('✅ No existing attendance for today');

    // Check college timing (9 AM to 5 PM)
    const currentHour = new Date().getHours();
    if (currentHour < 9 || currentHour >= 17) {
      console.log('❌ Outside college hours. Current hour:', currentHour);
      return res.status(400).json({ 
        success: false, 
        message: 'Attendance can only be marked between 9 AM and 5 PM' 
      });
    }

    console.log('✅ Within college hours');

    // Mark attendance
    const newAttendance = new Attendance({
      registerNo: student.registerNo,
      name: student.name,
      date: today,
      timestamp: new Date(),
      status: 'present',
      markedWith: 'class-otp'
    });

    await newAttendance.save();
    console.log('✅ Attendance saved to database');

    // Update class OTP usage
    classOtpData.usedBy.push(registerNo);
    classOtpData.totalUses++;

    console.log(`✅ Attendance marked for: ${registerNo} - ${student.name}`);
    console.log(`📊 Class OTP used by: ${classOtpData.totalUses} students`);

    // Update student's attendance percentage
    await updateStudentAttendance(registerNo);

    res.json({ 
      success: true, 
      message: 'Attendance marked successfully!',
      studentName: student.name,
      totalClassMarked: classOtpData.totalUses
    });
    
  } catch (error) {
    console.error('❌ Error marking attendance:', error);
    console.error('❌ Error details:', error.message);
    
    res.status(500).json({ 
      success: false, 
      message: 'Failed to mark attendance. Please try again.' 
    });
  }
});








const scheduleSchema = new mongoose.Schema({
  day: { 
    type: String, 
    required: true,
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  },
  periods: [{
    periodNumber: { type: Number, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    subject: { type: String, required: true },
    faculty: { type: String, required: true },
    room: { type: String, required: true }
  }]
});

const Schedule = mongoose.model('Schedule', scheduleSchema);






app.get('/schedule-today', async (req, res) => {
  try {
    const now = new Date();
    const weekdayNames = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    let today = weekdayNames[now.getDay()]; // guaranteed English weekday

    
    try {
      const localeName = now.toLocaleDateString('en-US', { weekday: 'long' });
      if (typeof localeName === 'string' && localeName.length > 0) {
        today = localeName;
      }
    } catch (e) {
      // ignore and use mapping
    }

    const  today1='Tuesday'
    console.log(`[${new Date().toISOString()}] GET /schedule-today — today resolved to:`, today1);

    const todaySchedule = await Schedule.findOne({ day: today1 }).lean().exec();
    console.log('[schedule-today] DB result:', !!todaySchedule, todaySchedule ? todaySchedule.day : null);

    return res.json({
      success: true,
      today,
      schedule: todaySchedule || null
    });
  } catch (error) {
    console.error('Error fetching today schedule:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch today schedule',
      error: error.message
    });
  }
});















// Add Announcement Schema to your backend
const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['general', 'academic', 'holiday', 'exam', 'urgent'],
    default: 'general'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  date: { type: Date, default: Date.now },
  expiresAt: { type: Date },
  isActive: { type: Boolean, default: true }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

// Announcement Endpoints
app.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find({ 
      isActive: true,
      expiresAt: { $gt: new Date() }
    }).sort({ priority: -1, date: -1 });
    
    res.json({ 
      success: true, 
      announcements 
    });
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch announcements' 
    });
  }
});

app.get('/announcements/latest', async (req, res) => {
  try {
    const announcements = await Announcement.find({ 
      isActive: true,
      expiresAt: { $gt: new Date() }
    })
    .sort({ priority: -1, date: -1 })
    .limit(5);
    
    res.json({ 
      success: true, 
      announcements 
    });
  } catch (error) {
    console.error('Error fetching latest announcements:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch announcements' 
    });
  }
});

// Admin endpoint to create announcements
app.post('/announcements', async (req, res) => {
  try {
    const { title, message, type, priority, expiresAt } = req.body;
    
    if (!title || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and message are required' 
      });
    }

    const newAnnouncement = new Announcement({
      title,
      message,
      type: type || 'general',
      priority: priority || 'medium',
      expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days default
      isActive: true
    });

    await newAnnouncement.save();
    
    res.json({ 
      success: true, 
      message: 'Announcement created successfully',
      announcement: newAnnouncement
    });
  } catch (error) {
    console.error('Error creating announcement:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create announcement' 
    });
  }
});











app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
