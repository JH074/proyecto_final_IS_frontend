import { Routes, Route } from "react-router-dom";
import ScrollTop from "./routes/ScrollTop";

// Layouts
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";

// Rutas protegidas
import RutaProtegida from "./routes/RutaProtegida";
import RutaPublica from "./routes/RutaPublica";

// Usuario (CLIENTE)
import Home from "./pages/Home";
import InfoCanchitas from "./pages/InfoCanchitas";
import Registro from "./pages/Registro";
import InicioSesion from "./pages/InicioSesion";
import MisReservaciones from "./pages/usuario/MisReservaciones";
import Reservacion from "./pages/usuario/Reservacion";
import Solicitud from "./pages/usuario/Solicitud";

// Admin
import AllReservacionesAdmin from "./pages/admin/AllReservaciones";
import Usuarios from "./pages/admin/Usuarios";
import UsuarioDetalle from "./pages/admin/UsuarioDetalle";
import ListadoCanchasAdmin from "./pages/admin/ListadoCanchas";
import ListadoReservasAdmin from "./pages/admin/ListadoReservas";
import ViewLugaresAdmin from "./pages/admin/ViewLugar";

// Propietario
import AllReservacionesPropietario from "./pages/propietario/AllReservacionesPropietario";
import FormCanchaPropietario from "./pages/propietario/FormCanchaPropietario";
import ListadoCanchasPropietario from "./pages/propietario/ListadoCanchasPropietario";
import ListadoReservasPropietario from "./pages/propietario/ListadoReservasPropietario";
import NewLugarPropietario from "./pages/propietario/NewLugarPropietario";
import ViewLugaresPropietario from "./pages/propietario/ViewLugaresPropietario";

function App() {
  return (
    <>
      <ScrollTop />
      <Routes>
        {/* Layout principal */}
        <Route element={<MainLayout />}>
          {/* Pública para todos */}
          <Route path="/" element={<Home />} />

          {/* ================= CLIENTE ================= */}
          <Route element={<RutaProtegida rolRequerido="CLIENTE" />}>
            <Route path="/info_canchas" element={<InfoCanchitas />} />
            <Route path="/reservar" element={<Reservacion />} />
            <Route path="/mis_reservaciones" element={<MisReservaciones />} />
            <Route path="/solicitudes" element={<Solicitud />} />
          </Route>

          {/* ================= ADMIN ================= */}
          <Route element={<RutaProtegida rolRequerido="ADMIN" />}>
            {/* Reservaciones (todas) */}
            <Route path="/admin/reservaciones" element={<AllReservacionesAdmin />} />

            {/* Gestión de usuarios */}
            <Route path="/admin/usuarios" element={<Usuarios />} />
            <Route path="/admin/usuario/:id/reservas" element={<UsuarioDetalle />} />

            {/* Lugares (todos los lugares, sin crear/editar) */}
            <Route path="/admin/lugares" element={<ViewLugaresAdmin />} />

            {/* Canchas (solo ver) y reservas por cancha (solo ver) */}
            <Route path="/admin/lugares/:id/canchas" element={<ListadoCanchasAdmin />} />
            <Route path="/admin/canchas/:id/reservas" element={<ListadoReservasAdmin />} />
          </Route>

          {/* ================= PROPIETARIO ================= */}
          <Route element={<RutaProtegida rolRequerido="PROPIETARIO" />}>
            {/* Reservaciones de sus canchas */}
            <Route path="/propietario/reservaciones" element={<AllReservacionesPropietario />} />

            {/* Lugares propios */}
            <Route path="/propietario/lugares" element={<ViewLugaresPropietario />} />
            <Route path="/propietario/nuevo_lugar" element={<NewLugarPropietario />} />

            {/* Canchas del propietario */}
            <Route path="/propietario/lugares/:id/canchas" element={<ListadoCanchasPropietario />} />
            <Route path="/propietario/crear_cancha" element={<FormCanchaPropietario />} />
            <Route path="/propietario/editar_cancha/:id" element={<FormCanchaPropietario />} />
            <Route path="/propietario/canchas/:id/reservas" element={<ListadoReservasPropietario />} />
          </Route>
        </Route>

        {/* ================= AUTENTICACIÓN (solo si NO estás logueado) ================= */}
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
