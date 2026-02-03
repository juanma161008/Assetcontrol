import "../styles/MantenimientoPrint.css";

export default function MantenimientoPrint({ activo, mantenimiento }) {
  return (
    <div className="factura-m5">
      <header>
        <img src="/logom5.png" />
        <div>
          <h2>MANTENIMIENTO</h2>
          <p>No {mantenimiento.factura}</p>
          <p>{mantenimiento.tipo}</p>
          <p>{mantenimiento.fecha}</p>
        </div>
      </header>

      <table className="tabla-dispositivo">
        <thead>
          <tr>
            <th>MTO FÍSICO</th>
            <th>MTO LÓGICO</th>
            <th>DISPOSITIVO</th>
            <th>MARCA</th>
            <th>SERIAL</th>
          </tr>
        </thead>
        <tbody>
          {["TECLADO","MOUSE","MONITOR","CPU","PORTÁTIL"].map(d => (
            <tr key={d}>
              <td>☐</td>
              <td>☐</td>
              <td>{d}</td>
              <td>{activo.marca}</td>
              <td>{activo.serial}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="observaciones">
        <strong>Observaciones:</strong>
        <p>{mantenimiento.descripcion}</p>
      </div>

      <div className="firmas">
        <div>_________________<br/>Técnico</div>
        <div>_________________<br/>Responsable</div>
      </div>
    </div>
  );
}
