import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import Success from '../components/successcomponent';

const SuccessPage = () => {
  const router = useRouter();
  const { ticket_id } = router.query;
  const [ticket, setTicket] = useState(null);

  useEffect(() => {
    if (!ticket_id) {
      alert('Direct access is not allowed.');
      router.push('/');
      return;
    }

    const fetchTicket = async () => {
      const response = await fetch(`/api/ticket/${ticket_id}`);
      if (!response.ok) {
        alert('Ticket not found.');
        router.push('/');
      } else {
        const ticket = await response.json();
        setTicket(ticket);
      }
    };

    fetchTicket();
  }, [ticket_id]);

  if (!ticket) {
    return null; // or a loading spinner
  }

  return (
    <>
      <NavBar />
      <Success ticket={ticket} />
      <Footer />
    </>
  );
};

export default SuccessPage;
