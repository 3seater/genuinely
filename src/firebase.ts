import { initializeApp } from "firebase/app";
import { getDatabase, Database } from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCP0KOC-GCqe1S314k-vX40WDWC6OPv08o",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "genuinely-29c37.firebaseapp.com",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://genuinely-29c37-default-rtdb.firebaseio.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "genuinely-29c37",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "genuinely-29c37.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "917781258806",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:917781258806:web:372e0b6e180953458fae97",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-XT5PZ1DH7R"
};

// Initialize Firebase
let database: Database | undefined;
try {
  const app = initializeApp(firebaseConfig);
  database = getDatabase(app);
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
}

export { database };

