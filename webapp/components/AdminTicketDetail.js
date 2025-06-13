import React, { useEffect, useState, useMemo } from 'react';
import moment from 'moment-timezone';
import dynamic from 'next/dynamic';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import { useRouter } from 'next/router';
import "easymde/dist/easymde.min.css";

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false });

const AdTicketDetail = ({ ticketId }) => {
    const [ticket, setTicket] = useState(null);
    const [response, setResponse] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Fetch ticket details from the database
        const fetchTicketDetails = async () => {
            try {
                const res = await fetch(`/api/admin/tickets/fetch?ticketId=${ticketId}`);
                if (res.ok) {
                    const data = await res.json();
                    setTicket(data);
                } else {
                    throw new Error('Invalid Ticket ID');
                }
            } catch (error) {
                alert("Invalid Ticket ID");
                router.push('/admin/tickets');
            }
        };

        fetchTicketDetails();
    }, [ticketId, router]);

    const handleResponseChange = (value) => {
        setResponse(value);
    };

    const handleRespond = async () => {
        // Handle the response submission
        await fetch(`/api/admin/tickets/respond`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ticketId, response }),
        });
        // Update the ticket status
        setTicket({ ...ticket, status: 'Responded', response });
    };

    const handleReject = async () => {
        // Handle the rejection
        await fetch(`/api/admin/tickets/reject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ticketId }),
        });
        // Update the ticket status
        setTicket({ ...ticket, status: 'Rejected' });
    };

    const handleUndo = async () => {
        await fetch(`/api/admin/tickets/undo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ticketId }),
        });
        setTicket({ ...ticket, status: 'Pending', response: null });
        setResponse('');
    };

    const formatDateTime = (dateTime) => {
        return moment.utc(dateTime).tz(moment.tz.guess()).format('DD-MM-YYYY HH:mm (UTC Z)');
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Rejected':
                return 'bg-danger';
            case 'Responded':
                return 'bg-success';
            case 'Pending':
                return 'bg-warning';
            default:
                return '';
        }
    };

    const simpleMDEOptions = useMemo(() => {
        return {
            placeholder: "Enter your response here...",
            sideBySideFullscreen: false,
        };
    }, []);

    const formatMessage = (message) => {
        return (
            <div style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                maxWidth: '100%',
                overflowX: 'auto',
                padding: '8px',
                background: '#fff',
                borderRadius: '6px',
                fontFamily: 'inherit',
                fontSize: '1rem',
            }}>
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                    {message || ''}
                </ReactMarkdown>
            </div>
        );
    };

    const formatResponse = (response) => {
        return (
            <div style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                maxWidth: '100%',
                overflowX: 'auto',
                padding: '8px',
                background: '#fff', // match exact white background
                borderRadius: '6px',
                fontFamily: 'inherit',
                fontSize: '1rem',
            }}>
                {response}
            </div>
        );
    };

    if (!ticket) {
        return null;
    }

    return (
        <div className="container pb-5 mb-5 mt-5">
            <section className="py-5 pt-0">
                <div className="container py-5 mt-0 pt-5">
                    <div className="row mb-5">
                        <div className="col-md-8 col-xl-6 text-center mx-auto">
                            <h2 className="fw-bold text-primary">Ticket details</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col mb-0 pb-0">
                            <div className="accordion" role="tablist" id="accordion-1">
                                <div className="accordion-item">
                                    <h2 className="accordion-header" role="tab"><button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-1 .item-1" aria-expanded="true" aria-controls="accordion-1 .item-1">Ticket information</button></h2>
                                    <div className="accordion-collapse collapse show item-1" role="tabpanel">
                                        <div className="accordion-body">
                                            <ul className="list-group border rounded-0">
                                                <li className="list-group-item"><span>Ticket ID:&nbsp;</span><span><strong>{ticket.ticket_id}</strong></span></li>
                                                <li className="list-group-item"><span>Submission time:&nbsp;</span><span><strong>{formatDateTime(ticket.created_at)}</strong></span></li>
                                                <li className="list-group-item"><span>Sender name:&nbsp;</span><span><strong>{ticket.sender_name || 'N/A'}</strong></span></li>
                                                <li className="list-group-item"><span>Sender email:&nbsp;</span><span><strong>{ticket.sender_email || 'N/A'}</strong></span></li>
                                                <li className="list-group-item"><span>Status:&nbsp;</span><span className={`text-${ticket.status === 'Pending' ? 'warning' : ticket.status === 'Responded' ? 'info' : 'danger'}`}><strong>{ticket.status}</strong></span></li>
                                                <li className="list-group-item"><span>Password-protected:&nbsp;</span><span className={`${ticket.password_protected === 'Yes' ? 'text-info' : 'text-danger'} fw-bold`}><strong>{ticket.password_protected}</strong></span></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" role="tab"><button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-1 .item-2" aria-expanded="true" aria-controls="accordion-1 .item-2">Message</button></h2>
                                    <div className="accordion-collapse collapse show item-2" role="tabpanel">
                                        <div className="accordion-body">
                                            <div className="mb-0 pt-0">{formatMessage(ticket.message)}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" role="tab">
                                        <button className={`accordion-button ${getStatusClass(ticket.status)}`} type="button" data-bs-toggle="collapse" data-bs-target="#accordion-1 .item-3" aria-expanded="true" aria-controls="accordion-1 .item-3">
                                            Response
                                        </button>
                                    </h2>
                                    <div className="accordion-collapse collapse show item-3 pe-0" role="tabpanel">
                                        <div className="accordion-body">
                                            {ticket.status === 'Pending' ? (
                                                <div className="pe-0 me-0">
                                                    <SimpleMDE
                                                        value={response}
                                                        onChange={handleResponseChange}
                                                        options={simpleMDEOptions}
                                                    />
                                                    <div className="d-flex justify-content-end">
                                                        <div className="btn-group btn-group-equal" role="group">
                                                            <button className="btn border rounded-0 me-3 fixed-size-btn pe-4 ps-4" type="button" style={{background: 'var(--bs-danger)', color: 'var(--bs-gray-800)'}} onClick={handleReject}>Reject</button>
                                                            <button className="btn border rounded-0 fixed-size-btn pe-4 ps-4 me-0" type="button" style={{background: 'var(--bs-info)', color: 'var(--bs-gray-800)'}} onClick={handleRespond}>Respond</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div>
                                                    {ticket.status === 'Responded' && formatResponse(ticket.response)}
                                                    {ticket.status === 'Rejected' && <p>You have rejected to answer to this message.</p>}
                                                    <div className="d-flex justify-content-end mt-3">
                                                        <button
                                                            className="btn border rounded-0 fixed-size-btn pe-3 ps-3 me-0"
                                                            type="button"
                                                            style={{
                                                                background: 'var(--bs-info)',
                                                                color: 'var(--bs-gray-800)',
                                                                minWidth: '105px', // 140px * 0.75
                                                                maxWidth: '150px', // 200px * 0.75
                                                                fontWeight: 600,
                                                                fontSize: '0.94rem', // 1.25rem * 0.75
                                                                borderColor: 'var(--bs-primary)',
                                                                boxShadow: 'none',
                                                                textAlign: 'center',
                                                                display: 'inline-block',
                                                                paddingTop: '0.375rem', // reduce padding
                                                                paddingBottom: '0.375rem',
                                                            }}
                                                            onClick={handleUndo}
                                                        >
                                                            Undo
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
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

export default AdTicketDetail;
