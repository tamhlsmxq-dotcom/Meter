// =========================================================================
// 🧠 ໂລຈິກກວດສອບຜູ້ໃຊ້
// =========================================================================
const loggedUser = localStorage.getItem('wm_user') || 'admin@meter.com'; 
let userName, userRole, userEmail, avatarText, isAdmin;

if (loggedUser === 'admin@meter.com' || loggedUser === 'admin@merter.com') {
    userName = 'ແອດມິນລະບົບ';
    userRole = 'ຜູ້ບໍລິຫານລະບົບ (Super Admin)';
    userEmail = 'admin@meter.com';
    avatarText = 'A';
    isAdmin = true;
} else {
    userName = loggedUser;
    userRole = 'ພະນັກງານພາກສ່ວນສາງ';
    userEmail = loggedUser + '@meter.com';
    avatarText = loggedUser.charAt(0).toUpperCase();
    isAdmin = false;
}

const adminBadge = isAdmin 
    ? `<span class="inline-flex items-center justify-center ml-2 px-1.5 py-0.5 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded text-[9px] font-extrabold tracking-wider uppercase"><svg class="w-3 h-3 mr-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg> Admin</span>` 
    : '';

document.getElementById('sidebar-container').innerHTML = `
<aside class="w-64 h-screen bg-slate-900 text-slate-300 fixed left-0 top-0 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.15)] z-40">
    <div class="h-20 flex items-center px-6 border-b border-slate-700/50 bg-slate-900 relative overflow-hidden">
        <div class="absolute top-0 left-0 w-full h-full bg-indigo-500/10 blur-xl"></div>
        <div class="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 mr-3 relative z-10 transition-transform duration-500 hover:rotate-12">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 14L15.5 8.5"></path>
            </svg>
        </div>
        <div class="relative z-10"><h1 class="text-xl font-extrabold text-white tracking-wider">Water<span class="text-blue-400">Meter</span></h1></div>
    </div>

    <nav class="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <p class="px-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">ເມນູຫຼັກ</p>
        <a href="/index.html" class="nav-link flex items-center px-4 py-3.5 rounded-xl text-slate-400 hover:bg-slate-800/60 transition-all border border-transparent">
            <span class="font-bold text-sm">ໜ້າຫຼັກ (Dashboard)</span>
        </a>
        <a href="/pages/warehouse/inventory.html" class="nav-link flex items-center px-4 py-3.5 rounded-xl text-slate-400 hover:bg-slate-800/60 transition-all border border-transparent">
            <span class="font-bold text-sm">ສະຕັອກສິນຄ້າ</span>
        </a>
        ${isAdmin ? `
        <p class="px-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-3 mt-6">ສຳລັບຜູ້ບໍລິຫານ (Admin)</p>
        <a href="/pages/admin/manage-users.html" class="nav-link flex items-center px-4 py-3.5 rounded-xl text-slate-400 hover:bg-slate-800/60 transition-all border border-transparent">
            <span class="font-bold text-sm">ຈັດການຜູ້ໃຊ້ລະບົບ</span>
        </a>
        ` : ''}
    </nav>

    <div class="p-4 border-t border-slate-700/50 bg-slate-800/30">
        <div class="flex items-center px-2">
            <div class="w-10 h-10 rounded-full ${isAdmin ? 'bg-amber-500' : 'bg-slate-700'} flex items-center justify-center font-bold text-white mr-3">${avatarText}</div>
            <div>
                <p class="text-sm font-bold text-white">${userName} ${adminBadge}</p>
                <p class="text-[10px] text-slate-400">${userEmail}</p>
            </div>
        </div>
    </div>
</aside>
`;

// 🌟 Highlight ເມນູ
(function() {
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (currentPath.includes(link.getAttribute('href'))) {
            link.classList.add('bg-indigo-600/20', 'text-indigo-400', 'border-indigo-500/50');
        }
    });
})();

// 🔒 ລະບົບ Auto Logout (ແກ້ໄຂໃຫ້ໃຊ້ addEventListener)
window.addEventListener('load', function() {
    let idleTimer;
    const idleTimeLimit = 5 * 60 * 1000; 
    function resetIdleTimer() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(() => {
            alert("ໝົດເວລາການໃຊ້ງານ!");
            window.location.href = '/login.html';
        }, idleTimeLimit);
    }
    document.onmousemove = document.onkeypress = document.onmousedown = resetIdleTimer;
    resetIdleTimer();
});