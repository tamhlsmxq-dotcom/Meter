import { auth, db, collection, getDocs, addDoc, doc, deleteDoc, updateDoc, query, where } from '../../firebase-config.js';
import { itemsList as defaultItems } from '../../items-data.js'; 

window.equipmentDataMap = {}; 
window.defaultItemsList = defaultItems; 

window.toggleSidebar = () => { 
    document.getElementById('sidebar-container').classList.toggle('-translate-x-full'); 
    document.getElementById('sidebarOverlay').classList.toggle('hidden'); 
};

window.loadEquipmentList = async function() {
    const tbody = document.getElementById('itemsTableBody');
    const alertContainer = document.getElementById('lowStockAlertContainer');
    try {
        const adjSnap = await getDocs(collection(db, "adjustment_logs"));
        const inSnap = await getDocs(query(collection(db, "inventory_logs"), where("type", "==", "IN")));
        
        window.historyCounts = {}; 
        window.latestActivity = {}; 
        
        const processLog = (doc, typeLabel, iconClass) => {
            const data = doc.data();
            const code = data.code;
            const logDate = data.date.toDate();
            
            window.historyCounts[code] = (window.historyCounts[code] || 0) + 1;
            
            if (!window.latestActivity[code] || window.latestActivity[code].date < logDate) {
                let qtyText = '';
                if (typeLabel === 'ຮັບເຂົ້າ') {
                    qtyText = `+${data.qty}`;
                } else {
                    qtyText = data.adjustment > 0 ? `+${data.adjustment}` : `${data.adjustment}`;
                }

                window.latestActivity[code] = {
                    date: logDate,
                    type: typeLabel,
                    icon: iconClass,
                    user: data.user || 'Admin',
                    qty: qtyText
                };
            }
        };

        adjSnap.forEach(doc => processLog(doc, 'ດັດແກ້', 'fa-edit'));
        inSnap.forEach(doc => processLog(doc, 'ຮັບເຂົ້າ', 'fa-download'));

        const snap = await getDocs(query(collection(db, "equipment_list")));
        window.equipmentDataMap = {}; 
        
        if (snap.empty) {
            tbody.innerHTML = '<tr><td colspan="7" class="p-6 text-center text-red-500 font-bold">ຖານຂໍ້ມູນວ່າງເປົ່າ! ກະລຸນາກົດປຸ່ມ Sync Excel</td></tr>';
            if (alertContainer) alertContainer.classList.add('hidden');
            return;
        }
        
        let itemsArray = []; 
        snap.forEach(doc => { let d = doc.data(); d.id = doc.id; itemsArray.push(d); });
        itemsArray.sort((a, b) => a.code.localeCompare(b.code));

        let lowStockCount = 0;
        let outOfStockCount = 0;
        
        let tableHTML = ''; 
        let datalistHTML = ''; 

        itemsArray.forEach((item, index) => {
            window.equipmentDataMap[item.id] = item;
            const stockVal = item.stock || 0;
            let stockHtml = '';
            
            if(stockVal <= 0) {
                stockHtml = `<span class="text-red-600 font-bold bg-red-100 border border-red-200 px-3 py-1 rounded shadow-sm">ໝົດ (0)</span>`;
                outOfStockCount++;
            } else if(stockVal <= 5) {
                stockHtml = `<span class="text-orange-600 font-bold bg-orange-100 border border-orange-200 px-3 py-1 rounded shadow-sm">ໃກ້ໝົດ (${stockVal})</span>`;
                lowStockCount++;
            } else {
                stockHtml = `<span class="text-green-700 font-bold bg-green-50 border border-green-200 px-3 py-1 rounded shadow-sm">${stockVal}</span>`;
            }

            const actCount = window.historyCounts[item.code] || 0;
            let nameDisplay = item.name;
            let historyBtn = '';

            let latestUpdateHtml = '<span class="text-gray-400 text-xs italic">- ບໍ່ມີການເຄື່ອນໄຫວ -</span>';
            if (window.latestActivity[item.code]) {
                const act = window.latestActivity[item.code];
                const dateStr = `${String(act.date.getDate()).padStart(2, '0')}/${String(act.date.getMonth() + 1).padStart(2, '0')}/${act.date.getFullYear()}`;
                const shortUser = act.user.split('@')[0]; 
                const typeColor = act.type === 'ຮັບເຂົ້າ' ? 'text-blue-600' : 'text-orange-600';
                const qtyColor = act.qty.includes('+') ? 'text-green-600' : 'text-red-600';

                latestUpdateHtml = `
                    <div class="text-xs">
                        <div class="font-bold ${typeColor} mb-0.5"><i class="fas ${act.icon} mr-1"></i>${act.type} <span class="${qtyColor}">${act.qty}</span></div>
                        <div class="text-gray-600 font-medium">👤 ${shortUser}</div>
                        <div class="text-gray-400 text-[10px]">📅 ${dateStr}</div>
                    </div>
                `;
            }

            if(actCount > 0) {
                nameDisplay += ` <span class="ml-2 inline-block bg-purple-100 text-purple-700 text-[10px] font-bold px-1.5 py-0.5 rounded border border-purple-200 whitespace-nowrap"><i class="fas fa-bolt mr-1"></i>${actCount} ຄັ້ງ</span>`;
                
                historyBtn = `<button onclick="viewStockHistory('${item.code}')" class="relative text-white bg-purple-500 hover:bg-purple-600 p-2 rounded mx-1 shadow-sm transition-transform active:scale-95 search-history-btn" data-has-history="true" title="ເບິ່ງປະຫວັດລາຍລະອຽດ">
                    <i class="fas fa-history"></i>
                </button>`;
            } else {
                historyBtn = `<button onclick="viewStockHistory('${item.code}')" class="text-gray-400 hover:text-purple-600 bg-gray-100 hover:bg-purple-50 p-2 rounded mx-1 shadow-sm transition-transform active:scale-95 search-history-btn" data-has-history="false" title="ຍັງບໍ່ມີປະຫວັດ">
                    <i class="fas fa-history"></i>
                </button>`;
            }
            
            tableHTML += `
                <tr class="hover:bg-blue-50/50 search-row transition-colors border-b border-gray-100">
                    <td class="p-3 text-center text-gray-500 font-bold">${index + 1}</td>
                    <td class="p-3 font-bold text-gray-700 code-col">${item.code}</td>
                    <td class="p-3 text-gray-600 name-col">${nameDisplay}</td>
                    <td class="p-3 text-center text-blue-600 font-bold">${item.unit}</td>
                    <td class="p-3 text-center stock-col">${stockHtml}</td>
                    <td class="p-3">${latestUpdateHtml}</td>
                    <td class="p-3 text-center whitespace-nowrap">
                        <button onclick="openEditItemModal('${item.id}')" class="text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 p-2 rounded mx-1 shadow-sm transition-transform active:scale-95" title="ແກ້ໄຂຊື່/ຫົວໜ່ວຍ"><i class="fas fa-pen"></i></button>
                        <button onclick="openAdjustStockModal('${item.id}')" class="text-orange-500 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 p-2 rounded mx-1 shadow-sm transition-transform active:scale-95" title="ປັບສະຕັອກ"><i class="fas fa-edit"></i></button>
                        ${historyBtn}
                        <button onclick="deleteItem('${item.id}')" class="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-2 rounded mx-1 shadow-sm transition-transform active:scale-95" title="ລຶບ"><i class="fas fa-trash"></i></button>
                    </td>
                </tr>
            `;

            datalistHTML += `<option value="${item.code} - ${item.name}"></option>`;
        });

        tbody.innerHTML = tableHTML;
        const searchDatalist = document.getElementById('search-datalist');
        if (searchDatalist) searchDatalist.innerHTML = datalistHTML;

        if (alertContainer) {
            if (lowStockCount > 0 || outOfStockCount > 0) {
                alertContainer.classList.remove('hidden');
                alertContainer.innerHTML = `
                    <div class="bg-red-50 border-l-4 border-red-500 p-5 rounded-xl shadow-sm flex items-start">
                        <div class="flex-shrink-0"><i class="fas fa-exclamation-triangle text-red-500 text-3xl mt-1 animate-pulse"></i></div>
                        <div class="ml-4 w-full">
                            <h3 class="text-red-800 font-bold text-lg mb-1">ແຈ້ງເຕືອນສະຕັອກອຸປະກອນໃກ້ໝົດ</h3>
                            <p class="text-red-600 text-sm font-bold mb-3">ໝົດສາງ ${outOfStockCount} ລາຍການ, ໃກ້ໝົດ ${lowStockCount} ລາຍການ.</p>
                            <div class="flex flex-wrap gap-3">
                                <button onclick="filterLowStock()" class="bg-white hover:bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors border border-red-200 shadow-sm"><i class="fas fa-filter mr-1"></i> ກັ່ນຕອງເບິ່ງເຄື່ອງໃກ້ໝົດ</button>
                                <button onclick="resetFilter()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm"><i class="fas fa-undo mr-1"></i> ເບິ່ງທັງໝົດ</button>
                            </div>
                        </div>
                    </div>
                `;
            } else { alertContainer.classList.add('hidden'); }
        }
    } catch (e) { 
        console.error(e); 
        tbody.innerHTML = `<tr><td colspan="7" class="p-6 text-center text-red-500 font-bold">ເກີດຂໍ້ຜິດພາດ: ${e.message}</td></tr>`;
    }
};

window.filterTable = function() {
    let rawInput = document.getElementById("searchInput").value.toLowerCase();
    let input = rawInput.includes(' - ') ? rawInput.split(' - ')[0].trim() : rawInput;
    let rows = document.getElementsByClassName("search-row");
    for (let i = 0; i < rows.length; i++) {
        let code = rows[i].getElementsByClassName("code-col")[0].innerText.toLowerCase();
        let name = rows[i].getElementsByClassName("name-col")[0].innerText.toLowerCase();
        rows[i].style.display = (code.includes(input) || name.includes(input)) ? "" : "none";
    }
};

window.filterHistoryOnly = function() {
    document.getElementById("searchInput").value = "";
    let rows = document.getElementsByClassName("search-row");
    for (let i = 0; i < rows.length; i++) {
        let btn = rows[i].querySelector('.search-history-btn');
        if (btn && btn.getAttribute('data-has-history') === 'true') {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
};

window.filterLowStock = function() {
    document.getElementById("searchInput").value = "";
    let rows = document.getElementsByClassName("search-row");
    for (let i = 0; i < rows.length; i++) {
        let stockText = rows[i].querySelector('.stock-col').innerText;
        rows[i].style.display = (stockText.includes('ໝົດ') || stockText.includes('ໃກ້ໝົດ')) ? "" : "none";
    }
};

window.resetFilter = function() {
    document.getElementById("searchInput").value = "";
    window.filterTable(); 
};

window.clearAllEquipment = async function() {
    Swal.fire({
        title: 'ລ້າງຖານຂໍ້ມູນທັງໝົດ?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33',
        confirmButtonText: 'ລຶບທັງໝົດເລີຍ!', cancelButtonText: 'ຍົກເລີກ'
    }).then(async (result) => {
        if (result.isConfirmed) {
            Swal.fire({ title: 'ກຳລັງລຶບ...', didOpen: () => Swal.showLoading() });
            const snap = await getDocs(collection(db, "equipment_list"));
            await Promise.all(snap.docs.map(d => deleteDoc(d.ref)));
            Swal.fire('ສຳເລັດ!', 'ຖານຂໍ້ມູນວ່າງເປົ່າແລ້ວ.', 'success');
            window.loadEquipmentList();
        }
    });
};

window.syncDefaultItems = async function() {
    Swal.fire({ title: 'ກຳລັງອັບໂຫຼດ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    try {
        const snapshot = await getDocs(collection(db, "equipment_list"));
        const existingCodes = new Set();
        snapshot.forEach(doc => { existingCodes.add(doc.data().code); });
        const itemsToAdd = window.defaultItemsList.filter(item => !existingCodes.has(item.code));

        if (itemsToAdd.length > 0) {
            await Promise.all(itemsToAdd.map(item => addDoc(collection(db, "equipment_list"), { code: item.code, name: item.name, unit: item.unit, stock: 0 })));
            Swal.fire('ສຳເລັດ!', `ເພີ່ມໃໝ່ ${itemsToAdd.length} ລາຍການ`, 'success'); 
        } else { Swal.fire('ສຳເລັດ!', 'ມີຄົບແລ້ວ', 'success'); }
        window.loadEquipmentList();
    } catch (e) { Swal.fire('ຜິດພາດ', e.message, 'error'); }
};

window.fillModalDetails = function() {
    let val = document.getElementById('swal-code').value;
    if (val.includes(' - ')) val = val.split(' - ')[0].trim();
    
    let found = Object.values(window.equipmentDataMap).find(i => i.code === val);
    if (!found && window.defaultItemsList) found = window.defaultItemsList.find(i => i.code === val);
    
    if (found) {
        document.getElementById('swal-name').value = found.name;
        document.getElementById('swal-unit').value = found.unit;
    }
};

window.openAddItemModal = function() {
    let modalDatalistHTML = '';
    const allItemsMap = new Map();
    
    if (window.defaultItemsList) {
        window.defaultItemsList.forEach(item => { allItemsMap.set(item.code, item); });
    }
    Object.values(window.equipmentDataMap).forEach(item => {
        allItemsMap.set(item.code, item);
    });

    allItemsMap.forEach(item => {
        modalDatalistHTML += `<option value="${item.code} - ${item.name}"></option>`;
    });

    Swal.fire({
        title: 'ເພີ່ມອຸປະກອນໃໝ່',
        html: `
            <div class="text-left space-y-3 mt-4">
                <div>
                    <label class="text-sm font-bold text-gray-700">ລະຫັດອຸປະກອນ</label>
                    <input type="search" id="swal-code" list="modal-datalist" onclick="this.select()" oninput="fillModalDetails()" class="w-full p-2.5 border rounded outline-none focus:ring-2 focus:ring-blue-500 font-bold" placeholder="ພິມ ຫຼື ເລືອກລະຫັດ...">
                    <datalist id="modal-datalist">${modalDatalistHTML}</datalist>
                </div>
                <div><label class="text-sm font-bold text-gray-700">ຊື່ອຸປະກອນ</label><input type="text" id="swal-name" onclick="this.select()" class="w-full p-2.5 border rounded outline-none focus:ring-2 focus:ring-blue-500"></div>
                <div><label class="text-sm font-bold text-gray-700">ຫົວໜ່ວຍ</label><input type="text" id="swal-unit" onclick="this.select()" class="w-full p-2.5 border rounded outline-none focus:ring-2 focus:ring-blue-500 font-bold"></div>
            </div>
        `,
        showCancelButton: true, confirmButtonText: 'ບັນທຶກ', cancelButtonText: 'ຍົກເລີກ',
        preConfirm: () => {
            const code = document.getElementById('swal-code').value.trim();
            const name = document.getElementById('swal-name').value.trim();
            const unit = document.getElementById('swal-unit').value.trim();
            
            const existCheck = Object.values(window.equipmentDataMap).find(i => i.code === code);
            if (existCheck) {
                Swal.showValidationMessage('ລະຫັດນີ້ມີຢູ່ໃນສາງແລ້ວ! ຖ້າຢາກແກ້ໄຂໃຫ້ກົດປຸ່ມສໍ.');
                return false;
            }
            if (!code || !name || !unit) { Swal.showValidationMessage('ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບຖ້ວນ'); return false; }
            return { code, name, unit, stock: 0 };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            Swal.fire({ title: 'ກຳລັງບັນທຶກ...', didOpen: () => Swal.showLoading() });
            await addDoc(collection(db, "equipment_list"), result.value);
            Swal.fire('ສຳເລັດ!', 'ເພີ່ມອຸປະກອນໃໝ່ແລ້ວ', 'success');
            window.loadEquipmentList();
        }
    });
};

window.openEditItemModal = function(docId) {
    const item = window.equipmentDataMap[docId];
    Swal.fire({
        title: 'ແກ້ໄຂຂໍ້ມູນຊື່/ຫົວໜ່ວຍ',
        html: `
            <div class="text-left space-y-3 mt-4">
                <div><label class="text-sm font-bold text-gray-700">ລະຫັດອຸປະກອນ</label><input type="text" id="swal-code" class="w-full p-2.5 border rounded bg-gray-100 font-bold" value="${item.code}" readonly></div>
                <div><label class="text-sm font-bold text-gray-700">ຊື່ອຸປະກອນ</label><input type="text" id="swal-name" onclick="this.select()" class="w-full p-2.5 border rounded outline-none focus:ring-2 focus:ring-blue-500" value="${item.name}"></div>
                <div><label class="text-sm font-bold text-gray-700">ຫົວໜ່ວຍ</label><input type="text" id="swal-unit" onclick="this.select()" class="w-full p-2.5 border rounded outline-none focus:ring-2 focus:ring-blue-500 font-bold" value="${item.unit}"></div>
            </div>
        `,
        showCancelButton: true, confirmButtonText: 'ອັບເດດ', cancelButtonText: 'ຍົກເລີກ', confirmButtonColor: '#3b82f6',
        preConfirm: () => {
            return { name: document.getElementById('swal-name').value, unit: document.getElementById('swal-unit').value };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            Swal.fire({ title: 'ກຳລັງອັບເດດ...', didOpen: () => Swal.showLoading() });
            await updateDoc(doc(db, "equipment_list", docId), result.value);
            Swal.fire('ສຳເລັດ!', 'ແກ້ໄຂອຸປະກອນສຳເລັດແລ້ວ', 'success');
            window.loadEquipmentList();
        }
    });
};

window.openAdjustStockModal = function(docId) {
    const item = window.equipmentDataMap[docId];
    Swal.fire({
        title: 'ປັບສະຕັອກ',
        html: `
            <div class="text-left space-y-3 mt-4">
                <div class="bg-gray-100 p-3 rounded font-bold text-gray-600">ສະຕັອກປັດຈຸບັນ: <span class="text-blue-600">${item.stock}</span> ${item.unit}</div>
                <div>
                    <label class="text-sm font-bold text-gray-700">ຈຳນວນທີ່ຕ້ອງການປັບ (+ ເພີ່ມ, - ລົດ)</label>
                    <input type="number" id="swal-adjustment" onclick="this.select()" class="w-full p-2.5 border rounded outline-none focus:ring-2 focus:ring-orange-500 font-bold text-center text-lg" placeholder="ຕົວຢ່າງ: 5 ຫຼື -2">
                </div>
                <div>
                    <label class="text-sm font-bold text-gray-700">ເຫດຜົນການປັບ</label>
                    <input type="text" id="swal-remark" class="w-full p-2.5 border rounded outline-none focus:ring-2 focus:ring-orange-500" placeholder="ຕົວຢ່າງ: ນັບຜິດ, ເຄື່ອງເສຍ...">
                </div>
            </div>
        `,
        showCancelButton: true, confirmButtonText: 'ຢືນຢັນການປັບ', confirmButtonColor: '#f97316', cancelButtonText: 'ຍົກເລີກ',
        preConfirm: () => {
            const adj = parseInt(document.getElementById('swal-adjustment').value);
            const remark = document.getElementById('swal-remark').value;
            if (isNaN(adj)) { Swal.showValidationMessage('ກະລຸນາປ້ອນຕົວເລກໃຫ້ຖືກຕ້ອງ'); return false; }
            if (!remark) { Swal.showValidationMessage('ກະລຸນາໃສ່ເຫດຜົນ'); return false; }
            return { adj, remark };
        }
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                Swal.fire({ title: 'ກຳລັງປັບຂໍ້ມູນ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
                const newStock = item.stock + result.value.adj;
                await updateDoc(doc(db, "equipment_list", docId), { stock: newStock });
                
                await addDoc(collection(db, "adjustment_logs"), {
                    code: item.code, name: item.name, oldStock: item.stock,
                    newStock: newStock, adjustment: result.value.adj, remark: result.value.remark,
                    date: new Date(), user: auth.currentUser?.email || 'Admin'
                });

                Swal.fire('ສຳເລັດ!', 'ປັບສະຕັອກຮຽບຮ້ອຍແລ້ວ', 'success');
                window.loadEquipmentList();
            } catch (e) { Swal.fire('ຜິດພາດ', e.message, 'error'); }
        }
    });
};

window.viewStockHistory = async function(code) {
    Swal.fire({ title: 'ກຳລັງໂຫຼດປະຫວັດ...', didOpen: () => Swal.showLoading() });
    try {
        let logsArray = [];
        const qAdj = query(collection(db, "adjustment_logs"), where("code", "==", code));
        const snapAdj = await getDocs(qAdj);
        snapAdj.forEach(doc => {
            let data = doc.data();
            data.logType = 'ADJUST';
            logsArray.push(data);
        });

        const qIn = query(collection(db, "inventory_logs"), where("code", "==", code), where("type", "==", "IN"));
        const snapIn = await getDocs(qIn);
        snapIn.forEach(doc => {
            let data = doc.data();
            data.logType = 'RECEIVE';
            logsArray.push(data);
        });

        if (logsArray.length === 0) {
            Swal.fire('ບໍ່ມີປະຫວັດ', 'ຍັງບໍ່ມີການເຄື່ອນໄຫວໃດໆສຳລັບອຸປະກອນນີ້', 'info');
            return;
        }

        logsArray.sort((a, b) => b.date.toDate() - a.date.toDate());

        let historyHtml = '<div class="text-left space-y-3 max-h-[60vh] overflow-y-auto px-1">';
        
        logsArray.forEach(data => {
            const dateObj = data.date.toDate();
            const dateStr = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
            
            let actionBadge = '';
            let detailText = '';
            let userEmail = data.user || 'Admin ລະບົບ';

            if (data.logType === 'ADJUST') {
                actionBadge = `<span class="bg-orange-100 text-orange-700 border border-orange-300 px-2 py-0.5 rounded text-[11px] font-bold"><i class="fas fa-edit mr-1"></i> ດັດແກ້</span>`;
                detailText = `ປັບສະຕັອກ: <span class="${data.adjustment > 0 ? 'text-green-600' : 'text-red-600'} font-bold bg-white px-2 py-0.5 rounded border">${data.adjustment > 0 ? '+' : ''}${data.adjustment}</span> (ຈາກ <b>${data.oldStock}</b> ເປັນ <b>${data.newStock}</b>)`;
            } else if (data.logType === 'RECEIVE') {
                actionBadge = `<span class="bg-blue-100 text-blue-700 border border-blue-300 px-2 py-0.5 rounded text-[11px] font-bold"><i class="fas fa-download mr-1"></i> ຮັບເຂົ້າສາງ</span>`;
                detailText = `ຈຳນວນຮັບເຂົ້າ: <span class="text-blue-600 font-bold bg-white px-2 py-0.5 rounded border">+${data.qty}</span>`;
            }

            historyHtml += `
                <div class="p-3 border rounded-lg bg-gray-50/80 shadow-sm relative">
                    <div class="flex justify-between items-center mb-2 border-b pb-2">
                        <p class="font-bold text-gray-700 text-xs"><i class="fas fa-clock mr-1 text-gray-400"></i> ${dateStr}</p>
                        ${actionBadge}
                    </div>
                    <p class="text-sm text-gray-800">${detailText}</p>
                    <p class="text-gray-500 italic mt-1 text-xs"><i class="fas fa-comment-dots mr-1"></i> ເຫດຜົນ: ${data.remark}</p>
                    <div class="mt-2 pt-2 border-t border-dashed flex items-center">
                        <i class="fas fa-user-circle text-gray-400 mr-1.5 text-lg"></i>
                        <span class="text-xs font-bold text-gray-600">👤 ຜູ້ບັນທຶກ: <span class="text-blue-600">${userEmail}</span></span>
                    </div>
                </div>
            `;
        });
        historyHtml += '</div>';

        Swal.fire({ title: 'ປະຫວັດການເຄື່ອນໄຫວ', html: historyHtml, width: '500px', confirmButtonText: 'ປິດ' });
    } catch (e) { Swal.fire('ຜິດພາດ', e.message, 'error'); }
};

window.loadEquipmentList();