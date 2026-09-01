const test = require('node:test');
const assert = require('node:assert/strict');
const { validateCreateUserPayload } = require('../validation');
const { isAdminRole, isAllowedUserRole } = require('../authz');

test('accepts a valid create-user payload', () => {
    assert.equal(validateCreateUserPayload({
        fullName: 'Admin User',
        email: 'admin@example.com',
        password: 'secret123'
    }), null);
});

test('rejects missing required fields', () => {
    assert.match(
        validateCreateUserPayload({ email: 'admin@example.com' }),
        /Missing required fields/
    );
});

test('rejects invalid email addresses', () => {
    assert.match(
        validateCreateUserPayload({
            fullName: 'Admin User',
            email: 'invalid-email',
            password: 'secret123'
        }),
        /Invalid email/
    );
});

test('rejects passwords shorter than six characters', () => {
    assert.match(
        validateCreateUserPayload({
            fullName: 'Admin User',
            email: 'admin@example.com',
            password: '12345'
        }),
        /6/
    );
});

test('recognizes admin roles only for the allowlisted values', () => {
    assert.equal(isAdminRole('system_manager'), true);
    assert.equal(isAdminRole('super_admin'), true);
    assert.equal(isAdminRole('warehouse_manager'), false);
    assert.equal(isAdminRole('technical_staff'), false);
    assert.equal(isAdminRole(''), false);
});

test('accepts only the allowlisted non-admin roles', () => {
    assert.equal(isAllowedUserRole('technical_staff'), true);
    assert.equal(isAllowedUserRole('warehouse_manager'), true);
    assert.equal(isAllowedUserRole('department_head'), true);
    assert.equal(isAllowedUserRole('system_manager'), true);
    assert.equal(isAllowedUserRole('super_admin'), true);
    assert.equal(isAllowedUserRole('admin'), false);
    assert.equal(isAllowedUserRole('hacker'), false);
    assert.equal(isAllowedUserRole(''), false);
});

test('normalizes role strings before checking permissions', () => {
    assert.equal(isAdminRole(' SUPER_ADMIN '), true);
    assert.equal(isAdminRole(' system_manager '), true);
    assert.equal(isAllowedUserRole(' WAREHOUSE_MANAGER '), true);
    assert.equal(isAllowedUserRole('  technical_staff  '), true);
    assert.equal(isAllowedUserRole('Admin'), false);
});
