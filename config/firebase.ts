// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCc1uT1n3ncahYuhUo9MkrEHEOHNt00fWg",
  authDomain: "expense-tracker-6ab0a.firebaseapp.com",
  projectId: "expense-tracker-6ab0a",
  storageBucket: "expense-tracker-6ab0a.firebasestorage.app",
  messagingSenderId: "526669105377",
  appId: "1:526669105377:web:ee57a926af145fe8034fa0",
  measurementId: "G-2NL3MRGFSW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// auth
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// db
export const firestore = getFirestore(app);

