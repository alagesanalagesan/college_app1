🏫 College Student Management System
<div align="center">
https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo&logoColor=white
https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white
https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white
https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white

A Modern, Full-Stack Solution for Academic Institution Management

https://img.shields.io/github/stars/alagesan07/college-student-management-app?style=social
https://img.shields.io/github/forks/alagesan07/college-student-management-app?style=social
https://img.shields.io/badge/License-MIT-yellow.svg

</div>
📋 Table of Contents
✨ Features

🏗️ Architecture

🚀 Quick Start

📱 Screenshots

🛠️ Tech Stack

📁 Project Structure

🔧 Installation Guide

🌐 API Documentation

🧪 Testing

📦 Deployment

🤝 Contributing

📄 License

👨‍💻 Author

✨ Features
🎯 Core Modules
Module	Features	Status
👥 Student Management	CRUD operations, Profile management, Batch tracking	✅
📅 Academic Scheduling	Timetable, Room allocation, Faculty assignment	✅
📊 Attendance System	Daily marking, Reports, Notifications	✅
📚 Course Management	Subjects, Syllabus, Resources	✅
👨‍🏫 Faculty Portal	Dashboard, Student tracking, Grade management	✅
📢 Announcements	Push notifications, Circulars	✅
🔐 Security & Authentication
Role-based access control (Admin, Faculty, Student)

JWT authentication with refresh tokens

Password encryption using bcrypt

Session management with secure cookies

📱 Mobile App Features
Real-time notifications

Offline capability

Dark/Light theme

Biometric authentication

QR Code attendance

🏗️ Architecture







🚀 Quick Start
Prerequisites
Node.js ≥ 18.x

MongoDB ≥ 6.x

Expo CLI

Git

One-Command Setup
bash
# Clone and setup in one command
git clone https://github.com/alagesan07/college-student-management-app.git && cd college-student-management-app && npm run setup
📱 Screenshots
<div align="center">
Dashboard	Student Profile	Attendance
https://via.placeholder.com/300x600/4F46E5/FFFFFF?text=Dashboard	https://via.placeholder.com/300x600/10B981/FFFFFF?text=Student+Profile	https://via.placeholder.com/300x600/F59E0B/FFFFFF?text=Attendance
Schedule	Grades	Notifications
https://via.placeholder.com/300x600/8B5CF6/FFFFFF?text=Schedule	https://via.placeholder.com/300x600/EC4899/FFFFFF?text=Grades	https://via.placeholder.com/300x600/3B82F6/FFFFFF?text=Notifications
</div>
🛠️ Tech Stack
Frontend (Mobile)
React Native with Expo SDK 50

TypeScript for type safety

React Navigation v6 for routing

NativeBase v3 for UI components

Redux Toolkit for state management

React Query for data fetching

Reanimated 3 for animations

Backend
Node.js with Express.js framework

MongoDB with Mongoose ODM

Socket.io for real-time features

Redis for caching & sessions

JWT for authentication

Multer for file uploads

Nodemailer for email services

DevOps & Tools
GitHub Actions for CI/CD

Docker for containerization

AWS EC2 & S3 for deployment

Postman for API testing

Jest & React Testing Library

ESLint & Prettier for code quality

📁 Project Structure
text
college-student-management-app/
├── 📱 mobile/                    # React Native App
│   ├── app/                     # App entry & navigation
│   ├── components/              # Reusable components
│   ├── screens/                 # Feature screens
│   ├── services/                # API & storage services
│   ├── store/                   # Redux store
│   ├── utils/                   # Helper functions
│   └── assets/                  # Images, fonts, icons
│
├── 🖥️ backend/                  # Node.js Backend
│   ├── src/
│   │   ├── config/             # DB & app configuration
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Custom middleware
│   │   ├── models/             # MongoDB schemas
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   └── utils/              # Utilities
│   └── tests/                  # Backend tests
│
├── 📊 database/                 # MongoDB scripts & migrations
├── 📋 docs/                     # Documentation
├── 🐳 docker/                   # Docker configurations
├── 🔧 scripts/                  # Build & deployment scripts
└── 📄 .github/                  # GitHub workflows
🔧 Installation Guide
Option 1: Quick Install (Recommended)
bash
# Run the setup script
curl -sL https://raw.githubusercontent.com/alagesan07/college-student-management-app/main/scripts/setup.sh | bash
Option 2: Manual Installation
Backend Setup
bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configurations

# Start development server
npm run dev
# Server runs on http://localhost:5000
Mobile App Setup
bash
# Navigate to mobile
cd mobile

# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Start Expo development server
npm start
# Scan QR code with Expo Go app
Database Setup
bash
# Using Docker
docker-compose up -d mongodb redis

# Or manually
mongosh "mongodb://localhost:27017/college_db"
🌐 API Documentation
Base URL
text
https://api.college-management.com/v1
Authentication
http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@college.edu",
  "password": "securepassword",
  "role": "student"
}
Key Endpoints
Method	Endpoint	Description	Auth Required
POST	/auth/login	User authentication	❌
POST	/auth/register	New user registration	❌
GET	/students	Get all students	✅
POST	/students	Create student	✅ (Admin)
GET	/students/:id	Get student details	✅
PUT	/students/:id	Update student	✅
GET	/attendance	Get attendance records	✅
POST	/attendance/mark	Mark attendance	✅ (Faculty)
GET	/schedule	Get timetable	✅
POST	/schedule	Create schedule	✅ (Admin)
📖 View Complete API Docs

🧪 Testing
Run Tests
bash
# Backend tests
cd backend
npm test
npm run test:coverage

# Frontend tests
cd mobile
npm test
npm run test:e2e
Test Coverage
bash
# Generate coverage report
npm run coverage

# View in browser
open coverage/lcov-report/index.html
📦 Deployment
Backend Deployment
bash
# Build for production
npm run build

# Deploy to AWS EC2
npm run deploy:aws

# Or using Docker
docker build -t college-backend .
docker run -p 5000:5000 college-backend
Mobile App Deployment
bash
# Build for Android
eas build --platform android --profile production

# Build for iOS
eas build --platform ios --profile production

# Submit to stores
eas submit --platform android
eas submit --platform ios
Environment Variables
Create .env file with:

env
# Backend
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_super_secret_key
REDIS_URL=redis://localhost:6379
CLOUDINARY_URL=cloudinary://...

# Mobile
EXPO_PUBLIC_API_URL=https://your-api.com
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=...
EXPO_PUBLIC_SENTRY_DSN=...
🤝 Contributing
We love contributions! Here's how you can help:

Ways to Contribute
🐛 Report bugs - Create an issue

💡 Suggest features - Share your ideas

📝 Improve documentation - Help others understand

🔧 Fix issues - Submit pull requests

🌍 Add translations - Make it multilingual

Development Workflow
bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/your-username/college-student-management-app.git

# 3. Create feature branch
git checkout -b feature/amazing-feature

# 4. Make changes and commit
git commit -m 'Add amazing feature'

# 5. Push to branch
git push origin feature/amazing-feature

# 6. Open Pull Request
Code Standards
Follow TypeScript strict mode

Write meaningful commit messages

Add tests for new features

Update documentation

Use ESLint and Prettier

📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

text
MIT License

Copyright (c) 2024 Alagesan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
👨‍💻 Author
<div align="center">
Alagesan
Full Stack Developer & CEO
GROW THINK IT SOLUTIONS

https://img.shields.io/badge/Portfolio-000000?style=for-the-badge&logo=About.me&logoColor=white
https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white
https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white
https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white

🌟 Support This Project
If this project helped you, please give it a star! ⭐

https://api.star-history.com/svg?repos=alagesan07/college-student-management-app&type=Date

📞 Contact
Email: alagesan@growthinkitsolutions.com
Website: www.growthinkitsolutions.com
Phone: +91 98765 43210

</div>
<div align="center">
Built with ❤️ for the Education Community
"Transforming education through technology"

https://badges.frapsoft.com/os/v2/open-source.svg?v=103
https://img.shields.io/github/last-commit/alagesan07/college-student-management-app
https://img.shields.io/github/repo-size/alagesan07/college-student-management-app

</div>
📊 Project Stats
https://img.shields.io/github/issues/alagesan07/college-student-management-app
https://img.shields.io/github/issues-pr/alagesan07/college-student-management-app
https://img.shields.io/github/contributors/alagesan07/college-student-management-app

🎓 Empowering Education • 📱 Modern Technology • 🌍 Global Impactnbvjbjbjhbjhbjhbjhbbhj

<div align="center">
Ready to Transform Your Institution?
https://img.shields.io/badge/Deploy_Now-10B981?style=for-the-badge&logo=vercel&logoColor=white
https://img.shields.io/badge/Try_Demo-3B82F6?style=for-the-badge&logo=google-chrome&logoColor=white

</div> ```
