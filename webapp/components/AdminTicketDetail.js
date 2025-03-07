import React from 'react';

const AdTicketDetail = () => {
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
                                                <li className="list-group-item"><span>Ticket ID:&nbsp;</span><span><strong>xxx-xxx</strong></span></li>
                                                <li className="list-group-item"><span>Submission time:&nbsp;</span><span><strong>00:00:00 23/02/2025</strong></span></li>
                                                <li className="list-group-item"><span>Sender name:&nbsp;</span><span><strong>Placeholder</strong></span></li>
                                                <li className="list-group-item"><span>Sender email:&nbsp;</span><span><strong>Placeholder</strong></span></li>
                                                <li className="list-group-item"><span>Status:&nbsp;</span><span className="text-warning"><strong>Pending</strong></span></li>
                                                <li className="list-group-item"><span>Password-protected:&nbsp;</span><span className="text-danger"><strong>No</strong></span></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" role="tab"><button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-1 .item-2" aria-expanded="true" aria-controls="accordion-1 .item-2">Message</button></h2>
                                    <div className="accordion-collapse collapse show item-2" role="tabpanel">
                                        <div className="accordion-body">
                                            <p className="mb-0 pt-0">To be filled with message fetched from database.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="accordion-item">
                                    <h2 className="accordion-header" role="tab"><button className="accordion-button bg-warning" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-1 .item-3" aria-expanded="true" aria-controls="accordion-1 .item-3">Response</button></h2>
                                    <div className="accordion-collapse collapse show item-3 pe-0" role="tabpanel">
                                        <div className="accordion-body">
                                            <div className="pe-0 me-0"><textarea className="ms-0 me-0 text-area-f ps-2 pe-2 pb-0 mb-2" placeholder="Enter your response here..." style={{color: 'rgb(0,0,0)'}}></textarea>
                                                <div className="d-flex justify-content-end">
                                                    <div className="btn-group btn-group-equal" role="group"><button className="btn border rounded-0 me-3 fixed-size-btn pe-4 ps-4" type="button" style={{background: 'var(--bs-danger)', color: 'var(--bs-gray-800)'}}>Reject</button><button className="btn border rounded-0 fixed-size-btn pe-4 ps-4 me-0" type="button" style={{background: 'var(--bs-info)', color: 'var(--bs-gray-800)'}}>Respond</button></div>
                                                </div>
                                            </div>
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
