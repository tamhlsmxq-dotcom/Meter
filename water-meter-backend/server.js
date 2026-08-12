require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import Firebase Admin SDK (v12+ Modular Syntax)
const { initializeApp, cert, applicationDefault } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { validateCreateUserPayload } = require('./validation');
const { isAdminRole, isAllowedUserRole } = require('./authz');

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

async function logAuditEvent({ actorUid, actorEmail, action, resourceType, resourceId, details = {} }) {
    try {
        await db.collection('audit_logs').add({
            actorUid: actorUid || null,
            actorEmail: actorEmail || null,
            action: action || 'unknown_action',
            resourceType: resourceType || null,
            resourceId: resourceId || null,
            details: details || {},
            createdAt: FieldValue.serverTimestamp(),
        });
    } catch (error) {
        console.error('Audit logging failed:', error);
    }
}

const allowedOrigins = (process.env.FRONTEND_ORIGIN || '')
    .split(',')
    .map(origin => origin.trim())
    .filter(Boolean);

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'ຫຼາຍຄຳຮ້ອງຂໍຫຼາຍເກີນທີ່ຈະຍອມຮັບທີ່ມີການຈໍາກັດໄວ້' }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'ເກີນຈຳກັດການສະແກນເຂົ້າລະບົບເວລານີ້' }
});

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https:'],
            scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.tailwindcss.com', 'https://www.gstatic.com'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com', 'https://cdn.jsdelivr.net'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com', 'data:'],
            connectSrc: ["'self'", 'http://localhost:5000', 'https://*.firebaseio.com', 'https://*.googleapis.com'],
            frameAncestors: ["'none'"],
        }
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    noSniff: true,
    xssFilter: true,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
}));
app.use(generalLimiter);
app.use(cors({
    origin(origin, callback) {
        if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Origin not allowed by CORS'));
    }
}));
app.use(express.json({ limit: '1mb' }));
app.use((req, res, next) => {
    const now = new Date().toISOString();
    const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    console.log(`[${now}] ${req.method} ${req.originalUrl} from ${ip}`);
    next();
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'water-meter-backend' });
});

app.post('/api/login', authLimiter, async (req, res) => {
    const { email, password } = req.body || {};

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password.trim()) {
        return res.status(400).json({ error: 'ຂໍ້ມູນເຂົ້າລະບົບບໍ່ຄົບຖ້ວນ' });
    }

    return res.status(501).json({ error: 'ການເຂົ້າລະບົບໃຫ້ດຳເນີນໂດຍ Firebase Auth ຕົວເຊື່ອມຕໍ່ຂອງ client ເທົ່ານັ້ນ' });
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
        const isAdmin = isAdminRole(userData.role);

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

app.get('/api/users', requireAdmin, async (req, res) => {
    try {
        const snapshot = await db.collection('users').get();
        const users = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        res.json({ users: users.map(({ password, ...rest }) => rest) });
    } catch (error) {
        console.error('Error listing users:', error);
        res.status(500).json({ error: 'ເກີດຂໍ້ຜິດພາດໃນການດຶງຂໍ້ມູນຜູ້ໃຊ້' });
    }
});

// API Endpoint: Create User
app.post('/api/users', requireAdmin, async (req, res) => {
    const { fullName, email, password, role, permissions } = req.body;

    const validationError = validateCreateUserPayload(req.body);
    if (validationError) {
        return res.status(400).json({ error: validationError });
    }

    if (!isAllowedUserRole(role)) {
        return res.status(400).json({ error: 'ບໍ່ຮັບອະນຸຍາດໃຫ້ໃຊ້ role ນີ້' });
    }

    try {
        const userRecord = await auth.createUser({
            email: email,
            password: password,
            displayName: fullName,
        });

        await db.collection('users').doc(userRecord.uid).set({
            authUid: userRecord.uid,
            fullName,
            email,
            role,
            permissions: permissions || {},
            status: 'active',
            createdAt: FieldValue.serverTimestamp()
        });

        await logAuditEvent({
            actorUid: req.user.uid,
            actorEmail: req.user.email || null,
            action: 'create_user',
            resourceType: 'users',
            resourceId: userRecord.uid,
            details: { fullName, email, role }
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

app.put('/api/users/:userId', requireAdmin, async (req, res) => {
    const { userId } = req.params;
    const { fullName, role, permissions, status } = req.body;

    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
        return res.status(400).json({ error: 'ຊື່ຜູ້ໃຊ້ບໍ່ສາມາດຫວ່າງໄດ້' });
    }

    if (role && !isAllowedUserRole(role)) {
        return res.status(400).json({ error: 'ບໍ່ຮັບອະນຸຍາດໃຫ້ໃຊ້ role ນີ້' });
    }

    try {
        const payload = {
            fullName: fullName.trim(),
            ...(role ? { role } : {}),
            ...(permissions ? { permissions } : {}),
            ...(status ? { status } : {}),
            updatedAt: FieldValue.serverTimestamp(),
        };

        await db.collection('users').doc(userId).update(payload);
        await logAuditEvent({
            actorUid: req.user.uid,
            actorEmail: req.user.email || null,
            action: 'update_user',
            resourceType: 'users',
            resourceId: userId,
            details: payload
        });
        res.json({ message: 'ອັບເດດຂໍ້ມູນຜູ້ໃຊ້ສຳເລັດ' });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'ເກີດຂໍ້ຜິດພາດໃນການອັບເດດຜູ້ໃຊ້' });
    }
});

app.patch('/api/users/:userId/status', requireAdmin, async (req, res) => {
    const { userId } = req.params;
    const { status } = req.body;

    if (status !== 'active' && status !== 'suspended') {
        return res.status(400).json({ error: 'ຄ່າ status ບໍ່ຖືກຕ້ອງ' });
    }

    try {
        await db.collection('users').doc(userId).update({
            status,
            updatedAt: FieldValue.serverTimestamp(),
        });
        await logAuditEvent({
            actorUid: req.user.uid,
            actorEmail: req.user.email || null,
            action: 'toggle_user_status',
            resourceType: 'users',
            resourceId: userId,
            details: { status }
        });
        res.json({ message: 'ປ່ຽນສະຖານະຜູ້ໃຊ້ສຳເລັດ' });
    } catch (error) {
        console.error('Error updating user status:', error);
        res.status(500).json({ error: 'ເກີດຂໍ້ຜິດພາດໃນການປ່ຽນສະຖານະ' });
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