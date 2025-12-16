import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { BASE_URL1 } from '../../../pages/env';

const BASE_URL = BASE_URL1;

export default function MarkAttendance({ navigation }) {
  const { user } = useContext(AuthContext);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
  const [canResendOtp, setCanResendOtp] = useState(false);
  const [classOtpInfo, setClassOtpInfo] = useState(null);

  const handleBackPress = () => {
    navigation.goBack();
  };

  // Countdown timer for CLASS OTP (30 minutes)
  useEffect(() => {
    if (otpSent && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setCanResendOtp(true);
    }
  }, [otpSent, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const sendVerificationCode = async () => {
    if (!user?.registerNo) {
      Alert.alert('Error', 'User not found. Please login again.');
      return;
    }

    setSendingOtp(true);
    try {
      const response = await axios.post(`${BASE_URL}/send-attendance-otp`, {
        registerNo: user.registerNo
      }, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Check if response exists and has data
      if (response && response.data) {
        if (response.data.success) {
          setOtpSent(true);
          setTimeLeft(1800); // Reset to 30 minutes
          setCanResendOtp(false);
          
          // If OTP is returned, pre-fill it for convenience
          if (response.data.otp) {
            setOtp(response.data.otp);
            setClassOtpInfo({
              isClassOtp: true,
              message: 'Class code generated! Share with your class.'
            });
          }
          
          Alert.alert(
            'Success', 
            response.data.isClassOtp 
              ? 'Class verification code generated! Your teacher will announce it to the class.'
              : 'Class verification code is available!'
          );
        } else {
          Alert.alert('Error', response.data.message || 'Failed to generate verification code');
        }
      } else {
        Alert.alert('Error', 'Invalid response from server');
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      
      // Handle different error scenarios
      if (error.code === 'ECONNABORTED') {
        Alert.alert('Timeout', 'Request timed out. Please check your connection and try again.');
      } else if (error.response) {
        // Server responded with error status
        if (error.response.status === 400 && error.response.data?.message === 'Attendance already marked for today') {
          Alert.alert('Already Marked', 'Your attendance has already been marked for today.');
          setAttendanceMarked(true);
        } else {
          Alert.alert('Error', error.response.data?.message || 'Failed to generate verification code');
        }
      } else if (error.request) {
        // Request was made but no response received
        Alert.alert('Network Error', 'No response from server. Please check your connection.');
      } else {
        Alert.alert('Error', 'Failed to generate verification code. Please try again.');
      }
    } finally {
      setSendingOtp(false);
    }
  };

  const markAttendance = async () => {
    if (!otp.trim()) {
      Alert.alert('Error', 'Please enter the class verification code');
      return;
    }

    if (otp.length !== 6) {
      Alert.alert('Error', 'Verification code must be 6 digits');
      return;
    }

    if (!user?.registerNo) {
      Alert.alert('Error', 'User information not found. Please login again.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/mark-attendance`, {
        registerNo: user.registerNo,
        otp: otp.trim()
      }, {
        timeout: 15000, // 15 second timeout for marking attendance
        headers: {
          'Content-Type': 'application/json',
        }
      });

      // Check if response exists and has data
      if (response && response.data) {
        if (response.data.success) {
          setAttendanceMarked(true);
          Alert.alert(
            'Success',
            `Attendance marked successfully!${response.data.totalClassMarked ? `\n\n${response.data.totalClassMarked} students have marked attendance so far.` : ''}`,
            [{ text: 'OK', onPress: handleBackPress }]
          );
        } else {
          Alert.alert('Error', response.data.message || 'Failed to mark attendance');
        }
      } else {
        Alert.alert('Error', 'Invalid response from server');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      
      // Handle different error scenarios
      if (error.code === 'ECONNABORTED') {
        Alert.alert('Timeout', 'Request timed out. Please check if attendance was marked and try again.');
      } else if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message;
        
        if (errorMessage === 'Invalid OTP') {
          Alert.alert('Error', 'Invalid verification code. Please check the code announced in class.');
        } else if (errorMessage === 'Class verification code has expired') {
          Alert.alert('Error', 'Class code has expired. Please ask your teacher for a new one.');
          setOtpSent(false);
          setCanResendOtp(true);
        } else if (errorMessage === 'You have already marked attendance with this code') {
          Alert.alert('Already Used', 'You have already marked attendance with this class code.');
          setAttendanceMarked(true);
        } else if (errorMessage === 'Attendance already marked for today') {
          Alert.alert('Already Marked', 'Your attendance has already been marked for today.');
          setAttendanceMarked(true);
        } else {
          Alert.alert('Error', errorMessage || 'Failed to mark attendance');
        }
      } else if (error.request) {
        // Request was made but no response received - this might be your specific issue
        Alert.alert(
          'Network Issue', 
          'Request sent but no response received. Your attendance may have been marked. Please check your attendance status.'
        );
        // Optional: You might want to set attendance as marked here if you're confident the backend processed it
        // setAttendanceMarked(true);
      } else {
        Alert.alert('Error', 'Failed to mark attendance. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    await sendVerificationCode();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
            <Ionicons name="arrow-back" size={24} color="#2E86AB" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mark Attendance</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Current Date */}
        <View style={styles.dateContainer}>
          <Ionicons name="calendar" size={20} color="#666" />
          <Text style={styles.dateText}>
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </Text>
        </View>

        {/* Student Info */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="person" size={18} color="#666" />
            <Text style={styles.infoLabel}>Register Number:</Text>
            <Text style={styles.infoValue}>{user?.registerNo}</Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time" size={18} color="#666" />
            <Text style={styles.infoLabel}>Current Time:</Text>
            <Text style={styles.infoValue}>
              {new Date().toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
          </View>
        </View>

        {/* Class OTP Info Banner */}
        {classOtpInfo && (
          <View style={styles.classOtpBanner}>
            <Ionicons name="people" size={20} color="#fff" />
            <Text style={styles.classOtpText}>Using Class Verification Code</Text>
          </View>
        )}

        {/* Attendance Status */}
        {attendanceMarked ? (
          <View style={styles.successCard}>
            <Ionicons name="checkmark-circle" size={50} color="#34C759" />
            <Text style={styles.successTitle}>Attendance Marked</Text>
            <Text style={styles.successText}>
              Your attendance has been successfully marked for today.
            </Text>
            <TouchableOpacity style={styles.backHomeButton} onPress={handleBackPress}>
              <Text style={styles.backHomeButtonText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* OTP Send Section */}
            <View style={styles.otpSection}>
              <Text style={styles.sectionTitle}>Step 1: Get Class Code</Text>
              <Text style={styles.sectionDescription}>
                {otpSent 
                  ? 'Class verification code is active! Ask your teacher to announce the code.'
                  : 'Click below to generate a class verification code. Your teacher will receive it and announce to the class.'
                }
              </Text>

              <TouchableOpacity
                style={[
                  styles.sendButton,
                  (sendingOtp || (otpSent && !canResendOtp)) && styles.disabledButton
                ]}
                onPress={otpSent && !canResendOtp ? null : sendVerificationCode}
                disabled={sendingOtp || (otpSent && !canResendOtp)}
              >
                {sendingOtp ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons 
                      name={otpSent && !canResendOtp ? "checkmark" : "people"} 
                      size={20} 
                      color="#fff" 
                    />
                    <Text style={styles.sendButtonText}>
                      {otpSent && !canResendOtp 
                        ? 'Class Code Active' 
                        : canResendOtp 
                          ? 'Generate New Code'
                          : 'Get Class Code'
                      }
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {otpSent && !canResendOtp && (
                <Text style={styles.timerText}>
                  Class code expires in: {formatTime(timeLeft)}
                </Text>
              )}

              {canResendOtp && (
                <TouchableOpacity style={styles.resendButton} onPress={resendOtp}>
                  <Text style={styles.resendText}>Generate New Class Code</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* OTP Verification Section */}
            <View style={styles.verificationSection}>
              <Text style={styles.sectionTitle}>Step 2: Enter Class Code</Text>
              <Text style={styles.sectionDescription}>
                Enter the 6-digit code announced by your teacher to mark your attendance.
                {otpSent && " Same code for entire class!"}
              </Text>

              <TextInput
                style={styles.otpInput}
                placeholder="Enter class code"
                placeholderTextColor="#999"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
                editable={!loading}
              />

              <TouchableOpacity
                style={[styles.markButton, loading && styles.disabledButton]}
                onPress={markAttendance}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={20} color="#fff" />
                    <Text style={styles.markButtonText}>Mark Attendance</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.instructionsTitle}>Class Attendance System</Text>
          <View style={styles.instructionItem}>
            <Ionicons name="people" size={16} color="#2E86AB" />
            <Text style={styles.instructionText}>
              One code for entire class - Share with classmates
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="time" size={16} color="#2E86AB" />
            <Text style={styles.instructionText}>
              Class code valid for 30 minutes
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="checkmark" size={16} color="#2E86AB" />
            <Text style={styles.instructionText}>
              Mark attendance only once per day
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Ionicons name="school" size={16} color="#2E86AB" />
            <Text style={styles.instructionText}>
              Attendance only between 9 AM - 5 PM
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1c1c1e',
  },
  placeholder: {
    width: 40,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 1,
  },
  dateText: {
    fontSize: 16,
    color: '#666',
    marginLeft: 8,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    marginRight: 5,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1c1c1e',
    fontWeight: '600',
  },
  classOtpBanner: {
    backgroundColor: '#2E86AB',
    margin: 15,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  classOtpText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 8,
  },
  successCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 30,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#34C759',
    marginTop: 15,
    marginBottom: 10,
  },
  successText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  backHomeButton: {
    backgroundColor: '#2E86AB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backHomeButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  otpSection: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  verificationSection: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E86AB',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  markButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 12,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#bdc3c7',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  markButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  timerText: {
    textAlign: 'center',
    color: '#FF9500',
    fontSize: 14,
    fontWeight: '500',
    marginTop: 5,
  },
  resendButton: {
    padding: 10,
    alignItems: 'center',
  },
  resendText: {
    color: '#2E86AB',
    fontSize: 14,
    fontWeight: '500',
  },
  otpInput: {
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '600',
    backgroundColor: '#f8f9fa',
    marginBottom: 10,
  },
  instructionsCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 15,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
    lineHeight: 20,
  },
});