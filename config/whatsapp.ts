export const WHATSAPP_CONFIG = {
  // Business WhatsApp number (include country code without + or 00)
  companyNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "918300297197",
  displayNumber: "+91 83002 97197",
  agentName: "KidsGenLab Mentor & Support",
  welcomeMessages: [
    "Hey there! Welcome to KidsGenLab! 🚀",
    "I'm here to help you with instant orders, kit recommendations, wealth calculator queries, and parent support. How can I help you today?"
  ],
  packages: [
    {
      id: "solo",
      name: "Starter Saver Kit",
      price: 1199,
      originalPrice: 1999,
      tag: "Save 40%",
      whatsappOrderText: "🛍️ *ORDER REQUEST: Starter Saver Kit*\n💰 Price: ₹1,199 (Original ₹1,999)\n📦 Includes: Physical Activity Book + 7 Superpower Stickers Set\n\nHi KidsGenLab! I would like to order the *Starter Saver Kit (₹1,199)* for my child. Please confirm availability and share payment/delivery steps."
    },
    {
      id: "sibling",
      name: "Little Achiever Kit",
      price: 1499,
      originalPrice: 3999,
      tag: "Most Popular (Save 60%)",
      whatsappOrderText: "🛍️ *ORDER REQUEST: Little Achiever Kit (Most Popular)*\n💰 Price: ₹1,499 (Original ₹3,999)\n📦 Includes: Complete Book + Superpower Stickers + Medal + Certificate\n\nHi KidsGenLab! I want to order the *Little Achiever Kit (₹1,499)* for my child (Ages 7-12). Please confirm my order."
    },
    {
      id: "family",
      name: "Family Champions Bundle",
      price: 2999,
      originalPrice: 5999,
      tag: "VIP Bundle (Save 50%)",
      whatsappOrderText: "🛍️ *ORDER REQUEST: Family Champions Bundle (VIP)*\n💰 Price: ₹2,999 (Original ₹5,999)\n📦 Includes: Full Family Kit + Parent Master Guide & Wealth Blueprint\n\nHi KidsGenLab! I would like to order the *Family Champions Bundle (₹2,999)*. Please share order confirmation."
    }
  ],
  enquiryCategories: [
    {
      id: "order_help",
      label: "🛍️ Direct Order / Buy via WhatsApp",
      message: "Hi KidsGenLab! I want to order a Smart Money Kit for my child. Could you please guide me on how to complete the purchase via WhatsApp?"
    },
    {
      id: "kit_info",
      label: "🎒 Which Kit is Best for My Child? (Ages 7-14)",
      message: "Hi KidsGenLab! I'd like to understand which kit is most suitable for my child's age group and learning level. Could you please recommend the best option?"
    },
    {
      id: "wealth_calc",
      label: "📈 Wealth Goal & SIP Calculator Guidance",
      message: "Hi KidsGenLab! I explored the Wealth Goal Calculator on your website and want guidance on building a compounding SIP savings plan for my child."
    },
    {
      id: "tracking",
      label: "🚚 Track My Order / Delivery Status",
      message: "Hi KidsGenLab! I placed an order recently and would like to track the dispatch/delivery status."
    },
    {
      id: "bulk_partner",
      label: "🤝 Bulk Orders / School & Academy Enquiry",
      message: "Hi KidsGenLab! I am interested in placing a bulk order for schools/academy/corporate gifting. Please share details and partnership pricing."
    },
    {
      id: "general",
      label: "💬 General Question / Speak with Mentor",
      message: "Hi KidsGenLab! I was exploring your website and have a question about the financial intelligence curriculum."
    }
  ],
  defaultWhatsappText: "Hi KidsGenLab! I am visiting your website and have a question regarding orders & learning kits.",
  
  // Webhook Verification Token (For Meta developer setup)
  webhookVerifyToken: "kidsgen_secret_verify_token_2026",

  // Twilio-specific Integration Settings
  useTwilio: false,                 // Default false for direct WhatsApp link
  isSandbox: false,
  twilioNumber: "14155238886",
  twilioSandboxKeyword: "join instant-band"
};


