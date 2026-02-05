import { useEffect, useState } from "react";
import "../styles/Home.css";
import { API_BASE_URL } from "../config";

export default function Home() {
  const [stats, setStats] = useState({
    total: 0,
    disponibles: 0,
    mantenimiento: 0,
    fueraServicio: 0,
    mantenimientosActivos: 0,
    mantenimientosTotal: 0,
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      setIsLoading(true);
      setError("");
      
      console.log(`📊 Home usando API: ${API_BASE_URL}`);

      // Cargar activos desde API
      const activosResponse = await fetch(`${API_BASE_URL}/api/v1/activos/getAllActivos`);
      
      if (!activosResponse.ok) {
        throw new Error("Error al cargar activos del servidor");
      }
      
      const activos = await activosResponse.json();

      // Cargar mantenimientos desde API
      let mantenimientos = [];
      try {
        const mantenimientosResponse = await fetch(`${API_BASE_URL}/api/v1/mantenimientos/getAllMantenimientos`);
        if (mantenimientosResponse.ok) {
          mantenimientos = await mantenimientosResponse.json();
        }
      } catch (mantError) {
        console.warn("No se pudieron cargar mantenimientos:", mantError);
      }

      // Contar activos por estado
      const disponibles = activos.filter(a => 
        a.estado && a.estado.toLowerCase() === "disponible"
      ).length;
      
      const enMantenimiento = activos.filter(a => 
        a.estado && a.estado.toLowerCase() === "mantenimiento"
      ).length;
      
      const fueraServicio = activos.filter(a => 
        a.estado && a.estado.toLowerCase() === "fuera de servicio"
      ).length;

      // Contar mantenimientos activos
      const mantenimientosActivos = mantenimientos.filter(
        m => m.estado && m.estado.toLowerCase() === "en proceso"
      ).length;

      // Actualizar estadísticas
      setStats({
        total: activos.length,
        disponibles,
        mantenimiento: enMantenimiento,
        fueraServicio,
        mantenimientosActivos,
        mantenimientosTotal: mantenimientos.length,
      });

    } catch (error) {
      console.error("Error cargando estadísticas:", error);
      setError("Error al cargar datos del servidor");
      
      // Datos por defecto en caso de error
      setStats({
        total: 0,
        disponibles: 0,
        mantenimiento: 0,
        fueraServicio: 0,
        mantenimientosActivos: 0,
        mantenimientosTotal: 0,
      });
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="dashboard-section">
        <h2 className="home-title">📊 Dashboard de Activos</h2>

        {/* Mensaje de error */}
        {error && (
          <div className="alert alert-error">
            ⚠️ {error}
          </div>
        )}

        {/* Mensaje de carga */}
        {isLoading ? (
          <div className="loading-message">
            <div className="spinner"></div>
            <p>Cargando estadísticas...</p>
          </div>
        ) : (
          <div className="dashboard-grid">
            {/* CONTENEDOR 1: ESTADÍSTICAS PRINCIPALES */}
            <div className="stats-container">
              <div className="kpi-row">
                <div className="kpi-card">
                  <h3>Total Activos</h3>
                  <span className="kpi-number">{stats.total}</span>
                  <div className="kpi-description">
                    Equipos registrados en total
                  </div>
                </div>

                <div className="kpi-card success">
                  <h3>Disponibles</h3>
                  <span className="kpi-number">{stats.disponibles}</span>
                  <div className="kpi-description">
                    {stats.disponibles > 0 ? (
                      `${stats.disponibles} equipos listos para uso`
                    ) : (
                      "No hay equipos disponibles"
                    )}
                  </div>
                </div>

                <div className="kpi-card warning">
                  <h3>En Mantenimiento</h3>
                  <span className="kpi-number">{stats.mantenimiento}</span>
                  <div className="kpi-description">
                    {stats.mantenimiento > 0 ? (
                      `${stats.mantenimiento} equipos en reparación`
                    ) : (
                      "Ningún equipo en mantenimiento"
                    )}
                  </div>
                </div>
              </div>

              <div className="kpi-row">
                <div className="kpi-card danger">
                  <h3>Fuera de Servicio</h3>
                  <span className="kpi-number">{stats.fueraServicio}</span>
                  <div className="kpi-description">
                    {stats.fueraServicio > 0 ? (
                      `${stats.fueraServicio} equipos inoperativos`
                    ) : (
                      "Todos los equipos operativos"
                    )}
                  </div>
                </div>

                <div className="kpi-card">
                  <h3>Total Mantenimientos</h3>
                  <span className="kpi-number">{stats.mantenimientosTotal}</span>
                  <div className="kpi-description">
                    Mantenimientos registrados
                  </div>
                </div>

                <div className="kpi-card info">
                  <h3>Mantenimientos Activos</h3>
                  <span className="kpi-number">{stats.mantenimientosActivos}</span>
                  <div className="kpi-description">
                    {stats.mantenimientosActivos > 0 ? (
                      `${stats.mantenimientosActivos} en proceso`
                    ) : (
                      "Sin mantenimientos en proceso"
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* CONTENEDOR 2: RESUMEN ESTADÍSTICO */}
            {!isLoading && !error && (
              <div className="summary-container">
                <h3>📈 Resumen Estadístico</h3>
                <div className="summary-grid">
                  <div className="summary-card">
                    <div className="summary-icon">📊</div>
                    <div className="summary-content">
                      <div className="summary-label">Porcentaje Disponibles</div>
                      <div className="summary-value">
                        {stats.total > 0 ? 
                          `${((stats.disponibles / stats.total) * 100).toFixed(1)}%` : 
                          "0%"}
                      </div>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-icon">⚠️</div>
                    <div className="summary-content">
                      <div className="summary-label">Equipos con Problemas</div>
                      <div className="summary-value">
                        {stats.mantenimiento + stats.fueraServicio}
                      </div>
                    </div>
                  </div>

                  <div className="summary-card">
                    <div className="summary-icon">📋</div>
                    <div className="summary-content">
                      <div className="summary-label">Estado General</div>
                      <div className={`summary-value estado-general ${
                        stats.fueraServicio === 0 && stats.mantenimiento === 0 ? 'excelente' :
                        stats.fueraServicio < 3 ? 'bueno' : 'critico'
                      }`}>
                        {stats.fueraServicio === 0 && stats.mantenimiento === 0 ? 'Excelente' :
                         stats.fueraServicio < 3 ? 'Bueno' : 'Crítico'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}