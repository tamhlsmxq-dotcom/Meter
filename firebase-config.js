// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ຂໍ້ມູນການເຊື່ອມຕໍ່ລ່າສຸດ (ເອົາມາຈາກ Firebase ຂອງເຈົ້າ)
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

// ສົ່ງອອກ db ແລະ auth ເພື່ອໃຫ້ໄຟລ໌ອື່ນເອີ້ນໃຊ້ໄດ້
export const db = getFirestore(app);
export const auth = getAuth(app);