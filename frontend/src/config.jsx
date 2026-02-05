// config.js

// Configuración de API base - Detecta automáticamente
const getApiBaseUrl = () => {
  // Si estamos en desarrollo local
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return "http://localhost:5000";
  }
  
  // Si estamos en la red local con IP específica
  if (window.location.hostname === '10.1.9.160') {
    return "http://10.1.9.160:5000";
  }
  
  // Para otros casos (puedes agregar más)
  return "http://10.1.9.160:5000"; // O tu IP pública si la tienes
};

// Configuración exportable
export const API_BASE_URL = getApiBaseUrl();
export const APP_VERSION = "1.0.0";