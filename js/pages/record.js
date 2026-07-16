// record.js
import { auth, db, onAuthStateChanged, collection, addDoc, getDocs, query, where, orderBy, doc, deleteDoc, updateDoc } from '../../firebase-config.js';

window.currentEditId = null;
window.historyDataMap = {}; 
window.isAdmin = false;
window.dbItemsList = []; // 🌟 ຕົວປ່ຽນເກັບລາຍຊື່ເຄື່ອງຈາກຖານຂໍ້ມູນສົດໆ

const now = new Date();
document.getElementById('historyMonthPicker').value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
flatpickr(".datepicker", { dateFormat: "Y-m-d", altInput: true, altFormat: "d/m/Y", defaultDate: "today" });

// 🌟 ຟັງຊັນດຶງລາຍຊື່ເຄື່ອງຈາກຖານຂໍ້ມູນ
window.fetchItemsFromDB = async function() {
    try {
        const snap = await getDocs(collection(db, "equipment_list"));
        window.dbItemsList = [];
        snap.forEach(doc => { window.dbItemsList.push(doc.data()); });
        window.dbItemsList.sort((a, b) => a.code.localeCompare(b.code));
    } catch (e) { console.error("Error fetching items:", e); }
};

onAuthStateChanged(auth, async (user) => {
    if (user) {
        try {
            const adminQuery = query(collection(db, "addmin"), where("email", "==", user.email));
            const adminSnapshot = await getDocs(adminQuery);
            window.isAdmin = !adminSnapshot.empty;
        } catch (error) { window.isAdmin = false; }

        await window.fetchItemsFromDB(); // 🌟 ລໍຖ້າດຶງຂໍ້ມູນເຄື່ອງໃຫ້ແລ້ວກ່ອນ

        if(document.getElementById('itemsBody').children.length === 0) window.addRow();
        window.loadHistoryRecords();
    }
});

window.addRow = function(itemData = null) {
    const tr = document.createElement('tr');
    const datalistId = 'items-list-' + Date.now() + Math.floor(Math.random() * 1000);
    
    let optionsHtml = '';
    // 🌟 ໃຊ້ຂໍ້ມູນຈາກຖານຂໍ້ມູນສ້າງເປັນຕົວເລືອກ
    window.dbItemsList.forEach(item => { optionsHtml += `<option value="${item.code}">[${item.code}] ${item.name}</option>`; });
    
    tr.innerHTML = `
        <td class="border p-1 relative">
            <input list="${datalistId}" type="text" class="w-full p-2 outline-none border border-gray-200 rounded code-input bg-white font-bold" placeholder="ພິມລະຫັດ..." onchange="fillItemDetails(this)" onkeyup="fillItemDetails(this)" value="${itemData ? itemData.code : ''}">
            <datalist id="${datalistId}">${optionsHtml}</datalist>
        </td>
        <td class="border p-1"><input type="text" class="w-full p-2 outline-none name-input bg-gray-50 text-sm rounded" placeholder="ຊື່ອຸປະກອນຈະຂຶ້ນເອງ..." readonly value="${itemData ? itemData.name : ''}"></td>
        <td class="border p-1"><input type="number" class="w-full p-2 outline-none text-center border border-gray-200 rounded qty-input font-bold" placeholder="0" value="${itemData ? (itemData.quantity || itemData.qty) : '1'}"></td>
        <td class="border p-1"><input type="text" class="w-full p-2 outline-none text-center unit-input bg-gray-50 rounded" placeholder="ຫົວໜ່ວຍ" readonly value="${itemData ? itemData.unit : ''}"></td>
        <td class="border p-1 text-center"><button onclick="this.parentElement.parentElement.remove()" class="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50"><i class="fas fa-trash"></i></button></td>
    `;
    document.getElementById('itemsBody').appendChild(tr);
};

window.fillItemDetails = function(inputElement) {
    const row = inputElement.closest('tr');
    const nameInput = row.querySelector('.name-input');
    const unitInput = row.querySelector('.unit-input');
    let val = inputElement.value;
    if(val.includes('[')) { val = val.split(']')[0].replace('[', '').trim(); inputElement.value = val; }
    
    // 🌟 ຄົ້ນຫາຈາກຖານຂໍ້ມູນສົດ
    const foundItem = window.dbItemsList.find(item => item.code === val);
    if (foundItem) { nameInput.value = foundItem.name; unitInput.value = foundItem.unit; } 
    else { nameInput.value = ''; unitInput.value = ''; }
};

window.saveRecord = async function() {
    const rType = document.getElementById('recordType').value;
    const reportNo = document.getElementById('reportNo').value;
    const date = document.getElementById('recordDate').value;
    const emp = document.getElementById('employeeName').value;
    const rows = document.querySelectorAll('#itemsBody tr');
    const items = [];

    if(!date || !emp) { Swal.fire('ແຈ້ງເຕືອນ', 'ກະລຸນາປ້ອນວັນທີ ແລະ ຊື່ພະນັກງານ', 'warning'); return; }

    rows.forEach(row => {
        const code = row.querySelector('.code-input').value;
        const name = row.querySelector('.name-input').value;
        const qty = Number(row.querySelector('.qty-input').value);
        const unit = row.querySelector('.unit-input').value;
        if(code && qty > 0) items.push({ code, name, quantity: qty, unit });
    });

    if(items.length === 0) { Swal.fire('ແຈ້ງເຕືອນ', 'ກະລຸນາປ້ອນລາຍການເຄື່ອງໃຫ້ຖືກຕ້ອງ', 'warning'); return; }

    try {
        Swal.fire({ title: 'ກຳລັງບັນທຶກ...', didOpen: () => { Swal.showLoading(); }});
        
        const recordData = {
            recordType: rType, reportNumber: reportNo, date: date, employeeName: emp, items: items,
            timestamp: new Date(date + "T12:00:00")
        };

        if (window.currentEditId) {
            await updateDoc(doc(db, "reports", window.currentEditId), recordData);
            Swal.fire('ສຳເລັດ!', 'ອັບເດດຂໍ້ມູນສຳເລັດແລ້ວ', 'success');
        } else {
            await addDoc(collection(db, "reports"), recordData);
            Swal.fire('ສຳເລັດ!', 'ບັນທຶກຂໍ້ມູນສຳເລັດແລ້ວ', 'success');
        }
        
        window.cancelEdit();
        window.loadHistoryRecords(); 
    } catch (error) { Swal.fire('ຜິດພາດ', error.message, 'error'); }
};

window.loadHistoryRecords = async function() {
    const historyBody = document.getElementById('historyRecordsBody');
    const monthVal = document.getElementById('historyMonthPicker').value;
    if(!monthVal || !historyBody) return;
    
    try {
        historyBody.innerHTML = '<tr><td colspan="6" class="text-center p-6 text-gray-500">ກຳລັງໂຫຼດຂໍ້ມູນ...</td></tr>';
        const [yyyy, mm] = monthVal.split('-');
        const start = new Date(yyyy, Number(mm) - 1, 1);
        const end = new Date(yyyy, Number(mm), 0, 23, 59, 59);
        
        const q = query(collection(db, "reports"), where("timestamp", ">=", start), where("timestamp", "<=", end), orderBy("timestamp", "desc"));
        const snapshot = await getDocs(q);
        
        historyBody.innerHTML = '';
        window.historyDataMap = {};
        
        if(snapshot.empty) { historyBody.innerHTML = '<tr><td colspan="6" class="text-center p-6 text-gray-500">ຍັງບໍ່ມີການບັນທຶກໃນເດືອນນີ້</td></tr>'; return; }
        
        snapshot.forEach(docSnap => {
            const data = docSnap.data();
            window.historyDataMap[docSnap.id] = data;
            const typeText = data.recordType === 'warehouse' ? '📦 ເບີກສາງ' : '🔧 ປ່ຽນຖ່າຍ';
            const itemsCount = data.items ? data.items.length : 0;
            
            let actionButtons = `<span class="text-gray-400 text-xs font-bold">- ເບິ່ງໄດ້ຢ່າງດຽວ -</span>`;
            if (window.isAdmin) {
                actionButtons = `
                    <button onclick="editRecord('${docSnap.id}')" class="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded mx-1 transition-colors" title="ແກ້ໄຂ"><i class="fas fa-edit"></i></button>
                    <button onclick="deleteRecord('${docSnap.id}')" class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded mx-1 transition-colors" title="ລຶບຖິ້ມ"><i class="fas fa-trash"></i></button>
                `;
            }

            historyBody.innerHTML += `
                <tr class="hover:bg-blue-50/50 transition-colors">
                    <td class="p-3 border-b text-center text-gray-600 font-bold">${data.date}</td>
                    <td class="p-3 border-b text-center font-bold">${typeText}</td>
                    <td class="p-3 border-b text-center">${data.employeeName}</td>
                    <td class="p-3 border-b text-center text-blue-600 font-bold">${data.reportNumber || '-'}</td>
                    <td class="p-3 border-b text-center text-green-600 font-bold bg-green-50/30">${itemsCount} ລາຍການ</td>
                    <td class="p-3 border-b text-center">${actionButtons}</td>
                </tr>
            `;
        });
    } catch (e) { console.error(e); }
};

window.editRecord = function(docId) {
    if (!window.isAdmin) return;
    const data = window.historyDataMap[docId];
    if(!data) return;
    window.currentEditId = docId;
    document.getElementById('recordFormTitle').innerHTML = '<i class="fas fa-pen text-orange-500 mr-2"></i>ແກ້ໄຂຂໍ້ມູນ';
    document.getElementById('cancelEditBtn').classList.remove('hidden');
    document.getElementById('saveBtn').innerHTML = '<i class="fas fa-save mr-2"></i> ອັບເດດຂໍ້ມູນ';
    document.getElementById('saveBtn').classList.replace('bg-blue-600', 'bg-orange-500');
    document.getElementById('saveBtn').classList.replace('hover:bg-blue-700', 'hover:bg-orange-600');

    document.getElementById('recordType').value = data.recordType || 'warehouse';
    document.getElementById('reportNo').value = data.reportNumber || '';
    document.getElementById('employeeName').value = data.employeeName || 'ສຸກສາຄອນ';
    document.getElementById('recordDate')._flatpickr.setDate(data.date);
    document.getElementById('itemsBody').innerHTML = '';
    
    if(data.items) {
        data.items.forEach(item => { window.addRow(item); });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
};

window.cancelEdit = function() {
    window.currentEditId = null;
    document.getElementById('recordFormTitle').innerHTML = '<i class="fas fa-file-signature mr-2 text-blue-600"></i>ບັນທຶກເບີກຈ່າຍອຸປະກອນ';
    document.getElementById('cancelEditBtn').classList.add('hidden');
    document.getElementById('saveBtn').innerHTML = '<i class="fas fa-save mr-2"></i> ບັນທຶກຂໍ້ມູນ';
    document.getElementById('saveBtn').classList.replace('bg-orange-500', 'bg-blue-600');
    document.getElementById('saveBtn').classList.replace('hover:bg-orange-600', 'hover:bg-blue-700');
    
    document.getElementById('reportNo').value = '';
    document.getElementById('itemsBody').innerHTML = '';
    window.addRow();
};

window.deleteRecord = async function(docId) {
    if (!window.isAdmin) return;
    Swal.fire({
        title: 'ຕ້ອງການລຶບແທ້ບໍ່?', text: "ຖ້າລຶບແລ້ວຈະບໍ່ສາມາດກູ້ຂໍ້ມູນຄືນໄດ້!", icon: 'warning',
        showCancelButton: true, confirmButtonColor: '#d33', cancelButtonColor: '#3085d6',
        confirmButtonText: 'ລຶບເລີຍ', cancelButtonText: 'ຍົກເລີກ'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                Swal.fire({ title: 'ກຳລັງລຶບ...', didOpen: () => { Swal.showLoading(); }});
                await deleteDoc(doc(db, "reports", docId));
                if(window.currentEditId === docId) window.cancelEdit();
                window.loadHistoryRecords();
                Swal.fire('ລຶບສຳເລັດ!', 'ຂໍ້ມູນຖືກລຶບແລ້ວ.', 'success');
            } catch (error) { Swal.fire('ຜິດພາດ', error.message, 'error'); }
        }
    });
};
