import React, { useState, useEffect } from 'react';
import { VectorMap } from '@react-jvectormap/core';
import { worldMill } from '@react-jvectormap/world';
import { useNavigate } from 'react-router-dom';

function WorldMap() {
  const [countryData, setCountryData] = useState({});
  const [zoomLevel, setZoomLevel] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCountryData() {
      try {
        const response = await fetch('http://localhost:3001/api/worldmap');
        const data = await response.json();
        const transformedData = data.reduce((acc, item) => {
          acc[item.code] = item;
          return acc;
        }, {});
        setCountryData(transformedData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    }

    fetchCountryData();

    // Cleanup the tooltip when the component unmounts
    return () => {
      // Remove any tooltips or labels (if any exist)
      const tooltips = document.querySelectorAll('.jvectormap-tip');
      tooltips.forEach(tooltip => tooltip.remove());
    };
  }, []);

  const handleRegionClick = (event, code) => {
    // Navigate to the CountryData page with the country code
    navigate(`/country-data/${code}`);
  };

  const handleZoom = (direction) => {
    setZoomLevel((prevZoom) => {
      const newZoom = direction === 'in' ? Math.min(prevZoom * 1.5, 8) : Math.max(prevZoom / 1.5, 1);
      return newZoom;
    });
  };

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#282c34', position: 'relative' }}>
      {Object.keys(countryData).length > 0 ? (
        <VectorMap
          map={worldMill}
          backgroundColor="#282c34"
          containerStyle={{ width: '100%', height: '100%' }}
          zoomMin={1}
          zoomMax={8}
          zoomOnScroll={false}
          focusOn={{
            scale: zoomLevel,
            x: 0.5,
            y: 0.5,
          }}
          series={{
            regions: [
              {
                scale: ['#E2E2E2', '#FFD700'],
                values: Object.fromEntries(
                  Object.entries(countryData).map(([code, { gold }]) => [code, gold || 0])
                )
              },
            ],
          }}
          onRegionClick={handleRegionClick}
          onRegionTipShow={(event, label, code) => {
            const country = countryData[code];
            if (country) {
              label.html(
                `<div style="background-color: #333; color: white; padding: 10px; border-radius: 5px; min-width: 150px;">
                  <strong>${label.html()}</strong>
                  <p>Gold: ${country.gold || 0}</p>
                  <p>Silver: ${country.silver || 0}</p>
                  <p>Bronze: ${country.bronze || 0}</p>
                </div>`
              );
            } else {
              label.html(
                `<div style="background-color: #333; color: white; padding: 10px; border-radius: 5px; min-width: 150px;">
                  <strong>${label.html()}</strong>
                  <p>No data available</p>
                </div>`
              );
            }
          }}
        />
      ) : (
        <div style={{ color: 'white', textAlign: 'center', marginTop: '20px' }}>Loading map data...</div>
      )}
    </div>
  );
}

export default WorldMap;
