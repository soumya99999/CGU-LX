import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCD1vgrm2IKbXuo9XcQwmdMpbk5yMmj10s",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "cgu-lx.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "cgu-lx",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "cgu-lx.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "1012710246199",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:1012710246199:web:acf428cbe88bdab670fcb2",
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || "G-GBV812KFS3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };



