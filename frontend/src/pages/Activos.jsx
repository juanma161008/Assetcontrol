// src/pages/Activos.jsx
import React, { useState, useEffect } from "react";
import "../styles/activos.css";
import generarMantenimientoPDF from "../components/MantenimientoPDF";
import { API_BASE_URL } from "../config";

export default function Activos() {
  // Estados
  const [activos, setActivos] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const [form, setForm] = useState({
    sede: "",
    activo: "",
    serial: "",
    nombre: "",
    areaPrincipal: "",
    areaSecundaria: "",
    equipo: "",
    marca: "",
    modelo: "",
    procesador: "",
    ram: "",
    hdd: "",
    os: "",
    estado: "Disponible",
  });

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [activoSeleccionado, setActivoSeleccionado] = useState(null);
  const [verModal, setVerModal] = useState(false);
  const [historicoSeleccionado, setHistoricoSeleccionado] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Opciones para select
  const areas = ["Administrativa", "Tecnología", "Contabilidad", "RRHH"];
  const rams = ["4GB", "8GB", "16GB", "32GB"];
  const discos = ["256GB", "512GB", "1TB", "2TB"];
  const sistemas = ["Windows 10", "Windows 11", "Linux", "MacOS"];
  const estados = ["Disponible", "Mantenimiento", "Fuera de servicio"];
  const sedes = ["Niquia", "Autopista"];

  // =========================
  // CARGAR DATOS INICIALES
  // =========================
  useEffect(() => {
    console.log(`🔗 Activos usando API: ${API_BASE_URL}`);
    cargarActivos();
    cargarMantenimientos();
  }, []);

  const cargarActivos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/activos/getAllActivos`);
      
      if (!response.ok) {
        throw new Error("Error al cargar activos");
      }
      
      const data = await response.json();
      setActivos(data);
    } catch (error) {
      console.error("Error:", error);
      setError("Error al cargar activos del servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const cargarMantenimientos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/mantenimientos/getAllMantenimientos`);
      
      if (response.ok) {
        const data = await response.json();
        setMantenimientos(data);
      }
    } catch (error) {
      console.error("Error al cargar mantenimientos:", error);
    }
  };

  // =========================
  // MANEJAR CAMBIOS EN FORMULARIO
  // =========================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // =========================
  // MANEJAR CAMBIO DE SEDE
  // =========================
  const handleSedeChange = (sede) => {
    setForm({ ...form, sede: sede });
  };

  // =========================
  // ENVIAR FORMULARIO (CREAR/ACTUALIZAR)
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validar campos requeridos
    const required = ["activo", "sede", "areaPrincipal", "equipo", "marca", "modelo", "estado"];
    for (const field of required) {
      if (!form[field]) {
        setError(`El campo ${field} es requerido`);
        return;
      }
    }

    setIsLoading(true);

    try {
      let response;
      
      if (editId) {
        // ACTUALIZAR ACTIVO EXISTENTE
        response = await fetch(`${API_BASE_URL}/api/v1/activos/updateActivo/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sede: form.sede,
            activo: form.activo,
            serial: form.serial,
            nombre: form.nombre,
            areaPrincipal: form.areaPrincipal,
            areaSecundaria: form.areaSecundaria,
            equipo: form.equipo,
            marca: form.marca,
            modelo: form.modelo,
            procesador: form.procesador,
            ram: form.ram,
            hdd: form.hdd,
            os: form.os,
            estado: form.estado,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess("✅ Activo actualizado exitosamente");
          cargarActivos();
          resetForm();
        } else {
          setError(`❌ ${data.error || "Error al actualizar activo"}`);
        }
      } else {
        // CREAR NUEVO ACTIVO
        response = await fetch(`${API_BASE_URL}/api/v1/activos/addNewActivo`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sede: form.sede,
            activo: form.activo,
            serial: form.serial,
            nombre: form.nombre,
            areaPrincipal: form.areaPrincipal,
            areaSecundaria: form.areaSecundaria,
            equipo: form.equipo,
            marca: form.marca,
            modelo: form.modelo,
            procesador: form.procesador,
            ram: form.ram,
            hdd: form.hdd,
            os: form.os,
            estado: form.estado,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setSuccess(`✅ Activo creado exitosamente - ID: ${data.id}`);
          cargarActivos();
          resetForm();
        } else {
          setError(`❌ ${data.error || "Error al crear activo"}`);
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setError("❌ Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  // =========================
  // RESET FORMULARIO
  // =========================
  const resetForm = () => {
    setForm({
      sede: "",
      activo: "",
      serial: "",
      nombre: "",
      areaPrincipal: "",
      areaSecundaria: "",
      equipo: "",
      marca: "",
      modelo: "",
      procesador: "",
      ram: "",
      hdd: "",
      os: "",
      estado: "Disponible",
    });
    setEditId(null);
  };

  // =========================
  // EDITAR ACTIVO
  // =========================
  const handleEdit = (activo, e) => {
    e.stopPropagation();
    
    if (!activo.id) {
      setError("❌ El activo no tiene un ID válido");
      return;
    }
    
    setEditId(activo.id);
    setForm({
      sede: activo.sede || "",
      activo: activo.activo || "",
      serial: activo.serial || "",
      nombre: activo.nombre || "",
      areaPrincipal: activo.areaPrincipal || "",
      areaSecundaria: activo.areaSecundaria || "",
      equipo: activo.equipo || "",
      marca: activo.marca || "",
      modelo: activo.modelo || "",
      procesador: activo.procesador || "",
      ram: activo.ram || "",
      hdd: activo.hdd || "",
      os: activo.os || "",
      estado: activo.estado || "Disponible",
    });
    
    // Scroll al formulario
    document.querySelector('.form-activo').scrollIntoView({ behavior: 'smooth' });
  };

  // =========================
  // ELIMINAR ACTIVO
  // =========================
  const handleDelete = async (activoId, e) => {
    e.stopPropagation();
    
    if (!window.confirm("¿Estás seguro de eliminar este activo?")) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/activos/deleteActivo/${activoId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("✅ Activo eliminado exitosamente");
        cargarActivos();
        
        if (editId === activoId) {
          resetForm();
        }
      } else {
        setError(`❌ ${data.error || "Error al eliminar activo"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("❌ Error de conexión con el servidor");
    }
  };

  // =========================
  // ABRIR MODAL CON HISTORIAL
  // =========================
  const abrirModal = (activo) => {
    setActivoSeleccionado(activo);
    
    const historico = mantenimientos.filter((m) => m.activo === activo.activo);
    setHistoricoSeleccionado(historico);
    
    setVerModal(true);
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
  // FILTRAR ACTIVOS
  // =========================
  const filteredActivos = activos.filter((a) =>
    Object.values(a).some((v) =>
      v && v.toString().toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="container-activos">
      <h1>📦 Gestión de Activos</h1>

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
        placeholder="Buscar activo por cualquier campo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
        disabled={isLoading}
      />

      {/* FORMULARIO */}
      <form className="form-activo" onSubmit={handleSubmit}>
        {/* SEDE */}
        <div className="sede-checkbox-container">
          <label className="sede-label">SEDE *</label>
          <div className="sede-options">
            {sedes.map((sede) => (
              <div key={sede} className="sede-option">
                <input
                  type="radio"
                  id={`sede-${sede}`}
                  name="sedeRadio"
                  checked={form.sede === sede}
                  onChange={() => handleSedeChange(sede)}
                  disabled={isLoading}
                  className="sede-radio"
                />
                <label 
                  htmlFor={`sede-${sede}`} 
                  className={`sede-checkbox-label ${form.sede === sede ? 'selected' : ''}`}
                >
                  {sede}
                </label>
              </div>
            ))}
          </div>
          {!form.sede && (
            <p className="sede-error">* Selecciona una sede</p>
          )}
        </div>
        
        {/* CAMPOS DEL FORMULARIO */}
        <input 
          name="activo" 
          value={form.activo} 
          onChange={handleChange} 
          placeholder="ACTIVO *" 
          required 
          disabled={isLoading}
        />
        
        <input 
          name="serial" 
          value={form.serial} 
          onChange={handleChange} 
          placeholder="SERIAL" 
          disabled={isLoading}
        />
        
        <input 
          name="nombre" 
          value={form.nombre} 
          onChange={handleChange} 
          placeholder="NOMBRE RESPONSABLE" 
          disabled={isLoading}
        />

        <select 
          name="areaPrincipal" 
          value={form.areaPrincipal} 
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="">ÁREA PRINCIPAL *</option>
          {areas.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <select 
          name="areaSecundaria" 
          value={form.areaSecundaria} 
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="">ÁREA SECUNDARIA</option>
          {areas.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <input 
          name="equipo" 
          value={form.equipo} 
          onChange={handleChange} 
          placeholder="EQUIPO *" 
          disabled={isLoading}
        />
        
        <input 
          name="marca" 
          value={form.marca} 
          onChange={handleChange} 
          placeholder="MARCA *" 
          disabled={isLoading}
        />
        
        <input 
          name="modelo" 
          value={form.modelo} 
          onChange={handleChange} 
          placeholder="MODELO *" 
          disabled={isLoading}
        />
        
        <input 
          name="procesador" 
          value={form.procesador} 
          onChange={handleChange} 
          placeholder="PROCESADOR" 
          disabled={isLoading}
        />

        <select 
          name="ram" 
          value={form.ram} 
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="">RAM</option>
          {rams.map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <select 
          name="hdd" 
          value={form.hdd} 
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="">HDD</option>
          {discos.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select 
          name="os" 
          value={form.os} 
          onChange={handleChange}
          disabled={isLoading}
        >
          <option value="">SISTEMA OPERATIVO</option>
          {sistemas.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select 
          name="estado" 
          value={form.estado} 
          onChange={handleChange}
          disabled={isLoading}
        >
          {estados.map(e => <option key={e} value={e}>{e}</option>)}
        </select>

        {/* BOTONES */}
        <button type="submit" disabled={isLoading} className="btn-submit">
          {isLoading ? "Guardando..." : editId ? "Actualizar Activo" : "Agregar Activo"}
        </button>
        
        {editId && (
          <button 
            type="button" 
            className="btn-cancelar" 
            onClick={resetForm}
            disabled={isLoading}
          >
            Cancelar Edición
          </button>
        )}
      </form>

      {/* TABLA DE ACTIVOS */}
      <div className="tabla-container">
        {isLoading && activos.length === 0 ? (
          <div className="loading">Cargando activos...</div>
        ) : (
          <table className="tabla-activos">
            <thead>
              <tr>
                <th>ID</th>
                <th>Activo</th>
                <th>Sede</th>
                <th>Equipo</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Serial</th>
                <th>Área</th>
                <th>OS</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivos.length === 0 ? (
                <tr>
                  <td colSpan="11" className="no-data">
                    {activos.length === 0 ? 
                      "No hay activos registrados" : 
                      "No se encontraron resultados para la búsqueda"}
                  </td>
                </tr>
              ) : (
                filteredActivos.map((a, i) => (
                  <tr key={i} onClick={() => abrirModal(a)} style={{ cursor: "pointer" }}>
                    <td>{a.id}</td>
                    <td>{a.activo}</td>
                    <td>
                      <span className={`sede-badge sede-${a.sede?.toLowerCase()}`}>
                        {a.sede}
                      </span>
                    </td>
                    <td>{a.equipo}</td>
                    <td>{a.marca}</td>
                    <td>{a.modelo}</td>
                    <td>{a.serial}</td>
                    <td>
                      {a.areaPrincipal}
                      {a.areaSecundaria && ` / ${a.areaSecundaria}`}
                    </td>
                    <td>{a.os}</td>
                    <td>
                      <span className={`estado-badge estado-${a.estado?.toLowerCase().replace(" ", "-")}`}>
                        {a.estado}
                      </span>
                    </td>
                    <td className="actions-cell">
                      <button 
                        onClick={(e) => handleEdit(a, e)}
                        title="Editar activo"
                        disabled={isLoading}
                        className="btn-edit"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={(e) => handleDelete(a.id, e)}
                        title="Eliminar activo"
                        disabled={isLoading}
                        className="btn-delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL EMERGENTE */}
      {verModal && activoSeleccionado && (
        <div className="modal-overlay" onClick={() => setVerModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalle Activo: {activoSeleccionado.activo}</h2>
              <button className="close-btn" onClick={() => setVerModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="modal-info">
                <div className="info-row">
                  <span className="info-label">ID:</span>
                  <span className="info-value">{activoSeleccionado.id}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Sede:</span>
                  <span className="info-value">
                    <span className={`sede-badge sede-${activoSeleccionado.sede?.toLowerCase()}`}>
                      {activoSeleccionado.sede}
                    </span>
                  </span>
                </div>
                <div className="info-row">
                  <span className="info-label">Nombre Responsable:</span>
                  <span className="info-value">{activoSeleccionado.nombre || "No definido"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Equipo:</span>
                  <span className="info-value">{activoSeleccionado.equipo}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Marca:</span>
                  <span className="info-value">{activoSeleccionado.marca}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Modelo:</span>
                  <span className="info-value">{activoSeleccionado.modelo}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Serial:</span>
                  <span className="info-value">{activoSeleccionado.serial}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Procesador:</span>
                  <span className="info-value">{activoSeleccionado.procesador || "No especificado"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">RAM:</span>
                  <span className="info-value">{activoSeleccionado.ram || "No especificada"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Disco:</span>
                  <span className="info-value">{activoSeleccionado.hdd || "No especificado"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Sistema Operativo:</span>
                  <span className="info-value">{activoSeleccionado.os || "No especificado"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Área Principal:</span>
                  <span className="info-value">{activoSeleccionado.areaPrincipal}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Área Secundaria:</span>
                  <span className="info-value">{activoSeleccionado.areaSecundaria || "No asignada"}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Estado:</span>
                  <span className={`info-value estado-badge estado-${activoSeleccionado.estado?.toLowerCase().replace(" ", "-")}`}>
                    {activoSeleccionado.estado}
                  </span>
                </div>
              </div>

              <h3>📋 Histórico de Mantenimientos</h3>
              {historicoSeleccionado.length === 0 ? (
                <p className="no-mantenimientos">No hay mantenimientos registrados para este activo.</p>
              ) : (
                <div className="table-responsive">
                  <table className="tabla-historico">
                    <thead>
                      <tr>
                        <th>Fecha</th>
                        <th>Tipo</th>
                        <th>Técnico</th>
                        <th>Descripción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historicoSeleccionado.map((m, i) => (
                        <tr key={i}>
                          <td>{formatFecha(m.fecha)}</td>
                          <td>{m.tipo}</td>
                          <td>{m.tecnico}</td>
                          <td>{m.descripcion || "Sin descripción"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="modal-footer">
              {historicoSeleccionado.length > 0 && (
                <button
                  className="btn-pdf"
                  onClick={() => {
                    generarMantenimientoPDF({
                      activo: activoSeleccionado,
                      mantenimientos: historicoSeleccionado
                    });
                  }}
                  disabled={isLoading}
                >
                  📄 Descargar PDF del Historial
                </button>
              )}
              <button 
                className="btn-cerrar"
                onClick={() => setVerModal(false)}
                disabled={isLoading}
              >
                ❌ Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}