import { NextResponse } from 'next/server';
import { db, initDatabase } from '../../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    await initDatabase();
    
    // Fetch all orders
    const result = await db.execute('SELECT * FROM orders ORDER BY created_at DESC');
    const rows = result.rows;
    
    if (rows.length === 0) {
      return new NextResponse('<html><body style="font-family:sans-serif;padding:2rem;"><h2>No orders found in Database.</h2></body></html>', {
        headers: { 'Content-Type': 'text/html' }
      });
    }

    // Get column names from the first row
    const columns = Object.keys(rows[0]);

    // Build the HTML table
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Database Viewer - Orders</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8fafc;
            color: #334155;
          }
          .header-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #e2e8f0;
            margin-bottom: 20px;
            padding-bottom: 10px;
          }
          h1 {
            color: #0f172a;
            font-size: 24px;
            margin: 0;
          }
          .download-btn {
            background-color: #0f172a;
            color: #ffffff;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: 0.2s;
          }
          .download-btn:hover {
            background-color: #334155;
          }
          .table-container {
            overflow-x: auto;
            background: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          table {
            width: 100%;
            border-collapse: collapse;
            text-align: left;
            font-size: 14px;
          }
          th, td {
            padding: 12px 16px;
            border-bottom: 1px solid #e2e8f0;
            white-space: nowrap;
          }
          th {
            background-color: #f1f5f9;
            font-weight: 700;
            color: #475569;
            text-transform: uppercase;
            font-size: 12px;
            letter-spacing: 0.05em;
          }
          .status-badge {
            padding: 4px 8px;
            border-radius: 9999px;
            font-size: 12px;
            font-weight: 600;
            background: #dcfce7;
            color: #166534;
          }
        </style>
      </head>
      <body>
        <div class="header-row">
          <h1>📦 Database Viewer - Orders Table</h1>
          <a href="/api/db/download" class="download-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            Download .db File
          </a>
        </div>
        
        <div class="table-container">
          <table>
            <thead>
              <tr>
                ${columns.map(col => `<th>${col}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${rows.map(row => `
                <tr>
                  ${columns.map(col => {
                    const val = row[col];
                    if (col === 'status') return `<td><span class="status-badge">${val}</span></td>`;
                    return `<td>${val !== null ? val : '-'}</td>`;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' }
    });

  } catch (error: any) {
    return new NextResponse(`<html><body><h2>Error loading database: ${error.message}</h2></body></html>`, {
      headers: { 'Content-Type': 'text/html' },
      status: 500
    });
  }
}
