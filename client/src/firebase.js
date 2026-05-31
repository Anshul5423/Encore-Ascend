// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUNRRGrmbwHpQXA4giL5DlAOa2fXnFo6o",
  authDomain: "encore-ascend.firebaseapp.com",
  projectId: "encore-ascend",
  storageBucket: "encore-ascend.firebasestorage.app",
  messagingSenderId: "66602609082",
  appId: "1:66602609082:web:5800d91ef8d0d068791583",
  measurementId: "G-C572HK37L9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

if (typeof window !== "undefined") {
  getAnalytics(app);
}