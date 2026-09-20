import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getRazorpayCredentials } from '../../../lib/razorpay';

export async function POST(request: Request) {
  try {
    const { keyId, keySecret } = getRazorpayCredentials();

    if (!keyId || !keySecret) {
      console.error('Razorpay credentials missing in environment variables');
      return NextResponse.json(
        { success: false, message: 'Payment gateway configuration error' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { amount, currency = 'INR', receipt, notes } = body;

    if (!amount || isNaN(Number(amount))) {
      return NextResponse.json(
        { success: false, message: 'A valid amount is required' },
        { status: 400 }
      );
    }

    // Convert to paise if amount is passed in INR (e.g. 1199 -> 119900)
    const amountInPaise = body.isPaise ? Math.round(Number(amount)) : Math.round(Number(amount) * 100);

    // Minimum amount check: 100 paise (1 unit)
    if (amountInPaise < 100) {
      return NextResponse.json(
        { success: false, message: 'Amount must be at least 1 (100 paise)' },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: amountInPaise,
      currency: currency.toUpperCase(),
      receipt: receipt || `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      notes: notes || { source: 'KidsGenLab Website' },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      success: true,
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId,
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);

    if (error?.statusCode === 401 || error?.error?.code === 'BAD_REQUEST_ERROR') {
      return NextResponse.json(
        {
          success: false,
          code: 'AUTH_FAILED',
          message: 'Razorpay Authentication Failed: The API Key ID or Key Secret in .env.local is invalid or expired. Please generate a fresh Test Key from Razorpay Dashboard (Settings → API Keys).'
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
