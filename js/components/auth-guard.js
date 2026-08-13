// =========================================================================
// 🛡️ Auth Guard - Middleware ກວດສອບສິດທິການເຂົ້າເຖິງລະບົບ
// =========================================================================

import { auth, db } from '../../firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const REDIRECT_KEY = 'meter_redirect_guard';
let redirectLock = false;

function safeRedirect(url) {
    if (redirectLock) return;

    const target = new URL(url, window.location.href).toString();
    const currentTarget = sessionStorage.getItem(REDIRECT_KEY);
    if (currentTarget === target) return;

    redirectLock = true;
    sessionStorage.setItem(REDIRECT_KEY, target);
    window.location.replace(url);
}

window.addEventListener('pageshow', () => {
    redirectLock = false;
    const currentPath = window.location.pathname.toLowerCase();
    if (currentPath.includes('login.html')) {
        sessionStorage.removeItem(REDIRECT_KEY);
    }
});

// =========================================================================
// 🌟 1. ກວດສອບເບື້ອງຕົ້ນແບບໄວ (Instant Check) ຜ່ານ localStorage 🌟
// (ຊ່ວຍປ້ອງກັນບໍ່ໃຫ້ໜ້າເວັບກະຕຸກ ຫຼື ໂຫຼດຊ້າຕອນເປີດເຂົ້າມາໃໝ່)
// =========================================================================
const currentPath = window.location.pathname.toLowerCase();
const base = currentPath.includes('/pages/') ? '../..' : '.';
const localUserStr = localStorage.getItem('wm_user_data');

if (!localUserStr && !currentPath.includes('login.html')) {
    // ຖ້າບໍ່ມີ Session ໃນເຄື່ອງ ແລະ ບໍ່ແມ່ນໜ້າ Login ໃຫ້ເຕະອອກທັນທີ!
    safeRedirect(`${base}/login.html`);
}

// =========================================================================
// 🌟 2. ກວດສອບຄວາມປອດໄພຂັ້ນສູງກັບ Database (Background Security Check) 🌟
// =========================================================================
onAuthStateChanged(auth, async (user) => {
    
    // ກໍລະນີຢູ່ໜ້າ Login ແຕ່ເຄີຍ Login ໄວ້ແລ້ວ ໃຫ້ເຕະເຂົ້າໜ້າ Dashboard
    if (currentPath.includes('login.html')) {
        if (user) safeRedirect(`${base}/index.html`);
        return;
    }

    // ກໍລະນີ Firebase ກວດພົບວ່າ Token ໝົດອາຍຸ ຫຼື ບໍ່ມີ User
    if (!user) {
        localStorage.removeItem('wm_user_data');
        safeRedirect(`${base}/login.html`);
        return;
    }

    try {
        // ດຶງຂໍ້ມູນສິດທິຫຼ້າສຸດຈາກ Database ສະເໝີ
        const serverUserRef = doc(db, 'users', user.uid);
        const serverUserSnap = await getDoc(serverUserRef);

        if (!serverUserSnap.exists()) {
            localStorage.removeItem('wm_user_data');
            sessionStorage.removeItem(REDIRECT_KEY);
            await signOut(auth);
            safeRedirect(`${base}/login.html`);
            return;
        }

        const serverUser = serverUserSnap.data();
        
        // 🔄 ບັນທຶກລົງ localStorage ໃໝ່ ເພື່ອໃຫ້ໄຟລ໌ sidebar.js ເອົາໄປແຕ້ມເມນູໄດ້ຖືກຕ້ອງ 🔄
        const freshUserData = {
            uid: user.uid,
            email: user.email,
            fullName: serverUser.fullName || user.email.split('@')[0],
            role: serverUser.role,
            permissions: serverUser.permissions || {}
        };
        localStorage.setItem('wm_user_data', JSON.stringify(freshUserData));

        // 🛡️ ກວດສອບ Role ແລະ Permissions
        const role = String(serverUser.role || '').trim();
        const allowedAdminRoles = new Set(['system_manager', 'super_admin']);

        // Admin ໃຫ້ຜ່ານໄດ້ທຸກໜ້າ
        if (allowedAdminRoles.has(role)) {
            return; 
        }

        // ກວດສິດທິແຕ່ລະໜ້າສຳລັບພະນັກງານທົ່ວໄປ
        const perms = serverUser.permissions || {};
        let hasAccess = true;

        if (currentPath.includes('index.html') && perms.dashboard !== true) { hasAccess = false; }
        if (currentPath.includes('inventory.html') && perms.inventory !== true) { hasAccess = false; }
        if (currentPath.includes('receive-items.html') && perms.receive !== true) { hasAccess = false; }
        if (currentPath.includes('issue-items.html') && perms.issue !== true) { hasAccess = false; }
        if (currentPath.includes('manage-users.html') && perms.manageUsers !== true) { hasAccess = false; }

        if (!hasAccess) {
            alert('🚫 ຂໍອະໄພ! ບັນຊີຂອງທ່ານບໍ່ມີສິດເຂົ້າເຖິງໜ້າວຽກນີ້.');
            safeRedirect(`${base}/index.html`);
        }

    } catch (error) {
        console.error('Auth guard error:', error);
        sessionStorage.removeItem(REDIRECT_KEY);
        try { await signOut(auth); } catch (e) {}
        safeRedirect(`${base}/login.html`);
    }
});