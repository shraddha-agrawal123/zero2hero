import React, { useState, useEffect } from "react";

const LocationInput = ({ address, setAddress, setCoordinates }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch suggestions from Photon API
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (address.length > 2) { // start search after 3 characters
        setLoading(true);
        try {
          const response = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(address)}&lang=en`);
          const data = await response.json();
          setSuggestions(data.features || []);
        } catch (err) {
          console.error("Error fetching suggestions:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // Debounce
    return () => clearTimeout(timeoutId);
  }, [address]);

  // Handle selecting a suggestion
  const handleSelect = (suggestion) => {
    const { properties, geometry } = suggestion;
    let displayAddress = properties.name || '';
    
    if (properties.city && properties.city !== properties.name) {
      displayAddress += properties.city ? `, ${properties.city}` : '';
    }
    if (properties.state && properties.state !== properties.city) {
      displayAddress += properties.state ? `, ${properties.state}` : '';
    }
    if (properties.country) {
      displayAddress += properties.country ? `, ${properties.country}` : '';
    }

    setAddress(displayAddress);
    
    if (geometry && geometry.coordinates) {
      const latLng = {
        lat: geometry.coordinates[1],
        lng: geometry.coordinates[0],
      };
      setCoordinates(latLng);
    }
    setSuggestions([]);
  };

  return (
    <div style={{ position: 'relative' }}>
      <input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Search location (e.g. Railway Road)..."
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

      {suggestions.length > 0 && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          border: '1px solid #d1d5db',
          borderTop: 'none',
          borderRadius: '0 0 8px 8px',
          maxHeight: '200px',
          overflowY: 'auto',
          zIndex: 1000,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          {loading && (
            <div style={{ padding: '12px', color: '#6b7280', textAlign: 'center' }}>
              Loading...
            </div>
          )}
          {suggestions.map((suggestion, index) => {
            const { properties } = suggestion;
            const displayText = [
              properties.name,
              properties.city,
              properties.state,
              properties.country
            ].filter(Boolean).join(', ');

            return (
              <div
                key={index}
                onClick={() => handleSelect(suggestion)}
                style={{
                  padding: '12px',
                  cursor: 'pointer',
                  borderBottom: index < suggestions.length - 1 ? '1px solid #f3f4f6' : 'none',
                  fontSize: '14px',
                  transition: 'background-color 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                {displayText}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LocationInput;