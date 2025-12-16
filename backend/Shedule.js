const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// Schedule Schema
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

// Sample schedule data for 6 days and 5 periods
const sampleSchedule = [
  {
    day: 'Monday',
    periods: [
      { periodNumber: 1, startTime: '08:30', endTime: '09:20', subject: 'Mathematics', faculty: 'Ms. Theepa', room: 'Room 101' },
      { periodNumber: 2, startTime: '09:20', endTime: '10:10', subject: 'Python', faculty: 'Ms. Thanarani', room: 'Lab 201' },
      { periodNumber: 3, startTime: '10:10', endTime: '10:30', subject: 'Break' ,faculty:'college faculty', room:'auditorium'},
      { periodNumber: 4, startTime: '10:30', endTime: '11:20', subject: 'Tamil', faculty: 'Ms. Santhi rani', room: 'Computer Lab' },
      { periodNumber: 5, startTime: '11:20', endTime: '12:10', subject: 'English', faculty: 'Ms. babiya ', room: 'Room 102' },
      { periodNumber: 6, startTime: '12:10', endTime: '01:00', subject: 'RDBMS', faculty: 'Ms. Sweetlin', room: 'Lab 202' }
    ]
  },
  {
    day: 'Tuesday',
    periods: [
      { periodNumber: 1, startTime: '08:30', endTime: '09:20', subject: 'Python', faculty: 'Ms. Thanarani', room: 'Lab 201' },
      { periodNumber: 2, startTime: '09:20', endTime: '10:10', subject: 'Mathematics', faculty: 'Ms. Theepa', room: 'Room 101' },
      { periodNumber: 3, startTime: '10:10', endTime: '10:30', subject: 'Break',faculty:'college faculty', room:'auditorium'},
      { periodNumber: 4, startTime: '10:30', endTime: '11:20', subject: 'Chemistry', faculty: 'Dr. Sanjay Patel', room: 'Lab 202' },
      { periodNumber: 5, startTime: '11:20', endTime: '12:10', subject: 'Physics', faculty: 'Dr. Priya Sharma', room: 'Lab 201' },
      { periodNumber: 6, startTime: '12:10', endTime: '01:00', subject: 'Physical Education', faculty: 'Mr. Ravi Thakur', room: 'Sports Ground' }
    ]
  },
  {
    day: 'Wednesday',
    periods: [
      { periodNumber: 2, startTime: '08:30', endTime: '09:20', subject: 'Python', faculty: 'Ms. Thanarani', room: 'Lab 201' },
      { periodNumber: 2, startTime: '09:20', endTime: '10:10', subject: 'Mathematics', faculty: 'Dr. Rajesh Kumar', room: 'Room 101' },
      { periodNumber: 3, startTime: '10:10', endTime: '10:30', subject: 'Break',faculty:'college faculty' , room:'auditorium'},
      { periodNumber: 1, startTime: '10:30', endTime: '11:20', subject: 'Mathematics', faculty: 'Ms. Theepa', room: 'Room 101' },
      { periodNumber: 4, startTime: '11:20', endTime: '12:10', subject: 'Chemistry Lab', faculty: 'Dr. Sanjay Patel', room: 'Lab 202' },
      { periodNumber: 5, startTime: '12:10', endTime: '01:00', subject: 'Library', faculty: 'Mrs. Geeta Rao', room: 'Library' }
    ]
  },
  {
    day: 'Thursday',
    periods: [
      { periodNumber: 1, startTime: '08:30', endTime: '09:20', subject: 'Chemistry', faculty: 'Dr. Sanjay Patel', room: 'Lab 202' },
      { periodNumber: 2, startTime: '09:20', endTime: '10:10', subject: 'Computer Science', faculty: 'Prof. Arjun Mehta', room: 'Computer Lab' },
      { periodNumber: 3, startTime: '10:10', endTime: '10:30', subject: 'Break' ,faculty:'college faculty', room:'auditorium'},
      { periodNumber: 3, startTime: '10:30', endTime: '11:20', subject: 'Mathematics', faculty: 'Dr. Rajesh Kumar', room: 'Room 101' },
       { periodNumber: 1, startTime: '11:20', endTime: '12:10', subject: 'Mathematics', faculty: 'Ms. Theepa', room: 'Room 101' },
      { periodNumber: 2, startTime: '12:10', endTime: '01:00', subject: 'Python', faculty: 'Ms. Thanarani', room: 'Lab 201' },
    ]
    },
  {
    day: 'Friday',
    periods: [
      { periodNumber: 1, startTime: '08:30', endTime: '09:20', subject: 'Physics', faculty: 'Dr. Priya Sharma', room: 'Lab 201' },
      { periodNumber: 2, startTime: '09:20', endTime: '10:10', subject: 'English', faculty: 'Ms. Anjali Verma', room: 'Room 102' },
      { periodNumber: 3, startTime: '10:10', endTime: '10:30', subject: 'Break' ,faculty:'college faculty', room:'auditorium'},
      { periodNumber: 3, startTime: '10:30', endTime: '11:20', subject: 'Mathematics', faculty: 'Dr. Rajesh Kumar', room: 'Room 101' },
      { periodNumber: 2, startTime: '11:20', endTime: '12:10', subject: 'Python', faculty: 'Ms. Thanarani', room: 'Lab 201' },
      { periodNumber: 1, startTime: '12:10', endTime: '01:00', subject: 'Mathematics', faculty: 'Ms. Theepa', room: 'Room 101' },
    ]
  },
  {
    day: 'Saturday',
    periods: [
      { periodNumber: 1, startTime: '08:30', endTime: '09:20', subject: 'Mathematics', faculty: 'Ms. Theepa', room: 'Room 101' },
      { periodNumber: 2, startTime: '09:20', endTime: '10:10', subject: 'Mathematics', faculty: 'Dr. Rajesh Kumar', room: 'Room 101' },
      { periodNumber: 3, startTime: '10:10', endTime: '10:30', subject: 'Break' ,faculty:'college faculty', room:'auditorium'},
      { periodNumber: 3, startTime: '10:30', endTime: '11:20', subject: 'Chemistry', faculty: 'Dr. Sanjay Patel', room: 'Lab 202' },
      { periodNumber: 4, startTime: '11:20', endTime: '12:10', subject: 'Physics', faculty: 'Dr. Priya Sharma', room: 'Lab 201' },
      { periodNumber: 2, startTime: '12:10', endTime: '01:00', subject: 'Python', faculty: 'Ms. Thanarani', room: 'Lab 201' },
    ]
  }
];

// Insert schedule data into database
async function insertScheduleData() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔄 Starting schedule insertion...');

    // Clear existing data
    await Schedule.deleteMany({});
    console.log('🗑️  Cleared existing schedule data');

    // Insert new schedule data
    const result = await Schedule.insertMany(sampleSchedule);
    
    console.log('\n📊 Schedule Insertion Summary:');
    console.log(`✅ Inserted: ${result.length} days of schedule`);
    
    // Display inserted schedule
    const allSchedules = await Schedule.find({}).sort({ day: 1 });
    console.log('\n📚 Complete Weekly Schedule:');
    
    allSchedules.forEach(schedule => {
      console.log(`\n📅 ${schedule.day}:`);
      schedule.periods.forEach(period => {
        console.log(`   ${period.periodNumber}. ${period.startTime}-${period.endTime} | ${period.subject} | ${period.faculty} | ${period.room}`);
      });
    });

    console.log('\n🎯 Schedule API Endpoints:');
    console.log('GET /api/schedule          - Get full weekly schedule');
    console.log('GET /api/schedule/:day     - Get schedule for specific day');
    console.log('GET /api/current-period    - Get current period based on time');

  } catch (error) {
    console.error('❌ Error inserting schedule data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔗 MongoDB connection closed');
  }
}

// Run the insertion
insertScheduleData();