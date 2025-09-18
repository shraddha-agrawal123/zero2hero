import React, { useState, useEffect } from 'react';

const Leaderboard = ({ user }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);
  
  useEffect(() => {
    fetchLeaderboard();
  }, []);
  
  const fetchLeaderboard = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch("http://localhost:5000/api/leaderboard", {
        headers: {
          'Authorization': token
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setLeaderboard(data.leaderboard);
        
        // Find user's rank
        const rank = data.leaderboard.findIndex(player => player._id === user._id);
        setUserRank(rank !== -1 ? rank + 1 : null);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  const getRankClass = (rank) => {
    switch(rank) {
      case 1: return 'rank-gold';
      case 2: return 'rank-silver';
      case 3: return 'rank-bronze';
      default: return 'rank-default';
    }
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading leaderboard...</div>
      </div>
    );
  }

  const styles = `
    .leaderboard-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .header-section {
      text-align: center;
      margin-bottom: 3rem;
    }

    .main-title {
      font-size: 3rem;
      font-weight: 800;
      color: white;
      margin-bottom: 1rem;
      text-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    .page-subtitle {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.9);
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .loading-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .loading-spinner {
      background: white;
      padding: 2rem 3rem;
      border-radius: 1rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }

    .user-rank-card {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      border-radius: 1.5rem;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 20px 40px rgba(251, 191, 36, 0.3);
      border: 3px solid rgba(255, 255, 255, 0.2);
    }

    .rank-info {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .rank-position {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 1rem;
      padding: 1rem;
      backdrop-filter: blur(10px);
    }

    .rank-number {
      font-size: 2rem;
      font-weight: 800;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .rank-icon {
      font-size: 2rem;
      margin-top: 0.5rem;
    }

    .rank-details h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin: 0 0 0.5rem 0;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .rank-details p {
      color: rgba(255, 255, 255, 0.9);
      margin: 0.25rem 0;
      font-size: 1rem;
    }

    .rank-details .points {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .main-card {
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.2);
      margin-bottom: 2rem;
      overflow: hidden;
    }

    .card-header {
      background: linear-gradient(135deg, #1f2937, #374151);
      padding: 2rem;
      color: white;
      text-align: center;
    }

    .card-title {
      font-size: 1.75rem;
      font-weight: 700;
      margin: 0;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 1rem 0;
    }

    .empty-state p {
      color: #6b7280;
      font-size: 1rem;
      margin: 0;
    }

    .podium {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      padding: 2rem;
      background: linear-gradient(135deg, #f8fafc, #e2e8f0);
    }

    .podium-position {
      text-align: center;
      padding: 1.5rem;
      border-radius: 1rem;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .podium-position::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
      z-index: 1;
    }

    .podium-position > * {
      position: relative;
      z-index: 2;
    }

    .podium-position.rank-gold {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      box-shadow: 0 10px 20px rgba(251, 191, 36, 0.4);
      transform: scale(1.05);
    }

    .podium-position.rank-silver {
      background: linear-gradient(135deg, #e5e7eb, #9ca3af);
      box-shadow: 0 10px 20px rgba(156, 163, 175, 0.4);
    }

    .podium-position.rank-bronze {
      background: linear-gradient(135deg, #d97706, #92400e);
      box-shadow: 0 10px 20px rgba(217, 119, 6, 0.4);
    }

    .podium-rank {
      font-size: 2rem;
      margin-bottom: 1rem;
    }

    .podium-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
      margin: 0 auto 1rem auto;
      backdrop-filter: blur(10px);
      border: 3px solid rgba(255, 255, 255, 0.3);
    }

    .podium-name {
      font-size: 1rem;
      font-weight: 600;
      color: white;
      margin-bottom: 0.5rem;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .podium-points {
      font-size: 1.125rem;
      font-weight: 700;
      color: white;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }

    .leaderboard-table {
      background: white;
    }

    .table-header {
      display: grid;
      grid-template-columns: 80px 1fr 120px 80px;
      gap: 1rem;
      padding: 1.5rem 2rem;
      background: #f8fafc;
      font-weight: 600;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #6b7280;
      border-bottom: 2px solid #e5e7eb;
    }

    .table-body {
      max-height: 600px;
      overflow-y: auto;
    }

    .table-row {
      display: grid;
      grid-template-columns: 80px 1fr 120px 80px;
      gap: 1rem;
      padding: 1.5rem 2rem;
      border-bottom: 1px solid #f3f4f6;
      transition: all 0.2s ease;
      align-items: center;
    }

    .table-row:hover {
      background: #f9fafb;
      transform: translateX(5px);
    }

    .table-row.current-user {
      background: linear-gradient(90deg, rgba(16, 185, 129, 0.1), rgba(14, 165, 233, 0.1));
      border-left: 4px solid #10b981;
    }

    .table-row.rank-gold {
      background: linear-gradient(90deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1));
      border-left: 4px solid #fbbf24;
    }

    .table-row.rank-silver {
      background: linear-gradient(90deg, rgba(156, 163, 175, 0.1), rgba(107, 114, 128, 0.1));
      border-left: 4px solid #9ca3af;
    }

    .table-row.rank-bronze {
      background: linear-gradient(90deg, rgba(217, 119, 6, 0.1), rgba(146, 64, 14, 0.1));
      border-left: 4px solid #d97706;
    }

    .row-rank {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .rank-number {
      font-weight: 600;
      color: #1f2937;
    }

    .row-name {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .player-avatar {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background: linear-gradient(135deg, #10b981, #0ea5e9);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.125rem;
      font-weight: 700;
      color: white;
      flex-shrink: 0;
    }

    .player-name {
      font-weight: 600;
      color: #1f2937;
      font-size: 1rem;
    }

    .you-indicator {
      color: #10b981;
      font-size: 0.875rem;
      font-weight: 500;
      margin-left: 0.5rem;
    }

    .player-title {
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-top: 0.25rem;
    }

    .row-points {
      text-align: center;
    }

    .points-number {
      font-size: 1.25rem;
      font-weight: 700;
      color: #10b981;
    }

    .points-label {
      display: block;
      font-size: 0.75rem;
      color: #6b7280;
      font-weight: 500;
    }

    .row-badge {
      text-align: center;
      font-size: 1.5rem;
    }

    .milestones-section {
      background: white;
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      margin-bottom: 2rem;
    }

    .milestones-section h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      text-align: center;
      margin: 0 0 2rem 0;
    }

    .milestones-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }

    .milestone {
      text-align: center;
      padding: 1.5rem;
      border-radius: 1rem;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .milestone.achieved {
      background: linear-gradient(135deg, #10b981, #0ea5e9);
      color: white;
      box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
      transform: translateY(-5px);
    }

    .milestone.pending {
      background: #f8fafc;
      color: #6b7280;
      border: 2px dashed #d1d5db;
    }

    .milestone-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .milestone-title {
      font-size: 1.125rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }

    .milestone-points {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .competition-info {
      background: white;
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    .competition-info h3 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      text-align: center;
      margin: 0 0 2rem 0;
    }

    .points-breakdown {
      display: grid;
      gap: 1rem;
    }

    .point-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.5rem;
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      border-radius: 0.75rem;
      border-left: 4px solid #10b981;
      transition: all 0.2s ease;
    }

    .point-item:hover {
      transform: translateX(5px);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .point-action {
      font-weight: 500;
      color: #1f2937;
    }

    .point-value {
      font-weight: 700;
      color: #10b981;
      font-size: 1.125rem;
    }

    @media (max-width: 768px) {
      .container {
        padding: 0 0.5rem;
      }

      .main-title {
        font-size: 2rem;
      }

      .page-subtitle {
        font-size: 1rem;
      }

      .podium {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .podium-position.rank-gold {
        transform: none;
        order: -1;
      }

      .table-header {
        display: none;
      }

      .table-row {
        grid-template-columns: 1fr;
        gap: 1rem;
        padding: 1.5rem;
        border-radius: 0.75rem;
        margin-bottom: 1rem;
        background: white;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .row-rank {
        justify-content: space-between;
      }

      .milestones-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }

      .rank-info {
        flex-direction: column;
        text-align: center;
        gap: 1rem;
      }
    }
  `;
  
  return (
    <>
      <style>{styles}</style>
      <div className="leaderboard-container">
        <div className="container">
          {/* Header Section */}
          <div className="header-section">
            <h1 className="main-title">🏆 Leaderboard</h1>
            <p className="page-subtitle">
              See how you rank among our waste management heroes!
            </p>
          </div>

          {/* User's Current Rank */}
          {userRank && (
            <div className="user-rank-card">
              <div className="rank-info">
                <div className="rank-position">
                  <span className="rank-number">#{userRank}</span>
                  <span className="rank-icon">{getRankIcon(userRank)}</span>
                </div>
                <div className="rank-details">
                  <h3>Your Current Rank</h3>
                  <p>{user.name || user.email}</p>
                  <p className="points">{user.points || 0} points</p>
                </div>
              </div>
            </div>
          )}
          
          <div className="main-card">
            <div className="card-header">
              <h2 className="card-title">Top Waste Warriors</h2>
            </div>
            
            {leaderboard.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <h3>No rankings available</h3>
                <p>Be the first to earn points and claim the top spot!</p>
              </div>
            ) : (
              <>
                {/* Top 3 Podium */}
                <div className="podium">
                  {leaderboard.slice(0, 3).map((player, index) => (
                    <div key={player._id} className={`podium-position ${getRankClass(index + 1)}`}>
                      <div className="podium-rank">{getRankIcon(index + 1)}</div>
                      <div className="podium-avatar">
                        {(player.name || player.email).charAt(0).toUpperCase()}
                      </div>
                      <div className="podium-name">
                        {player.name || player.email}
                        {player._id === user._id && ' (You)'}
                      </div>
                      <div className="podium-points">{player.points} pts</div>
                    </div>
                  ))}
                </div>

                {/* Full Leaderboard Table */}
                <div className="leaderboard-table">
                  <div className="table-header">
                    <div className="header-rank">Rank</div>
                    <div className="header-name">Name</div>
                    <div className="header-points">Points</div>
                    <div className="header-badge">Badge</div>
                  </div>
                  
                  <div className="table-body">
                    {leaderboard.map((player, index) => (
                      <div 
                        key={player._id} 
                        className={`table-row ${player._id === user._id ? 'current-user' : ''} ${getRankClass(index + 1)}`}
                      >
                        <div className="row-rank">
                          <span className="rank-number">#{index + 1}</span>
                          <span className="rank-icon">{getRankIcon(index + 1)}</span>
                        </div>
                        <div className="row-name">
                          <div className="player-avatar">
                            {(player.name || player.email).charAt(0).toUpperCase()}
                          </div>
                          <div className="player-info">
                            <div className="player-name">
                              {player.name || player.email}
                              {player._id === user._id && <span className="you-indicator">(You)</span>}
                            </div>
                            {index < 3 && (
                              <div className="player-title">
                                {index === 0 && 'Waste Champion'}
                                {index === 1 && 'Eco Warrior'}
                                {index === 2 && 'Green Hero'}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="row-points">
                          <span className="points-number">{player.points}</span>
                          <span className="points-label">points</span>
                        </div>
                        <div className="row-badge">
                          {player.points >= 1000 && '🏆'}
                          {player.points >= 500 && player.points < 1000 && '⭐'}
                          {player.points >= 100 && player.points < 500 && '🌟'}
                          {player.points < 100 && '🌱'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Point Milestones */}
          <div className="milestones-section">
            <h3>Point Milestones</h3>
            <div className="milestones-grid">
              <div className={`milestone ${(user.points || 0) >= 10 ? 'achieved' : 'pending'}`}>
                <div className="milestone-icon">🌱</div>
                <div className="milestone-title">Beginner</div>
                <div className="milestone-points">10+ points</div>
              </div>
              <div className={`milestone ${(user.points || 0) >= 100 ? 'achieved' : 'pending'}`}>
                <div className="milestone-icon">🌟</div>
                <div className="milestone-title">Active</div>
                <div className="milestone-points">100+ points</div>
              </div>
              <div className={`milestone ${(user.points || 0) >= 500 ? 'achieved' : 'pending'}`}>
                <div className="milestone-icon">⭐</div>
                <div className="milestone-title">Champion</div>
                <div className="milestone-points">500+ points</div>
              </div>
              <div className={`milestone ${(user.points || 0) >= 1000 ? 'achieved' : 'pending'}`}>
                <div className="milestone-icon">🏆</div>
                <div className="milestone-title">Legend</div>
                <div className="milestone-points">1000+ points</div>
              </div>
            </div>
          </div>

          {/* Competition Info */}
          <div className="competition-info">
            <h3>How to Earn Points</h3>
            <div className="points-breakdown">
              <div className="point-item">
                <span className="point-action">Report waste</span>
                <span className="point-value">+5 points</span>
              </div>
              <div className="point-item">
                <span className="point-action">Collect waste</span>
                <span className="point-value">+10 points</span>
              </div>
              <div className="point-item">
                <span className="point-action">Verify collection</span>
                <span className="point-value">+15 points</span>
              </div>
              <div className="point-item">
                <span className="point-action">Complete soil analysis</span>
                <span className="point-value">+3 points</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Leaderboard;