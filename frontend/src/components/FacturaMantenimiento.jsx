import { useEffect, useState } from "react";
import logo from "../assets/logom5.png";
import "../styles/factura.css";

export default function FacturaMantenimiento({ activo, mantenimiento }) {
  const storageKey = `factura_${mantenimiento.factura}`;

  const [datosFactura, setDatosFactura] = useState({
    usuarioNombre: "",
    usuarioArea: "",
    usuarioCargo: "",
    autorizaNombre: "",
    autorizaCargo: "",
    autorizaFirma: "",
  });

  const [bloqueada, setBloqueada] = useState(false);

  /* =============================
     CARGAR / BLOQUEAR FACTURA
  ============================= */
  useEffect(() => {
    const guardada = localStorage.getItem(storageKey);

    if (guardada) {
      setDatosFactura(JSON.parse(guardada));
      setBloqueada(true);
    }
  }, [storageKey]);

  /* =============================
     CAMBIOS INPUT
  ============================= */
  const handleChange = (e) => {
    setDatosFactura({
      ...datosFactura,
      [e.target.name]: e.target.value,
    });
  };

  /* =============================
     GUARDAR FACTURA
  ============================= */
  const guardarFactura = () => {
    localStorage.setItem(storageKey, JSON.stringify(datosFactura));
    setBloqueada(true);
    alert("Factura guardada y bloqueada correctamente");
  };

  return (
    <div className="factura">

      {/* ================= HEADER ================= */}
      <div className="factura-header">
        <div className="empresa">
          <img src={logo} className="logo" alt="Microcinco SAS" />
          <div className="empresa-datos">
            <h2>MICROCINCO S.A.S</h2>
            <p>Medellín, Antioquia</p>
            <p>📧 contacto@microcinco.com</p>
          </div>
        </div>

        <div className="factura-info">
          <p><strong>Factura Nº:</strong> {mantenimiento.factura}</p>
          <p><strong>Fecha:</strong> {mantenimiento.fecha}</p>
        </div>
      </div>

      <h1 className="factura-titulo">ORDEN DE MANTENIMIENTO</h1>

      {/* ================= DATOS ACTIVO ================= */}
      <div className="bloque">
        <h3>Datos del activo</h3>
        <div className="grid">
          <p><strong>Activo:</strong> {activo.activo}</p>
          <p><strong>Serial:</strong> {activo.serial}</p>
          <p><strong>Equipo:</strong> {activo.equipo}</p>
          <p><strong>Marca:</strong> {activo.marca}</p>
          <p><strong>Modelo:</strong> {activo.modelo}</p>
          <p><strong>Procesador:</strong> {activo.procesador}</p>
          <p><strong>RAM:</strong> {activo.ram}</p>
          <p><strong>Disco:</strong> {activo.hdd}</p>
          <p><strong>Sistema Operativo:</strong> {activo.os}</p>
        </div>
      </div>

      {/* ================= USUARIO HABITUAL ================= */}
      <div className="bloque">
        <h3>Usuario habitual del equipo</h3>
        <div className="grid">
          <div className="campo">
            <label>Nombre</label>
            <input
              name="usuarioNombre"
              value={datosFactura.usuarioNombre}
              onChange={handleChange}
              disabled={bloqueada}
            />
          </div>

          <div className="campo">
            <label>Área</label>
            <input
              name="usuarioArea"
              value={datosFactura.usuarioArea}
              onChange={handleChange}
              disabled={bloqueada}
            />
          </div>

          <div className="campo">
            <label>Cargo</label>
            <input
              name="usuarioCargo"
              value={datosFactura.usuarioCargo}
              onChange={handleChange}
              disabled={bloqueada}
            />
          </div>
        </div>
      </div>

      {/* ================= TIPO MANTENIMIENTO ================= */}
      <div className="bloque">
        <h3>Tipo de mantenimiento</h3>
        <div className="checkboxes">
          <label>
            <input
              type="checkbox"
              checked={mantenimiento.tipo === "Preventivo"}
              readOnly
            />
            Preventivo
          </label>

          <label>
            <input
              type="checkbox"
              checked={mantenimiento.tipo === "Correctivo"}
              readOnly
            />
            Correctivo
          </label>
        </div>
      </div>

      {/* ================= TRABAJO REALIZADO ================= */}
      <div className="bloque">
        <h3>Trabajo realizado</h3>
        <textarea
          className="textarea"
          value={mantenimiento.descripcion}
          readOnly
        />
      </div>

      {/* ================= RESPONSABLE ================= */}
      <div className="bloque">
        <h3>Responsable del mantenimiento</h3>
        <div className="grid">
          <p><strong>Técnico:</strong> {mantenimiento.tecnico}</p>
          <p>Firma: ______________________________</p>
        </div>
      </div>

      {/* ================= AUTORIZACIÓN ================= */}
      <div className="bloque">
        <h3>Autorización</h3>
        <div className="grid">
          <div className="campo">
            <label>Nombre</label>
            <input
              name="autorizaNombre"
              value={datosFactura.autorizaNombre}
              onChange={handleChange}
              disabled={bloqueada}
            />
          </div>

          <div className="campo">
            <label>Cargo</label>
            <input
              name="autorizaCargo"
              value={datosFactura.autorizaCargo}
              onChange={handleChange}
              disabled={bloqueada}
            />
          </div>

          <div className="campo">
            <label>Firma</label>
            <input
              name="autorizaFirma"
              value={datosFactura.autorizaFirma}
              onChange={handleChange}
              disabled={bloqueada}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
