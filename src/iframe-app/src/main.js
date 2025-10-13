import { createApp } from 'vue';
import App from './App.vue';

// Production-ready initialization
function initApp() {
  try {
    const app = createApp(App);
    app.mount('#app');
    
    // Notify parent if in iframe
    if (window.parent !== window) {
      setTimeout(() => {
        window.parent.postMessage({ type: "WIDGET_READY" }, "*");
      }, 100);
    }
  } catch (error) {
    console.error('Failed to initialize payment widget:', error);
    document.getElementById('app').innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h3>Payment Widget</h3>
        <p>Unable to load payment options. Please refresh.</p>
      </div>
    `;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}