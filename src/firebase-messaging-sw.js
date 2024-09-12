// Import scripts necessários do Firebase
importScripts('https://www.gstatic.com/firebasejs/13.0.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/13.0.0/firebase-messaging.js');

// Configuração Firebase
firebase.initializeApp({
    apiKey: "AIzaSyDcjDZAr_UDTgAMXn1qFWubG7C5UUOV0o0",
    authDomain: "hydrosensepushnotif.firebaseapp.com",
projectId: "hydrosensepushnotif",
storageBucket: "hydrosensepushnotif.appspot.com",
messagingSenderId: "155639225962",
appId: "1:155639225962:web:2e031a4d5cad12c03bb413",
measurementId: "G-BKKYV0K709",
vapidKey: 'BCxIm_H5VeG4tiHq2j8HqOk3K28pbxrQRQe-'
});

// Inicializando o Firebase Messaging
const messaging = firebase.messaging();

// Listener para receber mensagens de notificação quando o app estiver em background
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Recebeu uma mensagem em background: ', payload);
  // Personalize a notificação
  const notificationTitle = 'Notificação Firebase';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/firebase-logo.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
