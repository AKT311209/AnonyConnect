import AdTicketDetail from '../../../components/AdminTicketDetail';
import AdNav from '../../../components/AdminNavbar';
import Footer from '../../../components/footer';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const AdminTicketDetail = () => {
  const router = useRouter();
  const { ticket_id } = router.query;
  const [ticketExists, setTicketExists] = useState(true);

  useEffect(() => {
    const checkTicketExists = async () => {
      if (ticket_id) {
        const res = await fetch(`/api/checkticket?ticket_id=${ticket_id}`);
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
    <>
      <AdNav />
      {ticket_id && <AdTicketDetail ticketId={ticket_id} />}
      <Footer />
    </>
  );
};

export default AdminTicketDetail;
