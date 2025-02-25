import React from 'react';
import Turnstile from 'react-turnstile';

const TicketDetail = () => {
    return (
        <div class="container pb-5 mb-5 mt-5">
            <section class="py-5 pt-0">
                <div class="container py-5 mt-0 pt-5">
                    <div class="row mb-5">
                        <div class="col-md-8 col-xl-6 text-center mx-auto">
                            <h2 class="fw-bold text-primary">Ticket details</h2>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col mb-0 pb-0">
                            <div class="accordion" role="tablist" id="accordion-1">
                                <div class="accordion-item">
                                    <h2 class="accordion-header" role="tab"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-1 .item-1" aria-expanded="true" aria-controls="accordion-1 .item-1">Ticket information</button></h2>
                                    <div class="accordion-collapse collapse show item-1" role="tabpanel">
                                        <div class="accordion-body">
                                            <ul class="list-group border rounded-0">
                                                <li class="list-group-item"><span>Ticket ID:&nbsp;</span><span><strong>xxx-xxx</strong></span></li>
                                                <li class="list-group-item"><span>Submission time:&nbsp;</span><span><strong>00:00:00 23/02/2025</strong></span></li>
                                                <li class="list-group-item"><span>Sender name:&nbsp;</span><span><strong>Placeholder</strong></span></li>
                                                <li class="list-group-item"><span>Sender email:&nbsp;</span><span><strong>Placeholder</strong></span></li>
                                                <li class="list-group-item"><span>Status:&nbsp;</span><span class="text-warning"><strong>Pending</strong></span></li>
                                                <li class="list-group-item"><span>Password-protected:&nbsp;</span><span class="text-danger"><strong>No</strong></span></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item">
                                    <h2 class="accordion-header" role="tab"><button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-1 .item-2" aria-expanded="true" aria-controls="accordion-1 .item-2">Message</button></h2>
                                    <div class="accordion-collapse collapse show item-2" role="tabpanel">
                                        <div class="accordion-body">
                                            <p class="mb-0 pt-0">To be filled with message fetched from database.</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="accordion-item">
                                    <h2 class="accordion-header" role="tab"><button class="accordion-button bg-warning" type="button" data-bs-toggle="collapse" data-bs-target="#accordion-1 .item-3" aria-expanded="true" aria-controls="accordion-1 .item-3">Response</button></h2>
                                    <div class="accordion-collapse collapse show item-3" role="tabpanel">
                                        <div class="accordion-body">
                                            <p class="mb-0">To be filled with message fetched from database. Color: Success: Responsed &amp; closed, Warning: Pending, Danger: Rejected to answer.</p>
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
