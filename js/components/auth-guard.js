// =========================================================================
// 🛡️ Auth Guard - Middleware ກວດສອບສິດທິການເຂົ້າເຖິງລະບົບ (Bulletproof)
// =========================================================================

import { auth, db } from '../../firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const REDIRECT_KEY = 'meter_redirect_guard';
let redirectLock = false;

// 🌟 ຟັງຊັນແກ້ບັນຫາ "Cannot GET /pages/.../login.html" ໃຫ້ມັນກັບຄືນໜ້າຫຼັກສະເໝີ
function getCorrectPath(targetPage) {
    const isLocal = window.location.protocol === 'file:';
    if (!isLocal) return `/${targetPage}`; // ຖ້າລັນເທິງ Server ຫຼື Live Server ໃຊ້ Absolute Path ປອດໄພສຸດ
    
    const path = window.location.pathname.toLowerCase();
    const base = (path.includes('/pages/warehouse/') || path.includes('/pages/admin/')) ? '../..' : path.includes('/pages/') ? '..' : '.';
    return `${base}/${targetPage}`;
}

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

// 🌟 1. ກວດສອບເບື້ອງຕົ້ນແບບໄວ ຜ່ານ localStorage 🌟
const currentPath = window.location.pathname.toLowerCase();
const localUserStr = localStorage.getItem('wm_user_data');

if (!localUserStr && !currentPath.includes('login.html')) {
    safeRedirect(getCorrectPath('login.html'));
}

// 🌟 2. ກວດສອບຄວາມປອດໄພຂັ້ນສູງກັບ Database 🌟
onAuthStateChanged(auth, async (user) => {
    
    if (currentPath.includes('login.html')) {
        if (user) safeRedirect(getCorrectPath('index.html'));
        return;
    }

    if (!user) {
        localStorage.removeItem('wm_user_data');
        safeRedirect(getCorrectPath('login.html'));
        return;
    }

    try {
        // 🔒 ກວດສອບຂໍ້ມູນຈາກ Database
        const serverUserRef = doc(db, 'users', user.email.toLowerCase());
        const serverUserSnap = await getDoc(serverUserRef);
        
        let freshUserData;

        // ❌ ຖ້າບໍ່ມີຂໍ້ມູນໃນ Database
        if (!serverUserSnap.exists()) {
            // 🌟 ຂໍ້ຍົກເວັ້ນພິເສດສຳລັບ Admin ເພື່ອບໍ່ໃຫ້ຖືກລັອກໃນຕອນກຳລັງຕັ້ງຄ່າລະບົບ 🌟
            if (user.email.toLowerCase() === 'admin@watermeter.com') {
                console.warn("System: ໃຊ້ສິດທິພິເສດສຳລັບ Admin ຫຼັກ");
                freshUserData = {
                    uid: user.uid,
                    email: user.email,
                    fullName: 'ຜູ້ບໍລິຫານລະບົບ',
                    role: 'super_admin',
                    permissions: { dashboard: true, inventory: true, receive: true, issue: true, manageUsers: true }
                };
            } else {
                // ຖ້າເປັນຄົນອື່ນທີ່ບໍ່ມີໃນ Database ໃຫ້ເຕະອອກທັນທີ
                console.warn("Security Alert: User not found in database.");
                localStorage.removeItem('wm_user_data');
                sessionStorage.removeItem(REDIRECT_KEY);
                await signOut(auth);
                safeRedirect(getCorrectPath('login.html'));
                return;
            }
        } else {
            // ✅ ຖ້າມີຂໍ້ມູນໃນ Database ແລ້ວ ໃຫ້ດຶງມາໃຊ້
            const serverUser = serverUserSnap.data();
            freshUserData = {
                uid: user.uid,
                email: user.email,
                fullName: serverUser.fullName || user.email.split('@')[0],
                role: serverUser.role,
                permissions: serverUser.permissions || {}
            };
        }
        
        // 🔄 ອັບເດດຂໍ້ມູນລົງ localStorage
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
            safeRedirect(getCorrectPath('index.html'));
        }

    } catch (error) {
        console.error('Auth guard error:', error);
        sessionStorage.removeItem(REDIRECT_KEY);
        try { await signOut(auth); } catch (e) {}
        safeRedirect(getCorrectPath('login.html'));
    }
});