import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import NavBar from '../components/navbar';
import Footer from '../components/footer';
import Success from '../components/successcomponent';
import ToastMessage from '../components/ToastMessage';
import Head from 'next/head';
import MainLayout from '../components/MainLayout';

const SuccessPage = () => {
  const router = useRouter();
  const { ticket_id } = router.query;
  const [ticket, setTicket] = useState(null);
  const [showNotifyDeniedToast, setShowNotifyDeniedToast] = useState(false);

  useEffect(() => {
    if (!ticket_id) {
      alert('Direct access is not allowed.');
      router.push('/');
      return;
    }

    const isValidTicketId = (id) => {
      const ticketIdPattern = /^[a-z0-9]{3}-[a-z0-9]{3}$/; // Pattern for (xxx-xxx)
      return ticketIdPattern.test(id);
    };

    const fetchTicket = async () => {
      if (!isValidTicketId(ticket_id)) {
        alert('Invalid ticket ID format');
        router.push('/');
        return;
      }
      const response = await fetch(`/api/success/${ticket_id}`);
      if (!response.ok) {
        alert('Ticket not found.');
        router.push('/');
      } else {
        const ticket = await response.json();
        setTicket(ticket);
      }
    };

    fetchTicket();
  }, [ticket_id]);

  useEffect(() => {
    // When ticket is loaded, request notification permission and attempt subscription
    if (!ticket) return;

    async function setupPush() {
      // Check server-side config whether browser push is enabled
      try {
        const cfgRes = await fetch('/api/push/enabled');
        const cfgJson = cfgRes.ok ? await cfgRes.json() : { enabled: true };
        if (!cfgJson.enabled) return;
      } catch (e) {
        // if config check fails, default to enabled
      }
      try {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;

        // Only ask if permission not denied
        if (Notification.permission === 'default') {
          const p = await Notification.requestPermission();
          if (p !== 'granted') {
            setShowNotifyDeniedToast(true);
            return;
          }
        }

        if (Notification.permission === 'denied') {
          setShowNotifyDeniedToast(true);
          return;
        }

        // Register service worker and wait until it's active/controlling
        await navigator.serviceWorker.register('/sw.js');
        const reg = await navigator.serviceWorker.ready;

        // helper to convert VAPID key
        const urlBase64ToUint8Array = (base64String) => {
          const padding = '='.repeat((4 - base64String.length % 4) % 4);
          const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
          const rawData = window.atob(base64);
          const outputArray = new Uint8Array(rawData.length);
          for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
          }
          return outputArray;
        };

        const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
        const subscribeOptions = {
          userVisibleOnly: true,
          applicationServerKey: vapidKey ? urlBase64ToUint8Array(vapidKey) : undefined
        };

        const existingSub = await reg.pushManager.getSubscription();
        const sub = existingSub || await reg.pushManager.subscribe(subscribeOptions);

        // send to server with ticket id (no PII)
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ subscription: sub, ticket_id: ticket.ticket_id })
        });
      } catch (err) {
        // fail silently to preserve UX
        console.error('push setup failed', err);
      }
    }

    setupPush();
  }, [ticket]);

  if (!ticket) {
    return null; // or a loading spinner
  }

  return (
    <MainLayout>
      <Head>
        <title>AnonyConnect – Ticket Submitted</title>
      </Head>
      <NavBar />
      <Success ticket={ticket} />
      {showNotifyDeniedToast && (
        <ToastMessage header="Notification not allowed" body="You won't be notified when your ticket is responded." />
      )}
      <Footer />
    </MainLayout>
  );
};

export default SuccessPage;
