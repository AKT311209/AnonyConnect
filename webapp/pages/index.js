import Head from 'next/head';
import NavBar from '../components/navbar';
import Footer from '../components/footer';
import ContactSection from '../components/contactsection';
import ToastMessage from '../components/ToastMessage';
import MainLayout from '../components/MainLayout';

const HomePage = () => {
  return (
        <MainLayout>
            <Head>
                <title>AnonyConnect – Home</title>
            </Head>
            <NavBar />
            <ContactSection />
            <Footer />
        </MainLayout>
  );
};

export default HomePage;
