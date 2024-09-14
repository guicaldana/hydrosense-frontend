// Import scripts necessários do Firebase
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.1.0/firebase-messaging-compat.js');

// Configuração Firebase
firebase.initializeApp({
    apiKey: "AIzaSyDcjDZAr_UDTgAMXn1qFWubG7C5UUOV0o0",
    authDomain: "hydrosensepushnotif.firebaseapp.com",
    projectId: "hydrosensepushnotif",
    storageBucket: "hydrosensepushnotif.appspot.com",
    messagingSenderId: "155639225962",
    appId: "1:155639225962:web:2e031a4d5cad12c03bb413",
    measurementId: "G-BKKYV0K709",
    vapidKey: 'BETN8-mn3D2v5jqUq5AAGSB7m2PfL7yPEK6vaFXuuLJ_hCFSS624qFl-LRcoPzSEpbAD479VBgJQegmJKJE31qw'
});

// Inicializando o Firebase Messaging
const messaging = firebase.messaging();

// Listener para receber mensagens de notificação quando o app estiver em background
// messaging.onBackgroundMessage(function(payload) {
//   console.log('[firebase-messaging-sw.js] Recebeu uma mensagem em background: ', payload);
//   // Personalize a notificação
//   const notificationTitle = 'Notificação Firebase';
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: '/firebase-logo.png'
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
