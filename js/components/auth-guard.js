// ແກ້ໄຂເສັ້ນທາງ import ໃຫ້ເປັນຊັ້ນດຽວກັນ (./) ເພື່ອແກ້ Error ສີແດງ
import { auth } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// ລາຍຊື່ອີເມວຂອງຄົນທີ່ເປັນ Admin ເທົ່ານັ້ນ
const ADMIN_EMAILS = ["admin@meter.com", "palamy@gmail.com"];

onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // ດຶງເອົາບ່ອນສະແດງຜົນໃນ Sidebar ມາຕຽມໄວ້
    const emailDisplay = document.getElementById('user-email-display');
    const roleDisplay = document.getElementById('user-role-display');

    // ໂຊອີເມວຂອງຄົນທີ່ລັອກອິນ
    if (emailDisplay) {
        emailDisplay.textContent = user.email;
    }

    // ກວດສອບສິດ
    if (ADMIN_EMAILS.includes(user.email)) {
        // --- 🟢 ກໍລະນີເປັນ ADMIN ---
        if (roleDisplay) {
            roleDisplay.innerHTML = '<i class="fas fa-user-shield"></i> ຜູ້ເບິ່ງແຍງລະບົບ (Admin)';
            roleDisplay.className = "text-xs mt-2 px-2 py-1 bg-green-500 text-white rounded-full w-max shadow-sm";
        }
        
        // ເປີດໃຫ້ເຫັນເມນູທີ່ເຊື່ອງໄວ້
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach((el) => {
            el.style.setProperty('display', 'flex', 'important'); 
        });

    } else {
        // --- 🔵 ກໍລະນີເປັນ USER ທົ່ວໄປ ---
        if (roleDisplay) {
            roleDisplay.innerHTML = '<i class="fas fa-user"></i> ຜູ້ໃຊ້ທົ່ວໄປ (User)';
            roleDisplay.className = "text-xs mt-2 px-2 py-1 bg-blue-500 text-white rounded-full w-max shadow-sm";
        }
        
        // ບັງຄັບເຊື່ອງເມນູຢ່າງເດັດຂາດ
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach((el) => {
            el.style.setProperty('display', 'none', 'important'); 
        });
    }
});