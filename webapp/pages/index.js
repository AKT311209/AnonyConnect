import Head from 'next/head';
import NavBar from '../components/navbar';
import Footer from '../components/footer';
import ContactSection from '../components/contactsection';
import ToastMessage from '../components/ToastMessage';

const HomePage = () => {
  return (
        <>
            <Head>
                <title>AnonyConnect – Home</title>
            </Head>
            <NavBar />
            <ContactSection />
            <Footer />
        </>
  );
};

export default HomePage;
