import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt } from '@fortawesome/free-regular-svg-icons';
import Turnstile from 'react-turnstile';

const TicketSearch = () => {
    const handleSubmit = async (event) => {
        event.preventDefault();
        const ticketId = event.target.elements[0].value;
        const turnstileResponse = event.target.elements[1].value;

        const response = await fetch(`/api/checkticket?ticket_id=${ticketId}&turnstile_response=${turnstileResponse}`);
        const result = await response.json();

        if (result.exists) {
            window.location.href = `/ticket/${encodeURIComponent(ticketId)}`;
        } else {
            const toast = document.getElementById('toast-1');
            const bsToast = new bootstrap.Toast(toast);
            bsToast.show();
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
                                <div className="input-group bg-transparent bg-opacity-75 border-0 border-black shadow-none"><span className="border-0 shadow-sm input-group-text"><FontAwesomeIcon icon={faListAlt} /></span><input className="border-0 shadow-sm form-control" type="text" placeholder="Your ticket ID (xxx-xxx)" required /><button className="btn btn-light border-0 shadow-sm" type="submit">View</button></div>
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