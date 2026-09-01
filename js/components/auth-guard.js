// =========================================================================
// 🛡️ Auth Guard - Universal Version (ຮອງຮັບທັງ Web App ແລະ App / PWA)
// =========================================================================

import { auth, db } from '../../firebase-config.js';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js';

const getDeviceFingerprint = () => {
    const parts = [
        navigator.userAgent,
        navigator.language,
        navigator.platform,
        screen.width,
        screen.height,
        new Date().getTimezoneOffset(),
        navigator.hardwareConcurrency || 0,
        location.hostname
    ];

    return btoa(unescape(encodeURIComponent(parts.join('|')))).slice(0, 64);
};

// 🌟 1. ຟັງຊັນຄຳນວນ Path ທີ່ໃຊ້ໄດ້ທັງ Web App ແລະ App 🌟
// (ໃຊ້ການຖອຍຫຼັງໂຟນເດີ ../ ແທນການອ້າງອີງຈາກ Root / )
function getCorrectPath(targetPage) {
    const path = window.location.pathname.toLowerCase();
    let base = '.';
    
    // ກວດສອບວ່າໄຟລ໌ປັດຈຸບັນຢູ່ເລິກຊ່ຳໃດ ເພື່ອຖອຍຫຼັງໃຫ້ຖືກຕ້ອງ
    if (path.includes('/pages/warehouse/') || path.includes('/pages/admin/')) {
        base = '../..';
    } else if (path.includes('/pages/')) {
        base = '..';
    }
    return `${base}/${targetPage}`;
}

// 🌟 2. ຟັງຊັນ Redirect ທີ່ປ້ອງກັນການຄ້າງ (Loop) ໃນ App 🌟
let isRedirecting = false;
function safeRedirect(targetPage) {
    if (isRedirecting) return;
    
    // ກວດສອບວ່າປັດຈຸບັນຢູ່ໜ້າດຽວກັນແລ້ວຫຼືບໍ່ ເພື່ອປ້ອງກັນບໍ່ໃຫ້ມັນໂຫຼດໜ້າເກົ່າຊໍ້າໆ
    const currentFullUrl = window.location.href.toLowerCase();
    const targetFullUrl = new URL(getCorrectPath(targetPage), window.location.href).href.toLowerCase();

    if (currentFullUrl !== targetFullUrl) { // ປັບປຸງການກວດສອບໃຫ້ຮອບຄອບຂຶ້ນ, ລວມທັງ Query Parameters
        isRedirecting = true;
        window.location.replace(targetFullUrl);
    }
}

const currentPath = window.location.pathname.toLowerCase();

function getStoredUser() {
    try {
        const localUserStr = localStorage.getItem('wm_user_data');
        if (!localUserStr) return null;

        const parsed = JSON.parse(localUserStr);
        if (!parsed || typeof parsed !== 'object') {
            throw new Error('Stored user data is not an object');
        }

        return parsed;
    } catch (error) {
        console.warn('Stored user data was invalid or corrupted. Clearing session.', error);
        localStorage.removeItem('wm_user_data');
        return null;
    }
}

const localUser = getStoredUser();

// 🌟 3. Fast Check: ຖ້າບໍ່ມີ Session ໃນເຄື່ອງ ໃຫ້ເຕະໄປ Login ທັນທີ (ບໍ່ໃຫ້ຈໍກະຕຸກ)
if (!localUser && !currentPath.includes('login.html')) {
    safeRedirect('login.html');
}

// 🌟 4. Firebase Security Check
onAuthStateChanged(auth, async (user) => {
    
    const onLoginPage = currentPath.includes('login.html');

    if (!user) {
        // ຖ້າບໍ່ມີ User Session, ຕ້ອງຢູ່ໜ້າ Login ເທົ່ານັ້ນ
        if (!onLoginPage) {
            localStorage.removeItem('wm_user_data');
            safeRedirect('login.html');
        }
        return;
    }

    // ຖ້າມີ User Session, ຕ້ອງກວດສອບຄວາມຖືກຕ້ອງຂອງ Profile ທຸກຄັ້ງ
    try {
        const serverUserRef = doc(db, 'users', user.uid);
        const serverUserSnap = await getDoc(serverUserRef);
        
        let freshUserData;

        if (!serverUserSnap.exists()) {
            // Create a minimal default profile for valid Firebase users so logins do not fail when the Firestore profile has not been created yet.
            const defaultUserProfile = {
                authUid: user.uid,
                email: user.email,
                fullName: user.displayName || user.email.split('@')[0],
                role: 'technical_staff',
                status: 'active',
                permissions: { dashboard: true, inventory: true, receive: true, issue: true, field: true, manageUsers: false },
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                security: {
                    deviceFingerprint: getDeviceFingerprint(),
                    lastKnownUserAgent: navigator.userAgent,
                    lastLoginAt: serverTimestamp(),
                    loginCount: 1,
                    lastUpdatedAt: serverTimestamp()
                }
            };

            await setDoc(serverUserRef, defaultUserProfile, { merge: true });
            freshUserData = {
                uid: user.uid,
                email: user.email,
                fullName: defaultUserProfile.fullName,
                role: defaultUserProfile.role,
                permissions: defaultUserProfile.permissions,
                security: {
                    deviceFingerprint: defaultUserProfile.security.deviceFingerprint,
                    lastKnownUserAgent: navigator.userAgent,
                    lastLoginAt: null
                }
            };
        } else {
            const serverUser = serverUserSnap.data();
            const currentDeviceFingerprint = getDeviceFingerprint();
            const trustedDeviceFingerprint = serverUser.security?.deviceFingerprint;

            if (trustedDeviceFingerprint && trustedDeviceFingerprint !== currentDeviceFingerprint) {
                await updateDoc(serverUserRef, {
                    'security.lastSuspiciousAt': serverTimestamp(),
                    'security.suspiciousDeviceFingerprint': currentDeviceFingerprint,
                    'security.alerts': (serverUser.security?.alerts || []).concat([
                        {
                            type: 'untrusted_device',
                            message: 'Blocked access from untrusted browser/device during auth validation.',
                            ts: serverTimestamp()
                        }
                    ]),
                    'security.isBlocked': true,
                    'security.blockedAt': serverTimestamp()
                }, { merge: true });

                localStorage.removeItem('wm_user_data');
                await signOut(auth);
                alert('⚠️ ຄວາມປອດໄພ: ເຫັນອຸປະກອນທີ່ບໍ່ໄດ້ຮັບອະນຸຍາດ. ການເຂົ້າເຖິງລະບົບໄດ້ຖືກລະງັບຊົ່ວຄາວ.');
                window.location.replace('login.html?error=security_alert');
                return;
            }

            freshUserData = {
                uid: user.uid,
                email: serverUser.email || user.email,
                fullName: serverUser.fullName || user.email.split('@')[0],
                role: serverUser.role || 'technical_staff',
                permissions: serverUser.permissions || {},
                security: {
                    deviceFingerprint: currentDeviceFingerprint,
                    lastKnownUserAgent: navigator.userAgent,
                    lastLoginAt: serverUser.security?.lastLoginAt || null
                }
            };
        }
        
        localStorage.setItem('wm_user_data', JSON.stringify(freshUserData));
        // 🟢 ແຈ້ງບອກສະຄຣິບອື່ນໆວ່າຂໍ້ມູນຜູ້ໃຊ້ພ້ອມແລ້ວ (ແກ້ໄຂ race condition)
        document.dispatchEvent(new CustomEvent('userDataReady', { detail: freshUserData }));

        // ຫຼັງຈາກກວດສອບ Profile ສຳເລັດ
        if (onLoginPage) {
            // ຖ້າຢູ່ໜ້າ Login ແຕ່ Profile ຖືກຕ້ອງ, ໃຫ້ໄປໜ້າຫຼັກ
            safeRedirect('index.html');
            return;
        }

        // ຖ້າຢູ່ໜ້າອື່ນ, ກວດສອບສິດທິການເຂົ້າເຖິງໜ້ານັ້ນໆ
        const role = String(freshUserData.role || '').trim().toLowerCase();
        const allowedAdminRoles = new Set(['system_manager', 'super_admin']);

        if (allowedAdminRoles.has(role)) return;

        const perms = freshUserData.permissions && typeof freshUserData.permissions === 'object'
            ? freshUserData.permissions
            : {};
        let hasAccess = true;

        if (currentPath.includes('index.html') && perms.dashboard !== true) hasAccess = false;
        if (currentPath.includes('inventory.html') && perms.inventory !== true) hasAccess = false; // ໜ້າສະຕັອກ
        if (currentPath.includes('receive-items.html') && perms.receive !== true) hasAccess = false; // ໜ້າຮັບເຄື່ອງ
        if (currentPath.includes('create-issue.html') && perms.issue !== true) hasAccess = false; // ໜ້າສ້າງໃບເບີກ
        if (currentPath.includes('issue-items.html') && !(perms.issue === true || perms.field === true)) hasAccess = false; // ໜ້າສົມທຽບ (ສາງ) ຫຼື ລາຍງານ (ຊ່າງ)
        if (currentPath.includes('manage-users.html') && perms.manageUsers !== true) hasAccess = false;

        if (!hasAccess) {
            alert('🚫 ຂໍອະໄພ! ບັນຊີຂອງທ່ານບໍ່ມີສິດເຂົ້າເຖິງໜ້າວຽກນີ້.');
            safeRedirect('index.html');
        }

    } catch (error) {
        // ຖ້າການກວດສອບ Profile ຜິດພາດ (ເຊັ່ນ: Network error, user ບໍ່ມີ profile)
        console.error('Auth guard validation error:', error);
        localStorage.removeItem('wm_user_data');
        await signOut(auth);

        // ຖ້າບໍ່ໄດ້ຢູ່ໜ້າ Login, ໃຫ້ສົ່ງໄປໜ້າ Login
        if (!onLoginPage) {
            safeRedirect('login.html');
        }
        // ຖ້າຢູ່ໜ້າ Login ຢູ່ແລ້ວ, ກໍບໍ່ຕ້ອງເຮັດຫຍັງ, ໃຫ້ user ລັອກອິນໃໝ່
    }
});