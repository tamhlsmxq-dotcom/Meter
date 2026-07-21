// =========================================================================
// 🛡️ ລະບົບກວດສອບສິດທິ (Dynamic Auth Guard - VIP Admin)
// =========================================================================

export function checkPageAccess() {
    // ດຶງຂໍ້ມູນການ Login
    const userDataStr = localStorage.getItem('wm_user_data');
    
    // ໂລຈິກຄຳນວນ Path
    const currentPath = window.location.pathname.toLowerCase();
    const base = currentPath.includes('/pages/') ? '../..' : '.';

    // 1. ຖ້າບໍ່ມີຂໍ້ມູນ ແປວ່າຍັງບໍ່ລັອກອິນ ໃຫ້ເຕະໄປໜ້າ Login
    if (!userDataStr) {
        if (!currentPath.includes('login.html')) {
            window.location.replace(base + '/login.html');
        }
        return;
    }

    const userData = JSON.parse(userDataStr);
    const userEmail = userData.email || '';

    // 🌟 2. VIP PASS: ຖ້າເປັນ Admin ໃຫ້ຜ່ານທັນທີ ບໍ່ຕ້ອງກວດຫຍັງທັງນັ້ນ! 🌟
    if (userEmail.includes('admin')) {
        return; 
    }

    // 3. ກວດສອບສິດທິສຳລັບພະນັກງານທົ່ວໄປ (ເຊັ່ນ tadam)
    const perms = userData.permissions || {};
    let hasAccess = true;

    if (currentPath.includes('index.html') && !perms.dashboard) { hasAccess = false; }
    if (currentPath.includes('inventory.html') && !perms.inventory) { hasAccess = false; }
    if (currentPath.includes('receive-items.html') && !perms.receive) { hasAccess = false; }
    if (currentPath.includes('issue-items.html') && !perms.issue) { hasAccess = false; }
    if (currentPath.includes('manage-users.html') && !perms.manageUsers) { hasAccess = false; }

    // 4. ຖ້າບໍ່ມີສິດເຂົ້າໜ້ານີ້ ໃຫ້ແຈ້ງເຕືອນແລ້ວເຕະອອກ
    if (!hasAccess) {
        alert('🚫 ຂໍອະໄພ! ບັນຊີຂອງທ່ານບໍ່ມີສິດເຂົ້າເຖິງໜ້າວຽກນີ້.\nກະລຸນາຕິດຕໍ່ຜູ້ບໍລິຫານລະບົບເພື່ອຂໍສິດທິ.');
        
        // ຖ້າຖືກຕັດສິດໜ້າ Dashboard ກໍໃຫ້ເຕະອອກໄປໜ້າ Login
        if (!perms.dashboard && currentPath.includes('index.html')) {
            localStorage.removeItem('wm_user_data');
            window.location.replace(base + '/login.html');
        } else {
            // ຖ້າຍັງມີສິດໜ້າຫຼັກຢູ່ ກໍເຕະກັບໄປໜ້າຫຼັກ
            window.location.replace(base + '/index.html'); 
        }
    }
}

// ເອີ້ນໃຊ້ງານທັນທີ
checkPageAccess();