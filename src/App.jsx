import { Routes, Route } from "react-router-dom";
import ScrollTop from "./routes/ScrollTop";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Rutas protegidas
import RutaProtegida from "./routes/RutaProtegida";
import RutaPublica from "./routes/RutaPublica";

// Usuario
import Home from "./pages/Home";
import InfoCanchitas from "./pages/InfoCanchitas";
import Registro from "./pages/Registro";
import InicioSesion from "./pages/InicioSesion";
import MisReservaciones from "./pages/usuario/MisReservaciones";
import Reservacion from "./pages/usuario/Reservacion";

// Admin
import AllReservaciones from "./pages/admin/AllReservaciones";
import Usuarios from "./pages/admin/Usuarios";
import UsuarioDetalle from "./pages/admin/UsuarioDetalle";
import ListadoCanchas from "./pages/admin/ListadoCanchas";
import ListadoReservas from "./pages/admin/ListadoReservas";
import NewLugar from "./pages/admin/NewLugar";
import ViewLugar from "./pages/admin/ViewLugar";
import FormCancha from "./pages/admin/FormCancha";

function App() {
  return (
    <>
      <ScrollTop />
      <Routes>

        <Route element={<MainLayout />}>
          {/* Pública para todos */}
          <Route path="/" element={<Home />} />

          {/* Rutas protegidas para USUARIO */}
          <Route element={<RutaProtegida rolRequerido="CLIENTE" />}>
            <Route path="/info_canchas" element={<InfoCanchitas />} />
            <Route path="/reservar" element={<Reservacion />} />
            <Route path="/mis_reservaciones" element={<MisReservaciones />} />
          </Route>

          {/* Rutas protegidas para ADMIN */}
          <Route element={<RutaProtegida rolRequerido="ADMIN" />}>
            <Route path="/reservaciones" element={<AllReservaciones />} />
            
            <Route path="/usuarios" element={<Usuarios />} />
            <Route path="/usuario/:id/reservas" element={<UsuarioDetalle />} />
            
            <Route path="/canchas/:id/reservas" element={<ListadoReservas />} />
            <Route path="/crear_cancha" element={<FormCancha />} />
            <Route path="/editar_cancha/:id" element={<FormCancha />} />

            <Route path="/lugares/:id/canchas" element={<ListadoCanchas />} />
            <Route path="/nuevo_lugar" element={<NewLugar />} />
            <Route path="/lugares" element={<ViewLugar />} />
          </Route>
        </Route>

        {/* Rutas públicas solo si no estás logueado */}
        <Route element={<RutaPublica />}>
          <Route element={<AuthLayout />}>
            <Route path="/registro" element={<Registro />} />
            <Route path="/login" element={<InicioSesion />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
