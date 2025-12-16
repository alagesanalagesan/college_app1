const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection Pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'college_attendance',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('Connected to MySQL database');
    
    // Create tables if they don't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS attendance_today (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        reg_no VARCHAR(20) NOT NULL,
        student_name VARCHAR(100) NOT NULL,
        department VARCHAR(50) NOT NULL,
        status ENUM('Present','Absent','Late','Half-day') DEFAULT 'Present',
        time_in TIME,
        time_out TIME,
        remarks VARCHAR(255),
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id)
      )
    `);
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS attendance_history (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id INT NOT NULL,
        reg_no VARCHAR(20) NOT NULL,
        student_name VARCHAR(100) NOT NULL,
        department VARCHAR(50) NOT NULL,
        status ENUM('Present','Absent','Late','Half-day') DEFAULT 'Present',
        attendance_date DATE NOT NULL,
        time_in TIME,
        time_out TIME,
        remarks VARCHAR(255),
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id),
        INDEX idx_date (attendance_date)
      )
    `);
    
    connection.release();
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}
testConnection();

// Move yesterday's attendance to history
async function archiveYesterdayAttendance() {
  try {
    const connection = await pool.getConnection();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    // Check if yesterday's data already archived
    const [existing] = await connection.query(
      'SELECT 1 FROM attendance_history WHERE attendance_date = ? LIMIT 1',
      [yesterdayStr]
    );
    
    if (existing.length === 0) {
      // Get yesterday's data from attendance_today
      const [yesterdayData] = await connection.query(
        'SELECT * FROM attendance_today WHERE DATE(recorded_at) = ?',
        [yesterdayStr]
      );
      
      if (yesterdayData.length > 0) {
        // Insert into history
        for (const record of yesterdayData) {
          await connection.query(
            `INSERT INTO attendance_history 
            (student_id, reg_no, student_name, department, status, attendance_date, time_in, time_out, remarks)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              record.student_id,
              record.reg_no,
              record.student_name,
              record.department,
              record.status,
              yesterdayStr,
              record.time_in,
              record.time_out,
              record.remarks
            ]
          );
        }
        
        // Clear yesterday's data from today's table
        await connection.query(
          'DELETE FROM attendance_today WHERE DATE(recorded_at) = ?',
          [yesterdayStr]
        );
        
        console.log(`Archived ${yesterdayData.length} records from ${yesterdayStr}`);
      }
    }
    
    connection.release();
  } catch (err) {
    console.error('Error archiving yesterday attendance:', err);
  }
}

// Run archive job daily at midnight
setInterval(archiveYesterdayAttendance, 24 * 60 * 60 * 1000);
// Also run once on startup
archiveYesterdayAttendance();

// Mark attendance endpoint
app.post('/api/attendance', async (req, res) => {
  const { regNo, timeIn, timeOut, status = 'Present', remarks } = req.body;
  
  try {
    const connection = await pool.getConnection();
    
    try {
      // Find student by registration number
      const [students] = await connection.query(
        'SELECT id, reg_no, name, department FROM students WHERE reg_no = ?', 
        [regNo]
      );
      
      if (students.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Student not found'
        });
      }
      
      const student = students[0];
      const today = new Date().toISOString().split('T')[0];
      
      // Check if attendance already marked today
      const [existingAttendance] = await connection.query(
        'SELECT id FROM attendance_today WHERE student_id = ? AND DATE(recorded_at) = ?',
        [student.id, today]
      );
      
      if (existingAttendance.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Attendance already marked today'
        });
      }
      
      // Mark attendance in today's table
      const [result] = await connection.query(
        `INSERT INTO attendance_today 
        (student_id, reg_no, student_name, department, status, time_in, time_out, remarks) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          student.id,
          student.reg_no,
          student.name,
          student.department,
          status,
          timeIn,
          timeOut,
          remarks
        ]
      );
      
      // Get the full attendance record
      const [attendanceRecord] = await connection.query(
        `SELECT * FROM attendance_today WHERE id = ?`,
        [result.insertId]
      );
      
      res.json({
        success: true,
        message: 'Attendance marked successfully',
        data: attendanceRecord[0]
      });
      
    } finally {
      connection.release();
    }
    
  } catch (err) {
    console.error('Error marking attendance:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: err.message
    });
  }
});

// Get today's attendance
app.get('/api/attendance/today', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(
      `SELECT 
        id, reg_no, student_name, department, status, 
        TIME_FORMAT(time_in, '%H:%i') as time_in,
        TIME_FORMAT(time_out, '%H:%i') as time_out,
        remarks
       FROM attendance_today
       ORDER BY recorded_at DESC`
    );
    connection.release();
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get yesterday's attendance
app.get('/api/attendance/yesterday', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const [results] = await connection.query(
      `SELECT 
        id, reg_no, student_name, department, status,
        TIME_FORMAT(time_in, '%H:%i') as time_in,
        TIME_FORMAT(time_out, '%H:%i') as time_out,
        remarks
       FROM attendance_history
       WHERE attendance_date = ?
       ORDER BY recorded_at DESC`,
      [yesterdayStr]
    );
    connection.release();
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get attendance by date (YYYY-MM-DD format)
app.get('/api/attendance/date/:date', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(
      `SELECT 
        id, reg_no, student_name, department, status,
        TIME_FORMAT(time_in, '%H:%i') as time_in,
        TIME_FORMAT(time_out, '%H:%i') as time_out,
        remarks
       FROM attendance_history
       WHERE attendance_date = ?
       ORDER BY recorded_at DESC`,
      [req.params.date]
    );
    connection.release();
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Get attendance for a student by reg_no
app.get('/api/attendance/student/:regNo', async (req, res) => {
  try {
    const connection = await pool.getConnection();
    const [results] = await connection.query(
      `SELECT 
        id, attendance_date, status,
        TIME_FORMAT(time_in, '%H:%i') as time_in,
        TIME_FORMAT(time_out, '%H:%i') as time_out,
        remarks
       FROM attendance_history
       WHERE reg_no = ?
       ORDER BY attendance_date DESC
       LIMIT 30`,
      [req.params.regNo]
    );
    connection.release();
    res.json({ success: true, data: results });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Update today's attendance record
app.put('/api/attendance/today/:id', async (req, res) => {
  const { id } = req.params;
  const { status, timeIn, timeOut, remarks } = req.body;
  
  try {
    const connection = await pool.getConnection();
    
    try {
      await connection.query(
        `UPDATE attendance_today 
         SET status = ?, time_in = ?, time_out = ?, remarks = ?
         WHERE id = ?`,
        [status, timeIn, timeOut, remarks, id]
      );
      
      res.json({
        success: true,
        message: 'Attendance updated successfully'
      });
      
    } finally {
      connection.release();
    }
    
  } catch (err) {
    console.error('Error updating attendance:', err);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});