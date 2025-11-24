import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

function FormCanchaPropietario() {
  const { token, role } = useAuth();
  const { id } = useParams(); // id de la cancha (si es edición)
  const navigate = useNavigate();
  const location = useLocation();

  const esEdicion = !!id;

  // leer ?lugarId=16 cuando CREO
  const queryParams = new URLSearchParams(location.search);
  const lugarIdDesdeQuery = parseInt(queryParams.get("lugarId"));

  const [lugarId, setLugarId] = useState(null);
  const [lugarIdOriginal, setLugarIdOriginal] = useState(null);

  const [creacionExitosa, setCreacionExitosa] = useState(false);
  const inputImagenRef = useRef(null);

  const [tiposCancha, setTiposCancha] = useState([]);

  const [nombre, setNombre] = useState("");
  const [tipo, setTipo] = useState("");
  const [numero, setNumero] = useState("");
  const [imagen, setImagen] = useState(null);
  const [jornadas, setJornadas] = useState([
    { dia: "Lunes", inicio: "", fin: "", precio: "" },
  ]);

  // 🔒 Solo PROPIETARIO
  useEffect(() => {
    if (role && role !== "PROPIETARIO") {
      navigate("/");
    }
  }, [role, navigate]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // 1. Cargar tipos de cancha
        const resTipos = await fetch(`${API_URL}/canchas/tipos`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        const tipos = await resTipos.json();
        setTiposCancha(tipos);

        // 2. Si estamos editando, cargar la cancha
        if (esEdicion) {
          const resCancha = await fetch(`${API_URL}/canchas/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });

          if (resCancha.ok) {
            const data = await resCancha.json();

            setLugarIdOriginal(data.lugar?.id || data.lugarId);
            setLugarId(data.lugar?.id || data.lugarId);

            setNombre(data.nombre || "");
            setNumero(data.numeroCancha || "");
            setImagen(data.imagenes?.[0] || null);

            const tipoEncontrado = tipos.find(
              (t) => t.nombre === data.tipoCancha
            );
            if (tipoEncontrado) setTipo(tipoEncontrado.id.toString());

            const jornadasFormateadas = (data.jornadas || []).map((j) => ({
              dia: convertirIdADiaSemana(j.semanaId),
              inicio: convertirAHora24(j.horaInicio),
              fin: convertirAHora24(j.horaFin),
              precio: j.precioPorHora,
            }));

            setJornadas(
              jornadasFormateadas.length
                ? jornadasFormateadas
                : [{ dia: "Lunes", inicio: "", fin: "", precio: "" }]
            );
          }
        } else {
          // CREACIÓN → tomar lugarId del query
          if (lugarIdDesdeQuery) setLugarId(lugarIdDesdeQuery);
        }
      } catch (err) {
        console.error("Error cargando datos:", err);
      }
    };

    cargarDatos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function convertirAHora12(hora24) {
    const [hora, minutos] = hora24.split(":");
    let h = parseInt(hora, 10);
    const sufijo = h >= 12 ? "p. m." : "a. m.";
    h = h % 12 || 12;
    return `${h.toString().padStart(2, "0")}:${minutos} ${sufijo}`;
  }

  function convertirAHora24(hora12) {
    if (!hora12) return "";
    const [horaMin, meridiano] = hora12.split(" ");
    let [h, m] = horaMin.split(":");
    h = parseInt(h, 10);
    if (meridiano.toLowerCase().includes("p") && h !== 12) h += 12;
    if (meridiano.toLowerCase().includes("a") && h === 12) h = 0;
    return `${h.toString().padStart(2, "0")}:${m}`;
  }

  function diaAIdSemana(dia) {
    const mapDias = {
      Lunes: 1,
      Martes: 2,
      Miércoles: 3,
      Jueves: 4,
      Viernes: 5,
      Sábado: 6,
      Domingo: 7,
    };
    return mapDias[dia] || 1;
  }

  function convertirIdADiaSemana(idSemana) {
    const dias = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ];
    return dias[idSemana - 1] || "Lunes";
  }

  const agregarJornada = () => {
    setJornadas([
      ...jornadas,
      { dia: "Lunes", inicio: "", fin: "", precio: "" },
    ]);
  };

  const eliminarJornada = (index) => {
    if (jornadas.length === 1) return;
    const nuevas = [...jornadas];
    nuevas.splice(index, 1);
    setJornadas(nuevas);
  };

  const handleJornadaChange = (index, campo, valor) => {
    const nuevas = [...jornadas];
    nuevas[index][campo] = valor;
    setJornadas(nuevas);
  };

  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    if (file) setImagen(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const lugarIdFinal = esEdicion ? lugarIdOriginal : lugarId;

    if (!lugarIdFinal || isNaN(parseInt(lugarIdFinal))) {
      console.error("❌ Error: lugarIdFinal no es válido:", lugarIdFinal);
      return;
    }

    const body = {
      nombre,
      imagenes: [typeof imagen === "string" ? imagen : imagen?.name || ""],
      numeroCancha: parseInt(numero),
      tipoCanchaId: parseInt(tipo),
      lugarId: parseInt(lugarIdFinal),
      jornadas: jornadas.map((j) => ({
        horaInicio: convertirAHora12(j.inicio),
        horaFin: convertirAHora12(j.fin),
        precioPorHora: parseFloat(j.precio),
        semanaId: diaAIdSemana(j.dia),
        estadoDisponibilidadId: 1,
      })),
    };

    try {
      const res = await fetch(
        esEdicion ? `${API_URL}/canchas/${id}` : `${API_URL}/canchas`,
        {
          method: esEdicion ? "PUT" : "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (res.ok) {
        setCreacionExitosa(true);

        if (!esEdicion) {
          setNombre("");
          setTipo("");
          setNumero("");
          setImagen(null);
          setJornadas([{ dia: "Lunes", inicio: "", fin: "", precio: "" }]);
          if (inputImagenRef.current) {
            inputImagenRef.current.value = "";
          }
        }

        setTimeout(() => {
          navigate(`/propietario/lugares/${parseInt(lugarIdFinal)}/canchas`);
        }, 1000);
      } else {
        const textoError = await res.text();
        console.error("❌ Error:", res.status, textoError);
      }
    } catch (err) {
      console.error("❌ Fallo de red:", err);
    }

    setTimeout(() => setCreacionExitosa(false), 5000);
  };

  return (
    <div className="m-12">
      <div className="w-full bg-white rounded-xl p-6 space-y-6">
        <h2 className="text-2xl font-semibold text-[#213A58]">
          {esEdicion ? "Editar cancha" : "Crear una cancha"}
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold mb-1 texto-etiqueta text-black">
              Nombre de la cancha:
            </label>
            <input
              className="input input-bordered w-full bg-transparent text-[#213A58] border-black"
              type="text"
              value={nombre}
              maxLength={70}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 texto-etiqueta text-black">
              Tipo de cancha:
            </label>
            <select
              className="select select-bordered w-full bg-transparent text-[#213A58] border-black"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              required
            >
              <option value="">Seleccione un tipo</option>
              {tiposCancha.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre.replace("_", " ").toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1 texto-etiqueta text-black">
              Número de cancha:
            </label>
            <input
              className="input input-bordered w-full bg-transparent text-[#213A58] border-black"
              type="text"
              value={numero}
              maxLength={40}
              onChange={(e) => setNumero(e.target.value)}
            />
          </div>

          {/* Texto explicativo de jornadas (igual que antes) */}
          <div className="text-black">
            <p className="font-semibold texto-etiqueta">
              ¿Cómo funciona la sección de jornadas?
            </p>
            <p>
              En esta sección puedes ingresar los horarios disponibles para
              alquilar tu cancha y el precio por hora en ese rango de tiempo.
            </p>
            <p>Por ejemplo, si ingresas una jornada de:</p>
            <li>Hora de inicio: 08:00 AM</li>
            <li>Hora de fin: 11:00 AM</li>
            <li>Precio por hora: $20</li>
            <p>
              El sistema automáticamente dividirá ese rango en bloques de una
              hora, generando 3 horarios disponibles para reservas:
            </p>
            <li>08:00 AM – 09:00 AM</li>
            <li>09:00 AM – 10:00 AM</li>
            <li>10:00 AM – 11:00 AM</li>
            <p>
              Cada bloque se mostrará en el sistema con el precio de $20 por
              hora que hayas definido.
            </p>
            <p className="font-semibold texto-etiqueta">Recuerda</p>
            <p>
              Puedes ingresar tantas jornadas como necesites para un mismo día.
              Esto te permite manejar precios diferentes según la hora (por
              ejemplo, más caro en la noche o los fines de semana).
            </p>
          </div>

          {jornadas.map((j, i) => (
            <div
              key={i}
              className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center justify-center mb-4 border-b pb-2"
            >
              <div>
                <label className="block text-xs texto-etiqueta text-black">
                  Día
                </label>
                <select
                  className="select select-bordered w-full bg-transparent text-[#213A58] border-black"
                  value={j.dia}
                  onChange={(e) =>
                    handleJornadaChange(i, "dia", e.target.value)
                  }
                >
                  <option>Lunes</option>
                  <option>Martes</option>
                  <option>Miércoles</option>
                  <option>Jueves</option>
                  <option>Viernes</option>
                  <option>Sábado</option>
                  <option>Domingo</option>
                </select>
              </div>
              <div>
                <label className="block text-xs texto-etiqueta text-black">
                  Horario de inicio
                </label>
                <input
                  type="time"
                  className="input input-bordered w-full bg-transparent text-[#213A58] border-black"
                  value={j.inicio}
                  onChange={(e) =>
                    handleJornadaChange(i, "inicio", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-xs texto-etiqueta text-black">
                  Horario de fin
                </label>
                <input
                  type="time"
                  className="input input-bordered w-full bg-transparent text-[#213A58] border-black"
                  value={j.fin}
                  onChange={(e) =>
                    handleJornadaChange(i, "fin", e.target.value)
                  }
                />
              </div>
              <div>
                <label className="block text-xs texto-etiqueta text-black">
                  Precio por hora
                </label>
                <div className="flex items-center">
                  <span className="px-2 text-sm text-gray-600">$</span>
                  <input
                    type="number"
                    min="0"
                    className="input input-bordered w-full bg-transparent text-[#213A58] border-black"
                    value={j.precio}
                    onChange={(e) =>
                      handleJornadaChange(i, "precio", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="flex grid-row-2 gap-2 ml-6">
                  {jornadas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => eliminarJornada(i)}
                      className="btn btn-circle btn-error btn-sm text-lg boton-eliminar"
                      title="Eliminar jornada"
                    >
                      −
                    </button>
                  )}
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={agregarJornada}
                    className="btn btn-circle btn-sm text-lg boton-agregar bg-green-300"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div>
            <label className="block text-sm font-semibold mt-6 mb-1 texto-etiqueta text-black">
              Foto de la cancha
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImagenChange}
              ref={inputImagenRef}
              className="file-input file-input-bordered w-full bg-transparent text-[#213A58] border-black"
            />

            {imagen && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">Previsualización:</p>
                <img
                  src={
                    typeof imagen === "string"
                      ? imagen
                      : URL.createObjectURL(imagen)
                  }
                  alt="Previsualización"
                  className="h-40 object-cover rounded border mt-2"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="btn boton-cancelar"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary boton-crear">
              {esEdicion ? "Guardar cambios" : "Crear"}
            </button>
          </div>
        </form>

        {creacionExitosa && (
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
            <span>
              {esEdicion ? "¡Cancha actualizada!" : "¡Cancha creada!"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default FormCanchaPropietario;
