import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DataAccess from './pages/DataAccess';
import CountryData from './pages/CountryData';
import CustomSearchTool from './pages/CustomSearchTool';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/data-access" element={<DataAccess />} />
      <Route path="/country-data" element={<CountryData />} />
      <Route path="/custom-search-tool" element={<CustomSearchTool />} />
    </Routes>
  );
}

export default App;
