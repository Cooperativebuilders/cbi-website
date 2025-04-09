// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB56Cs7kL4vYWRH7NQDTtgFoEa8e9Etkkw",
  authDomain: "cbi-platform.firebaseapp.com",
  projectId: "cbi-platform",
  storageBucket: "cbi-platform.appspot.com",
  messagingSenderId: "511299254320",
  appId: "1:511299254320:web:8dbceb0bce75afb7ac55f5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
