// src/pages/Mantenimientos.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/mantenimiento.css";
import { API_BASE_URL } from "../config";

export default function Mantenimiento() {
  const navigate = useNavigate();

  // Estados
  const [mantenimientos, setMantenimientos] = useState([]);
  const [activos, setActivos] = useState([]);
  const [buscar, setBuscar] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Modal
  const [showModal, setShowModal] = useState(false);
  const [modalMantenimiento, setModalMantenimiento] = useState(null);
  
  // Formulario
  const [form, setForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    activo: "",
    tipo: "",
    tecnico: "",
    descripcion: "",
  });

  // =========================
  // CARGAR DATOS INICIALES
  // =========================
  useEffect(() => {
    console.log(`🔗 Mantenimientos usando API: ${API_BASE_URL}`);
    cargarMantenimientos();
    cargarActivos();
  }, []);

  const cargarMantenimientos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/mantenimientos/getAllMantenimientos`);
      
      if (!response.ok) {
        throw new Error("Error al cargar mantenimientos");
      }
      
      const data = await response.json();
      setMantenimientos(data);
    } catch (error) {
      console.error("Error:", error);
      setError("Error al cargar mantenimientos del servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const cargarActivos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/activos/getAllActivos`);
      
      if (response.ok) {
        const data = await response.json();
        setActivos(data);
      }
    } catch (error) {
      console.error("Error al cargar activos:", error);
    }
  };

  // =========================
  // MANEJO DEL FORMULARIO
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // CREAR NUEVO MANTENIMIENTO
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validaciones básicas
    if (!form.fecha || !form.activo || !form.tipo || !form.tecnico) {
      setError("Todos los campos son requeridos excepto observaciones");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/mantenimientos/addNewMantenimiento`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fecha: form.fecha,
          activo: form.activo,
          tipo: form.tipo,
          tecnico: form.tecnico,
          descripcion: form.descripcion || "",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(`✅ Mantenimiento creado exitosamente - ID: ${data.id}`);
        
        // Limpiar formulario
        setForm({
          fecha: new Date().toISOString().split('T')[0],
          activo: "",
          tipo: "",
          tecnico: "",
          descripcion: "",
        });

        // Recargar la lista
        cargarMantenimientos();
      } else {
        setError(`❌ ${data.error || "Error al crear mantenimiento"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("❌ Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // FORMATEAR FECHA
  // =========================
  const formatFecha = (fechaString) => {
    if (!fechaString) return "N/A";
    
    try {
      const fecha = new Date(fechaString);
      
      if (isNaN(fecha.getTime())) {
        return fechaString;
      }
      
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const año = fecha.getFullYear();
      
      return `${dia}/${mes}/${año}`;
    } catch (error) {
      return fechaString;
    }
  };

  // =========================
  // ABRIR MODAL PARA ACCIONES
  // =========================
  const abrirModal = (mantenimiento) => {
    setModalMantenimiento({
      ...mantenimiento,
      fecha: mantenimiento.fecha ? mantenimiento.fecha.split('T')[0] : ""
    });
    setShowModal(true);
  };

  const cerrarModal = () => {
    setShowModal(false);
    setModalMantenimiento(null);
    setError("");
    setSuccess("");
  };

  // =========================
  // ACTUALIZAR MANTENIMIENTO DESDE MODAL
  // =========================
  const handleActualizar = async () => {
    if (!modalMantenimiento) return;

    setError("");
    setSuccess("");

    const { id, fecha, activo, tipo, tecnico, descripcion } = modalMantenimiento;

    if (!fecha || !activo || !tipo || !tecnico) {
      setError("Todos los campos son requeridos excepto observaciones");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/mantenimientos/updateMantenimiento/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fecha,
          activo,
          tipo,
          tecnico,
          descripcion: descripcion || "",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("✅ Mantenimiento actualizado exitosamente");
        
        // Cerrar modal y recargar lista
        setTimeout(() => {
          cerrarModal();
          cargarMantenimientos();
        }, 1500);
      } else {
        setError(`❌ ${data.error || "Error al actualizar mantenimiento"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("❌ Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // ELIMINAR MANTENIMIENTO DESDE MODAL
  // =========================
  const handleEliminar = async () => {
    if (!modalMantenimiento || !window.confirm("¿Estás seguro de eliminar este mantenimiento?")) {
      return;
    }

    setError("");
    setSuccess("");

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/mantenimientos/deleteMantenimiento/${modalMantenimiento.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("✅ Mantenimiento eliminado exitosamente");
        
        // Cerrar modal y recargar lista
        setTimeout(() => {
          cerrarModal();
          cargarMantenimientos();
        }, 1500);
      } else {
        setError(`❌ ${data.error || "Error al eliminar mantenimiento"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("❌ Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // GENERAR FACTURA
  // =========================
  const generarFactura = () => {
    if (!modalMantenimiento) return;
    
    // Buscar información completa del activo
    const activoSeleccionado = activos.find(a => a.activo === modalMantenimiento.activo);
    
    if (!activoSeleccionado) {
      setError("❌ No se encontró información completa del activo para generar la factura");
      return;
    }

    // Guardar datos en localStorage para la página de factura
    localStorage.setItem("activoFactura", JSON.stringify(activoSeleccionado));
    localStorage.setItem("mantenimientoFactura", JSON.stringify(modalMantenimiento));
    
    // Cerrar modal y navegar a la página de factura
    cerrarModal();
    navigate(`/factura/${modalMantenimiento.id}`);
  };

  // =========================
  // FILTRAR MANTENIMIENTOS
  // =========================
  const filtrados = mantenimientos.filter(
    (m) =>
      (m.activo && m.activo.toLowerCase().includes(buscar.toLowerCase())) ||
      (m.tecnico && m.tecnico.toLowerCase().includes(buscar.toLowerCase())) ||
      (m.descripcion && m.descripcion.toLowerCase().includes(buscar.toLowerCase()))
  );

  return (
    <div className="container-mantenimiento">
      <h1>🛠️ Mantenimientos</h1>

      {/* INFO DE CONEXIÓN */}
      <div className="connection-info">
        <small>🔗 Conectado a: {API_BASE_URL}</small>
      </div>

      {/* MENSAJES */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {/* BARRA DE BÚSQUEDA */}
      <input
        type="text"
        placeholder="🔍 Buscar por activo, técnico o descripción"
        value={buscar}
        onChange={(e) => setBuscar(e.target.value)}
        className="search-input"
      />

      {/* FORMULARIO PARA NUEVO MANTENIMIENTO */}
      <form className="form-mantenimiento" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="fecha">Fecha</label>
            <input 
              type="date" 
              id="fecha"
              name="fecha" 
              value={form.fecha} 
              onChange={handleChange} 
              required 
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="activo">Activo</label>
            <select 
              id="activo"
              name="activo" 
              value={form.activo} 
              onChange={handleChange} 
              required
              disabled={isLoading}
            >
              <option value="">Seleccione activo</option>
              {activos.map((a, i) => (
                <option key={i} value={a.activo}>
                  {a.activo} - {a.equipo || "Sin equipo"}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo de mantenimiento</label>
            <select 
              id="tipo"
              name="tipo" 
              value={form.tipo} 
              onChange={handleChange} 
              required
              disabled={isLoading}
            >
              <option value="">Tipo de mantenimiento</option>
              <option value="Preventivo">Preventivo</option>
              <option value="Correctivo">Correctivo</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="tecnico">Nombre del técnico</label>
            <input 
              id="tecnico"
              name="tecnico" 
              value={form.tecnico} 
              onChange={handleChange} 
              placeholder="Nombre del técnico" 
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="descripcion">Observaciones (opcional)</label>
            <input 
              id="descripcion"
              name="descripcion" 
              value={form.descripcion} 
              onChange={handleChange} 
              placeholder="Observaciones (opcional)"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={isLoading} className="btn-submit">
            {isLoading ? "Guardando..." : "Agregar Mantenimiento"}
          </button>
        </div>
      </form>

      {/* TABLA DE MANTENIMIENTOS */}
      <div className="table-container">
        {isLoading && mantenimientos.length === 0 ? (
          <div className="loading">Cargando mantenimientos...</div>
        ) : (
          <table className="tabla-mantenimiento">
            <thead>
              <tr>
                <th style={{ width: '100px' }}>Fecha</th>
                <th style={{ width: '120px' }}>Activo</th>
                <th style={{ width: '100px' }}>Tipo</th>
                <th style={{ width: '150px' }}>Técnico</th>
                <th>Descripción</th>
                <th style={{ width: '80px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-data">
                    {mantenimientos.length === 0 ? 
                      "No hay mantenimientos registrados" : 
                      "No se encontraron resultados para la búsqueda"}
                  </td>
                </tr>
              ) : (
                filtrados.map((m, i) => (
                  <tr key={i}>
                    <td>{formatFecha(m.fecha)}</td>
                    <td>{m.activo || "N/A"}</td>
                    <td>
                      <span className={`tipo-badge tipo-${m.tipo?.toLowerCase()}`}>
                        {m.tipo || "N/A"}
                      </span>
                    </td>
                    <td>{m.tecnico || "N/A"}</td>
                    <td className="descripcion-cell">
                      {m.descripcion ? 
                        (m.descripcion.length > 80 ? 
                          `${m.descripcion.substring(0, 80)}...` : 
                          m.descripcion) 
                        : "Sin observaciones"}
                    </td>
                    <td className="actions-cell">
                      <button 
                        className="btn-action"
                        onClick={() => abrirModal(m)}
                        title="Ver detalles y acciones"
                        disabled={isLoading}
                      >
                        📋
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL DE ACCIONES */}
      {showModal && modalMantenimiento && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles del Mantenimiento</h2>
              <button className="close-btn" onClick={cerrarModal}>×</button>
            </div>
            
            <div className="modal-body">
              {/* MENSAJES DENTRO DEL MODAL */}
              {error && <div className="alert alert-error">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}
              
              <div className="modal-info">
                <div className="info-row">
                  <span className="info-label">ID:</span>
                  <span className="info-value">{modalMantenimiento.id}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Fecha:</span>
                  <input
                    type="date"
                    value={modalMantenimiento.fecha || ""}
                    onChange={(e) => setModalMantenimiento({
                      ...modalMantenimiento,
                      fecha: e.target.value
                    })}
                    disabled={isLoading}
                    className="modal-input"
                  />
                </div>
                <div className="info-row">
                  <span className="info-label">Activo:</span>
                  <select
                    value={modalMantenimiento.activo || ""}
                    onChange={(e) => setModalMantenimiento({
                      ...modalMantenimiento,
                      activo: e.target.value
                    })}
                    disabled={isLoading}
                    className="modal-input"
                  >
                    <option value="">Seleccionar activo</option>
                    {activos.map((a, i) => (
                      <option key={i} value={a.activo}>
                        {a.activo} - {a.equipo}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="info-row">
                  <span className="info-label">Tipo:</span>
                  <select
                    value={modalMantenimiento.tipo || ""}
                    onChange={(e) => setModalMantenimiento({
                      ...modalMantenimiento,
                      tipo: e.target.value
                    })}
                    disabled={isLoading}
                    className="modal-input"
                  >
                    <option value="Preventivo">Preventivo</option>
                    <option value="Correctivo">Correctivo</option>
                  </select>
                </div>
                <div className="info-row">
                  <span className="info-label">Técnico:</span>
                  <input
                    type="text"
                    value={modalMantenimiento.tecnico || ""}
                    onChange={(e) => setModalMantenimiento({
                      ...modalMantenimiento,
                      tecnico: e.target.value
                    })}
                    disabled={isLoading}
                    className="modal-input"
                  />
                </div>
                <div className="info-row full-width">
                  <span className="info-label">Descripción:</span>
                  <textarea
                    value={modalMantenimiento.descripcion || ""}
                    onChange={(e) => setModalMantenimiento({
                      ...modalMantenimiento,
                      descripcion: e.target.value
                    })}
                    disabled={isLoading}
                    rows="3"
                    className="modal-input"
                  />
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              {/* BOTÓN PARA GENERAR FACTURA */}
              <button 
                className="btn-factura"
                onClick={generarFactura}
                disabled={isLoading}
              >
                🧾 Generar Factura
              </button>
              
              <div className="modal-actions">
                <button 
                  className="btn-actualizar"
                  onClick={handleActualizar}
                  disabled={isLoading}
                >
                  {isLoading ? "Guardando..." : "💾 Actualizar"}
                </button>
                <button 
                  className="btn-eliminar"
                  onClick={handleEliminar}
                  disabled={isLoading}
                >
                  🗑️ Eliminar
                </button>
                <button 
                  className="btn-cancelar"
                  onClick={cerrarModal}
                  disabled={isLoading}
                >
                  ❌ Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}