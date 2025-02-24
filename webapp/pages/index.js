import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import ContactSection from '../components/ContactSection';
import MessageTooShort from '../components/messagetooshort';

const HomePage = () => {
  return (
        <>
            <NavBar />
            <ContactSection />
            <MessageTooShort />
            <Footer />
        </>
  );
};

export default HomePage;
