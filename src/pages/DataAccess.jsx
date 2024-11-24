import React from 'react';
import { NavLink } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WorldMap from '../assets/images/WorldMap.png';
import Graph from '../components/Graph';
import Table from '../components/Table';
import ScheduleTable from '../components/ScheduleTable';

function DataAccess() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <div style={{ flex: 1, textAlign: 'center', padding: '20px' }}>
        <h1>Data Access Page</h1>

        {/* Clickable WorldMap */}
        <NavLink to="/country-data">
          <img
            src={WorldMap}
            alt="World Map"
            style={{ width: '60%', height: 'auto', margin: '20px 0', cursor: 'pointer' }}
          />
        </NavLink>

        {/* Graph Section */}
        <h2>Total Medals Earned Over Time</h2>
        <Graph />

        {/* Table Section */}
        <h2>History by Country</h2>
        <Table />

        {/* Schedule Table Section */}
        <h2>Schedule of Events</h2>
        <ScheduleTable />
      </div>
      <Footer />
    </div>
  );
}

export default DataAccess;
