import React, { useContext } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStudentData } from '../context/StudentDataContext';
import { AuthContext } from '../context/AuthContext';

export default function AccountScreen() {
  const { studentData, loading, refreshing, error, refreshData } = useStudentData();
  const { user, signOut } = useContext(AuthContext);
  const c_fees=16000

  // Debug: Log the current state
  

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (error) {
      console.log('Date formatting error:', error);
      return 'Invalid Date';
    }
  };

  const handleRefresh = () => {
    console.log('Refreshing data...');
    refreshData();
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      {/* Error Display */}
      {error && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={24} color="#FF3B30" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity onPress={handleRefresh}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#2E86AB" />
        </View>
        <Text style={styles.studentName}>
          {studentData.name || 'Loading...'}
        </Text>
        <Text style={styles.registerNo}>
          {user?.registerNo || 'No Register Number'}
        </Text>
        
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Student Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>
                {studentData.name || 'Not Available'}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="id-card-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Register Number</Text>
              <Text style={styles.infoValue}>
                {user?.registerNo || 'Not Available'}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Date of Birth</Text>
              <Text style={styles.infoValue}>
                {formatDate(studentData.dob)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Academic Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Academic Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Ionicons name="trophy-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>CGPA</Text>
              <Text style={styles.infoValue}>
                {studentData.grade ? studentData.grade.toFixed(2) : 'N/A'}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Attendance</Text>
              <Text style={styles.infoValue}>
                {studentData.attendance ? `${studentData.attendance}%` : 'N/A'}
              </Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="book-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Courses Enrolled</Text>
              <Text style={styles.infoValue}>
                {studentData.courses || '0'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Financial Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Financial Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Ionicons name="card-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Fees Paid</Text>
              <Text style={styles.infoValue}>
                ₹{studentData.fees ? studentData.fees.toLocaleString() : '0'}
              </Text>
            </View>
          </View>
        </View>
        {studentData.fees < c_fees ?
        <View style={styles.infoCard}>
          <View style={styles.infoItem}>
            <Ionicons name="card-outline" size={20} color="#666" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Pending Fees</Text>
              <Text style={styles.infoValue}>
                ₹{c_fees-studentData.fees}
              </Text>
            </View>
          </View>
        </View>:''}
      </View>

      {/* Debug Information - Remove in production */}
      <View style={styles.debugSection}>
        <Text style={styles.debugTitle}>Debug Information</Text>
        <Text>Name: {studentData.name || 'Empty'}</Text>
        <Text>Grade: {studentData.grade || 'Empty'}</Text>
        <Text>Attendance: {studentData.attendance || 'Empty'}</Text>
        <Text>Courses: {studentData.courses || 'Empty'}</Text>
        <Text>Fees: {studentData.fees || 'Empty'}</Text>
        <Text>DOB: {studentData.dob || 'Empty'}</Text>
        <Text>User RegisterNo: {user?.registerNo || 'Empty'}</Text>
        <Text>Error: {error || 'None'}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 15,
    margin: 15,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  errorText: {
    flex: 1,
    color: '#FF3B30',
    marginLeft: 10,
    fontSize: 14,
  },
  retryText: {
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 10,
  },
  profileHeader: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  avatarContainer: {
    marginBottom: 10,
  },
  studentName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 5,
    textAlign: 'center',
  },
  registerNo: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutButtonText: {
    color: '#FF3B30',
    fontWeight: '600',
    marginLeft: 5,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 15,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop:10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1c1c1e',
    fontWeight: '600',
  },
  debugSection: {
    margin: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ff6b6b',
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#ff6b6b',
  },
});