import "../styles/Login.css";
import assetLogo from "../assets/logo-assetcontrol.png";
import m5Logo from "../assets/logom5.png";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // SIN BACK → navegación directa
    navigate("/home");
  };

  return (
    <div className="login-container">

      <div className="login-logos">
        <img src={m5Logo} alt="Micro5" className="logo-m5-login" />
        <img src={assetLogo} alt="AssetControl" className="logo-asset-login" />
      </div>

      <div className="login-card">
        <h2>INICIO DE SESIÓN</h2>
        <input type="text" placeholder="Usuario" />
        <input type="password" placeholder="Password" />
        <button onClick={handleLogin}>Iniciar Sesión</button>
      </div>

    </div>
  );
}

