const ADMIN_ROLES = new Set(['system_manager', 'super_admin']);
const ALLOWED_USER_ROLES = new Set([
    'technical_staff',
    'warehouse_manager',
    'section_head',
    'department_head',
    'system_manager',
    'super_admin',
]);

function isAdminRole(role) {
    if (typeof role !== 'string') return false;
    return ADMIN_ROLES.has(role.trim());
}

function isAllowedUserRole(role) {
    if (typeof role !== 'string') return false;
    return ALLOWED_USER_ROLES.has(role.trim());
}

module.exports = {
    ADMIN_ROLES,
    ALLOWED_USER_ROLES,
    isAdminRole,
    isAllowedUserRole,
};
