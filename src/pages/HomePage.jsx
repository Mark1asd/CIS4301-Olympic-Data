import React from 'react';
import { Button } from '@mui/material';
import { NavLink } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <div style={{ backgroundColor: '#282c34', color: 'white', minHeight: '100vh' }}>
      <Header />
      <div style={{ textAlign: 'center', margin: '20vh 0', fontFamily: 'Arial, sans-serif' }}>
        <h2>Olympicnh</h2>
        <NavLink to="/data-access" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary">
            Data Access
          </Button>
        </NavLink>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
