import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import moment from 'moment-timezone';

const TicketPublicPortal = () => {
  const [tickets, setTickets] = useState([]);
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    let url = `/api/portal?page=${page}&pageSize=${pageSize}`;
    if (filter && filter !== 'All') url += `&status=${filter}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setTickets(data.tickets || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => {
        setTickets([]);
        setTotal(0);
        setLoading(false);
      });
  }, [page, pageSize, filter]);

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const totalPages = Math.ceil(total / pageSize);

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
    <div className="container p-0 m-0" style={{maxWidth: '100%', minHeight: 0, height: 'auto'}}>
      <section className="p-0 m-0" style={{padding: 0, margin: 0, minHeight: 0, height: 'auto'}}>
        <div className="container p-0 m-0" style={{padding: 0, margin: 0, minHeight: 0, height: 'auto'}}>
          <div className="row m-0 p-0" style={{minHeight: 0, height: 'auto'}}>
            <div className="col-md-12 search-table-col p-0 m-0" style={{minHeight: 0, height: 'auto'}}>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-0" style={{gap: 8, marginBottom: 0, paddingBottom: 0, minHeight: 0, height: 'auto'}}>
                <div className="w-100 w-md-auto d-flex justify-content-center justify-content-md-start mb-0" style={{marginBottom: 0, minHeight: 0, height: 'auto'}}>
                  <select onChange={handleFilterChange} value={filter} style={{minWidth: 180, marginBottom: 0, minHeight: 0, height: 'auto'}}>
                    <optgroup label="Filter by...">
                      <option value="All">All</option>
                      <option value="Responded">Responded</option>
                      <option value="Pending">Pending</option>
                      <option value="Rejected">Rejected</option>
                    </optgroup>
                  </select>
                </div>
              </div>
              <span className="counter pull-right"></span>
              <div className="table-responsive results" style={{marginBottom: 0, paddingBottom: 0, minHeight: 0, height: 'auto'}}>
                <table className="table table-hover table-bordered" style={{ tableLayout: 'auto', width: '100%', minWidth: 600, marginBottom: 15, minHeight: 0, height: 'auto' }}>
                  <thead className="bill-header cs">
                    <tr>
                      <th className="col-lg-1" style={{ fontSize: '16px' }}>Ticket ID</th>
                      <th className="col-lg-3" style={{ fontSize: '16px' }}>Submission time</th>
                      <th className="col-lg-2" style={{ fontSize: '16px' }}>Sender name</th>
                      <th className="col-lg-2" style={{ fontSize: '16px' }}>Sender email</th>
                      <th className="col-lg-1" style={{ fontSize: '16px' }}>Status</th>
                      <th className="col-lg-1" style={{ fontSize: '16px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={6} className="text-center">Loading...</td></tr>
                    ) : tickets.length === 0 ? (
                      <tr><td colSpan={6} className="text-center">No tickets found.</td></tr>
                    ) : (
                      tickets.map(ticket => (
                        <tr key={ticket.ticket_id} style={{ borderWidth: '1px' }}>
                          <td className="text-center" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                            {ticket.ticket_id}
                          </td>
                          <td className="text-center" style={{ fontSize: '16px' }}>{formatDateTime(ticket.created_at)}</td>
                          <td className="text-center" style={{ fontSize: '16px' }}>
                            {
                              ticket.sender_name && ticket.sender_name.length > 18
                                ? ticket.sender_name.slice(0, 15) + '...'
                                : ticket.sender_name || 'N/A'
                            }
                          </td>
                          <td className="text-center" style={{ fontSize: '16px' }}>
                            {
                              ticket.sender_email && ticket.sender_email.length > 18
                                ? ticket.sender_email.slice(0, 15) + '...'
                                : ticket.sender_email || 'N/A'
                            }
                          </td>
                          <td className={`text-center ${getStatusClass(ticket.status)} fw-bold`} style={{ fontSize: '16px' }}>{ticket.status}</td>
                          <td className="text-center" style={{ textAlign: 'center' }}>
                            <Link href={`/ticket/${ticket.ticket_id}`}  className="btn btn-success border rounded border-1 mt-1" style={{ marginLeft: '5px', borderColor: 'var(--bs-primary)', background: 'var(--bs-primary)' }}>
                              <svg className="bi bi-card-list text-light" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" style={{fontSize: '18px'}}>
                                <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"></path>
                                <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"></path>
                              </svg>
                            </Link>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-1 mb-0" style={{gap: 8, marginTop: 0, marginBottom: 0, paddingTop: 0, paddingBottom: 0, minHeight: 0, height: 'auto'}}>
                <div className="d-flex align-items-center" style={{gap: 8}}>
                  <span>Page</span>
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      const val = e.target.elements.pageInput.value;
                      const num = Number(val);
                      if (!isNaN(num) && num >= 1 && num <= totalPages && num !== page) {
                        handlePageChange(num);
                      }
                    }}
                    style={{display: 'inline'}}
                  >
                    <input
                      type="number"
                      name="pageInput"
                      min={1}
                      max={totalPages}
                      placeholder={page}
                      style={{ width: 36, height: 32, textAlign: 'center', borderRadius: 4, border: '1px solid #aab3b9', fontSize: 15, padding: 0, display: 'inline-block', verticalAlign: 'middle' }}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.target.form.requestSubmit();
                        }
                      }}
                      onBlur={e => {
                        const val = e.target.value;
                        const num = Number(val);
                        if (!isNaN(num) && num >= 1 && num <= totalPages && num !== page) {
                          handlePageChange(num);
                        }
                      }}
                    />
                  </form>
                  <span>of {totalPages || 1}</span>
                </div>
                <div>
                  <button className="btn btn-outline-primary btn-sm me-2" onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>Previous</button>
                  <button className="btn btn-outline-primary btn-sm" onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>Next</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TicketPublicPortal;
