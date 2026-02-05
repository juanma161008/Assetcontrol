// src/components/FacturaMantenimiento.jsx - COMPLETO
import { useEffect, useState } from "react";
import logo from "../assets/logom5.png";
import "../styles/factura.css";
import FirmaDigital from "./firmadigital";

// =============================
// FUNCIONES HELPER
// =============================

// Función para generar número de factura automático
const generarNumeroFactura = (fecha = null, id = null) => {
  const now = fecha ? new Date(fecha) : new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  // Generar número aleatorio único
  const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  // Formato: M5-YYYYMMDD-HHMMSS-RANDOM
  const numeroBase = `M5-${year}${month}${day}-${hours}${minutes}${seconds}-${randomNum}`;
  
  // Si hay un ID, agregarlo
  const suffix = id ? `-ID${String(id).padStart(4, '0')}` : '';
  
  return `${numeroBase}${suffix}`;
};

// Función para formatear fecha automáticamente
const formatearFecha = (fechaInput) => {
  if (!fechaInput) {
    // Si no hay fecha, usar la actual
    return new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  }
  
  try {
    const fecha = new Date(fechaInput);
    if (isNaN(fecha.getTime())) {
      // Si la fecha no es válida, usar la actual
      return new Date().toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }
    
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return new Date().toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
};

export default function FacturaMantenimiento({ activo, mantenimiento }) {
  // =============================
  // GENERAR DATOS AUTOMÁTICOS
  // =============================
  const numeroFacturaAuto = generarNumeroFactura(mantenimiento.fecha, mantenimiento.id);
  const fechaFormateadaAuto = formatearFecha(mantenimiento.fecha);
  
  const storageKey = `factura_${mantenimiento.factura || numeroFacturaAuto}`;

  const [datosFactura, setDatosFactura] = useState({
    numeroFactura: mantenimiento.factura || numeroFacturaAuto,
    fecha: fechaFormateadaAuto,
    usuarioNombre: "",
    usuarioArea: "",
    usuarioCargo: "",
    autorizaNombre: "",
    autorizaCargo: "",
    autorizaFirma: "",
    tecnicoFirma: "",
  });

  const [bloqueada, setBloqueada] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureType, setSignatureType] = useState("");
  const [tempSignature, setTempSignature] = useState("");
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  /* =============================
     CARGAR / BLOQUEAR FACTURA
  ============================= */
  useEffect(() => {
    const guardada = localStorage.getItem(storageKey);

    if (guardada) {
      const datosGuardados = JSON.parse(guardada);
      // Asegurar que tenga número de factura y fecha
      if (!datosGuardados.numeroFactura) {
        datosGuardados.numeroFactura = datosFactura.numeroFactura;
      }
      if (!datosGuardados.fecha) {
        datosGuardados.fecha = datosFactura.fecha;
      }
      setDatosFactura(datosGuardados);
      setBloqueada(true);
    }
  }, [storageKey, datosFactura.numeroFactura, datosFactura.fecha]);

  /* =============================
     MANEJAR SCROLL DEL BODY
  ============================= */
  useEffect(() => {
    if (showSignatureModal || showUnlockModal) {
      document.body.classList.add('modal-open');
      
      return () => {
        document.body.classList.remove('modal-open');
      };
    }
  }, [showSignatureModal, showUnlockModal]);

  /* =============================
     CAMBIOS INPUT
  ============================= */
  const handleChange = (e) => {
    setDatosFactura({
      ...datosFactura,
      [e.target.name]: e.target.value,
    });
  };

  /* =============================
     MANEJAR FIRMA TEMPORAL
  ============================= */
  const handleTempSignatureChange = (signatureData) => {
    setTempSignature(signatureData);
  };

  /* =============================
     CONFIRMAR FIRMA
  ============================= */
  const confirmarFirma = async () => {
    if (tempSignature) {
      // Reducir el tamaño de la imagen de firma
      try {
        const smallSignature = await reducirFirma(tempSignature);
        setDatosFactura(prev => ({
          ...prev,
          [signatureType]: smallSignature
        }));
        
        setTempSignature("");
        setShowSignatureModal(false);
        setSignatureType("");
      } catch (error) {
        console.error("Error al reducir firma:", error);
        // Si hay error, usar la firma original
        setDatosFactura(prev => ({
          ...prev,
          [signatureType]: tempSignature
        }));
        setTempSignature("");
        setShowSignatureModal(false);
        setSignatureType("");
      }
    }
  };

  /* =============================
     REDUCIR TAMAÑO DE FIRMA
  ============================= */
  const reducirFirma = (dataURL) => {
    return new Promise((resolve, reject) => {
      // Si ya está reducida, devolverla
      if (dataURL.includes('image/jpeg')) {
        resolve(dataURL);
        return;
      }
      
      const img = new Image();
      img.onload = function() {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Reducir a un tamaño más pequeño
          canvas.width = 200;
          canvas.height = 80;
          
          // Dibujar imagen reducida
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          // Convertir a formato más pequeño (calidad 0.7)
          const reducedDataURL = canvas.toDataURL('image/jpeg', 0.7);
          resolve(reducedDataURL);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = reject;
      img.src = dataURL;
    });
  };

  /* =============================
     ABRIR MODAL DE FIRMA
  ============================= */
  const openSignatureModal = (type) => {
    if (bloqueada) return;
    
    // Cargar firma existente si la hay
    const firmaExistente = datosFactura[type] || "";
    if (firmaExistente) {
      setTempSignature(firmaExistente);
    } else {
      setTempSignature("");
    }
    
    setSignatureType(type);
    setShowSignatureModal(true);
  };

  /* =============================
     CERRAR MODAL DE FIRMA
  ============================= */
  const closeSignatureModal = () => {
    setShowSignatureModal(false);
    setSignatureType("");
    setTempSignature("");
  };

  /* =============================
     GUARDAR FACTURA
  ============================= */
  const guardarFactura = async () => {
    try {
      // Asegurar que tenga fecha y número actualizados
      const datosParaGuardar = {
        ...datosFactura,
        fecha: formatearFecha(datosFactura.fecha),
        numeroFactura: datosFactura.numeroFactura || generarNumeroFactura()
      };
      
      // Reducir firmas si es necesario
      if (datosParaGuardar.tecnicoFirma && !datosParaGuardar.tecnicoFirma.includes('image/jpeg')) {
        datosParaGuardar.tecnicoFirma = await reducirFirma(datosParaGuardar.tecnicoFirma);
      }
      
      if (datosParaGuardar.autorizaFirma && !datosParaGuardar.autorizaFirma.includes('image/jpeg')) {
        datosParaGuardar.autorizaFirma = await reducirFirma(datosParaGuardar.autorizaFirma);
      }
      
      // Guardar en localStorage
      localStorage.setItem(storageKey, JSON.stringify(datosParaGuardar));
      
      // Actualizar estado
      setDatosFactura(datosParaGuardar);
      setBloqueada(true);
      alert("✅ Factura guardada y bloqueada correctamente");
    } catch (error) {
      console.error("Error guardando factura:", error);
      alert("❌ Error al guardar la factura");
    }
  };

  /* =============================
     DESBLOQUEAR FACTURA
  ============================= */
  const desbloquearFactura = () => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas desbloquear esta factura?\n\n" +
      "Esto permitirá editar todos los campos y firmas."
    );
    
    if (confirmar) {
      setBloqueada(false);
      setShowUnlockModal(false);
      alert("🔓 Factura desbloqueada. Ahora puedes editar los campos.");
    }
  };

  /* =============================
     ELIMINAR FACTURA
  ============================= */
  const eliminarFactura = () => {
    const confirmar = window.confirm(
      "⚠️ ¿Estás seguro de que deseas eliminar todos los datos de esta factura?\n\n" +
      "Esta acción no se puede deshacer. Se borrarán todas las firmas y datos guardados."
    );
    
    if (confirmar) {
      localStorage.removeItem(storageKey);
      setDatosFactura({
        numeroFactura: datosFactura.numeroFactura,
        fecha: datosFactura.fecha,
        usuarioNombre: "",
        usuarioArea: "",
        usuarioCargo: "",
        autorizaNombre: "",
        autorizaCargo: "",
        autorizaFirma: "",
        tecnicoFirma: "",
      });
      setBloqueada(false);
      alert("🗑️ Todos los datos de la factura han sido eliminados.");
    }
  };

  /* =============================
     RENDERIZAR PREVIEW DE FIRMA
  ============================= */
  const renderSignaturePreview = (signatureData, label, type) => {
    if (signatureData) {
      return (
        <div className="signature-preview">
          <img 
            src={signatureData} 
            alt={`Firma de ${label}`} 
            className="signature-preview-img"
          />
          <small>Firma guardada</small>
        </div>
      );
    }
    
    return (
      <button
        type="button"
        onClick={() => openSignatureModal(type)}
        disabled={bloqueada}
        className="btn-firmar"
      >
        ✍️ Hacer clic para firmar
      </button>
    );
  };

  /* =============================
     ABRIR MODAL DE DESBLOQUEO
  ============================= */
  const abrirModalDesbloqueo = () => {
    setShowUnlockModal(true);
  };

  /* =============================
     CERRAR MODAL DE DESBLOQUEO
  ============================= */
  const cerrarModalDesbloqueo = () => {
    setShowUnlockModal(false);
  };

  return (
    <div className="factura" id="factura-print">

      {/* ================= HEADER ================= */}
      <div className="factura-header">
        <div className="empresa">
          <img src={logo} className="logo" alt="Microcinco SAS" />
          <div className="empresa-datos">
            <h2>MICROCINCO S.A.S</h2>
            <p>Medellín, Antioquia</p>
            <p>📧 mdaitagui@microcinco.com</p>
          </div>
        </div>

        <div className="factura-info">
          {/* Número de factura - siempre habrá uno */}
          <p><strong>Factura Nº:</strong> {
            datosFactura.numeroFactura || 
            mantenimiento.factura || 
            numeroFacturaAuto
          }</p>
          
          {/* Fecha - siempre formateada correctamente */}
          <p><strong>Fecha:</strong> {
            formatearFecha(datosFactura.fecha || mantenimiento.fecha || fechaFormateadaAuto)
          }</p>
          
          {/* Referencia útil para tracking */}
          <p><strong>Referencia:</strong> {
            mantenimiento.id ? `MT-${String(mantenimiento.id).padStart(4, '0')}` : 'Sin referencia'
          }</p>
          
          <div className="estado-factura">
            <span className={`badge ${bloqueada ? 'badge-bloqueada' : 'badge-editable'}`}>
              {bloqueada ? '🔒 BLOQUEADA' : '✏️ EDITABLE'}
              {bloqueada && datosFactura.numeroFactura && (
                <small style={{display: 'block', fontSize: '10px', marginTop: '2px'}}>
                  N°: {datosFactura.numeroFactura}
                </small>
              )}
            </span>
          </div>
        </div>
      </div>

      <h1 className="factura-titulo">ORDEN DE MANTENIMIENTO</h1>

      {/* ================= DATOS ACTIVO ================= */}
      <div className="bloque">
        <h3>Datos del activo</h3>
        <div className="grid">
          <p><strong>Activo:</strong> {activo.activo}</p>
          <p><strong>Serial:</strong> {activo.serial}</p>
          <p><strong>Equipo:</strong> {activo.equipo}</p>
          <p><strong>Marca:</strong> {activo.marca}</p>
          <p><strong>Modelo:</strong> {activo.modelo}</p>
          <p><strong>Procesador:</strong> {activo.procesador}</p>
          <p><strong>RAM:</strong> {activo.ram}</p>
          <p><strong>Disco:</strong> {activo.hdd}</p>
          <p><strong>Sistema Operativo:</strong> {activo.os}</p>
        </div>
      </div>

      {/* ================= USUARIO HABITUAL ================= */}
      <div className="bloque">
        <h3>Usuario habitual del equipo</h3>
        <div className="grid">
          <div className="campo">
            <label>Nombre</label>
            <input
              name="usuarioNombre"
              value={datosFactura.usuarioNombre}
              onChange={handleChange}
              disabled={bloqueada}
              placeholder={bloqueada ? "" : "Ingrese nombre completo"}
            />
          </div>

          <div className="campo">
            <label>Área</label>
            <input
              name="usuarioArea"
              value={datosFactura.usuarioArea}
              onChange={handleChange}
              disabled={bloqueada}
              placeholder={bloqueada ? "" : "Ej: Ventas, Administración"}
            />
          </div>

          <div className="campo">
            <label>Cargo</label>
            <input
              name="usuarioCargo"
              value={datosFactura.usuarioCargo}
              onChange={handleChange}
              disabled={bloqueada}
              placeholder={bloqueada ? "" : "Ej: Asistente, Gerente"}
            />
          </div>
        </div>
      </div>

      {/* ================= TIPO MANTENIMIENTO ================= */}
      <div className="bloque">
        <h3>Tipo de mantenimiento</h3>
        <div className="checkboxes">
          <label>
            <input
              type="checkbox"
              checked={mantenimiento.tipo === "Preventivo"}
              readOnly
            />
            Preventivo
          </label>

          <label>
            <input
              type="checkbox"
              checked={mantenimiento.tipo === "Correctivo"}
              readOnly
            />
            Correctivo
          </label>
        </div>
      </div>

      {/* ================= TRABAJO REALIZADO ================= */}
      <div className="bloque">
        <h3>Trabajo realizado</h3>
        <textarea
          className="textarea"
          value={mantenimiento.descripcion}
          readOnly
        />
      </div>

      {/* ================= RESPONSABLE ================= */}
      <div className="bloque">
        <h3>Responsable del mantenimiento</h3>
        <div className="grid">
          <p><strong>Técnico:</strong> {mantenimiento.tecnico}</p>
          <div className="campo-firma">
            <label>Firma del técnico</label>
            {renderSignaturePreview(datosFactura.tecnicoFirma, "Técnico", "tecnicoFirma")}
          </div>
        </div>
      </div>

      {/* ================= AUTORIZACIÓN ================= */}
      <div className="bloque">
        <h3>Autorización</h3>
        <div className="grid">
          <div className="campo">
            <label>Nombre</label>
            <input
              name="autorizaNombre"
              value={datosFactura.autorizaNombre}
              onChange={handleChange}
              disabled={bloqueada}
              placeholder={bloqueada ? "" : "Nombre del autorizador"}
            />
          </div>

          <div className="campo">
            <label>Cargo</label>
            <input
              name="autorizaCargo"
              value={datosFactura.autorizaCargo}
              onChange={handleChange}
              disabled={bloqueada}
              placeholder={bloqueada ? "" : "Cargo del autorizador"}
            />
          </div>

          <div className="campo-firma">
            <label>Firma del autorizador</label>
            {renderSignaturePreview(datosFactura.autorizaFirma, "Autorizador", "autorizaFirma")}
          </div>
        </div>
      </div>

      {/* ================= BOTONES DE ACCIÓN ================= */}
      <div className="bloque acciones">
        {!bloqueada ? (
          <button onClick={guardarFactura} className="btn-guardar">
            💾 Guardar y Bloquear Factura
          </button>
        ) : (
          <div className="botones-bloqueados">
            <button onClick={abrirModalDesbloqueo} className="btn-desbloquear">
              🔓 Desbloquear para Editar
            </button>
            <button onClick={eliminarFactura} className="btn-eliminar">
              🗑️ Eliminar Datos
            </button>
          </div>
        )}
      </div>

      {/* ================= MODAL DE FIRMA ================= */}
      {showSignatureModal && (
        <div className="signature-modal-overlay" onClick={closeSignatureModal}>
          <div className="signature-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="signature-modal-header">
              <h3>
                {signatureType === "tecnicoFirma" 
                  ? "Firma del Técnico" 
                  : "Firma del Autorizador"}
              </h3>
              <button className="close-modal" onClick={closeSignatureModal}>
                ×
              </button>
            </div>
            
            <div className="signature-modal-body">
              <FirmaDigital
                value={tempSignature}
                onChange={handleTempSignatureChange}
                disabled={bloqueada}
                label="Dibuja tu firma:"
              />
              
              <div className="signature-modal-instructions">
                <p>💡 <strong>Instrucciones:</strong></p>
                <ul>
                  <li>Usa el mouse o tu dedo para firmar</li>
                  <li>Haz clic en "Limpiar firma" si quieres empezar de nuevo</li>
                  <li>Confirma tu firma cuando estés satisfecho</li>
                </ul>
              </div>
            </div>
            
            <div className="signature-modal-footer">
              <button 
                className="btn-confirmar-firma"
                onClick={confirmarFirma}
                disabled={!tempSignature}
              >
                ✅ Confirmar Firma
              </button>
              <button 
                className="btn-cancelar-firma"
                onClick={closeSignatureModal}
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL DE DESBLOQUEO ================= */}
      {showUnlockModal && (
        <div className="signature-modal-overlay" onClick={cerrarModalDesbloqueo}>
          <div className="unlock-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="signature-modal-header">
              <h3>🔓 Desbloquear Factura</h3>
              <button className="close-modal" onClick={cerrarModalDesbloqueo}>
                ×
              </button>
            </div>
            
            <div className="signature-modal-body">
              <div className="unlock-warning">
                <p>⚠️ <strong>Advertencia:</strong> Al desbloquear la factura podrás modificar todos los campos, incluyendo las firmas.</p>
              </div>
              
              <div className="unlock-instructions">
                <p>¿Estás seguro de que deseas desbloquear esta factura?</p>
                <ul>
                  <li>Podrás editar todos los campos de texto</li>
                  <li>Podrás modificar o eliminar las firmas</li>
                  <li>Los cambios no se guardarán hasta que vuelvas a bloquear</li>
                </ul>
              </div>
            </div>
            
            <div className="signature-modal-footer">
              <button 
                className="btn-confirmar-firma"
                onClick={desbloquearFactura}
              >
                ✅ Sí, Desbloquear
              </button>
              <button 
                className="btn-cancelar-firma"
                onClick={cerrarModalDesbloqueo}
              >
                ❌ Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}