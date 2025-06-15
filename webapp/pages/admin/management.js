import Head from 'next/head';
import { withAdminPageAuth } from '../../utils/withAdminPageAuth';
import AdminNavBar from '../../components/AdminNavbar';
import Footer from '../../components/footer';
import AdminManagementTerminal from '../../components/AdminManagementTerminal';

function AdminManagement() {
  return (
    <>
      <Head>
        <title>AnonyConnect – Admin Management</title>
      </Head>
      <AdminNavBar />
      <AdminManagementTerminal />
      <Footer />
    </>
  );
}

export default withAdminPageAuth(AdminManagement);
