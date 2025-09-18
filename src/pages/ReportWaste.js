import React, { useState } from 'react';
import LocationInput from '../components/LocationInput'; // Import the LocationInput component

// Modified ReportWaste Component
const ReportWaste = ({ user }) => {
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  const [estimatedAmount, setEstimatedAmount] = useState("");
  const [wasteType, setWasteType] = useState("");
  const [classificationResult, setClassificationResult] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [classifying, setClassifying] = useState(false);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result);
      };
      reader.readAsDataURL(file);

      // Automatically classify the waste
      await classifyWasteImage(file);
    }
  };

  const classifyWasteImage = async (file) => {
    setClassifying(true);
    try {
      // Simulate classification API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResult = {
        predicted_class: 'fruitpeel',
        confidence: 0.95
      };
      
      setClassificationResult(mockResult);
      setShowVerificationDialog(true);
    } catch (error) {
      console.error('Error classifying waste:', error);
      alert('Error classifying waste. Please try again.');
    }
    setClassifying(false);
  };

  const handleVerifyWaste = () => {
    if (classificationResult) {
      setWasteType(classificationResult.predicted_class);
      setShowVerificationDialog(false);
    }
  };

  const handleCancelVerification = () => {
    setShowVerificationDialog(false);
    setImage(null);
    setImageFile(null);
    setClassificationResult(null);
    if (document.getElementById('image-upload')) {
      document.getElementById('image-upload').value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile || !address || !estimatedAmount || !wasteType) {
      alert('Please fill all fields and upload an image');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      // Create form data for the API call
      const formData = new FormData();
      formData.append('image', imageFile);
      formData.append('address', address);
      formData.append('estimatedAmount', estimatedAmount);
      formData.append('wasteType', wasteType);
      if (coordinates) {
        formData.append('latitude', coordinates.lat);
        formData.append('longitude', coordinates.lng);
      }

      const response = await fetch('http://localhost:5000/api/report-waste', {
        method: 'POST',
        headers: {
          'Authorization': token
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        
        // Add notification
        if (window.addNotification) {
          window.addNotification({
            title: "Waste Reported Successfully",
            message: `You've reported ${getWasteDescription(wasteType).toLowerCase()} and earned ${data.points_earned} points!`,
            pointsEarned: data.points_earned
          });
        }

        // Update user points in parent component if available
        if (window.updateUserPoints) {
          window.updateUserPoints(data.points_earned);
        }

        // Show success popup
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 3000);

        // Reset form
        setImage(null);
        setImageFile(null);
        setAddress('');
        setCoordinates(null);
        setEstimatedAmount('');
        setWasteType('');
        setClassificationResult(null);
        setSuggestions([]);
        if (document.getElementById('image-upload')) {
          document.getElementById('image-upload').value = '';
        }
        
      } else {
        throw new Error('Failed to report waste');
      }
    } catch (error) {
      console.error('Error reporting waste:', error);
      alert('Error reporting waste. Please try again.');
    }

    setLoading(false);
  };

  const getWasteTypeDisplay = (type) => {
    const wasteTypeMap = {
      'cardboard': 'Cardboard',
      'fruitpeel': 'Fruit Peel',
      'garden': 'Garden Waste',
      'paper': 'Paper',
      'plastic': 'Plastic',
      'trash': 'Mixed Waste',
      'vegetable': 'Vegetable Waste'
    };
    return wasteTypeMap[type] || type;
  };

  const getWasteDescription = (type) => {
    const descriptions = {
      'plastic': 'Plastic waste',
      'trash': 'Mixed waste',
      'paper': 'Paper waste',
      'cardboard': 'Cardboard waste',
      'vegetable': 'Organic vegetable waste',
      'fruitpeel': 'Fruit peel waste',
      'garden': 'Garden waste'
    };
    return descriptions[type] || 'Waste material';
  };

  return (
    <div style={{
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh'
    }}>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>

      {/* Success Alert at Top */}
      {showPopup && result && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#dcfce7",
            border: "1px solid #bbf7d0",
            borderRadius: "8px",
            padding: "14px 24px",
            display: "flex",
            alignItems: "center",
            color: "#065f46",
            fontSize: "15px",
            fontWeight: "500",
            zIndex: 3000,
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              backgroundColor: "#10b981",
              color: "white",
              borderRadius: "50%",
              width: "28px",
              height: "28px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "12px",
              fontSize: "18px",
            }}
          >
            ✓
          </div>
          Report Submitted Successfully! You have earned {result.points_earned || 5} points for reporting waste.
        </div>
      )}
      
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
        color: 'white',
        padding: '40px 20px',
        textAlign: 'center',
        borderRadius: '12px',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: 'bold' }}>Report Waste</h1>
        <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
          Help keep your community clean by reporting waste that needs collection.
        </p>
      </div>

      {/* Main Form Container */}
      <form onSubmit={handleSubmit} style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          marginBottom: '25px',
          color: '#1f2937'
        }}>Report New Waste</h2>

        {/* Image Upload Section */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>Upload Waste Image *</label>
          
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div 
              onClick={() => document.getElementById('image-upload')?.click()}
              style={{
                flex: 1,
                border: '2px dashed #d1d5db',
                borderRadius: '8px',
                padding: '40px 20px',
                textAlign: 'center',
                cursor: 'pointer',
                backgroundColor: '#f9fafb',
                transition: 'all 0.2s'
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>📷</div>
              <div style={{ color: '#6b7280', fontSize: '14px' }}>
                {image ? 'Image selected - Click to change' : 'Click to upload image'}
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>
          
          {image && (
            <div style={{
              marginTop: '15px',
              position: 'relative',
              display: 'inline-block'
            }}>
              <img 
                src={image} 
                alt="Waste preview" 
                style={{
                  maxWidth: '600px',
                  maxHeight: '300px',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}
              />
              <button 
                type="button"
                onClick={() => {
                  setImage(null);
                  setImageFile(null);
                  setWasteType('');
                  setClassificationResult(null);
                  if (document.getElementById('image-upload')) {
                    document.getElementById('image-upload').value = '';
                  }
                }}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Remove
              </button>
              
              {classifying && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  borderRadius: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px'
                }}>
                  <div style={{
                    width: '30px',
                    height: '30px',
                    border: '3px solid transparent',
                    borderTop: '3px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '10px'
                  }}></div>
                  <span>Analyzing waste...</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Location + Waste Type in 2 columns */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          marginBottom: '25px',
          flexDirection: window.innerWidth < 768 ? 'column' : 'row'
        }}>
          
          {/* Location (Left Column) */}
          <div style={{ flex: 1, position: 'relative' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>Location *</label>
            
            {/* Use LocationInput component here */}
            <LocationInput 
              address={address}
              setAddress={setAddress}
              setCoordinates={setCoordinates}
            />

            <small style={{ color: '#6b7280', fontSize: '12px' }}>
              Be as specific as possible (e.g., "Near Bus Stop, Main Street, City")
            </small>
          </div>

          {/* Waste Type (Right Column) */}
          <div style={{ flex: 1 }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151',
              marginBottom: '8px'
            }}>Waste Type</label>
            <input
              type="text"
              value={wasteType ? getWasteTypeDisplay(wasteType) : ''}
              placeholder="Upload image to auto-detect waste type"
              readOnly
              disabled
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#f3f4f6',
                color: '#6b7280',
                cursor: 'not-allowed',
                boxSizing: 'border-box'
              }}
            />
            <small style={{ color: '#6b7280', fontSize: '12px' }}>
              This field is automatically filled after image analysis
            </small>
          </div>
        </div>

        {/* Estimated Amount Below */}
        <div style={{ marginBottom: '25px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            fontWeight: '600',
            color: '#374151',
            marginBottom: '8px'
          }}>Estimated Amount *</label>
          <input
            type="text"
            value={estimatedAmount}
            onChange={(e) => setEstimatedAmount(e.target.value)}
            placeholder="Approximately 100 kg"
            required
            style={{
              width: '100%',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              transition: 'border-color 0.2s',
              boxSizing: 'border-box'
            }}
          />
          <small style={{ color: '#6b7280', fontSize: '12px' }}>
            Provide your best estimate of the waste amount
          </small>
        </div>

        <button 
          type="submit" 
          disabled={loading || !imageFile || !wasteType}
          style={{
            backgroundColor: loading || !imageFile || !wasteType ? '#9ca3af' : '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            padding: '14px 28px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: loading || !imageFile || !wasteType ? 'not-allowed' : 'pointer',
            width: '100%',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? 'Processing...' : 'Report Waste'}
        </button>
      </form>

      {/* Verification Dialog */}
      {showVerificationDialog && classificationResult && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '30px',
            maxWidth: '500px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#1f2937',
                margin: '0 0 10px 0'
              }}>Verify Waste</h3>
            </div>
            
            <div style={{
              backgroundColor: '#dcfce7',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '25px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '15px'
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
                  fontSize: '16px',
                  marginRight: '10px'
                }}>✓</div>
                <h4 style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#065f46',
                  margin: 0
                }}>Verification Successful</h4>
              </div>
              
              <div style={{ space: '10px' }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    fontWeight: '500',
                    color: '#374151'
                  }}>Waste Type:</span>
                  <span style={{ color: '#6b7280' }}>
                    {getWasteDescription(classificationResult.predicted_class)}
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <span style={{
                    fontWeight: '500',
                    color: '#374151'
                  }}>Quantity:</span>
                  <span style={{ color: '#6b7280' }}>
                    Approximately 100 kg
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span style={{
                    fontWeight: '500',
                    color: '#374151'
                  }}>Confidence:</span>
                  <span style={{ color: '#6b7280' }}>
                    {(classificationResult.confidence * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button 
                onClick={handleCancelVerification}
                style={{
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleVerifyWaste}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Recent Reports Section */}
      {result && (
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "20px",
          marginTop: "30px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#1f2937",
            marginBottom: "15px"
          }}>
            Recent Reports
          </h3>

          {/* Header Row */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            fontWeight: "600",
            color: "#374151",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "8px",
            marginBottom: "10px"
          }}>
            <div style={{ flex: 1 }}>📍 Location</div>
            <div style={{ flex: 1, textAlign: "right" }}>Type</div>
          </div>

          {/* Data Row */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            borderBottom: "1px solid #f3f4f6"
          }}>
            <div style={{ flex: 1, color: "#374151" }}>{result.address}</div>
            <div style={{ flex: 1, textAlign: "right", color: "#6b7280" }}>
              {getWasteDescription(result.waste_type)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportWaste;