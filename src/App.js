import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001')
    .then((response) => {
      if(!response.ok) {
        throw new Error('Failed to fetch data from backend');
      }
      return response.json();
    })
    .then((data) => {
      setData(data);
    })
    .catch((error) => {
      setError(error.message);
    });
  }, []);

  return (
    <div>
      <h1>Athletes Data Example - 3 Rows</h1>

      {error && <p>Error: {error}</p>}

      {!error && data.length === 0 && <p>Loading data...</p>}

      {!error && data.length > 0 && (
        <ul>
          {data.map((row, index) => (
            <li key={index}>{JSON.stringify(row)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
