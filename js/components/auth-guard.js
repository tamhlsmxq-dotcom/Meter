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

export async function checkPageAccess() {
    const currentPath = window.location.pathname.toLowerCase();
    const base = currentPath.includes('/pages/') ? '../..' : '.';
    const currentUser = auth.currentUser;

    if (currentPath.includes('login.html')) {
        if (currentUser) {
            safeRedirect(`${base}/index.html`);
        }
        return;
    }

    if (!currentUser) {
        safeRedirect(`${base}/login.html`);
        return;
    }

    const serverUserRef = doc(db, 'users', currentUser.uid);
    const serverUserSnap = await getDoc(serverUserRef);

    if (!serverUserSnap.exists()) {
        localStorage.removeItem('wm_user_data');
        sessionStorage.removeItem(REDIRECT_KEY);
        await signOut(auth);
        safeRedirect(`${base}/login.html`);
        return;
    }

    const serverUser = serverUserSnap.data();
    const role = String(serverUser.role || '').trim();
    const allowedAdminRoles = new Set(['system_manager', 'super_admin']);

    if (allowedAdminRoles.has(role)) {
        return;
    }

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
}

onAuthStateChanged(auth, async (user) => {
    const currentPath = window.location.pathname.toLowerCase();
    const base = currentPath.includes('/pages/') ? '../..' : '.';

    if (currentPath.includes('login.html')) {
        if (user) {
            safeRedirect(`${base}/index.html`);
        }
        return;
    }

    if (!user) {
        safeRedirect(`${base}/login.html`);
        return;
    }

    try {
        await checkPageAccess();
    } catch (error) {
        console.error('Auth guard error:', error);
        sessionStorage.removeItem(REDIRECT_KEY);
        try {
            await signOut(auth);
        } catch (signOutError) {
            console.warn('Unable to sign out after auth guard failure:', signOutError);
        }
        safeRedirect(`${base}/login.html`);
    }
});

checkPageAccess();