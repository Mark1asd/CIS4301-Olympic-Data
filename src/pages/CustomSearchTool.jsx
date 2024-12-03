import React, { useState, useEffect } from 'react';
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

  // State for loading and error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isEventDisabled, setIsEventDisabled] = useState(true);

  const [dropdownOptions, setDropdownOptions] = useState({
    countries: [],
    sports: [],
    events: [],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/options');
        if (!response.ok) throw new Error('Failed to fetch options');
        const data = await response.json();
        setDropdownOptions((prev) => ({
          ...prev,
          countries: data.countries,
          sports: data.sports,
        }));
      } catch (err) {
        console.error(err);
        setError('Failed to load initial dropdown options');
      }
    };
    fetchOptions();
  }, []);

  const fetchEventOptions = async (sport) => {
    try {
      const queryString = new URLSearchParams({ sport_selection: sport }).toString();
      const response = await fetch(`http://localhost:3001/api/options?${queryString}`);
      if (!response.ok) throw new Error('Failed to fetch event options');
      const data = await response.json();
      setDropdownOptions((prev) => ({ ...prev, events: data.events }));
    } catch (err) {
      console.error(err);
      setError('Failed to load event dropdown options');
    }
  };

  const handleFilterChange = async (filterName, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [filterName]: value };
      if (filterName === 'sport') {
        const { sport } = updatedFilters;
        if (sport) {
          setIsEventDisabled(false);
          fetchEventOptions(sport);
        } else {
          setIsEventDisabled(true);
          setDropdownOptions((prev) => ({ ...prev, events: [] }));
        }
      }
      return updatedFilters;
    });
  };

  const handleSearch = async () => {
    const queryParam = new URLSearchParams(filters).toString();
    try {
      const res = await fetch(`http://localhost:3001/api/search?${queryParam}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        const formattedResults = data.map((row, index) => ({
          id: index + 1,
          country: row[1],
          sport: row[2],
          athlete: row[0],
          event: row[3],
          medal: row[4],
        }));
        setResults(formattedResults);
      } else {
        console.error('Error fetching results', res.statusText);
        setResults([]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setResults([]);
    }
  };

  const resetFilters = () => {
    setFilters({ country: '', sport: '', event: '' });
    setIsEventDisabled(true);
    setResults([]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#282c34', color: 'white' }}>
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
            style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#444', color: 'white', border: '1px solid white' }}
          >
            <option value="">Select Country</option>
            {dropdownOptions.countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>

          {/* Sport Filter */}
          <select
            value={filters.sport}
            onChange={(e) => handleFilterChange('sport', e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#444', color: 'white', border: '1px solid white' }}
          >
            <option value="">Select Sport</option>
            {dropdownOptions.sports.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>

          {/* Event Filter */}
          <select
            value={filters.event}
            onChange={(e) => handleFilterChange('event', e.target.value)}
            disabled={isEventDisabled}
            style={{ padding: '10px', borderRadius: '5px', backgroundColor: '#444', color: 'white', border: '1px solid white' }}
          >
            <option value="">Select Event</option>
            {dropdownOptions.events.map((event) => (
              <option key={event} value={event}>
                {event}
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button
            onClick={handleSearch}
            style={{
              padding: '10px 20px',
              backgroundColor: '#444',
              color: 'white',
              border: '1px solid white',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Search
          </button>
          <button
            onClick={resetFilters}
            style={{
              padding: '10px 20px',
              backgroundColor: '#444',
              color: 'white',
              border: '1px solid white',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>

        {/* Results */}
        <div style={{ marginTop: '30px' }}>
          <h2>Search Results</h2>
          {results.length > 0 ? (
            <table style={{ margin: '20px auto', borderCollapse: 'collapse', width: '80%', color: 'white' }}>
              <thead>
                <tr>
                  <th style={{ border: '1px solid white', padding: '8px' }}>Country</th>
                  <th style={{ border: '1px solid white', padding: '8px' }}>Sport</th>
                  <th style={{ border: '1px solid white', padding: '8px' }}>Athlete</th>
                  <th style={{ border: '1px solid white', padding: '8px' }}>Event</th>
                  <th style={{ border: '1px solid white', padding: '8px' }}>Medal</th>
                </tr>
              </thead>
              <tbody>
                {results.map((result) => (
                  <tr key={result.id}>
                    <td style={{ border: '1px solid white', padding: '8px', textAlign: 'center' }}>{result.country}</td>
                    <td style={{ border: '1px solid white', padding: '8px', textAlign: 'center' }}>{result.sport}</td>
                    <td style={{ border: '1px solid white', padding: '8px', textAlign: 'center' }}>{result.athlete}</td>
                    <td style={{ border: '1px solid white', padding: '8px', textAlign: 'center' }}>{result.event}</td>
                    <td style={{ border: '1px solid white', padding: '8px', textAlign: 'center' }}>{result.medal}</td>
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
