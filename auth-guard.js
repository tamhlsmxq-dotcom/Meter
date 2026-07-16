import { auth } from '../config/firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// ໃສ່ Email ທີ່ເຈົ້າໃຊ້ລັອກອິນເຂົ້າລະບົບຢູ່ບ່ອນນີ້ (ໃສ່ໃຫ້ຄົບທຸກຄົນທີ່ເປັນ Admin)
const ADMIN_EMAILS = ["admin@meter.com", "palamy@gmail.com"]; 

onAuthStateChanged(auth, (user) => {
    // ຖ້າຍັງບໍ່ລັອກອິນ ໃຫ້ກັບໄປໜ້າ Login (index.html)
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // ລະບົບກວດສອບສິດ: 
    // ຖ້າ Email ບໍ່ຢູ່ໃນລາຍຊື່ ADMIN_EMAILS ມັນຈະສະແດງຂໍ້ຄວາມເຕືອນ
    if (!ADMIN_EMAILS.includes(user.email)) {
        // ຖ້າເຈົ້າຢາກປິດການກວດສອບນີ້ຊົ່ວຄາວ ໃຫ້ໃສ່ // ທາງໜ້າ if ແລະ ປິດແຖວ alert
        alert("ສະຫງວນສິດ: ໜ້ານີ້ສະເພາະ Admin ເທົ່ານັ້ນ");
        window.location.href = 'index.html'; 
    }
});
