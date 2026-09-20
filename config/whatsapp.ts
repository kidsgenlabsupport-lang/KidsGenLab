export const WHATSAPP_CONFIG = {
  // Replace this with your actual business WhatsApp number (include country code without + or 00)
  companyNumber: "919876543210", // Default placeholder: Change to your active WhatsApp company number
  agentName: "KidsGen Lab Guide",
  welcomeMessages: [
    "Hey there! Welcome to KidsGen Lab! 🚀",
    "I'm your automated mentor. How can I help you and your child today? Select an option below or type your question:"
  ],
  quickReplies: [
    {
      id: "bundle",
      label: "Tell me about the Kids Entrepreneurship Bundle! 🎒",
      responseText: "Awesome! The Kids Entrepreneurship Bundle teaches children ages 7–14 real-world money, leadership, and startup skills through games and activities! It includes our 3-Jar Money System, active workbooks, and game cards. 📈",
      whatsappText: "Hi KidsGen Lab! I'd love to know more about the Kids Entrepreneurship Bundle. Can you share details and any special discounts?"
    },
    {
      id: "calculator",
      label: "How does the Wealth Calculator work? 📈",
      responseText: "The Wealth Goal Calculator shows how even small monthly savings, compounding at 12%, can set your child up for life. I can connect you to a guide to build a custom SIP savings plan! 💰",
      whatsappText: "Hi KidsGen Lab! I was exploring the Wealth Goal Calculator on your website and want to understand how compound growth can benefit my child."
    },
    {
      id: "partner",
      label: "Partner / Bulk Order Queries 🤝",
      responseText: "Fantastic! We support custom branding and bulk kits for schools, corporate gifts, and academies. Let me connect you to our partnerships team! 🌟",
      whatsappText: "Hi KidsGen Lab! I am interested in partnering or placing a bulk order for your financial literacy kits."
    }
  ],
  defaultWhatsappText: "Hi KidsGen Lab! I was visiting your website and have a question.",
  // Webhook Verification Token (For Meta developer setup)
  webhookVerifyToken: "kidsgen_secret_verify_token_2026",

  // Twilio-specific Integration Settings
  useTwilio: true,                  // Toggle true to use Twilio, false for Meta Cloud API
  isSandbox: false,                 // Set to false for Live production number, true for Sandbox
  twilioNumber: "14155238886",      // Your Live/Sandbox Twilio WhatsApp Number (e.g. 14155238886)
  twilioSandboxKeyword: "join instant-band" // Your Twilio Sandbox join keyword (unused when isSandbox is false)
};

