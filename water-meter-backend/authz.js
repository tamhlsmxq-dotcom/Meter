const ADMIN_ROLES = new Set(['system_manager', 'super_admin']);

function isAdminRole(role) {
    if (typeof role !== 'string') return false;
    return ADMIN_ROLES.has(role.trim());
}

module.exports = {
    ADMIN_ROLES,
    isAdminRole,
};
