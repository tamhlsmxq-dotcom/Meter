import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBADqyoayOct3GhXNn-a0r9Q7guwtfu2Gk",
    authDomain: "water-meter-a8b4a.firebaseapp.com",
    projectId: "water-meter-a8b4a",
    storageBucket: "water-meter-a8b4a.appspot.com",
    messagingSenderId: "909213678508",
    appId: "1:909213678508:web:87e3b2aaf2f084aa8d5809"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ຢືນຢັນວ່າ Export ອອກໄປແບບນີ້ (ບໍ່ມີຄຳວ່າ default)
export { auth, db };