'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function VisitorAnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isInitializedRef = useRef(false);
  const lastHeartbeatTimeRef = useRef<number>(Date.now());
  const activeSecondsRef = useRef<number>(0);

  useEffect(() => {
    // 1. Ensure Client Side
    if (typeof window === 'undefined') return;

    // 2. Generate or Retrieve Unique Visitor ID (Persistent across sessions)
    let visitorId = localStorage.getItem('kidzmoney_vid');
    if (!visitorId) {
      visitorId = `v_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
      localStorage.setItem('kidzmoney_vid', visitorId);
    }

    // 3. Generate or Retrieve Session ID (Scoped to browser tab/session)
    let sessionId = sessionStorage.getItem('kidzmoney_sid');
    let isNewSession = false;
    if (!sessionId) {
      sessionId = `s_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
      sessionStorage.setItem('kidzmoney_sid', sessionId);
      sessionStorage.setItem('kidzmoney_landing', window.location.pathname);
      isNewSession = true;
    }

    const landingPage = sessionStorage.getItem('kidzmoney_landing') || window.location.pathname;
    const currentPage = window.location.pathname;
    const referrer = document.referrer ? new URL(document.referrer, window.location.origin).hostname : 'Direct';

    // 4. Retrieve Affiliate Tag if present
    const refParam = searchParams.get('ref') || searchParams.get('aff') || searchParams.get('affiliate') || searchParams.get('creator');
    const affiliateRef = refParam || localStorage.getItem('kidzmoney_affiliate_ref') || '';

    // 5. Send Pageview Event
    const payload = {
      type: 'pageview',
      sessionId,
      visitorId,
      currentPage,
      landingPage,
      referrer: referrer || 'Direct',
      affiliateRef
    };

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      keepalive: true
    }).catch(err => console.debug('Analytics pageview ping note:', err));

    lastHeartbeatTimeRef.current = Date.now();
    activeSecondsRef.current = 0;

    // 6. Active Heartbeat Loop (Updates session duration while user is active on tab)
    const heartbeatInterval = setInterval(() => {
      if (document.hidden) return; // Only count duration when tab is active and visible

      const now = Date.now();
      const elapsedSec = Math.round((now - lastHeartbeatTimeRef.current) / 1000);
      lastHeartbeatTimeRef.current = now;

      if (elapsedSec > 0 && elapsedSec <= 60) {
        activeSecondsRef.current += elapsedSec;

        const hbPayload = {
          type: 'heartbeat',
          sessionId,
          visitorId,
          currentPage: window.location.pathname,
          durationSeconds: elapsedSec
        };

        if (navigator.sendBeacon) {
          const blob = new Blob([JSON.stringify(hbPayload)], { type: 'application/json' });
          navigator.sendBeacon('/api/analytics/track', blob);
        } else {
          fetch('/api/analytics/track', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(hbPayload),
            keepalive: true
          }).catch(() => {});
        }
      }
    }, 10000); // Heartbeat every 10 seconds

    // 7. Flush on visibility change / tab close
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const now = Date.now();
        const elapsedSec = Math.round((now - lastHeartbeatTimeRef.current) / 1000);
        if (elapsedSec > 0 && elapsedSec <= 60) {
          const hbPayload = {
            type: 'heartbeat',
            sessionId,
            visitorId,
            currentPage: window.location.pathname,
            durationSeconds: elapsedSec
          };
          if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(hbPayload)], { type: 'application/json' });
            navigator.sendBeacon('/api/analytics/track', blob);
          }
        }
      } else {
        lastHeartbeatTimeRef.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(heartbeatInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pathname, searchParams]);

  return null;
}
