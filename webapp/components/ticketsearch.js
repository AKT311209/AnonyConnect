import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt } from '@fortawesome/free-regular-svg-icons';
import TurnstileWidget from './TurnstileWidget';

const TicketSearch = () => {
    const isValidTicketId = (id) => {
        const ticketIdPattern = /^[a-z0-9]{3}-[a-z0-9]{3}$/; // Pattern for (xxx-xxx)
        return ticketIdPattern.test(id);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const ticketId = event.target.elements[0].value;
        const turnstileResponse = event.target.elements[1].value;

        if (!isValidTicketId(ticketId)) {
            const toast = document.getElementById('toast-1');
            const bsToast = new bootstrap.Toast(toast);
            bsToast.show();
            return;
        }

        const response = await fetch(`/api/checkticket?ticket_id=${ticketId}&turnstile_response=${turnstileResponse}`);
        const result = await response.json();

        if (response.status === 403) {
            const toast = document.getElementById('toast-1');
            if (toast) {
                toast.querySelector('.toast-header strong').textContent = 'Cloudflare Verification Failed';
                toast.querySelector('.toast-body p').textContent = 'Cloudflare Turnstile verification failed. Please try again.';
                const bsToast = new bootstrap.Toast(toast);
                bsToast.show();
            }
            // Reload the form to reset the Cloudflare token
            setTimeout(() => window.location.reload(), 1000);
            return;
        }

        if (result.exists) {
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin || 'http://localhost:3000';
            window.location.href = `${baseUrl}/ticket/${encodeURIComponent(ticketId)}`;
        } else {
            const toast = document.getElementById('toast-1');
            if (toast) {
                toast.querySelector('.toast-header strong').textContent = 'Invalid ticket';
                toast.querySelector('.toast-body p').textContent = 'The system could not find the provided ticket id. Please try again.';
                const bsToast = new bootstrap.Toast(toast);
                bsToast.show();
            }
            // Reload the form to reset the Cloudflare token
            setTimeout(() => window.location.reload(), 1000);
        }
    };

    return (
        <div className="container pb-5 mb-5 mt-5">
            <section className="py-5 pt-0">
                <div className="container py-5 mt-0 pt-5">
                    <div className="row mb-5">
                        <div className="col-md-8 col-xl-6 text-center mx-auto">
                            <h2 className="fw-bold text-primary">Contact tickets</h2>
                            <p className="text-muted">Please enter your contact ticket ID below to view your ticket.</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col mb-0 pb-0 mt-0 pt-0">
                            <form className="bg-transparent border-0 shadow-none search-form" onSubmit={handleSubmit}>
                                <div className="input-group bg-transparent bg-opacity-75 border-0 border-black shadow-none"><span className="border-0 shadow-sm input-group-text"><FontAwesomeIcon icon={faListAlt} /></span><input className="border-0 shadow-sm form-control" type="text" placeholder="Your ticket ID (xxx-xxx)" required /><TurnstileWidget /><button className="btn btn-light border-0 shadow-sm" type="submit">View</button></div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <header></header>
            </section>
        </div>
    );
};

export default TicketSearch;