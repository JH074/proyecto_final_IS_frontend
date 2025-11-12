
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

function RutaPublica() {
  const { token } = useAuth();

  return token ? <Navigate to="/" replace /> : <Outlet />;
}

export default RutaPublica;
