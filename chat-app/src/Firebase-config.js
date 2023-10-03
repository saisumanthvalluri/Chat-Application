import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAeMiKqGnR6lRwqmdt67_OBgIUM2HOXtxo",
    authDomain: "chating-rooms-99929.firebaseapp.com",
    projectId: "chating-rooms-99929",
    storageBucket: "chating-rooms-99929.appspot.com",
    messagingSenderId: "839374315817",
    appId: "1:839374315817:web:b4aaff7f8d7f42ca6b1738",
};

// Initialize Firebase
const App = initializeApp(firebaseConfig);
export const auth = getAuth(App);
export const db = getFirestore(App);
export const googleAuthProvider = new GoogleAuthProvider();
export const storage = getStorage(App);
