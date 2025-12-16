const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

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

// Sample data for 20 students
const sampleStudents = [
  {
    registerNo: '24UCSE001',
    password: '24UCSE001',
    name: 'Valan Joshwa',
    dob: new Date('2003-05-15'),
    grade: 7.1,
    attendance: 85,
    courses: 4,
    fees: 16000
  },
  {
    registerNo: '24UCSE002',
    password: '24UCSE002',
    name: 'Giri Prasath',
    dob: new Date('2003-07-22'),
    grade: 6.2,
    attendance: 75,
    courses: 8,
    fees: 16000
  },
  {
    registerNo: '24UCSE003',
    password: '24UCSE003',
    name: 'Raghul',
    dob: new Date('2003-03-10'),
    grade: 6.8,
    attendance: 73,
    courses: 3,
    fees: 16000
  },
  {
    registerNo: '24UCSE004',
    password: '24UCSE004',
    name: 'Askar Haneef',
    dob: new Date('2003-11-30'),
    grade: 8.5,
    attendance: 89,
    courses: 6,
    fees: 14000
  },
  {
    registerNo: '24UCSE005',
    password: '24UCSE005',
    name: 'Dhivakar',
    dob: new Date('2003-01-25'),
    grade: 9.2,
    attendance: 95,
    courses: 5,
    fees: 13000
  },
  {
    registerNo: '24UCSE006',
    password: '24UCSE006',
    name: 'Priya',
    dob: new Date('2003-08-14'),
    grade: 8.6,
    attendance: 88,
    courses: 6,
    fees: 16000
  },
  {
    registerNo: '24UCSE007',
    password: '24UCSE007',
    name: 'Alagesan',
    dob: new Date('2006-02-26'),
    grade: 8.5,
    attendance: 73,
    courses: 10,
    fees: 16000
  },
  {
    registerNo: '24UCSE008',
    password: '24UCSE008',
    name: 'Sneha Patel',
    dob: new Date('2003-04-18'),
    grade: 7.8,
    attendance: 82,
    courses: 7,
    fees: 7000
  },
  {
    registerNo: '24UCSE009',
    password: '24UCSE009',
    name: 'Rahul Kumar',
    dob: new Date('2003-09-09'),
    grade: 6.5,
    attendance: 78,
    courses: 5,
    fees: 16000
  },
  {
    registerNo: '24UCSE010',
    password: '24UCSE010',
    name: 'Anjali Singh',
    dob: new Date('2003-06-28'),
    grade: 9.0,
    attendance: 92,
    courses: 8,
    fees: 13500
  },
  {
    registerNo: '24UCSE011',
    password: '24UCSE011',
    name: 'Karthik M',
    dob: new Date('2003-02-14'),
    grade: 7.2,
    attendance: 79,
    courses: 6,
    fees: 14000
  },
  {
    registerNo: '24UCSE012',
    password: '24UCSE012',
    name: 'Meera Nair',
    dob: new Date('2003-10-11'),
    grade: 8.8,
    attendance: 90,
    courses: 7,
    fees: 16000
  },
  {
    registerNo: '24UCSE013',
    password: '24UCSE013',
    name: 'Vikram Raj',
    dob: new Date('2003-07-07'),
    grade: 6.9,
    attendance: 76,
    courses: 4,
    fees: 16000
  },
  {
    registerNo: '24UCSE014',
    password: '24UCSE014',
    name: 'Divya R',
    dob: new Date('2003-05-30'),
    grade: 8.3,
    attendance: 87,
    courses: 9,
    fees: 12000
  },
  {
    registerNo: '24UCSE015',
    password: '24UCSE015',
    name: 'Arun Kumar',
    dob: new Date('2003-03-22'),
    grade: 7.5,
    attendance: 81,
    courses: 5,
    fees: 12000
  },
  {
    registerNo: '24UCSE016',
    password: '24UCSE016',
    name: 'Swetha G',
    dob: new Date('2003-11-08'),
    grade: 9.1,
    attendance: 94,
    courses: 8,
    fees: 16000
  },
  {
    registerNo: '24UCSE017',
    password: '24UCSE017',
    name: 'Manoj P',
    dob: new Date('2003-01-19'),
    grade: 6.7,
    attendance: 74,
    courses: 6,
    fees: 15000
  },
  {
    registerNo: '24UCSE018',
    password: '24UCSE018',
    name: 'Deepa S',
    dob: new Date('2003-08-25'),
    grade: 8.6,
    attendance: 89,
    courses: 7,
    fees: 16000
  },
  {
    registerNo: '24UCSE019',
    password: '24UCSE019',
    name: 'Suresh K',
    dob: new Date('2003-04-12'),
    grade: 7.9,
    attendance: 83,
    courses: 5,
    fees: 13000
  },
  {
    registerNo: '24UCSE020',
    password: '24UCSE020',
    name: 'Lakshmi Priya',
    dob: new Date('2003-12-15'),
    grade: 8.9,
    attendance: 91,
    courses: 9,
    fees: 14500
  }
];

async function updateOrInsertStudents() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔄 Starting update/insert operation...');

    let insertedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    // Process each student one by one
    for (const studentData of sampleStudents) {
      try {
        // Try to find existing student by registerNo
        const existingStudent = await Student.findOne({ 
          registerNo: studentData.registerNo 
        });

        if (existingStudent) {
          // Update existing student but PRESERVE THE PASSWORD
          const updateData = { ...studentData };
          delete updateData.password; // Don't update password if it exists
          
          await Student.findOneAndUpdate(
            { registerNo: studentData.registerNo },
            updateData,
            { new: true }
          );
          updatedCount++;
          console.log(`✅ Updated: ${studentData.registerNo} - ${studentData.name}`);
        } else {
          // Insert new student
          await Student.create(studentData);
          insertedCount++;
          console.log(`✅ Inserted: ${studentData.registerNo} - ${studentData.name}`);
        }
      } catch (error) {
        if (error.code === 11000) {
          // Duplicate key error - skip this record
          skippedCount++;
          console.log(`⚠️ Skipped (duplicate): ${studentData.registerNo}`);
        } else {
          console.error(`❌ Error processing ${studentData.registerNo}:`, error.message);
        }
      }
    }

    console.log('\n📊 Operation Summary:');
    console.log(`✅ Inserted: ${insertedCount} new students`);
    console.log(`🔄 Updated: ${updatedCount} existing students`);
    console.log(`⚠️ Skipped: ${skippedCount} students`);
    console.log(`📝 Total processed: ${sampleStudents.length} students`);

    // Display all students in database
    const allStudents = await Student.find({}, 'registerNo name grade attendance courses fees');
    console.log('\n📋 Current students in database:');
    allStudents.forEach(student => {
      console.log(`- ${student.registerNo}: ${student.name} | CGPA: ${student.grade} | Attendance: ${student.attendance}% | Courses: ${student.courses} | Fees: ₹${student.fees}`);
    });

  } catch (error) {
    console.error('❌ Error in update/insert operation:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔗 MongoDB connection closed');
  }
}

// Alternative: Bulk update operation (more efficient for large datasets)
async function bulkUpdateStudents() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔄 Starting bulk update operation...');

    const bulkOperations = sampleStudents.map(studentData => ({
      updateOne: {
        filter: { registerNo: studentData.registerNo },
        update: {
          $set: {
            name: studentData.name,
            dob: studentData.dob,
            grade: studentData.grade,
            attendance: studentData.attendance,
            courses: studentData.courses,
            fees: studentData.fees
            // Note: Password is NOT included, so it won't be updated
          }
        },
        upsert: true // Insert if doesn't exist
      }
    }));

    const result = await Student.bulkWrite(bulkOperations);
    
    console.log('\n📊 Bulk Operation Summary:');
    console.log(`✅ Matched: ${result.matchedCount} students`);
    console.log(`✅ Modified: ${result.modifiedCount} students`);
    console.log(`✅ Upserted: ${result.upsertedCount} new students`);
    console.log(`📝 Total operations: ${bulkOperations.length}`);

  } catch (error) {
    console.error('❌ Error in bulk update operation:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔗 MongoDB connection closed');
  }
}

// Choose which method to run:
// updateOrInsertStudents();  // For individual control
bulkUpdateStudents();       // For better performance