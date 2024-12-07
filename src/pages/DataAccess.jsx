import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WorldMap from '../components/WorldMap'; // Adjust the path if needed
import Graph from '../components/Graph';
import Table from '../components/Table';
import MedalDensityTable from '../components/MedalDensityTable';

function DataAccess() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#282c34', color: 'white' }}>
      <Header />
      <div style={{ flex: 1, textAlign: 'center', margin: 0, padding: 0 }}>
        <WorldMap />
      </div>
      <div style={{ flex: 1, textAlign: 'center', padding: '20px' }}>
        <h2>Total Medals Earned Over Time</h2>
        <p style={{ marginTop: '6px', padding: '6px', color: 'lightgray', fontSize: '16px' }}>
          Summer and Winter Olympics
        </p>
        <Graph />
        <h2>History by Country</h2>
        <Table />
        <h2>Event Medal Data</h2>
        <MedalDensityTable />
      </div>
      <Footer />
    </div>
  );
}

export default DataAccess;

