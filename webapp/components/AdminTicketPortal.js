import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import moment from 'moment-timezone';

const AdminPortal = () => {
  const [tickets, setTickets] = useState([]);
  const [sortBy, setSortBy] = useState('status');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch config for default page size on mount
    fetch('/api/admin/config')
      .then(res => res.json())
      .then(cfg => {
        const defaultSize = cfg?.appearance?.admin?.ticketsPagination || 20;
        setPageSize(defaultSize);
      })
      .catch(() => setPageSize(20));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/portal?page=${page}&pageSize=${pageSize}&sortBy=${sortBy}`)
      .then(response => response.json())
      .then(data => {
        setTickets(data.tickets || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(error => {
        setTickets([]);
        setTotal(0);
        setLoading(false);
      });
  }, [page, pageSize, sortBy]);

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
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
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-1" style={{marginBottom: '4px', gap: 8}}>
                {/* On mobile, Quick Action (Go) on top, Sorting below. On desktop, Sorting left, Quick Action right */}
                <div className="order-1 order-md-0 w-100 w-md-auto d-flex justify-content-center justify-content-md-start mb-2 mb-md-0">
                  <select onChange={handleSortChange} value={sortBy} style={{minWidth: 180}}>
                    <optgroup label="Sort by...">
                      <option value="submission_time">Submission Time</option>
                      <option value="status">Ticket Status</option>
                    </optgroup>
                  </select>
                </div>
                <div className="order-0 order-md-1 w-100 w-md-auto d-flex justify-content-center justify-content-md-end mb-2 mb-md-0">
                  <form
                    className="d-flex align-items-center justify-content-center"
                    style={{gap: 4, marginBottom: 0}}
                    onSubmit={async e => {
                      e.preventDefault();
                      const ticketId = e.target.elements.adminTicketSearch.value.trim();
                      if (!ticketId) return;
                      try {
                        const res = await fetch(`/api/admin/checkticket?ticket_id=${encodeURIComponent(ticketId)}`);
                        if (res.status === 200) {
                          const data = await res.json();
                          if (data.exists) {
                            window.open(`/admin/ticket/${ticketId}`, '_blank', 'noopener,noreferrer');
                            return;
                          }
                        }
                        // Show toast for not found or error
                        const toast = document.getElementById('toast-1');
                        if (toast) {
                          let header = 'Ticket not exist';
                          let body = 'The system could not find the provided ticket ID. Please try again.';
                          toast.querySelector('.toast-header strong').textContent = header;
                          toast.querySelector('.toast-body p').textContent = body;
                          const bsToast = new window.bootstrap.Toast(toast);
                          bsToast.show();
                        }
                      } catch (err) {
                        const toast = document.getElementById('toast-1');
                        if (toast) {
                          let header = 'Ticket not exist';
                          let body = 'The system could not find the provided ticket ID. Please try again.';
                          toast.querySelector('.toast-header strong').textContent = header;
                          toast.querySelector('.toast-body p').textContent = body;
                          const bsToast = new window.bootstrap.Toast(toast);
                          bsToast.show();
                        }
                      }
                    }}
                  >
                    <input
                      type="text"
                      name="adminTicketSearch"
                      placeholder="Enter ticket ID"
                      className="form-control"
                      style={{ width: 160, height: 32, fontSize: 15, borderRadius: 4, border: '1px solid #aab3b9', marginRight: 4 }}
                    />
                    <button type="submit" className="btn btn-primary btn-sm" style={{height: 32, fontSize: 15, borderRadius: 4}}>Go</button>
                  </form>
                </div>
              </div>
              <span className="counter pull-right"></span>
              <div className="table-responsive results">
                <table className="table table-hover table-bordered" style={{ tableLayout: 'auto', width: '100%', minWidth: 600 }}>
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
                            {(() => {
                              const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
                              return (
                                <Link href={`${baseUrl}/admin/ticket/${ticket.ticket_id}`} target="_blank" rel="noopener noreferrer" className="btn btn-success border rounded border-1 mt-1" style={{ marginLeft: '5px', borderColor: 'var(--bs-primary)', background: 'var(--bs-primary)' }}>
                                  <svg className="bi bi-card-list text-light" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" style={{fontSize: '18px'}}>
                                    <path d="M14.5 3a.5.5 0 0 1 .5.5v9a.5.5 0 0 1-.5.5h-13a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5zm-13-1A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2z"></path>
                                    <path d="M5 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 5 8m0-2.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m0 5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-1-5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0M4 8a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0m0 2.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0"></path>
                                  </svg>
                                </Link>
                              );
                            })()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3" style={{gap: 8}}>
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
      <section>
        <header></header>
      </section>
    </div>
  );
};

export default AdminPortal;
