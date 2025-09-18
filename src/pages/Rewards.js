import React, { useState } from 'react';

const Rewards = ({ user }) => {
  const [selectedReward, setSelectedReward] = useState(null);
  const [redeeming, setRedeeming] = useState(false);

  const rewards = [
    {
      id: 1,
      title: "Eco-friendly Water Bottle",
      points: 100,
      description: "Stainless steel water bottle with Zero2Hero branding",
      image: "🍃",
      available: true,
      category: "Eco Products"
    },
    {
      id: 2,
      title: "Reusable Shopping Bag Set",
      points: 250,
      description: "Set of 3 organic cotton shopping bags",
      image: "🛍️",
      available: true,
      category: "Eco Products"
    },
    {
      id: 3,
      title: "Organic Cotton T-shirt",
      points: 500,
      description: "Comfortable t-shirt made from 100% organic cotton",
      image: "👕",
      available: true,
      category: "Apparel"
    },
    {
      id: 4,
      title: "Smart Compost Bin",
      points: 1000,
      description: "IoT-enabled compost bin with monitoring features",
      image: "🗑️",
      available: true,
      category: "Smart Home"
    },
    {
      id: 5,
      title: "Plant Starter Kit",
      points: 150,
      description: "Everything you need to start your home garden",
      image: "🌱",
      available: true,
      category: "Gardening"
    },
    {
      id: 6,
      title: "Solar Power Bank",
      points: 750,
      description: "Portable solar-powered charging device",
      image: "☀️",
      available: true,
      category: "Tech"
    },
    {
      id: 7,
      title: "Bamboo Utensil Set",
      points: 80,
      description: "Portable bamboo fork, knife, and spoon set",
      image: "🍴",
      available: true,
      category: "Eco Products"
    },
    {
      id: 8,
      title: "Zero Waste Starter Kit",
      points: 300,
      description: "Complete kit for beginning your zero waste journey",
      image: "♻️",
      available: true,
      category: "Lifestyle"
    }
  ];

  const categories = [...new Set(rewards.map(r => r.category))];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredRewards = selectedCategory === 'All' 
    ? rewards 
    : rewards.filter(reward => reward.category === selectedCategory);

  const handleRedeem = async (reward) => {
    if ((user.points || 0) < reward.points) {
      alert(`You need ${reward.points - (user.points || 0)} more points to redeem this reward.`);
      return;
    }

    setRedeeming(true);
    setSelectedReward(reward);

    // Simulate API call
    setTimeout(() => {
      alert(`Congratulations! You've successfully redeemed: ${reward.title}`);
      setRedeeming(false);
      setSelectedReward(null);
      // In a real app, you'd update the user's points and add the reward to their inventory
    }, 2000);
  };

  const canAfford = (rewardPoints) => (user.points || 0) >= rewardPoints;

  const styles = `
    .rewards-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      padding: 2rem 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .header-section {
      text-align: center;
      margin-bottom: 3rem;
    }

    .main-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #059669, #0284c7);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .page-subtitle {
      font-size: 1.25rem;
      color: #6b7280;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.6;
    }

    .points-section {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .points-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      border: 1px solid #f3f4f6;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .points-icon {
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      border-radius: 50%;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }

    .points-info h2 {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0;
    }

    .points-info p {
      color: #6b7280;
      margin: 0.25rem 0 0 0;
      font-weight: 500;
    }

    .milestone-card {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      border: 1px solid #f3f4f6;
    }

    .milestone-title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .progress-bar-container {
      background: #f3f4f6;
      border-radius: 9999px;
      height: 12px;
      margin-bottom: 0.75rem;
      overflow: hidden;
    }

    .progress-bar-fill {
      height: 100%;
      background: linear-gradient(90deg, #10b981, #0ea5e9);
      border-radius: 9999px;
      transition: width 0.5s ease;
    }

    .progress-text {
      color: #6b7280;
      font-size: 0.875rem;
      margin: 0;
    }

    .category-filters {
      margin-bottom: 2rem;
    }

    .filter-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      justify-content: center;
    }

    .filter-btn {
      padding: 0.75rem 1.5rem;
      border-radius: 9999px;
      font-weight: 500;
      border: 2px solid #e5e7eb;
      background: white;
      color: #6b7280;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .filter-btn:hover {
      background: #f9fafb;
      border-color: #d1d5db;
    }

    .filter-btn.active {
      background: linear-gradient(135deg, #10b981, #0ea5e9);
      color: white;
      border-color: transparent;
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
    }

    .rewards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-bottom: 3rem;
    }

    .reward-card {
      background: white;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      border: 1px solid #f3f4f6;
      transition: all 0.3s ease;
    }

    .reward-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
    }

    .reward-card.locked {
      opacity: 0.7;
    }

    .reward-image-section {
      position: relative;
      padding: 2rem;
      text-align: center;
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
    }

    .reward-emoji {
      font-size: 3rem;
      margin-bottom: 0.5rem;
    }

    .lock-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
    }

    .reward-content {
      padding: 1.5rem;
    }

    .reward-category-tag {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #dbeafe;
      color: #1e40af;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 9999px;
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.025em;
    }

    .reward-title {
      font-size: 1.125rem;
      font-weight: 700;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
      line-height: 1.4;
    }

    .reward-description {
      color: #6b7280;
      font-size: 0.875rem;
      line-height: 1.5;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .reward-points-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1rem;
    }

    .points-cost {
      font-size: 1.5rem;
      font-weight: 700;
      color: #10b981;
    }

    .points-label {
      color: #6b7280;
      font-size: 0.875rem;
      font-weight: 500;
    }

    .points-needed {
      color: #ef4444;
      font-size: 0.75rem;
      font-weight: 500;
      text-align: center;
      margin-bottom: 0.75rem;
    }

    .reward-btn {
      width: 100%;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.875rem;
    }

    .reward-btn.primary {
      background: linear-gradient(135deg, #10b981, #0ea5e9);
      color: white;
    }

    .reward-btn.primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 10px 20px rgba(16, 185, 129, 0.3);
    }

    .reward-btn.disabled {
      background: #f3f4f6;
      color: #9ca3af;
      cursor: not-allowed;
    }

    .earn-points-section {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      border: 1px solid #f3f4f6;
      margin-bottom: 2rem;
    }

    .earn-points-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1f2937;
      text-align: center;
      margin-bottom: 2rem;
    }

    .earn-points-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }

    .earn-point-item {
      text-align: center;
      padding: 1.5rem;
      border-radius: 0.75rem;
      background: linear-gradient(135deg, #f8fafc, #f1f5f9);
      border: 1px solid #e2e8f0;
      transition: all 0.3s ease;
    }

    .earn-point-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    }

    .earn-icon {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    .earn-point-item h4 {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
      margin: 0 0 0.5rem 0;
    }

    .earn-point-item p {
      color: #6b7280;
      font-size: 0.875rem;
      margin: 0 0 1rem 0;
      line-height: 1.5;
    }

    .point-value {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: linear-gradient(135deg, #10b981, #0ea5e9);
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      border-radius: 9999px;
    }

    .history-section {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      border: 1px solid #f3f4f6;
      margin-bottom: 2rem;
    }

    .history-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .history-content {
      color: #6b7280;
      font-style: italic;
      text-align: center;
      padding: 2rem;
      background: #f9fafb;
      border-radius: 0.5rem;
    }

    .terms-section {
      background: white;
      border-radius: 1rem;
      padding: 2rem;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      border: 1px solid #f3f4f6;
    }

    .terms-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 1rem;
    }

    .terms-list {
      list-style: none;
      padding: 0;
    }

    .terms-list li {
      color: #6b7280;
      font-size: 0.875rem;
      margin-bottom: 0.75rem;
      padding-left: 1.5rem;
      position: relative;
      line-height: 1.5;
    }

    .terms-list li:before {
      content: "•";
      color: #10b981;
      font-weight: bold;
      position: absolute;
      left: 0;
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

      .points-section {
        grid-template-columns: 1fr;
        gap: 1rem;
      }

      .points-card {
        padding: 1.5rem;
      }

      .filter-buttons {
        justify-content: flex-start;
        overflow-x: auto;
        padding-bottom: 0.5rem;
      }

      .rewards-grid {
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 1rem;
      }

      .earn-points-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="rewards-container">
        <div className="container">
          {/* Header Section */}
          <div className="header-section">
            <h1 className="main-title">🏪 Rewards Store</h1>
            <p className="page-subtitle">
              Redeem your hard-earned points for eco-friendly rewards and sustainable products!
            </p>
          </div>

          {/* User Points Display */}
          <div className="points-section">
            <div className="points-card">
              <div className="points-icon">🏆</div>
              <div className="points-info">
                <h2>{user?.points || 0}</h2>
                <p>Available Points</p>
              </div>
            </div>

            <div className="milestone-card">
              <h4 className="milestone-title">Next Milestone</h4>
              <div className="progress-bar-container">
                <div 
                  className="progress-bar-fill"
                  style={{
                    width: `${Math.min(((user?.points || 0) % 500) / 500 * 100, 100)}%`
                  }}
                ></div>
              </div>
              <p className="progress-text">
                {500 - ((user?.points || 0) % 500)} points to next reward tier
              </p>
            </div>
          </div>

          {/* Category Filter */}
          <div className="category-filters">
            <div className="filter-buttons">
              <button 
                className={`filter-btn ${selectedCategory === 'All' ? 'active' : ''}`}
                onClick={() => setSelectedCategory('All')}
              >
                All Categories
              </button>
              {categories.map(category => (
                <button 
                  key={category}
                  className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Rewards Grid */}
          <div className="rewards-grid">
            {filteredRewards.map(reward => (
              <div 
                key={reward.id} 
                className={`reward-card ${!canAfford(reward.points) ? 'locked' : ''}`}
              >
                <div className="reward-image-section">
                  <div className="reward-emoji">{reward.image}</div>
                  {!canAfford(reward.points) && (
                    <div className="lock-overlay">🔒</div>
                  )}
                </div>
                
                <div className="reward-content">
                  <div className="reward-category-tag">{reward.category}</div>
                  
                  <h3 className="reward-title">{reward.title}</h3>
                  
                  <p className="reward-description">{reward.description}</p>
                  
                  <div className="reward-points-section">
                    <span className="points-cost">{reward.points}</span>
                    <span className="points-label">points</span>
                  </div>
                  
                  {!canAfford(reward.points) && (
                    <div className="points-needed">
                      Need {reward.points - (user?.points || 0)} more points
                    </div>
                  )}
                  
                  <button 
                    className={`reward-btn ${canAfford(reward.points) ? 'primary' : 'disabled'}`}
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford(reward.points) || redeeming}
                  >
                    {redeeming && selectedReward?.id === reward.id ? 'Redeeming...' : 
                     canAfford(reward.points) ? 'Redeem' : 'Not Enough Points'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* How to Earn More Points */}
          <div className="earn-points-section">
            <h3 className="earn-points-title">How to Earn More Points</h3>
            <div className="earn-points-grid">
              <div className="earn-point-item">
                <div className="earn-icon">📝</div>
                <h4>Report Waste</h4>
                <p>Find and report waste in your community</p>
                <span className="point-value">+5 points</span>
              </div>
              <div className="earn-point-item">
                <div className="earn-icon">🗑️</div>
                <h4>Collect Waste</h4>
                <p>Help clean up by collecting reported waste</p>
                <span className="point-value">+10 points</span>
              </div>
              <div className="earn-point-item">
                <div className="earn-icon">🌱</div>
                <h4>Soil Analysis</h4>
                <p>Complete soil analysis for better composting</p>
                <span className="point-value">+3 points</span>
              </div>
              <div className="earn-point-item">
                <div className="earn-icon">🏆</div>
                <h4>Referrals</h4>
                <p>Invite friends to join Zero2Hero</p>
                <span className="point-value">+25 points</span>
              </div>
            </div>
          </div>

          {/* Reward History */}
          <div className="history-section">
            <div className="history-title">Reward History</div>
            <div className="history-content">
              <p>You haven't redeemed any rewards yet. Start earning points to unlock amazing eco-friendly products!</p>
              {/* In a real app, this would show the user's redemption history */}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="terms-section">
            <h4 className="terms-title">Reward Terms</h4>
            <ul className="terms-list">
              <li>Points cannot be transferred between accounts</li>
              <li>Rewards are subject to availability</li>
              <li>Allow 7-10 business days for reward delivery</li>
              <li>Points expire after 2 years of inactivity</li>
              <li>Zero2Hero reserves the right to modify rewards and point values</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Rewards;