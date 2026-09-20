import { NextResponse } from 'next/server';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { getRazorpayCredentials } from '../../../lib/razorpay';
import { insertOrder, getAllOrders } from '../../../lib/db';
import { sendOrderConfirmationWhatsApp } from '../../../lib/whatsapp';

const dataFilePath = path.join(process.cwd(), 'data', 'orders.json');

async function syncOrdersToJson() {
  try {
    const orders = await getAllOrders();
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dataFilePath, JSON.stringify(orders, null, 2));
  } catch (e) {}
}

async function savePaidOrderToDatabase(orderData: any) {
  try {
    const fullAddress = [
      orderData.flatNo ? `Flat/Door: ${orderData.flatNo}` : '',
      orderData.address || '',
      orderData.district ? `Dist: ${orderData.district}` : '',
      orderData.city || '',
      orderData.state || '',
      orderData.pincode ? `PIN: ${orderData.pincode}` : ''
    ].filter(Boolean).join(', ');

    const newOrder = await insertOrder({
      customerName: (orderData.customerName || 'Online Customer').trim(),
      email: (orderData.email || '').trim(),
      phone: (orderData.phone || '').trim(),
      flatNo: (orderData.flatNo || '').trim(),
      address: (orderData.address || fullAddress).trim(),
      landmark: (orderData.landmark || '').trim(),
      city: (orderData.city || '').trim(),
      district: (orderData.district || '').trim(),
      state: (orderData.state || '').trim(),
      pincode: (orderData.pincode || '').trim(),
      packageName: orderData.packageName || 'Starter Saver Kit',
      price: Number(orderData.price || 1499),
      currency: 'INR',
      status: 'Completed',
      paymentMethod: 'Razorpay UPI/Online',
      paymentId: orderData.razorpay_payment_id || '',
      razorpayOrderId: orderData.razorpay_order_id || '',
      affiliateRef: orderData.affiliateRef || '',
      notes: `Verified Razorpay payment (Payment ID: ${orderData.razorpay_payment_id}, Order: ${orderData.razorpay_order_id})`
    });

    syncOrdersToJson();

    return newOrder;
  } catch (err) {
    console.error('Error saving paid order to SQLite database:', err);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const { keySecret } = getRazorpayCredentials();

    if (!keySecret) {
      console.error('Razorpay secret missing in environment variables');
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderDetails,
    } = body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Missing payment verification parameters' },
        { status: 400 }
      );
    }

    // HMAC-SHA256(order_id + "|" + payment_id, KEY_SECRET)
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      console.error('Razorpay signature mismatch:', {
        expected: expectedSignature,
        received: razorpay_signature,
      });
      return NextResponse.json(
        { success: false, message: 'Invalid payment signature' },
        { status: 400 }
      );
    }

    // Save paid order to SQLite database
    let savedOrder = null;
    if (orderDetails) {
      savedOrder = await savePaidOrderToDatabase({
        ...orderDetails,
        razorpay_order_id,
        razorpay_payment_id,
      });

      // Trigger Automated WhatsApp Confirmation Bot
      if (savedOrder && savedOrder.phone) {
        sendOrderConfirmationWhatsApp(savedOrder).catch(waErr => {
          console.error('[WhatsApp Bot Notification Error]:', waErr);
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and saved to database successfully',
      payment_id: razorpay_payment_id,
      order_id: razorpay_order_id,
      order: savedOrder,
    });
  } catch (error: any) {
    console.error('Error verifying Razorpay payment:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
