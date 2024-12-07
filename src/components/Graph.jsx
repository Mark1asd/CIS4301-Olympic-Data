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
    <div style={{ color: 'red', position: 'relative' }}>
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

      {/* Info Icon with Tooltip */}
      <div style={{ textAlign: 'right', margin: '10px 20px', position: 'relative' }}>
        <span
          style={{
            cursor: 'pointer',
            display: 'inline-block',
            fontSize: '18px',
            color: 'white',
            backgroundColor: '#444',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            lineHeight: '24px',
            textAlign: 'center',
            position: 'relative',
          }}
          onMouseEnter={(e) => {
            const tooltip = e.currentTarget.querySelector('.tooltip');
            tooltip.style.visibility = 'visible';
            tooltip.style.opacity = 1;
          }}
          onMouseLeave={(e) => {
            const tooltip = e.currentTarget.querySelector('.tooltip');
            tooltip.style.visibility = 'hidden';
            tooltip.style.opacity = 0;
          }}
        >
          ?
          <div
            className="tooltip"
            style={{
              position: 'absolute',
              bottom: '30px',
              right: '-50%',
              backgroundColor: '#444',
              color: 'white',
              padding: '10px',
              borderRadius: '5px',
              visibility: 'hidden',
              opacity: 0,
              transition: 'opacity 0.3s ease',
              textAlign: 'left',
              width: '200px',
              zIndex: 10,
            }}
          >
            Did you know? The Winter Olympics began in 1924 in France. On the graph, the upper dots represent the Summer Games, while the lower dots illustrate the Winter Games, starting from their inception in 1924.
          </div>
        </span>
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
                color: 'red',
              }}
              itemStyle={{ color: 'white' }}
              labelStyle={{ color: 'white' }}
            />
            <Line
              type="monotone"
              dataKey={selectedType === 'efficiency' ? 'efficiency' : 'medals'}
              stroke="white"
              strokeWidth={2}
              dot={{ r: 5, fill: 'white' }}
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
