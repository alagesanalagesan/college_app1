// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store single class OTP (In production, use Redis instead)
let classOtpData = null;

const getClassOtpData = () => classOtpData;
const setClassOtpData = (data) => { classOtpData = data; };
const clearClassOtpData = () => { classOtpData = null; };

module.exports = {
  generateOTP,
  getClassOtpData,
  setClassOtpData,
  clearClassOtpData
};