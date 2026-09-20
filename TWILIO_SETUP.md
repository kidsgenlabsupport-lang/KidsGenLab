# 🚀 Setting up your Automated AI WhatsApp Chatbot with Twilio

Using **Twilio** is the fastest and simplest way to automate your WhatsApp floating widget. Twilio provides a **free Sandbox environment** that lets you test instantly with any WhatsApp number without submitting business profiles or verifying phone numbers.

---

## How It Works (TwiML Synchronization)

Unlike standard APIs that require storing authentication keys, setting up SDKs, and making outbound HTTP calls to send replies, our implementation uses **TwiML (Twilio Markup Language)**.
1. A user clicks your floating widget, redirects to WhatsApp, and messages you.
2. Twilio receives the message and triggers a webhook (`POST`) to your Next.js backend (`/api/whatsapp`).
3. Your backend calls Gemini AI to get a reply.
4. Your backend returns a simple, synchronous XML payload:
   ```xml
   <Response>
     <Message>Hi! This is your AI mentor...</Message>
   </Response>
   ```
5. Twilio reads this XML and delivers it to the user. **No API tokens or Twilio environment variables are needed on your server for this to work!**

---

## Step 1: Get Your Twilio Account & Sandbox Number

1. Sign up or log into your [Twilio Console](https://console.twilio.com/).
2. On the Console dashboard, locate the **Account SID** (for references, though not needed for auto-replies).
3. In the left sidebar, navigate to **Messaging** -> **Try it out** -> **Send a WhatsApp Message**.
4. You will see a dedicated **Sandbox Phone Number** (typically `+1 415 523 8886`) and a **Sandbox Keyword** (e.g., `join standard-choice` or `join double-planet`).
5. Scan the QR code or send that exact keyword from your personal WhatsApp to the Sandbox number to link your phone.

---

## Step 2: Configure Your Website Settings

Open your [config/whatsapp.ts](file:///c:/Users/subash/OneDrive/Documents/kidzmoney/config/whatsapp.ts) file and configure it:

```typescript
export const WHATSAPP_CONFIG = {
  // ... other configs
  useTwilio: true,                  // Set to true to switch widget to Twilio
  isSandbox: true,                  // Set to true for Sandbox testing
  twilioNumber: "14155238886",      // Twilio Sandbox phone number (no + or 00)
  twilioSandboxKeyword: "join your-keyword" // Replace with YOUR active keyword from Step 1
};
```

---

## Step 3: Tunnel Localhost & Set Webhook

Twilio needs a public HTTPS URL to reach your Next.js backend.

### 1. Tunnel Localhost using Ngrok
If you are developing locally, run ngrok:
```bash
npx ngrok http 3000
```
Copy the forwarding URL (e.g. `https://1234-abcd.ngrok-free.app`).

### 2. Set Webhook in Twilio Console
1. Go back to the **Twilio Console** -> **Messaging** -> **Settings** -> **WhatsApp Sandbox Settings**.
2. Under **Sandbox Configuration**, find **WHEN A MESSAGE COMES IN**.
3. Paste your ngrok URL with the route suffix: `https://1234-abcd.ngrok-free.app/api/whatsapp`.
4. Ensure the method dropdown next to it is set to **HTTP POST**.
5. Scroll to the bottom and click **Save**.

---

## Step 4: Test & Verify

1. Make sure your local Next.js server is running:
   ```bash
   npm run dev
   ```
2. Make sure your `GEMINI_API_KEY` is present in your `.env.local` file.
3. Open your WhatsApp and message your sandbox (e.g. send "Hey, tell me about the entrepreneurship bundle!").
4. Your Next.js server terminal will log the incoming payload, compile a reply via Gemini, and return the TwiML XML.
5. You will receive the AI's reply instantly on WhatsApp!

---

## Phase 5: Going Live with a Custom Number

When you are ready to use your actual business phone number instead of the sandbox:
1. Purchase/Bring a number to Twilio.
2. In the Twilio Console, go to **Messaging** -> **Senders** -> **WhatsApp Senders** and request approval for your number.
3. Once Twilio and Meta approve the number, configure the webhook URL under your new WhatsApp Sender profile.
4. Update your [config/whatsapp.ts](file:///c:/Users/subash/OneDrive/Documents/kidzmoney/config/whatsapp.ts) file:
   ```typescript
   isSandbox: false,
   twilioNumber: "your_approved_live_number" // Include country code, e.g. "919876543210"
   ```
5. **Secure Your Webhook (Required for Production)**:
   - To prevent third parties from spoofing webhook requests, signature verification is automatically enabled when the `TWILIO_AUTH_TOKEN` environment variable is defined.
   - Go to your Twilio Console dashboard, locate your **Auth Token**, and add it to your hosting platform's environment variables or `.env` file as:
     ```env
     TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
     ```
   - Our webhook receiver will automatically compute and verify HMAC-SHA1 signatures using this token, returning `403 Forbidden` for any non-Twilio requests.
6. Now, visitors clicking the floating widget will open a chat direct to your custom company number without needing the `join` keyword, and auto-replies will work securely and fast.
