import { useEffect, useState } from "react";
import FacturaMantenimiento from "../components/FacturaMantenimiento";
import generarFacturaPDF from "../components/FacturaPDF";
import "../styles/Factura.css";

export default function Factura() {
  const [activo, setActivo] = useState(null);
  const [mantenimiento, setMantenimiento] = useState(null);
  const [datosFactura, setDatosFactura] = useState({});
  const [bloqueada, setBloqueada] = useState(false);

  useEffect(() => {
    const act = JSON.parse(localStorage.getItem("activoFactura"));
    const mant = JSON.parse(localStorage.getItem("mantenimientoFactura"));

    if (!act || !mant) return;

    setActivo(act);
    setMantenimiento(mant);

    const guardada = JSON.parse(
      localStorage.getItem(`factura_${mant.factura}`)
    );

    if (guardada) {
      setDatosFactura(guardada);
      setBloqueada(true);
    }
  }, []);

  const guardarFactura = () => {
    localStorage.setItem(
      `factura_${mantenimiento.factura}`,
      JSON.stringify(datosFactura)
    );
    setBloqueada(true);
    alert("Factura guardada y bloqueada ✔️");
  };

  if (!activo || !mantenimiento) {
    return <p style={{ padding: 20 }}>No hay datos para mostrar</p>;
  }

  return (
    <div className="factura-page">

      <div className="factura-actions">
        {!bloqueada && (
          <button onClick={guardarFactura}>
            💾 Guardar factura
          </button>
        )}

        <button onClick={() => window.print()}>
          🖨️ Imprimir
        </button>

        <button
          onClick={() =>
            generarFacturaPDF({
              activo,
              mantenimiento,
              datosFactura
            })
          }
        >
          📄 Descargar PDF
        </button>
      </div>

      <div id="factura-print">
        <FacturaMantenimiento
          activo={activo}
          mantenimiento={mantenimiento}
          datosFactura={datosFactura}
          setDatosFactura={setDatosFactura}
          bloqueada={bloqueada}
        />
      </div>
    </div>
  );
}
