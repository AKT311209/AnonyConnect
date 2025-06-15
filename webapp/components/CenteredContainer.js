import React from 'react';

export default function CenteredContainer({ children }) {
  return (
    <div className="container py-5 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {children}
      </div>
    </div>
  );
}
