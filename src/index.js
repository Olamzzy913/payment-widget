import PaymentWidget from './widget.js';

// For UMD build
if (typeof window !== 'undefined') {
  window.PaymentWidgetSDK = PaymentWidget;
}

// For ES modules
export { PaymentWidget as default };