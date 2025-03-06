import { useRouter } from 'next/router';
import { useEffect } from 'react';
import AdminLoginForm from '../../components/AdminLogin';
import AdNav from '../../components/AdminNavbar';
import Footer from '../../components/Footer';
import ToastMessage from '../../components/ToastMessage';

const HomePage = () => {
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

  const handleLogin = async (username, password, rememberMe) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password, rememberMe }),
    });

    if (res.ok) {
      router.push('/admin/tickets');
    } else {
      const toast = document.getElementById('toast-1');
      const bsToast = new bootstrap.Toast(toast);
      bsToast.show();
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

export default HomePage;
