/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

/* Cloudflare Worker URL */
const WORKER_URL = "https://loreal-beauty-advisor.tiqbal1.workers.dev/";

/* Conversation history */
const messages = [
  {
    role: "system",
    content: `You are a friendly and knowledgeable L'Oréal Beauty Advisor.
You help customers discover L'Oréal products including makeup, skincare, haircare, and fragrances.
You provide personalized routines and recommendations based on skin type, hair type, and concerns.
L'Oréal brands you can reference: L'Oréal Paris, Lancôme, Maybelline, NYX, Garnier, Kiehl's,
Urban Decay, YSL Beauty, Armani Beauty, Vichy, La Roche-Posay, CeraVe, Redken, and Kérastase.
If a question is unrelated to beauty or L'Oréal products, politely reply:
"As your L'Oréal Beauty Advisor, I'm best suited for beauty questions! Is there something beauty-related I can help you with?"`,
  },
];

/* Set initial message */
chatWindow.innerHTML = `<div class="msg ai"><span class="msg-label">L'Oréal Advisor</span>👋 Hello! I'm your L'Oréal Beauty Advisor. Ask me about skincare routines, makeup recommendations, or any of our products!</div>`;

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const text = userInput.value.trim();
  document.getElementById("userQuestion").textContent = `You asked: "${text}"`;
  if (!text) return;

  // Display user message
  chatWindow.innerHTML += `<div class="msg user"><span class="msg-label">You</span>${text}</div>`;
  chatWindow.scrollTop = chatWindow.scrollHeight;

  // Add to conversation history
  messages.push({ role: "user", content: text });

  // Clear input
  userInput.value = "";

  // Show loading
  chatWindow.innerHTML += `<div class="msg ai loading"><span class="msg-label">L'Oréal Advisor</span>...</div>`;
  chatWindow.scrollTop = chatWindow.scrollHeight;

  // When using Cloudflare, you'll need to POST a `messages` array in the body,
  // and handle the response using: data.choices[0].message.content
  const response = await fetch(WORKER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  const data = await response.json();
  const reply = data.choices[0].message.content;

  // Add reply to history
  messages.push({ role: "assistant", content: reply });

  // Replace loading with response
  const loadingEl = chatWindow.querySelector(".loading");
  loadingEl.classList.remove("loading");
  loadingEl.innerHTML = `<span class="msg-label">L'Oréal Advisor</span>${reply}`;
  chatWindow.scrollTop = chatWindow.scrollHeight;
});