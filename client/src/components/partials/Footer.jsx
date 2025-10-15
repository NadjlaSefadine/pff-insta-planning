import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p>&copy; {new Date().getFullYear()} Institut National Supérieur Des Sciences et Techniques d'Abéché</p>
        {/* <nav> */}
          <a href="/privacy" style={styles.link}>Privacy Policy</a> |
          <a href="/terms" style={styles.link}> Terms of Service</a>
        {/* </nav> */}
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#3949ab',
    padding: '1rem 0',
    textAlign: 'center',
    borderTop: '1px solid #e9ecef',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    color: 'white',
  },
  link: {
    margin: '0 0.5rem',
    color: 'white',
    textDecoration: 'none',
  },
};

export default Footer;