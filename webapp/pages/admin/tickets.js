import { withAdminPageAuth } from '../../utils/withAdminPageAuth';
import AdminTicketPort from '../../components/AdminTicketPortal';
import AdNav from '../../components/AdminNavbar';
import Footer from '../../components/footer';
import ToastMessage from '../../components/ToastMessage';
import Head from 'next/head';

const AdminDash = () => {

  return (
    <>
      <Head>
        <title>AnonyConnect – Admin Tickets</title>
      </Head>
      <AdNav />
      <ToastMessage header="Invalid ticket" body="The system could not find the provided ticket ID. Please try again." />
      <AdminTicketPort />
      <Footer />
    </>
  );
};

export default withAdminPageAuth(AdminDash);
