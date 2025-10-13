<template>
  <div class="payment-container">
    <div class="payment-widget-card">
      <h2 class="text-xl font-semibold mb-4 text-center">Omavon</h2>
      <h2 class="text-xl font-semibold mb-4 text-center">
        Select Payment Method
      </h2>

      <p class="text-lg mb-6 text-center">
        Amount:
        <span class="font-bold text-indigo-600"
          >{{ config.amount }} {{ config.currency }}</span
        >
      </p>

      <div class="space-y-4">
        <div
          :class="[
            'payment-method-item',
            { selected: selectedMethod === 'card' },
          ]"
          @click="selectMethod('card')"
        >
          <div class="flex items-center">
            <svg
              class="w-6 h-6 mr-3 text-indigo-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              ></path>
            </svg>
            <div>
              <p class="font-medium">Card Payment</p>
              <p class="text-sm text-gray-500">
                Pay with Visa, Mastercard, or Verve
              </p>
            </div>
          </div>
        </div>

        <div
          :class="[
            'payment-method-item',
            { selected: selectedMethod === 'transfer' },
          ]"
          @click="selectMethod('transfer')"
        >
          <div class="flex items-center">
            <svg
              class="w-6 h-6 mr-3 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <p class="font-medium">Bank Transfer</p>
              <p class="text-sm text-gray-500">Pay via secure bank transfer</p>
            </div>
          </div>
        </div>
      </div>

      <button
        @click="handlePayment"
        :disabled="!selectedMethod"
        :class="[
          'w-full py-3 mt-8 rounded-lg font-bold transition duration-150',
          selectedMethod
            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed',
        ]"
      >
        Pay {{ config.amount }} {{ config.currency }} with
        {{ displayMethodName }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

const config = ref({
  amount: 12500.5,
  currency: "NGN",
});

const selectedMethod = ref(null);

const displayMethodName = computed(() => {
  if (selectedMethod.value === "card") return "Card";
  if (selectedMethod.value === "transfer") return "Bank Transfer";
  return "Method";
});

const selectMethod = (method) => {
  selectedMethod.value = method;
};

const handlePayment = () => {
  if (!selectedMethod.value) return;

  const paymentData = {
    id: `txn_${Date.now()}`,
    amount: config.value.amount,
    method: selectedMethod.value,
    currency: config.value.currency,
    timestamp: new Date().toISOString(),
  };

  // Send success message to parent
  window.parent.postMessage(
    {
      type: "PAYMENT_SUCCESS",
      data: paymentData,
    },
    "*"
  );

  console.log("Payment simulation:", paymentData);
};

onMounted(() => {
  console.log("App.vue mounted successfully");

  // Notify parent that widget is ready
  window.parent.postMessage({ type: "WIDGET_READY" }, "*");

  // Listen for configuration updates from parent
  window.addEventListener("message", (event) => {
    console.log("Received message in iframe:", event.data);

    if (event.data.type === "INIT_CONFIG") {
      config.value = { ...config.value, ...event.data.data };
      console.log("Config updated:", config.value);
    }
  });

  // Auto-select card for demo
  setTimeout(() => {
    selectedMethod.value = "card";
  }, 100);
});
</script>

<style scoped>
.payment-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background: #f5f5f5;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.payment-widget-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
  width: 100%;
}

.payment-method-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  background-color: #f9fafb;
}

.payment-method-item:hover {
  border-color: #9da3ed;
  background-color: #eff3fe;
}

.payment-method-item.selected {
  border-color: #4f46e5;
  background-color: #eef2ff;
  box-shadow: 0 1px 3px rgba(79, 70, 229, 0.2);
}

.text-xl {
  font-size: 1.25rem;
}
.font-semibold {
  font-weight: 600;
}
.text-center {
  text-align: center;
}
.mb-4 {
  margin-bottom: 1rem;
}
.mb-6 {
  margin-bottom: 1.5rem;
}
.mt-8 {
  margin-top: 2rem;
}
.space-y-4 > * + * {
  margin-top: 1rem;
}
.text-indigo-600 {
  color: #4f46e5;
}
.text-indigo-500 {
  color: #6366f1;
}
.text-green-500 {
  color: #10b981;
}
.font-bold {
  font-weight: 700;
}
.text-lg {
  font-size: 1.125rem;
}
.text-sm {
  font-size: 0.875rem;
}
.text-gray-500 {
  color: #6b7280;
}
.w-6 {
  width: 1.5rem;
}
.h-6 {
  height: 1.5rem;
}
.mr-3 {
  margin-right: 0.75rem;
}
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.w-full {
  width: 100%;
}
.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}
.rounded-lg {
  border-radius: 0.5rem;
}
.transition {
  transition-property: all;
}
.duration-150 {
  transition-duration: 150ms;
}
.bg-indigo-600 {
  background-color: #4f46e5;
}
.hover\:bg-indigo-700:hover {
  background-color: #4338ca;
}
.text-white {
  color: #ffffff;
}
.bg-gray-300 {
  background-color: #d1d5db;
}
.cursor-not-allowed {
  cursor: not-allowed;
}
</style>
