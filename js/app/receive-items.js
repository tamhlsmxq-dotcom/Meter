import { db } from '../../firebase-config.js'; 
import { collection, getDocs, addDoc, doc, updateDoc, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

let allItems = [];
let selectedItem = null;

// 1. ດຶງຂໍ້ມູນອຸປະກອນທັງໝົດມາໄວ້ເຮັດ Dropdown
async function fetchItems() {
    try {
        const querySnapshot = await getDocs(collection(db, "items"));
        allItems = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Error fetching items: ", error);
    }
}

// 2. ດຶງປະຫວັດການຮັບເຄື່ອງເຂົ້າສາງມາໂຊໃນຕາຕະລາງ
async function fetchReceiveHistory() {
    const tbody = document.getElementById('historyTableBody');
    try {
        const q = query(collection(db, "receive_history"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) {
            tbody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-slate-400">ບໍ່ມີປະຫວັດການຮັບເຂົ້າສາງ</td></tr>`;
            return;
        }

        let index = 1;
        tbody.innerHTML = querySnapshot.docs.map(docData => {
            const data = docData.data();
            const dateStr = data.timestamp ? new Date(data.timestamp.seconds * 1000).toLocaleString('lo-LA') : 'ກຳລັງບັນທຶກ...';
            return `
                <tr class="border-b hover:bg-slate-50 transition-colors">
                    <td class="p-3 font-medium text-slate-500">${index++}</td>
                    <td class="p-3">
                        <span class="block font-bold text-slate-800">${data.itemCode}</span>
                        <span class="text-xs text-slate-500">${data.itemName}</span>
                    </td>
                    <td class="p-3 text-center text-green-600 font-bold bg-green-50/50">+ ${data.quantity} ${data.itemUnit || ''}</td>
                    <td class="p-3 text-xs">
                        <p class="font-medium text-slate-700">${data.note}</p>
                        <p class="text-slate-400 mt-0.5">${dateStr}</p>
                    </td>
                </tr>
            `;
        }).join('');
    } catch (error) {
        console.error("Error fetching history: ", error);
        tbody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-red-500">ເກີດຂໍ້ຜິດພາດໃນການໂຫລດຂໍ້ມູນ</td></tr>`;
    }
}

// 3. ຈັດການລະບົບຄົ້ນຫາ ແລະ Dropdown
const searchInput = document.getElementById('itemSearchInput');
const dropdown = document.getElementById('dropdownList');

searchInput.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    if (!val) {
        dropdown.classList.add('hidden');
        return;
    }

    const filtered = allItems.filter(i => 
        (i.name && i.name.toLowerCase().includes(val)) || 
        (i.code && i.code.toLowerCase().includes(val))
    );

    if (filtered.length === 0) {
        dropdown.innerHTML = `<div class="p-3 text-slate-400 text-center text-sm">ບໍ່ພົບອຸປະກອນນີ້...</div>`;
    } else {
        dropdown.innerHTML = filtered.map(item => `
            <div class="p-3 border-b border-slate-100 hover:bg-blue-50 cursor-pointer flex justify-between items-center transition-colors" 
                 data-id="${item.id}" data-code="${item.code}" data-name="${item.name}" data-unit="${item.unit}" data-stock="${item.stock}">
                <div>
                    <span class="block text-sm font-bold text-slate-800">${item.code}</span>
                    <span class="text-xs text-slate-500">${item.name}</span>
                </div>
                <span class="text-xs bg-slate-100 px-2 py-1 rounded-full font-bold text-slate-600">ຄັງເຫຼືອ: ${item.stock}</span>
            </div>
        `).join('');

        // ຜູກເຫດການຄລິກເລືອກອຸປະກອນ
        dropdown.querySelectorAll('div[data-id]').forEach(el => {
            el.addEventListener('click', () => {
                selectedItem = {
                    id: el.dataset.id,
                    code: el.dataset.code,
                    name: el.dataset.name,
                    unit: el.dataset.unit,
                    stock: Number(el.dataset.stock)
                };
                searchInput.value = `${selectedItem.code} - ${selectedItem.name}`;
                dropdown.classList.add('hidden');
            });
        });
    }
    dropdown.classList.remove('hidden');
});

// ປິດ Dropdown ເມື່ອກົດບ່ອນອື່ນ
document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.add('hidden');
    }
});

// 4. ຟັງຊັນປຸ່ມລົບໄວ / ລ້າງຂໍ້ມູນຟອມ (Clear Form)
document.getElementById('clearFormBtn').addEventListener('click', () => {
    resetForm();
});

function resetForm() {
    searchInput.value = '';
    document.getElementById('receiveQty').value = '';
    document.getElementById('receiveNote').value = '';
    selectedItem = null;
    dropdown.classList.add('hidden');
}

// 5. ບັນທຶກຂໍ້ມູນຮັບເຂົ້າສາງ ແລະ ອັບເດດຈຳນວນໃນສະຕັອກ
document.getElementById('receiveForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedItem) {
        alert("ກະລຸນາເລືອກອຸປະກອນຈາກລາຍການ Dropdown ກ່ອນ!");
        return;
    }

    const qty = parseInt(document.getElementById('receiveQty').value);
    const note = document.getElementById('receiveNote').value;

    if (isNaN(qty) || qty <= 0) {
        alert("ກະລຸນາໃສ່ຈຳນວນໃຫ້ຖືກຕ້ອງ!");
        return;
    }

    try {
        // ກ. ບັນທຶກລົງຄໍເລັກຊັນປະຫວັດ receive_history
        await addDoc(collection(db, "receive_history"), {
            itemId: selectedItem.id,
            itemCode: selectedItem.code,
            itemName: selectedItem.name,
            itemUnit: selectedItem.unit,
            quantity: qty,
            note: note,
            timestamp: serverTimestamp()
        });

        // ຂ. ອັບເດດບວກສະຕັອກເພີ່ມເຂົ້າໃນ collection items ໂຕຈິງ
        const itemRef = doc(db, "items", selectedItem.id);
        const newStock = selectedItem.stock + qty;
        await updateDoc(itemRef, {
            stock: newStock
        });

        alert("🎉 ບັນທຶກຮັບອຸປະກອນເຂົ້າສາງສຳເລັດແລ້ວ!");
        resetForm();
        await fetchItems();          // ໂຫລດຂໍ້ມູນອຸປະກອນຫຼ້າສຸດໃໝ່
        await fetchReceiveHistory(); // ຣີເຟຣຊຕາຕະລາງປະຫວັດ
    } catch (error) {
        console.error("Error saving transaction: ", error);
        alert("ເກີດຂໍ້ຜິດພາດ ບໍ່ສາມາດບັນທຶກຂໍ້ມູນໄດ້!");
    }
});

// ເລີ່ມຕົ້ນໂຫລດຂໍ້ມູນທັງໝົດ
async function init() {
    await fetchItems();
    await fetchReceiveHistory();
}
init();