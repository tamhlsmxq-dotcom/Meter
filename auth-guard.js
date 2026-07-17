import { auth } from '../config/firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// 1. ລາຍຊື່ອີເມວຂອງຄົນທີ່ເປັນ Admin ເທົ່ານັ້ນ (ອີເມວນອກເໜືອຈາກນີ້ ຈະເປັນຜູ້ໃຊ້ທົ່ວໄປອັດຕະໂນມັດ)
const ADMIN_EMAILS = ["admin@meter.com", "palamy@gmail.com"];

onAuthStateChanged(auth, (user) => {
    // 2. ຖ້າຍັງບໍ່ລັອກອິນ ໃຫ້ກັບໄປໜ້າ Login (index.html)
    if (!user) {["user1@MediaStream.com"];
        window.location.href = 'index.html';
        return;
    }

    // 3. ລະບົບກວດສອບສິດ
    if (ADMIN_EMAILS.includes(user.email)) {
        console.log("ສະຖານະ: ຜູ້ເບິ່ງແຍງລະບົບ (Admin)");
        
        // ຖ້າເປັນ Admin ໃຫ້ບັງຄັບສະແດງເມນູທີ່ຖືກເຊື່ອງໄວ້
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach((el) => {
            el.style.display = 'flex'; 
        });
    } else {
        console.log("ສະຖານະ: ຜູ້ໃຊ້ທົ່ວໄປ (User)");
        // ຖ້າເປັນຜູ້ໃຊ້ທົ່ວໄປ ບໍ່ຕ້ອງເຮັດຫຍັງ ເພາະເມນູຖືກບັງຄັບເຊື່ອງໄວ້ແລ້ວດ້ວຍ style="display: none;" ຢູ່ໄຟລ໌ sidebar.js
        
        // 💡 ແຖວລຸ່ມນີ້ (ຖ້າເຈົ້າຢາກໃຫ້ຜູ້ໃຊ້ທົ່ວໄປ ຫ້າມເຂົ້າໜ້ານີ້ເດັດຂາດ ໃຫ້ເອົາ // ອອກ)
        // window.location.href = 'index.html';
    }
});