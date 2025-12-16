// src/screens/HomeScreen.js
import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { useStudentData } from '../context/StudentDataContext';
import { BASE_URL1 } from '../../pages/env';
import axios from 'axios';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }) {
  const { studentData, loading, refreshing, error: studentError, refreshData } = useStudentData();
  const [todaySchedule, setTodaySchedule] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementsLoading, setAnnouncementsLoading] = useState(true);
  const [announcementsError, setAnnouncementsError] = useState(null);
  const [showDevInfo, setShowDevInfo] = useState(true);

  const { signOut } = useContext(AuthContext);

  // Fetch today's schedule from server
  const fetchTodaySchedule = async () => {
    setStatus('loading');
    setError(null);
    const url = `${BASE_URL1}/schedule-today`;
    console.log('[CLIENT] Fetching', url);

    try {
      const response = await axios.get(url, { timeout: 8000 });
      console.log('[CLIENT] HTTP status:', response.status);

      if (response.data && response.data.success) {
        setTodaySchedule(response.data.schedule || null);
        setStatus(response.data.schedule ? 'ok' : 'no-data');
      } else {
        setTodaySchedule(null);
        setStatus('no-data');
        setError(response.data?.message || 'No schedule available');
      }
    } catch (err) {
      console.error('[CLIENT] fetch error:', err);
      setError(err.response?.data?.message || err.message || 'Network error');
      setTodaySchedule(null);
      setStatus('error');
    }
  };

  // Fetch announcements function
  const fetchAnnouncements = async () => {
    try {
      setAnnouncementsLoading(true);
      setAnnouncementsError(null);
      
      const response = await axios.get(`${BASE_URL1}/announcements/latest`);
      
      if (response.data.success) {
        setAnnouncements(response.data.announcements || []);
      } else {
        setAnnouncementsError('Failed to load announcements');
      }
    } catch (error) {
      console.error('Announcements fetch error:', error);
      setAnnouncementsError('Cannot load announcements');
      setAnnouncements([]);
    } finally {
      setAnnouncementsLoading(false);
    }
  };

  // Helper function to get announcement icon and color
  const getAnnouncementConfig = (type) => {
    const config = {
      general: { icon: 'megaphone', color: '#007AFF' },
      academic: { icon: 'school', color: '#34C759' },
      holiday: { icon: 'calendar', color: '#FF9500' },
      exam: { icon: 'document-text', color: '#FF3B30' },
      urgent: { icon: 'warning', color: '#FF2D55' }
    };
    return config[type] || config.general;
  };

  const toggleDevInfo = () => {
    setShowDevInfo(!showDevInfo);
  };

  const handleRefresh = () => {
    refreshData();
    fetchTodaySchedule();
    fetchAnnouncements();
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const handleBack = () => navigation.goBack();

  // QuickAction component
  const QuickAction = ({ icon, title, onPress, color = '#007AFF' }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.iconContainer, { backgroundColor: color }]}>
        <Ionicons name={icon} size={24} color="#fff" />
      </View>
      <Text style={styles.actionText}>{title}</Text>
    </TouchableOpacity>
  );

  const handleAttendancePress = () => navigation.navigate('MarkAttendance');
  const handleDocumentsPress = () => navigation.navigate('Documents');
  const handleFeesPress = () => navigation.navigate('Fees');
  const handleCoursesPress = () => navigation.navigate('MarkStatement');

  // Helper function to determine period status
  const getPeriodStatus = (period) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const startTime = period.startTime.split(':');
    const endTime = period.endTime.split(':');
    const periodStart = parseInt(startTime[0]) * 60 + parseInt(startTime[1]);
    const periodEnd = parseInt(endTime[0]) * 60 + parseInt(endTime[1]);
    
    if (currentTime >= periodStart && currentTime <= periodEnd) {
      return 'current';
    } else if (currentTime > periodEnd) {
      return 'completed';
    } else {
      return 'upcoming';
    }
  };

  useEffect(() => {
    fetchTodaySchedule();
    fetchAnnouncements();
  }, []);

  // Render current period indicator
  const renderCurrentPeriodIndicator = () => {
    if (!todaySchedule?.periods) return null;

    const currentPeriod = todaySchedule.periods.find(period => getPeriodStatus(period) === 'current');
    
    if (currentPeriod) {
      return (
        <View style={styles.currentPeriodBanner}>
          <View style={styles.liveIndicator}>
            <View style={styles.livePulse} />
            <Text style={styles.liveText}>LIVE NOW</Text>
          </View>
          <Text style={styles.currentPeriodText}>
            {currentPeriod.subject} • {currentPeriod.room}
          </Text>
          <Text style={styles.currentPeriodTime}>
            {currentPeriod.startTime} - {currentPeriod.endTime}
          </Text>
        </View>
      );
    }
    return null;
  };

  // Prefer studentError first (from useStudentData) then schedule error
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2E86AB" />
        <Text style={styles.loadingText}>Loading student data...</Text>
      </View>
    );
  }

  if (studentError) {
    return (
      <View style={styles.center}>
        <Ionicons name="warning-outline" size={48} color="#FF6B6B" />
        <Text style={styles.errorTitle}>Unable to Load Data</Text>
        <Text style={styles.errorMessage}>{studentError}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refreshData()}>
          <Ionicons name="refresh" size={16} color="#fff" />
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.welcomeContainer}>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.welcomeContent}>
          <Text style={styles.collegeName}>GTN ARTS COLLEGE (AUTONOMOUS)</Text>
          <Text style={styles.welcomeText}>Hello {studentData ? studentData.name : 'Student'}!</Text>
          <Text style={styles.welcomeSubText}>Welcome to your academic dashboard</Text>
        </View>

        <View style={styles.decoration}>
          <View style={styles.decorationCircle} />
          <View style={styles.decorationCircle} />
          <View style={styles.decorationCircle} />
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: 'rgba(0, 122, 255, 0.1)' }]}>
            <Ionicons name="calendar-outline" size={24} color="#007AFF" />
          </View>
          <Text style={styles.statNumber}>{studentData?.attendance ? `${studentData.attendance}%` : '0%'}</Text>
          <Text style={styles.statLabel}>Attendance</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: 'rgba(52, 199, 89, 0.1)' }]}>
            <Ionicons name="trophy-outline" size={24} color="#34C759" />
          </View>
          <Text style={styles.statNumber}>{studentData?.grade ?? '0.0'}</Text>
          <Text style={styles.statLabel}>CGPA</Text>
        </View>
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: 'rgba(255, 149, 0, 0.1)' }]}>
            <Ionicons name="document-text-outline" size={24} color="#FF9500" />
          </View>
          <Text style={styles.statNumber}>{studentData?.courses ?? '0'}</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="flash-outline" size={20} color="#2E86AB" />
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
        </View>
        <View style={styles.actionsGrid}>
          <QuickAction icon="calendar" title="Attendance" color="#007AFF" onPress={handleAttendancePress} />
          <QuickAction icon="document-text" title="Documents" color="#34C759" onPress={handleDocumentsPress} />
          <QuickAction icon="card" title="Fees" color="#FF9500" onPress={handleFeesPress} />
          <QuickAction icon="book" title="Courses" color="#FF3B30" onPress={handleCoursesPress} />
        </View>
      </View>

      {/* Today's Schedule - Professional Card */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="time-outline" size={20} color="#2E86AB" />
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
          </View>
          <Text style={styles.currentDay}>{todaySchedule?.today || 'Loading...'}</Text>
        </View>

        {status === 'loading' && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#2E86AB" />
            <Text style={styles.loadingText}>Loading today's classes...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={32} color="#FF6B6B" />
            <Text style={styles.errorTitle}>Unable to load schedule</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchTodaySchedule}>
              <Ionicons name="refresh" size={16} color="#fff" />
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        )}

        {!error && todaySchedule && todaySchedule.periods && todaySchedule.periods.length > 0 ? (
          <View style={styles.scheduleCard}>
            {/* Current Period Highlight */}
            {renderCurrentPeriodIndicator()}
            
            {/* Schedule List */}
            {todaySchedule.periods.map((period, index) => {
              const periodStatus = getPeriodStatus(period);
              const isLast = index === todaySchedule.periods.length - 1;
              
              return (
                <View key={period.periodNumber} style={[
                  styles.periodItem,
                  isLast && styles.lastPeriodItem
                ]}>
                  {/* Period Number & Time */}
                  <View style={styles.periodHeader}>
                    <View style={[
                      styles.periodNumberContainer,
                      periodStatus === 'current' && styles.periodNumberCurrent,
                      periodStatus === 'completed' && styles.periodNumberCompleted
                    ]}>
                      <Text style={[
                        styles.periodNumber,
                        periodStatus === 'current' && styles.periodNumberTextCurrent,
                        periodStatus === 'completed' && styles.periodNumberTextCompleted
                      ]}>
                        P{period.periodNumber}
                      </Text>
                    </View>
                    <View style={styles.timeContainer}>
                      <Text style={styles.periodTime}>{period.startTime} - {period.endTime}</Text>
                      {periodStatus === 'current' && (
                        <View style={styles.currentBadge}>
                          <Text style={styles.currentBadgeText}>Now</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Subject & Details */}
                  <View style={styles.periodContent}>
                    <Text style={styles.subjectName}>{period.subject}</Text>
                    <View style={styles.periodMeta}>
                      <View style={styles.metaItem}>
                        <Ionicons name="person-outline" size={12} color="#666" />
                        <Text style={styles.metaText}>{period.faculty}</Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="location-outline" size={12} color="#666" />
                        <Text style={styles.metaText}>{period.room}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Status Dot */}
                  <View style={[
                    styles.statusDot,
                    periodStatus === 'current' && styles.statusDotCurrent,
                    periodStatus === 'completed' && styles.statusDotCompleted
                  ]} />
                </View>
              );
            })}
          </View>
        ) : !error && todaySchedule ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={48} color="#CCD0D5" />
            <Text style={styles.emptyStateTitle}>No Classes Today</Text>
            <Text style={styles.emptyStateText}>Enjoy your free day! Check back tomorrow for your schedule.</Text>
          </View>
        ) : null}
      </View>

      {/* Announcements Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleContainer}>
            <Ionicons name="megaphone-outline" size={20} color="#2E86AB" />
            <Text style={styles.sectionTitle}>Announcements</Text>
          </View>
          <TouchableOpacity onPress={fetchAnnouncements}>
            <Ionicons name="refresh" size={18} color="#2E86AB" />
          </TouchableOpacity>
        </View>

        {announcementsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#2E86AB" />
            <Text style={styles.loadingText}>Loading announcements...</Text>
          </View>
        ) : announcementsError ? (
          <View style={styles.errorContainer}>
            <Ionicons name="warning-outline" size={32} color="#FF6B6B" />
            <Text style={styles.errorTitle}>Unable to load announcements</Text>
            <Text style={styles.errorMessage}>{announcementsError}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchAnnouncements}>
              <Ionicons name="refresh" size={16} color="#fff" />
              <Text style={styles.retryText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : announcements.length > 0 ? (
          <View style={styles.announcementCard}>
            {announcements.map((announcement, index) => {
              const config = getAnnouncementConfig(announcement.type);
              const isLast = index === announcements.length - 1;
              
              return (
                <View key={announcement._id} style={[
                  styles.announcementItem,
                  isLast && styles.lastAnnouncementItem
                ]}>
                  <View style={[styles.announcementIcon, { backgroundColor: `${config.color}15` }]}>
                    <Ionicons name={config.icon} size={20} color={config.color} />
                  </View>
                  <View style={styles.announcementContent}>
                    <View style={styles.announcementHeader}>
                      <Text style={styles.announcementTitle}>{announcement.title}</Text>
                      <View style={[
                        styles.priorityBadge,
                        { backgroundColor: announcement.priority === 'high' ? '#FF3B30' : 
                          announcement.priority === 'medium' ? '#FF9500' : '#34C759' }
                      ]}>
                        <Text style={styles.priorityText}>
                          {announcement.priority.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.announcementText}>{announcement.message}</Text>
                    <Text style={styles.announcementDate}>
                      {new Date(announcement.date).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="megaphone-outline" size={48} color="#CCD0D5" />
            <Text style={styles.emptyStateTitle}>No Announcements</Text>
            <Text style={styles.emptyStateText}>Check back later for updates</Text>
          </View>
        )}
      </View>

      {/* Simple Development Info Card */}
      {showDevInfo && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="code-slash" size={20} color="#2E86AB" />
              <Text style={styles.sectionTitle}>App Information</Text>
            </View>
            <TouchableOpacity onPress={toggleDevInfo} style={styles.closeButton}>
              <Ionicons name="close" size={18} color="#8E8E93" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.simpleDevCard}>
            <View style={styles.simpleDevHeader}>
              <Ionicons name="laptop" size={32} color="#2E86AB" />
              <Text style={styles.simpleDevTitle}>GTN College App</Text>
              <Text style={styles.simpleDevSubtitle}>Computer Science Department</Text>
            </View>

            <View style={styles.simpleDevContent}>
              <View style={styles.simpleInfoRow}>
                <Ionicons name="person" size={16} color="#666" />
                <Text style={styles.simpleInfoText}>Developed by: Department of Computer Science</Text>
              </View>
              
              <View style={styles.simpleInfoRow}>
                <Ionicons name="logo-react" size={16} color="#007AFF" />
                <Text style={styles.simpleInfoText}>Built with React Native & Node.js</Text>
              </View>
              
              <View style={styles.simpleInfoRow}>
                <Ionicons name="school" size={16} color="#34C759" />
                <Text style={styles.simpleInfoText}>Academic Management System</Text>
              </View>
              
              <View style={styles.simpleInfoRow}>
                <Ionicons name="calendar" size={16} color="#FF9500" />
                <Text style={styles.simpleInfoText}>Version 1.0.0 • 2024</Text>
              </View>
            </View>

            <View style={styles.simpleDevFooter}>
              <Text style={styles.simpleCopyright}>
                © 2024 GTN Arts College • Computer Science Department
              </Text>
            </View>
          </View>
        </View>
      )}

      {/* Footer Spacer */}
      <View style={styles.footerSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginTop: 12,
    textAlign: 'center',
  },
  errorMessage: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  // Header Styles
  welcomeContainer: {
    backgroundColor: '#2E86AB',
    padding: 20,
    paddingTop: 50,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    minHeight: 200,
    position: 'relative',
    overflow: 'hidden',
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeContent: {
    alignItems: 'center',
  },
  collegeName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: 0.5,
    opacity: 0.9,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  welcomeSubText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  decoration: {
    position: 'absolute',
    bottom: -20,
    right: -20,
    flexDirection: 'row',
    opacity: 0.3,
  },
  decorationCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    marginLeft: 10,
  },
  // Stats Section
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 30,
    marginHorizontal: 15,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  // Section Styles
  section: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginLeft: 8,
  },
  currentDay: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  closeButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(142, 142, 147, 0.1)',
  },
  // Quick Actions
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: (width - 60) / 2,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1c1c1e',
    textAlign: 'center',
  },
  // Schedule Styles
  scheduleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  currentPeriodBanner: {
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(52, 199, 89, 0.2)',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  livePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
    marginRight: 8,
  },
  liveText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#34C759',
    letterSpacing: 0.5,
  },
  currentPeriodText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  currentPeriodTime: {
    fontSize: 14,
    color: '#666',
  },
  periodItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
    alignItems: 'flex-start',
  },
  lastPeriodItem: {
    borderBottomWidth: 0,
  },
  periodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
    minWidth: 100,
  },
  periodNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f2f2f7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  periodNumberCurrent: {
    backgroundColor: '#34C759',
  },
  periodNumberCompleted: {
    backgroundColor: '#8E8E93',
  },
  periodNumber: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  periodNumberTextCurrent: {
    color: '#fff',
  },
  periodNumberTextCompleted: {
    color: '#fff',
  },
  timeContainer: {
    flex: 1,
  },
  periodTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 4,
  },
  currentBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  periodContent: {
    flex: 1,
  },
  subjectName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 8,
  },
  periodMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f2f2f7',
    marginTop: 12,
  },
  statusDotCurrent: {
    backgroundColor: '#34C759',
  },
  statusDotCompleted: {
    backgroundColor: '#8E8E93',
  },
  // Loading & Error States
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginTop: 12,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E86AB',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  retryText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  // Announcements Styles
  announcementCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  announcementItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  lastAnnouncementItem: {
    borderBottomWidth: 0,
  },
  announcementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  announcementContent: {
    flex: 1,
  },
  announcementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1c1c1e',
    flex: 1,
    marginRight: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  announcementText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 6,
  },
  announcementDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  // Simple Development Info Card Styles
  simpleDevCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  simpleDevHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  simpleDevTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E86AB',
    marginTop: 8,
    marginBottom: 4,
  },
  simpleDevSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  simpleDevContent: {
    padding: 20,
  },
  simpleInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  simpleInfoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  simpleDevFooter: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
  },
  simpleCopyright: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 16,
  },
  footerSpacer: {
    height: 20,
  },
});