import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, user, onLogout }) => { // Removed unused onClose prop
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/report-waste', label: 'Report Waste', icon: '📝' },
    { path: '/collect-waste', label: 'Collect Waste', icon: '🗑️' },
    { path: '/rewards', label: 'Rewards', icon: '🏆' },
    { path: '/leaderboard', label: 'Leaderboard', icon: '📊' },
    // { path: '/soil-analysis', label: 'Soil Analysis', icon: '🌱' },
    { path: '/waste-classification', label: 'Waste Classification', icon: '🔍' },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-title">Zero2Hero</div>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map(item => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`sidebar-item ${
                location.pathname === item.path ? 'active' : ''
              }`}
            >
              <span className="sidebar-icon">{item.icon}</span>
              <span className="sidebar-label">{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar-small">
            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </div>
          <div className="user-info-small">
            <div className="user-name-small">{user.name || user.email}</div>
            <div className="user-points-small">{user.points || 0} points</div>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;