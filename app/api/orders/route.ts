import { NextResponse } from 'next/server';
import { getAllOrders, insertOrder, updateOrderInDb, deleteOrderFromDb } from '../../../lib/db';
import fs from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'orders.json');

// Background sync to JSON for file backup
async function syncOrdersToJson() {
  try {
    const orders = await getAllOrders();
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dataFilePath, JSON.stringify(orders, null, 2));
  } catch (e) {
    // Silent backup error
  }
}

// GET: Return all orders from SQLite
export async function GET(request: Request) {
  try {
    const orders = await getAllOrders();
    return NextResponse.json({ success: true, orders, total: orders.length });
  } catch (err: any) {
    console.error('Error fetching orders from DB:', err);
    return NextResponse.json({ success: false, message: 'Failed to fetch orders', orders: [] }, { status: 500 });
  }
}

// POST: Add new customer order into SQLite
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customerName,
      email,
      phone,
      flatNo,
      city,
      district,
      state,
      address,
      landmark,
      pincode,
      packageName,
      price,
      notes,
      paymentMethod,
      paymentId,
      status,
      affiliateRef
    } = body;

    if (!customerName || (!phone && !email)) {
      return NextResponse.json({ success: false, message: 'Customer name and phone or email are required' }, { status: 400 });
    }

    const newOrder = await insertOrder({
      customerName: customerName.trim(),
      email: (email || '').trim(),
      phone: (phone || '').trim(),
      flatNo: (flatNo || '').trim(),
      city: (city || '').trim(),
      district: (district || '').trim(),
      state: (state || '').trim(),
      address: (address || '').trim(),
      landmark: (landmark || '').trim(),
      pincode: (pincode || '').trim(),
      packageName: packageName || 'Starter Saver Kit',
      price: Number(price || 1499),
      currency: '₹',
      status: status || 'Completed',
      paymentMethod: paymentMethod || 'UPI / Razorpay',
      paymentId: paymentId || '',
      affiliateRef: affiliateRef || '',
      notes: notes || 'New online customer order.'
    });

    syncOrdersToJson();

    return NextResponse.json({ success: true, order: newOrder, message: 'Order created successfully in database' });
  } catch (error: any) {
    console.error('Error submitting order to DB:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Failed to process order' }, { status: 500 });
  }
}

// PATCH / PUT: Update order status or details in SQLite
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Order ID is required' }, { status: 400 });
    }

    const updated = await updateOrderInDb(id, updates);

    if (!updated) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    syncOrdersToJson();

    return NextResponse.json({ success: true, order: updated, message: 'Order updated successfully' });
  } catch (error: any) {
    console.error('Error updating order in DB:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Failed to update order' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  return PATCH(request);
}

// DELETE: Delete order by ID from SQLite
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Order ID is required' }, { status: 400 });
    }

    const success = await deleteOrderFromDb(id);

    if (!success) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    syncOrdersToJson();

    return NextResponse.json({ success: true, message: 'Order deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting order from DB:', error);
    return NextResponse.json({ success: false, message: error?.message || 'Failed to delete order' }, { status: 500 });
  }
}
