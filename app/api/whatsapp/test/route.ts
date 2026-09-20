import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationWhatsApp } from '@/lib/whatsapp';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { phone, customerName = 'Champion Parent' } = body;

    if (!phone) {
      return NextResponse.json({ success: false, message: 'Phone number is required' }, { status: 400 });
    }

    const testOrder = {
      id: `TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName,
      phone,
      packageName: 'Starter Saver Kit (Ages 7–14)',
      price: 1199
    };

    const result = await sendOrderConfirmationWhatsApp(testOrder);

    return NextResponse.json({
      success: result.success,
      simulated: result.simulated || false,
      message: result.message || (result.success ? 'WhatsApp message dispatched successfully!' : 'Failed to send message'),
      details: result
    });
  } catch (error: any) {
    console.error('[WhatsApp Test API Error]:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Server error testing WhatsApp' }, { status: 500 });
  }
}
