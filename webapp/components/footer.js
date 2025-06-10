import React from 'react';

const Footer = () => {
  return (
    <footer style={{ textAlign: 'center', background: 'var(--bs-light)' }}>
      <div style={{ container: 'text-center', padding: '4rem 0', marginTop: '0' }}>
        <p style={{ marginBottom: '0' }}>
          Copyright © 2025 
          <a href="https://github.com/AKT311209/anonyconnect" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline', marginLeft: 4 }}>
            AnonyConnect
          </a>
        </p>
        <p style={{ marginBottom: '0' }}>Designed & Developed by <a href="https://github.com/AKT311209" target="_blank" rel="noopener noreferrer">AKT311209</a></p>
      </div>
    </footer>
  );
};

export default Footer;
