// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import{ getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBl89M9yYz7YNKCi5NZSoscpEPfPSJ8_Yc",
  authDomain: "vakil-setu-sign-up.firebaseapp.com",
  projectId: "vakil-setu-sign-up",
  storageBucket: "vakil-setu-sign-up.firebasestorage.app",
  messagingSenderId: "302277833761",
  appId: "1:302277833761:web:8b90a1026015574766df60",
  measurementId: "G-NEHCVBJV1R"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
const analytics = getAnalytics(app);
