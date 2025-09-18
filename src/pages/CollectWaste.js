import React, { useState, useEffect } from 'react';

const CollectWaste = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [verificationImage, setVerificationImage] = useState(null);
  const [verificationFile, setVerificationFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingReports, setFetchingReports] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [error, setError] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 10; // number of reports per page

  const token = localStorage.getItem('token');

  // Fetch reports from backend with proper pagination - now includes completed reports within 24h
  const fetchReports = async (currentPage = 1) => {
    try {
      setFetchingReports(true);
      setError(null);
      
      // Fetch both pending and recently completed reports
      const response = await fetch(
        `http://localhost:5000/api/reports?status=available&page=${currentPage}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      if (data.success) {
        setReports(data.reports || []);
        setFilteredReports(data.reports || []);
        setTotal(data.total || 0);
        setTotalPages(data.total_pages || Math.ceil((data.total || 0) / limit));
        
        // If current page has no data and it's not the first page, go to previous page
        if ((data.reports || []).length === 0 && currentPage > 1) {
          setPage(currentPage - 1);
          fetchReports(currentPage - 1);
        }
      } else {
        setError(data.error || "Failed to load reports");
        setReports([]);
        setFilteredReports([]);
        setTotal(0);
        setTotalPages(0);
      }
    } catch (err) {
      console.error("Error fetching reports", err);
      setError("Network error: Unable to connect to server");
      setReports([]);
      setFilteredReports([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setFetchingReports(false);
    }
  };

  useEffect(() => {
    fetchReports(page);
    
    // Set up interval to refresh reports every 30 seconds
    const intervalId = setInterval(() => {
      fetchReports(page);
    }, 30000);

    return () => clearInterval(intervalId);
  }, [page, token]);

  useEffect(() => {
    filterReports();
  }, [reports, searchQuery]);

  const filterReports = () => {
    if (!searchQuery.trim()) {
      setFilteredReports(reports);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = reports.filter(
      report =>
        report.address.toLowerCase().includes(query) ||
        report.waste_type.toLowerCase().includes(query)
    );
    setFilteredReports(filtered);
  };

  // Pagination handlers with proper bounds checking
  const handlePrevious = () => {
    if (page > 1) {
      const newPage = page - 1;
      setPage(newPage);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      const newPage = page + 1;
      setPage(newPage);
    }
  };

  // Go to specific page
  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setPage(pageNum);
    }
  };

  const handleImageUpload = e => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      
      setVerificationFile(file);
      const reader = new FileReader();
      reader.onload = event => {
        setVerificationImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectAndVerify = report => {
    setSelectedReport(report);
    setShowVerificationModal(true);
    setVerificationImage(null);
    setVerificationFile(null);
    setVerificationResult(null);
  };

  const handleVerifyCollection = async () => {
    if (!verificationFile) {
      alert('Please upload an image first');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('verification_image', verificationFile);
      formData.append('report_id', selectedReport._id);

      const response = await fetch('http://localhost:5000/api/collect-waste', {
        method: 'POST',
        headers: {
          'Authorization': token,
        },
        body: formData
      });

      const data = await response.json();

      if (data.success && data.verified) {
        // Success case - Image verification passed (confidence >= 60%)
        setVerificationResult({
          success: true,
          verified: true,
          message: data.message || "Congratulations! Verification successful!",
          confidence: data.confidence,
          points_earned: data.points_earned
        });

        // Show success alert
        alert(`Congratulations! Verification successful! You earned ${data.points_earned} points`);

        // Add notification if available
        if (window.addNotification) {
          window.addNotification({
            title: 'Collection Completed',
            message: `You earned ${data.points_earned} points for waste collection!`,
            pointsEarned: data.points_earned,
            type: 'success'
          });
        }

        // Update user points if available
        if (window.updateUserPoints) {
          window.updateUserPoints(data.points_earned);
        }

        // Refresh the reports list after successful collection
        setTimeout(() => {
          fetchReports(page);
          closeModal();
        }, 2000);

      } else {
        // Failure case - Image verification failed (confidence < 60%)
        setVerificationResult({
          success: false,
          verified: false,
          message: data.message || 'Image verification failed! The uploaded image does not match the reported waste.',
          confidence: data.confidence || 0
        });
      }
    } catch (error) {
      console.error('Error verifying collection:', error);
      setVerificationResult({
        success: false,
        verified: false,
        message: 'Network error occurred during verification. Please try again.',
        confidence: 0
      });
    }

    setLoading(false);
  };

  const closeModal = () => {
    setShowVerificationModal(false);
    setSelectedReport(null);
    setVerificationImage(null);
    setVerificationFile(null);
    setVerificationResult(null);
  };

  const getStatusBadge = report => {
    const statusStyles = {
      'pending': { bg: '#dbeafe', color: '#1d4ed8', text: 'Available' },
      'in_progress': { bg: '#fef3c7', color: '#d97706', text: 'In Progress' },
      'completed': { bg: '#dcfce7', color: '#059669', text: 'Completed' },
    };

    const style = statusStyles[report.status] || statusStyles['pending'];

    return (
      <span
        style={{
          backgroundColor: style.bg,
          color: style.color,
          padding: '4px 12px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: '500',
        }}
      >
        {style.text}
      </span>
    );
  };

  const getRewardInfo = report => {
    // Calculate points based on waste type (you can modify this logic)
    const pointsMap = {
      'plastic': 10,
      'paper': 8,
      'cardboard': 12,
      'vegetable': 6,
      'fruitpeel': 6,
      'garden': 8,
      'trash': 5
    };
    
    const estimatedPoints = pointsMap[report.waste_type] || 10;
    
    if (report.status === 'completed' && report.collected_by === user?._id) {
      // Show actual points earned for completed collections by current user
      return (
        <div style={{
          backgroundColor: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '8px',
          padding: '12px',
          marginTop: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#d97706',
            marginBottom: '4px'
          }}>
            <span>🏆</span>
            <span>Reward Earned!</span>
          </div>
          <div style={{ fontSize: '12px', color: '#92400e' }}>
            You earned {report.points_earned || estimatedPoints} points for collecting this waste
          </div>
          <div style={{ fontSize: '12px', color: '#92400e', marginTop: '4px' }}>
            Collected on: {formatDate(report.collected_at || report.updated_at)}
          </div>
        </div>
      );
    } else if (report.status === 'completed') {
      // Show for completed collections by others
      return (
        <div style={{
          backgroundColor: '#f3f4f6',
          border: '1px solid #d1d5db',
          borderRadius: '8px',
          padding: '12px',
          marginTop: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#6b7280',
            marginBottom: '4px'
          }}>
            <span>✓</span>
            <span>Already Collected</span>
          </div>
          <div style={{ fontSize: '12px', color: '#6b7280' }}>
            This waste was collected by another user
          </div>
        </div>
      );
    } else {
      // Show potential reward for pending reports
      return (
        <div style={{
          backgroundColor: '#e0f2fe',
          border: '1px solid #81d4fa',
          borderRadius: '8px',
          padding: '12px',
          marginTop: '12px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '600',
            color: '#0277bd',
            marginBottom: '4px'
          }}>
            <span>💰</span>
            <span>Potential Reward</span>
          </div>
          <div style={{ fontSize: '12px', color: '#01579b' }}>
            Earn up to {estimatedPoints} points by collecting this waste
          </div>
        </div>
      );
    }
  };

  const getActionButton = report => {
    if (report.status === 'completed') {
      if (report.collected_by === user?._id) {
        return (
          <span
            style={{
              backgroundColor: '#dcfce7',
              color: '#059669',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              border: '2px solid #10b981'
            }}
          >
            ✓ Collected by You
          </span>
        );
      } else {
        return (
          <span
            style={{
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            Already Collected
          </span>
        );
      }
    }

    return (
      <button
        onClick={e => {
          e.stopPropagation();
          handleSelectAndVerify(report);
        }}
        style={{
          backgroundColor: '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '14px',
          fontWeight: '500',
          cursor: 'pointer',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={e => e.target.style.backgroundColor = '#2563eb'}
        onMouseOut={e => e.target.style.backgroundColor = '#3b82f6'}
      >
        Select & Verify
      </button>
    );
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const isRecentlyCompleted = (report) => {
    if (report.status !== 'completed') return false;
    
    const completedDate = new Date(report.collected_at || report.updated_at);
    const now = new Date();
    const hoursDiff = (now - completedDate) / (1000 * 60 * 60);
    
    return hoursDiff <= 24; // Within 24 hours
  };

  if (fetchingReports) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'Arial, sans-serif' }}>
        <div
          style={{
            display: 'inline-block',
            width: '30px',
            height: '30px',
            border: '3px solid #f3f3f3',
            borderTop: '3px solid #10b981',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginBottom: '20px',
          }}
        ></div>
        <p>Loading available reports...</p>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        color: 'white',
        padding: '30px 20px',
        textAlign: 'center',
        borderRadius: '12px',
        marginBottom: '25px'
      }}>
        <h1 style={{ margin: 0, fontSize: '26px', fontWeight: 'bold' }}>Collect Waste Reports</h1>
        <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>
          Help clean your community and earn rewards by collecting reported waste.
        </p>
      </div>

      {/* Search Bar */}
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        <input
          type="text"
          placeholder="Search by address or waste type..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          style={{ 
            width: '100%', 
            border: 'none', 
            outline: 'none', 
            fontSize: '16px', 
            backgroundColor: 'transparent',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* Reports Stats */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            Total Reports: <strong>{total}</strong>
          </span>
        </div>
        <div>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>
            Page {page} of {totalPages || 1}
          </span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px 16px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Reports List */}
      <div style={{ marginBottom: '20px' }}>
        {filteredReports.length === 0 && !error ? (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '40px 20px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
            <h3 style={{ margin: '0 0 8px 0', color: '#374151' }}>No Reports Available</h3>
            <p style={{ margin: 0, color: '#6b7280' }}>
              {total === 0 
                ? "There are currently no pending waste reports to collect."
                : "No reports match your search criteria."
              }
            </p>
          </div>
        ) : (
          filteredReports.map(report => (
            <div
              key={report._id}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                padding: '20px',
                marginBottom: '12px',
                boxShadow: report.status === 'completed' && report.collected_by === user?._id 
                  ? '0 4px 12px rgba(16, 185, 129, 0.2)' 
                  : '0 1px 3px rgba(0,0,0,0.1)',
                border: report.status === 'completed' && report.collected_by === user?._id 
                  ? '2px solid #10b981' 
                  : '1px solid #e5e7eb',
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = report.status === 'completed' && report.collected_by === user?._id 
                  ? '0 8px 20px rgba(16, 185, 129, 0.3)'
                  : '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = report.status === 'completed' && report.collected_by === user?._id 
                  ? '0 4px 12px rgba(16, 185, 129, 0.2)'
                  : '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              {/* Show recently completed badge */}
              {isRecentlyCompleted(report) && (
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: '#fef3c7',
                  color: '#d97706',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  RECENTLY COMPLETED
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>📍</span>
                  <span style={{ fontWeight: '600', fontSize: '16px', color: '#374151' }}>
                    {report.address}
                  </span>
                </div>
                {getStatusBadge(report)}
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px',
                  fontSize: '14px',
                  color: '#6b7280',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>🗑️</span>
                  <span>Type: {report.waste_type}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>⚖️</span>
                  <span>Amount: {report.estimated_amount}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>📅</span>
                  <span>Reported: {formatDate(report.created_at)}</span>
                </div>
                {report.confidence && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span>🎯</span>
                    <span>Confidence: {Math.round(report.confidence * 100)}%</span>
                  </div>
                )}
              </div>

              {/* Show reward information */}
              {getRewardInfo(report)}

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                {getActionButton(report)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ 
          marginTop: "20px", 
          display: "flex", 
          gap: "8px", 
          alignItems: "center", 
          justifyContent: "center",
          flexWrap: "wrap"
        }}>
          <button 
            onClick={handlePrevious} 
            disabled={page === 1}
            style={{
              padding: '10px 16px',
              backgroundColor: page === 1 ? '#f3f4f6' : '#3b82f6',
              color: page === 1 ? '#9ca3af' : 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Previous
          </button>
          
          {/* Page Numbers */}
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }
            
            return (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                style={{
                  padding: '10px 12px',
                  backgroundColor: page === pageNum ? '#3b82f6' : 'white',
                  color: page === pageNum ? 'white' : '#374151',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                {pageNum}
              </button>
            );
          })}
          
          <button 
            onClick={handleNext} 
            disabled={page >= totalPages}
            style={{
              padding: '10px 16px',
              backgroundColor: page >= totalPages ? '#f3f4f6' : '#3b82f6',
              color: page >= totalPages ? '#9ca3af' : 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Next
          </button>
        </div>
      )}

      {/* Verification Modal - Positioned at Top */}
      {showVerificationModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000,
            overflow: 'auto'
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "0 0 12px 12px",
              padding: "30px",
              width: "100%",
              maxWidth: "600px",
              margin: "0 auto",
              marginTop: "60px",
              minHeight: "auto",
              position: 'relative',
              top: 0,
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
            }}
          >
            <h3
              style={{
                margin: "0 10px 16px 0",
                fontSize: "20px",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              Verify Waste Collection
            </h3>

            {selectedReport && (
              <div
                style={{
                  backgroundColor: "#f8fafc",
                  padding: "16px",
                  borderRadius: "8px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ fontSize: "14px", color: "#374151", marginBottom: "8px" }}>
                  <strong>Location:</strong> {selectedReport.address}
                </div>
                <div style={{ fontSize: "14px", color: "#374151", marginBottom: "8px" }}>
                  <strong>Waste Type:</strong> {selectedReport.waste_type}
                </div>
                <div style={{ fontSize: "14px", color: "#374151" }}>
                  <strong>Amount:</strong> {selectedReport.estimated_amount}
                </div>
              </div>
            )}

            {!verificationResult ? (
              <>
                <p
                  style={{
                    margin: "0 0 20px 0",
                    color: "#6b7280",
                    fontSize: "14px",
                    textAlign: "center",
                  }}
                >
                  Upload a photo of the collected waste to verify and earn your reward.
                  The image will be compared with the original report.
                </p>

                <div style={{ marginBottom: "24px" }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: "14px",
                      fontWeight: "500",
                      marginBottom: "8px",
                      color: "#374151",
                    }}
                  >
                    Upload Verification Image *
                  </label>
                  <div
                    style={{
                      border: "2px dashed #d1d5db",
                      borderRadius: "8px",
                      padding: "40px 20px",
                      textAlign: "center",
                      cursor: "pointer",
                      backgroundColor: verificationImage ? "#f0f9ff" : "#f9fafb",
                      transition: "all 0.2s",
                    }}
                    onClick={() => document.getElementById("verification-upload").click()}
                  >
                    <div style={{ fontSize: "48px", marginBottom: "12px" }}>📤</div>
                    <div
                      style={{
                        color: "#374151",
                        fontSize: "16px",
                        fontWeight: "500",
                        marginBottom: "4px",
                      }}
                    >
                      {verificationImage
                        ? "Image selected - Click to change"
                        : "Click to upload image"}
                    </div>
                    <div style={{ color: "#9ca3af", fontSize: "12px" }}>
                      PNG, JPG, GIF up to 10MB
                    </div>
                    <input
                      id="verification-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: "none" }}
                    />
                  </div>

                  {verificationImage && (
                    <div style={{ marginTop: "16px", textAlign: "center" }}>
                      <img
                        src={verificationImage}
                        alt="Verification preview"
                        style={{
                          maxWidth: "100%",
                          width: "300px",
                          height: "200px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid #e5e7eb",
                        }}
                      />
                    </div>
                  )}
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    onClick={closeModal}
                    style={{
                      backgroundColor: "#f3f4f6",
                      color: "#374151",
                      border: "none",
                      borderRadius: "8px",
                      padding: "12px 24px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: "pointer",
                      flex: 1,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleVerifyCollection}
                    disabled={!verificationFile || loading}
                    style={{
                      backgroundColor:
                        !verificationFile || loading ? "#9ca3af" : "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: "8px",
                      padding: "12px 24px",
                      fontSize: "14px",
                      fontWeight: "500",
                      cursor: !verificationFile || loading ? "not-allowed" : "pointer",
                      flex: 2,
                    }}
                  >
                    {loading ? "Verifying..." : "Verify Collection"}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    backgroundColor: verificationResult.verified
                      ? "#dcfce7"
                      : "#fef2f2",
                    color: verificationResult.verified ? "#065f46" : "#dc2626",
                    borderRadius: "50%",
                    width: "80px",
                    height: "80px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    margin: "0 auto 20px",
                  }}
                >
                  {verificationResult.verified ? "✓" : "✗"}
                </div>

                <h4
                  style={{
                    margin: "0 0 12px 0",
                    color: verificationResult.verified ? "#065f46" : "#dc2626",
                    fontSize: "18px",
                  }}
                >
                  {verificationResult.verified
                    ? "Verification Successful!"
                    : "Verification Failed"}
                </h4>

                <p
                  style={{
                    margin: "0 0 16px 0",
                    color: "#6b7280",
                    fontSize: "14px",
                  }}
                >
                  {verificationResult.message}
                </p>

                {verificationResult.confidence > 0 && (
                  <p
                    style={{
                      margin: "0 0 16px 0",
                      color: "#6b7280",
                      fontSize: "14px",
                    }}
                  >
                    Confidence: {Math.round(verificationResult.confidence * 100)}%
                  </p>
                )}

                {verificationResult.verified && verificationResult.points_earned && (
                  <div
                    style={{
                      backgroundColor: "#fef3c7",
                      border: "1px solid #fcd34d",
                      borderRadius: "8px",
                      padding: "16px",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#d97706",
                        marginBottom: "4px",
                      }}
                    >
                      🎉 Congratulations!
                    </div>
                    <div style={{ fontSize: "14px", color: "#92400e" }}>
                      You earned {verificationResult.points_earned} points!
                    </div>
                  </div>
                )}

                <button
                  onClick={closeModal}
                  style={{
                    backgroundColor: "#3b82f6",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "12px 32px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer",
                  }}
                >
                  {verificationResult.verified ? "Great!" : "Try Again"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectWaste;