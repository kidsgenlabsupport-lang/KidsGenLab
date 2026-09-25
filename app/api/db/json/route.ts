import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const filePath = path.join(process.cwd(), 'data', 'orders.json');
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'orders.json not found' }, { status: 404 });
  }

  const fileData = fs.readFileSync(filePath, 'utf-8');
  return new NextResponse(fileData, {
    headers: { 'Content-Type': 'application/json' }
  });
}
