import "../styles/Login.css";
import logoAsset from "../assets/logo-assetcontrol.png";
import logoM5 from "../assets/logom5.png";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // login simple (temporal)
    navigate("/home");
  };

  return (
    <div className="login-container">

      {/* LOGOS */}
      <div className="login-logos">
        <img src={logoAsset} alt="AssetControl" className="logo-asset-login" />
        <img src={logoM5} alt="M5" className="logo-m5-login" />
      </div>

      {/* CARD */}
      <form className="login-card" onSubmit={handleLogin}>
        <h2>Iniciar Sesión</h2>

        <input type="text" placeholder="Usuario" required />
        <input type="password" placeholder="Contraseña" required />

        <button type="submit">Ingresar</button>
      </form>

      {/* FOOTER */}
      <footer className="login-footer">
        <span>© 2026 AssetControl</span>
        <div className="footer-redes">
          <i className="fab fa-facebook"></i>
          <i className="fab fa-instagram"></i>
          <i className="fab fa-linkedin"></i>
        </div>
      </footer>

    </div>
  );
}
