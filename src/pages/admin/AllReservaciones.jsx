// src/pages/AllReservaciones.jsx
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../context/AuthProvider";
import { FaCalendarAlt } from "react-icons/fa";
const API_URL = import.meta.env.VITE_API_URL;  

export default function AllReservaciones() {
  const { token } = useAuth();
  const [reservas, setReservas]     = useState([]);
  const [filtroFecha, setFiltroFecha] = useState("");
  const [pagina, setPagina]         = useState(1);
  const porPagina = 3;
  const dateInputRef = useRef(null);

  // 1) Traer todas las reservas al montar
  useEffect(() => {
    fetch(`${API_URL}/reservas`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => res.json())
      .then((data) => {
        // Mapea al shape que usa tu UI
        const mapped = data.map(r => ({
          idReserva:     r.idReserva,
          estadoReserva: r.estadoReserva,
          fechaReserva:  r.fechaReserva,
          fechaCreacion: r.fechaCreacion,
          horaEntrada:   r.horaEntrada,
          horaSalida:    r.horaSalida,
          precioTotal:   r.precioTotal,
          usuario:       r.nombreUsuario,
          lugar:         r.nombreLugar,
          numeroCancha:  r.nombreCancha,
          metodoPago:    r.metodoPago
        }));
        setReservas(mapped);
      })
      .catch((err) => console.error("Error cargando reservas:", err));
  }, [token]);

  // 2) Filtrar por fecha exacta (YYYY-MM-DD)
  const reservasFiltradas = filtroFecha
    ? reservas.filter(r => r.fechaReserva === filtroFecha)
    : reservas;

  // 3) Paginación
  const totalPaginas = Math.ceil(reservasFiltradas.length / porPagina);
  const inicio       = (pagina - 1) * porPagina;
  const actuales     = reservasFiltradas.slice(inicio, inicio + porPagina);

  // Scroll on page change
  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [pagina]);

  return (
    <div className="m-12">
      <div className="w-full bg-white rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-[#213A58]">
          Reservaciones actuales
        </h1>

        {/* Filtro por fecha */}
        <div className="flex items-center space-x-4">
          <label className="text-gray-800 font-medium">Filtrar por fecha:</label>
          <div className="relative">
            <input
              ref={dateInputRef}
              type="date"
              value={filtroFecha}
              onChange={e => { setFiltroFecha(e.target.value); setPagina(1); }}
              className="w-48 bg-white border border-gray-400 text-gray-900
                         rounded pl-3 pr-10 py-2 focus:outline-none
                         focus:ring-2 focus:ring-blue-400"
            />
            <FaCalendarAlt
              size={18}
              className="absolute right-3 top-1/2 transform -translate-y-1/2
                         text-gray-500 cursor-pointer"
              onClick={() => {
                if (dateInputRef.current?.showPicker) dateInputRef.current.showPicker();
                else dateInputRef.current.focus();
              }}
            />
          </div>
          <button
            onClick={() => setFiltroFecha("")}
            className="px-3 py-1 bg-white border border-gray-400
                       text-gray-900 rounded hover:bg-gray-100
                       focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Limpiar
          </button>
        </div>

        {/* Listado */}
        <div className="space-y-6">
          {actuales.map(r => (
            <div
              key={r.idReserva}
              className="w-full bg-white border border-black
                         rounded-xl p-6 space-y-6"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium text-gray-800">
                  Reserva #{r.idReserva}
                </span>
                <span className={`text-sm font-semibold ${
                  r.estadoReserva === "PENDIENTE"
                    ? "text-yellow-600"
                    : "text-green-600"
                }`}>
                  {r.estadoReserva === "PENDIENTE" ? "Pendiente" : "Realizada"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="uppercase font-semibold text-gray-800">
                    Fecha de reserva
                  </div>
                  <div className="text-gray-700">{r.fechaReserva}</div>
                </div>

                <div>
                  <div className="uppercase font-semibold text-gray-800">
                    Cancha
                  </div>
                  <div className="text-gray-700">{r.numeroCancha}</div>
                </div>

                <div>
                  <div className="uppercase font-semibold text-gray-800">
                    Lugar
                  </div>
                  <div className="text-gray-700">{r.lugar}</div>
                </div>

                <div>
                  <div className="uppercase font-semibold text-gray-800">
                    Fecha de creación
                  </div>
                  <div className="text-gray-700">{r.fechaCreacion}</div>
                </div>

                <div>
                  <div className="uppercase font-semibold text-gray-800">
                    Hora de entrada
                  </div>
                  <div className="text-gray-700">{r.horaEntrada}</div>
                </div>

                <div>
                  <div className="uppercase font-semibold text-gray-800">
                    Hora de salida
                  </div>
                  <div className="text-gray-700">{r.horaSalida}</div>
                </div>

                <div>
                  <div className="uppercase font-semibold text-gray-800">
                    Monto
                  </div>
                  <div className="text-gray-700">${r.precioTotal}</div>
                </div>

                <div>
                  <div className="uppercase font-semibold text-gray-800">
                    Usuario
                  </div>
                  <div className="text-gray-700">{r.usuario}</div>
                </div>

                <div>
                  <div className="uppercase font-semibold text-gray-800">
                    Método de pago
                  </div>
                  <div className="text-gray-700">{r.metodoPago}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Paginación */}
        {totalPaginas > 1 && (
          <div className="flex justify-center items-center space-x-4">
            <button
              onClick={() => setPagina(pagina - 1)}
              disabled={pagina === 1}
              className="px-4 py-2 bg-white border border-gray-400
                         text-gray-900 rounded hover:bg-gray-100
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-gray-800 font-medium">
              Página {pagina} de {totalPaginas}
            </span>
            <button
              onClick={() => setPagina(pagina + 1)}
              disabled={pagina === totalPaginas}
              className="px-4 py-2 bg-white border border-gray-400
                         text-gray-900 rounded hover:bg-gray-100
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
