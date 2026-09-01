// Runtime settings loaded before Firebase modules.
// Use the live backend in production and localhost only for local development.
const defaultApiUrl = (typeof window !== 'undefined' && window.location && window.location.hostname !== 'localhost')
    ? 'https://water-meter-backend.onrender.com'
    : 'http://localhost:5000';

window.WATER_METER_API_URL = window.WATER_METER_API_URL || defaultApiUrl;
window.globalThis = window.globalThis || window;
window.globalThis.WATER_METER_API_URL = window.WATER_METER_API_URL;
