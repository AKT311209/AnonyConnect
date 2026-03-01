import Head from 'next/head';
import NavBar from '../components/navbar';
import Footer from '../components/footer';
import TicketSearch from '../components/ticketsearch';
import ToastMessage from '../components/ToastMessage';
import MainLayout from '../components/MainLayout';

const TicketPage = () => {
  return (
    <MainLayout>
      <Head>
        <title>AnonyConnect – Ticket Search</title>
      </Head>
      <NavBar />
      <TicketSearch />
      <ToastMessage id="toast-1" autoShow={false} header="Invalid ticket" body="The system could not find the provided ticket ID. Please try again." />
      <Footer />
    </MainLayout>
  );
};

export default TicketPage;
