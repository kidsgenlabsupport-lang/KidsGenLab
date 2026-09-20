# 🤖 Setting up your Automated AI WhatsApp Chatbot

This guide explains how to connect your **WhatsApp Company Number** to the Next.js backend AI engine using the **Meta (Facebook) Developer Platform** and **Gemini API**.

---

## Architecture Overview

```
                      +-----------------------------+
                      |       Your Website          |
                      |  (WhatsApp Floating Widget) |
                      +--------------+--------------+
                                     |
                                     | Redirects with pre-filled text
                                     v
+-------------------+      Messages  +-----------------------------+
|    User's Phone   | <============> |    Official WhatsApp App    |
|   (On WhatsApp)   |                +--------------+--------------+
+---------+---------+                               |
          |                                         | Direct Chat
          | Sends message                           v
          |                        +-------------------------------+
          +----------------------> |    WhatsApp Business Number   |
                                   +----------------+--------------+
                                                    |
                                                    | Webhook Event (POST)
                                                    v
+-------------------+              +-------------------------------+
|  Next.js Backend  | <============|     Meta Developer Portal     |
| (/api/whatsapp)   |              +-------------------------------+
+---------+---------+
          |
          | Calls API for response
          v
+-------------------+
|  Gemini AI API    |
+-------------------+
```

---

## Phase 1: Setup Meta (Facebook) Developer Account

To automate replies on your company number, you must use the **official WhatsApp Business Cloud API**.

1. Go to the [Meta for Developers Portal](https://developers.facebook.com/) and register as a developer.
2. Click **My Apps** -> **Create App**.
3. Select **Other** -> **Business** (or Choose **Business** directly).
4. Fill in your App Name (e.g., `KidsGen Webhook`) and choose your Business Portfolio if applicable.
5. In the Dashboard under "Add products to your app", scroll to **WhatsApp** and click **Set up**.

---

## Phase 2: Get API Keys & Phone Number ID

Once WhatsApp is added, Meta creates a test phone number for you. To go live, you will add your actual company number inside Meta's WhatsApp settings.

1. Go to **WhatsApp** -> **API Setup** in the left sidebar.
2. Note down the following variables:
   - **Phone Number ID**: A numeric ID representing your active sending number.
   - **Temporary Access Token**: A temporary token valid for 24 hours. (You can generate a permanent System User Token later in your Business Manager Settings).
3. Under **Step 5: Add a phone number**, click to add your actual **Company Phone Number** and verify it via SMS/Voice.

---

## Phase 3: Setup Webhook for Automated AI Replies

Meta needs to know where to send incoming messages. You must hook up your website's API endpoint (`/api/whatsapp`).

### 1. Tunnel Localhost for Testing
Meta requires an `https` URL. During local development, use **ngrok** to create a secure tunnel:
```bash
# 1. Install ngrok via npm or scoop if not installed
npm install -g ngrok

# 2. Run ngrok on Next.js port (usually 3000)
ngrok http 3000
```
Copy the secure forwarding URL (e.g., `https://a1b2-34-56-78-90.ngrok-free.app`).

### 2. Configure Webhook in Meta Portal
1. Go to **WhatsApp** -> **Configuration** in the left sidebar.
2. Under **Webhook**, click **Configure**.
3. **Callback URL**: Enter your ngrok URL + `/api/whatsapp` (e.g., `https://a1b2-34-56-78-90.ngrok-free.app/api/whatsapp`).
4. **Verify Token**: Enter `kidsgen_secret_verify_token_2026` (or whatever you set in `config/whatsapp.ts`).
5. Click **Verify and Save**. Meta will send a GET handshake request to verify your endpoint.
6. Once verified, click **Manage** next to Webhook Fields, and **Subscribe** to the `messages` event.

---

## Phase 4: Configure Environment Variables

Create a file named `.env.local` in the root of your project directory (this file is git-ignored for safety) and fill in your keys:

```env
# Meta WhatsApp API Credentials
WHATSAPP_PHONE_NUMBER_ID=your_actual_phone_number_id_from_meta
WHATSAPP_ACCESS_TOKEN=your_meta_system_user_or_temporary_token
WHATSAPP_VERIFY_TOKEN=kidsgen_secret_verify_token_2026

# Gemini AI Credentials for Auto-Replies
GEMINI_API_KEY=your_gemini_api_key
``` 

*Note: You can get your Gemini API Key directly from the [Google AI Studio](https://aistudio.google.com/).*

---

## Phase 5: Test & Go Live!

1. Open your WhatsApp, and send a standard text (e.g., "Hey, tell me about the entrepreneurship bundle!") to your WhatsApp business test/company number.
2. Check your local server terminal. You will see:
   ```
   Received text message from XXXXXXXXXXX: "Hey, tell me about the entrepreneurship bundle!"
   ```
3. Gemini AI will automatically process this message based on the context of **KidsGen Lab** and send an automated, structured reply back to the user's phone number!
