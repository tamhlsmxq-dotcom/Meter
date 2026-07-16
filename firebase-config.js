import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, doc, deleteDoc, updateDoc, limit, getDoc, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBAdQyoayOct3GhXNn-a0r9Q7guwtfu2Gk",
    authDomain: "water-meter-a8b4a.firebaseapp.com",
    projectId: "water-meter-a8b4a",
    storageBucket: "water-meter-a8b4a.firebasestorage.app",
    messagingSenderId: "909213678508",
    appId: "1:909213678508:web:87e3b2aaf2f084aa8d5809"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signInWithEmailAndPassword, signOut, onAuthStateChanged, collection, addDoc, getDocs, query, where, orderBy, doc, deleteDoc, updateDoc, limit, getDoc, increment };
