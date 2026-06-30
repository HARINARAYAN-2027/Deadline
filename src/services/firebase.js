// src/services/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyALT938go9aJ2qAQlspFyYff47MDk2WVFs",
  authDomain: "deadlineai-944a6.firebaseapp.com",
  projectId: "deadlineai-944a6",
  storageBucket: "deadlineai-944a6.firebasestorage.app",
  messagingSenderId: "731973289253",
  appId: "1:731973289253:web:0a6d9f283644d0bc8106cc"
};

// Initialize Firebase with dynamic boundary check
export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
