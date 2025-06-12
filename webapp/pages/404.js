import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only run redirect logic and render message after mount (client-side)
  const actualPath = mounted ? router.asPath : '';
  const { target, message } = useMemo(() => {
    if (actualPath.startsWith('/admin')) {
      return { target: '/admin', message: 'Redirecting to admin dashboard...' };
    } else {
      return { target: '/', message: 'Redirecting to homepage...' };
    }
  }, [actualPath]);

  useEffect(() => {
    if (!mounted) return;
    const timeout = setTimeout(() => {
      router.replace(target);
    }, 3000);
    return () => clearTimeout(timeout);
  }, [router, target, mounted]);

  if (!mounted) {
    // Render a static fallback to avoid hydration mismatch
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="text-center">
          <h1 className="display-1 fw-bold text-danger">404</h1>
          <p className="fs-3"><span className="text-danger">Oops!</span> Page not found.</p>
          <p className="lead mb-4">The page you’re looking for doesn’t exist.</p>
          <div className="spinner-border text-danger mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-danger">404</h1>
        <p className="fs-3"><span className="text-danger">Oops!</span> Page not found.</p>
        <p className="lead mb-4">The page you’re looking for doesn’t exist.</p>
        <div className="spinner-border text-danger mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">{message}</p>
      </div>
    </div>
  );
}
