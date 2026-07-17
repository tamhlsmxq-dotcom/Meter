document.addEventListener("DOMContentLoaded", () => {
    const sidebarContainer = document.getElementById("sidebar-container");
    if (!sidebarContainer) return;

    const currentPath = window.location.pathname;

    sidebarContainer.innerHTML = `
        <div class="w-68 bg-slate-900 text-slate-300 flex flex-col justify-between min-h-screen shadow-2xl border-r border-slate-800 font-sans select-none">
            
            <!-- Logo -->
            <div>
                <div class="p-5 border-b border-slate-800 bg-slate-950/40 flex items-center space-x-3">
                    <div class="bg-blue-600 p-2.5 rounded-xl text-white font-bold shadow-lg shadow-blue-500/20 text-xl animate-pulse">💧</div>
                    <div>
                        <h1 class="text-md font-extrabold text-white tracking-wide">ສາງໝໍ້ແທກນ້ຳ</h1>
                        <p class="text-[10px] text-slate-500 uppercase font-semibold tracking-wider">Enterprise Asset Mgt</p>
                    </div>
                </div>

                <!-- User Info -->
                <div class="p-4 mx-3 my-4 bg-slate-800/40 border border-slate-800/60 rounded-xl flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold shadow-md">AD</div>
                    <div class="flex-1 overflow-hidden">
                        <h2 class="text-xs font-bold text-white truncate">admin@meter.com</h2>
                        <span class="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mt-1">
                            ● ຜູ້ເບິ່ງແຍງລະບົບ (Admin)
                        </span>
                    </div>
                </div>

                <!-- Navigation Categories (ແຍກໂຟນເດີຊັດເຈນ) -->
                <nav class="px-3 space-y-6">
                    
                    <!-- 1. ໂຟນເດີສາງ (Warehouse) -->
                    <div>
                        <p class="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">ພາກສ່ວນ ບໍລິຫານຄຸ້ມຄອງສາງ</p>
                        <div class="space-y-1">
                            <a href="/pages/warehouse/manage-items.html" id="menu-manage" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-slate-800 hover:text-white group">
                                <span class="text-slate-500 group-hover:text-blue-400 transition-colors">📦</span> <span>ຈັດການສະຕັອກ</span>
                            </a>
                            <a href="/pages/warehouse/receive-items.html" id="menu-receive" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-slate-800 hover:text-white group">
                                <span class="text-slate-500 group-hover:text-blue-400 transition-colors">📥</span> <span>ຮັບເຄື່ອງເຂົ້າສາງ</span>
                            </a>
                            <a href="/pages/warehouse/issue-items.html" id="menu-issue" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-slate-800 hover:text-white group">
                                <span class="text-slate-500 group-hover:text-blue-400 transition-colors">📤</span> <span>ເບີກຈ່າຍອຸປະກອນ</span>
                            </a>
                        </div>
                    </div>

                    <!-- 2. ໂຟນເດີຊ່າງ (Replacement & Management) -->
                    <div>
                        <p class="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">ພາກສ່ວນ ປະຕິບັດການ</p>
                        <div class="space-y-1">
                            <a href="/pages/replacement/task-list.html" id="menu-replacement" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-slate-800 hover:text-white group">
                                <span class="text-slate-500 group-hover:text-orange-400 transition-colors">🔧</span> <span>ວຽກປ່ຽນຖ່າຍໝໍ້ແທກນ້ຳ</span>
                            </a>
                            <a href="/pages/management/inspect.html" id="menu-management" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-slate-800 hover:text-white group">
                                <span class="text-slate-500 group-hover:text-emerald-400 transition-colors">📋</span> <span>ຄຸ້ມຄອງ ແລະ ກວດກາ</span>
                            </a>
                        </div>
                    </div>

                    <!-- 3. ໂຟນເດີຕັ້ງຄ່າ (Admin) -->
                    <div>
                        <p class="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">ການຕັ້ງຄ່າລະບົບ (Admin)</p>
                        <div class="space-y-1">
                            <a href="/pages/admin/roles.html" id="menu-roles" class="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:bg-slate-800 hover:text-white group">
                                <span class="text-slate-500 group-hover:text-indigo-400 transition-colors">⚙️</span> <span>ຈັດການສິດທິພາກສ່ວນ</span>
                            </a>
                        </div>
                    </div>

                </nav>
            </div>

            <!-- Logout -->
            <div class="p-3 border-t border-slate-800 bg-slate-950/20">
                <button class="flex items-center justify-center space-x-2 bg-rose-600/10 hover:bg-rose-600 border border-rose-500/20 hover:border-rose-600 text-rose-400 hover:text-white p-2.5 rounded-xl transition-all duration-200 w-full text-xs font-bold shadow-sm">
                    <span>🚪</span> <span>ອອກຈາກລະບົບ</span>
                </button>
            </div>
        </div>
    `;

    // Active Menu Logic
    if (currentPath.includes("manage-items")) setActiveMenu("menu-manage");
    else if (currentPath.includes("receive-items")) setActiveMenu("menu-receive");
    else if (currentPath.includes("issue-items")) setActiveMenu("menu-issue");
    else if (currentPath.includes("task-list")) setActiveMenu("menu-replacement");
    else if (currentPath.includes("inspect")) setActiveMenu("menu-management");
    else if (currentPath.includes("roles")) setActiveMenu("menu-roles");

    function setActiveMenu(id) {
        const activeEl = document.getElementById(id);
        if (activeEl) {
            activeEl.classList.remove("text-slate-300", "hover:bg-slate-800");
            activeEl.classList.add("bg-blue-600", "text-white", "shadow-lg", "shadow-blue-600/10");
            const icon = activeEl.querySelector('span');
            if (icon) icon.classList.remove("text-slate-500");
        }
    }
});