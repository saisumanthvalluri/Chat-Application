import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA3EudvRUwB2IVhukyHhQW6i-p_77xVCV8",
    authDomain: "chat-together-6fe1e.firebaseapp.com",
    projectId: "chat-together-6fe1e",
    storageBucket: "chat-together-6fe1e.appspot.com",
    messagingSenderId: "701501728950",
    appId: "1:701501728950:web:a1f4de7ad1a2cb43e89e17",
};

// Initialize Firebase
const App = initializeApp(firebaseConfig);
export const auth = getAuth(App);
export const db = getFirestore(App);
export const googleAuthProvider = new GoogleAuthProvider();
