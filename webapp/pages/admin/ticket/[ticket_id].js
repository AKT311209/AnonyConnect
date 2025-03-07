import AdTicketDetail from '../../../components/AdminTicketDetail';
import AdNav from '../../../components/AdminNavbar';
import Footer from '../../../components/Footer';
import { useRouter } from 'next/router';

const AdminTicketDetail = () => {
  const router = useRouter();
  const { ticket_id } = router.query;

  return (
    <>
      <AdNav />
      {ticket_id && <AdTicketDetail ticketId={ticket_id} />}
      <Footer />
    </>
  );
};

export default AdminTicketDetail;
