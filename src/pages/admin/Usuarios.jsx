// src/pages/admin/Usuarios.jsx
import { useState, useEffect } from "react";
import CardUsuario from "../../components/CardUsuarios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;  

function Usuarios() {
  const navigate = useNavigate();
  const { token, role } = useAuth();   // ← ahora también traemos el rol

  const [usuarios, setUsuarios] = useState([]);
  const [pagina, setPagina] = useState(1);
  const porPagina = 4;

  useEffect(() => {
    if (role && role !== "ADMIN") {
      navigate("/");   
    }
  }, [role, navigate]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        if (!token || role !== "ADMIN") return;

        const response = await fetch(`${API_URL}/usuarios`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error al obtener los usuarios");
        }

        const data = await response.json();
        const soloClientes = data.filter((usuario) => usuario.rol === "CLIENTE");

        setUsuarios(soloClientes);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUsuarios();
  }, [token, role]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pagina]);

  const totalPaginas = Math.ceil(usuarios.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const usuariosPaginados = usuarios.slice(inicio, inicio + porPagina);

  const handleVerReservas = (usuarioId) => {
    navigate(`/usuarios/${usuarioId}/reservas`);
  };

  const handleEliminar = async (usuarioId) => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas eliminar este usuario?"
    );
    if (!confirmar) return;

    try {
      const response = await fetch(`${API_URL}/usuarios/${usuarioId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.mensaje);
        setUsuarios((prev) => prev.filter((u) => u.idUsuario !== usuarioId));
      } else {
        alert("No se pudo eliminar el usuario.");
        console.error(data);
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      alert("Ocurrió un error al eliminar el usuario.");
    }
  };

  return (
    <div className="m-12">
      <div className="w-full bg-white rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-[#213A58]">Usuarios</h1>

        <div className="space-y-4">
          {usuariosPaginados.map((usuario, index) => (
            <CardUsuario
              key={usuario.idUsuario}
              usuario={{
                id: usuario.idUsuario,
                nombre: `${usuario.nombre} ${usuario.apellido}`,
                correo: usuario.correo,
              }}
              index={inicio + index}
              onVerReservas={handleVerReservas}
              onEliminar={handleEliminar}
            />
          ))}

          {usuarios.length === 0 && (
            <p className="text-gray-600">No hay usuarios disponibles.</p>
          )}
        </div>

        {totalPaginas > 1 && (
          <div className="flex justify-center items-center space-x-4 pt-4">
            <button
              onClick={() => setPagina(pagina - 1)}
              disabled={pagina === 1}
              className="px-4 py-2 bg-white border border-gray-400 text-gray-900 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-gray-800 font-medium">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              onClick={() => setPagina(pagina + 1)}
              disabled={pagina === totalPaginas}
              className="px-4 py-2 bg-white border border-gray-400 text-gray-900 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Usuarios;
