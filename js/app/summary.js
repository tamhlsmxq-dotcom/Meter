// summary.js

// 1. ເພີ່ມການ Import auth ແລະ addDoc ຈາກໄຟລ໌ຂອງທ່ານ 
import { auth, db, collection, getDocs, query, where, orderBy, addDoc } from '../../firebase-config.js';
// 2. Import ຟັງຊັນສຳລັບການແຊັດແບບ Real-time ຈາກ Firebase ໂດຍກົງ
import { onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

document.getElementById('doc-year-text').innerText = new Date().getFullYear();
const now = new Date();
document.getElementById('summaryMonthPicker').value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
flatpickr(".datepicker", { dateFormat: "Y-m-d", altInput: true, altFormat: "d/m/Y", defaultDate: "today" });

window.applyDatePreset = function() {
    const preset = document.getElementById('datePreset').value;
    const y = now.getFullYear();
    const m = now.getMonth();
    let start, end;
    
    document.getElementById('summaryMonthPicker').value = ''; 
    if (preset === 'custom') return;
    
    switch(preset) {
        case 'thisMonth': start = new Date(y, m, 1); end = new Date(y, m + 1, 0); break;
        case 'lastMonth': start = new Date(y, m - 1, 1); end = new Date(y, m, 0); break;
        case 'all': start = new Date(2000, 0, 1); end = new Date(2100, 11, 31); break;
        case 'm3': start = new Date(y, 0, 1); end = new Date(y, 2, 31); break;
        case 'm6': start = new Date(y, 0, 1); end = new Date(y, 5, 30); break;
        case 'year': start = new Date(y, 0, 1); end = new Date(y, 11, 31); break;
    }
    
    const format = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    document.getElementById('summaryStartDate')._flatpickr.setDate(format(start));
    document.getElementById('summaryEndDate')._flatpickr.setDate(format(end));
};

window.applySummaryMonth = function() {
    document.getElementById('datePreset').value = 'custom';
    const val = document.getElementById('summaryMonthPicker').value;
    if(!val) return;
    const [yyyy, mm] = val.split('-');
    const start = new Date(yyyy, Number(mm) - 1, 1);
    const end = new Date(yyyy, Number(mm), 0);
    const format = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    document.getElementById('summaryStartDate')._flatpickr.setDate(format(start));
    document.getElementById('summaryEndDate')._flatpickr.setDate(format(end));
};

window.generateSummary = async function() {
    const startDateVal = document.getElementById('summaryStartDate').value;
    const endDateVal = document.getElementById('summaryEndDate').value;
    const employeeVal = document.getElementById('summaryEmployee').value;
    
    if(!startDateVal || !endDateVal) { Swal.fire('ແຈ້ງເຕືອນ', 'ກະລຸນາເລືອກວັນທີໃຫ້ຄົບຖ້ວນ', 'warning'); return; }
    Swal.fire({ title: 'ກຳລັງປະມວນຜົນ...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); }});
    
    try {
        const start = new Date(startDateVal + "T00:00:00");
        const end = new Date(endDateVal + "T23:59:59");
        
        document.getElementById('doc-year-text').innerText = start.getFullYear();
        
        let q = (employeeVal === 'all') 
            ? query(collection(db, "reports"), where("timestamp", ">=", start), where("timestamp", "<=", end), orderBy("timestamp", "asc"))
            : query(collection(db, "reports"), where("employeeName", "==", employeeVal), where("timestamp", ">=", start), where("timestamp", "<=", end), orderBy("timestamp", "asc"));
        
        const snapshot = await getDocs(q);
        const tbodyOfficial = document.getElementById('summaryTableBodyOfficial');
        tbodyOfficial.innerHTML = '';
        
        if (snapshot.empty) {
            tbodyOfficial.innerHTML = '<tr><td colspan="7" class="border border-black p-6 text-center text-red-500 font-bold">ບໍ່ມີຂໍ້ມູນໃນຊ່ວງເວລານີ້</td></tr>';
            Swal.close(); return;
        }
        
        let index = 1;
        snapshot.forEach(doc => {
            const data = doc.data();
            const items = data.items || [];
            const reportNo = data.reportNumber || '';
            const dateParts = (data.date || '').split('-');
            const dateStr = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : data.date;
            
            const rType = data.recordType || 'warehouse'; 
            const typeText = rType === 'warehouse' ? 'ເບີກສາງ' : 'ປ່ຽນຖ່າຍ';
            
            items.forEach((item, i) => {
                const isFirstItem = (i === 0); 
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="border border-black p-2 text-center font-bold">${index++}</td>
                    <td class="border border-black p-2 text-center font-bold" style="mso-number-format:'\\@'">${item.code || ''}</td>
                    <td class="border border-black p-2">${item.name || ''}</td>
                    <td class="border border-black p-2 text-center font-bold">${item.quantity || item.qty || 0}</td>
                    <td class="border border-black p-2 text-center font-bold">${item.unit || ''}</td>
                    <td class="border border-black p-2 text-center text-xs font-bold">${isFirstItem ? reportNo : ''}</td>
                    <td class="border border-black p-2 text-center text-xs text-blue-600">${typeText} <br> <span class="text-gray-500">${isFirstItem ? dateStr : ''}</span></td>
                `;
                tbodyOfficial.appendChild(tr);
            });
        });
        
        const [sy, sm] = startDateVal.split('-');
        const [ey, em] = endDateVal.split('-');
        let periodText = (sm === em && sy === ey) ? `ປະຈຳເດືອນ ${sm}/${sy}` : `ປະຈຳວັນທີ ${startDateVal.split('-').reverse().join('/')} ຫາ ${endDateVal.split('-').reverse().join('/')}`;
        if(document.getElementById('datePreset').value === 'all') periodText = "ຂໍ້ມູນທັງໝົດ";
        document.getElementById('doc-title-period').innerText = `ໃບສັງລວມວັດຖຸ - ອຸປະກອນ ຍົກຍ້າຍ - ປ່ຽນຖ່າຍ ${periodText}`;
        
        const empName = (employeeVal === 'all') ? "" : employeeVal;
        document.getElementById('doc-employee-name').innerText = empName;
        document.getElementById('sign-employee-name').innerText = empName || ".......................................";
        
        Swal.close();
    } catch (error) { Swal.fire('ຜິດພາດ', 'ບໍ່ສາມາດໂຫຼດຂໍ້ມູນໄດ້: ' + error.message, 'error'); }
};

window.exportExcel = function() {
    const reportContainer = document.getElementById("official-report-container").cloneNode(true);
    const tables = reportContainer.getElementsByTagName("table");
    for(let i=0; i<tables.length; i++) tables[i].setAttribute("border", "1");

    const htmlData = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: 'Times New Roman', 'Phetsarath OT', 'Noto Sans Lao', serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid black; padding: 5px; text-align: left; vertical-align: middle; }
            .text-center { text-align: center; }
            .font-bold { font-weight: bold; }
            .text-right { text-align: right; }
        </style>
    </head>
    <body>${reportContainer.innerHTML}</body>
    </html>
    `;

    const blob = new Blob([htmlData], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ໃບສັງລວມອຸປະກອນ_${new Date().getTime()}.xls`;
    a.click();
    URL.revokeObjectURL(url);
};


// ==========================================
// 3. ລະບົບປະຫວັດການສົນທະນາ (Chat System)
// ==========================================
const CHAT_CONTEXT = "summary_page_general_chat"; 
const chatContainer = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendChatBtn = document.getElementById('send-chat-btn');

function loadChats() {
    const messagesRef = collection(db, "data_context_chats", CHAT_CONTEXT, "messages");
    const qChat = query(messagesRef, orderBy("timestamp", "asc"));
    
    // ດຶງຂໍ້ມູນແບບ Real-time ເມື່ອມີຄົນສົ່ງຂໍ້ຄວາມມາໃໝ່
    onSnapshot(qChat, (snapshot) => {
        chatContainer.innerHTML = '';
        snapshot.forEach(doc => {
            const data = doc.data();
            const currentUserEmail = auth.currentUser?.email || 'Admin';
            const isMe = data.sender === currentUserEmail; // ກວດວ່າແມ່ນຂໍ້ຄວາມຂອງເຮົາ ຫຼື ຂອງຄົນອື່ນ
            
            const timeStr = data.timestamp ? new Date(data.timestamp.toDate()).toLocaleTimeString('lo-LA', {hour: '2-digit', minute:'2-digit'}) : '';
            const shortSender = data.sender.split('@')[0]; // ຕັດເອົາແຕ່ຊື່ກ່ອນ @
            
            const bubble = document.createElement('div');
            bubble.className = `flex flex-col ${isMe ? 'items-end' : 'items-start'}`;
            bubble.innerHTML = `
                <span class="text-[10px] text-gray-500 mb-1 px-1">${shortSender} • ${timeStr}</span>
                <div class="${isMe ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-800'} px-4 py-2 rounded-2xl max-w-[85%] shadow-sm text-sm font-bold">
                    ${data.content}
                </div>
            `;
            chatContainer.appendChild(bubble);
        });
        // ເລື່ອນແຖບແຊັດລົງໄປລຸ່ມສຸດອັດຕະໂນມັດ
        chatContainer.scrollTop = chatContainer.scrollHeight;
    });
}

async function sendChatMessage() {
    const text = chatInput.value.trim();
    if(!text) return;
    
    const messagesRef = collection(db, "data_context_chats", CHAT_CONTEXT, "messages");
    try {
        await addDoc(messagesRef, {
            content: text,
            sender: auth.currentUser?.email || 'Admin',
            timestamp: serverTimestamp() // ໃຊ້ເວລາຈາກ Server ເພື່ອໃຫ້ລຽງລຳດັບໄດ້ຖືກຕ້ອງ
        });
        chatInput.value = ''; // ລ້າງຊ່ອງພິມຫຼັງຈາກສົ່ງ
    } catch(e) {
        console.error("ເກີດຂໍ້ຜິດພາດໃນການສົ່ງແຊັດ:", e);
    }
}

// ຜູກປຸ່ມກົດສົ່ງ ແລະ ປຸ່ມ Enter ຈາກຄີບອດ
if(sendChatBtn && chatInput) {
    sendChatBtn.addEventListener('click', sendChatMessage);
    chatInput.addEventListener('keypress', e => { 
        if(e.key === 'Enter') sendChatMessage(); 
    });
}

// ເອີ້ນໃຊ້ຟັງຊັນຕ່າງໆທັນທີທີ່ໂຫຼດໄຟລ໌
window.applyDatePreset();
loadChats(); // ເອີ້ນໂຫຼດແຊັດທັນທີ
