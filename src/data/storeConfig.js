/**
 * LUMINA Store Configuration
 * Customize store contact details, WhatsApp number, currency, and policies here.
 */
export const STORE_CONFIG = {
  storeName: "LUMINA",
  tagline: "Living & Audio Studio",
  // Change this to your WhatsApp number (international format with country code, no + or spaces)
  whatsappNumber: "923001234567",
  displayPhone: "+92 300 1234567",
  supportEmail: "orders@lumina.studio",
  currency: "$",
  freeShippingThreshold: 150,
  promoCodes: {
    "LUMINA15": { percent: 15, label: "15% off first order" },
    "FLASH20": { percent: 20, label: "20% off flash sale" }
  }
};
