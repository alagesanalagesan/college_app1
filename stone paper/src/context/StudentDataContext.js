import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import axios from 'axios';


// Remove this import and define BASE_URL directly or import from correct path
const BASE_URL = 'http://10.157.130.131:5000'; // Replace with your actual backend URL

const StudentDataContext = createContext();

export const StudentDataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [studentData, setStudentData] = useState({
    name: '',
    grade: 0,
    attendance: 0,
    courses: 0,
    fees: 0,
    dob: ''
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchStudentData = async () => {
    try {
      if (!user?.registerNo) {
        console.log('No user registerNo found');
        return;
      }

      console.log('Fetching student data for:', user.registerNo);
      setLoading(true);
      setError(null);
      
      const response = await axios.post(`${BASE_URL}/getprofile`, {
        registerNo: user.registerNo
      }, { 
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Full response data:', response.data);
      
      if (response.data.success) {
        setStudentData({
          name: response.data.student.name || '',
          grade: response.data.student.grade || 0,
          attendance: response.data.student.attendance || 0,
          courses: response.data.student.courses || 0,
          fees: response.data.student.fees || 0,
          dob: response.data.student.dob || ''
        });
        console.log('Student data set successfully');
      } else {
        setError('Server returned success: false');
        console.log('Server returned success: false');
      }
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError('Failed to fetch student data');
      if (error.response) {
        console.error('Server response error:', error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.request);
        console.error('Request URL:', `${BASE_URL}/getprofile`);
      } else {
        console.error('Request setup error:', error.message);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshData = () => {
    setRefreshing(true);
    fetchStudentData();
  };

  useEffect(() => {
    if (user?.registerNo) {
      console.log('User found, fetching data...');
      fetchStudentData();
    } else {
      console.log('No user found, setting loading to false');
      setLoading(false);
    }
  }, [user?.registerNo]);

  return (
    <StudentDataContext.Provider value={{
      studentData,
      loading,
      refreshing,
      error,
      refreshData,
      fetchStudentData
    }}>
      {children}
    </StudentDataContext.Provider>
  );
};

export const useStudentData = () => {
  const context = useContext(StudentDataContext);
  if (!context) {
    throw new Error('useStudentData must be used within a StudentDataProvider');
  }
  return context;
};