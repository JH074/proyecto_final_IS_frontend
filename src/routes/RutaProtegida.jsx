import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function RutaProtegida({ rolRequerido }) {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (rolRequerido && role !== rolRequerido) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RutaProtegida;
