import fs from 'fs';
import path from 'path';

export function getRazorpayCredentials() {
  let keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  let keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    // Attempt fallback to read directly from .env.local or .env for hot dev sessions
    const envPaths = [
      path.join(process.cwd(), '.env.local'),
      path.join(process.cwd(), '.env')
    ];

    for (const envPath of envPaths) {
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf-8');
        const lines = content.split('\n');
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('RAZORPAY_KEY_ID=')) {
            keyId = keyId || trimmed.split('=')[1].trim();
          }
          if (trimmed.startsWith('RAZORPAY_KEY_SECRET=')) {
            keySecret = keySecret || trimmed.split('=')[1].trim();
          }
        }
      }
    }
  }

  // Fallbacks with active test keys
  keyId = keyId || 'rzp_test_TWqcqybTpdjice';
  keySecret = keySecret || 'u8i4Xlo32cZse7lcwAm0EhIX';

  return { keyId, keySecret };
}
