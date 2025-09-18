import React, { useState, useEffect } from 'react';
import { Bell } from "lucide-react";

const Notifications = ({ user, onNotificationsChange }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/api/notifications", {
        headers: {
          'Authorization': token
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
        // Notify parent component about notifications change
        if (onNotificationsChange) {
          onNotificationsChange(data.notifications);
        }
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': token
        }
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => 
            notif._id === id ? { ...notif, read: true } : notif
          )
        );
        // Update parent component
        const updatedNotifications = notifications.map(notif => 
          notif._id === id ? { ...notif, read: true } : notif
        );
        if (onNotificationsChange) {
          onNotificationsChange(updatedNotifications);
        }
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Authorization': token
        }
      });
      
      if (response.ok) {
        setNotifications(prev => 
          prev.map(notif => ({ ...notif, read: true }))
        );
        // Update parent component
        const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
        if (onNotificationsChange) {
          onNotificationsChange(updatedNotifications);
        }
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const addNotification = async (newNotification) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token
        },
        body: JSON.stringify(newNotification)
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(prev => [data.notification, ...prev]);
        // Update parent component
        if (onNotificationsChange) {
          onNotificationsChange([data.notification, ...notifications]);
        }
      }
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Expose functions to parent component
  useEffect(() => {
    if (window.notificationManager) {
      window.notificationManager = {
        addNotification,
        markAsRead,
        markAllAsRead,
        notifications
      };
    } else {
      window.notificationManager = {
        addNotification,
        markAsRead,
        markAllAsRead,
        notifications
      };
    }
  }, [notifications]);

  if (loading) {
    return (
      <div style={{ 
        padding: '20px', 
        textAlign: 'center',
        fontFamily: 'Arial, sans-serif' 
      }}>
        <div style={{
          display: 'inline-block',
          width: '20px',
          height: '20px',
          border: '2px solid #f3f3f3',
          borderTop: '2px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginRight: '10px'
        }}></div>
        Loading notifications...
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center',
        borderRadius: '12px',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>Notifications</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
          Stay updated with your latest activities and rewards.
        </p>
      </div>

      {/* Notifications Container */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '0',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: '600',
            color: '#1f2937'
          }}>
            All Notifications ({notifications.length})
          </h2>
          {notifications.filter(n => !n.read).length > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                backgroundColor: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {notifications.length === 0 ? (
            <div style={{
              padding: '60px 20px',
              textAlign: 'center',
              color: '#6b7280'
            }}>
              <Bell size={64} color="#d1d5db" style={{ marginBottom: '20px' }} />
              <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#374151' }}>No notifications yet</h3>
              <p style={{ margin: 0, fontSize: '14px' }}>We'll notify you when something important happens</p>
            </div>
          ) : (
            notifications.map(notification => (
              <div
                key={notification._id}
                onClick={() => markAsRead(notification._id)}
                style={{
                  padding: '20px',
                  borderBottom: '1px solid #f3f4f6',
                  cursor: 'pointer',
                  backgroundColor: notification.read ? 'white' : '#f0f9ff',
                  transition: 'background-color 0.2s',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (notification.read) {
                    e.target.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = notification.read ? 'white' : '#f0f9ff';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  {/* Icon */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: '#dcfce7',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '16px',
                    flexShrink: 0
                  }}>
                    <div style={{
                      backgroundColor: '#10b981',
                      color: 'white',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px'
                    }}>
                      ✓
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: '600',
                      color: '#1f2937',
                      marginBottom: '6px',
                      lineHeight: '1.4'
                    }}>
                      {notification.title}
                    </div>
                    <div style={{
                      fontSize: '14px',
                      color: '#6b7280',
                      lineHeight: '1.5',
                      marginBottom: '8px'
                    }}>
                      {notification.message}
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#9ca3af'
                    }}>
                      {new Date(notification.created_at).toLocaleString()}
                    </div>
                  </div>

                  {/* Unread indicator */}
                  {!notification.read && (
                    <div style={{
                      width: '10px',
                      height: '10px',
                      backgroundColor: '#3b82f6',
                      borderRadius: '50%',
                      marginLeft: '12px',
                      marginTop: '8px',
                      flexShrink: 0
                    }} />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;