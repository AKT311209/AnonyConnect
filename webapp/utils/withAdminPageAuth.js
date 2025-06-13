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
          // Check if 2FA is enabled and set up
          const faRes = await fetch('/api/admin/2fa');
          const faData = await faRes.json();
          const is2faSetupPage = router.pathname === '/admin/2fa-setup';
          if (faData.enabled && !faData.setup && !is2faSetupPage) {
            router.replace('/admin/2fa-setup');
            return;
          }
          setLoading(false);
        }
      }
      checkAuth();
    }, [router]);

    if (loading) return null;
    return <Component {...props} />;
  };
}
