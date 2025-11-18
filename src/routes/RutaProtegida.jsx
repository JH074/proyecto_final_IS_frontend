import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function RutaProtegida({ rolRequerido, allowedRoles }) {
  const { token, role } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const rolesPermitidos =
    allowedRoles && allowedRoles.length > 0
      ? allowedRoles
      : rolRequerido
      ? [rolRequerido]
      : null;


  if (rolesPermitidos && !rolesPermitidos.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RutaProtegida;

