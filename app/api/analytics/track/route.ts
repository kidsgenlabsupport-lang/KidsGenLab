import { NextRequest, NextResponse } from 'next/server';
import { recordVisitorSession, updateSessionHeartbeat } from '@/lib/db';

function parseUserAgent(ua: string) {
  let deviceType = 'Desktop';
  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
    deviceType = 'Mobile';
  }

  let browser = 'Other';
  if (/edg/i.test(ua)) browser = 'Edge';
  else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/safari/i.test(ua)) browser = 'Safari';

  let os = 'Other';
  if (/windows/i.test(ua)) os = 'Windows';
  else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/macintosh|mac os x/i.test(ua)) os = 'macOS';
  else if (/linux/i.test(ua)) os = 'Linux';

  return { deviceType, browser, os };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      type = 'pageview',
      sessionId,
      visitorId,
      currentPage = '/',
      landingPage = '/',
      referrer = 'Direct',
      affiliateRef = '',
      durationSeconds = 10
    } = body;

    if (!sessionId || !visitorId) {
      return NextResponse.json({ error: 'Missing session or visitor ID' }, { status: 400 });
    }

    const ua = req.headers.get('user-agent') || '';
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '127.0.0.1';
    const { deviceType, browser, os } = parseUserAgent(ua);

    if (type === 'heartbeat') {
      await updateSessionHeartbeat(sessionId, durationSeconds, currentPage);
    } else {
      // Page view or session start
      await recordVisitorSession({
        sessionId,
        visitorId,
        ip,
        userAgent: ua.slice(0, 250),
        deviceType,
        browser,
        os,
        referrer: referrer || 'Direct',
        affiliateRef,
        landingPage,
        currentPage
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Analytics Track API Error]:', error);
    return NextResponse.json({ error: 'Failed to record analytics' }, { status: 500 });
  }
}
