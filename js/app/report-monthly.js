import { auth, db, collection, getDocs, query, where } from '../../firebase-config.js';

window.toggleSidebar = () => { 
    document.getElementById('sidebar-container').classList.toggle('-translate-x-full'); 
    document.getElementById('sidebarOverlay').classList.toggle('hidden'); 
};

// ຕັ້ງຄ່າເດືອນເລີ່ມຕົ້ນໃຫ້ເປັນເດືອນປັດຈຸບັນ
document.addEventListener("DOMContentLoaded", () => {
    const today = new Date();
    const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    document.getElementById('monthPicker').value = currentMonth;
    window.generateReport();
});

window.generateReport = async function() {
    const tbody = document.getElementById('reportTableBody');
    const selectedMonth = document.getElementById('monthPicker').value; // ຮູບແບບ "YYYY-MM"
    
    if (!selectedMonth) return;
    
    tbody.innerHTML = '<tr><td colspan="9" class="p-10 text-center text-gray-500 font-bold"><i class="fas fa-spinner fa-spin mr-2"></i>ກຳລັງຄິດໄລ່ຂໍ້ມູນບັນຊີສາງ...</td></tr>';

    try {
        const [selYear, selMonth] = selectedMonth.split('-');
        // ມື້ທຳອິດ ແລະ ມື້ສຸດທ້າຍຂອງເດືອນທີ່ເລືອກ
        const startOfMonth = new Date(selYear, selMonth - 1, 1);
        const endOfMonth = new Date(selYear, selMonth, 0, 23, 59, 59);

        // 1. ດຶງຂໍ້ມູນເຄື່ອງທັງໝົດ ແລະ ສະຕັອກ "ປັດຈຸບັນ" ມື້ນີ້
        const eqSnap = await getDocs(query(collection(db, "equipment_list")));
        let reportData = {};
        eqSnap.forEach(doc => {
            const data = doc.data();
            reportData[data.code] = {
                code: data.code, name: data.name, unit: data.unit,
                currentRealStock: data.stock || 0, // ສະຕັອກມື້ນີ້ແທ້ໆ
                in: 0, out: 0, adj: 0,
                endBal: data.stock || 0, // ຈະຖືກຄິດໄລ່ຍ້ອນຫຼັງ
                begBal: 0
            };
        });

        // 2. ດຶງປະຫວັດການເຄື່ອນໄຫວທັງໝົດມາຄິດໄລ່!
        const adjSnap = await getDocs(collection(db, "adjustment_logs"));
        const invSnap = await getDocs(collection(db, "inventory_logs")); // ດຶງທັງ IN ແລະ OUT (ຖ້າອະນາຄົດມີເບີກອອກ)

        // --- ຟັງຊັນຊ່ວຍຄິດໄລ່ຍ້ອນຫຼັງ (Reverse Calculation) ---
        const processLog = (code, date, qty, type) => {
            if (!reportData[code]) return; // ຖ້າບໍ່ມີເຄື່ອງນີ້ໃນສາງແລ້ວ ກໍຂ້າມໄປ
            let item = reportData[code];

            if (date > endOfMonth) {
                // ເຫດການນີ້ເກີດ "ຫຼັງຈາກ" ເດືອນທີ່ເລືອກ -> ຕ້ອງລົບກວນຍອດຄືນ ເພື່ອຫາຍອດທ້າຍເດືອນ!
                if (type === 'IN') item.endBal -= qty;
                if (type === 'OUT') item.endBal += qty;
                if (type === 'ADJ') item.endBal -= qty; 
            } else if (date >= startOfMonth && date <= endOfMonth) {
                // ເຫດການນີ້ເກີດ "ພາຍໃນ" ເດືອນທີ່ເລືອກ -> ເກັບສະຖິຕິໄວ້
                if (type === 'IN') item.in += qty;
                if (type === 'OUT') item.out += qty;
                if (type === 'ADJ') item.adj += qty;
            }
            // ຖ້າເກີດກ່ອນເດືອນທີ່ເລືອກ (ບໍ່ຕ້ອງເຮັດຫຍັງ ເພາະມັນລວມຢູ່ໃນຍອດແລ້ວ)
        };

        // ປະມວນຜົນການຮັບເຂົ້າ-ເບີກອອກ
        invSnap.forEach(doc => {
            const d = doc.data();
            processLog(d.code, d.date.toDate(), d.qty, d.type); 
        });

        // ປະມວນຜົນການປັບສະຕັອກ
        adjSnap.forEach(doc => {
            const d = doc.data();
            processLog(d.code, d.date.toDate(), d.adjustment, 'ADJ');
        });

        // 3. ຄິດໄລ່ຍອດຍົກມາ (Beginning Balance)
        // ສູດບັນຊີ: ຍອດຍົກມາ = ຍອດຍັງເຫຼືອ - ຮັບເຂົ້າ + ເບີກອອກ - ດັດແກ້
        let tableHTML = '';
        let itemsArray = Object.values(reportData).sort((a, b) => a.code.localeCompare(b.code));

        itemsArray.forEach((item, index) => {
            // ຄິດໄລ່ຍອດຍົກມາ
            item.begBal = item.endBal - item.in + item.out - item.adj;

            // ຖ້າເດືອນນີ້ບໍ່ມີການເຄື່ອນໄຫວ ແລະ ສະຕັອກເປັນ 0 ໃຫ້ເຊື່ອງໄວ້ (ເພື່ອບໍ່ໃຫ້ລາຍງານຍາວໂພດ)
            if (item.begBal === 0 && item.in === 0 && item.out === 0 && item.adj === 0 && item.endBal === 0) return;

            // ຕົກແຕ່ງສີສັນ
            const inHtml = item.in > 0 ? `<span class="text-green-600 font-bold">+${item.in}</span>` : '-';
            const outHtml = item.out > 0 ? `<span class="text-red-600 font-bold">-${item.out}</span>` : '-';
            const adjHtml = item.adj !== 0 ? `<span class="${item.adj > 0 ? 'text-orange-500' : 'text-red-500'} font-bold">${item.adj > 0 ? '+' : ''}${item.adj}</span>` : '-';
            const begHtml = `<span class="text-blue-800 font-bold">${item.begBal}</span>`;
            
            // ຍອດຍັງເຫຼືອ (ຖ້າຕິດລົບ ຫຼື ໝົດ ໃຫ້ເປັນສີແດງ)
            const endHtml = item.endBal <= 0 
                ? `<span class="text-red-600 font-bold bg-red-50 px-2 py-1 border rounded">${item.endBal}</span>` 
                : `<span class="text-blue-900 font-bold bg-blue-50 px-2 py-1 border rounded">${item.endBal}</span>`;

            tableHTML += `
                <tr class="hover:bg-gray-50 search-row border-b">
                    <td class="p-3 text-center text-gray-500">${index + 1}</td>
                    <td class="p-3 font-bold text-gray-700 code-col">${item.code}</td>
                    <td class="p-3 text-gray-700 name-col">${item.name}</td>
                    <td class="p-3 text-center text-gray-500">${item.unit}</td>
                    <td class="p-3 text-center bg-gray-50/50">${begHtml}</td>
                    <td class="p-3 text-center bg-green-50/30">${inHtml}</td>
                    <td class="p-3 text-center bg-red-50/30">${outHtml}</td>
                    <td class="p-3 text-center bg-orange-50/30">${adjHtml}</td>
                    <td class="p-3 text-center bg-blue-50/30">${endHtml}</td>
                </tr>
            `;
        });

        if(tableHTML === '') {
            tbody.innerHTML = '<tr><td colspan="9" class="p-10 text-center text-gray-500 font-bold">ບໍ່ພົບຂໍ້ມູນການເຄື່ອນໄຫວໃນເດືອນນີ້</td></tr>';
        } else {
            tbody.innerHTML = tableHTML;
        }

        document.getElementById('lastUpdateText').innerText = `ອັບເດດລ້າສຸດ: ${new Date().toLocaleString('lo-LA')}`;

    } catch (e) {
        console.error(e);
        tbody.innerHTML = `<tr><td colspan="9" class="p-6 text-center text-red-500 font-bold">ເກີດຂໍ້ຜິດພາດ: ${e.message}</td></tr>`;
    }
};

window.filterReport = function() {
    let input = document.getElementById("searchInput").value.toLowerCase();
    let rows = document.getElementsByClassName("search-row");
    for (let i = 0; i < rows.length; i++) {
        let code = rows[i].getElementsByClassName("code-col")[0].innerText.toLowerCase();
        let name = rows[i].getElementsByClassName("name-col")[0].innerText.toLowerCase();
        rows[i].style.display = (code.includes(input) || name.includes(input)) ? "" : "none";
    }
};
