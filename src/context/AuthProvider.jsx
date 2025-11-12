import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL;  

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole]   = useState(localStorage.getItem("role"));
  const [user, setUser]   = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, contrasena: password })
      });

      const text = await res.text();

      if (!res.ok) {
        let errorMsg = "Credenciales incorrectas";
        try {
          const errObj = JSON.parse(text);
          if (errObj.mensaje) errorMsg = errObj.mensaje;
        } catch {}
        throw new Error(errorMsg);
      }

      const data = JSON.parse(text);
      // data = { token, idUsuario, nombre, apellido, correo, role }
      const usuario = {
        id: data.idUsuario,
        nombre: `${data.nombre} ${data.apellido}`,
        correo: data.correo
      };

      // Guarda en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user", JSON.stringify(usuario));

      // Actualiza estado
      setToken(data.token);
      setRole(data.role);
      setUser(usuario);
    } catch (err) {
      console.error("Error en login:", err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
