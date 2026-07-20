document.getElementById('sidebar-container').innerHTML = `
<!-- ແຖບ Sidebar ຫຼັກ -->
<aside class="w-64 h-screen bg-slate-900 text-slate-300 fixed left-0 top-0 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.1)] z-40">
    
    <!-- ໂລໂກ້ -->
    <div class="h-20 flex items-center px-6 border-b border-slate-700/50 bg-slate-900">
        <div class="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 mr-3">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 14L15.5 8.5"></path>
            </svg>
        </div>
        <div>
            <h1 class="text-xl font-extrabold text-white tracking-wider">Water<span class="text-blue-400">Meter</span></h1>
        </div>
    </div>

    <!-- ເມນູຕ່າງໆ -->
    <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-1.5 custom-scrollbar">
        <p class="px-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-widest mb-3">ເມນູຫຼັກ (Main Menu)</p>

        <a href="/index.html" class="flex items-center px-3 py-3 rounded-xl hover:bg-indigo-600/10 hover:text-indigo-400 text-slate-400 transition-all group">
            <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            <span class="font-bold text-sm">ໜ້າຫຼັກ (Dashboard)</span>
        </a>

        <a href="/pages/warehouse/inventory.html" class="flex items-center px-3 py-3 rounded-xl hover:bg-indigo-600/10 hover:text-indigo-400 text-slate-400 transition-all group">
            <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
            <span class="font-bold text-sm">ສະຕັອກສິນຄ້າ</span>
        </a>

        <a href="/pages/warehouse/receive-items.html" class="flex items-center px-3 py-3 rounded-xl hover:bg-indigo-600/10 hover:text-indigo-400 text-slate-400 transition-all group">
            <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>
            <span class="font-bold text-sm">ຮັບເຄື່ອງເຂົ້າສາງ</span>
        </a>

        <a href="/pages/warehouse/issue-items.html" class="flex items-center px-3 py-3 rounded-xl hover:bg-indigo-600/10 hover:text-indigo-400 text-slate-400 transition-all group">
            <svg class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
            <span class="font-bold text-sm">ເບີກຈ່າຍອຸປະກອນ</span>
        </a>
    </nav>

    <!-- ສ່ວນຜູ້ໃຊ້ ແລະ ປຸ່ມອອກຈາກລະບົບ -->
    <div class="p-5 border-t border-slate-700/50 bg-slate-800/50">
        <div class="flex items-center mb-5">
            <div class="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-base mr-3 border-2 border-slate-600">
                A
            </div>
            <div>
                <p class="text-sm font-bold text-white">ແອດມິນລະບົບ</p>
                <p class="text-xs text-indigo-300 font-medium">ພາກສ່ວນສາງ</p>
            </div>
        </div>
        
        <a href="/login.html" onclick="return confirm('ທ່ານຕ້ອງການອອກຈາກລະບົບແທ້ບໍ່?');" class="flex items-center justify-center w-full px-4 py-2.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white border border-rose-500/20 rounded-xl transition-all group cursor-pointer shadow-sm hover:shadow-rose-500/25 active:scale-95">
            <svg class="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            <span class="font-bold text-sm">ອອກຈາກລະບົບ</span>
        </a>
    </div>
</aside>
`;

// =========================================================================
// 🔒 ລະບົບປ້ອງກັນຄວາມປອດໄພ: Auto Logout ຖ້າບໍ່ມີການເຄື່ອນໄຫວ 5 ນາທີ
// =========================================================================
(function() {
    let idleTimer;
    // ກຳນົດເວລາ: 5 ນາທີ * 60 ວິນາທີ * 1000 ມີລີວິນາທີ = 300,000 ms
    const idleTimeLimit = 5 * 60 * 1000; 

    // ຟັງຊັນຣີເຊັດເວລາ
    function resetIdleTimer() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(autoLogout, idleTimeLimit);
    }

    // ຟັງຊັນເຕະອອກຈາກລະບົບ
    function autoLogout() {
        alert("🔒 ໝົດເວລາການໃຊ້ງານແລ້ວ! ລະບົບໄດ້ລັອກເອົາອັດຕະໂນມັດເພື່ອຄວາມປອດໄພ.");
        // ສົ່ງກັບໄປໜ້າເຂົ້າສູ່ລະບົບ
        window.location.href = '/login.html';
    }

    // ກວດຈັບການເຄື່ອນໄຫວທຸກຮູບແບບຂອງຜູ້ໃຊ້ (Mouse, Keyboard, Touch, Scroll)
    window.onload = resetIdleTimer;
    document.onmousemove = resetIdleTimer;
    document.onkeypress = resetIdleTimer;
    document.onmousedown = resetIdleTimer; // ກົດເມົາສ໌
    document.ontouchstart = resetIdleTimer; // ສຳຜັດໜ້າຈໍໂທລະສັບ
    document.onscroll = resetIdleTimer; // ເລື່ອນໜ້າຈໍ
})();