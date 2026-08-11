require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');

// Import Firebase Admin SDK (v12+ Modular Syntax)
const { initializeApp, cert, applicationDefault } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { validateCreateUserPayload } = require('./validation');

// Use the local key during development and the platform identity in production.
const serviceAccountPath = './serviceAccountKey.json';
const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
initializeApp({
    credential: serviceAccountJson
        ? cert(JSON.parse(serviceAccountJson))
        : fs.existsSync(serviceAccountPath)
            ? cert(require(serviceAccountPath))
            : applicationDefault()
});

const db = getFirestore();
const auth = getAuth();
const app = express();

// Middleware
const allowedOrigins = (process.env.FRONTEND_ORIGIN || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Origin not allowed by CORS'));
    }
}));
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'water-meter-backend' });
});

async function requireAdmin(req, res, next) {
    const authorization = req.get('Authorization') || '';
    const token = authorization.startsWith('Bearer ')
        ? authorization.slice('Bearer '.length)
        : '';

    if (!token) {
        return res.status(401).json({ error: 'ບໍ່ພົບ Firebase ID token' });
    }

    try {
        const decodedToken = await auth.verifyIdToken(token);
        const userSnapshot = await db.collection('users').doc(decodedToken.uid).get();
        const userData = userSnapshot.exists ? userSnapshot.data() : {};
        const isAdmin = userData.role === 'system_manager' ||
            userData.role === 'super_admin';

        if (!isAdmin) {
            return res.status(403).json({ error: 'ບັນຊີນີ້ບໍ່ມີສິດ Admin' });
        }

        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(401).json({ error: 'Firebase ID token ບໍ່ຖືກຕ້ອງ ຫຼື ໝົດອາຍຸ' });
    }
}

// API Endpoint: Create User
app.post('/api/users', requireAdmin, async (req, res) => {
    const { fullName, email, password, role, permissions } = req.body;

    const validationError = validateCreateUserPayload(req.body);
    if (validationError) {
        return res.status(400).json({ error: validationError });
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
if (require.main === module) {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`🚀 Water Meter Backend API ແລ່ນຢູ່ Port ${PORT}`);
    });
}

module.exports = app;