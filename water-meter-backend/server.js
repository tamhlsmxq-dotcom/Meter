require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import Firebase Admin SDK (v12+ Modular Syntax)
const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');

// Initialize Firebase Admin
const serviceAccount = require('./serviceAccountKey.json');
initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();
const auth = getAuth();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API Endpoint: Create User
app.post('/api/users', async (req, res) => {
    const { fullName, email, password, role, permissions } = req.body;

    if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'ຂໍ້ມູນບໍ່ຄົບຖ້ວນ (Missing required fields)' });
    }

    try {
        // 1. Create User in Firebase Auth
        const userRecord = await auth.createUser({
            email: email,
            password: password,
            displayName: fullName,
        });

        // 2. Store user metadata in Firestore
        await db.collection('users').doc(userRecord.uid).set({
            authUid: userRecord.uid,
            fullName,
            email,
            role,
            permissions,
            status: 'active',
            createdAt: FieldValue.serverTimestamp()
        });

        res.status(201).json({ 
            message: 'ສ້າງຜູ້ໃຊ້ສຳເລັດ', 
            uid: userRecord.uid 
        });

    } catch (error) {
        console.error('Error creating user:', error);
        if (error.code === 'auth/email-already-exists') {
            return res.status(409).json({ error: 'ອີເມວນີ້ມີໃນລະບົບແລ້ວ (Email already exists)' });
        }
        res.status(500).json({ error: 'ເກີດຂໍ້ຜິດພາດພາຍໃນເຊີບເວີ (Internal server error)' });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Water Meter Backend API ແລ່ນຢູ່ Port ${PORT}`);
});