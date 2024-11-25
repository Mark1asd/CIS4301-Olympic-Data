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

  // State for dropdown options - am think sport too but not sure
  //const [isSportDisabled, setIsSportDisabled] = useState(true);
  const [isEventDisabled, setIsEventDisabled] = useState(true);

  // Fetch filtered options
  const [dropdownOptions, setDropdownOptions] = useState({
    countries: [],
    sports: [],
    events: [],
  });

  // // Mock data for dropdown options
  // const countries = ['USA', 'China', 'Japan', 'Germany', 'France'];
  // const sports = ['Athletics', 'Swimming', 'Gymnastics', 'Cycling', 'Boxing'];
  // // const athletes = ['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown', 'Michael Lee'];
  // const events = ['100m Sprint', '200m Freestyle', 'Vault', 'Road Race', 'Featherweight'];

  // Fetch initial dropdown options
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/options");
        if (!response.ok) throw new Error("Failed to fetch options");
        const data = await response.json();
        setDropdownOptions((prev) => ({ ...prev, countries: data.countries, sports: data.sports }));
      } catch (err) {
        console.error(err);
        setError("Failed to load initial dropdown options");
      }
    };
    fetchOptions();
  }, []);

  // Fetch filtered event options
  const fetchEventOptions = async (sport) => {
    try {
      const queryString = new URLSearchParams({ sport_selection: sport }).toString();
      const response = await fetch(`http://localhost:3001/api/options?${queryString}`);
      if (!response.ok) throw new Error("Failed to fetch event options");
      const data = await response.json();
      setDropdownOptions((prev) => ({ ...prev, events: data.events }));
    } catch (err) {
      console.error(err);
      setError("Failed to load event dropdown options");
    }
  };

  // Handle dropdown changes
  const handleFilterChange = async (filterName, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [filterName]: value };

      // Check if both country and sport are selected to enable Event dropdown
      if (filterName === "sport") {
        const { sport } = updatedFilters;
        if (sport) {
          setIsEventDisabled(false);
          fetchEventOptions(sport); // Fetch events when both are selected
        } else {
          setIsEventDisabled(true);
          setDropdownOptions((prev) => ({ ...prev, events: [] })); // Clear events if conditions not met
        }
      }
      return updatedFilters;
    });
  };

  // Handle search (mock implementation)
  const handleSearch = async () => {
    // Mock results based on filters
    const mockResults = [
      { id: 1, country: 'USA', sport: 'Athletics', athlete: 'John Doe', event: '100m Sprint', medal: 'Gold' },
      { id: 2, country: 'China', sport: 'Swimming', athlete: 'Jane Smith', event: '200m Freestyle', medal: 'Silver' },
    ];

    // // Set filtered results (for now just set mockResults)
    // setResults(mockResults);
    try{
      const queryParam = new URLSearchParams(filters).toString();

      const res = await fetch(`http://localhost:3001/api/search?${queryParam}`, { method: 'POST' });

      if(res.ok){
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
        console.log('Results set to:', formattedResults); // for testing, delete later
      } else{
        console.error('Error fetching results', res.statusText);
        setResults(mockResults);
        console.log('Fallback to mockResults:', mockResults); // testing, delete later
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setResults([]);
    }
  };


  // Reset filters and dropdowns
  const resetFilters = () => {
    setFilters({ country: "", sport: "", event: "" });
    setIsEventDisabled(true);
    setResults([]);
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
            style={{ padding: '10px', borderRadius: '5px' }}
          >
            <option value="">Select Sport</option>
            {dropdownOptions.sports.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>

          {/* Athlete Filter */}
          {/* <select
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
          </select> */}

          {/* Event Filter */}
          <select
            value={filters.event}
            onChange={(e) => handleFilterChange('event', e.target.value)}
            disabled={isEventDisabled}
            style={{ padding: '10px', borderRadius: '5px' }}
          >
            <option value="">Select Event</option>
            {dropdownOptions.events.map((event) => (
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
        {/* Reset Button */}
                <button
          onClick={resetFilters}
          style={{
            padding: '10px 20px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Reset
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
