import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/mantenimiento.css";

export default function Mantenimiento() {
  const navigate = useNavigate();

  const [mantenimientos, setMantenimientos] = useState(
    () => JSON.parse(localStorage.getItem("mantenimientos")) || []
  );

  const [activos] = useState(
    () => JSON.parse(localStorage.getItem("activos")) || []
  );

  const [buscar, setBuscar] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const [form, setForm] = useState({
    fecha: "",
    activo: "",
    tipo: "",
    tecnico: "",
    descripcion: "",
  });

  useEffect(() => {
    localStorage.setItem("mantenimientos", JSON.stringify(mantenimientos));
  }, [mantenimientos]);

  const generarConsecutivo = () => {
    const last = Number(localStorage.getItem("facturaConsecutivo") || 4000);
    const next = last + 1;
    localStorage.setItem("facturaConsecutivo", next);
    return next;
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editIndex !== null) {
      const copia = [...mantenimientos];
      copia[editIndex] = { ...copia[editIndex], ...form };
      setMantenimientos(copia);
      setEditIndex(null);
    } else {
      setMantenimientos([
        ...mantenimientos,
        { ...form, factura: generarConsecutivo() },
      ]);
    }

    setForm({
      fecha: "",
      activo: "",
      tipo: "",
      tecnico: "",
      descripcion: "",
    });
  };

  const handleEdit = (i) => {
    setForm(mantenimientos[i]);
    setEditIndex(i);
  };

  const handleDelete = (i) => {
    if (window.confirm("¿Eliminar mantenimiento?")) {
      setMantenimientos(mantenimientos.filter((_, idx) => idx !== i));
    }
  };

  const filtrados = mantenimientos.filter(
    (m) =>
      m.activo.toLowerCase().includes(buscar.toLowerCase()) ||
      m.tecnico.toLowerCase().includes(buscar.toLowerCase()) ||
      m.factura.toString().includes(buscar)
  );

  return (
    <div className="container-mantenimiento">
      <h1>🛠️ Mantenimientos</h1>

      <input
        placeholder="🔍 Buscar por activo, técnico o factura"
        value={buscar}
        onChange={(e) => setBuscar(e.target.value)}
      />

      <form className="form-mantenimiento" onSubmit={handleSubmit}>
        <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />

        <select name="activo" value={form.activo} onChange={handleChange} required>
          <option value="">Seleccione activo</option>
          {activos.map((a, i) => (
            <option key={i} value={a.activo}>{a.activo}</option>
          ))}
        </select>

        <select name="tipo" value={form.tipo} onChange={handleChange} required>
          <option value="">Tipo</option>
          <option>Preventivo</option>
          <option>Correctivo</option>
        </select>

        <input name="tecnico" value={form.tecnico} onChange={handleChange} placeholder="Técnico" required />
        <input name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Observaciones" />

        <button>{editIndex !== null ? "Actualizar" : "Agregar"}</button>
      </form>

      <table className="tabla-mantenimiento">
        <thead>
          <tr>
            <th>Factura</th>
            <th>Activo</th>
            <th>Tipo</th>
            <th>Técnico</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map((m, i) => (
            <tr key={i}>
              <td>{m.factura}</td>
              <td>{m.activo}</td>
              <td>{m.tipo}</td>
              <td>{m.tecnico}</td>
              <td>
                <button onClick={() => handleEdit(i)}>✏️</button>
                <button onClick={() => handleDelete(i)}>🗑️</button>
                <button
                  onClick={() => {
                    localStorage.setItem(
                      "activoFactura",
                      JSON.stringify(activos.find(a => a.activo === m.activo))
                    );
                    localStorage.setItem(
                      "mantenimientoFactura",
                      JSON.stringify(m)
                    );
                    navigate(`/factura/${m.factura}`);
                  }}
                >
                  🧾
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
