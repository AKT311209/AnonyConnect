import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import moment from 'moment-timezone';

const AdminPortal = () => {
  const [tickets, setTickets] = useState([]);
  const [sortBy, setSortBy] = useState('status');

  useEffect(() => {
    fetch('/api/admin/portal')
      .then(response => response.json())
      .then(data => setTickets(data))
      .catch(error => console.error('Error fetching tickets:', error));
  }, []);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const sortedTickets = [...tickets].sort((a, b) => {
    if (sortBy === 'submission_time') {
      return new Date(b.created_at) - new Date(a.created_at);
    } else {
      const statusComparison = a.status.localeCompare(b.status);
      if (statusComparison === 0) {
        return new Date(b.created_at) - new Date(a.created_at);
      }
      return statusComparison;
    }
  });

  const formatDateTime = (dateTime) => {
    return moment.utc(dateTime).tz(moment.tz.guess()).format('DD-MM-YYYY HH:mm (UTC Z)');
  };

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

  return (
    <div className="container pb-5 mb-5 mt-5">
      <section className="py-5 pt-0">
        <div className="container py-5 mt-0 pt-5">
          <div className="row mb-5">
            <div className="col-md-8 col-xl-6 text-center mx-auto">
              <h2 className="fw-bold text-primary">Tickets Portal</h2>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 search-table-col pt-0 mt-0">
              <div>
                <select onChange={handleSortChange} value={sortBy}>
                  <optgroup label="Sort by...">
                    <option value="submission_time">Submission Time</option>
                    <option value="status">Ticket Status</option>
                  </optgroup>
                </select>
              </div>
              <span className="counter pull-right"></span>
              <div className="table-responsive table table-hover table-bordered results">
                <table className="table table-hover table-bordered">
                  <thead className="bill-header cs">
                    <tr>
                      <th id="trs-hd-1" className="col-lg-1" style={{ fontSize: '16px' }}>Ticket ID</th>
                      <th id="trs-hd-2" className="col-lg-3" style={{ fontSize: '16px' }}>Submission time</th>
                      <th id="trs-hd-3" className="col-lg-2" style={{ fontSize: '16px' }}>Sender name</th>
                      <th id="trs-hd-4" className="col-lg-2" style={{ fontSize: '16px' }}>Sender email</th>
                      <th id="trs-hd-5" className="col-lg-1" style={{ fontSize: '16px' }}>Status</th>
                      <th id="trs-hd-6" className="col-lg-1" style={{ fontSize: '16px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTickets.map(ticket => (
                      <tr key={ticket.ticket_id} style={{ borderWidth: '1px' }}>
                        <td className="text-center" style={{ fontSize: '16px', fontWeight: 'bold' }}>{ticket.ticket_id}</td>
                        <td className="text-center" style={{ fontSize: '16px' }}>{formatDateTime(ticket.created_at)}</td>
                        <td className="text-center" style={{ fontSize: '16px' }}>{ticket.sender_name || 'N/A'}</td>
                        <td className="text-center" style={{ fontSize: '16px' }}>{ticket.sender_email || 'N/A'}</td>
                        <td className={`text-center ${getStatusClass(ticket.status)} fw-bold`} style={{ fontSize: '16px' }}>{ticket.status}</td>
                        <td className="text-center" style={{ textAlign: 'center' }}>
                          {(() => {
                            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
                            return (
                              <Link href={`${baseUrl}/admin/ticket/${ticket.ticket_id}`} target="_blank" rel="noopener noreferrer">
                                <button className="btn btn-success border rounded border-1 mt-1" style={{ marginLeft: '5px', borderColor: 'var(--bs-primary)', background: 'var(--bs-primary)' }} type="button">
                                  <svg className="bi bi-card-list text-light" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" style={{fontSize: '18px'}}>
                                    <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"></path>
                                    <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"></path>
                                  </svg>
                                </button>
                              </Link>
                            );
                          })()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

export default AdminPortal;
