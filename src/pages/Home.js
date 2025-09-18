import React, { useState, useEffect } from 'react';
import { User, Award, Trophy, TrendingUp, MapPin, Calendar, Star, Target, Medal, Sparkles } from 'lucide-react';

const Home = ({ user }) => {
  const [stats, setStats] = useState({
    reports: 0,
    collections: 0,
    points: user?.points || 0,
    rank: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animationPhase, setAnimationPhase] = useState(0);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await fetch("http://localhost:5000/api/reports?status=all&limit=5", {
            headers: {
              'Authorization': token
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setRecentActivity(data.reports);
            setStats(prev => ({
              ...prev,
              reports: data.reports.filter(r => r.user_id === user?._id).length,
              collections: data.reports.filter(r => r.collected_by === user?._id).length
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Animation sequence
    const timer = setInterval(() => {
      setAnimationPhase(prev => (prev + 1) % 4);
    }, 2000);
    
    return () => clearInterval(timer);
  }, [user]);

  const navigateTo = (path) => {
    window.location.href = path;
  };

  const styles = {
    homePage: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    brandingSection: {
      textAlign: 'center',
      marginBottom: '40px',
      padding: '60px 20px',
      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      borderRadius: '30px',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.2)',
      position: 'relative',
      overflow: 'hidden'
    },
    brandLogo: {
      fontSize: '80px',
      marginBottom: '20px',
      animation: 'float 3s ease-in-out infinite',
      display: 'inline-block'
    },
    brandingTitle: {
      fontSize: '48px',
      fontWeight: 'bold',
      background: 'linear-gradient(45deg, #fff, #f0f8ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '15px',
      textShadow: '0 2px 10px rgba(0,0,0,0.3)'
    },
    brandingSubtitle: {
      fontSize: '18px',
      color: 'rgba(255,255,255,0.9)',
      maxWidth: '600px',
      margin: '0 auto',
      lineHeight: '1.6'
    },
    welcomeMsg: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: 'white',
      textAlign: 'center',
      marginBottom: '30px',
      textShadow: '0 2px 10px rgba(0,0,0,0.5)'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '25px',
      marginBottom: '40px'
    },
    statCard: {
      background: 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
      borderRadius: '20px',
      padding: '30px',
      textAlign: 'center',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.2)',
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden'
    },
    statCardHover: {
      transform: 'translateY(-10px) scale(1.05)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
      background: 'linear-gradient(145deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)'
    },
    statIcon: {
      fontSize: '48px',
      marginBottom: '15px',
      display: 'inline-block',
      animation: 'pulse 2s infinite'
    },
    statValue: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '10px',
      textShadow: '0 2px 10px rgba(0,0,0,0.5)'
    },
    statLabel: {
      fontSize: '16px',
      color: 'rgba(255,255,255,0.8)',
      fontWeight: '500'
    },
    quickActions: {
      marginBottom: '40px'
    },
    sectionTitle: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '25px',
      textAlign: 'center',
      textShadow: '0 2px 10px rgba(0,0,0,0.5)'
    },
    actionButtons: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px'
    },
    actionBtn: {
      background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
      color: 'white',
      border: 'none',
      borderRadius: '15px',
      padding: '25px',
      fontSize: '18px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px',
      boxShadow: '0 8px 25px rgba(255,107,107,0.3)'
    },
    reportBtn: {
      background: 'linear-gradient(45deg, #4ecdc4, #44a08d)'
    },
    collectBtn: {
      background: 'linear-gradient(45deg, #f093fb, #f5576c)'
    },
    analysisBtn: {
      background: 'linear-gradient(45deg, #4facfe, #00f2fe)'
    },
    card: {
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '20px',
      padding: '30px',
      marginBottom: '30px',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.2)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
    },
    cardTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '25px',
      textAlign: 'center'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: 'rgba(255,255,255,0.8)'
    },
    emptyIcon: {
      fontSize: '64px',
      marginBottom: '20px'
    },
    activityList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    activityItem: {
      display: 'flex',
      alignItems: 'center',
      padding: '20px',
      marginBottom: '15px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '15px',
      transition: 'all 0.3s ease',
      border: '1px solid rgba(255,255,255,0.1)'
    },
    activityIcon: {
      fontSize: '24px',
      marginRight: '15px',
      minWidth: '40px'
    },
    activityDetails: {
      flex: 1,
      color: 'white'
    },
    activityTitle: {
      fontWeight: 'bold',
      marginBottom: '5px'
    },
    activityAddress: {
      fontSize: '14px',
      color: 'rgba(255,255,255,0.7)',
      marginBottom: '5px'
    },
    activityTime: {
      fontSize: '12px',
      color: 'rgba(255,255,255,0.6)'
    },
    statusBadge: {
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: 'bold',
      textTransform: 'uppercase'
    },
    statusCompleted: {
      background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
      color: 'white'
    },
    statusPending: {
      background: 'linear-gradient(45deg, #ffeaa7, #fab1a0)',
      color: '#2d3436'
    },
    achievementsSection: {
      marginBottom: '40px'
    },
    achievementsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '20px'
    },
    achievement: {
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '15px',
      padding: '25px',
      textAlign: 'center',
      transition: 'all 0.3s ease',
      border: '2px solid transparent'
    },
    achievementUnlocked: {
      background: 'linear-gradient(145deg, rgba(255,215,0,0.2) 0%, rgba(255,165,0,0.1) 100%)',
      border: '2px solid rgba(255,215,0,0.5)',
      boxShadow: '0 0 20px rgba(255,215,0,0.3)'
    },
    achievementLocked: {
      background: 'rgba(255,255,255,0.05)',
      border: '2px solid rgba(255,255,255,0.1)',
      opacity: 0.6
    },
    achievementIcon: {
      fontSize: '36px',
      marginBottom: '15px',
      display: 'inline-block'
    },
    achievementTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '8px'
    },
    achievementDesc: {
      fontSize: '14px',
      color: 'rgba(255,255,255,0.7)'
    },
    loadingContainer: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    loadingSpinner: {
      fontSize: '24px',
      color: 'white',
      animation: 'spin 2s linear infinite'
    },
    primaryBtn: {
      background: 'linear-gradient(45deg, #667eea, #764ba2)',
      color: 'white',
      border: 'none',
      padding: '15px 30px',
      borderRadius: '25px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      boxShadow: '0 4px 15px rgba(102,126,234,0.4)'
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={styles.homePage}>
      {/* Branding Section */}
      <div style={styles.brandingSection}>
        <div style={styles.brandLogo}>🌍</div>
        <h1 style={styles.brandingTitle}>Zero-to-Hero Waste Management</h1>
        <p style={styles.brandingSubtitle}>
          Join our community in making waste management more efficient and rewarding! Transform waste into wealth, one report at a time.
        </p>
      </div>

      {/* Welcome Message */}
      <h2 style={styles.welcomeMsg}>
        Welcome back, {user?.name || user?.email}! 🎉
      </h2>
      
      {/* Stats Section */}
      <div style={styles.statsGrid}>
        <div 
          style={styles.statCard}
          onMouseEnter={(e) => Object.assign(e.target.style, styles.statCardHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.statCard)}
        >
          <div style={styles.statIcon}>📝</div>
          <div style={styles.statValue}>{stats.reports}</div>
          <div style={styles.statLabel}>Reports Made</div>
        </div>
        
        <div 
          style={styles.statCard}
          onMouseEnter={(e) => Object.assign(e.target.style, styles.statCardHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.statCard)}
        >
          <div style={styles.statIcon}>🗑️</div>
          <div style={styles.statValue}>{stats.collections}</div>
          <div style={styles.statLabel}>Collections Done</div>
        </div>
        
        <div 
          style={styles.statCard}
          onMouseEnter={(e) => Object.assign(e.target.style, styles.statCardHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.statCard)}
        >
          <div style={styles.statIcon}>🏆</div>
          <div style={styles.statValue}>{stats.points}</div>
          <div style={styles.statLabel}>Points Earned</div>
        </div>
        
        <div 
          style={styles.statCard}
          onMouseEnter={(e) => Object.assign(e.target.style, styles.statCardHover)}
          onMouseLeave={(e) => Object.assign(e.target.style, styles.statCard)}
        >
          <div style={styles.statIcon}>📊</div>
          <div style={styles.statValue}>#{stats.rank || 'N/A'}</div>
          <div style={styles.statLabel}>Your Rank</div>
        </div>
      </div>
      
      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <h3 style={styles.sectionTitle}>Quick Actions</h3>
        <div style={styles.actionButtons}>
          <button 
            style={{...styles.actionBtn, ...styles.reportBtn}}
            onClick={() => navigateTo('/report-waste')}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px) scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0) scale(1)'}
          >
            <span style={{fontSize: '24px'}}>📝</span>
            Report Waste
          </button>
          <button 
            style={{...styles.actionBtn, ...styles.collectBtn}}
            onClick={() => navigateTo('/collect-waste')}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px) scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0) scale(1)'}
          >
            <span style={{fontSize: '24px'}}>🗑️</span>
            Collect Waste
          </button>
          <button 
            style={{...styles.actionBtn, ...styles.analysisBtn}}
            onClick={() => navigateTo('/waste-classification')}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-5px) scale(1.05)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0) scale(1)'}
          >
            <span style={{fontSize: '24px'}}>🌱</span>
            Waste Classification
          </button>
        </div>
      </div>
      
      {/* Recent Activity Section */}
      <div style={styles.card}>
        <div style={styles.cardTitle}>Recent Activity</div>
        
        {recentActivity.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📋</div>
            <h3>No recent activity</h3>
            <p>Start by reporting waste or collecting existing reports!</p>
            <button 
              style={styles.primaryBtn}
              onClick={() => navigateTo('/report-waste')}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              Report Your First Waste
            </button>
          </div>
        ) : (
          <ul style={styles.activityList}>
            {recentActivity.map(activity => (
              <li 
                key={activity._id} 
                style={styles.activityItem}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}
                onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
              >
                <div style={styles.activityIcon}>
                  {activity.status === 'completed' ? '✅' : '📝'}
                </div>
                <div style={styles.activityDetails}>
                  <div style={styles.activityTitle}>
                    {activity.waste_type} waste {activity.status === 'completed' ? 'collected' : 'reported'}
                  </div>
                  <div style={styles.activityAddress}>{activity.address}</div>
                  <div style={styles.activityTime}>
                    {new Date(activity.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <span style={{
                    ...styles.statusBadge,
                    ...(activity.status === 'completed' ? styles.statusCompleted : styles.statusPending)
                  }}>
                    {activity.status}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Achievement Section */}
      <div style={styles.achievementsSection}>
        <h3 style={styles.sectionTitle}>Your Achievements</h3>
        <div style={styles.achievementsGrid}>
          <div style={{
            ...styles.achievement,
            ...(stats.reports >= 1 ? styles.achievementUnlocked : styles.achievementLocked)
          }}>
            <div style={styles.achievementIcon}>🎯</div>
            <div style={styles.achievementTitle}>First Report</div>
            <div style={styles.achievementDesc}>Report your first waste</div>
          </div>
          <div style={{
            ...styles.achievement,
            ...(stats.collections >= 1 ? styles.achievementUnlocked : styles.achievementLocked)
          }}>
            <div style={styles.achievementIcon}>🏅</div>
            <div style={styles.achievementTitle}>First Collection</div>
            <div style={styles.achievementDesc}>Collect your first waste</div>
          </div>
          <div style={{
            ...styles.achievement,
            ...(stats.points >= 50 ? styles.achievementUnlocked : styles.achievementLocked)
          }}>
            <div style={styles.achievementIcon}>⭐</div>
            <div style={styles.achievementTitle}>Point Master</div>
            <div style={styles.achievementDesc}>Earn 50+ points</div>
          </div>
          <div style={{
            ...styles.achievement,
            ...(stats.reports >= 10 ? styles.achievementUnlocked : styles.achievementLocked)
          }}>
            <div style={styles.achievementIcon}>🌟</div>
            <div style={styles.achievementTitle}>Reporter</div>
            <div style={styles.achievementDesc}>Make 10+ reports</div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,215,0,0.3); }
          50% { box-shadow: 0 0 30px rgba(255,215,0,0.6); }
        }
      `}</style>
    </div>
  );
};

export default Home;