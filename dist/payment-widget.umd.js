(function(global, factory) {
  typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.PaymentWidgetSDK = factory());
})(this, (function() {
  "use strict";
  class PaymentWidget {
    constructor(config) {
      this.config = this.validateConfig(config);
      this.iframe = null;
      this.isInitialized = false;
    }
    validateConfig(config) {
      if (!config.apiKey) {
        throw new Error("API key is required");
      }
      return {
        apiKey: config.apiKey,
        amount: config.amount || 0,
        currency: config.currency || "USD",
        environment: config.environment || "sandbox",
        onSuccess: config.onSuccess || (() => {
        }),
        onError: config.onError || (() => {
        }),
        onLoad: config.onLoad || (() => {
        })
      };
    }
    getIframeUrl() {
      const baseUrls = {
        development: "http://localhost:3001",
        sandbox: "https://your-widget-sandbox.netlify.app",
        production: "https://your-widget-prod.netlify.app"
      };
      const baseUrl = baseUrls[this.config.environment] || baseUrls.sandbox;
      const params = new URLSearchParams({
        apiKey: this.config.apiKey,
        amount: this.config.amount,
        currency: this.config.currency,
        parent: window.location.origin,
        version: "1.0.0"
      });
      return `${baseUrl}?${params}`;
    }
    init(container) {
      if (this.isInitialized) {
        throw new Error("Widget already initialized");
      }
      if (!container || !(container instanceof HTMLElement)) {
        throw new Error("Valid container element is required");
      }
      return new Promise((resolve, reject) => {
        try {
          this.iframe = document.createElement("iframe");
          this.iframe.src = this.getIframeUrl();
          this.iframe.style.cssText = `
          border: none;
          width: 100%;
          min-width: 380px;
          height: 600px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        `;
          this.iframe.onload = () => {
            this.isInitialized = true;
            this.config.onLoad();
            resolve();
          };
          this.iframe.onerror = () => {
            reject(new Error("Failed to load payment widget"));
          };
          container.appendChild(this.iframe);
          this.setupMessageHandling();
        } catch (error) {
          reject(error);
        }
      });
    }
    setupMessageHandling() {
      window.addEventListener("message", this.handleMessage.bind(this));
    }
    handleMessage(event) {
      if (!this.isValidOrigin(event.origin)) return;
      const { type, data } = event.data;
      switch (type) {
        case "PAYMENT_SUCCESS":
          this.config.onSuccess(data);
          break;
        case "PAYMENT_ERROR":
          this.config.onError(data);
          break;
        case "WIDGET_READY":
          console.log("Payment widget ready");
          break;
      }
    }
    isValidOrigin(origin) {
      const allowedOrigins = [
        "http://localhost:3001",
        "https://your-widget-sandbox.netlify.app",
        "https://your-widget-prod.netlify.app"
      ];
      return allowedOrigins.includes(origin);
    }
    destroy() {
      if (this.iframe && this.iframe.parentNode) {
        this.iframe.parentNode.removeChild(this.iframe);
      }
      this.isInitialized = false;
      this.iframe = null;
      window.removeEventListener("message", this.handleMessage);
    }
  }
  if (typeof window !== "undefined") {
    window.PaymentWidgetSDK = PaymentWidget;
  }
  return PaymentWidget;
}));
