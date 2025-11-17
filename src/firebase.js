// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBZPlic1JAA24ZkdIr-VzpM8f9xtpD5yQg",
    authDomain: "meno-made.firebaseapp.com",
    projectId: "meno-made",
    storageBucket: "meno-made.firebasestorage.app",
    messagingSenderId: "587345983366",
    appId: "1:587345983366:web:8fd72b440995283b145e07",
    measurementId: "G-G1DLX5JYL1"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
