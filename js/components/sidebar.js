// =========================================================================
// 🧠 ໂລຈິກກວດສອບຜູ້ໃຊ້ & Dynamic Permissions (ລວມຮ່າງສີສັນ ແລະ ຟີເຈີເດີມ)
// =========================================================================
const userDataStr = localStorage.getItem('wm_user_data');

// ໂລຈິກຄຳນວນ Path ປ້ອງກັນ 404 (Auto Base URL)
const currentPath = window.location.pathname;
const base = currentPath.includes('/pages/') ? '../..' : '.';

// ຖ້າບໍ່ໃສ່ຊື່ລັອກອິນ ໃຫ້ເດັ້ງກັບໄປໜ້າ Login
if (!userDataStr && !currentPath.includes('login.html')) {
    window.location.replace(base + '/login.html');
}

const userData = userDataStr ? JSON.parse(userDataStr) : { fullName: 'Unknown', email: '', role: 'technical_staff', permissions: {} };
const perms = userData.permissions || {};
const isAdmin = userData.role === 'system_manager' || userData.role === 'super_admin';

// ປ່ຽນຊື່ Role ເປັນພາສາລາວຕາມທີ່ຕັ້ງຄ່າ
let userRoleText = 'ພະນັກງານວິຊາການ';
if (userData.role === 'system_manager') userRoleText = 'ຜູ້ຈັດການລະບົບ';
else if (userData.role === 'department_head') userRoleText = 'ຫົວໜ້າພະແນກ';
else if (userData.role === 'section_head') userRoleText = 'ຫົວໜ້າພາກສ່ວນ';
else if (userData.role === 'warehouse_manager') userRoleText = 'ຜູ້ຈັດການສາງ';

const userName = userData.fullName || 'User';
const userEmail = userData.email || 'user@meter.com';
const avatarText = userName.charAt(0).toUpperCase();

const adminBadge = isAdmin || userData.role === 'system_manager'
    ? `<span class="inline-flex items-center justify-center ml-2 px-1.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[9px] font-extrabold tracking-wider uppercase"><svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg> Admin</span>` 
    : '';

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

    <!-- ເມນູຕ່າງໆ (ປ່ຽນໄປໃຊ້ ${base} ແລະ ອ່ານສິດທິ Perms) -->
    <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1 custom-scrollbar">
        <p class="px-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">ເມນູຫຼັກ (Main Menu)</p>

        <!-- ໜ້າຫຼັກ -->
        ${perms.dashboard ? `
        <a href="${base}/index.html" class="nav-link flex items-center px-4 py-3.5 rounded-xl text-slate-400 transition-all duration-300 group active:scale-[0.98] border border-transparent" data-path="/index.html">
            <svg class="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span class="font-bold text-sm">ໜ້າຫຼັກ (Dashboard)</span>
        </a>` : ''}

        <!-- ສະຕັອກສິນຄ້າ -->
        ${perms.inventory ? `
        <a href="${base}/pages/warehouse/inventory.html" class="nav-link flex items-center px-4 py-3.5 rounded-xl text-slate-400 transition-all duration-300 group active:scale-[0.98] border border-transparent" data-path="/inventory.html">
            <svg class="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            <span class="font-bold text-sm">ສະຕັອກສິນຄ້າ</span>
        </a>` : ''}

        <!-- ຮັບເຄື່ອງເຂົ້າສາງ -->
        ${perms.receive ? `
        <a href="${base}/pages/warehouse/receive-items.html" class="nav-link flex items-center px-4 py-3.5 rounded-xl text-slate-400 transition-all duration-300 group active:scale-[0.98] border border-transparent" data-path="/receive-items.html">
            <svg class="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
            <span class="font-bold text-sm">ຮັບເຄື່ອງເຂົ້າສາງ</span>
        </a>` : ''}

        <!-- ຈັດການຜູ້ໃຊ້ລະບົບ (Admin) -->
        ${perms.manageUsers || isAdmin ? `
        <p class="px-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-3 mt-6">ສຳລັບຜູ້ບໍລິຫານ (Admin)</p>
        <a href="${base}/pages/admin/manage-users.html" class="nav-link flex items-center px-4 py-3.5 rounded-xl text-slate-400 transition-all duration-300 group active:scale-[0.98] border border-transparent" data-path="/manage-users.html">
            <svg class="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <span class="font-bold text-sm">ຈັດການຜູ້ໃຊ້ລະບົບ</span>
        </a>` : ''}

        <!-- ເບີກຈ່າຍອຸປະກອນ -->
        ${perms.issue ? `
        <a href="${base}/pages/warehouse/issue-items.html" class="nav-link flex items-center px-4 py-3.5 rounded-xl text-slate-400 transition-all duration-300 group active:scale-[0.98] border border-transparent" data-path="/issue-items.html">
            <svg class="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
            <span class="font-bold text-sm">ເບີກຈ່າຍອຸປະກອນ</span>
        </a>` : ''}

        <!-- 🟢 ລາຍຊື່ເພື່ອນຮ່ວມງານທີ່ Online (ຈຳລອງ) 🟢 -->
        <div class="mt-8 mb-2">
            <div class="flex items-center justify-between px-3 mb-3">
                <p class="text-[11px] font-extrabold text-slate-500 uppercase tracking-widest">ທີມງານທີ່ອອນໄລນ໌</p>
                <span class="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center">
                    <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1 animate-pulse"></span> 3 ຄົນ
                </span>
            </div>
            
            <div class="px-2 space-y-1">
                <div class="flex items-center p-2 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer group">
                    <div class="relative mr-3">
                        <div class="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-blue-200 text-xs font-bold border border-slate-700">ທ</div>
                        <div class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
                    </div>
                    <div>
                        <p class="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">ທ້າວ ສົມຊາຍ</p>
                        <p class="text-[10px] text-slate-500">ພາກສະໜາມ</p>
                    </div>
                </div>
                <div class="flex items-center p-2 rounded-lg hover:bg-slate-800/50 transition-colors cursor-pointer group">
                    <div class="relative mr-3">
                        <div class="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center text-purple-200 text-xs font-bold border border-slate-700">ນ</div>
                        <div class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
                    </div>
                    <div>
                        <p class="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">ນາງ ນາລີ</p>
                        <p class="text-[10px] text-slate-500">ບັນຊີ & ການເງິນ</p>
                    </div>
                </div>
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
                <p class="text-[10.5px] text-slate-400 font-medium truncate">${userRoleText}</p>
                <p class="text-[9px] text-slate-500 font-medium truncate mt-0.5">${userEmail}</p>
            </div>
        </div>
        
        <button onclick="handleLogout()" class="flex items-center justify-center w-full px-4 py-2.5 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 hover:border-rose-500 rounded-xl transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] active:scale-95">
            <svg class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span class="font-bold text-sm tracking-wide">ອອກຈາກລະບົບ</span>
        </button>
    </div>
</aside>
`;

// ຟັງຊັນອອກຈາກລະບົບ
window.handleLogout = function() {
    if(confirm('ທ່ານຕ້ອງການອອກຈາກລະບົບແທ້ບໍ່?')) {
        localStorage.removeItem('wm_user_data');
        window.location.replace(`${base}/login.html`);
    }
}

// 🌟 ລະບົບ Highlight ເມນູອັດຕະໂນມັດ 🌟
(function() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const pathData = link.getAttribute('data-path');
        if (currentPath.includes(pathData) || (currentPath === '/' && pathData === '/index.html')) {
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

// 🔒 ລະບົບ Auto Logout
(function() {
    let idleTimer;
    const idleTimeLimit = 5 * 60 * 1000; 
    function resetIdleTimer() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            alert("🔒 ໝົດເວລາການໃຊ້ງານແລ້ວ! ລະບົບໄດ້ລັອກເອົາອັດຕະໂນມັດເພື່ອຄວາມປອດໄພ.");
            window.location.replace(`${base}/login.html`);
        }, idleTimeLimit);
    }
    window.onload = resetIdleTimer;
    document.onmousemove = resetIdleTimer;
    document.onkeypress = resetIdleTimer;
    document.onmousedown = resetIdleTimer; 
    document.ontouchstart = resetIdleTimer; 
    document.onscroll = resetIdleTimer;
})();