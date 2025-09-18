import React, { useState } from 'react';
import { Camera, Upload, Trash2, Recycle, Leaf, AlertCircle, CheckCircle, Sparkles, TestTube, Lightbulb } from 'lucide-react';
import './WasteClassification.css';

const WasteClassification = ({ user = { name: 'User', points: 150 } }) => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [soilType, setSoilType] = useState('loamy');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSoilAnalysis, setShowSoilAnalysis] = useState(false);

  // Soil database
  const soilDb = {
    'clay': { name: 'Clay Soil', icon: '🏺', color: 'clay' },
    'sandy': { name: 'Sandy Soil', icon: '🏖️', color: 'sandy' },
    'loamy': { name: 'Loamy Soil', icon: '🌱', color: 'loamy' },
    'silty': { name: 'Silty Soil', icon: '🪨', color: 'silty' }
  };

  // Nutrient database
  const nutrientDb = {
    'vegetable': {
      'Nitrogen (N)': '2.5-4% of dry weight',
      'Phosphorus (P)': '0.3-0.8% of dry weight',
      'Potassium (K)': '3-6% of dry weight',
      'Carbon:Nitrogen (C:N)': '15:1 (Ideal for composting)'
    },
    'fruitpeel': {
      'Nitrogen (N)': '1.5-3% of dry weight',
      'Potassium (K)': '8-12% of dry weight',
      'Calcium (Ca)': '0.5-2% of dry weight'
    },
    'garden': {
      'Nitrogen (N)': '1.5-3% of dry weight',
      'Phosphorus (P)': '0.2-0.5% of dry weight',
      'Silica (Si)': '2-5% (Strengthens plant cells)'
    },
    'paper': {
      'Carbon:Nitrogen (C:N)': '200:1 (High carbon)',
      'Lignin Content': '20-30% (Slow to decompose)'
    },
    'cardboard': {
      'Carbon:Nitrogen (C:N)': '350:1 (Very high carbon)',
      'Lignin Content': '25-35%'
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);
      setResult(null);
      setShowSoilAnalysis(false);
    }
  };

  const handleCameraCapture = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = handleImageUpload;
    input.click();
  };

  const classifyWaste = async () => {
    if (!imageFile) {
      alert('Please upload an image first');
      return;
    }

    setLoading(true);
    setShowSoilAnalysis(false);
    
    try {
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('soil_type', soilType);
      formData.append('analysis_type', 'waste');

      // Simulate API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 2000));
      simulateClassification();
    } catch (error) {
      console.error('Classification error:', error);
      simulateClassification();
    }
    
    setLoading(false);
  };

  const simulateClassification = () => {
    const wasteTypes = ['vegetable', 'fruitpeel', 'garden', 'paper', 'cardboard', 'plastic', 'trash'];
    const randomType = wasteTypes[Math.floor(Math.random() * wasteTypes.length)];
    const confidence = (Math.random() * 30 + 70).toFixed(2);
    
    const isBiodegradable = !['plastic', 'trash'].includes(randomType);
    const nutrients = nutrientDb[randomType] || {};
    
    setResult({
      class: randomType,
      confidence: confidence,
      biodegradable: isBiodegradable,
      message: isBiodegradable ? 
        'Biodegradable! Perfect for composting and soil enrichment.' : 
        'Non-biodegradable! Please dispose responsibly.',
      nutrients: nutrients,
      soilType: soilType
    });
  };

  const getSoilRecommendations = (wasteType, soilType) => {
    const soilDeficiencies = {
      'clay': ['Nitrogen (N)', 'Phosphorus (P)', 'Organic Matter'],
      'sandy': ['Potassium (K)', 'Magnesium (Mg)', 'Water Retention'],
      'loamy': ['Calcium (Ca)', 'Sulfur (S)'],
      'silty': ['Zinc (Zn)', 'Manganese (Mn)']
    };

    const wasteNutrients = nutrientDb[wasteType] || {};
    const soilNeeds = soilDeficiencies[soilType] || [];
    
    const recommendations = [];
    Object.keys(wasteNutrients).forEach(nutrient => {
      const isNeeded = soilNeeds.some(need => nutrient.startsWith(need));
      if (isNeeded) {
        recommendations.push(`${nutrient}: ${wasteNutrients[nutrient]}`);
      }
    });
    
    return recommendations.length > 0 ? recommendations : ["This waste provides general soil enrichment benefits"];
  };

  const getWasteIcon = (wasteType) => {
    const icons = {
      'vegetable': '🥬',
      'fruitpeel': '🍎',
      'garden': '🌿',
      'paper': '📄',
      'cardboard': '📦',
      'plastic': '🥤',
      'trash': '🗑️'
    };
    return icons[wasteType] || '🗑️';
  };

  const resetClassification = () => {
    setResult(null);
    setImage(null);
    setImageFile(null);
    setShowSoilAnalysis(false);
    const input = document.getElementById('image-upload');
    if (input) input.value = '';
  };

  return (
    <div className="waste-classification-container">
      <div className="waste-classification-content">
        {/* Header */}
        <div className="header-section">
          <h1 className="main-title">
            🌱 AI Waste Classification & Soil Analysis
          </h1>
          <p className="subtitle">
            Upload waste images for intelligent classification, biodegradability analysis, and personalized soil recommendations
          </p>
        </div>

        {/* User Info Banner */}
        <div className="user-banner">
          <div className="user-banner-content">
            <div className="user-info">
              <div className="user-icon">
                <Sparkles className="icon" />
              </div>
              <span className="user-name">Welcome, {user.name}!</span>
            </div>
            <div className="points-display">
              <span className="points-value">{user.points}</span>
              <span>Points</span>
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        <div className="upload-section">
          <div className="section-header">
            <Camera className="section-icon" />
            <h2 className="section-title">Upload Waste Image</h2>
          </div>
          
          <div className="upload-content">
            <div 
              className="upload-area"
              onClick={() => document.getElementById('image-upload').click()}
            >
              <div className="upload-area-content">
                <div className="upload-icon-container">
                  <Upload className="upload-icon" />
                </div>
                <div>
                  <p className="upload-text">
                    {image ? 'Image selected - Click to change' : 'Click to upload waste image'}
                  </p>
                  <p className="upload-subtext">Supports JPG, PNG, WebP formats</p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file-input"
                />
              </div>
            </div>
            
            <button 
              type="button"
              className="camera-button"
              onClick={handleCameraCapture}
            >
              <Camera className="button-icon" />
              <span>Use Camera</span>
            </button>
          </div>
          
          {image && (
            <div className="image-preview-container">
              <div className="image-preview">
                <img 
                  src={image} 
                  alt="Uploaded waste" 
                  className="preview-image"
                />
                <div className="image-actions">
                  <button 
                    type="button"
                    className="delete-button"
                    onClick={resetClassification}
                  >
                    <Trash2 className="delete-icon" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Soil Type Selection - Only show when image is uploaded */}
        {image && (
          <div className="soil-section">
            <div className="section-header">
              <TestTube className="section-icon soil-icon" />
              <h2 className="section-title">Select Your Soil Type</h2>
            </div>
            
            <div className="soil-grid">
              {Object.entries(soilDb).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setSoilType(key)}
                  className={`soil-button ${soilType === key ? `soil-button-active ${value.color}` : ''}`}
                >
                  <div className="soil-button-content">
                    <div className="soil-icon-large">{value.icon}</div>
                    <div className="soil-name">{value.name}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Classify Button */}
        {image && (
          <button 
            onClick={classifyWaste}
            disabled={loading}
            className={`classify-button ${loading ? 'classify-button-loading' : ''}`}
          >
            {loading ? (
              <div className="button-loading">
                <div className="loading-spinner"></div>
                <span>Analyzing...</span>
              </div>
            ) : (
              <div className="button-content">
                <Sparkles className="button-icon" />
                <span>Classify Waste</span>
              </div>
            )}
          </button>
        )}

        {/* Results Section */}
        {result && (
          <div className="results-section">
            {/* Classification Results */}
            <div className={`result-card ${result.biodegradable ? 'result-biodegradable' : 'result-nonbiodegradable'}`}>
              <div className="result-header">
                <h2 className="result-title">Classification Results</h2>
                <div className="waste-icon-large">
                  {getWasteIcon(result.class)}
                </div>
              </div>
              
              <div className="result-grid">
                <div className="result-item">
                  <div className="result-label">Waste Type</div>
                  <div className="result-value">{result.class.toUpperCase()}</div>
                </div>
                <div className="result-item">
                  <div className="result-label">Confidence</div>
                  <div className="result-value confidence">{result.confidence}%</div>
                </div>
                <div className="result-item">
                  <div className="result-label">Status</div>
                  <div className={`result-value status ${result.biodegradable ? 'biodegradable' : 'nonbiodegradable'}`}>
                    {result.biodegradable ? <CheckCircle className="status-icon" /> : <AlertCircle className="status-icon" />}
                    <span>{result.biodegradable ? 'Biodegradable' : 'Non-biodegradable'}</span>
                  </div>
                </div>
              </div>

              <div className={`result-message ${result.biodegradable ? 'message-biodegradable' : 'message-nonbiodegradable'}`}>
                {result.message}
              </div>
            </div>

            {/* Soil Analysis - Only show for biodegradable waste */}
            {result.biodegradable && (
              <>
                <div className="soil-analysis-section">
                  <div className="soil-analysis-header">
                    <div className="section-header-left">
                      <Leaf className="section-icon soil-icon" />
                      <h2 className="section-title">Soil Analysis</h2>
                    </div>
                    <button
                      onClick={() => setShowSoilAnalysis(!showSoilAnalysis)}
                      className="analysis-toggle-button"
                    >
                      <TestTube className="button-icon" />
                      <span>{showSoilAnalysis ? 'Hide Analysis' : 'Show Analysis'}</span>
                    </button>
                  </div>

                  {showSoilAnalysis && (
                    <div className="analysis-content">
                      {/* Nutrient Content */}
                      {Object.keys(result.nutrients).length > 0 && (
                        <div className="nutrient-section">
                          <h3 className="analysis-subtitle">
                            <span>🧪</span>
                            <span>Nutrient Content</span>
                          </h3>
                          <div className="nutrient-grid">
                            {Object.entries(result.nutrients).map(([nutrient, value]) => (
                              <div key={nutrient} className="nutrient-item">
                                <div className="nutrient-name">{nutrient}</div>
                                <div className="nutrient-value">{value}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Soil Recommendations */}
                      <div className="recommendation-section">
                        <h3 className="analysis-subtitle">
                          <span>{soilDb[result.soilType].icon}</span>
                          <span>Recommendations for {soilDb[result.soilType].name}</span>
                        </h3>
                        <div className="recommendation-list">
                          {getSoilRecommendations(result.class, result.soilType).map((rec, index) => (
                            <div key={index} className="recommendation-item">
                              <Lightbulb className="recommendation-icon" />
                              <div className="recommendation-text">{rec}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Composting Tips */}
                <div className="composting-tips">
                  <h3 className="tips-title">
                    <Recycle className="tips-icon" />
                    <span>🌟 Pro Composting Tips</span>
                  </h3>
                  <div className="tips-grid">
                    {[
                      { icon: '🍂', tip: 'Mix with brown materials (dry leaves, paper) for better decomposition' },
                      { icon: '💧', tip: 'Maintain proper moisture levels - should feel like a wrung-out sponge' },
                      { icon: '🔄', tip: 'Turn compost regularly for proper aeration and faster breakdown' },
                      { icon: '🌡️', tip: 'Ideal temperature: 140-160°F (60-71°C) for optimal decomposition' }
                    ].map((item, index) => (
                      <div key={index} className="tip-item">
                        <div className="tip-content">
                          <div className="tip-icon">{item.icon}</div>
                          <div className="tip-text">{item.tip}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Non-biodegradable disposal info */}
            {!result.biodegradable && (
              <div className="disposal-info">
                <h3 className="disposal-title">
                  <AlertCircle className="disposal-icon" />
                  <span>Proper Disposal Guidelines</span>
                </h3>
                <div className="disposal-content">
                  {result.class === 'plastic' && (
                    <div className="disposal-list">
                      {[
                        '🔍 Check recycling number on the plastic container',
                        '🧽 Clean thoroughly before placing in recycling bin',
                        '🏢 Take to designated recycling centers if needed',
                        '🌱 Consider eco-friendly alternatives for future use'
                      ].map((tip, index) => (
                        <div key={index} className="disposal-item">
                          <div className="disposal-bullet"></div>
                          <div>{tip}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {result.class === 'trash' && (
                    <div className="disposal-list">
                      {[
                        '🗑️ Dispose in general waste bin safely',
                        '♻️ Check if any parts can be recycled separately',
                        '📉 Reduce usage of such items in the future',
                        '🌍 Consider environmental impact of alternatives'
                      ].map((tip, index) => (
                        <div key={index} className="disposal-item">
                          <div className="disposal-bullet"></div>
                          <div>{tip}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Button */}
            <button 
              className="action-button"
              onClick={resetClassification}
            >
              <Sparkles className="button-icon" />
              <span>Classify Another Item</span>
            </button>
          </div>
        )}

        {/* Educational Section - Show when no results */}
        {!result && !image && (
          <div className="educational-section">
            <h2 className="educational-title">How It Works</h2>
            <div className="steps-grid">
              {[
                { step: '1', icon: <Camera className="step-icon" />, title: 'Upload Image', desc: 'Take or upload a clear photo of the waste item', color: 'blue' },
                { step: '2', icon: <Sparkles className="step-icon" />, title: 'AI Analysis', desc: 'Our AI model classifies waste type and determines biodegradability', color: 'purple' },
                { step: '3', icon: <Leaf className="step-icon" />, title: 'Get Recommendations', desc: 'Receive personalized composting or disposal recommendations', color: 'green' }
              ].map((step, index) => (
                <div key={index} className="step-item">
                  <div className={`step-icon-container ${step.color}`}>
                    {step.icon}
                  </div>
                  <div className="step-title">{step.title}</div>
                  <div className="step-description">{step.desc}</div>
                </div>
              ))}
            </div>

            <div className="pro-tips-section">
              <h3 className="pro-tips-title">💡 Pro Tips for Best Results</h3>
              <div className="tips-grid">
                {[
                  { icon: '📷', title: 'Good Photos', desc: 'Take clear, well-lit photos with the waste item filling most of the frame', color: 'blue' },
                  { icon: '🎯', title: 'Single Items', desc: 'Focus on one type of waste at a time for best accuracy', color: 'purple' },
                  { icon: '🌍', title: 'Clean Items', desc: 'Clean items are easier to classify and provide better results', color: 'green' }
                ].map((tip, index) => (
                  <div key={index} className={`pro-tip-item ${tip.color}`}>
                    <div className="pro-tip-icon">{tip.icon}</div>
                    <div className="pro-tip-title">{tip.title}</div>
                    <div className="pro-tip-description">{tip.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WasteClassification;