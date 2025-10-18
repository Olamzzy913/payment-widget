class PaymentWidget {
  constructor(config) {
    this.config = this.validateConfig(config);
    this.iframe = null;
    this.isInitialized = false;
    this.messageHandlers = new Map();
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
      onSuccess: config.onSuccess || (() => {}),
      onError: config.onError || (() => {}),
      onLoad: config.onLoad || (() => {}),
      onClose: config.onClose || (() => {}),
    };
  }

getIframeUrl() {
  const baseUrls = {
    development: "http://localhost:3001",
    sandbox: "https://payment-widget-alpha.vercel.app/iframe",
    production: "https://payment-widget-alpha.vercel.app/iframe"
  };

  const baseUrl = baseUrls[this.config.environment] || baseUrls.sandbox;
  return `${baseUrl}`;
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
        // Create container styles
        const widgetContainer = document.createElement("div");
        widgetContainer.className = "payment-widget-container";
        widgetContainer.style.cssText = `
          position: relative;
          width: 100%;
          max-width: 440px;
          margin: 0 auto;
        `;

        // Create iframe
        this.iframe = document.createElement("iframe");
        this.iframe.src = this.getIframeUrl();
        this.iframe.style.cssText = `
          border: none;
          width: 100%;
          min-width: 380px;
          height: 600px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          background: white;
        `;
        this.iframe.title = "Payment Widget";
        this.iframe.allow = "payment *";

        this.iframe.onload = () => {
          this.isInitialized = true;

          // Send initial configuration to iframe
          setTimeout(() => {
            this.sendToIframe({
              type: "INIT_CONFIG",
              data: {
                amount: this.config.amount,
                currency: this.config.currency,
                apiKey: this.config.apiKey,
              },
            });
          }, 100);

          this.config.onLoad();
          resolve();
        };

        this.iframe.onerror = (error) => {
          console.error("Iframe loading error:", error);
          reject(new Error("Failed to load payment widget"));
        };

        widgetContainer.appendChild(this.iframe);
        container.appendChild(widgetContainer);
        this.setupMessageHandling();
      } catch (error) {
        reject(error);
      }
    });
  }

  sendToIframe(message) {
    if (this.iframe && this.iframe.contentWindow) {
      this.iframe.contentWindow.postMessage(message, this.getIframeUrl());
    }
  }

  setupMessageHandling() {
    this.messageHandler = this.handleMessage.bind(this);
    window.addEventListener("message", this.messageHandler);
  }

  handleMessage(event) {
    // For development, allow all origins. In production, validate specific origins.
    if (
      this.config.environment === "production" &&
      !this.isValidOrigin(event.origin)
    ) {
      return;
    }

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
      case "WIDGET_CLOSE":
        this.config.onClose(data);
        break;
    }
  }

  isValidOrigin(origin) {
    const allowedOrigins = [
      "http://localhost:3001",
      "https://your-app.vercel.app",
    ];
    return allowedOrigins.includes(origin);
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    if (this.isInitialized) {
      this.sendToIframe({
        type: "UPDATE_CONFIG",
        data: newConfig,
      });
    }
  }

  destroy() {
    if (this.iframe && this.iframe.parentNode) {
      this.iframe.parentNode.removeChild(this.iframe);
    }
    this.isInitialized = false;
    this.iframe = null;
    if (this.messageHandler) {
      window.removeEventListener("message", this.messageHandler);
    }
  }
}

export default PaymentWidget;
