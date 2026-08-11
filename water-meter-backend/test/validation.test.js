const test = require('node:test');
const assert = require('node:assert/strict');
const { validateCreateUserPayload } = require('../validation');

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
