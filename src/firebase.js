import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyBRVKBjgHOC5Qk_WQZfIdWGO4zat18AKps",
  authDomain: "meuteste-f0f34.firebaseapp.com",
  projectId: "meuteste-f0f34",
  storageBucket: "meuteste-f0f34.appspot.com",
  messagingSenderId: "320737972530",
  appId: "1:320737972530:web:abb0be44f64bae5297c72b",
  measurementId: "G-VM058P5G6C"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// ✅ Tenta solicitar a permissão repetidamente
export function requestPermission() {
  console.log("🚀 Solicitando permissão...");

  function askPermission() {
    Notification.requestPermission().then(permission => {
      console.log("Permissão:", permission);

      if (permission === "granted") {
        console.log("✅ Permissão concedida!");
        registerServiceWorker();
      } else {
        console.log("⛔ Permissão negada! Tentando novamente em 5 segundos...");
        setTimeout(askPermission, 5000); // Tenta novamente após 5 segundos
      }
    });
  }

  askPermission(); // Inicia o loop de solicitação
}

// ✅ Registra o Service Worker
function registerServiceWorker() {
  navigator.serviceWorker.register("/firebase-messaging-sw.js")
    .then(registration => {
      console.log("✅ Service Worker registrado!", registration);
      
      // ✅ Obtém o token do Firebase Cloud Messaging
      return getToken(messaging, { vapidKey: "BEgaYIicRPTRVRuGgHReDU3f6ebeLYTamPhA4URWdSbZcvl6OUkDH0WkR_b-VTyElo-G6o2XzCEaEonJKeiFmM8" });
    })
    .then(token => {
      console.log("✅ Token FCM:", token);
    })
    .catch(error => {
      console.error("❌ Erro ao registrar Service Worker:", error);
    });
}