import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function CustomSearchTool() {
  // State for filters
  const [filters, setFilters] = useState({
    country: '',
    sport: '',
    athlete: '',
    event: '',
  });

  // State for search results
  const [results, setResults] = useState([]);

  // Mock data for dropdown options
  const countries = ['USA', 'China', 'Japan', 'Germany', 'France'];
  const sports = ['Athletics', 'Swimming', 'Gymnastics', 'Cycling', 'Boxing'];
  const athletes = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Michael Lee'];
  const events = ['100m Sprint', '200m Freestyle', 'Vault', 'Road Race', 'Featherweight'];

  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  // Handle search (mock implementation)
  const handleSearch = () => {
    // Mock results based on filters
    const mockResults = [
      { id: 1, country: 'USA', sport: 'Athletics', athlete: 'John Doe', event: '100m Sprint', medal: 'Gold' },
      { id: 2, country: 'China', sport: 'Swimming', athlete: 'Jane Smith', event: '200m Freestyle', medal: 'Silver' },
    ];

    // Set filtered results (for now just set mockResults)
    setResults(mockResults);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ flex: 1, textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Custom Search Tool</h1>
        <p>Use the filters below to create a custom search:</p>

        {/* Filters */}
        <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {/* Country Filter */}
          <select
            value={filters.country}
            onChange={(e) => handleFilterChange('country', e.target.value)}
            style={{ padding: '10px', borderRadius: '5px' }}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          {/* Sport Filter */}
          <select
            value={filters.sport}
            onChange={(e) => handleFilterChange('sport', e.target.value)}
            style={{ padding: '10px', borderRadius: '5px' }}
          >
            <option value="">Select Sport</option>
            {sports.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>

          {/* Athlete Filter */}
          <select
            value={filters.athlete}
            onChange={(e) => handleFilterChange('athlete', e.target.value)}
            style={{ padding: '10px', borderRadius: '5px' }}
          >
            <option value="">Select Athlete</option>
            {athletes.map((athlete) => (
              <option key={athlete} value={athlete}>
                {athlete}
              </option>
            ))}
          </select>

          {/* Event Filter */}
          <select
            value={filters.event}
            onChange={(e) => handleFilterChange('event', e.target.value)}
            style={{ padding: '10px', borderRadius: '5px' }}
          >
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event} value={event}>
                {event}
              </option>
            ))}
          </select>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Search
        </button>

        {/* Results */}
        <div style={{ marginTop: '30px' }}>
          <h2>Search Results</h2>
          {results.length > 0 ? (
            <table style={{ margin: '20px auto', borderCollapse: 'collapse', width: '80%' }}>
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Country</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Sport</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Athlete</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Event</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Medal</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{result.country}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{result.sport}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{result.athlete}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{result.event}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{result.medal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No results to display. Use the filters above and click "Search".</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CustomSearchTool;
