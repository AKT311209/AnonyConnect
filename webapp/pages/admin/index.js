import { useEffect } from 'react';
import { useRouter } from 'next/router';

const AdminIndex = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /admin/tickets
    router.push('/admin/tickets');
  }, [router]);

  return null;
};

export default AdminIndex;
