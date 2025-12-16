import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ImportantScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Sample notifications data
  const sampleNotifications = [
    {
      id: 1,
      title: '🎓 Final Exams Schedule',
      message: 'Final examination schedule for Semester 1 has been released. Check the notice board for details.',
      type: 'exam',
      read: false,
      created_at: new Date().toISOString(),
      priority: 'high'
    },
    {
      id: 2,
      title: '💳 Fee Payment Deadline',
      message: 'Last date for fee payment is 30th November 2023. Late payment will incur fine.',
      type: 'fee',
      read: false,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      priority: 'high'
    },
    {
      id: 3,
      title: '📚 Library Book Return',
      message: 'Please return all borrowed library books before 25th November for annual maintenance.',
      type: 'academic',
      read: true,
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      priority: 'medium'
    },
    {
      id: 4,
      title: '🏆 Annual Sports Day',
      message: 'College Annual Sports Day will be held on 15th December 2023. Register by 5th December.',
      type: 'event',
      read: false,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      priority: 'medium'
    },
    {
      id: 5,
      title: '🚨 Urgent: ID Card Verification',
      message: 'All students must verify their ID cards at the admin office by tomorrow 4 PM.',
      type: 'urgent',
      read: false,
      created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
      priority: 'high'
    },
    {
      id: 6,
      title: '💻 Computer Lab Maintenance',
      message: 'Computer Lab will be closed for maintenance on 20th November from 10 AM to 2 PM.',
      type: 'academic',
      read: true,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      priority: 'low'
    },
    {
      id: 7,
      title: '📝 Project Submission',
      message: 'Last date for final year project submission is 10th December. No extensions will be granted.',
      type: 'academic',
      read: false,
      created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), // 6 days ago
      priority: 'high'
    },
    {
      id: 8,
      title: '🎉 College Fest 2023',
      message: 'Annual college fest "TechSpectrum 2023" starts from 18th December. Participation certificates will be provided.',
      type: 'event',
      read: true,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
      priority: 'medium'
    }
  ];

  // Load notifications on component mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Fetch notifications - using sample data
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      setTimeout(() => {
        setNotifications(sampleNotifications);
        const unread = sampleNotifications.filter(notif => !notif.read).length;
        setUnreadCount(unread);
        setLoading(false);
      }, 1000);
      
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    }
  };

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
    Alert.alert('Success', 'All notifications marked as read');
  };

  // Delete notification
  const deleteNotification = (notificationId) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          onPress: () => {
            setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
            const newUnread = notifications.filter(notif => !notif.read && notif.id !== notificationId).length;
            setUnreadCount(newUnread);
          }, 
          style: 'destructive' 
        }
      ]
    );
  };

  // Render notification item
  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.notificationItem,
        !item.read && styles.unreadNotification,
        item.priority === 'high' && styles.highPriority,
        item.priority === 'medium' && styles.mediumPriority,
        item.priority === 'low' && styles.lowPriority
      ]}
      onPress={() => markAsRead(item.id)}
      onLongPress={() => deleteNotification(item.id)}
    >
      <View style={[
        styles.notificationIcon,
        item.priority === 'high' && styles.highPriorityIcon,
        item.priority === 'medium' && styles.mediumPriorityIcon,
        item.priority === 'low' && styles.lowPriorityIcon
      ]}>
        <Ionicons 
          name={getNotificationIcon(item.type)} 
          size={24} 
          color="#FFF" 
        />
      </View>
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{item.title}</Text>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <Text style={styles.notificationTime}>
          {formatTime(item.created_at)}
        </Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
      
      {/* Priority Badge */}
      <View style={[
        styles.priorityBadge,
        item.priority === 'high' && styles.highPriorityBadge,
        item.priority === 'medium' && styles.mediumPriorityBadge,
        item.priority === 'low' && styles.lowPriorityBadge
      ]}>
        <Text style={styles.priorityText}>
          {item.priority === 'high' ? 'URGENT' : item.priority === 'medium' ? 'IMPORTANT' : 'INFO'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  // Helper functions
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'academic': return 'school';
      case 'fee': return 'card';
      case 'exam': return 'document-text';
      case 'event': return 'calendar';
      case 'urgent': return 'warning';
      default: return 'notifications';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Important Notifications</Text>
          <Text style={styles.subtitle}>Stay updated with college announcements</Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead} style={styles.markAllButton}>
            <Text style={styles.markAllText}>Mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{notifications.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statNumber, styles.unreadStat]}>{unreadCount}</Text>
          <Text style={styles.statLabel}>Unread</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {notifications.filter(n => n.priority === 'high').length}
          </Text>
          <Text style={styles.statLabel}>Urgent</Text>
        </View>
      </View>

      {/* Notifications List */}
      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchNotifications}
            colors={['#007AFF']}
          />
        }
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color="#C7C7CC" />
            <Text style={styles.emptyStateTitle}>No notifications</Text>
            <Text style={styles.emptyStateText}>
              All caught up! No important notifications right now.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  markAllButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  markAllText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  unreadStat: {
    color: '#FF3B30',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderLeftWidth: 4,
  },
  unreadNotification: {
    borderLeftColor: '#007AFF',
  },
  highPriority: {
    borderLeftColor: '#FF3B30',
  },
  mediumPriority: {
    borderLeftColor: '#FF9500',
  },
  lowPriority: {
    borderLeftColor: '#34C759',
  },
  notificationIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  highPriorityIcon: {
    backgroundColor: '#FF3B30',
  },
  mediumPriorityIcon: {
    backgroundColor: '#FF9500',
  },
  lowPriorityIcon: {
    backgroundColor: '#34C759',
  },
  notificationContent: {
    flex: 1,
    marginRight: 8,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 6,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
    position: 'absolute',
    top: 16,
    right: 16,
  },
  priorityBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  highPriorityBadge: {
    backgroundColor: '#FF3B30',
  },
  mediumPriorityBadge: {
    backgroundColor: '#FF9500',
  },
  lowPriorityBadge: {
    backgroundColor: '#34C759',
  },
  priorityText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});