import { useRouter } from 'next/router';
import AdminLoginForm from '../components/admin_login';
import AdminNavBar from '../components/admin_navbar';
import Footer from '../components/Footer';
import ToastMessage from '../components/ToastMessage';
const HomePage = () => {
  const router = useRouter();

  const handleLogin = async (username, password) => {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.token);
      router.push('/admin/tickets');
    } else {
      const toast = document.getElementById('toast-1');
      const bsToast = new bootstrap.Toast(toast);
      bsToast.show();
    }
  };

  return (
    <>
      <AdminNavBar />
      <AdminLoginForm onLogin={handleLogin} />
      <ToastMessage header="Invalid password" body="Password is invalid, please try again." />
      <Footer />
    </>
  );
};

export default HomePage;
