importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js");

const firebaseConfig = {
  apiKey: "AIzaSyBRVKBjgHOC5Qk_WQZfIdWGO4zat18AKps",
  authDomain: "meuteste-f0f34.firebaseapp.com",
  projectId: "meuteste-f0f34",
  storageBucket: "meuteste-f0f34.appspot.com",
  messagingSenderId: "320737972530",
  appId: "1:320737972530:web:abb0be44f64bae5297c72b",
  measurementId: "G-VM058P5G6C"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Escutar mensagens em background
messaging.onBackgroundMessage((payload) => {
  //Enviar mensagem para a aba ativa do React
  self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        firebaseMessaging: payload
      });
    });
  });

  // Exibir a notificação no sistema
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/firebase-logo.png"
  });
});
