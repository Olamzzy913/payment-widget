// src/utils/helpers.js
export function validateAmount(amount) {
  return typeof amount === "number" && amount > 0;
}

export function formatCurrency(amount, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function generateTransactionId() {
  return (
    "txn_" + Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
  );
}
