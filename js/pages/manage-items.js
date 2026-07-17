import { db } from './firebase-config.js'; 
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let allData = []; // ເກັບຂໍ້ມູນທັງໝົດ

async function loadData() {
    const querySnapshot = await getDocs(collection(db, "items"));
    allData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    renderTable(allData);
}

// ແຕ້ມຕາຕະລາງ
function renderTable(items) {
    const tbody = document.getElementById('inventory-table-body');
    tbody.innerHTML = items.map(item => `
        <tr class="border-b hover:bg-gray-50">
            <td class="p-4">${item.code}</td>
            <td class="p-4">${item.name}</td>
            <td class="p-4 text-center font-bold ${item.stock > 0 ? 'text-green-600' : 'text-red-600'}">
                ${item.stock} ${item.unit}
            </td>
        </tr>
    `).join('');
}

// ລະບົບຄົ້ນຫາ Dropdown
const searchInput = document.getElementById('itemSearch');
const dropdown = document.getElementById('dropdownList');

searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    if (!val) {
        dropdown.classList.add('hidden');
        renderTable(allData);
        return;
    }

    const filtered = allData.filter(i => 
        i.name.toLowerCase().includes(val) || i.code.toLowerCase().includes(val)
    );

    // ສະແດງ Dropdown
    dropdown.innerHTML = filtered.map(item => `
        <div class="p-3 border-b hover:bg-blue-50 cursor-pointer flex justify-between" onclick="selectItem('${item.name}')">
            <span class="text-sm font-bold">${item.code} - ${item.name}</span>
            <span class="text-xs ${item.stock > 0 ? 'text-green-600' : 'text-red-600'} font-bold">
                ເຫຼືອ: ${item.stock}
            </span>
        </div>
    `).join('');
    dropdown.classList.remove('hidden');
});

// ເມື່ອກົດເລືອກລາຍການ
window.selectItem = (name) => {
    searchInput.value = name;
    dropdown.classList.add('hidden');
    const filtered = allData.filter(i => i.name === name);
    renderTable(filtered);
};

// ເລີ່ມງານ
loadData();