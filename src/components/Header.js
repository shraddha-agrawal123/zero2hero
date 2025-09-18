import React, { useState, useEffect } from 'react';
import { Bell } from "lucide-react";

const Header = ({ onMenuClick, user }) => {
  const [showNotifications, setShowNotifications] = useState(false);
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
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

// In Header.js, update the addNotification function to ensure it properly updates the state:

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
      // Refresh notifications to ensure count is accurate
      await fetchNotifications();
      
      // If points were earned, update user points
      if (newNotification.pointsEarned && window.updateUserPoints) {
        window.updateUserPoints(newNotification.pointsEarned);
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

  // Make addNotification available globally for ReportWaste component
  useEffect(() => {
    window.addNotification = addNotification;
    return () => {
      delete window.addNotification;
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="header flex justify-between items-center p-4 shadow-md bg-white">
      {/* Left side: menu + title */}
      <div className="header-left flex items-center gap-2">
        <button className="menu-btn text-xl" onClick={onMenuClick}>☰</button>
        <h1 className="text-xl font-bold">Zero2Hero</h1>
      </div>
      
      {/* Right side: notifications + user info */}
      <div className="header-right flex items-center gap-4">
        {/* Notifications */}
        <div className="notification-container relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              position: 'relative',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            <Bell size={24} color="#374151" />
            
            {/* Notification badge */}
            {unreadCount > 0 && (
              <div style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                backgroundColor: '#ef4444',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 'bold',
                minWidth: '20px'
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </button>

          {/* Notification Dropdown */}
          {showNotifications && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: '0',
              marginTop: '8px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              border: '1px solid #e5e7eb',
              width: '360px',
              maxHeight: '400px',
              overflowY: 'auto',
              zIndex: 1000
            }}>
              {/* Header */}
              <div style={{
                padding: '16px 20px',
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <h3 style={{
                  margin: 0,
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#1f2937'
                }}>
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    style={{
                      backgroundColor: 'transparent',
                      border: 'none',
                      color: '#3b82f6',
                      fontSize: '14px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    Mark all as read
                  </button>
                )}
              </div>

              {/* Notifications list */}
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {loading ? (
                  <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    Loading notifications...
                  </div>
                ) : notifications.length === 0 ? (
                  <div style={{
                    padding: '40px 20px',
                    textAlign: 'center',
                    color: '#6b7280'
                  }}>
                    <Bell size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
                    <p style={{ margin: 0, fontSize: '16px' }}>No notifications yet</p>
                    <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>We'll notify you when something happens</p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification._id}
                      onClick={() => markAsRead(notification._id)}
                      style={{
                        padding: '16px 20px',
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
                        {/* Success icon */}
                        <div style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#dcfce7',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '12px',
                          flexShrink: 0
                        }}>
                          <div style={{
                            backgroundColor: '#10b981',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px'
                          }}>
                            ✓
                          </div>
                        </div>

                        {/* Content */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#1f2937',
                            marginBottom: '4px',
                            lineHeight: '1.4'
                          }}>
                            {notification.title}
                          </div>
                          <div style={{
                            fontSize: '14px',
                            color: '#6b7280',
                            lineHeight: '1.4',
                            marginBottom: '6px'
                          }}>
                            {notification.message}
                          </div>
                          <div style={{
                            fontSize: '12px',
                            color: '#9ca3af'
                          }}>
                            {new Date(notification.created_at).toLocaleString()}
                          </div>
                        </div>

                        {/* Unread indicator */}
                        {!notification.read && (
                          <div style={{
                            width: '8px',
                            height: '8px',
                            backgroundColor: '#3b82f6',
                            borderRadius: '50%',
                            marginLeft: '8px',
                            marginTop: '6px',
                            flexShrink: 0
                          }} />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div style={{
                  padding: '12px 20px',
                  borderTop: '1px solid #f3f4f6',
                  textAlign: 'center'
                }}>
                  <button 
                    onClick={() => {
                      setShowNotifications(false);
                      // Navigate to notifications page - you can implement this
                      window.location.href = '/notifications';
                    }}
                    style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#3b82f6',
                    fontSize: '14px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}>
                    View all notifications
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* User Info */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: '#10b981',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '20px',
          fontSize: '14px',
          fontWeight: '500'
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '8px',
            fontSize: '16px'
          }}>
            {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : 'X')}
          </div>
          <div>
            <div>{user?.name || user?.email || 'XYZ'}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>{user?.points || 0} points</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;