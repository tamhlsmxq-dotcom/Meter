import { auth, db } from './firebase-config.js';
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ກວດສອບສະຖານະການລັອກອິນ
onAuthStateChanged(auth, async (user) => {
  if (user) {
    // ຖ້າມີຄົນລັອກອິນແລ້ວ
    console.log("ຜູ້ໃຊ້ລັອກອິນແລ້ວ:", user.email);

    try {
      // ກວດສອບວ່າເປັນ Admin ບໍ່ ໂດຍດຶງຂໍ້ມູນຈາກ Collection 'users'
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists() && docSnap.data().role === 'admin') {
        console.log("ສະຖານະ: ຜູ້ເບິ່ງແຍງລະບົບ (Admin)");
        
        // ເປີດສະແດງຜົນປຸ່ມ ຫຼື ເມນູທີ່ເຊື່ອງໄວ້ສຳລັບແອັດມິນ
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach((el) => {
          el.style.display = 'block'; 
        });

      } else {
        console.log("ສະຖານະ: ຜູ້ໃຊ້ທົ່ວໄປ (User)");
        // ບໍ່ຕ້ອງເຮັດຫຍັງ ເພາະປຸ່ມຖືກເຊື່ອງໄວ້ອັດຕະໂນມັດແລ້ວ
      }

    } catch (error) {
      console.error("ເກີດຂໍ້ຜິດພາດໃນການກວດສອບສິດ:", error);
    }

  } else {
    // ຖ້າຍັງບໍ່ລັອກອິນ ແລ້ວແອບເຂົ້າໜ້ານີ້ ໃຫ້ເຕະກັບໄປໜ້າລັອກອິນ (index.html)
    window.location.href = 'index.html';
  }
});