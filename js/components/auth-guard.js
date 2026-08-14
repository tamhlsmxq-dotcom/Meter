// =========================================================================
// 🛡️ Auth Guard - Universal Version (ຮອງຮັບທັງ Web App ແລະ App / PWA)
// =========================================================================

import { auth, db } from '../../firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

// 🌟 1. ຟັງຊັນຄຳນວນ Path ທີ່ໃຊ້ໄດ້ທັງ Web App ແລະ App 🌟
// (ໃຊ້ການຖອຍຫຼັງໂຟນເດີ ../ ແທນການອ້າງອີງຈາກ Root / )
function getCorrectPath(targetPage) {
    const path = window.location.pathname.toLowerCase();
    let base = '.';
    
    // ກວດສອບວ່າໄຟລ໌ປັດຈຸບັນຢູ່ເລິກຊ່ຳໃດ ເພື່ອຖອຍຫຼັງໃຫ້ຖືກຕ້ອງ
    if (path.includes('/pages/warehouse/') || path.includes('/pages/admin/')) {
        base = '../..';
    } else if (path.includes('/pages/')) {
        base = '..';
    }
    return `${base}/${targetPage}`;
}

// 🌟 2. ຟັງຊັນ Redirect ທີ່ປ້ອງກັນການຄ້າງ (Loop) ໃນ App 🌟
let isRedirecting = false;
function safeRedirect(targetPage) {
    if (isRedirecting) return;
    
    // ກວດສອບວ່າປັດຈຸບັນຢູ່ໜ້າດຽວກັນແລ້ວຫຼືບໍ່ ເພື່ອປ້ອງກັນບໍ່ໃຫ້ມັນໂຫຼດໜ້າເກົ່າຊໍ້າໆ
    const currentPath = window.location.pathname.toLowerCase();
    if (!currentPath.includes(targetPage.toLowerCase())) {
        isRedirecting = true;
        const targetUrl = getCorrectPath(targetPage);
        window.location.replace(targetUrl);
    }
}

const currentPath = window.location.pathname.toLowerCase();
const localUserStr = localStorage.getItem('wm_user_data');

// 🌟 3. Fast Check: ຖ້າບໍ່ມີ Session ໃນເຄື່ອງ ໃຫ້ເຕະໄປ Login ທັນທີ (ບໍ່ໃຫ້ຈໍກະຕຸກ)
if (!localUserStr && !currentPath.includes('login.html')) {
    safeRedirect('login.html');
}

// 🌟 4. Firebase Security Check
onAuthStateChanged(auth, async (user) => {
    
    // ຖ້າຢູ່ໜ້າ Login ແຕ່ເຄີຍ Login ແລ້ວ -> ໄປໜ້າ Dashboard
    if (currentPath.includes('login.html')) {
        if (user) safeRedirect('index.html');
        return;
    }

    // ຖ້າ Firebase ແຈ້ງວ່າ Token ໝົດອາຍຸ ຫຼື ບໍ່ມີ User
    if (!user) {
        localStorage.removeItem('wm_user_data');
        safeRedirect('login.html');
        return;
    }

    try {
        // ກວດສອບສິດທິຈາກ Database ໂດຍໃຊ້ອີເມວ
        const serverUserRef = doc(db, 'users', user.email.toLowerCase());
        const serverUserSnap = await getDoc(serverUserRef);
        
        let freshUserData;

        if (!serverUserSnap.exists()) {
            // ⚠️ ຊ່ອງທາງພິເສດສຳລັບ Admin ເພື່ອປ້ອງກັນການລັອກໂຕເອງອອກ ຕອນກຳລັງຕັ້ງຄ່າ
            if (user.email.toLowerCase() === 'admin@watermeter.com') {
                freshUserData = {
                    uid: user.uid,
                    email: user.email,
                    fullName: 'ຜູ້ບໍລິຫານລະບົບ',
                    role: 'super_admin',
                    permissions: { dashboard: true, inventory: true, receive: true, issue: true, manageUsers: true }
                };
            } else {
                localStorage.removeItem('wm_user_data');
                await signOut(auth);
                safeRedirect('login.html');
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
        
        // ອັບເດດ Session ລົງເຄື່ອງ
        localStorage.setItem('wm_user_data', JSON.stringify(freshUserData));

        // ກວດສອບການເຂົ້າເຖິງແຕ່ລະໜ້າ
        const role = String(freshUserData.role || '').trim();
        const allowedAdminRoles = new Set(['system_manager', 'super_admin']);

        // Admin ຜ່ານໄດ້ທຸກໜ້າ
        if (allowedAdminRoles.has(role)) return; 

        // ກວດສິດທິຕາມໜ້າວຽກ
        const perms = freshUserData.permissions || {};
        let hasAccess = true;

        if (currentPath.includes('index.html') && !perms.dashboard) hasAccess = false;
        if (currentPath.includes('inventory.html') && !perms.inventory) hasAccess = false;
        if (currentPath.includes('receive-items.html') && !perms.receive) hasAccess = false;
        if (currentPath.includes('create-issue.html') && !perms.issue) hasAccess = false;
        if (currentPath.includes('field-report.html') && !perms.field) hasAccess = false;
        if (currentPath.includes('manage-users.html') && !perms.manageUsers) hasAccess = false;

        if (!hasAccess) {
            alert('🚫 ຂໍອະໄພ! ບັນຊີຂອງທ່ານບໍ່ມີສິດເຂົ້າເຖິງໜ້າວຽກນີ້.');
            safeRedirect('index.html');
        }

    } catch (error) {
        console.error('Auth guard error:', error);
        try { await signOut(auth); } catch (e) {}
        safeRedirect('login.html');
    }
});