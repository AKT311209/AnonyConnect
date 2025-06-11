import { useRouter } from 'next/router';
import { useEffect } from 'react';
import AdminLoginForm from '../../components/AdminLogin';
import AdNav from '../../components/AdminNavbar';
import Footer from '../../components/footer';
import ToastMessage from '../../components/ToastMessage';

const AdminLoginPage = () => {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const res = await fetch('/api/admin/validate-session');
      if (res.ok) {
        router.push('/admin/tickets');
      }
    };
    checkSession();
  }, [router]);

  const handleLogin = async (username, password, rememberMe, turnstileToken) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, rememberMe, turnstileToken }),
    });

    if (res.ok) {
      router.push('/admin/tickets');
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
      // Reload the form to reset the Cloudflare token
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <>
      <AdNav />
      <AdminLoginForm onLogin={handleLogin} />
      <ToastMessage header="Invalid password" body="Password is invalid, please try again." />
      <Footer />
    </>
  );
};

export default AdminLoginPage;
