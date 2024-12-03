import React, { useState, useEffect } from 'react';
import { VectorMap } from '@react-jvectormap/core';
import { worldMill } from '@react-jvectormap/world';

function WorldMap() {
  const [countryData, setCountryData] = useState({}); // Data fetched from the backend
  const [zoomLevel, setZoomLevel] = useState(1); // State to manage zoom level

  // Fetch data from the backend
  useEffect(() => {
    async function fetchCountryData() {
      try {
        const response = await fetch('YOUR_BACKEND_API_ENDPOINT'); // Replace with your API endpoint
        const data = await response.json();

        // Assuming the backend returns an array of countries with medal counts
        // Example: [{ code: "US", gold: 10, silver: 20, bronze: 15 }, ...]
        const transformedData = data.reduce((acc, item) => {
          acc[item.code] = item; // Map data by country code
          return acc;
        }, {});

        setCountryData(transformedData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    }

    fetchCountryData();
  }, []);

  // Handle zoom in and zoom out
  const handleZoom = (direction) => {
    setZoomLevel((prevZoom) => {
      const newZoom = direction === 'in' ? Math.min(prevZoom * 1.5, 8) : Math.max(prevZoom / 1.5, 1);
      return newZoom;
    });
  };

  return (
    <div style={{ width: '100%', height: '100vh', backgroundColor: '#282c34', position: 'relative' }}>
      <VectorMap
        map={worldMill}
        backgroundColor="#282c34"
        containerStyle={{
          width: '100%',
          height: '100%',
        }}
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
              scale: ['#E2E2E2', '#BDBDBD'],
              values: {},
            },
          ],
        }}
        onRegionTipShow={(event, label, code) => {
          // Check if country data exists for the hovered country
          const country = countryData[code];
          if (country) {
            label.html(`
              <div style="background-color: #333; color: white; padding: 10px; border-radius: 5px; min-width: 150px;">
                <strong>${label.html()}</strong>
                <p>Gold: ${country.gold || 0}</p>
                <p>Silver: ${country.silver || 0}</p>
                <p>Bronze: ${country.bronze || 0}</p>
              </div>
            `);
          } else {
            label.html(`
              <div style="background-color: #333; color: white; padding: 10px; border-radius: 5px; min-width: 150px;">
                <strong>${label.html()}</strong>
                <p>No data available</p>
              </div>
            `);
          }
        }}
      />
    </div>
  );
}

export default WorldMap;
