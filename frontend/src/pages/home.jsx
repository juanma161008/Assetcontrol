import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";
import "../styles/Home.css";

export default function Home() {
  const [activos, setActivos] = useState([]);
  const [mantenimientos, setMantenimientos] = useState([]);
  const sedes = ["AUTOPISTA", "NIQUIA"];

  useEffect(() => {
    setActivos(JSON.parse(localStorage.getItem("activos")) || []);
    setMantenimientos(JSON.parse(localStorage.getItem("mantenimientos")) || []);
  }, []);

  // Próximos 3 mantenimientos por activo
  const calcularProximosMantenimientos = (sede) => {
    const proximos = [];
    const activosFiltrados = activos.filter(a => a.sede === sede);

    activosFiltrados.forEach((activo) => {
      const historial = mantenimientos
        .filter(m => m.activo === activo.activo)
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

      for (let i = 0; i < 3; i++) {
        if (historial.length > 0) {
          const ultimaFecha = new Date(historial[0].fecha);
          const proximo = new Date(ultimaFecha);
          proximo.setMonth(proximo.getMonth() + 6 * (i + 1));
          proximos.push({ activo: activo.activo, fecha: proximo.toISOString().split("T")[0] });
        }
      }
    });
    return proximos;
  };

  // Datos para gráficas
  const dataActivosTipo = () => {
    const tipos = {};
    activos.forEach(a => { tipos[a.tipo] = (tipos[a.tipo] || 0) + 1; });
    return Object.keys(tipos).map(key => ({ tipo: key, cantidad: tipos[key] }));
  };

  const dataMantenimientosMes = () => {
    const meses = Array.from({ length: 12 }, (_, i) => ({ mes: i + 1, cantidad: 0 }));
    mantenimientos.forEach(m => {
      const mes = new Date(m.fecha).getMonth();
      meses[mes].cantidad += 1;
    });
    return meses;
  };

  return (
    <div className="home-container">
      <div className="banner-seguridad">
        <h2>⚠️ Bienvenido a ASSETCONTROL</h2>
        <p>Plataforma interna. Información confidencial. Cierre sesión al terminar.</p>
      </div>

      {/* Contenedor horizontal de sedes */}
      <div className="sedes-scroll">
        {sedes.map(sede => {
          const activosSede = activos.filter(a => a.sede === sede);
          const mantenimientosSede = mantenimientos.filter(m =>
            activosSede.some(a => a.activo === m.activo)
          );
          const proximosSede = calcularProximosMantenimientos(sede);

          return (
            <div key={sede} className="sede-card">
              <h2>🏢 {sede}</h2>

              <div className="cards-horizontal">
                <div className="card card-hover" style={{ background: "#1e3a8a", color: "#fff" }}>
                  <h3>📦 Activos</h3>
                  <p>{activosSede.length}</p>
                </div>
                <div className="card card-hover" style={{ background: "#256d85", color: "#fff" }}>
                  <h3>🛠️ Mantenimientos</h3>
                  <p>{mantenimientosSede.length}</p>
                </div>
                <div className="card card-hover" style={{ background: "#1f4f6b", color: "#fff" }}>
                  <h3>🗓️ Próximos Mant.</h3>
                  <p>{proximosSede.length}</p>
                </div>
              </div>

              <div className="proximos-mantenimientos">
                <h4>Próximos 3 Mantenimientos</h4>
                <ul>
                  {proximosSede.map((m, i) => {
                    const vencido = new Date(m.fecha) < new Date();
                    return (
                      <li key={i} style={{ color: vencido ? "red" : "#000", fontWeight: vencido ? "bold" : "normal" }}>
                        <strong>{m.fecha}</strong> - {m.activo} {vencido && "⚠️ VENCIDO"}
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Gráficas */}
              <div className="graficas-horizontal">
                <div className="grafica-activos">
                  <h4>Activos por Tipo</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={dataActivosTipo()}>
                      <XAxis dataKey="tipo" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="cantidad" fill="#1e3a8a" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="grafica-mantenimientos">
                  <h4>Mantenimientos por Mes</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={dataMantenimientosMes()}>
                      <CartesianGrid stroke="#ccc" />
                      <XAxis dataKey="mes" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="cantidad" stroke="#256d85" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="home-buttons">
        <a href="/activos" className="btn">Ver Activos</a>
        <a href="/mantenimiento" className="btn">Ver Mantenimientos</a>
      </div>
    </div>
  );
}
