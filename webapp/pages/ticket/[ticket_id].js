import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import ToastMessage from '../../components/ToastMessage';
import NavBar from '../../components/NavBar';
import Footer from '../../components/Footer';
import TicketVerification from '../../components/TicketVerificationForm';
import TicketDetail from '../../components/ticketdetail';

const TicketPage = () => {
    const router = useRouter();
    const { ticket_id } = router.query;
    const [isVerified, setIsVerified] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [ticketData, setTicketData] = useState(null);

    useEffect(() => {
        if (ticket_id) {
            console.log('Fetching auth data for ticket_id:', ticket_id); // Debug log
            fetch(`/api/auth/${ticket_id}`)
                .then(res => res.json())
                .then(data => {
                    console.log('Auth data:', data); // Debug log
                    if (data.passwordExists) {
                        setShowVerification(true);
                    } else {
                        setIsVerified(true); // Set isVerified to true if no password exists
                        fetchTicketData();
                    }
                });
        }
    }, [ticket_id]);

    const fetchTicketData = async () => {
        try {
            const storedPassword = sessionStorage.getItem('ticketPassword');
            console.log('Fetching ticket data for ticket_id:', ticket_id); // Debug log
            const response = await fetch(`/api/message/${ticket_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password: storedPassword }),
            });
            const data = await response.json();
            setTicketData(data);
        } catch (error) {
            console.error('Error fetching ticket data', error);
        }
    };

    const handleVerification = async (password) => {
        try {
            const response = await fetch(`/api/auth/${ticket_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ password }),
            });
            const data = await response.json();
            if (data.isValid) {
                setIsVerified(true);
                setShowVerification(false);
                sessionStorage.setItem('ticketPassword', password); // Store password in sessionStorage
                fetchTicketData();
            } else {
                const toast = document.getElementById('toast-1');
                const bsToast = new bootstrap.Toast(toast);
                bsToast.show();
            }
        } catch (error) {
            console.error('Error during authentication', error);
        }
    };

    return (
        <>
            <NavBar />
            
            <div>
                {showVerification && !isVerified && (
                    <TicketVerification onVerify={handleVerification} />
                )}
                {isVerified && ticketData && (
                    <TicketDetail ticketData={ticketData} />
                )}
                <ToastMessage header="Invalid password" body="Password is invalid, please try again." />
            </div>
            <Footer />
        </>
    );
};

export default TicketPage;
