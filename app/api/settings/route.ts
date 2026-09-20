import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSiteSettingsFromDb, saveSiteSettingsToDb } from '../../../lib/db';

const settingsFilePath = path.join(process.cwd(), 'data', 'site_settings.json');

const defaultSettings = {
  general: {
    siteName: "KidsGen Lab",
    supportEmail: "support@kidsgenlab.com",
    announcementEnabled: true,
    announcementText: "🎉 SALE IS LIVE: Save up to 60% on all Smart Kids Kits today!"
  },
  payment: {
    gateway: "razorpay",
    isLiveMode: false,
    razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YourKeyHere",
    razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET || "",
    currency: "INR",
    autoCapture: true
  },
  whatsapp: {
    supportNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210",
    defaultMessage: "Hi KidsGen Lab! I am interested in ordering the Smart Money kit for my child. Please help!",
    autoNotificationEnabled: true,
    twilioEnabled: false
  },
  affiliate: {
    defaultCommissionRate: 15
  },
  pricing: {
    solo: {
      name: "Starter Saver Kit",
      price: 1199,
      originalPrice: 1999,
      tagline: "The Irresistible Sweet Spot (Save 40%!)"
    },
    starter: {
      name: "Little Achiever Kit",
      price: 1499,
      originalPrice: 3999,
      tagline: "Most Popular for ages 7-12 (Save 60%!)"
    },
    sibling: {
      name: "Little Achiever Kit",
      price: 1499,
      originalPrice: 3999,
      tagline: "Most Popular for ages 7-12 (Save 60%!)"
    },
    family: {
      name: "Family Champions Bundle",
      price: 2999,
      originalPrice: 5999,
      tagline: "Complete All-In-One Legacy Edition (Save 50%!)"
    }
  },
  theme: {
    primaryColor: "#0d9488",
    accentColor: "#f59e0b",
    headerBg: "#ffffff",
    bannerBg: "#000000",
    bannerTextColor: "#ffffff",
    buttonBg: "#000000",
    buttonTextColor: "#ffffff",
    borderRadius: "16px",
    customCss: "/* Custom Database CSS rules */\n.checkout-submit-btn {\n  /* Custom shadow or gradient from DB */\n  transition: all 0.2s ease;\n}\n"
  }
};

async function readSettings() {
  try {
    // 1. Try reading from SQLite Database first
    const dbSettings = await getSiteSettingsFromDb();
    if (dbSettings) {
      return { ...defaultSettings, ...dbSettings };
    }

    // 2. Fallback to JSON file
    if (fs.existsSync(settingsFilePath)) {
      const data = fs.readFileSync(settingsFilePath, 'utf-8');
      const parsed = JSON.parse(data);
      await saveSiteSettingsToDb(parsed); // seed DB
      return { ...defaultSettings, ...parsed };
    }

    // 3. Fallback to defaults
    await saveSiteSettingsToDb(defaultSettings);
    return defaultSettings;
  } catch (err) {
    console.error('Error reading settings:', err);
    return defaultSettings;
  }
}

async function writeSettings(settings: any) {
  try {
    // 1. Save to SQLite Database
    await saveSiteSettingsToDb(settings);

    // 2. Save backup to JSON file
    const dir = path.dirname(settingsFilePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));

    return true;
  } catch (err) {
    console.error('Error saving settings:', err);
    return false;
  }
}

// GET /api/settings
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pin = searchParams.get('pin');
  const settings = await readSettings();

  // If authenticated admin PIN provided, return full settings including keys
  if (pin === '9803') {
    return NextResponse.json({ success: true, settings });
  }

  // Public version (masks sensitive secrets)
  const publicSettings = {
    ...settings,
    payment: {
      ...settings.payment,
      razorpayKeySecret: settings.payment.razorpayKeySecret ? '••••••••••••' : ''
    }
  };

  return NextResponse.json({ success: true, settings: publicSettings });
}

// POST /api/settings
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin, settings } = body;

    if (pin !== '9803') {
      return NextResponse.json({ success: false, message: 'Unauthorized: Invalid Admin PIN' }, { status: 401 });
    }

    if (!settings) {
      return NextResponse.json({ success: false, message: 'Settings payload required' }, { status: 400 });
    }

    const current = await readSettings();
    const updated = {
      ...current,
      ...settings,
      payment: {
        ...current.payment,
        ...(settings.payment || {}),
        // Preserve secret if masked bullets passed
        razorpayKeySecret: settings.payment?.razorpayKeySecret && !settings.payment.razorpayKeySecret.includes('••••')
          ? settings.payment.razorpayKeySecret
          : current.payment.razorpayKeySecret
      }
    };

    const saved = await writeSettings(updated);
    if (!saved) {
      return NextResponse.json({ success: false, message: 'Failed to save settings' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Settings updated successfully in SQLite database!', settings: updated });
  } catch (err: any) {
    console.error('Settings API update error:', err);
    return NextResponse.json({ success: false, message: err.message || 'Internal error' }, { status: 500 });
  }
}
