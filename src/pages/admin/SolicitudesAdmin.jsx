import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

function SolicitudesAdmin() {
  const { token } = useAuth();
  const [solicitudes, setSolicitudes] = useState([]);
  const [filtro, setFiltro] = useState("TODAS");

  // Cargar solicitudes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_URL}/solicitudes`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        const data = await res.json();
        setSolicitudes(data);
      } catch (err) {
        console.error("Error cargando solicitudes:", err);
      }
    };

    fetchData();
  }, []);

  // Filtro por estado
  const filtradas = solicitudes.filter(s =>
    filtro === "TODAS" ? true : s.estado === filtro
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Lista de Solicitudes</h1>

      {/* Filtros */}
      <div className="flex gap-3 mb-6">
        <button onClick={() => setFiltro("TODAS")} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
          Todas
        </button>
        <button onClick={() => setFiltro("PENDIENTE")} className="px-4 py-2 rounded bg-yellow-200 hover:bg-yellow-300">
          Pendientes
        </button>
        <button onClick={() => setFiltro("APROBADA")} className="px-4 py-2 rounded bg-green-200 hover:bg-green-300">
          Aprobadas
        </button>
        <button onClick={() => setFiltro("RECHAZADA")} className="px-4 py-2 rounded bg-red-200 hover:bg-red-300">
          Rechazadas
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow rounded-lg p-4 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-3">Nombre Completo</th>
              <th className="py-3">Correo</th>
              <th className="py-3">Fecha Solicitud</th>
              <th className="py-3">Estado</th>
              <th className="py-3">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtradas.map(s => (
              <tr key={s.idSolicitud} className="border-b hover:bg-gray-50">
                <td className="py-3">{s.nombreCompleto}</td>
                <td>{s.correoUsuario}</td>
                <td>{s.fechaSolicitud}</td>
                <td>
                  <span className={
                    s.estado === "PENDIENTE" ? "bg-yellow-200 px-2 py-1 rounded" :
                    s.estado === "APROBADA" ? "bg-green-200 px-2 py-1 rounded" :
                    "bg-red-200 px-2 py-1 rounded"
                  }>
                    {s.estado}
                  </span>
                </td>
                <td>
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => alert("Aquí irá el modal de detalles 😎")}
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))}

            {filtradas.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No hay solicitudes con ese estado.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default SolicitudesAdmin;
