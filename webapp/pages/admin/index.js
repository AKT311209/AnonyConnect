import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const AdminIndex = () => {
  const router = useRouter();

  useEffect(() => {
    // Check if 2FA is enabled and not set up, redirect to /admin/2fa-setup
    async function check2FA() {
      const res = await fetch('/api/admin/2fa');
      if (res.ok) {
        const data = await res.json();
        if (data.enabled && !data.setup) {
          router.replace('/admin/2fa-setup');
          return;
        }
      }
      // Otherwise, redirect to /admin/tickets
      router.push('/admin/tickets');
    }
    check2FA();
  }, [router]);

  return (
    <>
      <Head>
        <title>AnonyConnect – Admin</title>
      </Head>
    </>
  );
};

export default AdminIndex;
