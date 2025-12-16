const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

// Announcement Schema
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

// Sample announcement data
const sampleAnnouncements = [
  {
    title: 'Holiday Announcement',
    message: 'College will remain closed on Monday for maintenance work. All classes will resume on Tuesday as per schedule.',
    type: 'holiday',
    priority: 'high',
    date: new Date('2025-11-23'),
    expiresAt: new Date('2025-11-24'),
    isActive: true
  },
  {
    title: 'Final Exam Schedule Published',
    message: 'The final examination schedule for the current semester has been published. Please check your student portal for detailed timetable.',
    type: 'exam',
    priority: 'high',
    date: new Date('2025-11-23'),
    expiresAt: new Date('2025-11-25'),
    isActive: true
  },
  {
    title: 'Library Hours Extended',
    message: 'Library hours have been extended until 8 PM from Monday to Friday for exam preparation.',
    type: 'academic',
    priority: 'medium',
    date: new Date('2025-11-22'),
    expiresAt: new Date('2025-12-1'),
    isActive: true
  },
  {
    title: 'Sports Day Registration',
    message: 'Registration for annual sports day events is now open. Last date to register is January 25th.',
    type: 'general',
    priority: 'medium',
    date: new Date('2025-11-21'),
    expiresAt: new Date('2025-11-26'),
    isActive: true
  },
  {
    title: 'Fee Payment Reminder',
    message: 'Last date for fee payment for the current semester is January 30th. Late payments will attract penalty.',
    type: 'urgent',
    priority: 'high',
    date: new Date('2025-11-10'),
    expiresAt: new Date('2025-11-31'),
    isActive: true
  },
  {
    title: 'Cultural Fest Rehearsals',
    message: 'Rehearsals for annual cultural fest will begin from next week. Interested students contact cultural committee.',
    type: 'general',
    priority: 'low',
    date: new Date('2025-11-09'),
    expiresAt: new Date('2025-12-10'),
    isActive: true
  }
];

// Insert announcement data into database
async function insertAnnouncementData() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔄 Starting announcement insertion...');

    // Clear existing data
    await Announcement.deleteMany({});
    console.log('🗑️  Cleared existing announcement data');

    // Insert new announcement data
    const result = await Announcement.insertMany(sampleAnnouncements);
    
    console.log('\n📊 Announcement Insertion Summary:');
    console.log(`✅ Inserted: ${result.length} announcements`);
    
    // Display inserted announcements
    const allAnnouncements = await Announcement.find({}).sort({ date: -1 });
    console.log('\n📢 Current Announcements:');
    
    allAnnouncements.forEach(announcement => {
      console.log(`\n📌 ${announcement.title}`);
      console.log(`   Type: ${announcement.type} | Priority: ${announcement.priority}`);
      console.log(`   Message: ${announcement.message}`);
      console.log(`   Date: ${announcement.date.toLocaleDateString()}`);
    });

    console.log('\n🎯 Announcement API Endpoints:');
    console.log('GET /api/announcements          - Get all active announcements');
    console.log('GET /api/announcements/latest   - Get latest 5 announcements');
    console.log('POST /api/announcements         - Create new announcement (admin)');

  } catch (error) {
    console.error('❌ Error inserting announcement data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔗 MongoDB connection closed');
  }
}

// Run the insertion
insertAnnouncementData();