import React, { useState } from 'react';

export default function Admin2FASetupDialog({ open, qr, secret, onClose, onDone }) {
  const [copied, setCopied] = useState(false);
  if (!open) return null;
  return (
    <div className="modal show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Set up Two-Factor Authentication</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body text-center">
            <p>Scan this QR code with your authenticator app (Google Authenticator, Authy, etc):</p>
            {qr && <img src={qr} alt="2FA QR Code" style={{ width: 200, height: 200 }} />}
            <p className="mt-2">Or enter this secret manually:</p>
            <div className="input-group mb-2">
              <input type="text" className="form-control" value={secret || ''} readOnly />
              <button className="btn btn-outline-secondary" type="button" onClick={() => {navigator.clipboard.writeText(secret); setCopied(true);}}>{copied ? 'Copied!' : 'Copy'}</button>
            </div>
            <p className="text-muted">After setup, click Done and use your app to generate codes for login.</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={onDone}>Done</button>
          </div>
        </div>
      </div>
    </div>
  );
}
