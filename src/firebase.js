// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB56Cs7kL4vYWRH7NQDTtgFoEa8e9Etkkw",
  authDomain: "cbi-platform.firebaseapp.com",
  projectId: "cbi-platform",
  storageBucket: "cbi-platform.appspot.com",
  messagingSenderId: "511299254320",
  appId: "1:511299254320:web:8dbceb0bce75afb7ac55f5",
};

// 1) Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2) Export Auth
export const auth = getAuth(app);

// 3) Export Firestore
export const db = getFirestore(app);

// 4) Export Storage
export const storage = getStorage(app);
