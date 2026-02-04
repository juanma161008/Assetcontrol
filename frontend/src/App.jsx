import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import Activos from "./pages/Activos";
import Mantenimiento from "./pages/Mantenimiento";
import Factura from "./pages/factura";   
import Header from "./components/Header";
import Footer from "./components/Footer";

import "./styles/Global.css";

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
        <Route path="/" element={<Login />} />

        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/activos" element={<Layout><Activos /></Layout>} />
        <Route path="/mantenimiento" element={<Layout><Mantenimiento /></Layout>} />

        {/* 👇 ESTA ERA LA QUE FALTABA */}
        <Route path="/factura/:id" element={<Layout><Factura /></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}
