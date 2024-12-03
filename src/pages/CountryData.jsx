import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

function CountryData() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#282c34', color: 'white' }}>
      <Header />
      <div style={{ flex: 1, textAlign: 'center', padding: '20px' }}>
        <h1>Country's Data</h1>
        <p>Welcome to the country's data page. Here you can explore specific information about countries.</p>
      </div>
      <Footer />
    </div>
  );
}

export default CountryData;
