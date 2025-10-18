class r {
  constructor(e) {
    this.config = this.validateConfig(e), this.iframe = null, this.isInitialized = !1, this.messageHandlers = /* @__PURE__ */ new Map();
  }
  validateConfig(e) {
    if (!e.apiKey)
      throw new Error("API key is required");
    return {
      apiKey: e.apiKey,
      amount: e.amount || 0,
      currency: e.currency || "USD",
      environment: e.environment || "sandbox",
      onSuccess: e.onSuccess || (() => {
      }),
      onError: e.onError || (() => {
      }),
      onLoad: e.onLoad || (() => {
      }),
      onClose: e.onClose || (() => {
      })
    };
  }
  getIframeUrl() {
    const e = {
      development: "http://localhost:3001",
      sandbox: "https://payment-widget-alpha.vercel.app/iframe",
      production: "https://payment-widget-alpha.vercel.app/iframe"
    };
    return `${e[this.config.environment] || e.sandbox}`;
  }
  init(e) {
    if (this.isInitialized)
      throw new Error("Widget already initialized");
    if (!e || !(e instanceof HTMLElement))
      throw new Error("Valid container element is required");
    return new Promise((a, i) => {
      try {
        const t = document.createElement("div");
        t.className = "payment-widget-container", t.style.cssText = `
          position: relative;
          width: 100%;
          max-width: 440px;
          margin: 0 auto;
        `, this.iframe = document.createElement("iframe"), this.iframe.src = this.getIframeUrl(), this.iframe.style.cssText = `
          border: none;
          width: 100%;
          min-width: 380px;
          height: 600px;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          background: white;
        `, this.iframe.title = "Payment Widget", this.iframe.allow = "payment *", this.iframe.onload = () => {
          this.isInitialized = !0, setTimeout(() => {
            this.sendToIframe({
              type: "INIT_CONFIG",
              data: {
                amount: this.config.amount,
                currency: this.config.currency,
                apiKey: this.config.apiKey
              }
            });
          }, 100), this.config.onLoad(), a();
        }, this.iframe.onerror = (s) => {
          console.error("Iframe loading error:", s), i(new Error("Failed to load payment widget"));
        }, t.appendChild(this.iframe), e.appendChild(t), this.setupMessageHandling();
      } catch (t) {
        i(t);
      }
    });
  }
  sendToIframe(e) {
    this.iframe && this.iframe.contentWindow && this.iframe.contentWindow.postMessage(e, this.getIframeUrl());
  }
  setupMessageHandling() {
    this.messageHandler = this.handleMessage.bind(this), window.addEventListener("message", this.messageHandler);
  }
  handleMessage(e) {
    if (this.config.environment === "production" && !this.isValidOrigin(e.origin))
      return;
    const { type: a, data: i } = e.data;
    switch (a) {
      case "PAYMENT_SUCCESS":
        this.config.onSuccess(i);
        break;
      case "PAYMENT_ERROR":
        this.config.onError(i);
        break;
      case "WIDGET_READY":
        console.log("Payment widget ready");
        break;
      case "WIDGET_CLOSE":
        this.config.onClose(i);
        break;
    }
  }
  isValidOrigin(e) {
    return [
      "http://localhost:3001",
      "https://your-app.vercel.app"
    ].includes(e);
  }
  updateConfig(e) {
    this.config = { ...this.config, ...e }, this.isInitialized && this.sendToIframe({
      type: "UPDATE_CONFIG",
      data: e
    });
  }
  destroy() {
    this.iframe && this.iframe.parentNode && this.iframe.parentNode.removeChild(this.iframe), this.isInitialized = !1, this.iframe = null, this.messageHandler && window.removeEventListener("message", this.messageHandler);
  }
}
typeof window < "u" && (window.PaymentWidgetSDK = r);
export {
  r as default
};
