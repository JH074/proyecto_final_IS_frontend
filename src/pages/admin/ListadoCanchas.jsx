import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;
const diasSemana = [
  "LUNES",
  "MARTES",
  "MIÉRCOLES",
  "JUEVES",
  "VIERNES",
  "SÁBADO",
  "DOMINGO",
];

function ListadoCanchas() {
  const [pagina, setPagina] = useState(1);
  const [canchas, setCanchas] = useState([]);
  const [alertaEliminado, setAlertaEliminado] = useState(false);
  const [alertaError, setAlertaError] = useState(false);
  const [diasSeleccionados, setDiasSeleccionados] = useState({});
  const [jornadasPorCancha, setJornadasPorCancha] = useState({});
  const porPagina = 3;

  const navigate = useNavigate();
  const { id } = useParams(); // id del lugar
  const { token, role } = useAuth();

  // Cargar canchas y jornadas iniciales
  useEffect(() => {
    if (!token) return;

    fetch(`${API_URL}/lugares/${id}/canchas`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCanchas(data);
        data.forEach((cancha) => {
          const diaInicial = "LUNES";
          setDiasSeleccionados((prev) => ({ ...prev, [cancha.id]: diaInicial }));
          cargarJornadas(cancha.id, diaInicial);
        });
      })
      .catch((err) => console.error("Error cargando canchas:", err));
  }, [id, token]);

  const cargarJornadas = async (canchaId, dia) => {
    try {
      const res = await fetch(
        `${API_URL}/canchas/${canchaId}/jornadas?dia=${dia}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const data = await res.json();
        setJornadasPorCancha((prev) => ({
          ...prev,
          [canchaId]: {
            ...(prev[canchaId] || {}),
            [dia]: data,
          },
        }));
      }
    } catch (err) {
      console.error(
        `Error cargando jornadas de cancha ${canchaId} para el día ${dia}:`,
        err
      );
    }
  };

  const cambiarDia = (canchaId, dia) => {
    setDiasSeleccionados((prev) => ({ ...prev, [canchaId]: dia }));
    cargarJornadas(canchaId, dia);
  };

  const handleEliminarCancha = async (idCancha) => {
    const confirmacion = confirm(
      "¿Estás seguro de que deseas eliminar esta cancha?"
    );
    if (!confirmacion) return;

    try {
      const response = await fetch(`${API_URL}/canchas/${idCancha}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setCanchas((prev) => prev.filter((c) => c.id !== idCancha));
        setAlertaEliminado(true);
        setTimeout(() => setAlertaEliminado(false), 2000);
      } else {
        setAlertaError(true);
        setTimeout(() => setAlertaError(false), 2000);
      }
    } catch (error) {
      console.error("Error al hacer la solicitud DELETE:", error);
      setAlertaError(true);
      setTimeout(() => setAlertaError(false), 2000);
    }
  };

  const totalPaginas = Math.ceil(canchas.length / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const canchasPaginadas = canchas.slice(inicio, inicio + porPagina);

  return (
    <div className="m-12">
      <div className="w-full bg-white rounded-xl p-6 space-y-6">
        <div className="flex justify-between items-center mb-6">
          <div className="grid grid-cols-2 items-center">
            <button
              onClick={() => navigate("/admin/lugares")}
              className="p-2 rounded-full justify-self-start bg-[#213A58] text-white hover:bg-[#1a2f47]"
              aria-label="Volver"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                />
              </svg>
            </button>
            <h1 className="text-2xl font-semibold text-[#213A58]">Canchas</h1>
          </div>

          {/* Solo mostrar el botón de crear cancha si el role es PROPIETARIO */}
          {role === "PROPIETARIO" && (
            <div>
              <Link
                to={`/crear_cancha?lugarId=${id}`}
                className="flex justify-end bg-black text-white p-2 pr-4 pl-4 rounded-full text-sm hover:opacity-90"
              >
                Crear nueva cancha
              </Link>
            </div>
          )}
        </div>

        {alertaEliminado && (
          <div role="alert" className="alert alert-success">
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
            <span>Cancha eliminada correctamente.</span>
          </div>
        )}

        {canchas.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            No hay canchas registradas aún para este lugar.
          </div>
        ) : (
          <>
            {canchasPaginadas.map((cancha) => {
              const diaActual = diasSeleccionados[cancha.id] || "LUNES";
              const jornadasDelDia =
                jornadasPorCancha[cancha.id]?.[diaActual] || [];

              return (
                <div
                  key={cancha.id}
                  className="w-full bg-white border border-black rounded-xl p-6 space-y-4"
                >
                  <div className="grid grid-cols-2 justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-[#213A58]">
                        {cancha.nombre}
                      </h2>
                      <p className="text-sm">{cancha.tipoCancha}</p>
                    </div>

                    <div className="gap-6 grid grid-rows-2">
                      <div className="flex gap-2 flex-wrap">
                        {diasSemana.map((dia) => (
                          <button
                            key={dia}
                            onClick={() => cambiarDia(cancha.id, dia)}
                            className={`px-3 py-1 text-sm ${
                              diaActual === dia
                                ? "bg-[#213A58] text-white"
                                : "bg-white text-black border-gray-400"
                            }`}
                          >
                            {dia}
                          </button>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {jornadasDelDia.length > 0 ? (
                          jornadasDelDia.map((j, i) => (
                            <span
                              key={i}
                              className="px-3 py-1 border rounded-full text-sm bg-blue-100 text-black"
                            >
                              {j.horaInicio}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">
                            No hay horarios para este día.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-wrap justify-end mt-12">
                    <button
                      className="bg-gray-200 text-red-500 px-4 py-1 rounded-full text-sm"
                      onClick={() => handleEliminarCancha(cancha.id)}
                    >
                      Eliminar
                    </button>

                    {/* 🔗 Ver reservas de ESTA cancha (ruta de ADMIN) */}
                    <button
                      onClick={() =>
                        navigate(`/canchas/${cancha.id}/reservas`)
                      }
                      className="bg-black text-white px-4 py-1 rounded-full text-sm"
                    >
                      Ver reservas
                    </button>

                    {/* ❌ Botón Editar eliminado para ADMIN */}
                  </div>
                </div>
              );
            })}

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
          </>
        )}
      </div>
    </div>
  );
}

export default ListadoCanchas;
