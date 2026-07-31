export const SYSTEM_MODULES = [
    {
        id: 'warehouse',
        title: '📦 ພາກສ່ວນ: ສາງ',
        desc: 'ສິດທິໃນການເຂົ້າເຖິງໜ້າ ສະຕັອກ, ຮັບເຄື່ອງ ແລະ ເບີກເຄື່ອງ',
        iconColor: 'text-emerald-500',
        menus: [
            { title: 'ສະຕັອກສິນຄ້າ', path: '/pages/warehouse/inventory.html', icon: '<svg class="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>' },
            { title: 'ຮັບເຄື່ອງເຂົ້າສາງ', path: '/pages/warehouse/receive-items.html', icon: '<svg class="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"></path></svg>' },
            { title: 'ເບີກເຄື່ອງໃຫ້ຊ່າງ', path: '/pages/warehouse/create-issue.html', icon: '<svg class="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>' }
        ]
    },
    {
        id: 'field',
        title: '🔧 ພາກສ່ວນ: ປ່ຽນຖ່າຍ',
        desc: 'ສິດທິໃນການລາຍງານການປົດເຄື່ອງ ແລະ ການນຳໃຊ້ຕົວຈິງ',
        iconColor: 'text-amber-500',
        menus: [
            { title: 'ລາຍງານການປົດເຄື່ອງ', path: '/pages/warehouse/field-report.html', icon: '<svg class="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>' }
        ]
    },
    {
        id: 'reconcile',
        title: '⚖️ ພາກສ່ວນ: ກວດສອບ',
        desc: 'ສິດທິໃນການສົມທຽບ, ກວດສອບ ແລະ ຕັດສະຕັອກ',
        iconColor: 'text-rose-400',
        menus: [
            { title: 'ສົມທຽບ-ຕັດສະຕັອກ', path: '/pages/warehouse/issue-items.html', icon: '<svg class="w-5 h-5 mr-3 group-hover:translate-x-1 group-hover:scale-110 transition-transform duration-300" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>' }
        ]
    }
];