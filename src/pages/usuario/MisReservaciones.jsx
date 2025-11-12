// src/pages/MisReservaciones.jsx
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import CardReserva from "../../components/CardReserva";
const API_URL = import.meta.env.VITE_API_URL;  

function MisReservaciones() {
  const { token, user } = useAuth();
  const [pendientes, setPendientes] = useState([]);
  const [realizadas, setRealizadas] = useState([]);
  const [paginaPendientes, setPaginaPendientes] = useState(1);
  const [paginaRealizadas, setPaginaRealizadas] = useState(1);
  const [cancelSuccess, setCancelSuccess] = useState(false);
  const porPagina = 2;

  // Fetch pendientes
  useEffect(() => {
    if (!user?.id) return;
    fetch(
      `${API_URL}/reservas/usuario/${user.id}?estado=PENDIENTE`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => res.json())
      .then(data => {
        setPendientes(data);
      })
      .catch((err) => console.error("Error cargando pendientes:", err));
  }, [user, token]);

  // Fetch realizadas
  useEffect(() => {
    if (!user?.id) return;
    fetch(
      `${API_URL}/reservas/usuario/${user.id}?estado=FINALIZADA`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((res) => res.json())
      .then((data) => setRealizadas(data))
      .catch((err) => console.error("Error cargando realizadas:", err));
  }, [user, token]);

  // Paginación pendientes
  const totalPaginasPendientes = Math.ceil(pendientes.length / porPagina);
  const inicioPendientes = (paginaPendientes - 1) * porPagina;
  const pendientesPagina = pendientes.slice(
    inicioPendientes,
    inicioPendientes + porPagina
  );

  // Paginación realizadas
  const totalPaginasRealizadas = Math.ceil(realizadas.length / porPagina);
  const inicioRealizadas = (paginaRealizadas - 1) * porPagina;
  const realizadasPagina = realizadas.slice(
    inicioRealizadas,
    inicioRealizadas + porPagina
  );

  // Cancelar reserva
  const handleCancelar = async (idReserva) => {
    if (!window.confirm("¿Estás seguro de cancelar esta reserva?")) return;
    try {
      const res = await fetch(`${API_URL}/reservas/${idReserva}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error cancelando reserva");
      setPendientes((prev) => prev.filter((r) => r.idReserva !== idReserva));
      setCancelSuccess(true);
      setTimeout(() => setCancelSuccess(false), 3000);
    } catch (err) {
      //console.error("Error al cancelar:", err);
      alert("No se pudo cancelar la reserva.");
    }
  };

  return (
    <div className="m-12 bg-[#E4EFFD] min-h-screen flex justify-center">
      <div className="w-full bg-white rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-[#213A58]">Mis reservaciones</h1>

        {/* alerta de cancelación */}
        {cancelSuccess && (
          <div role="alert" className="alert alert-success mt-4 shadow-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 shrink-0 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>¡Cancelada con éxito!</span>
          </div>
        )}

        {/* Sección Pendientes */}
        {pendientes.length > 0 && (
          <>
            <p className="font-semibold text-[#213A58]">• Pendientes</p>
            {pendientesPagina.map((reserva) => (
              <CardReserva
                key={reserva.idReserva}
                reserva={reserva}
                handleCancelar={handleCancelar}
              />
            ))}
            {totalPaginasPendientes > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => setPaginaPendientes((p) => p - 1)}
                  disabled={paginaPendientes === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <span>
                  Página {paginaPendientes} de {totalPaginasPendientes}
                </span>
                <button
                  onClick={() => setPaginaPendientes((p) => p + 1)}
                  disabled={paginaPendientes === totalPaginasPendientes}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}

        {/* Sección Realizadas */}
        {realizadas.length > 0 && (
          <>
            <p className="font-semibold text-[#213A58]">• Finalizadas</p>
            {realizadasPagina.map((reserva) => (
              <CardReserva key={reserva.idReserva} reserva={reserva} />
            ))}
            {totalPaginasRealizadas > 1 && (
              <div className="flex justify-center items-center gap-4">
                <button
                  onClick={() => setPaginaRealizadas((p) => p - 1)}
                  disabled={paginaRealizadas === 1}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Anterior
                </button>
                <span>
                  Página {paginaRealizadas} de {totalPaginasRealizadas}
                </span>
                <button
                  onClick={() => setPaginaRealizadas((p) => p + 1)}
                  disabled={paginaRealizadas === totalPaginasRealizadas}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}

        {/* Si no hay reservas */}
        {pendientes.length === 0 && realizadas.length === 0 && (
          <p className="text-gray-500">No tienes reservaciones aún.</p>
        )}
      </div>
    </div>
  );
}

export default MisReservaciones;
