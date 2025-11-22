// Import Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCqmlZx4eaCQqx6_ULPouFdNTlU7B-tv2c",
  authDomain: "attendaceprojecttestfirebase.firebaseapp.com",
  projectId: "attendaceprojecttestfirebase",
  storageBucket: "attendaceprojecttestfirebase.firebasestorage.app",
  messagingSenderId: "922638476782",
  appId: "1:922638476782:web:eb2d6a9849adc97c34daff",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Services
export const db = getFirestore(app);
export const auth = getAuth(app);
