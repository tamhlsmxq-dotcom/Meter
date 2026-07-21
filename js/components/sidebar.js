// =========================================================================
// 🧠 ໂລຈິກກວດສອບຜູ້ໃຊ້ & Dynamic Routing (ພ້ອມລະບົບ Real-time Online Users)
// =========================================================================
const userDataStr = localStorage.getItem('wm_user_data');
const userData = userDataStr ? JSON.parse(userDataStr) : { fullName: 'ແອດມິນລະບົບ', email: 'admin@meter.com', role: 'system_manager', permissions: {} };

const userName = userData.fullName || 'ແອດມິນລະບົບ';
const userEmail = userData.email || 'admin@meter.com';
const role = userData.role || 'system_manager';

const isAdmin = userEmail.includes('admin') || role === 'system_manager' || role === 'super_admin';

// ປ່ຽນຊື່ Role ເປັນພາສາລາວຕາມທີ່ຕັ້ງຄ່າ
let userRole = 'ພະນັກງານວິຊາການ';
if (role === 'system_manager' || isAdmin) userRole = 'ຜູ້ບໍລິຫານລະບົບ (Super Admin)';
else if (role === 'department_head') userRole = 'ຫົວໜ້າພະແນກ';
else if (role === 'section_head') userRole = 'ຫົວໜ້າພາກສ່ວນ';
else if (role === 'warehouse_manager') userRole = 'ຜູ້ຈັດການສາງ';

const avatarText = userName.charAt(0).toUpperCase();

const adminBadge = isAdmin 
    ? `<span class="inline-flex items-center justify-center ml-2 px-1.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[9px] font-extrabold tracking-wider uppercase"><svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg> Admin</span>` 
    : '';

// 🌟 ໂລຈິກຄຳນວນ Path ປ້ອງກັນ 404 (Auto Base URL)
const currentPath = window.location.pathname;
const base = currentPath.includes('/pages/') ? '../..' : '.';

document.getElementById('sidebar-container').innerHTML = `
<!-- ແຖບ Sidebar ຫຼັກ -->
<aside class="w-64 h-screen bg-slate-900 text-slate-300 fixed left-0 top-0 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.15)] z-40">
    
    <div class="h-20 flex items-center px-6 border-b border-slate-700/50 bg-slate-900 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-full bg-indigo-500/10 blur-xl"></div>
        <div class="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 mr-3 relative z-10 transition-transform duration-500 hover:rotate-12 cursor-default">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 14L15.5 8.5"></path>
            </svg>
        </div>
        <div class="relative z-10">
            <h1 class="text-xl font-extrabold text-white tracking-wider">Water<span class="text-blue-400">Meter</span></h1>
        </div>
    </div>

    <!-- ເມນູຕ່າງໆ -->
    <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
        <p class="px-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">ເມນູຫຼັກ (Main Menu)</p>

        <a href="${base}/index.html" class="nav-link flex items-center px-4 py-3.5 rounded-xl text-slate-400 transition-all duration-300 group active:scale-[0.98] border border-transparent" data-path="/index.html">
            <svg class="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span class="font-bold text-sm">ໜ້າຫຼັກ (Dashboard)</span>
        </a>

        <a href="${base}/pages/warehouse/inventory.html" class="nav-link flex items-center px-4 py-3.5 rounded-xl text-slate-400 transition-all duration-300 group active:scale-[0.98] border border-transparent" data-path="/inventory.html">
            <svg class="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            <span class="font-bold text-sm">ສະຕັອກສິນຄ້າ</span>
        </a>

        <a href="${base}/pages/warehouse/receive-items.html" class="nav-link flex items-center px-4 py-3.5 rounded-xl text-slate-400 transition-all duration-300 group active:scale-[0.98] border border-transparent" data-path="/receive-items.html">
            <svg class="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
            <span class="font-bold text-sm">ຮັບເຄື່ອງເຂົ້າສາງ</span>
        </a>

        ${isAdmin ? `
        <p class="px-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-3 mt-6">ສຳລັບຜູ້ບໍລິຫານ (Admin)</p>
        <a href="${base}/pages/admin/manage-users.html" class="nav-link flex items-center px-4 py-3.5 rounded-xl text-slate-400 transition-all duration-300 group active:scale-[0.98] border border-transparent" data-path="/manage-users.html">
            <svg class="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <span class="font-bold text-sm">ຈັດການຜູ້ໃຊ້ລະບົບ</span>
        </a>
        ` : ''}

        <a href="${base}/pages/warehouse/issue-items.html" class="nav-link flex items-center px-4 py-3.5 rounded-xl text-slate-400 transition-all duration-300 group active:scale-[0.98] border border-transparent" data-path="/issue-items.html">
            <svg class="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
            <span class="font-bold text-sm">ເບີກຈ່າຍອຸປະກອນ</span>
        </a>

        <!-- 🟢 ລາຍຊື່ເພື່ອນຮ່ວມງານທີ່ Online (ດຶງຈາກຕົວຈິງ) 🟢 -->
        <div class="mt-8 mb-2">
            <div class="flex items-center justify-between px-3 mb-3">
                <p class="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">ທີມງານທີ່ອອນໄລນ໌</p>
                <span id="online-count" class="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                    <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse"></span> 0 ຄົນ
                </span>
            </div>
            
            <div id="online-users-list" class="px-2 space-y-1">
                <p class="text-[10px] text-slate-500 text-center py-2">ກຳລັງກວດສອບ...</p>
            </div>
        </div>
    </nav>

    <!-- 🟢 ສ່ວນຜູ້ໃຊ້ ແລະ ປຸ່ມອອກຈາກລະບົບ 🟢 -->
    <div class="p-4 border-t border-slate-700/50 bg-slate-800/30">
        <div class="flex items-center mb-4 px-2 hover:bg-slate-700/30 p-2 rounded-xl transition-colors cursor-pointer group">
            
            <div class="relative mr-3">
                <div class="w-10 h-10 rounded-full ${isAdmin ? 'bg-gradient-to-br from-amber-500 to-orange-600 border-amber-400 text-white' : 'bg-slate-700 border-slate-600 text-white'} flex items-center justify-center font-bold text-base border shadow-inner transition-colors">
                    ${avatarText}
                </div>
                <div class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-800 rounded-full">
                    <div class="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-75"></div>
                </div>
            </div>

            <div class="overflow-hidden">
                <p class="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center truncate">
                    ${userName} ${adminBadge}
                </p>
                <p class="text-[10.5px] text-slate-400 font-medium truncate">${userRole}</p>
                <p class="text-[9px] text-slate-500 font-medium truncate mt-0.5">${userEmail}</p>
            </div>
        </div>
        
        <button id="btn-logout" class="flex items-center justify-center w-full px-4 py-2.5 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 hover:border-rose-500 rounded-xl transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] active:scale-95">
            <svg class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span class="font-bold text-sm tracking-wide">ອອກຈາກລະບົບ</span>
        </button>
    </div>
</aside>
`;

// 🌟 ລະບົບ Highlight ເມນູອັດຕະໂນມັດ 🌟
(function() {
    const currentLoc = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const pathData = link.getAttribute('data-path');
        if (currentLoc.includes(pathData) || (currentLoc === '/' && pathData === '/index.html')) {
            link.classList.remove('text-slate-400');
            link.classList.add(
                'bg-gradient-to-r', 'from-indigo-600/20', 'to-transparent', 
                'text-indigo-400', 'border-indigo-500/50', 'shadow-[inset_4px_0_0_rgba(99,102,241,1)]'
            );
        } else {
            link.classList.add('hover:bg-slate-800/60', 'hover:text-indigo-300', 'hover:border-slate-700/50');
        }
    });
})();

// =========================================================================
// 🚀 ລະບົບຈັດການສະຖານະ Online ຕົວຈິງ ແລະ Auto Logout
// =========================================================================
let updateStatusToOffline = async () => {}; // ຟັງຊັນສຳຮອງ

async function initRealtimePresence() {
    try {
        // Dynamic Import ເພື່ອບໍ່ໃຫ້ກະທົບກັບໂຄງສ້າງໜ້າເວັບເກົ່າທີ່ໃຊ້ <script defer>
        const { db } = await import(base + '/firebase-config.js');
        const { collection, query, where, getDocs, updateDoc, doc, onSnapshot, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
        
        const usersRef = collection(db, 'users');
        let currentUserDocId = null;

        // 1️⃣ ອັບເດດສະຖານະຕົວເອງໃຫ້ເປັນ Online (isOnline: true)
        if (userEmail && userEmail !== 'admin@meter.com') { // ຂ້າມໄອດີ Admin ທີ່ເປັນ Default
            const myQ = query(usersRef, where('email', '==', userEmail));
            const mySnapshot = await getDocs(myQ);
            
            if (!mySnapshot.empty) {
                currentUserDocId = mySnapshot.docs[0].id;
                const myDocRef = doc(db, 'users', currentUserDocId);
                
                await updateDoc(myDocRef, { isOnline: true, lastActive: serverTimestamp() });

                // ເມື່ອຜູ້ໃຊ້ປິດໜ້າເວັບ (ແຖບ/ບຣາວເຊີ) ພະຍາຍາມປ່ຽນສະຖານະເປັນ Offline
                window.addEventListener('beforeunload', () => {
                    updateDoc(myDocRef, { isOnline: false });
                });
            }
        }

        // 2️⃣ ດຶງຂໍ້ມູນຄົນອື່ນທີ່ອອນໄລນ໌ແບບ Real-time ມາສະແດງ
        const onlineQ = query(usersRef, where('isOnline', '==', true));
        onSnapshot(onlineQ, (snapshot) => {
            const listContainer = document.getElementById('online-users-list');
            const countContainer = document.getElementById('online-count');
            if (!listContainer) return;

            let html = '';
            let count = 0;

            snapshot.forEach(docSnap => {
                const user = docSnap.data();
                
                // ບໍ່ສະແດງຊື່ຕົວເອງໃນລາຍຊື່
                if (user.email === userEmail) return;

                count++;
                const name = user.fullName || 'User';
                const firstChar = name.charAt(0).toUpperCase();

                // ສຸ່ມສີ Avatar ໃຫ້ແຕ່ລະຄົນຕາມຊື່ (Color generator)
                const colors = ['bg-blue-900 text-blue-200','bg-purple-900 text-purple-200','bg-amber-900 text-amber-200','bg-rose-900 text-rose-200','bg-indigo-900 text-indigo-200'];
                const colorClass = colors[name.charCodeAt(0) % colors.length];

                let roleDisplay = 'ພະນັກງານ';
                if (user.role === 'system_manager' || user.role === 'super_admin') roleDisplay = 'ຜູ້ບໍລິຫານ';
                else if (user.role === 'department_head') roleDisplay = 'ຫົວໜ້າພະແນກ';
                else if (user.role === 'section_head') roleDisplay = 'ຫົວໜ້າພາກສ່ວນ';
                else if (user.role === 'warehouse_manager') roleDisplay = 'ຜູ້ຈັດການສາງ';

                html += `
                <div class="flex items-center p-2 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer group">
                    <div class="relative mr-3">
                        <div class="w-8 h-8 rounded-full ${colorClass} flex items-center justify-center text-xs font-bold border border-slate-700">${firstChar}</div>
                        <div class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
                    </div>
                    <div>
                        <p class="text-xs font-bold text-slate-300 group-hover:text-white transition-colors truncate w-36">${name}</p>
                        <p class="text-[10px] text-slate-500 truncate w-36">${roleDisplay}</p>
                    </div>
                </div>`;
            });

            countContainer.innerHTML = `<span class="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse"></span> ${count} ຄົນ`;

            if (count === 0) {
                listContainer.innerHTML = '<p class="text-[11px] text-slate-500 px-2 py-2 text-center bg-slate-800/30 rounded-lg">ບໍ່ມີທີມງານອື່ນອອນໄລນ໌</p>';
            } else {
                listContainer.innerHTML = html;
            }
        });

        // ສົ່ງຟັງຊັນສຳລັບການປ່ຽນສະຖານະເປັນ Offline ອອກໄປໃຊ້ງານຂ້າງນອກ
        return async function() {
            if (currentUserDocId) {
                await updateDoc(doc(db, 'users', currentUserDocId), { isOnline: false });
            }
        };

    } catch (error) {
        console.error("Firebase Realtime Error:", error);
        return async () => {}; 
    }
}

// ເລີ່ມຕົ້ນລະບົບ Presence
initRealtimePresence().then(fn => {
    if(fn) updateStatusToOffline = fn;
});

// 🟢 ຈັດການປຸ່ມ Logout ໃໝ່ (ໃຫ້ອັບເດດສະຖານະກ່ອນອອກ)
document.getElementById('btn-logout').addEventListener('click', async (e) => {
    e.preventDefault();
    if (confirm('ທ່ານຕ້ອງການອອກຈາກລະບົບແທ້ບໍ່?')) {
        document.getElementById('btn-logout').innerHTML = '<span class="font-bold text-sm">ກຳລັງອອກ...</span>';
        await updateStatusToOffline(); // ສັ່ງໃຫ້ອອຟໄລນ໌ໃນຖານຂໍ້ມູນ
        localStorage.removeItem('wm_user_data');
        window.location.href = `${base}/login.html`;
    }
});

// 🔒 ລະບົບ Auto Logout (Idle Timeout 5 ນາທີ)
(function() {
    let idleTimer;
    const idleTimeLimit = 5 * 60 * 1000; // 5 ນາທີ 
    
    function resetIdleTimer() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(async () => {
            await updateStatusToOffline(); // ສັ່ງໃຫ້ອອຟໄລນ໌ໃນຖານຂໍ້ມູນກ່ອນເຕະອອກ
            localStorage.removeItem('wm_user_data');
            alert("🔒 ໝົດເວລາການໃຊ້ງານ 5 ນາທີ! ລະບົບໄດ້ລັອກເອົາອັດຕະໂນມັດເພື່ອຄວາມປອດໄພ.");
            window.location.replace(`${base}/login.html`);
        }, idleTimeLimit);
    }

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
    events.forEach(event => {
        window.addEventListener(event, resetIdleTimer, { passive: true });
    });

    resetIdleTimer();
})();