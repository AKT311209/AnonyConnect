import { withAdminPageAuth } from '../../utils/withAdminPageAuth';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import SixDigitInput from '../../components/SixDigitInput'; // Adjust the import based on your file structure

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
    // On mount, check if 2FA is enabled and/or already set up
    async function check2FAStatus() {
      // Check if 2FA is enabled in config
      const configRes = await fetch('/api/admin/config');
      if (configRes.ok) {
        const configData = await configRes.json();
        if (!configData?.security?.admin?.['2fa']?.enabled) {
          router.replace('/admin');
          return;
        }
      }
      // Then check if 2FA is already set up
      const res = await fetch('/api/admin/2fa-setup', { method: 'GET' });
      if (res.ok) {
        const data = await res.json();
        if (data.setup) {
          router.replace('/admin');
        }
      }
    }
    check2FAStatus();
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
    <div className="container py-5 d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <h2 className="text-center">Set up Two-Factor Authentication</h2>
        {step === 1 && (
          <div className="d-flex justify-content-center mt-4">
            <button className="btn btn-primary" onClick={startSetup}>Start 2FA Setup</button>
          </div>
        )}
        {step === 2 && (
          <div className="mt-4 text-center">
            <p>Scan this QR code with your authenticator app:</p>
            {qr && <img src={qr} alt="2FA QR Code" style={{ width: 200, height: 200 }} />}
            <p className="mt-2">Or enter this secret manually:</p>
            <input className="form-control mb-2 text-center" value={secret} readOnly style={{ maxWidth: 240, margin: '0 auto' }} />
            <p>After adding, enter a 6-digit code from your app to verify:</p>
            <SixDigitInput
              value={code}
              onChange={setCode}
              onComplete={verifySetup}
            />
            <button className="btn btn-success mt-2" onClick={verifySetup} disabled={code.length !== 6}>Verify & Enable 2FA</button>
            {error && <div className="alert alert-danger mt-2">{error}</div>}
          </div>
        )}
        {step === 3 && success && (
          <div className="alert alert-success mt-4 text-center">2FA is now enabled and set up!</div>
        )}
        {error && step === 1 && <div className="alert alert-danger mt-2 text-center">{error}</div>}
      </div>
    </div>
  );
}

export default withAdminPageAuth(Admin2FASetupPage);
