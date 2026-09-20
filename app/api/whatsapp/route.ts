import { NextRequest, NextResponse } from "next/server";
import { WHATSAPP_CONFIG } from "../../../config/whatsapp";
import crypto from "crypto";

// Standard Next.js Route Handler configurations
export const dynamic = 'force-dynamic';

/**
 * Validate incoming Twilio webhook requests using X-Twilio-Signature
 */
function validateTwilioRequest(
  authToken: string,
  signature: string,
  url: string,
  params: Record<string, string>
): boolean {
  const sortedKeys = Object.keys(params).sort();
  let data = url;
  
  for (const key of sortedKeys) {
    data += key + params[key];
  }

  const hash = crypto
    .createHmac("sha1", authToken)
    .update(Buffer.from(data, "utf-8"))
    .digest("base64");

  return hash === signature;
}

/**
 * GET Handler: Verification endpoint for Meta's Webhook configuration
 * Meta sends a GET request to verify the webhook path exists and is secure.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get("hub.mode");
    const token = searchParams.get("hub.verify_token");
    const challenge = searchParams.get("hub.challenge");

    // Retrieve verified token from environment variable or fallback to configuration
    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || WHATSAPP_CONFIG.webhookVerifyToken;

    if (mode && token) {
      if (mode === "subscribe" && token === verifyToken) {
        console.log("WhatsApp Webhook verified successfully!");
        return new NextResponse(challenge, {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        });
      } else {
        console.warn("WhatsApp Webhook verification failed: Token mismatch.");
        return new NextResponse("Forbidden", { status: 403 });
      }
    }

    return new NextResponse("Bad Request", { status: 400 });
  } catch (error) {
    console.error("Error in WhatsApp Webhook GET:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

/**
 * Helper to get a conversational reply from Google's Gemini AI API.
 */
async function getGeminiResponse(userText: string, geminiApiKey: string | undefined): Promise<string> {
  let botResponse = "Thank you for reaching out to KidsGen Lab! 🚀 We have received your message and our mentoring team will reply to you shortly.";

  if (!geminiApiKey) {
    console.warn("Missing GEMINI_API_KEY environment variable. Using fallback message.");
    return botResponse;
  }

  try {
    const systemInstruction = 
      "You are a friendly, encouraging, and brilliant AI mentor for KidsGen Lab (originally KidsGen Lab). " +
      "KidsGen Lab is an educational system teaching kids ages 7-14 real-world entrepreneurship, compound savings, budgeting, and value exchange (bartering). " +
      "Your tone must be cheerful, highly positive, and simple enough for kids, yet professional enough for parents. " +
      "Keep answers concise (maximum 3 short paragraphs). Emojis are encouraged! " +
      "Do NOT use markdown that is unsupported in WhatsApp (use only *bold* like *this* and _italics_ like _this_). " +
      "The key features of our program are: " +
      "1. 3-Jar System: Spend (50%), Save (40%), Give (10%) to build wise money habits. " +
      "2. Physical Activity Books: Real-world, screen-free learning. " +
      "3. Compounding: Saving even small amounts starting at age 7 builds massive wealth by adulthood. " +
      "4. Entrepreneurship Bundle: Guides kids through launching a mini-business (e.g. cookies, art, pets, tech) in 7 days.";

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout to keep webhook fast

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              { text: `System context: ${systemInstruction}\n\nUser message: ${userText}` }
            ]
          }
        ]
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (geminiResponse.ok) {
      const responseData = await geminiResponse.json();
      const textResult = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
      if (textResult) {
        botResponse = textResult.trim();
      }
    } else {
      console.error("Gemini API returned error status:", geminiResponse.status);
    }
  } catch (geminiError) {
    console.error("Error connecting to Gemini API:", geminiError);
  }

  return botResponse;
}

/**
 * POST Handler: Process incoming WhatsApp messages (Supports Meta JSON and Twilio x-www-form-urlencoded)
 */
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") || "";
    const geminiApiKey = process.env.GEMINI_API_KEY;

    // --- CASE A: Handle Twilio Webhook (URL-encoded form data) ---
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();

      // Secure Webhook validation
      const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
      if (twilioAuthToken) {
        const signature = req.headers.get("x-twilio-signature") || "";
        const proto = req.headers.get("x-forwarded-proto") || "https";
        const host = req.headers.get("x-forwarded-host") || req.headers.get("host") || "";
        const url = `${proto}://${host}${req.nextUrl.pathname}${req.nextUrl.search}`;

        const params: Record<string, string> = {};
        formData.forEach((value, key) => {
          if (typeof value === "string") {
            params[key] = value;
          }
        });

        const isValid = validateTwilioRequest(twilioAuthToken, signature, url, params);
        if (!isValid) {
          console.warn("Twilio signature validation failed!");
          return new NextResponse("Forbidden (Invalid Twilio Signature)", { status: 403 });
        }
      } else {
        console.warn("TWILIO_AUTH_TOKEN is not defined in environment variables. Webhook signature verification skipped.");
      }

      const from = (formData.get("From") as string) || "";
      const bodyText = (formData.get("Body") as string) || "";

      console.log(`Received Twilio WhatsApp message from ${from}: "${bodyText}"`);

      // If it is a sandbox join message, welcome them warmly
      let botResponse = "";
      if (bodyText.toLowerCase().trim().startsWith("join ")) {
        botResponse = "Welcome to the *KidsGen Lab* AI Assistant sandbox! 🚀\n\nI'm your AI mentor. You are now connected! Ask me any questions you have about teaching kids entrepreneurship, compound savings, budgeting, or our 3-jar system. How can I help you today?";
      } else {
        // Query Gemini AI for response
        botResponse = await getGeminiResponse(bodyText, geminiApiKey);
      }

      // Return TwiML XML response synchronously to Twilio
      const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${botResponse}</Message>
</Response>`;

      return new NextResponse(twiml, {
        status: 200,
        headers: { "Content-Type": "text/xml; charset=utf-8" },
      });
    }

    // --- CASE B: Handle Meta WhatsApp Webhook (JSON) ---
    const body = await req.json();

    // Verify it is a WhatsApp status update/message event
    if (!body.object || body.object !== "whatsapp_business_account") {
      return NextResponse.json({ error: "Invalid webhook payload object type" }, { status: 400 });
    }

    // Extract entry changes
    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    // If there is no message content (e.g. status updates), acknowledge and skip
    if (!message) {
      return NextResponse.json({ status: "ignored_non_message_event" }, { status: 200 });
    }

    const senderPhoneNumber = message.from; // User's WhatsApp number
    const messageType = message.type;

    if (messageType === "text") {
      const userText = message.text?.body;
      console.log(`Received Meta WhatsApp message from ${senderPhoneNumber}: "${userText}"`);

      // Verify Meta credentials
      const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
      const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

      if (!phoneNumberId || !accessToken) {
        console.error("Missing Meta API configuration (WHATSAPP_PHONE_NUMBER_ID or WHATSAPP_ACCESS_TOKEN)");
        return NextResponse.json({ error: "Server Meta configuration missing" }, { status: 500 });
      }

      // Query Gemini AI
      const botResponse = await getGeminiResponse(userText, geminiApiKey);

      // Send response back via Meta WhatsApp Cloud API
      const metaSendUrl = `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`;
      
      const metaSendPayload = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: senderPhoneNumber,
        type: "text",
        text: {
          preview_url: true,
          body: botResponse
        }
      };

      const metaResponse = await fetch(metaSendUrl, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metaSendPayload),
      });

      if (!metaResponse.ok) {
        const errBody = await metaResponse.text();
        console.error("Meta Graph API send message failed:", errBody);
        return NextResponse.json({ error: "Failed to send WhatsApp message via Meta API" }, { status: 502 });
      }

      console.log(`Successfully replied to ${senderPhoneNumber} via Meta WhatsApp!`);
      return NextResponse.json({ status: "success", replied: true }, { status: 200 });
    }

    return NextResponse.json({ status: "ignored_non_text_message" }, { status: 200 });
  } catch (error) {
    console.error("Error handling WhatsApp Webhook POST:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
