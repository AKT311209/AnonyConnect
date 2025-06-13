import React, { useState } from 'react';

export default function Admin2FADialog({ open, onSubmit, onClose, error, loading }) {
  const [code, setCode] = useState('');

  if (!open) return null;

  return (
    <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Two-Factor Authentication</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <p>Enter the 6-digit code from your authenticator app.</p>
            <input
              type="text"
              className="form-control mb-2"
              maxLength={6}
              value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
              autoFocus
              disabled={loading}
              onKeyDown={e => {
                if (e.key === 'Enter' && code.length === 6 && !loading) {
                  onSubmit(code);
                }
              }}
            />
            {error && <div className="alert alert-danger py-1">{error}</div>}
          </div>
          <div className="modal-footer">
            <button className="btn btn-danger" onClick={onClose} disabled={loading}>Cancel</button>
            <button className="btn btn-primary" onClick={() => onSubmit(code)} disabled={loading || code.length !== 6}>
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
