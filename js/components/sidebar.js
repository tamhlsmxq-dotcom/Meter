document.addEventListener("DOMContentLoaded", function() {
    // ກວດສອບອັດຕະໂນມັດວ່າເປີດຢູ່ Local ຫຼື GitHub Pages
    const basePath = window.location.hostname.includes('github.io') ? '/Meter' : '';
    
    const sidebarHTML = `
    <aside class="w-64 bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 shadow-2xl z-20 min-h-screen fixed left-0 top-0">
        <!-- ໂລໂກ້ -->
        <div class="h-20 flex items-center justify-center border-b border-slate-800 bg-slate-950/50">
            <div class="flex items-center space-x-3">
                <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">W</div>
                <span class="text-xl font-extrabold text-white tracking-wider">Water<span class="text-indigo-400">Meter</span></span>
            </div>
        </div>

        <!-- ເມນູຫຼັກ -->
        <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-2 custom-scrollbar">
            
            <a href="${basePath}/index.html" class="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
                <svg class="w-5 h-5 text-slate-400 group-hover:text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2h-2a2 2 0 01-2-2v-2z"/></svg>
                <span class="font-medium">ໜ້າຫຼັກ (Dashboard)</span>
            </a>

            <!-- ໝວດລະບົບສາງ -->
            <div class="pt-4 pb-2">
                <p class="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ລະບົບສາງ (Warehouse)</p>
            </div>
            
            <a href="${basePath}/pages/warehouse/inventory.html" class="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
                <svg class="w-5 h-5 text-slate-400 group-hover:text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                <span class="font-medium">ສະຕັອກສິນຄ້າ</span>
            </a>

            <a href="${basePath}/pages/warehouse/receive-items.html" class="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
                <svg class="w-5 h-5 text-slate-400 group-hover:text-emerald-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path></svg>
                <span class="font-medium">ຮັບອຸປະກອນເຂົ້າສາງ</span>
            </a>

            <a href="${basePath}/pages/warehouse/issue-items.html" class="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
                <svg class="w-5 h-5 text-slate-400 group-hover:text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                <span class="font-medium">ເບີກຈ່າຍອຸປະກອນ</span>
            </a>

            <!-- ໝວດທີມຊ່າງພາກສະໜາມ -->
            <div class="pt-4 pb-2">
                <p class="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ພາກສະໜາມ (Field Work)</p>
            </div>
            <a href="${basePath}/pages/replacement/task-list.html" class="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
                <svg class="w-5 h-5 text-slate-400 group-hover:text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
                <span class="font-medium">ໃບງານທີມຊ່າງ</span>
            </a>

            <!-- ໝວດຕັ້ງຄ່າແອດມິນ -->
            <div class="pt-4 pb-2">
                <p class="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ຕັ້ງຄ່າແອດມິນ (Admin)</p>
            </div>
            <a href="${basePath}/pages/admin/master-data.html" class="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
                <svg class="w-5 h-5 text-slate-400 group-hover:text-indigo-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                <span class="font-medium">ຂໍ້ມູນພື້ນຖານ (Master Data)</span>
            </a>
        </nav>
    </aside>
    `;
    
    const container = document.getElementById('sidebar-container');
    if (container) {
        container.innerHTML = sidebarHTML;
        
        // ໄຮໄລ້ເມນູຕອນກົດ (Active link)
        const currentPath = window.location.pathname;
        const links = container.querySelectorAll('a');
        links.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (currentPath.includes(linkHref.split('/').pop()) && linkHref.split('/').pop() !== '') {
                link.classList.remove('hover:bg-slate-800', 'text-slate-400');
                link.classList.add('bg-indigo-500/10', 'text-indigo-400', 'border', 'border-indigo-500/20');
                const svg = link.querySelector('svg');
                if(svg) {
                    svg.classList.remove('text-slate-400');
                    if (currentPath.includes('receive-items')) {
                        svg.classList.add('text-emerald-500');
                        link.classList.replace('text-indigo-400', 'text-emerald-500');
                        link.classList.replace('bg-indigo-500/10', 'bg-emerald-500/10');
                        link.classList.replace('border-indigo-500/20', 'border-emerald-500/20');
                    }
                }
            }
        });
    }
});