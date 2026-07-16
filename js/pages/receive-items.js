// 🌟 ຈຸດທີ່ປ່ຽນແປງ: ໃຊ້ ../../ ເພື່ອຖອຍຫຼັງອອກມາຫາໄຟລ໌ firebase-config.js ແລະ items-data.js ທີ່ຢູ່ທາງນອກ
import { auth, db, collection, getDocs, doc, updateDoc, increment, addDoc, query, where } from '../../firebase-config.js';
import { itemsList } from '../../items-data.js'; 

window.dbItemsList = []; 

window.toggleSidebar = () => { 
    const sidebar = document.getElementById('sidebar-container');
    const overlay = document.getElementById('sidebarOverlay');
    if(sidebar) sidebar.classList.toggle('-translate-x-full'); 
    if(overlay) overlay.classList.toggle('hidden'); 
};

const monthFilter = document.getElementById('month-filter');
const now = new Date();
const currentMonthStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
if(monthFilter) monthFilter.value = currentMonthStr;

async function loadReceiveItems() {
    try {
        const datalist = document.getElementById('receive-items-list');
        window.dbItemsList = [...itemsList]; 
        
        window.dbItemsList.sort((a, b) => a.code.localeCompare(b.code));
        
        let datalistHTML = '';
        window.dbItemsList.forEach(item => {
            datalistHTML += `<option value="${item.code} - ${item.name}"></option>`;
        });
        if(datalist) datalist.innerHTML = datalistHTML;
    } catch(e) {
        console.error("Error loading items:", e);
    }
}

window.fillDetails = async function() {
    let val = document.getElementById('itemCode').value;
    if (val.includes(' - ')) val = val.split(' - ')[0].trim();
    
    const found = window.dbItemsList.find(i => i.code === val);
    const infoDisplay = document.getElementById('stockInfoDisplay');
    
    if (found) {
        const q = query(collection(db, "equipment_list"), where("code", "==", found.code));
        const snap = await getDocs(q);
        let currentStock = 0;
        let docId = "";
        
        if (!snap.empty) {
            currentStock = snap.docs[0].data().stock || 0;
            docId = snap.docs[0].id;
        }

        infoDisplay.innerHTML = `ສະຕັອກປັດຈຸບັນໃນສາງ: <span class="text-green-600 font-bold text-base">${currentStock} ${found.unit}</span>`;
        document.getElementById('itemCode').setAttribute('data-id', docId); 
        document.getElementById('itemCode').setAttribute('data-code', found.code);
        document.getElementById('itemCode').setAttribute('data-name', found.name);
        document.getElementById('itemCode').setAttribute('data-unit', found.unit);
    } else {
        infoDisplay.innerHTML = '';
        document.getElementById('itemCode').removeAttribute('data-id');
        document.getElementById('itemCode').removeAttribute('data-code');
    }
};

window.filterMonthHistory = async function() {
    const tbody = document.getElementById('history-table-body');
    if(!tbody || !monthFilter) return;
    
    const selectedMonth = monthFilter.value; 
    tbody.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-gray-400 italic">ກຳລັງໂຫຼດປະຫວັດ...</td></tr>';
    
    try {
        const snap = await getDocs(query(collection(db, "inventory_logs"), where("type", "==", "IN")));
        let logsArray = [];
        
        snap.forEach(doc => {
            const data = doc.data();
            const dateObj = data.date ? data.date.toDate() : new Date();
            const docMonthStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}`;
            
            if (docMonthStr === selectedMonth) logsArray.push(data);
        });
        
        if (logsArray.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="p-8 text-center text-gray-400 font-bold">ບໍ່ມີປະຫວັດການຮັບເຂົ້າໃນເດືອນນີ້</td></tr>`;
            return;
        }

        logsArray.sort((a, b) => b.date.toDate() - a.date.toDate());
        
        let html = '';
        logsArray.forEach((data, index) => {
            const dateObj = data.date ? data.date.toDate() : new Date();
            const dateStr = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
            const timeStr = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
            const shortUser = (data.user || 'Admin').split('@')[0];

            html += `
                <tr class="hover:bg-gray-50 border-b">
                    <td class="p-3 text-center border-r">${index + 1}</td>
                    <td class="p-3 border-r">
                        <div class="font-bold text-gray-800">${data.code}</div>
                        <div class="text-xs text-gray-500">${data.name}</div>
                    </td>
                    <td class="p-3 text-center border-r font-bold text-green-600 text-base">+${data.qty}</td>
                    <td class="p-3">
                        <div class="font-bold text-gray-700 text-xs">${data.remark || ''}</div>
                        <div class="text-[10px] text-gray-400 mt-1">${dateStr} ${timeStr} | 👤 ${shortUser}</div>
                    </td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="4" class="p-4 text-center text-red-500">🚨 ຜິດພາດ: ${error.message}</td></tr>`;
    }
};

const receiveForm = document.getElementById('receive-form');
if(receiveForm) {
    receiveForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const codeInput = document.getElementById('itemCode');
        const itemCode = codeInput.getAttribute('data-code');
        const docId = codeInput.getAttribute('data-id');
        const name = codeInput.getAttribute('data-name');
        const unit = codeInput.getAttribute('data-unit');
        const qty = parseInt(document.getElementById('receiveQty').value);
        const remark = document.getElementById('receiveRemark').value;

        if (!itemCode) return Swal.fire('ແຈ້ງເຕືອນ', 'ກະລຸນາເລືອກອຸປະກອນທີ່ຖືກຕ້ອງ', 'warning');

        const submitBtn = document.getElementById('submit-btn');
        
        Swal.fire({
            title: 'ຢືນຢັນການຮັບເຂົ້າ?',
            html: `ຮັບ <b>${name}</b> ຈຳນວນ <b class="text-green-600">+${qty}</b> ${unit || ''}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ຢືນຢັນ',
            cancelButtonText: 'ຍົກເລີກ'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    submitBtn.disabled = true;
                    Swal.fire({ title: 'ກຳລັງບັນທຶກ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

                    if (docId) {
                        await updateDoc(doc(db, "equipment_list", docId), { stock: increment(qty) });
                    } else {
                        await addDoc(collection(db, "equipment_list"), {
                            code: itemCode, name: name, unit: unit, stock: qty
                        });
                    }

                    await addDoc(collection(db, "inventory_logs"), {
                        type: "IN", code: itemCode, name: name, qty: qty, remark: remark,
                        date: new Date(), user: auth.currentUser?.email || 'Admin'
                    });

                    Swal.fire({ title: 'ສຳເລັດ!', text: 'ອັບເດດສະຕັອກຮຽບຮ້ອຍ', icon: 'success', timer: 1500, showConfirmButton: false });
                    
                    receiveForm.reset();
                    document.getElementById('stockInfoDisplay').innerHTML = '';
                    codeInput.removeAttribute('data-id');
                    codeInput.removeAttribute('data-code');
                    window.filterMonthHistory(); 
                } catch (error) {
                    Swal.fire('ຜິດພາດ', error.message, 'error');
                } finally {
                    submitBtn.disabled = false;
                }
            }
        });
    });
}

loadReceiveItems();
window.filterMonthHistory();