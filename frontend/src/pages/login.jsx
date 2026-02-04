import "../styles/Login.css";
import logoAsset from "../assets/logo-assetcontrol.png";
import logoM5 from "../assets/logom5.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ usuario: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.login(form);
      localStorage.setItem("usuario", JSON.stringify(response));
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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

        <input
          type="text"
          name="usuario"
          placeholder="Usuario"
          value={form.usuario}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />

        {error && <p className="login-error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Validando..." : "Ingresar"}
        </button>
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
