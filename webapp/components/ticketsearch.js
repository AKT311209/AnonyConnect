import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt } from '@fortawesome/free-regular-svg-icons';

const TicketSearch = () => {
    return (
        <div className="container pb-5 mb-5 mt-5">
            <section className="py-5 pt-0">
                <div className="container py-5 mt-0 pt-5">
                    <div className="row mb-5">
                        <div className="col-md-8 col-xl-6 text-center mx-auto">
                            <h2 className="fw-bold text-primary">Contact tickets</h2>
                            <p className="text-muted">Please enter your contact ticket id below to view your ticket.</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col mb-0 pb-0 mt-0 pt-0">
                            <form className="bg-transparent border-0 shadow-none search-form">
                                <div className="input-group bg-transparent bg-opacity-75 border-0 border-black shadow-none"><span className="border-0 shadow-sm input-group-text"><FontAwesomeIcon icon={faListAlt} /></span><input className="border-0 shadow-sm form-control" type="text" placeholder="Your ticket id" required /><button className="btn btn-light border-0 shadow-sm" type="submit">View</button></div><div className="cf-turnstile" data-sitekey="<0x4AAAAAAA-RcQdPu6mWgu-p>"></div>
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