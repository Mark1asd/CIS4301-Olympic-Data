import React, { useState, useEffect } from 'react'; 
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function Graph() {
  const [selectedType, setSelectedType] = useState('total'); // Default to 'total'
  const [data, setData] = useState({}); // State for backend data
  const [computedData, setComputedData] = useState([]); // State for computed upper and bottom points

  // Fetch data from the backend
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:3001/api/overtimegraph'); // Replace with your API endpoint
        const result = await response.json();
        setData(result); // Assume the backend returns an object with medal types as keys
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  // Compute upper and bottom points whenever data or selectedType changes
  useEffect(() => {
    if (data[selectedType]) {
      const upper = data[selectedType].map((point) => ({
        year: point.year,
        value: point.medals,
      }));
      const bottom = data[selectedType].map((point) => ({
        year: point.year,
        value: 0,
      }));
      setComputedData({ upper, bottom });
    }
  }, [data, selectedType]);

  return (
    <div style={{ color: 'white' }}>
      {/* Buttons for Medal Type */}
      <div style={{ marginBottom: '20px' }}>
        {['gold', 'silver', 'bronze', 'total', 'efficiency'].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            style={{
              margin: '5px',
              padding: '10px 15px',
              cursor: 'pointer',
              backgroundColor: selectedType === type ? '#444' : '#666',
              color: 'white',
              border: '1px solid white',
              borderRadius: '5px',
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} {/* Capitalize first letter */}
          </button>
        ))}
      </div>

      {/* Graph */}
      {computedData.upper && computedData.upper.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={computedData.upper}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="year" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#444',
                border: '1px solid white',
                color: 'white',
              }}
              itemStyle={{ color: 'white' }}
              labelStyle={{ color: 'white' }}
            />
            {/* Upper Line */}
            <Line
              type="monotone"
              data={computedData.upper}
              dataKey="value"
              stroke="white"
              strokeWidth={2}
              dot={{ r: 5, fill: 'white' }}
            />
            {/* Bottom Line */}
            <Line
              type="monotone"
              data={computedData.bottom}
              dataKey="value"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 5, fill: '#8884d8' }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          Loading data for {selectedType} medals...
        </div>
      )}
    </div>
  );
}

export default Graph;
