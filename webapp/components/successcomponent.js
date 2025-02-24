import React from 'react';

const Success = () => {
  return (
    <div className="container pb-5 mb-5 mt-5">
        <section className="py-5 pt-0">
            <div className="container py-5 mt-0 pt-5 mb-0 pb-0">
                <div className="row mb-5">
                    <div className="col-md-8 col-xl-6 text-center mx-auto">
                        <h2 className="fw-bold text-primary">Ticket Confirmation</h2>
                        <p className="text-info w-lg-50 mb-1 mt-2 pt-0"><strong>Your ticket has been successfully submitted. The details are listed below.</strong></p>
                        <p className="w-lg-50 mb-1">The admin typically responds within 24 hours, though it may take longer in some cases. Please <strong>bookmark your ticket link</strong> or <strong>save your ticket ID</strong> to check for updates later via the <strong>Tickets</strong>&nbsp;tab.</p>
                    </div>
                </div>
                <ul className="list-group border rounded-0">
                    <li className="list-group-item"><span>Ticket ID:&nbsp;</span><span><strong>xxx-xxx</strong></span></li>
                    <li className="list-group-item"><span>Ticket URL:&nbsp;</span><span><a className="link-primary" href="#">https://google.com</a></span></li>
                    <li className="list-group-item"><span>Submission time:&nbsp;</span><span>00:00:00 23/02/2025</span></li>
                    <li className="list-group-item"><span>Sender name:&nbsp;</span><span>Placeholder</span></li>
                    <li className="list-group-item"><span>Sender email:&nbsp;</span><span>Placeholder</span></li>
                    <li className="list-group-item"><span>Status:&nbsp;</span><span className="text-warning">Pending</span></li>
                    <li className="list-group-item"><span>Password-protected:&nbsp;</span><span className="text-danger">No</span></li>
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
