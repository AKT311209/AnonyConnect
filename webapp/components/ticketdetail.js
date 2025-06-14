import React from 'react';
import moment from 'moment-timezone';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

const TicketDetail = ({ ticketData }) => {
    
    const getStatusText = (status) => {
        switch (status) {
            case 'Rejected':
                return 'text-danger';
            case 'Responded':
                return 'text-info';
            case 'Pending':
                return 'text-warning';
            default:
                return '';
        }
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
    const formatDateTime = (dateTime) => {
        return moment.utc(dateTime).tz(moment.tz.guess()).format('DD-MM-YYYY HH:mm (UTC Z)');
    };

    const formatResponse = (response) => {
        return (
            <div style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                maxWidth: '100%',
                overflowX: 'auto',
                padding: '8px',
                background: '#fff',
                borderRadius: '6px',
                fontFamily: 'inherit',
                fontSize: '1rem',
            }}>
                <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                    {response || ''}
                </ReactMarkdown>
            </div>
        );
    };

    const getResponseMessage = (status, response) => {
        if (status === 'Pending') {
            return 'The admin has not responded yet.';
        } else if (status === 'Rejected') {
            return 'The admin has refused to respond.';
        } else {
            return formatResponse(response);
        }
    };

    const formatMessage = (message) => {
        return (
            <div style={{
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
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
                                    <h2 className="accordion-header" role="tab">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-1 .item-1" aria-expanded="true" aria-controls="accordion-1 .item-1">
                                            Ticket information
                                        </button>
                                    </h2>
                                    <div className="accordion-collapse collapse show item-1" role="tabpanel">
                                        <div className="accordion-body">
                                            <ul className="list-group border rounded-0">
                                                <li className="list-group-item"><span>Ticket ID:&nbsp;</span><span><strong>{ticketData.ticket_id}</strong></span></li>
                                                <li className="list-group-item"><span>Submission time:&nbsp;</span><span><strong>{formatDateTime(ticketData.created_at)}</strong></span></li>
                                                <li className="list-group-item"><span>Sender name:&nbsp;</span><span><strong>{ticketData.sender_name || 'N/A'}</strong></span></li>
                                                <li className="list-group-item"><span>Sender email:&nbsp;</span><span><strong>{ticketData.sender_email || 'N/A'}</strong></span></li>
                                                <li className="list-group-item"><span>Status:&nbsp;</span><span className={`${getStatusText(ticketData.status)} fw-bold`}><strong>{ticketData.status}</strong></span></li>
                                                <li className="list-group-item"><span>Password-protected:&nbsp;</span><span className={`${ticketData.password === 'Yes' ? 'text-info' : 'text-danger'} fw-bold`}><strong>{ticketData.password}</strong></span></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" role="tab">
                                        <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-1 .item-2" aria-expanded="true" aria-controls="accordion-1 .item-2">
                                            Message
                                        </button>
                                    </h2>
                                    <div className="accordion-collapse collapse show item-2" role="tabpanel">
                                        <div className="accordion-body">
                                            <div className="mb-0 pt-0">{formatMessage(ticketData.message)}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" role="tab">
                                        <button className={`accordion-button ${getStatusClass(ticketData.status)}`} type="button" data-bs-toggle="collapse" data-bs-target="#accordion-1 .item-3" aria-expanded="true" aria-controls="accordion-1 .item-3">
                                            Response
                                        </button>
                                    </h2>
                                    <div className="accordion-collapse collapse show item-3" role="tabpanel">
                                        <div className="accordion-body">
                                            <div className="mb-0">{getResponseMessage(ticketData.status, ticketData.response)}</div>
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

export default TicketDetail;