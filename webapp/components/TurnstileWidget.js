import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Load Turnstile only on client to avoid SSR/hydration issues
const Turnstile = dynamic(() => import('react-turnstile'), { ssr: false });

const TurnstileWidget = ({ sitekey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY, onSuccess, onExpire, ...props }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Dev-mode bypass: run only on client
    useEffect(() => {
        if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
            if (typeof onSuccess === 'function') onSuccess('dev-turnstile-bypass-token');
            return () => {
                if (typeof onExpire === 'function') onExpire();
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!mounted) return null;

    return <Turnstile sitekey={sitekey} onSuccess={onSuccess} onExpire={onExpire} {...props} />;
};

export default TurnstileWidget;
