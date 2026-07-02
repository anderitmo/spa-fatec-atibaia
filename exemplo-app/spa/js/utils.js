export function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL"
  }).format(Number(value) || 0);
}

export function renderIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

export function getCartCount() {
  if (!window.CartStorage) {
    return 0;
  }

  return window.CartStorage.getCart().reduce((total, item) => total + (Number(item.quantidade) || 0), 0);
}
