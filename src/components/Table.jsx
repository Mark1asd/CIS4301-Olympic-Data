import React, { useState } from 'react';

// Mock data for the table
const mockData = [
  { rank: 1, country: 'USA', gold: 39, silver: 41, bronze: 33, total: 113 },
  { rank: 2, country: 'China', gold: 38, silver: 32, bronze: 18, total: 88 },
  { rank: 3, country: 'Japan', gold: 27, silver: 14, bronze: 17, total: 58 },
  { rank: 4, country: 'UK', gold: 22, silver: 21, bronze: 22, total: 65 },
  { rank: 5, country: 'ROC', gold: 20, silver: 28, bronze: 23, total: 71 },
  { rank: 6, country: 'Australia', gold: 17, silver: 7, bronze: 22, total: 46 },
  { rank: 7, country: 'India', gold: 7, silver: 10, bronze: 14, total: 31 },
  { rank: 8, country: 'Germany', gold: 10, silver: 11, bronze: 16, total: 37 },
  { rank: 9, country: 'France', gold: 10, silver: 12, bronze: 11, total: 33 },
  { rank: 10, country: 'Italy', gold: 10, silver: 10, bronze: 20, total: 40 },
  { rank: 11, country: 'Brazil', gold: 7, silver: 6, bronze: 8, total: 21 },
  { rank: 12, country: 'Canada', gold: 6, silver: 8, bronze: 10, total: 24 },
];

function Table() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data based on the search term
  const filteredData = mockData.filter((item) =>
    item.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginated data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  // Total pages
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <div style={{ textAlign: 'center', margin: '20px 0', fontFamily: 'Arial, sans-serif' }}>
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
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Rank</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Country</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Gold</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Silver</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Bronze</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item) => (
            <tr key={item.rank}>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{item.rank}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{item.country}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{item.gold}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{item.silver}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{item.bronze}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{item.total}</td>
            </tr>
          ))}
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
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
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
            color: '#fff',
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
