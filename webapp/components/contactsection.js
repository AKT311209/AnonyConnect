import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import ToastMessage from './ToastMessage';
import TurnstileWidget from './TurnstileWidget';

const ContactSection = () => {
    const router = useRouter();
    const toastRef = useRef(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const data = Object.fromEntries(formData.entries());

        // Name and email length validation
        if (data.name && data.name.length > 30) {
            const toastElement = document.getElementById('toast-1');
            if (toastElement) {
                toastElement.querySelector('.toast-header strong').textContent = 'Input too long';
                toastElement.querySelector('.toast-body p').textContent = 'Name cannot exceed 30 characters.';
                const toast = new window.bootstrap.Toast(toastElement);
                toast.show();
            }
            return;
        }
        if (data.email && data.email.length > 50) {
            const toastElement = document.getElementById('toast-1');
            if (toastElement) {
                toastElement.querySelector('.toast-header strong').textContent = 'Input too long';
                toastElement.querySelector('.toast-body p').textContent = 'Email cannot exceed 50 characters.';
                const toast = new window.bootstrap.Toast(toastElement);
                toast.show();
            }
            return;
        }

        // Client-side validation for message length
        if (!data.message || data.message.length < 15) {
            const toastElement = document.getElementById('toast-1');
            if (toastElement) {
                toastElement.querySelector('.toast-header strong').textContent = 'Message too short';
                toastElement.querySelector('.toast-body p').textContent = 'Please ensure the message is at least 15 characters long.';
                const toast = new window.bootstrap.Toast(toastElement);
                toast.show();
            }
            return;
        }

        const response = await fetch('/api/newticket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.status === 413) {
            const toastElement = document.getElementById('toast-1');
            if (toastElement) {
                toastElement.querySelector('.toast-header strong').textContent = 'Input too long';
                toastElement.querySelector('.toast-body p').textContent = 'Name or email cannot exceed their character limits.';
                const toast = new window.bootstrap.Toast(toastElement);
                toast.show();
            }
            return;
        }

        if (!response.ok) {
            const toastElement = document.getElementById('toast-1');
            if (toastElement) {
                toastElement.querySelector('.toast-header strong').textContent = 'Submission failed';
                toastElement.querySelector('.toast-body p').textContent = 'Failed to create ticket. Please try again later.';
                const toast = new window.bootstrap.Toast(toastElement);
                toast.show();
            }
            return;
        }

        const result = await response.json();
        router.push({
            pathname: '/success',
            query: { ticket_id: result.ticket_id }
        }, '/success');
    };

    return (
        <section className="position-relative py-4 py-xl-5">
            <div className="container position-relative">
                <div className="row pb-3 mb-1">
                    <div className="col-md-8 col-xl-6 text-center mx-auto">
                        <h2 className="text-primary"><strong>Let's Connect</strong></h2>
                        <p className="w-lg-50 mb-1">Please use the contact form to reach out to the admin anonymously. You will receive a ticket to get responses from the admin.</p>
                        <p className="mb-0">Alternatively, you may use the contact information provided.</p>
                    </div>
                </div>
                <div className="row d-flex justify-content-md-center mt-0 pt-0 pb-0 mb-0">
                    <div className="col-md-6 col-lg-4 col-xl-4 pb-5 mb-0">
                        <div className="d-flex flex-column align-items-start h-100 mt-0 pt-0">
                            <div className="d-flex align-items-center p-3 mb-0 pt-4">
                                <div className="bs-icon-md bs-icon-rounded bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block bs-icon"><svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="1em" viewBox="0 0 24 24" width="1em" fill="currentColor">
                                    <g>
                                        <rect fill="none" height="24" width="24"></rect>
                                    </g>
                                    <g>
                                        <g>
                                            <path d="M14,7h-4C8.9,7,8,7.9,8,9v6h2v7h4v-7h2V9C16,7.9,15.1,7,14,7z"></path>
                                            <circle cx="12" cy="4" r="2"></circle>
                                        </g>
                                    </g>
                                </svg></div>
                                <div className="px-2">
                                    <h6 className="mb-0">Name</h6>
                                    <p className="mb-0"><strong>Tran Anh Khoi</strong></p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center p-3">
                                <div className="bs-icon-md bs-icon-rounded bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block bs-icon"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-envelope">
                                    <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"></path>
                                </svg></div>
                                <div className="px-2">
                                    <h6 className="mb-0">Email</h6>
                                    <p className="mb-0"><a className="text-start link-dark" href="mailto:akhoitran09@gmail.com"><strong>akhoitran09@gmail.com</strong></a></p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center p-3">
                                <div className="bs-icon-md bs-icon-rounded bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block bs-icon"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="currentColor" viewBox="0 0 16 16" className="bi bi-telephone">
                                    <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.678.678 0 0 0 .178.643l2.457 2.457a.678.678 0 0 0 .644.178l2.189-.547a1.745 1.745 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.634 18.634 0 0 1-7.01-4.42 18.634 18.634 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877L1.885.511z"></path>
                                </svg></div>
                                <div className="px-2">
                                    <h6 className="mb-0">Phone</h6>
                                    <p className="mb-0"><strong>+84 822 311 209</strong></p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center p-3 mb-0 pb-0">
                                <div className="bs-icon-md bs-icon-rounded bs-icon-primary d-flex flex-shrink-0 justify-content-center align-items-center d-inline-block bs-icon"><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M14 7C13.4477 7 13 7.44772 13 8V16C13 16.5523 13.4477 17 14 17H18C18.5523 17 19 16.5523 19 16V8C19 7.44772 18.5523 7 18 7H14ZM17 9H15V15H17V9Z" fill="currentColor"></path>
                                    <path d="M6 7C5.44772 7 5 7.44772 5 8C5 8.55228 5.44772 9 6 9H10C10.5523 9 11 8.55228 11 8C11 7.44772 10.5523 7 10 7H6Z" fill="currentColor"></path>
                                    <path d="M6 11C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13H10C10.5523 13 11 12.5523 11 12C11 11.4477 10.5523 11 10 11H6Z" fill="currentColor"></path>
                                    <path d="M5 16C5 15.4477 5.44772 15 6 15H10C10.5523 15 11 15.4477 11 16C11 16.5523 10.5523 17 10 17H6C5.44772 17 5 16.5523 5 16Z" fill="currentColor"></path>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M4 3C2.34315 3 1 4.34315 1 6V18C1 19.6569 2.34315 21 4 21H20C21.6569 21 23 19.6569 23 18V6C23 4.34315 21.6569 3 20 3H4ZM20 5H4C3.44772 5 3 5.44772 3 6V18C3 18.5523 3.44772 19 4 19H20C20.5523 19 21 18.5523 21 18V6C21 5.44772 20.5523 5 20 5Z" fill="currentColor"></path>
                                </svg></div>
                                <div className="px-2">
                                    <h6 className="mb-0">Website</h6>
                                    <p className="mb-0"><a className="link-dark" href="https://about.khoi.io.vn" target="_blank"><strong>https://about.khoi.io.vn</strong></a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-lg-5 col-xl-4">
                        <div>
                            <form className="p-3 p-xl-4 pe-0 me-0 ps-0 ms-0 mb-3" method="post" onSubmit={handleSubmit}>
                                <div className="mb-3"><input className="form-control" type="text" id="name" name="name" placeholder="Name (optional)" /></div>
                                <div className="mb-3"><input className="form-control" type="email" id="email-2" name="email" placeholder="Email (optional)" /></div>
                                <div className="mb-3"><textarea className="border rounded form-control mb-3" id="message-2" name="message" rows="6" placeholder="Message (required)" required></textarea></div>
                                <div className="mb-3 me-0 pe-0"><input className="form-control" type="password" name="password" placeholder="Password (optional)" /><small className="form-text ps-0 pb-0 me-5 pe-0" style={{ marginRight: '54px' }}>Create a password to prevent others from viewing your ticket.</small></div>
                                <div className="mb-3 d-flex justify-content-center">
                                    <TurnstileWidget />
                                </div>
                                <button className="btn btn-primary d-block w-100" type="submit">Send</button>
                            </form>
                        </div>
                    </div>
                    <ToastMessage header="Message too short" body="Please ensure the message is at least 15 characters long." />
                </div>
            </div>
        </section>
    );
};

export default ContactSection;