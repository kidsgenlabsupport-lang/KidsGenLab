import { NextRequest, NextResponse } from 'next/server';
import { getVisitorAnalytics } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const preset = searchParams.get('preset') || 'all';
    const date = searchParams.get('date') || undefined;

    const analytics = await getVisitorAnalytics(preset, date);

    return NextResponse.json(analytics, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  } catch (error) {
    console.error('[Analytics Stats API Error]:', error);
    return NextResponse.json({ error: 'Failed to retrieve analytics data' }, { status: 500 });
  }
}
