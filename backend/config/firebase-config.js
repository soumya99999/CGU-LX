// ⚠️ use the below comented code only if you are using on local
import admin from "firebase-admin"; // <-- Fix: Import as default
import firebaseAdminConfig from './firebaseAdminConfig.json' with { type: 'json' };

const serviceAccount = firebaseAdminConfig;

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin; // Export initialized instanceon 

// // ⚠️ below comented code is for rendering on server
// import { initializeApp, cert, getApps } from "firebase-admin/app";
// import { getAuth } from "firebase-admin/auth";
// import fs from "fs";

// const firebaseConfigPath = "/etc/secrets/firebaseAdminConfig.json";

// if (!fs.existsSync(firebaseConfigPath)) {
//   console.error("❌ Firebase config file not found!");
//   process.exit(1);
// }

// const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));

// console.log("🛠️ Firebase Config Loaded:", firebaseConfig.project_id);

// const firebaseAdmin = getApps().length
//   ? getApps()[0]
//   : initializeApp({
//       credential: cert(firebaseConfig),
//     });

// console.log("✅ Firebase initialized successfully");

// // ✅ Export both app and auth instance
// export const auth = getAuth(firebaseAdmin);
// export default firebaseAdmin;
