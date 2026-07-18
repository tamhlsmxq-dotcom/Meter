document.addEventListener("DOMContentLoaded", function() {
    const sidebarHTML = `
    <aside class="w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 shadow-2xl z-20 min-h-screen">
        <!-- ໂລໂກ້ -->
        <div class="h-20 flex items-center justify-center border-b border-slate-800 bg-slate-950/50">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">W</div>
                <span class="text-xl font-extrabold text-white tracking-wider">Water<span class="text-indigo-400">Meter</span></span>
            </div>
        </div>

        <!-- ເມນູຫຼັກ -->
        <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
            
            <a href="../../index.html" class="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
                <svg class="w-5 h-5 text-slate-400 group-hover:text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                <span class="font-medium">ໜ້າຫຼັກ (Dashboard)</span>
            </a>

            <!-- ໝວດລະບົບສາງ -->
            <div class="pt-4 pb-2">
                <p class="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ລະບົບສາງ (Warehouse)</p>
            </div>
            <a href="../warehouse/issue-items.html" class="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
                <svg class="w-5 h-5 text-slate-400 group-hover:text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                <span class="font-medium">ເບີກຈ່າຍອຸປະກອນ</span>
            </a>
            <a href="../warehouse/manage-items.html" class="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
                <svg class="w-5 h-5 text-slate-400 group-hover:text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/></svg>
                <span class="font-medium">ຈັດການສະຕັອກສາງ</span>
            </a>

            <!-- ໝວດທີມຊ່າງພາກສະໜາມ -->
            <div class="pt-4 pb-2">
                <p class="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ພາກສະໜາມ (Field Work)</p>
            </div>
            <a href="../replacement/task-list.html" class="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
                <svg class="w-5 h-5 text-slate-400 group-hover:text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                <span class="font-medium">ໃບງານທີມຊ່າງ</span>
            </a>

            <!-- ໝວດຕັ້ງຄ່າແອດມິນ -->
            <div class="pt-4 pb-2">
                <p class="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ຕັ້ງຄ່າແອດມິນ (Admin)</p>
            </div>
            <a href="../admin/roles.html" class="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
                <svg class="w-5 h-5 text-slate-400 group-hover:text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                <span class="font-medium">ໂຄງສ້າງ & ສິດທິ</span>
            </a>
        </nav>
        
        <!-- ໂປຣໄຟລ໌ຜູ້ໃຊ້ -->
        <div class="p-4 border-t border-slate-800 bg-slate-900/50">
            <div class="flex items-center space-x-3 p-3 bg-slate-800 rounded-xl border border-slate-700/50 cursor-pointer hover:bg-slate-700 transition-colors">
                <div class="w-9 h-9 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 flex items-center justify-center text-white font-bold shadow-inner">
                    A
                </div>
                <div class="flex-1 overflow-hidden">
                    <p class="text-sm font-bold text-white truncate">Admin Warehouse</p>
                    <p class="text-xs text-emerald-400 flex items-center mt-0.5">
                        <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-1.5"></span> ອອນລາຍ
                    </p>
                </div>
            </div>
        </div>
    </aside>
    `;
    
    const container = document.getElementById('sidebar-container');
    if (container) {
        container.innerHTML = sidebarHTML;
        
        const currentPath = window.location.pathname;
        const links = container.querySelectorAll('a');
        links.forEach(link => {
            const href = link.getAttribute('href');
            // Check if current URL matches the link's href
            if (href && href !== '#' && currentPath.includes(href.replace('../', '').replace('../../', ''))) {
                link.classList.remove('hover:bg-slate-800', 'text-slate-400');
                link.classList.add('bg-indigo-500/10', 'text-indigo-400', 'border', 'border-indigo-500/20');
                const svg = link.querySelector('svg');
                if(svg) svg.classList.remove('text-slate-400');
            }
        });
    }
});