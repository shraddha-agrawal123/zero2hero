import React, { useState } from 'react';

// Mock navigation function - replace with your actual routing solution
const navigateToRegister = () => {
  // For React Router: use navigate('/register')
  // For Next.js: use router.push('/register')
  // For now, we'll just show an alert
  window.location.href = '/register';
};

// Animated Waste Management Illustration Component
const WasteIllustration = () => {
  return (
    <div className="illustration-container">
      <div className="floating-elements">
        <div className="recycling-bin">
          <div className="bin-body"></div>
          <div className="bin-lid"></div>
          <div className="recycling-symbol">♻</div>
        </div>
        
        <div className="floating-waste waste-1">🗑️</div>
        <div className="floating-waste waste-2">📱</div>
        <div className="floating-waste waste-3">🥤</div>
        <div className="floating-waste waste-4">📰</div>
        
        <div className="earth-container">
          <div className="earth">🌍</div>
          <div className="orbit orbit-1">
            <div className="satellite">🛰️</div>
          </div>
        </div>
        
        <div className="hero-text">
          <h1 className="hero-title">Zero2Hero</h1>
          <p className="hero-subtitle">Transform Waste Into Wonder</p>
          <div className="stats">
            <div className="stat">
              <span className="stat-number">1000+</span>
              <span className="stat-label">Users</span>
            </div>
            <div className="stat">
              <span className="stat-number">50k+</span>
              <span className="stat-label">Points Earned</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      alert('Please fill all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      if (response.ok) {
        const data = await response.json();
        onLogin({
          _id: data.user_id,
          name: data.name,
          email: email,
          points: data.points
        }, data.token);

        // Redirect to home page after successful login
        window.location.href = '/';
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed. Please try again.');
    }
    
    setLoading(false);
  };
  
  return (
    <>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          overflow-x: hidden;
        }

        .auth-layout {
          display: flex;
          min-height: 100vh;
          position: relative;
        }

        .illustration-side {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          position: relative;
          overflow: hidden;
        }

        .form-side {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          position: relative;
        }

        .illustration-container {
          width: 100%;
          height: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .floating-elements {
          position: relative;
          width: 400px;
          height: 400px;
        }

        .recycling-bin {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 80px;
          height: 100px;
          animation: bounce 3s ease-in-out infinite;
        }

        .bin-body {
          width: 80px;
          height: 80px;
          background: linear-gradient(145deg, #4CAF50, #45a049);
          border-radius: 10px;
          position: relative;
          box-shadow: 0 10px 20px rgba(0,0,0,0.3);
        }

        .bin-lid {
          width: 90px;
          height: 15px;
          background: linear-gradient(145deg, #66BB6A, #4CAF50);
          border-radius: 50px;
          position: absolute;
          top: -8px;
          left: -5px;
          box-shadow: 0 5px 10px rgba(0,0,0,0.2);
        }

        .recycling-symbol {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 30px;
          color: white;
          animation: spin 4s linear infinite;
        }

        .floating-waste {
          position: absolute;
          font-size: 24px;
          animation: float 6s ease-in-out infinite;
        }

        .waste-1 {
          top: 20%;
          left: 20%;
          animation-delay: -1s;
        }

        .waste-2 {
          top: 30%;
          right: 20%;
          animation-delay: -2s;
        }

        .waste-3 {
          bottom: 30%;
          left: 15%;
          animation-delay: -3s;
        }

        .waste-4 {
          bottom: 20%;
          right: 25%;
          animation-delay: -4s;
        }

        .earth-container {
          position: absolute;
          top: 10%;
          right: 10%;
          width: 60px;
          height: 60px;
        }

        .earth {
          font-size: 40px;
          animation: rotate 10s linear infinite;
        }

        .orbit {
          position: absolute;
          top: -10px;
          left: -10px;
          width: 80px;
          height: 80px;
          border: 2px dashed rgba(255,255,255,0.3);
          border-radius: 50%;
          animation: orbit 8s linear infinite;
        }

        .satellite {
          position: absolute;
          top: -10px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 16px;
        }

        .hero-text {
          position: absolute;
          bottom: 20%;
          left: 50%;
          transform: translateX(-50%);
          text-align: center;
          color: white;
        }

        .hero-title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 10px;
          text-shadow: 0 4px 8px rgba(0,0,0,0.3);
          animation: glow 2s ease-in-out infinite alternate;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 20px;
          animation: fadeInUp 1s ease-out;
        }

        .stats {
          display: flex;
          gap: 30px;
          justify-content: center;
        }

        .stat {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .stat-number {
          font-size: 1.5rem;
          font-weight: bold;
          color: #FFD700;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .auth-card {
          width: 100%;
          max-width: 400px;
          padding: 40px;
          animation: slideInRight 0.8s ease-out;
        }

        .brand-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .brand-logo {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
          font-size: 24px;
          animation: pulse 2s infinite;
          color: white;
        }

        .brand-title {
          font-size: 2rem;
          color: #333;
          margin-bottom: 5px;
          font-weight: bold;
        }

        .brand-subtitle {
          color: #666;
          font-size: 0.9rem;
        }

        .form-container {
          background: white;
          border-radius: 20px;
          padding: 30px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
          border: 1px solid rgba(255,255,255,0.2);
        }

        .form-title {
          font-size: 1.5rem;
          color: #333;
          margin-bottom: 30px;
          text-align: center;
          font-weight: 600;
        }

        .form-group {
          margin-bottom: 25px;
          position: relative;
        }

        .form-label {
          display: block;
          margin-bottom: 8px;
          color: #555;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .form-input {
          width: 100%;
          padding: 15px 20px;
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: #f8f9fa;
        }

        .form-input:focus {
          outline: none;
          border-color: #667eea;
          background: white;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          transform: translateY(-2px);
        }

        .btn-primary {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        .btn-primary:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-switch {
          text-align: center;
          margin-top: 25px;
          color: #666;
        }

        .auth-link {
          color: #667eea;
          background: none;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: color 0.3s ease;
          text-decoration: underline;
        }

        .auth-link:hover {
          color: #764ba2;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translate(-50%, -50%) translateY(0); }
          40% { transform: translate(-50%, -50%) translateY(-10px); }
          60% { transform: translate(-50%, -50%) translateY(-5px); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(5deg); }
          50% { transform: translateY(-15px) rotate(0deg); }
          75% { transform: translateY(-5px) rotate(-5deg); }
        }

        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes glow {
          from { text-shadow: 0 4px 8px rgba(0,0,0,0.3); }
          to { text-shadow: 0 4px 20px rgba(255,255,255,0.5); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }

        @media (max-width: 768px) {
          .auth-layout {
            flex-direction: column;
          }
          
          .illustration-side {
            height: 40vh;
          }
          
          .hero-title {
            font-size: 2rem;
          }
          
          .floating-elements {
            width: 300px;
            height: 300px;
          }
        }
      `}</style>
      
      <div className="auth-layout">
        <div className="illustration-side">
          <WasteIllustration />
        </div>
        
        <div className="form-side">
          <div className="auth-card">
            <div className="brand-header">
              <div className="brand-logo">♻</div>
              <h1 className="brand-title">Zero2Hero</h1>
              <p className="brand-subtitle">Waste Management System</p>
            </div>
            
            <div className="form-container">
              <h2 className="form-title">Welcome Back!</h2>
              
              <div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                
                <button 
                  type="button"
                  className="btn-primary"
                  disabled={loading}
                  onClick={handleSubmit}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
                
                <div className="auth-switch">
                  Don't have an account? <button type="button" onClick={navigateToRegister} className="auth-link">Create Account</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;