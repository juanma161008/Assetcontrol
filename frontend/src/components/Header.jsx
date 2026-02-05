import { Link, useNavigate } from "react-router-dom";
import "../styles/Global.css";
import { useEffect, useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Cargar usuario del localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    // Eliminar usuario del localStorage
    localStorage.removeItem('user');
    setUser(null);
    navigate("/");
  };

  return (
    <header className="header">
      <nav>
        <Link to="/home">Inicio</Link>
        <Link to="/activos">Activos</Link>
        <Link to="/mantenimiento">Mantenimiento</Link>
        
        {user && (
          <div className="user-info">
            <span>👤 {user.nombre}</span>
            <button onClick={handleLogout} className="logout-btn">
              Salir
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}