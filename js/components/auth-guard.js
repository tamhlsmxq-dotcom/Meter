// =========================================================================
// 🛡️ Auth Guard - Middleware ກວດສອບສິດທິການເຂົ້າເຖິງລະບົບ
// =========================================================================

export function checkPageAccess() {
    const userDataStr = localStorage.getItem('wm_user_data');
    const currentPath = window.location.pathname.toLowerCase();
    const base = currentPath.includes('/pages/') ? '../..' : '.';

    // 1. ກວດສອບວ່າ Login ຫຼືຍັງ
    if (!userDataStr) {
        if (!currentPath.includes('login.html')) {
            window.location.replace(`${base}/login.html`);
        }
        return;
    }

    const userData = JSON.parse(userDataStr);
    const email = (userData.email || '').toLowerCase();
    const role = userData.role || '';

    // 2. Admin Bypass (ໃຫ້ Admin ຜ່ານທຸກໜ້າ)
    if (email.includes('admin') || role === 'system_manager' || role === 'super_admin') {
        return;
    }

    // 3. ກວດສອບສິດທິສະເພາະໜ້າ (Permissions) ສຳລັບ User ทົ່ວໄປ
    const perms = userData.permissions || {};
    let hasAccess = true;

    if (currentPath.includes('index.html') && !perms.dashboard) { hasAccess = false; }
    if (currentPath.includes('inventory.html') && !perms.inventory) { hasAccess = false; }
    if (currentPath.includes('receive-items.html') && !perms.receive) { hasAccess = false; }
    if (currentPath.includes('issue-items.html') && !perms.issue) { hasAccess = false; }
    if (currentPath.includes('manage-users.html') && !perms.manageUsers) { hasAccess = false; }

    // 4. ຖ້າບໍ່ມີສິດ ໃຫ້ແຈ້ງເຕືອນແລ້ວ Redirect ກັບໜ້າ Dashboard
    if (!hasAccess) {
        alert('🚫 ຂໍອະໄພ! ບັນຊີຂອງທ່ານບໍ່ມີສິດເຂົ້າເຖິງໜ້າວຽກນີ້.');
        window.location.replace(`${base}/index.html`);
    }
}

checkPageAccess();