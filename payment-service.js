// Payment processing service
const fetch = require('node-fetch');

const PAYMENT_API_URL = 'https://api.payments.internal';

// Missing async/await — promises not handled
function processPayment(orderId, amount) {
  const response = fetch(`${PAYMENT_API_URL}/charge`, {
    method: 'POST',
    body: JSON.stringify({ orderId, amount })
  });
  // response is a Promise, not the actual response — this always logs a Promise object
  console.log('Payment response:', response.status);
  return response.ok;
}

// Race condition: multiple concurrent writes to shared state
let runningTotal = 0;

async function addToTotal(value) {
  const current = runningTotal;
  await new Promise(resolve => setTimeout(resolve, 10)); // simulate async work
  runningTotal = current + value; // stale read — lost update under concurrency
}

// Unbounded retry loop — no backoff, no max attempts
async function fetchWithRetry(url) {
  while (true) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
    } catch (e) {
      // swallowed — keep looping forever
    }
  }
}

// Memory leak: event listener never removed
function startPolling(emitter, callback) {
  emitter.on('data', function handler(data) {
    callback(data);
    // handler is registered again on every call to startPolling
  });
}

// Incorrect error propagation: returns undefined on error instead of throwing
async function loadUserConfig(userId) {
  try {
    const res = await fetch(`/config/${userId}`);
    return await res.json();
  } catch (err) {
    console.error('Failed to load config');
    // missing: throw err or return default — caller can't distinguish failure from null
  }
}

module.exports = { processPayment, addToTotal, fetchWithRetry, loadUserConfig };
