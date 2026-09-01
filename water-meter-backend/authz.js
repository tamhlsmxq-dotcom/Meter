const ADMIN_ROLES = new Set(['system_manager', 'super_admin']);
const ALLOWED_USER_ROLES = new Set([
    'technical_staff',
    'warehouse_manager',
    'section_head',
    'department_head',
    'system_manager',
    'super_admin',
]);

function normalizeRole(role) {
    if (typeof role !== 'string') return '';
    return role.trim().toLowerCase();
}

function isAdminRole(role) {
    return ADMIN_ROLES.has(normalizeRole(role));
}

function isAllowedUserRole(role) {
    return ALLOWED_USER_ROLES.has(normalizeRole(role));
}

module.exports = {
    ADMIN_ROLES,
    ALLOWED_USER_ROLES,
    normalizeRole,
    isAdminRole,
    isAllowedUserRole,
};
