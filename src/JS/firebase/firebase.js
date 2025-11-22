import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

import { firebaseConfig } from "./firebase.config.js";

// init
const app = initializeApp(firebaseConfig);

// services
export const db = getFirestore(app);
export const auth = getAuth(app);
