import React from 'react';

function Footer() {
  return (
    <footer style={{ textAlign: 'center', padding: '20px', backgroundColor: '#282c34', color: 'white', marginTop: '30px' }}>
      <p style={{ margin: 0 }}>
        <a
          href="https://www.linkedin.com/feed/?trk=guest_homepage-basic_google-one-tap-submit"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'white', textDecoration: 'none', margin: '0 10px' }}
        >
          LinkedIn
        </a>
        |
        <a
          href="https://www.instagram.com/yaroslav_waryk/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'white', textDecoration: 'none', margin: '0 10px' }}
        >
          Instagram
        </a>
        |
        <a
          href="mailto:olimpicdata.app@gmail.com"
          style={{ color: 'white', textDecoration: 'none', margin: '0 10px' }}
        >
          Email
        </a>
      </p>
      <p style={{ margin: '10px 0 0 0' }}>© 2024 Olympics. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
