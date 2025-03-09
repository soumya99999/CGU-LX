// config/firebase-config.js
import admin from "firebase-admin"; // <-- Fix: Import as default
import firebaseAdminConfig from './firebaseAdminConfig.json' with { type: 'json' };

const serviceAccount = firebaseAdminConfig;

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin; // Export initialized instance