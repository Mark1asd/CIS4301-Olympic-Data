import React, { useState } from 'react';

// Mock data for the table
const mockData = [
  { discipline: 'Athletics', '-2': 'X', '-1': '', '0': 'X', '1': '', '2': 'X', '3': '', '4': '', '5': '', '6': '' },
  { discipline: 'Swimming', '-2': '', '-1': 'X', '0': 'X', '1': 'X', '2': '', '3': '', '4': 'X', '5': '', '6': '' },
  { discipline: 'Gymnastics', '-2': '', '-1': '', '0': '', '1': 'X', '2': 'X', '3': 'X', '4': '', '5': '', '6': '' },
  { discipline: 'Cycling', '-2': '', '-1': '', '0': 'X', '1': 'X', '2': '', '3': '', '4': 'X', '5': 'X', '6': '' },
  { discipline: 'Rowing', '-2': '', '-1': 'X', '0': 'X', '1': '', '2': 'X', '3': '', '4': '', '5': '', '6': '' },
  { discipline: 'Basketball', '-2': '', '-1': '', '0': 'X', '1': '', '2': '', '3': '', '4': '', '5': '', '6': 'X' },
  { discipline: 'Volleyball', '-2': '', '-1': '', '0': '', '1': 'X', '2': '', '3': '', '4': 'X', '5': '', '6': '' },
  { discipline: 'Boxing', '-2': '', '-1': '', '0': '', '1': 'X', '2': 'X', '3': '', '4': '', '5': '', '6': 'X' },
  { discipline: 'Wrestling', '-2': 'X', '-1': '', '0': '', '1': '', '2': '', '3': 'X', '4': 'X', '5': '', '6': '' },
  { discipline: 'Archery', '-2': '', '-1': '', '0': 'X', '1': 'X', '2': 'X', '3': '', '4': '', '5': 'X', '6': '' },
];

function ScheduleTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data based on the search term
  const filteredData = mockData.filter((item) =>
    item.discipline.toLowerCase().includes(searchTerm.toLowerCase())
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
        placeholder="Search by discipline"
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
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Discipline</th>
            {Array.from({ length: 19 }, (_, i) => -2 + i).map((day) => (
              <th key={day} style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                {item.discipline}
              </td>
              {Array.from({ length: 19 }, (_, i) => -2 + i).map((day) => (
                <td
                  key={day}
                  style={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    textAlign: 'center',
                  }}
                >
                  {item[day] || ''}
                </td>
              ))}
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

export default ScheduleTable;
