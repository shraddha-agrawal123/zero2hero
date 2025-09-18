import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import ReportWaste from './pages/ReportWaste';
import CollectWaste from './pages/CollectWaste';
import Rewards from './pages/Rewards';
import Leaderboard from './pages/Leaderboard';
import SoilAnalysis from './pages/SoilAnalysis';
import WasteClassification from './pages/WasteClassification';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('App mounted - token:', token);
    console.log('App mounted - userData:', userData);
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        console.log('Parsed user:', parsedUser);
        setUser(parsedUser);
        fetchNotifications(token);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const fetchNotifications = async (token) => {
    try {
      const response = await fetch("http://localhost:5000/api/notifications", {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      } else {
        console.error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogin = (userData, token) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    fetchNotifications(token);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setNotifications([]);
  };

  // If no user is logged in, show auth pages
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/register" element={<Register onLogin={handleLogin} />} />
          {/* Redirect all other paths to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    );
  }

  // If user is logged in, show the main app
  return (
    <Router>
      <div className="app">
        <Sidebar 
          isOpen={sidebarOpen}  // Use the state variable
          user={user}
          onLogout={handleLogout}
        />
        <div className={`main-content ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <Header 
            onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
            notifications={notifications}
            user={user}
          />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route path="/report-waste" element={<ReportWaste user={user} />} />
              <Route path="/collect-waste" element={<CollectWaste user={user} />} />
              <Route path="/rewards" element={<Rewards user={user} />} />
              <Route path="/leaderboard" element={<Leaderboard user={user} />} />
              <Route path="/soil-analysis" element={<SoilAnalysis user={user} />} />
              <Route path="/waste-classification" element={<WasteClassification user={user} />} />
              {/* Redirect any unknown routes to home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;