import React, { useState, useEffect } from 'react';

function MedalDensityTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]); // State for backend data
  const [uniqueSports, setUniqueSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState(''); // User-selected sport
  const itemsPerPage = 10;

  useEffect(() => {
    async function fetchSports() {
      try {
        const response = await fetch('http://localhost:3001/api/sports');
        const result = await response.json();
        setUniqueSports(result.sort());
      } catch (error) {
        console.error('Error fetching sports:', error);
      }
    }
    fetchSports();
  }, []);

  useEffect(() => {
    if (!selectedSport) return;

    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:3001/api/medaldensity?sport=${encodeURIComponent(selectedSport)}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [selectedSport]);

  // Paginated data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

  // Total pages
  const totalPages = Math.ceil(data.length / itemsPerPage);

  return (
    <div style={{ textAlign: 'center', margin: '20px 0', fontFamily: 'Arial, sans-serif', color: 'white' }}>
      {/* Dropdown to select a sport */}
      <div style={{ marginBottom: '20px' }}>
        <select
          value={selectedSport}
          onChange={(e) => {
            setSelectedSport(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            padding: '10px',
            width: '300px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: '#444',
            color: 'white',
          }}
        >
          <option value="" disabled>
            Select a Sport
          </option>
          {uniqueSports.map((sport, index) => (
            <option key={index} value={sport}>
              {sport}
            </option>
          ))}
        </select>
      </div>

      {/* Render table only when a sport is selected */}
      {selectedSport && (
        <>
          {/* Table */}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              margin: '20px auto',
              maxWidth: '800px',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#444', color: 'white' }}>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Sport</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Event</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Year</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}># of Athletes</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Medals Awarded</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Medal Density (Efficiency)</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Avg. Athletes per Medal (Competition)</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
                  <tr key={index}>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: 'white' }}>
                      {item.sport_name}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: 'white' }}>
                      {item.full_event_name}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: 'white' }}>
                      {item.year}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: 'white' }}>
                      {item.total_participants}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: 'white' }}>
                      {item.total_medals}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: 'white' }}>
                      {item.medal_density}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', color: 'white' }}>
                      {item.athlete_medal_ratio}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ padding: '10px', textAlign: 'center', color: 'white' }}>
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{
                padding: '10px 15px',
                marginRight: '10px',
                cursor: 'pointer',
                backgroundColor: currentPage === 1 ? '#ccc' : '#007BFF',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
              }}
            >
              Previous
            </button>
            <span style={{ margin: '0 10px', color: 'white' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{
                padding: '10px 15px',
                marginLeft: '10px',
                cursor: 'pointer',
                backgroundColor: currentPage === totalPages ? '#ccc' : '#007BFF',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MedalDensityTable;
