import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Chart } from "react-google-charts";

function CountryData() {
  const { countryCode } = useParams(); // Access the country code from the URL
  const [countryInfo, setCountryInfo] = useState(null);
  const [startYear, setStartYear] = useState(2000);
  const [endYear, setEndYear] = useState(2020);

  useEffect(() => {
    // Simulate fetching data for the country based on countryCode
    console.log(`Fetching data for country: ${countryCode} from ${startYear} to ${endYear}`);

    // Simulate country info based on year range (this can be replaced with a real API)
    setCountryInfo({
      name: countryCode,
      gold: 10 + (endYear - startYear) * 0.5,
      silver: 15 + (endYear - startYear) * 0.3,
      bronze: 20 + (endYear - startYear) * 0.2,
      startYear,
      endYear,
    });
  }, [countryCode, startYear, endYear]);

  // Chart data format
  const chartData = [
    ["Medal", "Count", { role: "style" }, { role: "annotation" }],
    ["Gold", countryInfo ? countryInfo.gold : 0, "gold", "Gold"],
    ["Silver", countryInfo ? countryInfo.silver : 0, "silver", "Silver"],
    ["Bronze", countryInfo ? countryInfo.bronze : 0, "bronze", "Bronze"],
  ];

  // Chart options with dark grey background
  const chartOptions = {
    title: `${countryInfo ? countryInfo.name : "Country"}'s Medal Count`,
    backgroundColor: "#565a5a", // Dark grey background for the chart
    titleTextStyle: {
      color: "#FFFFFF", // White title text
    },
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
        backgroundColor: "#282c34", // Dark grey background for the entire page
        color: "white",
      }}
    >
      <Header />
      <div style={{ flex: 1, textAlign: "center", padding: "20px" }}>
        <h1>{countryInfo ? `${countryInfo.name}'s Data` : "Loading..."}</h1>
        {countryInfo && (
          <div>
            <h2>Medals</h2>
            {/* <p>Gold: {countryInfo.gold}</p> */}
            <p>Gold: {countryInfo.gold}</p>
            <p>Silver: {countryInfo.silver}</p>
            <p>Bronze: {countryInfo.bronze}</p>

            <h3>Medal Distribution</h3>
            {/* Render Google Bar Chart with 60% width */}
            <div style={{ width: "60%", margin: "0 auto" }}>
              <Chart
                chartType="BarChart"
                width="100%"
                height="400px"
                data={chartData}
                options={chartOptions}
              />
            </div>

            {/* Year Range Slider */}
            <div style={{ marginTop: "20px" }}>
              <label htmlFor="yearRange" style={{ fontSize: "18px" }}>
                Select Year Range:
              </label>
              <div style={{ margin: "10px 0" }}>
                <input
                  type="range"
                  id="startYear"
                  min="1900"
                  max="2020"
                  value={startYear}
                  onChange={(e) => setStartYear(Number(e.target.value))}
                  style={{ width: "50%" }}
                />
                <input
                  type="range"
                  id="endYear"
                  min="1900"
                  max="2020"
                  value={endYear}
                  onChange={(e) => setEndYear(Number(e.target.value))}
                  style={{ width: "50%", marginTop: "10px" }}
                />
              </div>
              <p>
                Showing data for years {startYear} to {endYear}
              </p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default CountryData;
