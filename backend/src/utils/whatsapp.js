// ─────────────────────────────────────────────────────────
// utils/whatsapp.js — Generate WhatsApp Order Message
// Creates a pre-filled wa.me link for order confirmations
// ─────────────────────────────────────────────────────────

/**
 * Generates a WhatsApp deep link with pre-filled order details.
 * When opened, it directly opens WhatsApp with the message ready to send.
 *
 * @param {Object} order - The order object from MongoDB
 * @param {Object} customer - The customer (retailer) user object
 * @returns {string} - Full WhatsApp URL
 */
const generateWhatsAppLink = (order, customer) => {
  const adminNumber = process.env.ADMIN_WHATSAPP || '919403153875';

  // Format each item in the order
  const itemsList = order.items
    .map((item) => `  • ${item.productName} × ${item.quantity} @ ₹${item.priceAtOrder}/${item.unit}`)
    .join('\n');

  // Build the full message
  const message = `🛒 *New Order - ${order.orderNumber}*

👤 *Customer:* ${customer.name}
🏪 *Shop:* ${customer.shopName || 'N/A'}
📱 *Mobile:* ${customer.mobile || 'N/A'}

📦 *Items:*
${itemsList}

💰 *Total Amount:* ₹${order.totalAmount}
💳 *Payment Mode:* ${order.paymentMode === 'cod' ? 'Cash on Delivery' : 'UPI'}

📅 *Order Date:* ${new Date(order.createdAt).toLocaleDateString('en-IN')}

${order.notes ? `📝 *Notes:* ${order.notes}` : ''}

_Please confirm this order. Thank you!_`;

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);

  return `https://wa.me/${adminNumber}?text=${encodedMessage}`;
};

module.exports = { generateWhatsAppLink };
