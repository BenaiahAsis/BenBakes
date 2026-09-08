// Messenger pre-fill URL builder
// Usage: buildMessengerUrl('mybakeryph', 'Hi! I want to order...')
export function buildMessengerUrl(username: string, message: string): string {
  return `https://m.me/${username}?text=${encodeURIComponent(message)}`;
}

// Build a pre-filled message for a menu item order
export function buildMenuOrderMessage(itemName: string, price: number): string {
  return `Hi! I'd like to order: ${itemName} (₱${price.toLocaleString()}). Is it available? When can I pick it up / have it delivered?`;
}

// Build a pre-filled message from a custom order form
export function buildCustomOrderMessage(fields: {
  customerName: string;
  occasion: string;
  servings: string;
  flavor: string;
  designNotes: string;
  dateNeeded: string;
}): string {
  const lines = [
    `Hi! I'd like to request a custom order:`,
    `Name: ${fields.customerName}`,
    fields.occasion   ? `Occasion: ${fields.occasion}`       : null,
    fields.servings   ? `Servings: ${fields.servings}`       : null,
    fields.flavor     ? `Flavor: ${fields.flavor}`           : null,
    fields.dateNeeded ? `Date needed: ${fields.dateNeeded}`  : null,
    fields.designNotes ? `Design notes: ${fields.designNotes}` : null,
  ].filter(Boolean);
  return lines.join('\n');
}
