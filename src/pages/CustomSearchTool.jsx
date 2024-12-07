import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// CustomSearchTool component
// This component allows users to search for Olympic data using custom filters
// The flow is you select a country, then a sport, and finally an event
// And it will display the results based on the selected filters
// With dynamic dropdowns that update based on the selected filters and queries from the backend
// Which make it so it only returns the relevant options for the selected filters
function CustomSearchTool() {
  const [filters, setFilters] = useState({
    country: '',
    sport: '',
    event: '',
  });

  const [results, setResults] = useState([]);
  const [dropdownOptions, setDropdownOptions] = useState({
    countries: [],
    sports: [],
    events: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingSports, setLoadingSports] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [previousCountry, setPreviousCountry] = useState("");
  
  useEffect(() => {
    const fetchInitialOptions = async () => {
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

    fetchInitialOptions();
  }, []);

  const handleFilterChange = async (filterName, value) => {
    setFilters((prevFilters) => {
        const updatedFilters = { ...prevFilters, [filterName]: value };

        if (filterName === "country") {
            if (previousCountry !== value) {
                setPreviousCountry(value); // Update previous country

                // Reset dependent dropdowns
                updatedFilters.sport = "";
                updatedFilters.event = "";

                setDropdownOptions((prev) => ({
                    ...prev,
                    sports: [],
                    events: [],
                }));

                // Fetch new options for the country
                fetchDynamicOptions("country", value);
            }
        } else if (filterName === "sport") {
            // Reset event dropdown when sport changes
            updatedFilters.event = ""; 

            setDropdownOptions((prev) => ({
                ...prev,
                events: [],
            }));

            // Fetch events for the selected sport
            fetchDynamicOptions("sport", value);
        }

        return updatedFilters;
    });
};

const fetchDynamicOptions = async (field, value) => {
  try {
      const params = new URLSearchParams();

      if (field === "country") {
          // Fetch for the new country only
          params.append("country", value);
      } else if (field === "sport") {
          // Fetch events for the selected sport
          if (filters.country) {
              params.append("country", filters.country);
          }
          params.append("sport", value);
      }

      // Uncomment the line below to see the query parameters
      //console.log("Fetching dynamic options with params:", params.toString());

      const response = await fetch(`http://localhost:3001/api/options?${params}`);
      if (!response.ok) throw new Error("Failed to fetch dynamic options");
      const data = await response.json();

      // Update dropdown options based on field type
      setDropdownOptions((prev) => ({
          ...prev,
          sports: field === "country" ? data.sports : prev.sports,
          events: field === "sport" ? data.events : prev.events,
      }));
  } catch (err) {
      console.error("Failed to fetch dynamic options:", err);
      setError("Failed to load dropdown options");
  }
};

  const handleSearch = async () => {
    const queryParam = new URLSearchParams(filters).toString();
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/search?${queryParam}`, { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setResults(
          data.map((row, index) => ({
            id: index + 1,
            country: row[1],
            sport: row[2],
            athlete: row[0],
            event: row[3],
            medal: row[4],
          }))
        );
      } else {
        setResults([]);
      }
    } catch (err) {
      console.error('Error fetching results:', err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = async () => {
    setFilters({ country: '', sport: '', event: '' });
    setDropdownOptions((prevOptions) => ({
      ...prevOptions, // Keep the original options for countries
      sports: [], // Reset sports dropdown
      events: [], // Reset events dropdown
    }));
    setResults([]);

    try {
        // Fetch all options again
        const response = await fetch(`http://localhost:3001/api/options`);
        if (!response.ok) throw new Error("Failed to fetch all options");
        const data = await response.json();

        setDropdownOptions({
            countries: data.countries,
            sports: data.sports,
            events: data.events,
        });
    } catch (err) {
        console.error("Failed to reload options on reset:", err);
        setError("Failed to reload dropdown options");
    }
};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#282c34', color: 'white' }}>
      <Header />
      <div style={{ flex: 1, textAlign: 'center', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Custom Search Tool</h1>
        <p>Use the filters below to create a custom search:</p>

        <div style={{ margin: '20px 0', display: 'flex', justifyContent: 'center', gap: '20px', flexWrap: 'wrap' }}>
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

          <select
            value={filters.sport}
            onChange={(e) => handleFilterChange('sport', e.target.value)}
            disabled={loadingSports || !filters.country}
            style={{ padding: '10px', borderRadius: '5px', backgroundColor: loadingSports ? '#555' : '#444', color: 'white', border: '1px solid white' }}
          >
            <option value="">Select Sport</option>
            {dropdownOptions.sports.map((sport) => (
              <option key={sport} value={sport}>
                {sport}
              </option>
            ))}
          </select>

          <select
            value={filters.event}
            onChange={(e) => handleFilterChange('event', e.target.value)}
            disabled={loadingEvents || !filters.sport}
            style={{
              padding: '10px',
              borderRadius: '5px',
              backgroundColor: loadingEvents ? '#555' : '#444',
              color: 'white',
              border: '1px solid white',
            }}
          >
            <option value="">Select Event</option>
            {dropdownOptions.events.map((event) => (
              <option key={event} value={event}>
                {event}
              </option>
            ))}
          </select>
        </div>

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

        <div style={{ marginTop: '30px' }}>
          <h2>Search Results</h2>
          {loading ? (
            <p>Loading...</p>
          ) : results.length > 0 ? (
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
