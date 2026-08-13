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

// 🌟 1. ກວດສອບເບື້ອງຕົ້ນແບບໄວ ຜ່ານ localStorage 🌟
const currentPath = window.location.pathname.toLowerCase();
const base = currentPath.includes('/pages/') ? '../..' : '.';
const localUserStr = localStorage.getItem('wm_user_data');

if (!localUserStr && !currentPath.includes('login.html')) {
    safeRedirect(`${base}/login.html`);
}

// 🌟 2. ກວດສອບຄວາມປອດໄພຂັ້ນສູງກັບ Database 🌟
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
        const serverUserRef = doc(db, 'users', user.uid);
        const serverUserSnap = await getDoc(serverUserRef);
        
        let freshUserData;

        if (!serverUserSnap.exists()) {
            // 🌟 ແກ້ບັກຈຸດນີ້: ຖ້າເປັນ Admin ໃຫ້ອະນຸຍາດຜ່ານໄດ້ ເຖິງວ່າຈະຍັງບໍ່ມີຂໍ້ມູນໃນ Database ກໍຕາມ
            if (user.email && user.email.toLowerCase().includes('admin')) {
                freshUserData = {
                    uid: user.uid,
                    email: user.email,
                    fullName: 'ຜູ້ບໍລິຫານລະບົບ (Super Admin)',
                    role: 'super_admin',
                    permissions: { dashboard: true, inventory: true, receive: true, issue: true, manageUsers: true }
                };
            } else {
                localStorage.removeItem('wm_user_data');
                sessionStorage.removeItem(REDIRECT_KEY);
                await signOut(auth);
                safeRedirect(`${base}/login.html`);
                return;
            }
        } else {
            const serverUser = serverUserSnap.data();
            freshUserData = {
                uid: user.uid,
                email: user.email,
                fullName: serverUser.fullName || user.email.split('@')[0],
                role: serverUser.role,
                permissions: serverUser.permissions || {}
            };
        }

        // 🔄 ອັບເດດຂໍ້ມູນລົງເຄື່ອງ
        localStorage.setItem('wm_user_data', JSON.stringify(freshUserData));

        // 🛡️ ກວດສອບ Role ແລະ Permissions
        const role = String(freshUserData.role || '').trim();
        const allowedAdminRoles = new Set(['system_manager', 'super_admin']);

        if (allowedAdminRoles.has(role)) {
            return; 
        }

        const perms = freshUserData.permissions || {};
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