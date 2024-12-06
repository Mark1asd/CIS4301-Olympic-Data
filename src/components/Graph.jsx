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

  return (
    <div style={{ color: 'white' }}>
      {/* Buttons for Medal Type */}
      <div style={{ marginBottom: '20px' }}>
        {['gold', 'silver', 'bronze', 'total'].map((type) => (
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
      {data[selectedType] && data[selectedType].length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data[selectedType]}>
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
            <Line
              type="monotone"
              dataKey="medals"
              stroke="white"
              strokeWidth={2}
              dot={{ r: 5, fill: 'white' }}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          No data available for {selectedType} medals.
        </div>
      )}
    </div>
  );
}

export default Graph;
