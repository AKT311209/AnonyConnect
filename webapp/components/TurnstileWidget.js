import React, { useEffect } from 'react';
import Turnstile from 'react-turnstile';

const TurnstileWidget = ({ sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY, onSuccess, onExpire, ...props }) => {
    // In development, bypass the widget and immediately notify success on the client.
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
        useEffect(() => {
            if (typeof onSuccess === 'function') {
                onSuccess('dev-turnstile-bypass-token');
            }
            return () => {
                if (typeof onExpire === 'function') onExpire();
            };
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return null;
    }

    return <Turnstile sitekey={sitekey} onSuccess={onSuccess} onExpire={onExpire} {...props} />;
};

export default TurnstileWidget;
