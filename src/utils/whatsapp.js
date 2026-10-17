import { STORE_CONFIG } from "../data/storeConfig";

/**
 * Format and trigger a WhatsApp message for a single product order
 */
export function getProductWhatsAppUrl(product, options = {}) {
  const { color = product.colors?.[0] || "Standard", quantity = 1 } = options;
  const totalPrice = (product.price * quantity).toFixed(2);
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";

  const lines = [
    `*NEW ORDER INQUIRY - ${STORE_CONFIG.storeName}*`,
    `----------------------------------------`,
    `*Product:* ${product.name}`,
    `*Price:* ${STORE_CONFIG.currency}${product.price.toFixed(2)} each`,
    `*Quantity:* ${quantity}`,
    `*Selected Option / Color:* ${color}`,
    `*Total Item Amount:* ${STORE_CONFIG.currency}${totalPrice}`,
    `----------------------------------------`,
    `*Product Link:* ${currentUrl.includes("/product/") ? currentUrl : window?.location?.origin + "/product/" + product.id}`,
    ``,
    `Salam / Hello! I would like to place an order for this product. Please share payment and delivery details. Thank you!`,
  ];

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${text}`;
}

/**
 * Format and trigger a WhatsApp message for entire shopping cart
 */
export function getCartWhatsAppUrl(items, totals, customerInfo = null) {
  const itemsText = items
    .map((item, idx) => {
      const lineTotal = (item.price * item.quantity).toFixed(2);
      return `${idx + 1}. *${item.name}* (${item.color || "Standard"})\n   Qty: ${item.quantity} x ${STORE_CONFIG.currency}${item.price.toFixed(2)} = ${STORE_CONFIG.currency}${lineTotal}`;
    })
    .join("\n\n");

  const lines = [
    `*NEW CART ORDER - ${STORE_CONFIG.storeName}*`,
    `----------------------------------------`,
    itemsText,
    `----------------------------------------`,
    `*Subtotal:* ${STORE_CONFIG.currency}${totals.subtotal.toFixed(2)}`,
    totals.discount > 0 ? `*Discount:* -${STORE_CONFIG.currency}${totals.discount.toFixed(2)}` : null,
    `*Shipping:* ${totals.shipping === 0 ? "FREE" : `${STORE_CONFIG.currency}${totals.shipping.toFixed(2)}`}`,
    `*Grand Total:* ${STORE_CONFIG.currency}${totals.total.toFixed(2)}`,
  ];

  if (customerInfo) {
    lines.push(
      `----------------------------------------`,
      `*CUSTOMER DETAILS:*`,
      `*Name:* ${customerInfo.name || "N/A"}`,
      `*Phone:* ${customerInfo.phone || "N/A"}`,
      `*Address:* ${customerInfo.address || "N/A"}, ${customerInfo.city || ""}`,
      customerInfo.notes ? `*Special Notes:* ${customerInfo.notes}` : null
    );
  }

  lines.push(
    ``,
    `Salam / Hello! I would like to confirm this order via WhatsApp. Please process my request. Thank you!`
  );

  const cleanLines = lines.filter((line) => line !== null);
  const text = encodeURIComponent(cleanLines.join("\n"));
  return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${text}`;
}

/**
 * Open WhatsApp URL in a new tab safely
 */
export function openWhatsApp(url) {
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
