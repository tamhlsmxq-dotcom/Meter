function validateCreateUserPayload(payload = {}) {
    const fullName = typeof payload.fullName === 'string' ? payload.fullName.trim() : '';
    const email = typeof payload.email === 'string' ? payload.email.trim() : '';
    const password = typeof payload.password === 'string' ? payload.password : '';

    if (!fullName || !email || !password) {
        return 'ຂໍ້ມູນບໍ່ຄົບຖ້ວນ (Missing required fields)';
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return 'ຮູບແບບອີເມວບໍ່ຖືກຕ້ອງ (Invalid email)';
    }

    if (password.length < 6) {
        return 'ລະຫັດຜ່ານຕ້ອງມີຢ່າງໜ້ອຍ 6 ຕົວອັກສອນ';
    }

    return null;
}

module.exports = { validateCreateUserPayload };
