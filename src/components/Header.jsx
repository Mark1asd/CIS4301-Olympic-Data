import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Drawer, IconButton, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function Header() {
  const location = useLocation(); // Get the current route
  const [drawerOpen, setDrawerOpen] = useState(false); // Manage drawer state

  // Define available pages
  const pages = [
    { path: '/', name: 'Home' },
    { path: '/data-access', name: 'Data Access' },
    { path: '/country-data', name: "Country's Data" },
    { path: '/custom-search-tool', name: 'Custom Search Tool' },
  ];

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#f8f9fa' }}>
      <h1 style={{ margin: 0, fontSize: '24px' }}>Olympics</h1>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Show "Home" button outside of burger menu when not on Home page */}
        {location.pathname !== '/' && (
          <NavLink
            to="/"
            style={{
              textDecoration: 'none',
              color: '#fff',
              backgroundColor: 'grey',
              padding: '5px 10px',
              borderRadius: '5px',
              fontWeight: 'bold',
              marginRight: '20px',
            }}
          >
            Home
          </NavLink>
        )}

        {/* Show "Custom Search" button only on DataAccess page */}
        {location.pathname === '/data-access' && (
          <NavLink
            to="/custom-search-tool"
            style={{
              textDecoration: 'none',
              color: '#fff',
              backgroundColor: 'grey',
              padding: '5px 10px',
              borderRadius: '5px',
              fontWeight: 'bold',
              marginRight: '20px',
            }}
          >
            Custom Search
          </NavLink>
        )}

        {/* Burger Menu */}
        <IconButton
          onClick={() => setDrawerOpen(true)}
          style={{ display: 'flex', alignItems: 'center' }}
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>

        {/* Drawer for Menu */}
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <List style={{ width: '250px' }}>
            {pages.map((page) => (
              <ListItem
                key={page.path}
                button
                onClick={() => setDrawerOpen(false)}
              >
                <NavLink
                  to={page.path}
                  style={({ isActive }) => ({
                    textDecoration: 'none',
                    color: isActive ? '#007BFF' : '#000',
                    fontWeight: isActive ? 'bold' : 'normal',
                  })}
                >
                  <ListItemText primary={page.name} />
                </NavLink>
              </ListItem>
            ))}
          </List>
        </Drawer>
      </div>
    </header>
  );
}

export default Header;
