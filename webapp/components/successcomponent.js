import React from 'react';
import moment from 'moment-timezone';

const Success = ({ ticket }) => {
  const fullUrl = `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/ticket/${ticket.ticket_id}`;

  const getStatusClass = (status) => {
    switch (status) {
      case 'Rejected':
        return 'text-danger';
      case 'Responded':
        return 'text-success';
      case 'Pending':
        return 'text-warning';
      default:
        return '';
    }
  };

  const formatDateTime = (dateTime) => {
    return moment.utc(dateTime).tz(moment.tz.guess()).format('DD-MM-YYYY HH:mm (UTC Z)');
  };

  return (
    <div className="container pb-5 mb-5 mt-5">
        <section className="py-5 pt-0">
            <div className="container py-5 mt-0 pt-5 mb-0 pb-0">
                <div className="row mb-5">
                    <div className="col-md-8 col-xl-6 text-center mx-auto">
                        <h2 className="fw-bold text-primary">Ticket Confirmation</h2>
                        <p className="text-info w-lg-50 mb-1 mt-2 pt-0"><strong>Your ticket has been successfully recorded. The details are listed below.</strong></p>
                        <p className="w-lg-50 mb-1">The admin typically responds within 24 hours, though it may take longer in some cases. Please <strong>bookmark your ticket URL</strong> or <strong>save your ticket ID</strong> to check for updates later via the <strong>Tickets</strong>&nbsp;tab.</p>
                    </div>
                </div>
                <ul className="list-group border rounded-0">
                    <li className="list-group-item"><span>Ticket ID:&nbsp;</span><span><strong>{ticket.ticket_id}</strong></span></li>
                    <li className="list-group-item"><span>Ticket URL:&nbsp;</span><span><a className="link-primary" href={fullUrl}>{fullUrl}</a></span></li>
                    <li className="list-group-item"><span>Submission time:&nbsp;</span><span><strong>{formatDateTime(ticket.created_at)}</strong></span></li>
                    <li className="list-group-item"><span>Sender name:&nbsp;</span><span><strong>{ticket.sender_name || 'N/A'}</strong></span></li>
                    <li className="list-group-item"><span>Sender email:&nbsp;</span><span><strong>{ticket.sender_email || 'N/A'}</strong></span></li>
            <li className="list-group-item"><span>Status:&nbsp;</span><span className={`${getStatusClass(ticket.status)} fw-bold`}><strong>{ticket.status}</strong></span></li>
                    <li className="list-group-item"><span>Password-protected:&nbsp;</span><span className={`${ticket.password === 'Yes' ? 'text-info' : 'text-danger'} fw-bold`}><strong>{ticket.password}</strong></span></li>
                </ul>
            </div>
        </section>
        <section>
            <header></header>
        </section>
    </div>
  );
};

export default Success;
