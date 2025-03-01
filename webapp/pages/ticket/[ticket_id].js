import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import crypto from 'crypto';
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

    const encrypt = (text) => {
        const cipher = crypto.createCipher('aes-256-ctr', 'password');
        return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    };

    const decrypt = (text) => {
        const decipher = crypto.createDecipher('aes-256-ctr', 'password');
        return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
    };

    const isValidTicketId = (id) => {
        const ticketIdPattern = /^[a-z0-9]{3}-[a-z0-9]{3}$/; // Pattern for (xxx-xxx)
        return ticketIdPattern.test(id);
    };

    useEffect(() => {
        if (ticket_id) {
            if (!isValidTicketId(ticket_id)) {
                alert('Invalid ticket ID format');
                router.push('/');
                return;
            }
            fetch(`/api/auth/${ticket_id}`)
                .then(res => res.json())
                .then(data => {
                    if (data.error === 'Ticket not found') {
                        alert('Invalid ticket');
                        router.push('/');
                    } else if (data.passwordExists) {
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
            if (!isValidTicketId(ticket_id)) {
                alert('Invalid ticket ID format');
                router.push('/');
                return;
            }
            if (sessionStorage.getItem('ticketPassword')) {
                const storedPassword = decrypt(sessionStorage.getItem('ticketPassword'));
                const response = await fetch(`/api/message/${ticket_id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ password: storedPassword }),
                });
                const data = await response.json();
                setTicketData(data);
                sessionStorage.removeItem('ticketPassword'); // Clear password after fetching data
            } else {
                const response = await fetch(`/api/message/${ticket_id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setTicketData(data);
            }
        } catch (error) {
            console.error('Error fetching ticket data', error);
        }
    };

    const handleVerification = async (password) => {
        try {
            if (!isValidTicketId(ticket_id)) {
                alert('Invalid ticket ID format');
                router.push('/');
                return;
            }
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
                sessionStorage.setItem('ticketPassword', encrypt(password)); // Store encrypted password in sessionStorage
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
