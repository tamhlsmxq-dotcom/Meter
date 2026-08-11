(function () {
    const nativeAlert = window.alert.bind(window);

    function showToast(message, tone = 'info') {
        const toast = document.createElement('div');
        toast.className = `wm-toast wm-toast-${tone}`;
        toast.setAttribute('role', 'status');
        toast.textContent = message;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('wm-toast-visible'));
        setTimeout(() => {
            toast.classList.remove('wm-toast-visible');
            setTimeout(() => toast.remove(), 250);
        }, 4200);
    }

    const style = document.createElement('style');
    style.textContent = `
        .wm-toast { position: fixed; right: 20px; bottom: 20px; z-index: 100; max-width: min(420px, calc(100vw - 40px)); padding: 13px 16px; border-radius: 10px; color: #fff; font: 600 14px/1.5 'Noto Sans Lao', sans-serif; box-shadow: 0 12px 30px rgba(15,23,42,.2); opacity: 0; transform: translateY(12px); transition: opacity .25s ease, transform .25s ease; }
        .wm-toast-visible { opacity: 1; transform: translateY(0); }
        .wm-toast-info { background: #334155; }
        .wm-toast-success { background: #047857; }
        .wm-toast-error { background: #be123c; }
        @media (max-width: 768px) {
            #sidebar-container { display: none !important; }
            main { margin-left: 0 !important; padding: 1rem !important; width: 100% !important; }
            .overflow-x-auto { -webkit-overflow-scrolling: touch; }
            .wm-toast { right: 12px; bottom: 12px; }
        }
    `;
    document.head.appendChild(style);

    window.showToast = showToast;
    window.alert = message => showToast(String(message), String(message).includes('❌') ? 'error' : String(message).includes('✅') ? 'success' : 'info');
})();
