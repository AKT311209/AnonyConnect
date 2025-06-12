import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import crypto from 'crypto';
import ToastMessage from '../../components/ToastMessage';
import NavBar from '../../components/navbar';
import Footer from '../../components/footer';
import TicketVerification from '../../components/ticketverificationform';
import TicketDetail from '../../components/ticketdetail';
import Head from 'next/head';

const TicketPage = () => {
    const router = useRouter();
    const { ticket_id } = router.query;
    const [isVerified, setIsVerified] = useState(false);
    const [showVerification, setShowVerification] = useState(false);
    const [ticketData, setTicketData] = useState(null);
    const [oneTimeToken, setOneTimeToken] = useState(null);

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

    const fetchTicketData = async (token) => {
        try {
            if (!isValidTicketId(ticket_id)) {
                alert('Invalid ticket ID format');
                router.push('/');
                return;
            }
            if (token) {
                const response = await fetch(`/api/message/${ticket_id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                });
                const data = await response.json();
                setTicketData(data);
                setOneTimeToken(null); // Clear token after use
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

    const handleVerification = async (password, turnstileResponse) => {
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
                body: JSON.stringify({ password, turnstileResponse }),
            });
            if (response.status === 403) {
                const toast = document.getElementById('toast-1');
                if (toast) {
                    toast.querySelector('.toast-header strong').textContent = 'Cloudflare Verification Failed';
                    toast.querySelector('.toast-body p').textContent = 'Cloudflare Turnstile verification failed. Please try again.';
                    const bsToast = new bootstrap.Toast(toast);
                    bsToast.show();
                }
                setTimeout(() => window.location.reload(), 1000);
                return;
            }
            if (response.status === 401) {
                const toast = document.getElementById('toast-1');
                if (toast) {
                    toast.querySelector('.toast-header strong').textContent = 'Wrong password';
                    toast.querySelector('.toast-body p').textContent = 'The password is incorrect. Please try again.';
                    const bsToast = new bootstrap.Toast(toast);
                    bsToast.show();
                }
                setTimeout(() => window.location.reload(), 1000);
                return;
            }
            const data = await response.json();
            if (data.isValid && data.token) {
                setIsVerified(true);
                setShowVerification(false);
                setOneTimeToken(data.token);
                fetchTicketData(data.token);
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
            <Head>
                <title>AnonyConnect – Ticket Details</title>
            </Head>
            <NavBar />

            <div>
                {showVerification && !isVerified && (
                    <TicketVerification ticketId={ticket_id} onVerify={handleVerification} />
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
