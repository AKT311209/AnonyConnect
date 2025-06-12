import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const AdminIndex = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /admin/tickets
    router.push('/admin/tickets');
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
