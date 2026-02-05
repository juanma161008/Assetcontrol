// src/utils/facturaUtils.js
export function generarNumeroFactura(fecha = null, id = null) {
  // Formato: M5-YYYYMMDD-XXXX
  const now = fecha ? new Date(fecha) : new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  
  // Generar número secuencial basado en localStorage
  const key = 'factura_contador';
  let contador = localStorage.getItem(key);
  
  if (!contador) {
    // Iniciar contador basado en fecha
    contador = `${year}${month}${day}0001`;
  } else {
    // Incrementar contador
    const numero = parseInt(contador.slice(-4)) + 1;
    contador = `${year}${month}${day}${String(numero).padStart(4, '0')}`;
  }
  
  // Guardar nuevo contador
  localStorage.setItem(key, contador);
  
  // Si hay un ID único, agregarlo al final
  const suffix = id ? `-${String(id).slice(-4)}` : '';
  
  return `M5-${contador}${suffix}`;
}

export function formatearFecha(fecha) {
  const date = new Date(fecha);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}