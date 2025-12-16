import axios from 'axios'
// import { BASE_URL1 } from '.';

BASE_URL1='http://10.104.37.131:5000'
const API = axios.create({
  baseURL: BASE_URL1, // Make sure this matches your backend URL
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API calls for your backend endpoints
export const authAPI = {
  login: (registerNo, password) => 
    API.post('/login', { registerNo, password }),
  
  getProfile: (registerNo) => 
    API.post('/getprofile', { registerNo }),
};

export const attendanceAPI = {
  sendOTP: (registerNo) => 
    API.post('/send-attendance-otp', { registerNo }),
  
  markAttendance: (registerNo, otp) => 
    API.post('/mark-attendance', { registerNo, otp }),
};

export default API;