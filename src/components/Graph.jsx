import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const mockData = {
  gold: [
    { year: '2000', medals: 50 },
    { year: '2004', medals: 70 },
    { year: '2008', medals: 80 },
    { year: '2012', medals: 90 },
    { year: '2016', medals: 100 },
    { year: '2020', medals: 120 },
  ],
  silver: [
    { year: '2000', medals: 40 },
    { year: '2004', medals: 60 },
    { year: '2008', medals: 70 },
    { year: '2012', medals: 80 },
    { year: '2016', medals: 90 },
    { year: '2020', medals: 100 },
  ],
  bronze: [
    { year: '2000', medals: 30 },
    { year: '2004', medals: 50 },
    { year: '2008', medals: 60 },
    { year: '2012', medals: 70 },
    { year: '2016', medals: 80 },
    { year: '2020', medals: 90 },
  ],
  total: [
    { year: '2000', medals: 120 },
    { year: '2004', medals: 180 },
    { year: '2008', medals: 210 },
    { year: '2012', medals: 240 },
    { year: '2016', medals: 270 },
    { year: '2020', medals: 310 },
  ],
};

function Graph() {
  const [selectedType, setSelectedType] = useState('total'); // Default to 'total'

  return (
    <div>
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
              backgroundColor: selectedType === type ? '#007BFF' : '#f0f0f0',
              color: selectedType === type ? '#fff' : '#000',
              border: '1px solid #ccc',
              borderRadius: '5px',
            }}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)} {/* Capitalize first letter */}
          </button>
        ))}
      </div>

      {/* Graph */}
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={mockData[selectedType]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="medals"
            stroke="#007BFF"
            strokeWidth={2}
            dot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Graph;
