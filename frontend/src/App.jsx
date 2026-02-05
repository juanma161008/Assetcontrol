import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import Activos from "./pages/Activos";
import Mantenimiento from "./pages/Mantenimiento";
import Factura from "./pages/factura";   
import Header from "./components/Header";
import Footer from "./components/Footer";

import "./styles/Global.css";

// Componente de ruta protegida
function ProtectedRoute({ children }) {
  // Verificar si hay usuario en localStorage
  const user = localStorage.getItem('user');
  
  if (!user) {
    // Si no hay usuario, redirigir al login
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function Layout({ children }) {
  return (
    <div className="app-layout">
      <Header />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública - Login */}
        <Route path="/" element={<Login />} />
        
        {/* Rutas protegidas */}
        <Route path="/home" element={
          <ProtectedRoute>
            <Layout><Home /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/activos" element={
          <ProtectedRoute>
            <Layout><Activos /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/mantenimiento" element={
          <ProtectedRoute>
            <Layout><Mantenimiento /></Layout>
          </ProtectedRoute>
        } />
        
        <Route path="/factura/:id" element={
          <ProtectedRoute>
            <Layout><Factura /></Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}