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
        <h1>About Us</h1>
        <p style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.6', textAlign: 'justify' }}>
          Welcome to our Olympic Data app, your one-stop destination for comprehensive insights into the Olympic Games.
          Our platform is dedicated to providing a rich and interactive experience with detailed data on countries, 
          athletes, events, results, and medal tallies from Olympic history.
        </p>
        <p style={{ maxWidth: '800px', margin: '20px auto', lineHeight: '1.6', textAlign: 'justify' }}>
          Our mission is to make Olympic data accessible and engaging for researchers, sports enthusiasts, and the 
          general public. Whether you’re looking to explore athletes’ achievements, track medal counts, or analyze the 
          evolution of events over the years, our site is designed to cater to your needs.
        </p>
        <p style={{ maxWidth: '800px', margin: '20px auto', lineHeight: '1.6', textAlign: 'justify' }}>
          Built by Yaroslav Voryk, Mark Bychin, Riley Willis, and Joshua Bowman at the University of Florida as part of a 
          CIS4301 project, our platform combines a robust database with a user-friendly interface to present the most accurate 
          and up-to-date Olympic statistics. We aim to showcase the intersection of technology and sports through our intuitive 
          and interactive tools.
        </p>
        <p style={{ maxWidth: '800px', margin: '20px auto', lineHeight: '1.6', textAlign: 'justify' }}>
          Feel free to explore, analyze, and gain new insights as we celebrate the spirit of the Olympics!
        </p>
        <NavLink to="/data-access" style={{ textDecoration: 'none' }}>
          <Button variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Data Access
          </Button>
        </NavLink>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;

