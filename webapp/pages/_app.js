import React, { useEffect } from 'react';
import App from 'next/app';

function logPublicEnvVars() {
  const envVars = {};
  for (const key in process.env) {
    if (key.startsWith('NEXT_PUBLIC_')) {
      envVars[key] = process.env[key];
    }
  }
  if (typeof window !== 'undefined') {
    // Log only in the browser
    console.log('NEXT_PUBLIC environment variables:', envVars);
  }
}

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    logPublicEnvVars();
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
