import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import TicketSearch from '../components/ticketsearch';
import ToastMessage from '../components/ToastMessage';

const TicketPage = () => {
  return (
        <>
            <NavBar />
            <TicketSearch />
            <ToastMessage header="Invalid ticket" body="The system could not find the provided ticket ID. Please try again." />
            <Footer />
        </>
  );
};

export default TicketPage;
