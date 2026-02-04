import { useEffect, useState } from "react";
import "../styles/Home.css";
import { api } from "../services/api";

export default function Home() {
  const [stats, setStats] = useState({
    total: 0,
    disponibles: 0,
    mantenimiento: 0,
    fueraServicio: 0,
    mantenimientosActivos: 0,
    mantenimientosTotal: 0,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");
        const [activos, mantenimientos] = await Promise.all([
          api.getActivos(),
          api.getMantenimientos(),
        ]);

        const disponibles = activos.filter(
          (a) => a.estado === "Disponible"
        ).length;
        const mantenimiento = activos.filter(
          (a) => a.estado === "Mantenimiento"
        ).length;
        const fueraServicio = activos.filter(
          (a) => a.estado === "Fuera de servicio"
        ).length;

        setStats({
          total: activos.length,
          disponibles,
          mantenimiento,
          fueraServicio,
          mantenimientosActivos: mantenimientos.length,
          mantenimientosTotal: mantenimientos.length,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="home-container">

      {/* ===== BIENVENIDA ===== */}
      <div className="home-welcome">
        <h1>👋 Bienvenido a AssetControl</h1>
        <p>
          Plataforma para la <strong>gestión de activos tecnológicos</strong> y
          el <strong>control de mantenimientos</strong>.
          Aquí podrás visualizar el estado de tus equipos,
          hacer seguimiento a los mantenimientos realizados
          y mantener la información organizada y actualizada.
        </p>
      </div>

      {/* ===== DASHBOARD ===== */}
      <h2 className="home-title">📊 Dashboard de Activos</h2>

      {loading && <p>Cargando indicadores...</p>}
      {error && <p className="error">{error}</p>}

      <div className="kpi-container">

        <div className="kpi-card">
          <h3>Total Activos</h3>
          <span>{stats.total}</span>
        </div>

        <div className="kpi-card success">
          <h3>Disponibles</h3>
          <span>{stats.disponibles}</span>
        </div>

        <div className="kpi-card warning">
          <h3>En Mantenimiento</h3>
          <span>{stats.mantenimiento}</span>
        </div>

        <div className="kpi-card danger">
          <h3>Fuera de Servicio</h3>
          <span>{stats.fueraServicio}</span>
        </div>

        <div className="kpi-card">
          <h3>Total Mantenimientos</h3>
          <span>{stats.mantenimientosTotal}</span>
        </div>

      </div>
    </div>
  );
}
