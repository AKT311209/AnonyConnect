import React, { useEffect, useRef, forwardRef } from 'react';

const ToastMessage = forwardRef(({ id, header, body, duration = 5000, autoShow = false }, ref) => {
    const internalRef = useRef(null);
    const toastRef = ref || internalRef;

    useEffect(() => {
        if (!autoShow) return;
        const el = toastRef.current;
        if (!el) return;
        // show
        el.classList.remove('hide');
        el.classList.add('show');
        el.style.display = 'block';

        const hide = () => {
            try {
                el.classList.remove('show');
                el.classList.add('hide');
                el.style.display = 'none';
            } catch (e) { }
        };

        const t = setTimeout(hide, duration);
        return () => clearTimeout(t);
    }, [duration, autoShow, toastRef]);

    useEffect(() => {
        // mount
    }, []);

    const handleClose = (e) => {
        const el = toastRef.current;
        if (!el) return;
        el.classList.remove('show');
        el.classList.add('hide');
        el.style.display = 'none';
    };

    return (
        <div className="toast-container top-0 end-0 p-3" style={{ position: 'fixed', display: 'flex', zIndex: 1080 }}>
            <div id={id} ref={toastRef} className="toast fade hide" role="alert" data-bs-delay="5000">
                <div className="toast-header">
                    <strong className="text-danger me-auto">{header || 'Notification'}</strong>
                    <button onClick={handleClose} className="btn-close ms-2 mb-1 close" type="button" aria-label="Close"></button>
                </div>
                <div className="toast-body" role="alert">
                    <p style={{ margin: 0 }}>{body || ''}</p>
                </div>
            </div>
        </div>
    );
});

export default ToastMessage;
