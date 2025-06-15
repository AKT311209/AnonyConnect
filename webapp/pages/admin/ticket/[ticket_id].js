import AdTicketDetail from '../../../components/AdminTicketDetail';
import AdNav from '../../../components/AdminNavbar';
import Footer from '../../../components/footer';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { withAdminPageAuth } from '../../../utils/withAdminPageAuth';
import Head from 'next/head';
import MainLayout from '../../../components/MainLayout';

const AdminTicketDetail = () => {
  const router = useRouter();
  const { ticket_id } = router.query;
  const [ticketExists, setTicketExists] = useState(true);

  useEffect(() => {
    const checkTicketExists = async () => {
      if (ticket_id) {
        const res = await fetch(`/api/admin/checkticket?ticket_id=${ticket_id}`);
        const data = await res.json();
        if (!data.exists) {
          setTicketExists(false);
        }
      }
    };
    checkTicketExists();
  }, [ticket_id, router]);

  if (!ticketExists) {
    return null;
  }

  return (
    <MainLayout>
      <Head>
        <title>AnonyConnect – Admin Ticket Details</title>
      </Head>
      <AdNav />
      {ticket_id && <AdTicketDetail ticketId={ticket_id} />}
      <Footer />
    </MainLayout>
  );
};

export default withAdminPageAuth(AdminTicketDetail);
