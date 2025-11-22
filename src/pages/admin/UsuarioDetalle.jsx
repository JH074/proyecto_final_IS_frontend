// src/pages/admin/UsuarioDetalle.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import CardUsuarioDetalle from "../../components//CardUsuarioDetalle";

const API_URL = import.meta.env.VITE_API_URL;  

export default function UsuarioDetalle() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token, role } = useAuth();

  const [reservas, setReservas] = useState([]);

  // 🔒 Solo ADMIN debe ver esta pantalla
  useEffect(() => {
    if (role && role !== "ADMIN") {
      navigate("/");   // si por alguna razón entra otro rol, lo sacamos
    }
  }, [role, navigate]);

  useEffect(() => {
    if (!token || role !== "ADMIN") return; // seguridad extra

    fetch(`${API_URL}/reservas/usuario/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (!res.ok) throw new Error("Error al cargar reservas");
        return res.json();
      })
      .then(data => setReservas(data))
      .catch(err => console.error("Error:", err));
  }, [id, token, role]);

  // Agrupamos por estado (defensivo por si viene null)
  const pendientes = reservas.filter(
    r => (r.estadoReserva || "").toUpperCase() === "PENDIENTE"
  );
  const finalizadas = reservas.filter(
    r => (r.estadoReserva || "").toUpperCase() !== "PENDIENTE"
  );

  return (
    <div className="m-12">
      <div className="w-full bg-white rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-[#213A58]">Usuario #{id}</h1>

        <div className="grid grid-cols-2 text-sm mb-4">
          <div>
            <div className="font-semibold text-gray-800">ID</div>
            <div className="text-gray-600">{id}</div>
          </div>
          <div>
            <div className="font-semibold text-gray-800">Total reservas</div>
            <div className="text-gray-600">{reservas.length}</div>
          </div>
        </div>

        {/* Pendientes */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-[#213A58]">Pendientes</h2>
          {pendientes.length === 0 ? (
            <p className="text-sm text-gray-500">No hay reservas pendientes.</p>
          ) : (
            pendientes.map((r) => (
              <CardUsuarioDetalle
                key={r.idReserva}
                reserva={r}
              />
            ))
          )}
        </section>

        {/* Finalizadas */}
        <section className="space-y-2 mt-6">
          <h2 className="text-lg font-semibold text-[#213A58]">Finalizadas</h2>
          {finalizadas.length === 0 ? (
            <p className="text-sm text-gray-500">No hay reservas finalizadas.</p>
          ) : (
            finalizadas.map((r) => (
              <CardUsuarioDetalle
                key={r.idReserva}
                reserva={r}
              />
            ))
          )}
        </section>

        <div className="flex justify-center mt-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-black text-white px-6 py-2 rounded-full hover:opacity-90"
          >
            Volver
          </button>
        </div>
      </div>
    </div>
  );
}
