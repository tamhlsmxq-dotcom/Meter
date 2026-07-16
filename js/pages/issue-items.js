import { auth, db, collection, getDocs, doc, updateDoc, increment, addDoc } from '../../firebase-config.js';

window.dbItemsList = []; 
window.cart = []; 

window.toggleSidebar = () => { 
    document.getElementById('sidebar-container').classList.toggle('-translate-x-full'); 
    document.getElementById('sidebarOverlay').classList.toggle('hidden'); 
};

async function initIssuePage() {
    try {
        const snap = await getDocs(collection(db, "equipment_list"));
        const datalist = document.getElementById('items-list');
        window.dbItemsList = [];

        snap.forEach(doc => { 
            let data = doc.data();
            data.id = doc.id; 
            window.dbItemsList.push(data); 
        });
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
initIssuePage();

window.fillDetails = function() {
    let val = document.getElementById('itemCode').value;
    if (val.includes(' - ')) {
        val = val.split(' - ')[0].trim();
        document.getElementById('itemCode').value = val;
    }
    
    const found = window.dbItemsList.find(i => i.code === val);
    const infoDisplay = document.getElementById('stockInfoDisplay');
    
    if (found) {
        let color = found.stock > 0 ? 'text-green-600' : 'text-red-600';
        infoDisplay.innerHTML = `ຊື່ອຸປະກອນ: <span class="font-bold text-gray-800">${found.name}</span> | ສະຕັອກປັດຈຸບັນ: <span class="font-bold ${color}">${found.stock} ${found.unit}</span>`;
        document.getElementById('itemCode').setAttribute('data-id', found.id);
        document.getElementById('itemCode').setAttribute('data-name', found.name);
        document.getElementById('itemCode').setAttribute('data-unit', found.unit);
        document.getElementById('itemCode').setAttribute('data-stock', found.stock);
    } else {
        infoDisplay.innerHTML = 'ເລືອກອຸປະກອນເພື່ອເບິ່ງຈຳນວນໃນສາງ...';
        document.getElementById('itemCode').removeAttribute('data-id');
    }
};

window.addToCart = function() {
    const codeInput = document.getElementById('itemCode');
    const code = codeInput.value.trim();
    const docId = codeInput.getAttribute('data-id');
    const name = codeInput.getAttribute('data-name');
    const unit = codeInput.getAttribute('data-unit');
    const availableStock = parseInt(codeInput.getAttribute('data-stock')) || 0;
    const qty = parseInt(document.getElementById('itemQty').value);

    if (!docId) return Swal.fire('ແຈ້ງເຕືອນ', 'ກະລຸນາເລືອກອຸປະກອນທີ່ຖືກຕ້ອງ', 'warning');
    if (!qty || qty <= 0) return Swal.fire('ແຈ້ງເຕືອນ', 'ກະລຸນາປ້ອນຈຳນວນທີ່ຫຼາຍກວ່າ 0', 'warning');
    
    if (qty > availableStock) {
        return Swal.fire('ແຈ້ງເຕືອນ', `ສະຕັອກບໍ່ພໍ! ມີພຽງແຕ່ ${availableStock} ${unit}`, 'error');
    }

    const existingItem = window.cart.find(i => i.code === code);
    if (existingItem) {
        if (existingItem.qty + qty > availableStock) {
            return Swal.fire('ແຈ້ງເຕືອນ', 'ລວມຈຳນວນໃນບິນແລ້ວເກີນສະຕັອກທີ່ມີ!', 'error');
        }
        existingItem.qty += qty;
    } else {
        window.cart.push({ docId, code, name, unit, qty });
    }

    renderCart();
    document.getElementById('itemCode').value = '';
    document.getElementById('itemQty').value = '';
    document.getElementById('stockInfoDisplay').innerHTML = 'ເລືອກອຸປະກອນເພື່ອເບິ່ງຈຳນວນໃນສາງ...';
};

window.removeFromCart = function(index) {
    window.cart.splice(index, 1);
    renderCart();
};

function renderCart() {
    const tbody = document.getElementById('cartTableBody');
    if (window.cart.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="p-8 text-center text-gray-400 italic">ຍັງບໍ່ມີລາຍການ. ກະລຸນາເລືອກເຄື່ອງແລ້ວກົດ "ເພີ່ມລົງບິນ"</td></tr>';
        return;
    }

    let html = '';
    window.cart.forEach((item, index) => {
        html += `
            <tr class="hover:bg-gray-50 border-b">
                <td class="p-3 text-center border-r">${index + 1}</td>
                <td class="p-3 font-bold border-r">${item.code}</td>
                <td class="p-3 border-r">${item.name}</td>
                <td class="p-3 text-center font-bold text-blue-600 border-r">${item.qty} ${item.unit}</td>
                <td class="p-3 text-center">
                    <button onclick="removeFromCart(${index})" class="text-red-500 hover:text-red-700 bg-red-50 p-2 rounded shadow-sm"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

window.confirmAndPrint = async function() {
    if (window.cart.length === 0) return Swal.fire('ແຈ້ງເຕືອນ', 'ກະຕ່າວ່າງເປົ່າ! ກະລຸນາເພີ່ມເຄື່ອງລົງບິນກ່ອນ.', 'warning');
    
    const department = document.getElementById('departmentName').value.trim();
    const receiver = document.getElementById('receiverName').value.trim();
    const remark = document.getElementById('issueRemark').value.trim(); 

    if (!department) return Swal.fire('ແຈ້ງເຕືອນ', 'ກະລຸນາເລືອກ ຫຼື ປ້ອນຊື່ໜ່ວຍງານເບີກ!', 'warning');
    if (!receiver) return Swal.fire('ແຈ້ງເຕືອນ', 'ກະລຸນາປ້ອນຊື່ຜູ້ຮັບເຄື່ອງ!', 'warning');
    if (!remark) return Swal.fire('ແຈ້ງເຕືອນ', 'ກະລຸນາເລືອກ ຫຼື ປ້ອນເຫດຜົນນຳໃຊ້!', 'warning');

    Swal.fire({
        title: 'ຢືນຢັນການເບີກເຄື່ອງ?',
        text: `ເບີກເຄື່ອງໃຫ້ ${receiver} (${department}) ຈຳນວນ ${window.cart.length} ລາຍການ`,
        icon: 'question',
        showCancelButton: true, confirmButtonColor: '#16a34a',
        confirmButtonText: 'ຢືນຢັນ ແລະ ພິມ', cancelButtonText: 'ຍົກເລີກ'
    }).then(async (result) => {
        if (result.isConfirmed) {
            Swal.fire({ title: 'ກຳລັງບັນທຶກ ແລະ ຕັດສະຕັອກ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

            try {
                const currentUser = auth.currentUser?.email || 'Admin';
                const issueDate = new Date();
                const receiptNo = "REC" + issueDate.getTime().toString().slice(-6); 

                const updatePromises = window.cart.map(item => {
                    const updateStock = updateDoc(doc(db, "equipment_list", item.docId), {
                        stock: increment(-item.qty)
                    });
                    
                    const addLog = addDoc(collection(db, "inventory_logs"), {
                        code: item.code, name: item.name, qty: item.qty, type: 'OUT',
                        date: issueDate, 
                        remark: `ໜ່ວຍງານ: ${department} | ຜູ້ຮັບ: ${receiver} | ເຫດຜົນ: ${remark}`, 
                        user: currentUser,
                        receiptNo: receiptNo, 
                        department: department
                    });
                    
                    return Promise.all([updateStock, addLog]);
                });

                await Promise.all(updatePromises);
                
                generatePrintLayout(receiptNo, department, receiver, remark, issueDate, currentUser);

                Swal.fire({
                    icon: 'success', title: 'ບັນທຶກສຳເລັດ!', text: 'ກຳລັງກະກຽມໜ້າພິມ...',
                    timer: 1500, showConfirmButton: false
                }).then(() => {
                    window.print(); 
                    
                    window.cart = [];
                    renderCart();
                    document.getElementById('departmentName').value = '';
                    document.getElementById('receiverName').value = '';
                    document.getElementById('issueRemark').value = '';
                    initIssuePage(); 
                });

            } catch (error) {
                console.error(error);
                Swal.fire('ຜິດພາດ', error.message, 'error');
            }
        }
    });
};

function generatePrintLayout(receiptNo, department, receiver, remark, dateObj, issuer) {
    const printArea = document.getElementById('printArea');
    const dateStr = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
    const timeStr = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
    
    let tableRows = '';
    window.cart.forEach((item, index) => {
        tableRows += `
            <tr>
                <td style="text-align: center; padding: 10px;">${index + 1}</td>
                <td style="font-weight: bold; padding: 10px;">${item.code}</td>
                <td style="padding: 10px;">${item.name}</td>
                <td style="text-align: center; font-weight: bold; padding: 10px;">${item.qty} ${item.unit}</td>
                <td style="padding: 10px;"></td>
            </tr>
        `;
    });

    const html = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 26px; font-weight: bold; margin-bottom: 5px;">ໃບເບີກຈ່າຍວັດສະດຸ-ອຸປະກອນ</h1>
            <p style="color: #4b5563; font-size: 16px;">ສາງໝໍ້ແທກນ້ຳ</p>
        </div>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 25px; font-size: 15px; line-height: 1.8;">
            <div>
                <p><strong>ໜ່ວຍງານເບີກ:</strong> ${department}</p>
                <p><strong>ຊື່ຜູ້ຮັບເຄື່ອງ:</strong> ${receiver}</p>
                <p><strong>ເຫດຜົນນຳໃຊ້:</strong> ${remark}</p>
            </div>
            <div style="text-align: right;">
                <p><strong>ເລກທີບິນ:</strong> ${receiptNo}</p>
                <p><strong>ວັນທີເບີກ:</strong> ${dateStr} ເວລາ: ${timeStr}</p>
                <p><strong>ຜູ້ອອກບິນ:</strong> ${issuer.split('@')[0]}</p>
            </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 50px; font-size: 15px;">
            <thead>
                <tr>
                    <th style="width: 50px; padding: 10px; border: 1px solid #000;">ລ/ດ</th>
                    <th style="width: 150px; padding: 10px; border: 1px solid #000;">ລະຫັດ</th>
                    <th style="padding: 10px; border: 1px solid #000;">ລາຍການອຸປະກອນ</th>
                    <th style="width: 100px; padding: 10px; border: 1px solid #000;">ຈຳນວນ</th>
                    <th style="width: 150px; padding: 10px; border: 1px solid #000;">ໝາຍເຫດ</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>

        <div style="display: flex; justify-content: space-around; margin-top: 60px; text-align: center; font-size: 15px;">
            <div>
                <p style="margin-bottom: 70px; font-weight: bold;">ຜູ້ອະນຸມັດ / ຜູ້ມອບເຄື່ອງ</p>
                <p>.............................................</p>
                <p style="margin-top: 8px; color: #6b7280; font-size: 13px;">(ລາຍເຊັນ ແລະ ແຈ້ງຊື່)</p>
            </div>
            <div>
                <p style="margin-bottom: 70px; font-weight: bold;">ຜູ້ຮັບເຄື່ອງ</p>
                <p>.............................................</p>
                <p style="margin-top: 8px; color: #6b7280; font-size: 13px;">(ລາຍເຊັນ ແລະ ແຈ້ງຊື່)</p>
            </div>
        </div>
    `;
    
    document.getElementById('printArea').innerHTML = html;
}