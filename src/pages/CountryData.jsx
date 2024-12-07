import React, { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Chart } from "react-google-charts";

function CountryData() {
  const { countryCode } = useParams(); // Access the country code from the URL
  const [allTimeData, setAllTimeData] = useState(null); // All-time data
  const [countryInfo, setCountryInfo] = useState(null);
  const [startYear, setStartYear] = useState(1900);
  const [endYear, setEndYear] = useState(2022);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [globalMaxMedal, setGlobalMaxMedal] = useState(0); // Global max medal state
  const [minYear, setMinYear] = useState(1900); // Minimum slider year
  const [maxYear, setMaxYear] = useState(2022); // Maximum slider year

  // Fetch data for the country when component mounts
  useEffect(() => {
    const fetchCountryData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:3001/api/country-data/${countryCode}`);
        if (!response.ok) {
          if (response.status === 404) throw new Error("No data found for the specified country.");
          throw new Error("Failed to fetch country data.");
        }
        const data = await response.json();

        setAllTimeData(data); // Save all-time data
        setCountryInfo(data); // Initialize filtered data

        // Dynamically determine slider bounds
        const years = data.map((entry) => entry.YEAR).filter((year) => year !== null && year >= 1900);
        const firstValidYear = Math.max(1900, Math.min(...years));
        const lastValidYear = Math.min(2022, Math.max(...years));

        setMinYear(firstValidYear);
        setMaxYear(lastValidYear);

        // Adjust the sliders if needed
        setStartYear((prev) => Math.max(firstValidYear, Math.min(prev, lastValidYear)));
        setEndYear((prev) => Math.min(lastValidYear, Math.max(prev, firstValidYear)));
      } catch (err) {
        console.error("Error:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCountryData();
  }, [countryCode]);

  // Filter data based on year range
  useEffect(() => {
    if (allTimeData) {
      const filteredData = allTimeData.filter(
        (entry) => entry.YEAR >= startYear && entry.YEAR <= endYear
      );
      setCountryInfo(filteredData);
    }
  }, [startYear, endYear, allTimeData]);

  // Calculate global max for medals (aggregate sum across all-time data)
  useEffect(() => {
    if (allTimeData && allTimeData.length > 0) {
      const aggregate = allTimeData.reduce(
        (acc, entry) => {
          acc.gold += entry.GOLD || 0;
          acc.silver += entry.SILVER || 0;
          acc.bronze += entry.BRONZE || 0;
          return acc;
        },
        { gold: 0, silver: 0, bronze: 0 }
      );

      const maxMedal = Math.ceil(Math.max(aggregate.gold, aggregate.silver, aggregate.bronze));
      setGlobalMaxMedal(maxMedal);
    }
  }, [allTimeData]);

  // Aggregate medal counts
  const medals = useMemo(() => {
    if (!countryInfo || countryInfo.length === 0) {
      return { gold: 0, silver: 0, bronze: 0, total: 0 };
    }
    return countryInfo.reduce(
      (acc, entry) => {
        acc.gold += entry.GOLD || 0;
        acc.silver += entry.SILVER || 0;
        acc.bronze += entry.BRONZE || 0;
        acc.total += entry.TOTAL || 0;
        return acc;
      },
      { gold: 0, silver: 0, bronze: 0, total: 0 }
    );
  }, [countryInfo]);

  // Prepare data for Google Charts
  const prepareChartData = useMemo(() => {
    if (!countryInfo || countryInfo.length === 0) {
      // Default dataset with 0 values for Gold, Silver, and Bronze
      return [
        ["Medal", "Count", { role: "style" }, { role: "annotation" }],
        ["Gold", 0, "gold", "Gold"],
        ["Silver", 0, "silver", "Silver"],
        ["Bronze", 0, "bronze", "Bronze"],
      ];
    }
    return [
      ["Medal", "Count", { role: "style" }, { role: "annotation" }],
      ["Gold", medals.gold || 0, "gold", "Gold"],
      ["Silver", medals.silver || 0, "silver", "Silver"],
      ["Bronze", medals.bronze || 0, "bronze", "Bronze"],
    ];
  }, [medals, countryInfo]);

  // Ensure startYear is not greater than endYear
  useEffect(() => {
    if (startYear > endYear) {
      setStartYear(endYear); // Adjust startYear if it exceeds endYear
    } else if (endYear < startYear) {
      setEndYear(startYear); // Adjust endYear if it goes below startYear
    }
  }, [startYear, endYear]);

  // Chart options
  const chartOptions = {
    title: `${countryCode}'s Medal Counts`,
    backgroundColor: "#565a5a",
    titleTextStyle: { color: "#FFFFFF" },
    width: "100%",
    height: 400,
    bar: { groupWidth: "95%" },
    legend: { position: "none" },
    chartArea: {
      backgroundColor: "#565a5a", // Dark grey chart background
    },
    hAxis: {
      textStyle: { color: "#FFFFFF" }, // White axis text
    },
    vAxis: {
      textStyle: { color: "#FFFFFF" }, // White axis text
    },
  };


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#282c34",
        color: "white",
      }}
    >
      <Header />
      <div style={{ flex: 1, textAlign: "center", padding: "20px" }}>
        <h2>Medals</h2>
        <p>Gold: {medals.gold}</p>
        <p>Silver: {medals.silver}</p>
        <p>Bronze: {medals.bronze}</p>

        <h3>Medal Distribution</h3>
        <div style={{ width: "60%", margin: "0 auto" }}>
          {globalMaxMedal > 0 && (
            <Chart
              chartType="BarChart"
              width="100%"
              height="400px"
              data={prepareChartData}
              options={chartOptions}
            />
          )}
        </div>

        <div style={{ marginTop: "20px" }}>
          <label htmlFor="yearRange" style={{ fontSize: "18px" }}>
            Select Year Range:
          </label>
          <div style={{ margin: "10px 0" }}>
            <input
              type="range"
              id="startYear"
              min={minYear}
              max={maxYear}
              value={startYear}
              onChange={(e) => setStartYear(Math.max(minYear, Math.min(Number(e.target.value), endYear)))}
              style={{ width: "50%" }}
            />
            <input
              type="range"
              id="endYear"
              min={minYear}
              max={maxYear}
              value={endYear}
              onChange={(e) => setEndYear(Math.min(maxYear, Math.max(Number(e.target.value), startYear)))}
              style={{ width: "50%", marginTop: "10px" }}
            />
          </div>
          <p>
            Showing data for years {startYear} to {endYear}
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CountryData;
