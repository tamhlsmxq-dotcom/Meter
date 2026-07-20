// auth-guard.js
// ລະບົບກວດສອບສິດທິການເຂົ້າເຖິງລະດັບອົງກອນ

export function checkAdminAccess() {
    // ດຶງຂໍ້ມູນການ Login (ຕອນນີ້ຈຳລອງການດຶງຈາກ localStorage ຕາມໂຄງສ້າງຂອງ Sidebar ເຈົ້າ)
    const loggedUser = localStorage.getItem('wm_user') || 'admin@meter.com'; 
    
    // ສົມມຸດວ່າຖ້າເປັນ Admin ຈະມີຄຳວ່າ "admin" ໃນອີເມວ (ໃນອະນາຄົດສາມາດປ່ຽນເປັນເຊື່ອມ Firebase Auth ໄດ້)
    const isAdmin = loggedUser.toLowerCase().includes('admin');

    if (!isAdmin) {
        alert('🚫 ການເຂົ້າເຖິງຖືກປະຕິເສດ!\nສະເພາະຜູ້ບໍລິຫານລະບົບ (Super Admin) ເທົ່ານັ້ນທີ່ສາມາດເຂົ້າໜ້ານີ້ໄດ້.');
        // ເດັ້ງກັບໄປໜ້າ Dashboard ຖ້າບໍ່ມີສິດ
        window.location.replace('/index.html');
    }
}

// ເອີ້ນໃຊ້ງານທັນທີເມື່ອໄຟລ໌ນີ້ຖືກໂຫຼດໃນໜ້າ manage-users.html
checkAdminAccess();