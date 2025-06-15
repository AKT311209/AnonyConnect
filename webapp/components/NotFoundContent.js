import React from 'react';

export default function NotFoundContent({ message }) {
  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-danger">404</h1>
        <p className="fs-3"><span className="text-danger">Oops!</span> Page not found.</p>
        <p className="lead mb-4">The page you’re looking for doesn’t exist.</p>
        <div className="spinner-border text-danger mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        {message && <p className="mt-3 text-muted">{message}</p>}
      </div>
    </div>
  );
}
