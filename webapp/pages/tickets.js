import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import TicketSearch from '../components/ticketsearch';
import TicketSearchToast from '../components/ticketsearchtoast';

const TicketPage = () => {
  return (
        <>
            <NavBar />
            <TicketSearch />
            <TicketSearchToast />
            <Footer />
        </>
  );
};

export default TicketPage;
