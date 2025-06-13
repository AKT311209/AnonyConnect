import { withAdminPageAuth } from '../../utils/withAdminPageAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function Admin2FASetupPage() {
  const [qr, setQr] = useState(null);
  const [secret, setSecret] = useState(null);
  const [code, setCode] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // On mount, check if 2FA is already set up
    async function checkIfSetup() {
      const res = await fetch('/api/admin/2fa-setup', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        if (data.setup) {
          router.replace('/admin');
        }
      }
    }
    checkIfSetup();
  }, [router]);

  const startSetup = async () => {
    setError('');
    setSuccess(false);
    setLoading(true);
    const res = await fetch('/api/admin/2fa-setup', { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      setQr(data.qr);
      setSecret(data.secret);
      setStep(2);
    } else {
      setError(data.error || 'Failed to start setup');
    }
    setLoading(false);
  };

  const verifySetup = async () => {
    setError('');
    setSuccess(false);
    setLoading(true);
    const res = await fetch('/api/admin/2fa-setup', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, code }),
    });
    if (res.ok) {
      setSuccess(true);
      setStep(3);
      // After success, redirect to /admin after a short delay
      setTimeout(() => router.replace('/admin'), 1500);
    } else {
      const data = await res.json();
      setError(data.error || 'Verification failed');
    }
    setLoading(false);
  };

  if (loading) return null;
  return (
    <div className="container py-5">
      <h2>Set up Two-Factor Authentication</h2>
      {step === 1 && (
        <button className="btn btn-primary" onClick={startSetup}>Start 2FA Setup</button>
      )}
      {step === 2 && (
        <div className="mt-4">
          <p>Scan this QR code with your authenticator app:</p>
          {qr && <img src={qr} alt="2FA QR Code" style={{ width: 200, height: 200 }} />}
          <p className="mt-2">Or enter this secret manually:</p>
          <input className="form-control mb-2" value={secret} readOnly />
          <p>After adding, enter a 6-digit code from your app to verify:</p>
          <input className="form-control mb-2" value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} maxLength={6} placeholder="Enter 2FA code" />
          <button className="btn btn-success" onClick={verifySetup} disabled={code.length !== 6}>Verify & Enable 2FA</button>
          {error && <div className="alert alert-danger mt-2">{error}</div>}
        </div>
      )}
      {step === 3 && success && (
        <div className="alert alert-success mt-4">2FA is now enabled and set up!</div>
      )}
      {error && step === 1 && <div className="alert alert-danger mt-2">{error}</div>}
    </div>
  );
}

export default withAdminPageAuth(Admin2FASetupPage);
