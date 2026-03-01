import { withAdminPageAuth } from '../../utils/withAdminPageAuth';
import AdminTicketPort from '../../components/AdminTicketPortal';
import AdNav from '../../components/AdminNavbar';
import Footer from '../../components/footer';
import ToastMessage from '../../components/ToastMessage';
import Head from 'next/head';
import MainLayout from '../../components/MainLayout';

const AdminDash = () => {

  return (
    <MainLayout>
      <Head>
        <title>AnonyConnect – Admin Tickets</title>
      </Head>
      <AdNav />
      <ToastMessage id="toast-1" autoShow={false} header="Invalid ticket" body="The system could not find the provided ticket ID. Please try again." />
      <AdminTicketPort />
      <Footer />
    </MainLayout>
  );
};

export default withAdminPageAuth(AdminDash);
