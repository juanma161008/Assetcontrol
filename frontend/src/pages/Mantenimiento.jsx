import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Mantenimiento.css";
import { api } from "../services/api";

export default function Mantenimiento() {
  const navigate = useNavigate();

  const [mantenimientos, setMantenimientos] = useState([]);
  const [activos, setActivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [buscar, setBuscar] = useState("");
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    fecha: "",
    activo: "",
    tipo: "",
    tecnico: "",
    descripcion: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const [mantenimientosData, activosData] = await Promise.all([
          api.getMantenimientos(),
          api.getActivos(),
        ]);
        setMantenimientos(mantenimientosData);
        setActivos(activosData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      if (editId !== null) {
        await api.updateMantenimiento(editId, form);
        setMantenimientos((prev) =>
          prev.map((item) =>
            item.id === editId ? { ...item, ...form } : item
          )
        );
        setEditId(null);
      } else {
        await api.createMantenimiento(form);
        const updated = await api.getMantenimientos();
        setMantenimientos(updated);
      }
    } catch (err) {
      setError(err.message);
    }

    setForm({
      fecha: "",
      activo: "",
      tipo: "",
      tecnico: "",
      descripcion: "",
    });
  };

  const handleEdit = (mantenimiento) => {
    setForm({
      fecha: mantenimiento.fecha || "",
      activo: mantenimiento.activo || "",
      tipo: mantenimiento.tipo || "",
      tecnico: mantenimiento.tecnico || "",
      descripcion: mantenimiento.descripcion || "",
    });
    setEditId(mantenimiento.id);
  };

  const handleDelete = async (mantenimiento) => {
    if (window.confirm("¿Eliminar mantenimiento?")) {
      try {
        setError("");
        await api.deleteMantenimiento(mantenimiento.id);
        setMantenimientos((prev) =>
          prev.filter((item) => item.id !== mantenimiento.id)
        );
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const filtrados = mantenimientos.filter(
    (m) =>
      String(m.activo ?? "")
        .toLowerCase()
        .includes(buscar.toLowerCase()) ||
      String(m.tecnico ?? "")
        .toLowerCase()
        .includes(buscar.toLowerCase()) ||
      String(m.factura).includes(buscar)
  );

  return (
    <div className="container-mantenimiento">
      <h1>🛠️ Mantenimientos</h1>

      {loading && <p>Cargando mantenimientos...</p>}
      {error && <p className="error">{error}</p>}

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

        <button>{editId !== null ? "Actualizar" : "Agregar"}</button>
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
            <tr key={m.id ?? i}>
              <td>{m.factura}</td>
              <td>{m.activo}</td>
              <td>{m.tipo}</td>
              <td>{m.tecnico}</td>
              <td>
                <button onClick={() => handleEdit(m)}>✏️</button>
                <button onClick={() => handleDelete(m)}>🗑️</button>
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
