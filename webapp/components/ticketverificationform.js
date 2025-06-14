import React, { useState } from 'react';
import TurnstileWidget from './TurnstileWidget';

const TicketVerification = ({ ticketId, onVerify }) => {
    const [submitting, setSubmitting] = useState(false);
    const [turnstileToken, setTurnstileToken] = useState('');
    const [turnstileValid, setTurnstileValid] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!turnstileValid) return;
        setSubmitting(true);
        const password = e.target.elements[0].value;
        onVerify(password, turnstileToken);
    };

    return (
        <div className="container pb-5 mb-5 mt-5">
            <section className="py-5 pt-0">
                <div className="container py-5 mt-0 pt-5 mb-5">
                    <div className="row mb-5">
                        <div className="col-md-8 col-xl-6 text-center mx-auto">
                            <h2 className="fw-bold text-primary">Ticket details</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col mb-0 pb-0 mt-4">
                            <form className="bg-transparent border-0 shadow-none search-form pt-0 mt-3" onSubmit={handleSubmit} autoComplete="off">
                                <div className="input-group bg-transparent bg-opacity-75 border-0 border-black shadow-none flex-wrap flex-md-nowrap">
                                    <span className="border-0 shadow-sm input-group-text">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-shield-lock">
                                            <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56"></path>
                                            <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415z"></path>
                                        </svg>
                                    </span>
                                    <input
                                        className="border-0 shadow-sm form-control"
                                        type="password"
                                        placeholder={typeof window !== 'undefined' && window.innerWidth < 576 ? 'Password' : 'Enter your password'}
                                        required
                                        name="password"
                                        style={{ minWidth: 0, maxWidth: '100%', flex: 1 }}
                                    />
                                    <button className="btn btn-light border-0 shadow-sm" type="submit" disabled={submitting || !turnstileValid} style={{ whiteSpace: 'nowrap' }}>Verify</button>
                                </div>
                                <div className="d-flex justify-content-end mt-2 w-100">
                                    <div style={{ minWidth: 120 }}>
                                        <TurnstileWidget
                                            onSuccess={token => { setTurnstileToken(token); setTurnstileValid(true); }}
                                            onExpire={() => { setTurnstileToken(''); setTurnstileValid(false); }}
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default TicketVerification;
