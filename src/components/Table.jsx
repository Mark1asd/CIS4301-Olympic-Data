import React, { useState, useEffect } from 'react';

function Table() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]); // State for backend data
  const itemsPerPage = 10;

  // Fetch data from the backend
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('YOUR_BACKEND_API_ENDPOINT'); // Replace with API endpoint
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

  // Filter data based on the search term
  const filteredData = data.filter((item) =>
    item.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginated data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div style={{ textAlign: 'center', margin: '20px 0', fontFamily: 'Arial, sans-serif', color: 'white' }}>
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by country"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: '10px',
          width: '300px',
          marginBottom: '20px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          backgroundColor: '#444',
          color: 'white',
        }}
      />

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
            <th style={{ border: '1px solid white', padding: '8px' }}>Rank</th>
            <th style={{ border: '1px solid white', padding: '8px' }}>Country</th>
            <th style={{ border: '1px solid white', padding: '8px' }}>Gold</th>
            <th style={{ border: '1px solid white', padding: '8px' }}>Silver</th>
            <th style={{ border: '1px solid white', padding: '8px' }}>Bronze</th>
            <th style={{ border: '1px solid white', padding: '8px' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.length > 0 ? (
            paginatedData.map((item) => (
              <tr key={item.rank}>
                <td style={{ border: '1px solid white', padding: '8px', textAlign: 'center', color: 'white' }}>{item.rank}</td>
                <td style={{ border: '1px solid white', padding: '8px', textAlign: 'center', color: 'white' }}>{item.country}</td>
                <td style={{ border: '1px solid white', padding: '8px', textAlign: 'center', color: 'white' }}>{item.gold}</td>
                <td style={{ border: '1px solid white', padding: '8px', textAlign: 'center', color: 'white' }}>{item.silver}</td>
                <td style={{ border: '1px solid white', padding: '8px', textAlign: 'center', color: 'white' }}>{item.bronze}</td>
                <td style={{ border: '1px solid white', padding: '8px', textAlign: 'center', color: 'white' }}>{item.total}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ padding: '10px', textAlign: 'center', color: 'white' }}>
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
    </div>
  );
}

export default Table;
