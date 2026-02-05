import "../styles/Login.css";
import logoAsset from "../assets/logo-assetcontrol.png";
import logoM5 from "../assets/logom5.png";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Importar configuración
import { API_BASE_URL } from "../config";

export default function Login() {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Formulario de registro
  const [registerForm, setRegisterForm] = useState({
    nombre: "",
    email: "",
    password: "",
    confirm_password: "",
    clave_registro: ""
  });
  
  // Formulario de login
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  });

  // Verificar si hay usuario en localStorage al cargar
  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate("/home");
    }
    
    // Mostrar en consola la URL que se está usando
    console.log(`🔗 API Base URL: ${API_BASE_URL}`);
  }, [navigate]);

  // ========== LOGIN ==========
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    if (!loginForm.email || !loginForm.password) {
      setError("Email y contraseña son requeridos");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess("✅ Login exitoso");
        
        // Guardar usuario en localStorage
        localStorage.setItem('user', JSON.stringify({
          nombre: data.usuario,
          email: data.email,
          rol: data.rol
        }));
        
        // Esperar un momento y redirigir
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } else {
        setError(`❌ ${data.error || "Error en el login"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(`❌ Error de conexión con el servidor. Verifica que el backend esté corriendo en ${API_BASE_URL}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ========== REGISTRO ==========
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validaciones
    if (!registerForm.nombre || !registerForm.email || !registerForm.password || 
        !registerForm.confirm_password || !registerForm.clave_registro) {
      setError("❌ Todos los campos son requeridos");
      return;
    }
    
    if (registerForm.password !== registerForm.confirm_password) {
      setError("❌ Las contraseñas no coinciden");
      return;
    }
    
    if (registerForm.password.length < 6) {
      setError("❌ La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerForm),
      });

      const data = await response.json();
      
      if (response.ok || response.status === 201) {
        setSuccess(`✅ ${data.message || "Usuario registrado exitosamente"}`);
        
        // Limpiar formulario
        setRegisterForm({
          nombre: "",
          email: "",
          password: "",
          confirm_password: "",
          clave_registro: ""
        });
        
        // Auto-rellenar el login con el email registrado
        setLoginForm(prev => ({
          ...prev,
          email: registerForm.email
        }));
        
        // Volver al formulario de login después de 2 segundos
        setTimeout(() => {
          setShowRegister(false);
          setSuccess("");
        }, 2000);
        
      } else {
        setError(`❌ ${data.error || "Error en el registro"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(`❌ Error de conexión con el servidor. Verifica que el backend esté corriendo en ${API_BASE_URL}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Limpiar mensajes cuando cambia el formulario
  useEffect(() => {
    setError("");
    setSuccess("");
  }, [showRegister]);

  return (
    <div className="login-container">
      {/* LOGOS */}
      <div className="login-logos">
        <img src={logoAsset} alt="AssetControl" className="logo-asset-login" />
        <img src={logoM5} alt="M5" className="logo-m5-login" />
      </div>

      {/* MENSAJES DE ERROR/ÉXITO */}
      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success">
          {success}
        </div>
      )}

      {/* INFO DE CONEXIÓN (Solo en desarrollo) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="connection-info">
          <small>🔗 Conectando a: {API_BASE_URL}</small>
        </div>
      )}

      {/* FORMULARIO DE LOGIN */}
      {!showRegister ? (
        <form className="login-card" onSubmit={handleLogin}>
          <h2>Iniciar Sesión</h2>

          <input 
            type="email" 
            placeholder="Email" 
            value={loginForm.email}
            onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
            required 
            disabled={isLoading}
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={loginForm.password}
            onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
            required 
            disabled={isLoading}
          />

          <button 
            type="submit" 
            className="btn-login"
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Ingresar"}
          </button>
          
          <div className="login-footer-links">
            <p>
              ¿No tienes cuenta?{" "}
              <span 
                className="register-link" 
                onClick={() => !isLoading && setShowRegister(true)}
              >
                Regístrate aquí
              </span>
            </p>
          </div>
        </form>
      ) : (
        /* FORMULARIO DE REGISTRO */
        <form className="login-card" onSubmit={handleRegister}>
          <h2>Registro de Usuario</h2>
          
          <p className="register-info">
            🔒 Se requiere clave de registro:
          </p>

          <input 
            type="text" 
            placeholder="Nombre completo" 
            value={registerForm.nombre}
            onChange={(e) => setRegisterForm({...registerForm, nombre: e.target.value})}
            required 
            disabled={isLoading}
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={registerForm.email}
            onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
            required 
            disabled={isLoading}
          />
          <input 
            type="password" 
            placeholder="Contraseña (mínimo 6 caracteres)" 
            value={registerForm.password}
            onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
            required 
            disabled={isLoading}
          />
          <input 
            type="password" 
            placeholder="Confirmar contraseña" 
            value={registerForm.confirm_password}
            onChange={(e) => setRegisterForm({...registerForm, confirm_password: e.target.value})}
            required 
            disabled={isLoading}
          />
          <input 
            type="password" 
            placeholder="Clave de registro" 
            value={registerForm.clave_registro}
            onChange={(e) => setRegisterForm({...registerForm, clave_registro: e.target.value})}
            required 
            disabled={isLoading}
          />

          <div className="register-buttons">
            <button 
              type="submit" 
              className="btn-register"
              disabled={isLoading}
            >
              {isLoading ? "Registrando..." : "Registrar"}
            </button>
            <button 
              type="button" 
              className="btn-cancel"
              onClick={() => !isLoading && setShowRegister(false)}
              disabled={isLoading}
            >
              Cancelar
            </button>
          </div>

          <div className="login-footer-links">
            <p>
              ¿Ya tienes cuenta?{" "}
              <span 
                className="login-link" 
                onClick={() => !isLoading && setShowRegister(false)}
              >
                Inicia sesión aquí
              </span>
            </p>
          </div>
        </form>
      )}

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