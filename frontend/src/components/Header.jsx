import { Link } from "react-router-dom";
import "../styles/Global.css";

export default function Header() {
  return (
    <header className="header">
      <nav>
        <Link to="/home">Inicio</Link>
        <Link to="/activos">Activos</Link>
        <Link to="/mantenimiento">Mantenimiento</Link>
        <Link to="/">Salir</Link>
      </nav>
    </header>
  );
}
