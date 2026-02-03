import React, { useState, useEffect } from "react";
import "../styles/activos.css";
import generarMantenimientoPDF from "../components/mantenimientopdf";

export default function Activos() {
  const [activos, setActivos] = useState(() =>
    JSON.parse(localStorage.getItem("activos")) || []
  );
  const [mantenimientos] = useState(() =>
    JSON.parse(localStorage.getItem("mantenimientos")) || []
  );

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
    tipo: "",
    hdd: "",
    tipoHdd: "",
    os: "",
    estado: "Disponible",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [activoSeleccionado, setActivoSeleccionado] = useState(null);
  const [verModal, setVerModal] = useState(false);
  const [historicoSeleccionado, setHistoricoSeleccionado] = useState([]);

  const areas = ["Administrativa", "Tecnología", "Contabilidad", "RRHH"];
  const rams = ["4GB", "8GB", "16GB", "32GB"];
  const discos = ["256GB", "512GB", "1TB", "2TB"];
  const sistemas = ["Windows 10", "Windows 11", "Linux", "MacOS"];
  const estados = ["Disponible", "Mantenimiento", "Fuera de servicio"];

  useEffect(() => {
    localStorage.setItem("activos", JSON.stringify(activos));
  }, [activos]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex === null) {
      setActivos([...activos, form]);
    } else {
      const nuevos = [...activos];
      nuevos[editIndex] = form;
      setActivos(nuevos);
      setEditIndex(null);
    }
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
      tipo: "",
      hdd: "",
      tipoHdd: "",
      os: "",
      estado: "Disponible",
    });
  };

  const handleEdit = (i) => {
    setForm(activos[i]);
    setEditIndex(i);
  };

  const handleDelete = (i) => {
    if (window.confirm("¿Eliminar este activo?")) {
      setActivos(activos.filter((_, idx) => idx !== i));
    }
  };

  const filteredActivos = activos.filter((a) =>
    Object.values(a).some((v) =>
      v.toLowerCase().includes(search.toLowerCase())
    )
  );

  const abrirModal = (activo) => {
    setActivoSeleccionado(activo);
    const historico = mantenimientos.filter((m) => m.activo === activo.activo);
    setHistoricoSeleccionado(historico);
    setVerModal(true);
  };

  return (
    <div className="container-activos">
      <h1>📦 Gestión de Activos</h1>

      <input
        type="text"
        placeholder="Buscar activo..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <form className="form-activo" onSubmit={handleSubmit}>
        <input name="sede" value={form.sede} onChange={handleChange} placeholder="SEDE" />
        <input name="activo" value={form.activo} onChange={handleChange} placeholder="ACTIVO" required />
        <input name="serial" value={form.serial} onChange={handleChange} placeholder="SERIAL" />
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="NOMBRE" />

        <select name="areaPrincipal" value={form.areaPrincipal} onChange={handleChange}>
          <option value="">ÁREA PRINCIPAL</option>
          {areas.map(a => <option key={a}>{a}</option>)}
        </select>

        <select name="areaSecundaria" value={form.areaSecundaria} onChange={handleChange}>
          <option value="">ÁREA SECUNDARIA</option>
          {areas.map(a => <option key={a}>{a}</option>)}
        </select>

        <input name="equipo" value={form.equipo} onChange={handleChange} placeholder="EQUIPO" />
        <input name="marca" value={form.marca} onChange={handleChange} placeholder="MARCA" />
        <input name="modelo" value={form.modelo} onChange={handleChange} placeholder="MODELO" />
        <input name="procesador" value={form.procesador} onChange={handleChange} placeholder="PROCESADOR" />

        <select name="ram" value={form.ram} onChange={handleChange}>
          <option value="">RAM</option>
          {rams.map(r => <option key={r}>{r}</option>)}
        </select>

        <select name="hdd" value={form.hdd} onChange={handleChange}>
          <option value="">HDD</option>
          {discos.map(d => <option key={d}>{d}</option>)}
        </select>

        <select name="os" value={form.os} onChange={handleChange}>
          <option value="">SISTEMA OPERATIVO</option>
          {sistemas.map(s => <option key={s}>{s}</option>)}
        </select>

        <select name="estado" value={form.estado} onChange={handleChange}>
          {estados.map(e => <option key={e}>{e}</option>)}
        </select>

        <button type="submit">
          {editIndex === null ? "Agregar Activo" : "Guardar Cambios"}
        </button>
      </form>

      <div className="tabla-container">
        <table className="tabla-activos">
          <thead>
            <tr>
              <th>Activo</th>
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
            {filteredActivos.map((a, i) => (
              <tr key={i} onClick={() => abrirModal(a)} style={{ cursor: "pointer" }}>
                <td>{a.activo}</td>
                <td>{a.equipo}</td>
                <td>{a.marca}</td>
                <td>{a.modelo}</td>
                <td>{a.serial}</td>
                <td>{a.areaPrincipal}{a.areaSecundaria && ` / ${a.areaSecundaria}`}</td>
                <td>{a.os}</td>
                <td>{a.estado}</td>
                <td>
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(i); }}>✏️</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(i); }}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL EMERGENTE */}
      {verModal && activoSeleccionado && (
        <div className="modal">
          <div className="modal-box">
            <h2>Detalle Activo: {activoSeleccionado.activo}</h2>
            <div className="modal-info">
              <p><strong>Nombre Responsable:</strong> {activoSeleccionado.nombre || "No definido"}</p>
              <p><strong>Equipo:</strong> {activoSeleccionado.equipo}</p>
              <p><strong>Marca:</strong> {activoSeleccionado.marca}</p>
              <p><strong>Modelo:</strong> {activoSeleccionado.modelo}</p>
              <p><strong>Serial:</strong> {activoSeleccionado.serial}</p>
              <p><strong>RAM:</strong> {activoSeleccionado.ram}</p>
              <p><strong>Disco:</strong> {activoSeleccionado.hdd}</p>
              <p><strong>SO:</strong> {activoSeleccionado.os}</p>
              <p><strong>Área:</strong> {activoSeleccionado.areaPrincipal}{activoSeleccionado.areaSecundaria && ` / ${activoSeleccionado.areaSecundaria}`}</p>
              <p><strong>Estado:</strong> {activoSeleccionado.estado}</p>
            </div>

            <h3>Histórico de Mantenimientos</h3>
            {historicoSeleccionado.length === 0 ? (
              <p>No hay mantenimientos registrados.</p>
            ) : (
              <table className="tabla-historico">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Tipo</th>
                    <th>Técnico</th>

                  </tr>
                </thead>
                <tbody>
                  {historicoSeleccionado.map((m, i) => (
                    <tr key={i}>
                      <td>{m.fecha}</td>
                      <td>{m.descripcion}</td>
                      <td>{m.tipo}</td>
                      <td>{m.tecnico}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="modal-actions">
              {historicoSeleccionado.length > 0 && (
                <button
  onClick={() => {
    generarMantenimientoPDF({
      activo: activoSeleccionado,
      mantenimientos: historicoSeleccionado
    });
  }}
>
  📄 Descargar PDF
</button>
              )}
              <button onClick={() => setVerModal(false)}>❌ Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
