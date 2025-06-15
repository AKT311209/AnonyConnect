import Head from 'next/head';
import { withAdminPageAuth } from '../../utils/withAdminPageAuth';
import AdminNavBar from '../../components/AdminNavbar';
import Footer from '../../components/footer';
import MainLayout from '../../components/MainLayout';
import AdminConfigPanel from '../../components/AdminConfigPanel';

function AdminConfig() {
  return (
    <MainLayout>
      <Head>
        <title>AnonyConnect – Admin Configuration</title>
      </Head>
      <AdminNavBar />
      <AdminConfigPanel />
      <Footer />
    </MainLayout>
  );
}

export default withAdminPageAuth(AdminConfig);
