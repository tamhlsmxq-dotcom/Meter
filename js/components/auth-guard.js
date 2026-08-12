// =========================================================================
// 🛡️ Auth Guard - Middleware ກວດສອບສິດທິການເຂົ້າເຖິງລະບົບ
// =========================================================================

import { auth, db } from '../../firebase-config.js';
import { doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export async function checkPageAccess() {
    const userDataStr = localStorage.getItem('wm_user_data');
    const currentPath = window.location.pathname.toLowerCase();
    const base = currentPath.includes('/pages/') ? '../..' : '.';

    if (!userDataStr) {
        if (!currentPath.includes('login.html')) {
            window.location.replace(`${base}/login.html`);
        }
        return;
    }

    let userData;
    try {
        userData = JSON.parse(userDataStr);
    } catch (error) {
        localStorage.removeItem('wm_user_data');
        window.location.replace(`${base}/login.html`);
        return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
        window.location.replace(`${base}/login.html`);
        return;
    }

    const serverUserRef = doc(db, 'users', currentUser.uid);
    const serverUserSnap = await getDoc(serverUserRef);

    if (!serverUserSnap.exists()) {
        localStorage.removeItem('wm_user_data');
        window.location.replace(`${base}/login.html`);
        return;
    }

    const serverUser = serverUserSnap.data();
    const role = String(serverUser.role || '').trim();
    const allowedAdminRoles = new Set(['system_manager', 'super_admin']);

    if (allowedAdminRoles.has(role)) {
        return;
    }

    const perms = serverUser.permissions || userData.permissions || {};
    let hasAccess = true;

    if (currentPath.includes('index.html') && perms.dashboard !== true) { hasAccess = false; }
    if (currentPath.includes('inventory.html') && perms.inventory !== true) { hasAccess = false; }
    if (currentPath.includes('receive-items.html') && perms.receive !== true) { hasAccess = false; }
    if (currentPath.includes('issue-items.html') && perms.issue !== true) { hasAccess = false; }
    if (currentPath.includes('manage-users.html') && perms.manageUsers !== true) { hasAccess = false; }

    if (!hasAccess) {
        alert('🚫 ຂໍອະໄພ! ບັນຊີຂອງທ່ານບໍ່ມີສິດເຂົ້າເຖິງໜ້າວຽກນີ້.');
        window.location.replace(`${base}/index.html`);
    }
}

checkPageAccess();