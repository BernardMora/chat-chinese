import { initializeApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";

// THESE CREDENTIALS ARE SAFE FOR PUBLIC
const firebaseConfig = {
  apiKey: "AIzaSyDZScg1pcAgzk8dEl7-3HtOXBYQTqrXQp8",
  authDomain: "chat-chinese.firebaseapp.com",
  projectId: "chat-chinese",
  storageBucket: "chat-chinese.firebasestorage.app",
  messagingSenderId: "587476427757",
  appId: "1:587476427757:web:d8d2673ae81df7893cfde4",
  measurementId: "G-SDT2K1BBMP",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set persistence to local
setPersistence(auth, browserLocalPersistence);

export { app, auth };
