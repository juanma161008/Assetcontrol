import React, { useState, useEffect } from "react";
import "../styles/activos.css";

export default function Activos() {
  const [activos, setActivos] = useState(() => JSON.parse(localStorage.getItem("activos")) || []);
  const [form, setForm] = useState({
    sede: "", activo: "", serial: "", nombre: "",
    areaPrincipal: "", areaSecundaria: "", equipo: "",
    marca: "", modelo: "", procesador: "", ram: "",
    tipo: "", hdd: "", tipoHdd: "", os: "",
  });
  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState("");
  const [activoSeleccionado, setActivoSeleccionado] = useState(null);



  const areas = ["Administrativa", "Tecnología", "Contabilidad", "RRHH"];
  const rams = ["4GB", "8GB", "16GB", "32GB"];
  const discos = ["256GB", "512GB", "1TB", "2TB"];
  const sistemas = ["Windows 10", "Windows 11", "Linux", "MacOS"];

  useEffect(() => {
    localStorage.setItem("activos", JSON.stringify(activos));
  }, [activos]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex === null) {
      setActivos([...activos, form]);
    } else {
      const newActivos = [...activos];
      newActivos[editIndex] = form;
      setActivos(newActivos);
      setEditIndex(null);
    }
    setForm({
      sede: "", activo: "", serial: "", nombre: "",
      areaPrincipal: "", areaSecundaria: "", equipo: "",
      marca: "", modelo: "", procesador: "", ram: "",
      tipo: "", hdd: "", tipoHdd: "", os: "",
    });
  };

  const handleEdit = (i) => {
  setForm(activos[i]);
  setActivoSeleccionado(activos[i]);
  setEditIndex(i);
};


  const handleDelete = (i) => {
    if (window.confirm("¿Eliminar este activo?")) {
      setActivos(activos.filter((_, idx) => idx !== i));
    }
  };

  const filteredActivos = activos.filter(a =>
    a.nombre.toLowerCase().includes(search.toLowerCase()) ||
    a.activo.toLowerCase().includes(search.toLowerCase()) ||
    a.serial.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container-activos">
      <h1>📦 Gestión de Activos</h1>

      <input
        type="text"
        placeholder="Buscar por nombre, activo o serial..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <form onSubmit={handleSubmit} className="form-activo">
        <input name="sede" value={form.sede} onChange={handleChange} placeholder="SEDE" required />
        <input name="activo" value={form.activo} onChange={handleChange} placeholder="ACTIVO" required />
        <input name="serial" value={form.serial} onChange={handleChange} placeholder="SERIAL" />
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="NOMBRE" />

        <select name="areaPrincipal" value={form.areaPrincipal} onChange={handleChange}>
          <option value="">ÁREA PRINCIPAL</option>
          {areas.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <select name="areaSecundaria" value={form.areaSecundaria} onChange={handleChange}>
          <option value="">ÁREA SECUNDARIA</option>
          {areas.map(a => <option key={a} value={a}>{a}</option>)}
        </select>

        <input name="equipo" value={form.equipo} onChange={handleChange} placeholder="EQUIPO" />
        <input name="marca" value={form.marca} onChange={handleChange} placeholder="MARCA" />
        <input name="modelo" value={form.modelo} onChange={handleChange} placeholder="MODELO" />
        <input name="procesador" value={form.procesador} onChange={handleChange} placeholder="PROCESADOR" />

        <select name="ram" value={form.ram} onChange={handleChange}>
          <option value="">RAM</option>
          {rams.map(r => <option key={r} value={r}>{r}</option>)}
        </select>

        <input name="tipo" value={form.tipo} onChange={handleChange} placeholder="TIPO" />

        <select name="hdd" value={form.hdd} onChange={handleChange}>
          <option value="">HDD</option>
          {discos.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <input name="tipoHdd" value={form.tipoHdd} onChange={handleChange} placeholder="TIPO HDD" />

        <select name="os" value={form.os} onChange={handleChange}>
          <option value="">SISTEMA OPERATIVO</option>
          {sistemas.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <button type="submit">
          {editIndex === null ? "Agregar Activo" : "Guardar Cambios"}
        </button>
      </form>

      {/* TABLA RESPONSIVE */}
      <div className="tabla-container">
        <table className="tabla-activos">
          <thead>
            <tr>
              {Object.keys(form).map(key => (
                <th key={key}>{key.replace(/([A-Z])/g, " $1").toUpperCase()}</th>
              ))}
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {filteredActivos.map((a, i) => (
              <tr key={i}>
                {Object.keys(form).map(key => (
                  <td key={key}>{a[key]}</td>
                ))}
                <td>
                  <button onClick={() => handleEdit(i)}>✏️</button>
                  <button onClick={() => handleDelete(i)}>🗑️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
