import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export function withAdminPageAuth(Component) {
  return function AuthenticatedPage(props) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      async function checkAuth() {
        const res = await fetch('/api/admin/validate-session');
        if (!res.ok) {
          router.replace('/admin/login');
        } else {
          setLoading(false);
        }
      }
      checkAuth();
    }, [router]);

    if (loading) return null;
    return <Component {...props} />;
  };
}
