export function normalizeUrlForComparison(url, fallbackUrl = typeof window !== 'undefined' ? window.location.href : 'http://localhost/') {
    try {
        const resolved = new URL(url, fallbackUrl);
        const normalizedPath = resolved.pathname.replace(/\/+$/, '') || '/';
        return `${resolved.origin}${normalizedPath}`.toLowerCase();
    } catch {
        return String(url || '').trim().replace(/[?#].*$/, '').replace(/\/+$/, '').toLowerCase() || '/';
    }
}

export function resolveTargetUrl(targetPage, currentUrl = typeof window !== 'undefined' ? window.location.href : 'http://localhost/') {
    const current = new URL(currentUrl, 'http://localhost/');
    const currentPath = current.pathname.toLowerCase();

    let base = '.';
    if (currentPath.includes('/pages/warehouse/') || currentPath.includes('/pages/admin/')) {
        base = '../..';
    } else if (currentPath.includes('/pages/')) {
        base = '..';
    }

    const relativeTarget = `${base}/${targetPage}`.replace(/\/+/g, '/');
    return new URL(relativeTarget, current.href).toString();
}

export function isSamePage(targetPage, currentUrl = typeof window !== 'undefined' ? window.location.href : 'http://localhost/') {
    try {
        const targetUrl = typeof targetPage === 'string' && /(https?:)?\/\//i.test(targetPage)
            ? targetPage
            : resolveTargetUrl(targetPage, currentUrl);

        return normalizeUrlForComparison(targetUrl, currentUrl) === normalizeUrlForComparison(currentUrl, currentUrl);
    } catch {
        return false;
    }
}
