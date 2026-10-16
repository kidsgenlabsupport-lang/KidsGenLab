import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbFilePath = path.join(dataDir, 'kidzmoney.db').replace(/\\/g, '/');

export const db = createClient({
  url: `file:${dbFilePath}`,
});

let isInitialized = false;

export async function initDatabase() {
  if (isInitialized) return;

  // 1. Create Orders Table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      email TEXT,
      phone TEXT NOT NULL,
      flat_no TEXT,
      address TEXT,
      landmark TEXT,
      city TEXT,
      district TEXT,
      state TEXT,
      pincode TEXT,
      package_name TEXT NOT NULL,
      price REAL NOT NULL,
      currency TEXT DEFAULT '₹',
      status TEXT DEFAULT 'Completed',
      payment_method TEXT DEFAULT 'UPI / Razorpay',
      payment_id TEXT,
      razorpay_order_id TEXT,
      affiliate_ref TEXT,
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // 2. Create Settings Table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      css_style TEXT,
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  try {
    await db.execute('ALTER TABLE settings ADD COLUMN css_style TEXT');
  } catch (e) {
    // Column might already exist
  }

  // 3. Create Affiliate Logs Table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS affiliate_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      affiliate_ref TEXT NOT NULL,
      event_type TEXT NOT NULL,
      order_id TEXT,
      details TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // 4. Create Visitor Sessions Table (Traffic & Duration Tracking)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS visitor_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT UNIQUE NOT NULL,
      visitor_id TEXT NOT NULL,
      ip TEXT,
      user_agent TEXT,
      device_type TEXT DEFAULT 'Desktop',
      browser TEXT DEFAULT 'Other',
      os TEXT DEFAULT 'Other',
      referrer TEXT DEFAULT 'Direct',
      affiliate_ref TEXT,
      landing_page TEXT,
      current_page TEXT,
      page_views INTEGER DEFAULT 1,
      duration_seconds INTEGER DEFAULT 0,
      first_seen TEXT DEFAULT (datetime('now')),
      last_heartbeat TEXT DEFAULT (datetime('now'))
    )
  `);

  // 5. Create Inventory Items Table (Tracking what products we hold)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS inventory_items (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      sku TEXT,
      category TEXT DEFAULT 'Kit',
      current_stock INTEGER DEFAULT 0,
      min_threshold INTEGER DEFAULT 15,
      unit_cost REAL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // 6. Create Inventory Logs Table (Tracking what comes IN and goes OUT)
  await db.execute(`
    CREATE TABLE IF NOT EXISTS inventory_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_id TEXT NOT NULL,
      item_name TEXT NOT NULL,
      type TEXT NOT NULL, -- 'IN' (Received/Restock) or 'OUT' (Dispatched/Order)
      quantity INTEGER NOT NULL,
      reason TEXT NOT NULL, -- 'Customer Order', 'Supplier Restock', 'Manual Adjustment', 'Damage / Sample'
      reference_id TEXT, -- e.g. ORD-1002, PO-992
      performed_by TEXT DEFAULT 'Admin',
      notes TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Seed default product inventory items if none exist
  try {
    const invCountRes = await db.execute('SELECT COUNT(*) as count FROM inventory_items');
    const invCount = Number(invCountRes.rows[0]?.count || 0);

    if (invCount === 0) {
      const defaultProducts = [
        { id: 'PROD-STARTER', name: 'Starter Saver Kit', sku: 'KGL-ST-01', category: 'Smart Money Kit', stock: 120, min: 15, cost: 450 },
        { id: 'PROD-ACHIEVER', name: 'Little Achiever Kit', sku: 'KGL-LA-02', category: 'Smart Money Kit', stock: 85, min: 15, cost: 580 },
        { id: 'PROD-FAMILY', name: 'Family Champions Bundle', sku: 'KGL-FC-03', category: 'Bundle Pack', stock: 45, min: 10, cost: 950 }
      ];

      for (const prod of defaultProducts) {
        await db.execute({
          sql: `INSERT OR IGNORE INTO inventory_items (id, name, sku, category, current_stock, min_threshold, unit_cost) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          args: [prod.id, prod.name, prod.sku, prod.category, prod.stock, prod.min, prod.cost]
        });

        // Insert initial baseline Stock In log
        await db.execute({
          sql: `INSERT INTO inventory_logs (item_id, item_name, type, quantity, reason, reference_id, performed_by, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          args: [prod.id, prod.name, 'IN', prod.stock, 'Initial Opening Stock / Restock Batch', 'BATCH-INIT-01', 'Admin', 'Baseline factory batch received']
        });
      }
    }
  } catch (seedErr) {
    console.warn('[DB] Inventory seed note:', seedErr);
  }

  // 4. Auto-migrate existing JSON data if SQLite tables are empty
  try {
    const existingOrdersCount = await db.execute('SELECT COUNT(*) as count FROM orders');
    const orderCount = Number(existingOrdersCount.rows[0]?.count || 0);

    if (orderCount === 0) {
      const ordersJsonPath = path.join(dataDir, 'orders.json');
      if (fs.existsSync(ordersJsonPath)) {
        const raw = fs.readFileSync(ordersJsonPath, 'utf-8');
        const ordersList = JSON.parse(raw);
        if (Array.isArray(ordersList) && ordersList.length > 0) {
          for (const ord of ordersList) {
            await db.execute({
              sql: `INSERT OR IGNORE INTO orders (
                id, customer_name, email, phone, flat_no, address, landmark, city, district, state, pincode,
                package_name, price, currency, status, payment_method, payment_id, razorpay_order_id, affiliate_ref, notes, created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [
                ord.id || `ORD-${Date.now()}`,
                ord.customerName || ord.customer_name || 'Customer',
                ord.email || '',
                ord.phone || '',
                ord.flatNo || ord.flat_no || '',
                ord.address || '',
                ord.landmark || '',
                ord.city || '',
                ord.district || '',
                ord.state || '',
                ord.pincode || '',
                ord.packageName || ord.package_name || 'Starter Saver Kit',
                Number(ord.price || 1499),
                ord.currency || '₹',
                ord.status || 'Completed',
                ord.paymentMethod || ord.payment_method || 'UPI / Razorpay',
                ord.paymentId || ord.payment_id || '',
                ord.razorpayOrderId || ord.razorpay_order_id || '',
                ord.affiliateRef || ord.affiliate_ref || '',
                ord.notes || '',
                ord.createdAt || ord.created_at || new Date().toISOString(),
                ord.updatedAt || ord.updated_at || new Date().toISOString()
              ]
            });
          }
          console.log(`[DB] Successfully migrated ${ordersList.length} orders from orders.json to SQLite`);
        }
      }
    }

    // Migrate site settings if empty
    const existingSettingsCount = await db.execute('SELECT COUNT(*) as count FROM settings');
    const settingsCount = Number(existingSettingsCount.rows[0]?.count || 0);

    if (settingsCount === 0) {
      const settingsJsonPath = path.join(dataDir, 'site_settings.json');
      if (fs.existsSync(settingsJsonPath)) {
        const raw = fs.readFileSync(settingsJsonPath, 'utf-8');
        const settingsData = JSON.parse(raw);
        await db.execute({
          sql: `INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, ?)`,
          args: ['site_settings', JSON.stringify(settingsData), new Date().toISOString()]
        });
        console.log('[DB] Successfully migrated site_settings.json to SQLite');
      }
    }
  } catch (migErr) {
    console.warn('[DB] Migration note:', migErr);
  }

  isInitialized = true;
}

// Convert DB row to camelCase order object
function formatOrderRow(row: any) {
  return {
    id: row.id,
    customerName: row.customer_name,
    email: row.email,
    phone: row.phone,
    flatNo: row.flat_no,
    address: row.address,
    landmark: row.landmark,
    city: row.city,
    district: row.district,
    state: row.state,
    pincode: row.pincode,
    packageName: row.package_name,
    price: Number(row.price),
    currency: row.currency || '₹',
    status: row.status,
    paymentMethod: row.payment_method,
    paymentId: row.payment_id,
    razorpayOrderId: row.razorpay_order_id,
    affiliateRef: row.affiliate_ref,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

// Get all orders (newest first)
export async function getAllOrders() {
  await initDatabase();
  const res = await db.execute('SELECT * FROM orders ORDER BY created_at DESC');
  return res.rows.map(formatOrderRow);
}

// Get single order by ID
export async function getOrderById(id: string) {
  await initDatabase();
  const res = await db.execute({
    sql: 'SELECT * FROM orders WHERE id = ? LIMIT 1',
    args: [id]
  });
  if (res.rows.length === 0) return null;
  return formatOrderRow(res.rows[0]);
}

// Insert new order
export async function insertOrder(order: {
  id?: string;
  customerName: string;
  email?: string;
  phone: string;
  flatNo?: string;
  address?: string;
  landmark?: string;
  city?: string;
  district?: string;
  state?: string;
  pincode?: string;
  packageName: string;
  price: number;
  currency?: string;
  status?: string;
  paymentMethod?: string;
  paymentId?: string;
  razorpayOrderId?: string;
  affiliateRef?: string;
  notes?: string;
}) {
  await initDatabase();

  let orderId = order.id;
  if (!orderId) {
    const countRes = await db.execute('SELECT COUNT(*) as count FROM orders');
    const count = Number(countRes.rows[0]?.count || 0);
    orderId = `ORD-${1000 + count + 1}`;
  }

  const now = new Date().toISOString();

  await db.execute({
    sql: `INSERT INTO orders (
      id, customer_name, email, phone, flat_no, address, landmark, city, district, state, pincode,
      package_name, price, currency, status, payment_method, payment_id, razorpay_order_id, affiliate_ref, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      orderId,
      order.customerName.trim(),
      (order.email || '').trim(),
      order.phone.trim(),
      (order.flatNo || '').trim(),
      (order.address || '').trim(),
      (order.landmark || '').trim(),
      (order.city || '').trim(),
      (order.district || '').trim(),
      (order.state || '').trim(),
      (order.pincode || '').trim(),
      order.packageName,
      Number(order.price),
      order.currency || '₹',
      order.status || 'Completed',
      order.paymentMethod || 'UPI / Razorpay',
      order.paymentId || '',
      order.razorpayOrderId || '',
      order.affiliateRef || '',
      order.notes || 'Order placed successfully',
      now,
      now
    ]
  });

  // Automatically deduct stock for this order if item is in inventory
  try {
    const pkgName = order.packageName?.trim();
    if (pkgName) {
      const match = await db.execute({
        sql: 'SELECT id, name FROM inventory_items WHERE LOWER(name) = LOWER(?) LIMIT 1',
        args: [pkgName]
      });
      if (match.rows.length > 0) {
        const matchedItem = match.rows[0];
        await recordInventoryLog({
          itemId: String(matchedItem.id),
          type: 'OUT',
          quantity: 1,
          reason: `Customer Order Placed / Dispatched (#${orderId})`,
          referenceId: orderId,
          performedBy: 'System (Order Flow)',
          notes: `Customer: ${order.customerName} (${order.phone || order.email || 'N/A'})`
        });
      }
    }
  } catch (invErr) {
    console.warn('[DB] Auto inventory deduction notice:', invErr);
  }

  return getOrderById(orderId);
}

// Update order
export async function updateOrderInDb(id: string, updates: Partial<{
  customerName: string;
  email: string;
  phone: string;
  flatNo: string;
  address: string;
  landmark: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  packageName: string;
  price: number;
  status: string;
  paymentMethod: string;
  paymentId: string;
  notes: string;
}>) {
  await initDatabase();

  const existing = await getOrderById(id);
  if (!existing) return null;

  const now = new Date().toISOString();

  await db.execute({
    sql: `UPDATE orders SET
      customer_name = ?,
      email = ?,
      phone = ?,
      flat_no = ?,
      address = ?,
      landmark = ?,
      city = ?,
      district = ?,
      state = ?,
      pincode = ?,
      package_name = ?,
      price = ?,
      status = ?,
      payment_method = ?,
      payment_id = ?,
      notes = ?,
      updated_at = ?
    WHERE id = ?`,
    args: [
      updates.customerName !== undefined ? updates.customerName : existing.customerName,
      updates.email !== undefined ? updates.email : existing.email,
      updates.phone !== undefined ? updates.phone : existing.phone,
      updates.flatNo !== undefined ? updates.flatNo : existing.flatNo,
      updates.address !== undefined ? updates.address : existing.address,
      updates.landmark !== undefined ? updates.landmark : existing.landmark,
      updates.city !== undefined ? updates.city : existing.city,
      updates.district !== undefined ? updates.district : existing.district,
      updates.state !== undefined ? updates.state : existing.state,
      updates.pincode !== undefined ? updates.pincode : existing.pincode,
      updates.packageName !== undefined ? updates.packageName : existing.packageName,
      updates.price !== undefined ? Number(updates.price) : existing.price,
      updates.status !== undefined ? updates.status : existing.status,
      updates.paymentMethod !== undefined ? updates.paymentMethod : existing.paymentMethod,
      updates.paymentId !== undefined ? updates.paymentId : existing.paymentId,
      updates.notes !== undefined ? updates.notes : existing.notes,
      now,
      id
    ]
  });

  return getOrderById(id);
}

// Delete order
export async function deleteOrderFromDb(id: string) {
  await initDatabase();
  const existing = await getOrderById(id);
  if (!existing) return false;

  await db.execute({
    sql: 'DELETE FROM orders WHERE id = ?',
    args: [id]
  });
  return true;
}

// Get site settings from SQLite
export async function getSiteSettingsFromDb() {
  await initDatabase();
  const res = await db.execute({
    sql: 'SELECT value FROM settings WHERE key = ? LIMIT 1',
    args: ['site_settings']
  });
  if (res.rows.length === 0) return null;
  try {
    return JSON.parse(String(res.rows[0].value));
  } catch (e) {
    return null;
  }
}

// Save site settings in SQLite
export async function saveSiteSettingsToDb(settings: any) {
  await initDatabase();
  const now = new Date().toISOString();
  await db.execute({
    sql: 'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, ?)',
    args: ['site_settings', JSON.stringify(settings, null, 2), now]
  });
  return true;
}

// -------------------------------------------------------------
// VISITOR TRAFFIC & SESSION DURATION ANALYTICS HELPERS
// -------------------------------------------------------------

export function formatDuration(totalSeconds: number): string {
  if (!totalSeconds || totalSeconds < 1) return '0s';
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins === 0) return `${secs}s`;
  if (mins >= 60) {
    const hours = Math.floor(mins / 60);
    const remainMins = mins % 60;
    return `${hours}h ${remainMins}m`;
  }
  return `${mins}m ${secs}s`;
}

export async function recordVisitorSession(data: {
  sessionId: string;
  visitorId: string;
  ip?: string;
  userAgent?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  referrer?: string;
  affiliateRef?: string;
  landingPage?: string;
  currentPage?: string;
}) {
  await initDatabase();
  const now = new Date().toISOString();

  // Check if session exists
  const existing = await db.execute({
    sql: 'SELECT id, page_views FROM visitor_sessions WHERE session_id = ? LIMIT 1',
    args: [data.sessionId]
  });

  if (existing.rows.length === 0) {
    await db.execute({
      sql: `INSERT INTO visitor_sessions (
        session_id, visitor_id, ip, user_agent, device_type, browser, os,
        referrer, affiliate_ref, landing_page, current_page, page_views,
        duration_seconds, first_seen, last_heartbeat
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?, ?)`,
      args: [
        data.sessionId,
        data.visitorId,
        data.ip || '',
        data.userAgent || '',
        data.deviceType || 'Desktop',
        data.browser || 'Other',
        data.os || 'Other',
        data.referrer || 'Direct',
        data.affiliateRef || '',
        data.landingPage || '/',
        data.currentPage || '/',
        now,
        now
      ]
    });
  } else {
    const currentViews = Number(existing.rows[0].page_views || 1);
    await db.execute({
      sql: `UPDATE visitor_sessions SET
        page_views = ?,
        current_page = ?,
        last_heartbeat = ?,
        affiliate_ref = CASE WHEN (affiliate_ref IS NULL OR affiliate_ref = '') AND ? != '' THEN ? ELSE affiliate_ref END
      WHERE session_id = ?`,
      args: [
        currentViews + 1,
        data.currentPage || '/',
        now,
        data.affiliateRef || '',
        data.affiliateRef || '',
        data.sessionId
      ]
    });
  }
  return true;
}

export async function updateSessionHeartbeat(sessionId: string, addDurationSeconds: number, currentPage?: string) {
  await initDatabase();
  const now = new Date().toISOString();
  const durationToAdd = Math.max(1, Math.min(60, Math.round(addDurationSeconds)));

  await db.execute({
    sql: `UPDATE visitor_sessions SET
      duration_seconds = duration_seconds + ?,
      current_page = COALESCE(?, current_page),
      last_heartbeat = ?
    WHERE session_id = ?`,
    args: [durationToAdd, currentPage || null, now, sessionId]
  });
  return true;
}

export async function getVisitorAnalytics(filterPreset: string = 'all', customDate?: string) {
  await initDatabase();
  const now = new Date();
  const nowMs = now.getTime();
  const twoMinutesAgoMs = nowMs - (2 * 60 * 1000);
  const fiveMinutesAgoMs = nowMs - (5 * 60 * 1000);

  const res = await db.execute('SELECT * FROM visitor_sessions ORDER BY last_heartbeat DESC LIMIT 500');
  const allRows = res.rows;

  let filteredRows = allRows;
  if (filterPreset === 'today') {
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    filteredRows = allRows.filter(r => String(r.first_seen || '').startsWith(todayStr));
  } else if (filterPreset === '7days') {
    const sevenDaysAgo = nowMs - (7 * 24 * 60 * 60 * 1000);
    filteredRows = allRows.filter(r => new Date(String(r.first_seen)).getTime() >= sevenDaysAgo);
  } else if (filterPreset === '30days') {
    const thirtyDaysAgo = nowMs - (30 * 24 * 60 * 60 * 1000);
    filteredRows = allRows.filter(r => new Date(String(r.first_seen)).getTime() >= thirtyDaysAgo);
  } else if (filterPreset === 'custom' && customDate) {
    filteredRows = allRows.filter(r => String(r.first_seen || '').startsWith(customDate));
  }

  const liveCount = allRows.filter(r => {
    const lastActive = new Date(String(r.last_heartbeat)).getTime();
    return lastActive >= twoMinutesAgoMs;
  }).length;

  const totalSessions = filteredRows.length;
  const uniqueVisitorIds = new Set(filteredRows.map(r => String(r.visitor_id)));
  const totalUniqueVisitors = uniqueVisitorIds.size;

  let totalDurationSec = 0;
  let totalPageViews = 0;
  const deviceCounts: Record<string, number> = { Mobile: 0, Desktop: 0, Tablet: 0 };
  const browserCounts: Record<string, number> = {};
  const referrerCounts: Record<string, number> = {};
  const durationTiers = {
    quickBounce: 0, // < 30s
    shortBrowse: 0, // 30s - 2m
    engaged: 0,     // 2m - 5m
    deepRead: 0,    // 5m - 15m
    superFan: 0     // > 15m
  };

  for (const r of filteredRows) {
    const dur = Number(r.duration_seconds || 0);
    totalDurationSec += dur;
    totalPageViews += Number(r.page_views || 1);

    const dev = String(r.device_type || 'Desktop');
    deviceCounts[dev] = (deviceCounts[dev] || 0) + 1;

    const browser = String(r.browser || 'Other');
    browserCounts[browser] = (browserCounts[browser] || 0) + 1;

    let ref = String(r.referrer || 'Direct');
    if (r.affiliate_ref) ref = `Affiliate: @${r.affiliate_ref}`;
    referrerCounts[ref] = (referrerCounts[ref] || 0) + 1;

    if (dur < 30) durationTiers.quickBounce++;
    else if (dur < 120) durationTiers.shortBrowse++;
    else if (dur < 300) durationTiers.engaged++;
    else if (dur < 900) durationTiers.deepRead++;
    else durationTiers.superFan++;
  }

  const avgDurationSec = totalSessions > 0 ? Math.round(totalDurationSec / totalSessions) : 0;

  const recentSessions = allRows.slice(0, 80).map(r => {
    const lastActiveMs = new Date(String(r.last_heartbeat)).getTime();
    const isLive = lastActiveMs >= twoMinutesAgoMs;
    const isRecent = !isLive && lastActiveMs >= fiveMinutesAgoMs;
    const dur = Number(r.duration_seconds || 0);

    return {
      id: r.id,
      sessionId: r.session_id,
      visitorId: r.visitor_id,
      deviceType: r.device_type,
      browser: r.browser,
      os: r.os,
      referrer: r.referrer,
      affiliateRef: r.affiliate_ref,
      landingPage: r.landing_page,
      currentPage: r.current_page,
      pageViews: Number(r.page_views || 1),
      durationSeconds: dur,
      durationFormatted: formatDuration(dur),
      firstSeen: r.first_seen,
      lastHeartbeat: r.last_heartbeat,
      isLive,
      isRecent,
      status: isLive ? 'Online Now' : isRecent ? 'Active recently' : 'Ended'
    };
  });

  return {
    liveCount,
    totalSessions,
    totalUniqueVisitors,
    avgDurationSec,
    avgDurationFormatted: formatDuration(avgDurationSec),
    totalPageViews,
    deviceCounts,
    browserCounts,
    referrerCounts,
    durationTiers,
    recentSessions
  };
}

// ----------------------------------------------------
// INVENTORY & STOCK TRACKING (IN & OUT)
// ----------------------------------------------------

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  currentStock: number;
  minThreshold: number;
  unitCost: number;
  totalIn?: number;
  totalOut?: number;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryLog {
  id: number;
  itemId: string;
  itemName: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  referenceId?: string;
  performedBy: string;
  notes?: string;
  createdAt: string;
}

// Format an inventory row
function formatInventoryItemRow(row: any): InventoryItem {
  return {
    id: String(row.id),
    name: String(row.name),
    sku: String(row.sku || ''),
    category: String(row.category || 'Kit'),
    currentStock: Number(row.current_stock || 0),
    minThreshold: Number(row.min_threshold || 15),
    unitCost: Number(row.unit_cost || 0),
    createdAt: String(row.created_at || ''),
    updatedAt: String(row.updated_at || '')
  };
}

// Get all inventory items with computed in/out statistics
export async function getInventoryOverview() {
  await initDatabase();

  const itemsRes = await db.execute('SELECT * FROM inventory_items ORDER BY name ASC');
  const logsRes = await db.execute('SELECT * FROM inventory_logs ORDER BY id DESC LIMIT 200');

  const logs: InventoryLog[] = logsRes.rows.map((r: any) => ({
    id: Number(r.id),
    itemId: String(r.item_id),
    itemName: String(r.item_name),
    type: (r.type === 'IN' ? 'IN' : 'OUT') as 'IN' | 'OUT',
    quantity: Number(r.quantity || 0),
    reason: String(r.reason || ''),
    referenceId: r.reference_id ? String(r.reference_id) : undefined,
    performedBy: String(r.performed_by || 'Admin'),
    notes: r.notes ? String(r.notes) : '',
    createdAt: String(r.created_at || '')
  }));

  // Aggregate in & out per item
  const itemInMap: Record<string, number> = {};
  const itemOutMap: Record<string, number> = {};

  let totalProductsIn = 0;
  let totalProductsOut = 0;

  for (const log of logs) {
    if (log.type === 'IN') {
      itemInMap[log.itemId] = (itemInMap[log.itemId] || 0) + log.quantity;
      totalProductsIn += log.quantity;
    } else {
      itemOutMap[log.itemId] = (itemOutMap[log.itemId] || 0) + log.quantity;
      totalProductsOut += log.quantity;
    }
  }

  // Also query total all-time in and out
  const inSumRes = await db.execute("SELECT SUM(quantity) as total FROM inventory_logs WHERE type = 'IN'");
  const outSumRes = await db.execute("SELECT SUM(quantity) as total FROM inventory_logs WHERE type = 'OUT'");
  const allTimeIn = Number(inSumRes.rows[0]?.total || totalProductsIn);
  const allTimeOut = Number(outSumRes.rows[0]?.total || totalProductsOut);

  const items: InventoryItem[] = itemsRes.rows.map((r: any) => {
    const item = formatInventoryItemRow(r);
    item.totalIn = itemInMap[item.id] || 0;
    item.totalOut = itemOutMap[item.id] || 0;
    return item;
  });

  const totalCurrentStock = items.reduce((sum, it) => sum + it.currentStock, 0);
  const lowStockItems = items.filter(it => it.currentStock <= it.minThreshold);

  return {
    items,
    logs,
    summary: {
      totalCurrentStock,
      totalProductsIn: allTimeIn,
      totalProductsOut: allTimeOut,
      lowStockCount: lowStockItems.length,
      itemCount: items.length
    }
  };
}

// Add a Stock In or Stock Out Log and adjust current stock
export async function recordInventoryLog(data: {
  itemId: string;
  type: 'IN' | 'OUT';
  quantity: number;
  reason: string;
  referenceId?: string;
  performedBy?: string;
  notes?: string;
}) {
  await initDatabase();

  const { itemId, type, quantity, reason, referenceId, performedBy = 'Admin', notes } = data;

  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  // Find item
  const itemRes = await db.execute({
    sql: 'SELECT * FROM inventory_items WHERE id = ? OR name = ? LIMIT 1',
    args: [itemId, itemId]
  });

  if (itemRes.rows.length === 0) {
    throw new Error(`Inventory item '${itemId}' not found`);
  }

  const item = itemRes.rows[0];
  const currentStock = Number(item.current_stock || 0);
  const realItemId = String(item.id);
  const itemName = String(item.name);

  // New stock computation
  const newStock = type === 'IN' ? currentStock + quantity : Math.max(0, currentStock - quantity);
  const now = new Date().toISOString();

  // 1. Update item stock
  await db.execute({
    sql: 'UPDATE inventory_items SET current_stock = ?, updated_at = ? WHERE id = ?',
    args: [newStock, now, realItemId]
  });

  // 2. Insert log entry
  const logRes = await db.execute({
    sql: `INSERT INTO inventory_logs (item_id, item_name, type, quantity, reason, reference_id, performed_by, notes, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      realItemId,
      itemName,
      type,
      quantity,
      reason || (type === 'IN' ? 'Stock In / Restock' : 'Stock Out / Dispatch'),
      referenceId || '',
      performedBy,
      notes || '',
      now
    ]
  });

  return {
    success: true,
    itemId: realItemId,
    itemName,
    type,
    quantity,
    newStock,
    logId: Number(logRes.lastInsertRowid)
  };
}

// Create or update an inventory item
export async function upsertInventoryItem(item: {
  id?: string;
  name: string;
  sku?: string;
  category?: string;
  currentStock?: number;
  minThreshold?: number;
  unitCost?: number;
}) {
  await initDatabase();

  const now = new Date().toISOString();
  let id = item.id;

  if (!id) {
    id = `PROD-${Date.now().toString(36).toUpperCase()}`;
  }

  // Check if exists
  const existing = await db.execute({
    sql: 'SELECT * FROM inventory_items WHERE id = ? LIMIT 1',
    args: [id]
  });

  if (existing.rows.length > 0) {
    // Update
    await db.execute({
      sql: `UPDATE inventory_items SET
              name = ?,
              sku = ?,
              category = ?,
              current_stock = ?,
              min_threshold = ?,
              unit_cost = ?,
              updated_at = ?
            WHERE id = ?`,
      args: [
        item.name.trim(),
        (item.sku || '').trim(),
        (item.category || 'Kit').trim(),
        Number(item.currentStock ?? existing.rows[0].current_stock),
        Number(item.minThreshold ?? existing.rows[0].min_threshold),
        Number(item.unitCost ?? existing.rows[0].unit_cost),
        now,
        id
      ]
    });
  } else {
    // Insert new item
    const initialStock = Number(item.currentStock || 0);
    await db.execute({
      sql: `INSERT INTO inventory_items (id, name, sku, category, current_stock, min_threshold, unit_cost, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        id,
        item.name.trim(),
        (item.sku || '').trim(),
        (item.category || 'Kit').trim(),
        initialStock,
        Number(item.minThreshold || 15),
        Number(item.unitCost || 0),
        now,
        now
      ]
    });

    // If initial stock was provided > 0, log an initial Stock In
    if (initialStock > 0) {
      await db.execute({
        sql: `INSERT INTO inventory_logs (item_id, item_name, type, quantity, reason, reference_id, performed_by, notes, created_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          id,
          item.name.trim(),
          'IN',
          initialStock,
          'Initial Opening Stock',
          'INIT',
          'Admin',
          'Product catalog added',
          now
        ]
      });
    }
  }

  const updatedRes = await db.execute({
    sql: 'SELECT * FROM inventory_items WHERE id = ? LIMIT 1',
    args: [id]
  });

  return formatInventoryItemRow(updatedRes.rows[0]);
}

// Delete inventory item and related logs
export async function deleteInventoryItem(id: string) {
  await initDatabase();

  await db.execute({
    sql: 'DELETE FROM inventory_logs WHERE item_id = ?',
    args: [id]
  });

  const res = await db.execute({
    sql: 'DELETE FROM inventory_items WHERE id = ?',
    args: [id]
  });

  return { success: res.rowsAffected > 0 };
}

