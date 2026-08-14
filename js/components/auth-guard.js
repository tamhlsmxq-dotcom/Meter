// =========================================================================
// 🛡️ Auth Guard - Middleware ກວດສອບສິດທິການເຂົ້າເຖິງລະບົບ (Enterprise Level)
// =========================================================================

import { auth, db } from '../../firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const REDIRECT_KEY = 'meter_redirect_guard';
let redirectLock = false;

// ຟັງຊັນປ້ອງກັນການ Redirect ຊໍ້າຊ້ອນ (Infinite Loop)
function safeRedirect(url) {
    if (redirectLock) return;
    const target = new URL(url, window.location.href).toString();
    if (sessionStorage.getItem(REDIRECT_KEY) === target) return;

    redirectLock = true;
    sessionStorage.setItem(REDIRECT_KEY, target);
    window.location.replace(url);
}

window.addEventListener('pageshow', () => {
    redirectLock = false;
    if (window.location.pathname.toLowerCase().includes('login.html')) {
        sessionStorage.removeItem(REDIRECT_KEY);
    }
});

// 🌟 1. ກວດສອບເບື້ອງຕົ້ນແບບໄວ ຜ່ານ localStorage (ຫຼຸດການໂຫຼດຊ້າ)
const currentPath = window.location.pathname.toLowerCase();
const base = currentPath.includes('/pages/') ? '../..' : '.';
const localUserStr = localStorage.getItem('wm_user_data');

if (!localUserStr && !currentPath.includes('login.html')) {
    safeRedirect(`${base}/login.html`);
}

// 🌟 2. ກວດສອບຄວາມປອດໄພຂັ້ນສູງກັບ Database 
onAuthStateChanged(auth, async (user) => {
    if (currentPath.includes('login.html')) {
        if (user) safeRedirect(`${base}/index.html`);
        return;
    }

    if (!user) {
        localStorage.removeItem('wm_user_data');
        safeRedirect(`${base}/login.html`);
        return;
    }

    try {
        // 🌟 ແກ້ບັກ: ໃຊ້ user.email.toLowerCase() ເປັນ ID ເພື່ອໃຫ້ກົງກັບ Database
        const userEmailId = user.email ? user.email.toLowerCase() : user.uid;
        const serverUserRef = doc(db, 'users', userEmailId); 
        const serverUserSnap = await getDoc(serverUserRef);

        if (!serverUserSnap.exists()) {
            console.warn("Security: ບໍ່ພົບສິດທິຜູ້ໃຊ້ນີ້ໃນລະບົບ.");
            localStorage.removeItem('wm_user_data');
            sessionStorage.removeItem(REDIRECT_KEY);
            await signOut(auth);
            safeRedirect(`${base}/login.html`);
            return;
        }

        const serverUser = serverUserSnap.data();
        
        // 🔄 ອັບເດດຂໍ້ມູນລົງເຄື່ອງທັນທີ
        const freshUserData = {
            uid: user.uid,
            email: user.email,
            fullName: serverUser.fullName || user.email.split('@')[0],
            role: serverUser.role,
            permissions: serverUser.permissions || {}
        };
        localStorage.setItem('wm_user_data', JSON.stringify(freshUserData));

        // 🛡️ ກວດສອບ Role (Admin ໃຫ້ຜ່ານທຸກໜ້າ)
        const role = String(serverUser.role || '').trim();
        const allowedAdminRoles = new Set(['system_manager', 'super_admin']);
        if (allowedAdminRoles.has(role)) return; 

        // 🛡️ ກວດສອບ Permissions ແຕ່ລະໜ້າສຳລັບພະນັກງານທົ່ວໄປ
        const perms = serverUser.permissions || {};
        let hasAccess = true;

        if (currentPath.includes('index.html') && !perms.dashboard) hasAccess = false;
        if (currentPath.includes('inventory.html') && !perms.inventory) hasAccess = false;
        if (currentPath.includes('receive-items.html') && !perms.receive) hasAccess = false;
        if (currentPath.includes('create-issue.html') && !perms.issue) hasAccess = false; // ກວດໜ້າເບີກ
        if (currentPath.includes('field-report.html') && !perms.field) hasAccess = false; // ກວດໜ້າຊ່າງ

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