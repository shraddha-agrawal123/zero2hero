import React, { useState } from 'react';

const SoilAnalysis = ({ user }) => {
  const [selectedSoil, setSelectedSoil] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Soil database (same as in Flask app)
  const soilDb = {
    'clay': {
      name: 'Clay Soil',
      description: 'Fine particles, poor drainage, nutrient-rich but hard for roots to penetrate',
      deficiencies: ['Nitrogen (N)', 'Phosphorus (P)', 'Organic Matter'],
      suitable_wastes: ['fruitpeel', 'vegetable', 'garden'],
      characteristics: {
        'Drainage': 'Poor',
        'Water Retention': 'High',
        'Nutrient Retention': 'High',
        'pH Range': '6.0-7.5',
        'Texture': 'Fine, sticky when wet'
      }
    },
    'sandy': {
      name: 'Sandy Soil',
      description: 'Large particles, excellent drainage, low nutrient retention',
      deficiencies: ['Potassium (K)', 'Magnesium (Mg)', 'Water Retention'],
      suitable_wastes: ['cardboard', 'paper', 'garden'],
      characteristics: {
        'Drainage': 'Excellent',
        'Water Retention': 'Low',
        'Nutrient Retention': 'Low',
        'pH Range': '6.0-7.0',
        'Texture': 'Coarse, gritty'
      }
    },
    'loamy': {
      name: 'Loamy Soil',
      description: 'Perfect balance of sand, silt, and clay - ideal for most plants',
      deficiencies: ['Calcium (Ca)', 'Sulfur (S)'],
      suitable_wastes: ['vegetable', 'fruitpeel'],
      characteristics: {
        'Drainage': 'Good',
        'Water Retention': 'Moderate',
        'Nutrient Retention': 'Good',
        'pH Range': '6.0-7.0',
        'Texture': 'Smooth, slightly gritty'
      }
    },
    'silty': {
      name: 'Silty Soil',
      description: 'Medium-sized particles, good water retention, fertile but can compact',
      deficiencies: ['Zinc (Zn)', 'Manganese (Mn)'],
      suitable_wastes: ['fruitpeel', 'garden'],
      characteristics: {
        'Drainage': 'Moderate',
        'Water Retention': 'Good',
        'Nutrient Retention': 'High',
        'pH Range': '6.5-7.5',
        'Texture': 'Smooth, flour-like when dry'
      }
    }
  };

  // Nutrient database for waste types
  const nutrientDb = {
    'vegetable': {
      'Nitrogen (N)': '2.5-4% of dry weight',
      'Phosphorus (P)': '0.3-0.8% of dry weight',
      'Potassium (K)': '3-6% of dry weight',
      'Carbon:Nitrogen (C:N)': '15:1 (Ideal for composting)',
      'Benefits': 'Quick decomposition, balanced nutrients for plant growth'
    },
    'fruitpeel': {
      'Nitrogen (N)': '1.5-3% of dry weight',
      'Potassium (K)': '8-12% of dry weight',
      'Calcium (Ca)': '0.5-2% of dry weight',
      'Benefits': 'High potassium for flower and fruit development'
    },
    'garden': {
      'Nitrogen (N)': '1.5-3% of dry weight',
      'Phosphorus (P)': '0.2-0.5% of dry weight',
      'Silica (Si)': '2-5% (Strengthens plant cells)',
      'Benefits': 'Improves soil structure and plant disease resistance'
    },
    'paper': {
      'Carbon:Nitrogen (C:N)': '200:1 (High carbon)',
      'Lignin Content': '20-30% (Slow to decompose)',
      'Benefits': 'Excellent brown material for composting, improves soil structure'
    },
    'cardboard': {
      'Carbon:Nitrogen (C:N)': '350:1 (Very high carbon)',
      'Lignin Content': '25-35%',
      'Benefits': 'Long-term soil conditioning, moisture retention'
    }
  };

  const analyzeSoil = async () => {
    if (!selectedSoil) {
      alert('Please select a soil type first');
      return;
    }

    setLoading(true);

    try {
      // Try to call the Flask API
      const formData = new FormData();
      formData.append('soil_type', selectedSoil);
      formData.append('analysis_type', 'soil');

      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        processLocalSoilAnalysis();
      } else {
        processLocalSoilAnalysis();
      }
    } catch (error) {
      console.error('API call failed, using local analysis:', error);
      processLocalSoilAnalysis();
    }

    setLoading(false);
  };

  const processLocalSoilAnalysis = () => {
    const soilData = soilDb[selectedSoil];
    
    const recommendations = soilData.suitable_wastes.map(wasteType => ({
      type: wasteType,
      name: wasteType.charAt(0).toUpperCase() + wasteType.slice(1),
      nutrients: nutrientDb[wasteType] || {},
      priority: calculatePriority(wasteType, soilData.deficiencies)
    }));

    // Sort recommendations by priority
    recommendations.sort((a, b) => b.priority - a.priority);

    setAnalysisResult({
      soilType: selectedSoil,
      soilName: soilData.name,
      description: soilData.description,
      deficiencies: soilData.deficiencies,
      characteristics: soilData.characteristics,
      recommendations: recommendations,
      improvementTips: getImprovementTips(selectedSoil)
    });
  };

  const calculatePriority = (wasteType, deficiencies) => {
    const wasteNutrients = nutrientDb[wasteType] || {};
    let priority = 0;
    
    deficiencies.forEach(deficiency => {
      Object.keys(wasteNutrients).forEach(nutrient => {
        if (nutrient.includes(deficiency.split(' ')[0])) {
          priority += 1;
        }
      });
    });
    
    return priority;
  };

  const getImprovementTips = (soilType) => {
    const tips = {
      'clay': [
        'Add organic matter like compost to improve drainage',
        'Use raised beds to prevent waterlogging',
        'Add coarse sand or perlite to improve aeration',
        'Avoid walking on clay soil when wet',
        'Plant cover crops to improve soil structure'
      ],
      'sandy': [
        'Add organic matter frequently to retain nutrients',
        'Use mulch to prevent water evaporation',
        'Consider slow-release fertilizers',
        'Plant nitrogen-fixing cover crops',
        'Water more frequently but with less volume'
      ],
      'loamy': [
        'Maintain organic matter levels with regular compost',
        'Rotate crops to prevent nutrient depletion',
        'Test pH regularly and adjust as needed',
        'Use balanced fertilizers sparingly',
        'Continue sustainable practices'
      ],
      'silty': [
        'Improve drainage with organic matter',
        'Avoid compaction by minimizing foot traffic',
        'Add coarse materials like sand or compost',
        'Use raised beds if drainage is poor',
        'Plant deep-rooted plants to break up compaction'
      ]
    };

    return tips[soilType] || [];
  };

  const getSoilColor = (soilType) => {
    const colors = {
      'clay': '#8B4513',
      'sandy': '#F4A460',
      'loamy': '#654321',
      'silty': '#A0522D'
    };
    return colors[soilType] || '#8B4513';
  };

  const getWasteTypeIcon = (wasteType) => {
    const icons = {
      'vegetable': '🥬',
      'fruitpeel': '🍎',
      'garden': '🌿',
      'paper': '📄',
      'cardboard': '📦'
    };
    return icons[wasteType] || '🗂️';
  };

  const getSoilIcon = (soilType) => {
    const icons = {
      'clay': '🧱',
      'sandy': '🏖️',
      'loamy': '🌱',
      'silty': '💧'
    };
    return icons[soilType] || '🌍';
  };

  return (
    <div className="soil-analysis-page">
      <h1>Soil Analysis & Waste Recommendations</h1>
      <p className="page-description">
        Analyze your soil type and get personalized waste composting recommendations for optimal plant growth.
      </p>

      {/* User Info */}
      <div className="user-points-banner">
        <span>Welcome, {user.name || user.email}!</span>
        <span className="points">Points: {user.points || 0}</span>
      </div>

      {/* Soil Type Selection */}
      <div className="card">
        <div className="card-title">Select Your Soil Type</div>
        
        <div className="soil-types-grid">
          {Object.entries(soilDb).map(([key, value]) => (
            <div 
              key={key}
              onClick={() => setSelectedSoil(key)}
              className={`soil-type-card ${selectedSoil === key ? 'selected' : ''}`}
            >
              <div className="soil-icon" style={{ color: getSoilColor(key) }}>
                {getSoilIcon(key)}
              </div>
              <h3 style={{ color: getSoilColor(key) }}>
                {value.name}
              </h3>
              <p className="soil-description">
                {value.description}
              </p>
              <div className="soil-characteristics">
                <small>Drainage: {value.characteristics.Drainage}</small>
                <small>pH: {value.characteristics['pH Range']}</small>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={analyzeSoil}
          disabled={!selectedSoil || loading}
          className={`btn ${selectedSoil && !loading ? 'btn-primary' : 'btn-disabled'}`}
        >
          {loading ? 'Analyzing Soil...' : `Analyze ${selectedSoil ? soilDb[selectedSoil].name : 'Soil'}`}
        </button>
      </div>

      {/* Analysis Results */}
      {analysisResult && (
        <div className="analysis-results">
          <h2 style={{ color: getSoilColor(analysisResult.soilType) }}>
            {getSoilIcon(analysisResult.soilType)} {analysisResult.soilName} Analysis Results
          </h2>

          {/* Soil Characteristics */}
          <div className="card">
            <div className="card-title">Soil Characteristics</div>
            <p className="soil-description">{analysisResult.description}</p>
            <div className="characteristics-grid">
              {Object.entries(analysisResult.characteristics).map(([char, value]) => (
                <div key={char} className="characteristic-item">
                  <strong>{char}:</strong> {value}
                </div>
              ))}
            </div>
          </div>

          {/* Nutrient Deficiencies */}
          <div className="card">
            <div className="card-title">Common Deficiencies</div>
            <div className="deficiencies-list">
              {analysisResult.deficiencies.map((deficiency, index) => (
                <span key={index} className="deficiency-badge">
                  {deficiency}
                </span>
              ))}
            </div>
          </div>

          {/* Waste Recommendations */}
          <div className="card">
            <div className="card-title">Recommended Waste Types for Composting</div>
            <div className="recommendations-grid">
              {analysisResult.recommendations.map((rec, index) => (
                <div 
                  key={index}
                  className="recommendation-card"
                >
                  {rec.priority > 0 && (
                    <div className="priority-badge">HIGH PRIORITY</div>
                  )}
                  
                  <div className="waste-icon">
                    {getWasteTypeIcon(rec.type)}
                  </div>
                  <h4>{rec.name} Waste</h4>

                  <div className="nutrients-info">
                    <h5>Nutrient Content:</h5>
                    {Object.entries(rec.nutrients).map(([nutrient, value]) => (
                      <p key={nutrient}>
                        <strong>{nutrient}:</strong> {value}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Improvement Tips */}
          <div className="card">
            <div className="card-title">Soil Improvement Tips</div>
            <ul className="tips-list">
              {analysisResult.improvementTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>

          {/* Composting Timeline */}
          <div className="card">
            <div className="card-title">Estimated Composting Timeline</div>
            <div className="timeline-grid">
              {analysisResult.recommendations.map((rec, index) => {
                const timelines = {
                  'vegetable': '2-4 weeks',
                  'fruitpeel': '3-6 weeks',
                  'garden': '4-8 weeks',
                  'paper': '2-6 months',
                  'cardboard': '4-12 months'
                };
                
                return (
                  <div key={index} className="timeline-item">
                    <div className="timeline-icon">
                      {getWasteTypeIcon(rec.type)}
                    </div>
                    <div className="timeline-name">{rec.name}</div>
                    <div className="timeline-duration">
                      {timelines[rec.type]}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              onClick={() => setAnalysisResult(null)}
              className="btn btn-secondary"
            >
              Analyze Another Soil Type
            </button>
            <button
              onClick={() => window.print()}
              className="btn btn-primary"
            >
              Print Analysis
            </button>
          </div>
        </div>
      )}

      {/* Educational Section */}
      {!analysisResult && (
        <div className="educational-section">
          <h2>Learn About Soil Types</h2>
          
          <div className="education-grid">
            {Object.entries(soilDb).map(([key, value]) => (
              <div key={key} className="education-card">
                <div className="education-icon" style={{ color: getSoilColor(key) }}>
                  {getSoilIcon(key)}
                </div>
                <h3 style={{ color: getSoilColor(key) }}>
                  {value.name}
                </h3>
                <p>{value.description}</p>
                <div className="suitable-wastes">
                  <strong>Best for:</strong>
                  <div className="waste-icons">
                    {value.suitable_wastes.map(waste => 
                      <span key={waste}>{getWasteTypeIcon(waste)}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SoilAnalysis;