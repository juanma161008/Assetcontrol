import { useEffect, useState } from "react";
import "../styles/Home.css";

export default function Home() {
  const [stats, setStats] = useState({
    total: 0,
    disponibles: 0,
    mantenimiento: 0,
    fueraServicio: 0,
    mantenimientosActivos: 0,
    mantenimientosTotal: 0,
  });

  useEffect(() => {
    const activos = JSON.parse(localStorage.getItem("activos")) || [];
    let mantenimientos = JSON.parse(localStorage.getItem("mantenimientos")) || [];

    // 🔧 Normalización registros antiguos
    mantenimientos = mantenimientos.map(m => ({
      ...m,
      estado: m.estado || "En proceso",
    }));

    const disponibles = activos.filter(a => a.estado === "Disponible").length;
    const mantenimiento = activos.filter(a => a.estado === "Mantenimiento").length;
    const fueraServicio = activos.filter(a => a.estado === "Fuera de servicio").length;

    const mantenimientosActivos = mantenimientos.filter(
      m => m.estado === "En proceso"
    ).length;

    setStats({
      total: activos.length,
      disponibles,
      mantenimiento,
      fueraServicio,
      mantenimientosActivos,
      mantenimientosTotal: mantenimientos.length,
    });
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
