import { serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js';

export function getStockActor(userData = {}) {
    return {
        uid: userData.uid || userData.authUid || null,
        name: userData.fullName || userData.email || 'ຜູ້ໃຊ້ລະບົບ',
        email: userData.email || ''
    };
}

export function createStockMovement({ actor, material, before, after, quantity, type, source, referenceId = null }) {
    return {
        materialId: material.id,
        itemCode: material.itemCode || '',
        itemName: material.itemName || '',
        quantityBefore: Number(before || 0),
        quantityAfter: Number(after || 0),
        quantityChanged: Number(quantity || 0),
        type,
        source,
        referenceId,
        performedBy: actor,
        createdAt: serverTimestamp()
    };
}
