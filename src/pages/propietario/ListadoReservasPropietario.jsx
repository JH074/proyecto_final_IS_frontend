// src/pages/propietario/ListadoReservasPropietario.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

export default function ListadoReservasPropietario() {
  const { token, role } = useAuth();
  const { id: canchaId } = useParams();
  const navigate = useNavigate();

  const [pendientes, setPendientes] = useState([]);
  const [realizadas, setRealizadas] = useState([]);
  const [pagePendientes, setPagePendientes] = useState(1);
  const [pageRealizadas, setPageRealizadas] = useState(1);
  const perPage = 2;

  // 🔒 Solo PROPIETARIO debe ver esta pantalla
  useEffect(() => {
    if (role && role !== "PROPIETARIO") {
      navigate("/");
    }
  }, [role, navigate]);

  useEffect(() => {
    if (!canchaId || !token) return;

    fetch(`${API_URL}/canchas/${canchaId}/reservas`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar reservas");
        return res.json();
      })
      .then((data) => {
        setPendientes(
          data.filter(
            (r) => r.estadoReserva && r.estadoReserva.toUpperCase() === "PENDIENTE"
          )
        );
        setRealizadas(
          data.filter(
            (r) => !r.estadoReserva || r.estadoReserva.toUpperCase() !== "PENDIENTE"
          )
        );
      })
      .catch(console.error);
  }, [canchaId, token]);

  const totalPendientes = Math.ceil(pendientes.length / perPage);
  const totalRealizadas = Math.ceil(realizadas.length / perPage);

  const slicePendientes = pendientes.slice(
    (pagePendientes - 1) * perPage,
    (pagePendientes - 1) * perPage + perPage
  );
  const sliceRealizadas = realizadas.slice(
    (pageRealizadas - 1) * perPage,
    (pageRealizadas - 1) * perPage + perPage
  );

  return (
    <div className="m-12">
      <div className="w-full bg-white rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-[#213A58]">
            Reservas de la cancha #{canchaId}
          </h2>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#213A58] text-white px-4 py-1 rounded-full text-sm hover:bg-[#1a2f47]"
          >
            Volver
          </button>
        </div>

        {/* Pendientes */}
        <section>
          <h3 className="text-lg font-semibold text-[#213A58]">Pendientes</h3>
          {slicePendientes.length === 0 ? (
            <p className="text-sm text-gray-500">No hay reservas pendientes.</p>
          ) : (
            slicePendientes.map((r) => (
              <div
                key={r.idReserva}
                className="p-4 border border-yellow-400 rounded-xl space-y-2 mt-2"
              >
                <p>
                  <strong>Usuario:</strong> {r.nombreUsuario}
                </p>
                <p>
                  <strong>Reserva:</strong> {r.idReserva}
                </p>
                <p>
                  <strong>Fecha:</strong> {r.fechaReserva}
                </p>
                <p>
                  <strong>Horario:</strong> {r.horaEntrada} - {r.horaSalida}
                </p>
                <p>
                  <strong>Monto:</strong>{" "}
                  ${r.precioTotal != null ? r.precioTotal.toFixed(2) : "0.00"}
                </p>
                <p>
                  <strong>Estado:</strong> {r.estadoReserva}
                </p>
              </div>
            ))
          )}
          {totalPendientes > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() =>
                  setPagePendientes((p) => Math.max(p - 1, 1))
                }
                disabled={pagePendientes === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span>
                {pagePendientes} / {totalPendientes}
              </span>
              <button
                onClick={() =>
                  setPagePendientes((p) =>
                    Math.min(p + 1, totalPendientes)
                  )
                }
                disabled={pagePendientes === totalPendientes}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </section>

        {/* Realizadas */}
        <section>
          <h3 className="text-lg font-semibold text-[#213A58] mt-6">
            Realizadas
          </h3>
          {sliceRealizadas.length === 0 ? (
            <p className="text-sm text-gray-500">No hay reservas realizadas.</p>
          ) : (
            sliceRealizadas.map((r) => (
              <div
                key={r.idReserva}
                className="p-4 border border-green-500 rounded-xl space-y-2 mt-2"
              >
                <p>
                  <strong>Usuario:</strong> {r.nombreUsuario}
                </p>
                <p>
                  <strong>Reserva:</strong> {r.idReserva}
                </p>
                <p>
                  <strong>Fecha:</strong> {r.fechaReserva}
                </p>
                <p>
                  <strong>Horario:</strong> {r.horaEntrada} - {r.horaSalida}
                </p>
                <p>
                  <strong>Monto:</strong>{" "}
                  ${r.precioTotal != null ? r.precioTotal.toFixed(2) : "0.00"}
                </p>
                <p>
                  <strong>Estado:</strong> {r.estadoReserva}
                </p>
              </div>
            ))
          )}
          {totalRealizadas > 1 && (
            <div className="flex justify-center items-center gap-4 mt-4">
              <button
                onClick={() =>
                  setPageRealizadas((p) => Math.max(p - 1, 1))
                }
                disabled={pageRealizadas === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Anterior
              </button>
              <span>
                {pageRealizadas} / {totalRealizadas}
              </span>
              <button
                onClick={() =>
                  setPageRealizadas((p) =>
                    Math.min(p + 1, totalRealizadas)
                  )
                }
                disabled={pageRealizadas === totalRealizadas}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Siguiente
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
