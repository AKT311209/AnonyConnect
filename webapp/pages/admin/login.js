import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import AdminLoginForm from '../../components/AdminLogin';
import AdNav from '../../components/AdminNavbar';
import Footer from '../../components/footer';
import ToastMessage from '../../components/ToastMessage';
import Head from 'next/head';
import MainLayout from '../../components/MainLayout';

const AdminLoginPage = () => {
  const router = useRouter();
  const [show2FA, setShow2FA] = useState(false);
  const [twoFAToken, setTwoFAToken] = useState(null);
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [twoFAError, setTwoFAError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch('/api/admin/validate-session');
      if (res.ok) {
        router.push('/admin/tickets');
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (username, password, remember, turnstileToken) => {
    setRememberMe(remember);
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, rememberMe: remember, turnstileToken }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.require2FA) {
        setShow2FA(true);
        setTwoFAToken(data.token);
      } else {
        // Only call /api/admin/2fa if 2FA is not required
        const faRes = await fetch('/api/admin/2fa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: data.token, rememberMe }),
        });
        if (faRes.ok) {
          router.push('/admin/tickets');
        } else {
          // fallback error
          const toast = document.getElementById('toast-1');
          if (toast) {
            toast.querySelector('.toast-header strong').textContent = 'Login Error';
            toast.querySelector('.toast-body p').textContent = 'Login failed. Please try again.';
            const bsToast = new window.bootstrap.Toast(toast);
            bsToast.show();
          }
          setTimeout(() => window.location.reload(), 1000);
        }
      }
    } else {
      const toast = document.getElementById('toast-1');
      if (toast) {
        let header = 'Login Error';
        let body = 'Login failed. Please check your credentials and complete the Cloudflare verification.';
        if (res.status === 403) {
          header = 'Cloudflare Verification Failed';
          body = 'Cloudflare Turnstile verification failed. Please try again.';
        } else if (res.status === 401) {
          header = 'Wrong password';
          body = 'The password is incorrect. Please try again.';
        }
        toast.querySelector('.toast-header strong').textContent = header;
        toast.querySelector('.toast-body p').textContent = body;
        const bsToast = new window.bootstrap.Toast(toast);
        bsToast.show();
      }
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  const handle2FASubmit = async (code) => {
    setTwoFALoading(true);
    setTwoFAError('');
    const res = await fetch('/api/admin/2fa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: twoFAToken, code, rememberMe }),
    });
    if (res.ok) {
      setShow2FA(false);
      router.push('/admin/tickets');
    } else {
      setTwoFAError('Invalid 2FA code. Please try again.');
      setTimeout(() => window.location.reload(), 500);
    }
    setTwoFALoading(false);
  };

  return (
    <MainLayout>
      <Head>
        <title>AnonyConnect – Admin Login</title>
      </Head>
      <AdNav />
      <AdminLoginForm
        onLogin={handleLogin}
        on2FASubmit={handle2FASubmit}
        show2FA={show2FA}
        twoFAToken={twoFAToken}
        twoFALoading={twoFALoading}
        twoFAError={twoFAError}
      />
      <ToastMessage header="Invalid credentials" body="Password or username is invalid, please try again." />
      <Footer />
    </MainLayout>
  );
};

export default AdminLoginPage;
