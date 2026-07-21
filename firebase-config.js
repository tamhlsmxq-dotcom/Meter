// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBAdQyoayOct3GhXNn-a0r9Q7guwtfu2Gk",
  authDomain: "water-meter-a8b4a.firebaseapp.com",
  databaseURL: "https://water-meter-a8b4a-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "water-meter-a8b4a",
  storageBucket: "water-meter-a8b4a.firebasestorage.app",
  messagingSenderId: "909213678508",
  appId: "1:909213678508:web:87e3b2aaf2f084aa8d5809",
  measurementId: "G-0T56V174MH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);