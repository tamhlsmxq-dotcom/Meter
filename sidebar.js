export function renderSidebar(activePage) {
    const sidebarHTML = `
    <div id="sidebarOverlay" class="fixed inset-0 bg-black/50 z-40 hidden md:hidden transition-opacity" onclick="toggleSidebar()"></div>
    
    <aside id="sidebar-container" class="bg-gradient-to-b from-blue-900 to-blue-800 text-white w-64 flex-shrink-0 flex flex-col absolute md:relative z-50 h-full transition-transform transform -translate-x-full md:translate-x-0 shadow-2xl">
        
        <div class="p-6 flex items-center justify-between border-b border-blue-700/50">
            <div class="flex items-center gap-3">
                <div class="bg-white p-2 rounded-lg shadow-sm">
                    <i class="fas fa-tint text-blue-600 text-xl"></i>
                </div>
                <span class="text-xl font-bold tracking-wide">ສາງໝໍ້ແທກນ້ຳ</span>
            </div>
            <button onclick="toggleSidebar()" class="md:hidden text-blue-200 hover:text-white transition-colors">
                <i class="fas fa-times text-2xl"></i>
            </button>
        </div>
        
        <nav class="flex-1 overflow-y-auto py-6 px-4 space-y-2">
            
            <a href="manage-items.html" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activePage === 'manage' ? 'bg-white/20 text-white font-bold shadow-sm' : 'text-blue-100 hover:bg-white/10 hover:text-white'}">
                <i class="fas fa-boxes w-6"></i>
                <span>ຈັດການສະຕັອກ</span>
            </a>

            <a href="receive-items.html" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activePage === 'receive' ? 'bg-white/20 text-white font-bold shadow-sm' : 'text-blue-100 hover:bg-white/10 hover:text-white'}">
                <i class="fas fa-download w-6"></i>
                <span>ຮັບເຄື່ອງເຂົ້າສາງ</span>
            </a>

            <a href="issue-items.html" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activePage === 'issue' ? 'bg-white/20 text-white font-bold shadow-sm' : 'text-blue-100 hover:bg-white/10 hover:text-white'}">
                <i class="fas fa-upload w-6"></i>
                <span>ພິມບິນເບີກເຄື່ອງ</span>
            </a>

            <a href="report-monthly.html" class="flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${activePage === 'report' ? 'bg-white/20 text-white font-bold shadow-sm' : 'text-blue-100 hover:bg-white/10 hover:text-white'}">
                <i class="fas fa-file-invoice w-6"></i>
                <span>ລາຍງານປະຈຳເດືອນ</span>
            </a>
            
        </nav>

        <div class="p-4 border-t border-blue-700/50">
            <button id="logoutBtn" class="w-full flex items-center justify-center gap-2 bg-red-500/80 hover:bg-red-500 text-white px-4 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow">
                <i class="fas fa-sign-out-alt"></i>
                <span class="font-bold">ອອກຈາກລະບົບ</span>
            </button>
        </div>
    </aside>
    `;

    document.getElementById('sidebar-placeholder').innerHTML = sidebarHTML;

    // ລະບົບກົດອອກຈາກລະບົບ (Logout)
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            import('./firebase-config.js').then(module => {
                module.auth.signOut().then(() => {
                    window.location.href = 'index.html'; // ປ່ຽນໜ້າໄປໜ້າລັອກອິນ
                }).catch((error) => {
                    console.error("ເກີດຂໍ້ຜິດພາດໃນການອອກຈາກລະບົບ:", error);
                });
            });
        });
    }
}
