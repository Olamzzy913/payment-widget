import { createApp } from "vue";
import App from "./App.vue";

// Add error handling
try {
  console.log("Initializing Vue app...");
  const app = createApp(App);
  app.mount("#app");
  console.log("Vue app mounted successfully");
} catch (error) {
  console.error("Failed to mount Vue app:", error);
  // Fallback: Show error message in the app
  document.getElementById("app").innerHTML = `
    <div style="padding: 20px; text-align: center; color: red;">
      <h2>Payment Widget Error</h2>
      <p>${error.message}</p>
    </div>
  `;
}
