import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import NotFoundContent from '../components/NotFoundContent';

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
    return <NotFoundContent />;
  }

  return <NotFoundContent message={message} />;
}
