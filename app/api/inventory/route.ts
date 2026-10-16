import { NextResponse } from 'next/server';
import {
  getInventoryOverview,
  recordInventoryLog,
  upsertInventoryItem,
  deleteInventoryItem
} from '@/lib/db';

// GET: Fetch inventory products, in/out logs, and summary KPIs
export async function GET() {
  try {
    const data = await getInventoryOverview();
    return NextResponse.json({ success: true, ...data });
  } catch (error: any) {
    console.error('Error fetching inventory overview:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to load inventory' },
      { status: 500 }
    );
  }
}

// POST: Record Stock In / Stock Out log OR Upsert inventory item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action = 'log', ...payload } = body;

    if (action === 'log') {
      const { itemId, type, quantity, reason, referenceId, performedBy, notes } = payload;
      if (!itemId || !type || !quantity) {
        return NextResponse.json(
          { success: false, message: 'Item ID, type (IN/OUT), and quantity are required' },
          { status: 400 }
        );
      }

      const result = await recordInventoryLog({
        itemId,
        type: type === 'IN' ? 'IN' : 'OUT',
        quantity: Math.abs(Number(quantity)),
        reason: reason || (type === 'IN' ? 'Stock In Received' : 'Stock Out Dispatched'),
        referenceId,
        performedBy: performedBy || 'Admin',
        notes
      });

      return NextResponse.json({
        success: true,
        message: `Successfully logged ${type === 'IN' ? 'incoming' : 'outgoing'} ${quantity} unit(s)`,
        result
      });
    }

    if (action === 'item') {
      const { id, name, sku, category, currentStock, minThreshold, unitCost } = payload;
      if (!name) {
        return NextResponse.json(
          { success: false, message: 'Product name is required' },
          { status: 400 }
        );
      }

      const item = await upsertInventoryItem({
        id,
        name,
        sku,
        category,
        currentStock: Number(currentStock ?? 0),
        minThreshold: Number(minThreshold ?? 15),
        unitCost: Number(unitCost ?? 0)
      });

      return NextResponse.json({
        success: true,
        message: 'Product inventory item saved successfully',
        item
      });
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action specified' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error processing inventory request:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to process inventory update' },
      { status: 500 }
    );
  }
}

// DELETE: Delete an inventory item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Item ID is required' },
        { status: 400 }
      );
    }

    const res = await deleteInventoryItem(id);
    return NextResponse.json({ success: true, message: 'Item deleted successfully', ...res });
  } catch (error: any) {
    console.error('Error deleting inventory item:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Failed to delete item' },
      { status: 500 }
    );
  }
}
