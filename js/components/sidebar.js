document.getElementById('sidebar-container').innerHTML = `
<!-- ແຖບ Sidebar ຫຼັກ -->
<aside class="w-64 h-screen bg-slate-900 text-slate-300 fixed left-0 top-0 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.15)] z-40">
    
    <!-- ໂລໂກ້ -->
    <div class="h-20 flex items-center px-6 border-b border-slate-700/50 bg-slate-900 relative overflow-hidden">
        <!-- ແສງເຮືອງໆທາງຫຼັງໂລໂກ້ -->
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
        <p class="px-3 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">ເມນູຫຼັກ (Main Menu)</p>

        <!-- ໝາຍເຫດ: ໃຊ້ class "nav-link" ເພື່ອໃຫ້ JS ດຶງໄປກວດສອບໜ້າປັດຈຸບັນ -->
        <a href="/index.html" class="nav-link flex items-center px-4 py-3.5 rounded-xl text-slate-400 transition-all duration-300 group active:scale-[0.98] border border-transparent">
            <svg class="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span class="font-bold text-sm">ໜ້າຫຼັກ (Dashboard)</span>
        </a>

        <a href="/pages/warehouse/inventory.html" class="nav-link flex items-center px-4 py-3.5 rounded-xl text-slate-400 transition-all duration-300 group active:scale-[0.98] border border-transparent">
            <svg class="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            <span class="font-bold text-sm">ສະຕັອກສິນຄ້າ</span>
        </a>

        <a href="/pages/warehouse/receive-items.html" class="nav-link flex items-center px-4 py-3.5 rounded-xl text-slate-400 transition-all duration-300 group active:scale-[0.98] border border-transparent">
            <svg class="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
            <span class="font-bold text-sm">ຮັບເຄື່ອງເຂົ້າສາງ</span>
        </a>

        <a href="/pages/warehouse/issue-items.html" class="nav-link flex items-center px-4 py-3.5 rounded-xl text-slate-400 transition-all duration-300 group active:scale-[0.98] border border-transparent">
            <svg class="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
            <span class="font-bold text-sm">ເບີກຈ່າຍອຸປະກອນ</span>
        </a>
    </nav>

    <!-- ສ່ວນຜູ້ໃຊ້ ແລະ ປຸ່ມອອກຈາກລະບົບ -->
    <div class="p-4 border-t border-slate-700/50 bg-slate-800/30">
        <div class="flex items-center mb-4 px-2 hover:bg-slate-700/30 p-2 rounded-xl transition-colors cursor-pointer group">
            <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-base mr-3 border border-slate-600 shadow-inner group-hover:border-indigo-400 transition-colors">
                A
            </div>
            <div>
                <p class="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">ແອດມິນລະບົບ</p>
                <p class="text-[11px] text-slate-400 font-medium">ພາກສ່ວນສາງ</p>
            </div>
        </div>
        
        <a href="/login.html" onclick="return confirm('ທ່ານຕ້ອງການອອກຈາກລະບົບແທ້ບໍ່?');" class="flex items-center justify-center w-full px-4 py-2.5 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 hover:border-rose-500 rounded-xl transition-all duration-300 group cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(244,63,94,0.4)] active:scale-95">
            <svg class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span class="font-bold text-sm tracking-wide">ອອກຈາກລະບົບ</span>
        </a>
    </div>
</aside>
`;

// =========================================================================
// 🌟 ລະບົບ Highlight ເມນູອັດຕະໂນມັດ ຕາມໜ້າທີ່ເປີດຢູ່ (Active State)
// =========================================================================
(function() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        // ກວດສອບວ່າ URL ປັດຈຸບັນກົງກັບ href ຂອງປຸ່ມນີ້ຫຼືບໍ່
        if (currentPath.includes(href) || (currentPath === '/' && href === '/index.html')) {
            // ສະຖານະ Active: ເມື່ອຖືກເລືອກ (ສີແຈ້ງ, ມີເງົາ, ຂອບສີຟ້າ)
            link.classList.remove('text-slate-400');
            link.classList.add(
                'bg-gradient-to-r', 'from-indigo-600/20', 'to-transparent', 
                'text-indigo-400', 'border-indigo-500/50', 'shadow-[inset_4px_0_0_rgba(99,102,241,1)]'
            );
        } else {
            // ສະຖານະປົກກະຕິ: ເວລາ Hover
            link.classList.add('hover:bg-slate-800/60', 'hover:text-indigo-300', 'hover:border-slate-700/50');
        }
    });
})();

// =========================================================================
// 🔒 ລະບົບປ້ອງກັນຄວາມປອດໄພ: Auto Logout ຖ້າບໍ່ມີການເຄື່ອນໄຫວ 5 ນາທີ
// =========================================================================
(function() {
    let idleTimer;
    // ກຳນົດເວລາ: 5 ນາທີ * 60 ວິນາທີ * 1000 ມີລີວິນາທີ = 300,000 ms
    const idleTimeLimit = 5 * 60 * 1000; 

    function resetIdleTimer() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(autoLogout, idleTimeLimit);
    }

    function autoLogout() {
        alert("🔒 ໝົດເວລາການໃຊ້ງານແລ້ວ! ລະບົບໄດ້ລັອກເອົາອັດຕະໂນມັດເພື່ອຄວາມປອດໄພ.");
        window.location.href = '/login.html';
    }

    // ກວດຈັບການເຄື່ອນໄຫວ
    window.onload = resetIdleTimer;
    document.onmousemove = resetIdleTimer;
    document.onkeypress = resetIdleTimer;
    document.onmousedown = resetIdleTimer; 
    document.ontouchstart = resetIdleTimer; 
    document.onscroll = resetIdleTimer;
})();