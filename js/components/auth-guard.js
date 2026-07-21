// =========================================================================
// 🛡️ ລະບົບກວດສອບສິດທິການເຂົ້າເຖິງລະດັບອົງກອນ (Dynamic Auth Guard)
// =========================================================================

export function checkPageAccess() {
    const userDataStr = localStorage.getItem('wm_user_data');
    const currentPath = window.location.pathname.toLowerCase();
    
    // ຄຳນວນ Base URL ເພື່ອໃຫ້ສາມາດເຕະກັບຄືນໄດ້ຖືກຕ້ອງ ບໍ່ວ່າຈະຢູ່ Folder ໃດ
    const base = currentPath.includes('/pages/') ? '../..' : '.';

    // 1. ຖ້າບໍ່ມີຂໍ້ມູນ ແປວ່າຍັງບໍ່ລັອກອິນ ໃຫ້ເຕະໄປໜ້າ Login
    if (!userDataStr) {
        if (!currentPath.includes('login.html')) {
            window.location.replace(base + '/login.html');
        }
        return;
    }

    // ຖອດລະຫັດຂໍ້ມູນມາກວດສອບ
    const userData = JSON.parse(userDataStr);
    const perms = userData.permissions || {};
    
    let hasAccess = true;

    // 2. ກວດສອບສິດທິຕາມໜ້າທີ່ກຳລັງຈະເຂົ້າ (ຖ້າໜ້າໃດບໍ່ໄດ້ຕິກອະນຸຍາດ = false)
    if (currentPath.includes('index.html') && !perms.dashboard) { hasAccess = false; }
    if (currentPath.includes('inventory.html') && !perms.inventory) { hasAccess = false; }
    if (currentPath.includes('receive-items.html') && !perms.receive) { hasAccess = false; }
    if (currentPath.includes('issue-items.html') && !perms.issue) { hasAccess = false; }
    if (currentPath.includes('manage-users.html') && !perms.manageUsers) { hasAccess = false; }

    // 3. ຖ້າບໍ່ມີສິດເຂົ້າໜ້ານີ້ ໃຫ້ແຈ້ງເຕືອນແລ້ວເຕະອອກ
    if (!hasAccess) {
        alert('🚫 ຂໍອະໄພ! ບັນຊີຂອງທ່ານບໍ່ມີສິດເຂົ້າເຖິງໜ້າວຽກນີ້.\nກະລຸນາຕິດຕໍ່ຜູ້ບໍລິຫານລະບົບເພື່ອຂໍສິດທິ.');
        
        // ຖ້າຖືກຕັດສິດແມ່ນກະທັ່ງໜ້າ Dashboard ກໍໃຫ້ເຕະອອກໄປໜ້າ Login ເລີຍ
        if (!perms.dashboard && currentPath.includes('index.html')) {
            localStorage.removeItem('wm_user_data');
            window.location.replace(base + '/login.html');
        } else {
            // ຖ້າຍັງມີສິດໜ້າຫຼັກຢູ່ ກໍເຕະກັບໄປໜ້າຫຼັກ
            window.location.replace(base + '/index.html'); 
        }
    }
}

// ເອີ້ນໃຊ້ງານທັນທີເມື່ອໄຟລ໌ນີ້ຖືກໂຫຼດໃນໜ້າໃດໜຶ່ງ
checkPageAccess();