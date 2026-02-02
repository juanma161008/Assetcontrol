import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Home from "./pages/home";
import Activos from "./pages/Activos";
import Mantenimiento from "./pages/Mantenimiento";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN SIN HEADER NI FOOTER */}
        <Route path="/" element={<Login />} />

        {/* RUTAS CON HEADER Y FOOTER */}
        <Route
  path="/home"
  element={
    <>
      <Header />
      <Home />
      <Footer />
    </>
  }
/>


        <Route
          path="/activos"
          element={
            <>
              <Header />
              <Activos />
              <Footer />
            </>
          }
        />

        <Route
          path="/mantenimiento"
          element={
            <>
              <Header />
              <Mantenimiento />
              <Footer />
            </>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}
