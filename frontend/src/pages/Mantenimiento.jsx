import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import "../styles/Mantenimiento.css";

export default function Mantenimiento() {
  const [mantenimientos, setMantenimientos] = useState(() => {
    return JSON.parse(localStorage.getItem("mantenimientos")) || [];
  });

  const [form, setForm] = useState({
    fecha: "",
    activo: "",
    descripcion: "",
    responsable: "",
    observaciones: "",
    tipo: "",
    usuario: "",
  });

  const [editIndex, setEditIndex] = useState(null);
  const [searchActivo, setSearchActivo] = useState("");

  const tipos = ["Preventivo", "Correctivo"];

  useEffect(() => {
    localStorage.setItem("mantenimientos", JSON.stringify(mantenimientos));
  }, [mantenimientos]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editIndex === null) {
      setMantenimientos([...mantenimientos, form]);
    } else {
      const nuevos = [...mantenimientos];
      nuevos[editIndex] = form;
      setMantenimientos(nuevos);
      setEditIndex(null);
    }
    setForm({
      fecha: "",
      activo: "",
      descripcion: "",
      responsable: "",
      observaciones: "",
      tipo: "",
      usuario: "",
    });
  };

  const handleEdit = (index) => {
    setForm(mantenimientos[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    if (window.confirm("¿Eliminar este mantenimiento?")) {
      setMantenimientos(mantenimientos.filter((_, i) => i !== index));
    }
  };

  const historicoFiltrado = mantenimientos.filter((m) =>
    m.activo.toLowerCase().includes(searchActivo.toLowerCase())
  );

  return (
    <div className="container-mantenimiento">
      <h1>🛠️ Mantenimiento de Activos</h1>

      <input
        type="text"
        placeholder="Buscar por activo..."
        value={searchActivo}
        onChange={(e) => setSearchActivo(e.target.value)}
        className="search-input"
      />

      <form onSubmit={handleSubmit} className="form-mantenimiento">
        <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
        <input type="text" name="activo" value={form.activo} onChange={handleChange} placeholder="ACTIVO" required />
        <input type="text" name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="DESCRIPCIÓN" />
        <input type="text" name="responsable" value={form.responsable} onChange={handleChange} placeholder="RESPONSABLE" />
        <input type="text" name="observaciones" value={form.observaciones} onChange={handleChange} placeholder="OBSERVACIONES" />

        <select name="tipo" value={form.tipo} onChange={handleChange}>
          <option value="">TIPO DE MANTENIMIENTO</option>
          {tipos.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <input type="text" name="usuario" value={form.usuario} onChange={handleChange} placeholder="USUARIO QUE REGISTRÓ" />

        <button type="submit">
          {editIndex === null ? "Agregar Mantenimiento" : "Guardar Cambios"}
        </button>
      </form>

      {/* TABLA RESPONSIVE */}
      <div className="tabla-container">
        <table className="tabla-mantenimiento">
          <thead>
            <tr>
              {Object.keys(form).map((key) => (
                <th key={key}>{key.toUpperCase()}</th>
              ))}
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {historicoFiltrado.map((m, i) => (
              <tr key={i}>
                {Object.keys(form).map((key) => (
                  <td key={key}>{m[key]}</td>
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
