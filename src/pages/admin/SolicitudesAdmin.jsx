import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

function SolicitudesAdmin() {
  const { token, role } = useAuth();
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [filtro, setFiltro] = useState("TODAS");
  const [pagina, setPagina] = useState(1);
  const porPagina = 4;

  // Redirigir si NO es admin
  useEffect(() => {
    if (role && role !== "ADMIN") {
      navigate("/");
    }
  }, [role, navigate]);

  // Cargar solicitudes
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token || role !== "ADMIN") return;

        const res = await fetch(`${API_URL}/solicitudes`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Error al cargar solicitudes");
        }

        const data = await res.json();
        setSolicitudes(data);
      } catch (err) {
        console.error("Error cargando solicitudes:", err);
      }
    };

    fetchData();
  }, [token, role]);

  // Filtro por estado
  const solicitudesFiltradas = solicitudes.filter((s) =>
    filtro === "TODAS" ? true : s.estado === filtro
  );

  // Paginación
  const totalPaginas = Math.ceil(solicitudesFiltradas.length / porPagina) || 1;
  const inicio = (pagina - 1) * porPagina;
  const solicitudesPaginadas = solicitudesFiltradas.slice(
    inicio,
    inicio + porPagina
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pagina]);

  const handleVerSolicitud = (idSolicitud) => {
    navigate(`/admin/solicitudes/${idSolicitud}`);
  };

  // ✅ Card de ejemplo fija (puedes borrarla luego si quieres)
  const ejemploSolicitud = {
    idSolicitud: 999,
    nombreCompleto: "Ejemplo Propietario",
    correo: "ejemplo@correo.com",
    telefono: "7777-7777",
    zonaId: 3,
    estado: "PENDIENTE",
  };

  return (
    <div className="m-12">
      <div className="w-full bg-white rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-[#213A58]">
          Solicitudes de Propietario
        </h1>

        {/* Filtros */}
        <div className="flex flex-wrap gap-3 mb-4">
          <button
            onClick={() => {
              setFiltro("TODAS");
              setPagina(1);
            }}
            className={`px-4 py-2 rounded text-sm ${
              filtro === "TODAS"
                ? "bg-gray-800 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-800"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => {
              setFiltro("PENDIENTE");
              setPagina(1);
            }}
            className={`px-4 py-2 rounded text-sm ${
              filtro === "PENDIENTE"
                ? "bg-yellow-500 text-white"
                : "bg-yellow-100 hover:bg-yellow-200 text-yellow-800"
            }`}
          >
            Pendientes
          </button>
          <button
            onClick={() => {
              setFiltro("APROBADA");
              setPagina(1);
            }}
            className={`px-4 py-2 rounded text-sm ${
              filtro === "APROBADA"
                ? "bg-green-600 text-white"
                : "bg-green-100 hover:bg-green-200 text-green-800"
            }`}
          >
            Aprobadas
          </button>
          <button
            onClick={() => {
              setFiltro("RECHAZADA");
              setPagina(1);
            }}
            className={`px-4 py-2 rounded text-sm ${
              filtro === "RECHAZADA"
                ? "bg-red-600 text-white"
                : "bg-red-100 hover:bg-red-200 text-red-800"
            }`}
          >
            Rechazadas
          </button>
        </div>

        <div className="space-y-4">
          {/* 🔹 Card de ejemplo (visual) */}
          <div className="w-full bg-white border border-dashed border-gray-400 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-2">
              Ejemplo de tarjeta (solo de muestra):
            </p>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="font-semibold text-[#213A58]">
                  {ejemploSolicitud.nombreCompleto}
                </h2>
                <p className="text-sm text-gray-700">
                  Correo: {ejemploSolicitud.correo}
                </p>
                <p className="text-sm text-gray-700">
                  Teléfono: {ejemploSolicitud.telefono}
                </p>
                <p className="text-sm text-gray-700">
                  Zona ID: {ejemploSolicitud.zonaId}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                {ejemploSolicitud.estado}
              </span>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-1 bg-black text-white rounded-full text-sm hover:opacity-90"
                onClick={() => navigate("/admin/solicitudes/ejemplo")} 
                >
                Ver
                </button>

            </div>
          </div>
          
          {/* 🔹 Card de ejemplo (visual) */}
          <div className="w-full bg-white border border-dashed border-gray-400 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-2">
              Ejemplo de tarjeta (solo de muestra):
            </p>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h2 className="font-semibold text-[#213A58]">
                  {ejemploSolicitud.nombreCompleto}
                </h2>
                <p className="text-sm text-gray-700">
                  Correo: {ejemploSolicitud.correo}
                </p>
                <p className="text-sm text-gray-700">
                  Teléfono: {ejemploSolicitud.telefono}
                </p>
                <p className="text-sm text-gray-700">
                  Zona ID: {ejemploSolicitud.zonaId}
                </p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                {ejemploSolicitud.estado}
              </span>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="px-4 py-1 bg-black text-white rounded-full text-sm opacity-60 cursor-not-allowed"
              >
                Ver
              </button>
            </div>
          </div>

          {/* 🔹 Cards reales desde el backend */}
          {solicitudesPaginadas.map((s) => (
            <div
              key={s.idSolicitud}
              className="w-full bg-white border border-black rounded-xl p-6 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-semibold text-[#213A58]">
                    {s.nombreCompleto}
                  </h2>
                  <p className="text-sm text-gray-700">Correo: {s.correo}</p>
                  <p className="text-sm text-gray-700">
                    Teléfono: {s.telefono}
                  </p>
                  <p className="text-sm text-gray-700">
                    Zona ID: {s.zonaId}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs ${
                    s.estado === "PENDIENTE"
                      ? "bg-yellow-100 text-yellow-700"
                      : s.estado === "APROBADA"
                      ? "bg-green-100 text-green-700"
                      : s.estado === "RECHAZADA"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {s.estado}
                </span>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => handleVerSolicitud(s.idSolicitud)}
                  className="px-4 py-1 bg-black text-white rounded-full text-sm hover:opacity-90"
                >
                  Ver
                </button>
              </div>
            </div>
          ))}

          {solicitudesFiltradas.length === 0 && (
            <p className="text-gray-600 text-center pt-4">
              No hay solicitudes con ese estado.
            </p>
          )}
        </div>

        {/* Paginación */}
        {solicitudesFiltradas.length > 0 && totalPaginas > 1 && (
          <div className="flex justify-center items-center space-x-4 pt-4">
            <button
              onClick={() => setPagina((p) => Math.max(1, p - 1))}
              disabled={pagina === 1}
              className="px-4 py-2 bg-white border border-gray-400 text-gray-900 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-gray-800 font-medium">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
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

export default SolicitudesAdmin;
