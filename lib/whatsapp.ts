import { getSiteSettingsFromDb } from './db';

export interface WhatsAppConfig {
  autoNotificationEnabled?: boolean;
  provider?: 'meta' | 'twilio' | 'custom_webhook';
  supportNumber?: string;
  defaultMessage?: string;
  meta?: {
    phoneNumberId?: string;
    accessToken?: string;
    businessAccountId?: string;
    templateName?: string;
    languageCode?: string;
  };
  twilio?: {
    accountSid?: string;
    authToken?: string;
    fromNumber?: string;
  };
  customWebhook?: {
    url?: string;
    apiKey?: string;
  };
  messageTemplate?: string;
}

export const DEFAULT_WHATSAPP_TEMPLATE = `🎉 *Congratulations {customer_name}!* 🚀

Your order for *{package_name}* (*#{order_id}*) is *CONFIRMED & PAID*!

💰 *Amount Paid:* ₹{amount}
📦 *Status:* Being packed for priority shipping
🚚 *Delivery:* 3–5 business days across India
🔗 *Track Order:* https://kidsgenlab.in/track?order={order_id}

Need any assistance? Reply to this message or contact support at +{support_number}.

Thank you for choosing us! 🌟`;

// Format Indian/International phone numbers into E.164 digits without '+' or spaces
export function formatWhatsAppPhone(phone: string): string {
  if (!phone) return '';
  let digits = phone.replace(/\D/g, '');
  // If 10 digits (standard Indian mobile), prefix with '91'
  if (digits.length === 10) {
    digits = `91${digits}`;
  } else if (digits.startsWith('0') && digits.length === 11) {
    digits = `91${digits.slice(1)}`;
  }
  return digits;
}

export function compileWhatsAppMessage(
  template: string,
  data: {
    customerName: string;
    orderId: string;
    packageName: string;
    amount: number | string;
    supportNumber: string;
  }
): string {
  let msg = template || DEFAULT_WHATSAPP_TEMPLATE;
  msg = msg.replace(/{customer_name}/g, data.customerName || 'Champion Parent');
  msg = msg.replace(/{order_id}/g, data.orderId || 'ORD-NEW');
  msg = msg.replace(/{package_name}/g, data.packageName || 'Starter Saver Kit');
  msg = msg.replace(/{amount}/g, String(data.amount || '1499'));
  msg = msg.replace(/{price}/g, String(data.amount || '1499'));
  msg = msg.replace(/{support_number}/g, data.supportNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918300297197');
  return msg;
}

export async function sendOrderConfirmationWhatsApp(order: {
  customerName: string;
  phone: string;
  id: string;
  packageName: string;
  price: number | string;
}) {
  try {
    const settings = await getSiteSettingsFromDb();
    const waConfig: WhatsAppConfig = settings?.whatsapp || {};

    if (waConfig.autoNotificationEnabled === false) {
      console.log('[WhatsApp Bot] Auto-notifications are disabled in settings.');
      return { success: false, message: 'WhatsApp auto-notification disabled in settings' };
    }

    const recipientPhone = formatWhatsAppPhone(order.phone);
    if (!recipientPhone) {
      console.warn('[WhatsApp Bot] Invalid recipient phone number:', order.phone);
      return { success: false, message: 'Invalid phone number' };
    }

    const supportNumber = waConfig.supportNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918300297197';
    const messageText = compileWhatsAppMessage(waConfig.messageTemplate || DEFAULT_WHATSAPP_TEMPLATE, {
      customerName: order.customerName,
      orderId: order.id,
      packageName: order.packageName,
      amount: order.price,
      supportNumber
    });

    const provider = waConfig.provider || 'meta';

    // Map package name to image URL
    const host = process.env.NEXT_PUBLIC_APP_URL || 'https://kidsgenlab.in';
    let imageUrl = `${host}/kidsgenlab26.jpeg`; // Default (Little Achiever Kit)
    if (order.packageName.includes('Starter')) imageUrl = `${host}/kidsgenlab25.jpeg`;
    if (order.packageName.includes('Family')) imageUrl = `${host}/kidsgenlab27.jpeg`;

    // 1. Meta WhatsApp Cloud API (Direct Official Meta Graph API)
    if (provider === 'meta' && waConfig.meta?.phoneNumberId && waConfig.meta?.accessToken) {
      const url = `https://graph.facebook.com/v19.0/${waConfig.meta.phoneNumberId}/messages`;
      
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${waConfig.meta.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipientPhone,
          type: 'image',
          image: {
            link: imageUrl,
            caption: messageText
          }
        })
      });

      const responseData = await res.json();
      if (!res.ok) {
        console.error('[WhatsApp Cloud API Error]:', responseData);
        return { success: false, error: responseData };
      }

      console.log(`[WhatsApp Bot] Successfully sent image confirmation to +${recipientPhone}`);
      return { success: true, data: responseData };
    }

    // 2. Twilio WhatsApp Gateway
    if (provider === 'twilio' && waConfig.twilio?.accountSid && waConfig.twilio?.authToken) {
      const url = `https://api.twilio.com/2010-04-01/Accounts/${waConfig.twilio.accountSid}/Messages.json`;
      const auth = Buffer.from(`${waConfig.twilio.accountSid}:${waConfig.twilio.authToken}`).toString('base64');
      const from = waConfig.twilio.fromNumber || 'whatsapp:+14155238886';

      const formData = new URLSearchParams();
      formData.append('From', from.startsWith('whatsapp:') ? from : `whatsapp:${from}`);
      formData.append('To', `whatsapp:+${recipientPhone}`);
      formData.append('Body', messageText);
      formData.append('MediaUrl', imageUrl);

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      const responseData = await res.json();
      if (!res.ok) {
        console.error('[Twilio WhatsApp Error]:', responseData);
        return { success: false, error: responseData };
      }

      return { success: true, data: responseData };
    }

    // 3. Custom Webhook / Aisensy / Wati / Fast2SMS
    if (provider === 'custom_webhook' && waConfig.customWebhook?.url) {
      const res = await fetch(waConfig.customWebhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(waConfig.customWebhook.apiKey ? { 'Authorization': `Bearer ${waConfig.customWebhook.apiKey}` } : {})
        },
        body: JSON.stringify({
          phone: recipientPhone,
          customerName: order.customerName,
          orderId: order.id,
          packageName: order.packageName,
          amount: order.price,
          message: messageText
        })
      });

      const responseData = await res.json().catch(() => ({ status: res.status }));
      return { success: res.ok, data: responseData };
    }

    // 4. Fallback / Test Simulation Mode (No API keys provided yet)
    console.log(`[WhatsApp Bot Simulation] Order #${order.id} verified. WhatsApp message generated for +${recipientPhone}:\n---\n${messageText}\n---`);
    return {
      success: true,
      simulated: true,
      message: 'WhatsApp notification simulated (configure Meta or Twilio API keys in Admin Settings to deliver live SMS/WhatsApp messages)'
    };
  } catch (error: any) {
    console.error('[WhatsApp Bot Send Error]:', error);
    return { success: false, error: error?.message || 'Failed to dispatch WhatsApp message' };
  }
}

export async function sendAdminOrderNotification(order: any) {
  try {
    const settings = await getSiteSettingsFromDb();
    const waConfig: WhatsAppConfig = settings?.whatsapp || {};
    const provider = waConfig.provider || 'meta';

    const adminNumbers = ['918300763488', '919360670147'];

    const messageText = `🚨 *NEW PAID ORDER ALERT* 🚨\n\n*Order ID:* ${order.id || order.razorpay_order_id || 'NEW'}\n*Customer:* ${order.customerName}\n*Phone:* ${order.phone}\n*Kit:* ${order.packageName}\n*Paid:* ₹${order.price}\n\n*Address:*\n${order.address}\n\n*Status:* Ready to Dispatch 🚀`;

    for (const phone of adminNumbers) {
      // 1. Meta API
      if (provider === 'meta' && waConfig.meta?.phoneNumberId && waConfig.meta?.accessToken) {
        const url = `https://graph.facebook.com/v19.0/${waConfig.meta.phoneNumberId}/messages`;
        await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${waConfig.meta.accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: phone,
            type: 'text',
            text: { preview_url: false, body: messageText }
          })
        });
      }
      // 2. Twilio API
      else if (provider === 'twilio' && waConfig.twilio?.accountSid && waConfig.twilio?.authToken) {
        const url = `https://api.twilio.com/2010-04-01/Accounts/${waConfig.twilio.accountSid}/Messages.json`;
        const auth = Buffer.from(`${waConfig.twilio.accountSid}:${waConfig.twilio.authToken}`).toString('base64');
        const from = waConfig.twilio.fromNumber || 'whatsapp:+14155238886';
        const formData = new URLSearchParams();
        formData.append('From', from.startsWith('whatsapp:') ? from : `whatsapp:${from}`);
        formData.append('To', `whatsapp:+${phone}`);
        formData.append('Body', messageText);
        await fetch(url, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData.toString()
        });
      } else {
        console.log(`[Admin Bot Sim] Admin notification for +${phone}:\n${messageText}`);
      }
    }
    return { success: true };
  } catch (err) {
    console.error('[Admin WhatsApp Error]:', err);
    return { success: false };
  }
}
