import React, { useState, useEffect, useRef } from "react";
import { messaging, requestPermission } from "./firebase";
import { onMessage } from "firebase/messaging";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const listRef = useRef(null); // Referência para a div da lista

  useEffect(() => {
    // Escuta mensagens no foreground
    const unsubscribe = onMessage(messaging, (payload) => {
      console.debug("📩 Mensagem recebida no foreground:", payload);
      setNotifications((prev) => [
        {
          title: payload.notification.title,
          body: payload.notification.body,
          time: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 4), // Mantém apenas as 5 mais recentes
      ]);
    });

    return () => {
      console.debug("Removendo listener de foreground");
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Escuta mensagens do Service Worker (background)
    const handleServiceWorkerMessage = (event) => {
      if (event.data?.firebaseMessaging) {
        console.log("📩 Mensagem recebida via Service Worker:", event.data.firebaseMessaging);
        setNotifications((prev) => [
          {
            title: event.data.firebaseMessaging.notification.title,
            body: event.data.firebaseMessaging.notification.body,
            time: new Date().toLocaleTimeString(),
          },
          ...prev.slice(0, 4),
        ]);
      }
    };

    navigator.serviceWorker.addEventListener("message", handleServiceWorkerMessage);

    return () => {
      console.debug("Removendo listener de Service Worker");
      navigator.serviceWorker.removeEventListener("message", handleServiceWorkerMessage);
    };
  }, []);

  useEffect(() => {
    // ✅ Faz a lista rolar automaticamente quando uma nova mensagem chega
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
  }, [notifications]);

  return (
    <div style={styles.container}>
      <h2>📩 Notificações</h2>
      <button onClick={requestPermission} style={styles.button}>
        🔔 Ativar
      </button>
      <div ref={listRef} style={styles.list}>
        {notifications.length > 0 ? (
          notifications.map((notif, index) => (
            <div key={index} style={styles.notification}>
              <div style={styles.title}>{notif.title}</div>
              <div style={styles.body}>
                {notif.body}
              </div>
              <div style={styles.time}>{notif.time}</div>
            </div>
          ))
        ) : (
          <p style={styles.empty}>Nenhuma notificação</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "300px",
    margin: "10px auto",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
    textAlign: "center",
    backgroundColor: "#fff",
    fontFamily: "Arial, sans-serif",
  },
  button: {
    padding: "6px 10px",
    fontSize: "12px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "#fff",
    marginBottom: "10px",
  },
  list: {
    maxHeight: "220px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column-reverse",
  },
  notification: {
    padding: "8px",
    marginBottom: "5px",
    borderRadius: "4px",
    backgroundColor: "#f8f9fa",
    textAlign: "left",
    border: "1px solid #ddd",
  },
  title: {
    fontSize: "14px",
    fontWeight: "bold",
    fontFamily: "Georgia",
    textTransform: "uppercase"    
  },
  body: {
    fontSize: "12px",
    fontFamily: "Tahoma ",
    lineHeight: "1.4",
  },
  time: {
    fontSize: "10px",
    color: "#666",
    textAlign: "right"
  },
  empty: {
    fontSize: "12px",
    color: "#888",
  },
};

export default Notifications;
