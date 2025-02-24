import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import ContactSection from '../components/ContactSection';
import ToastMessage from '../components/ToastMessage';

const HomePage = () => {
  return (
        <>
            <NavBar />
            <ContactSection />
            <ToastMessage header="Message too short" body="Please ensure the message is at least 10 characters long." />
            <Footer />
        </>
  );
};

export default HomePage;
