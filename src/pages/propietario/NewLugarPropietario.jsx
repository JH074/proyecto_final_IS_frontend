// src/pages/propietario/NewLugarPropietario.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

export default function NewLugarPropietario() {
  const { token, role } = useAuth();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [codigo, setCodigo] = useState("");
  const [direccion, setDireccion] = useState("");
  const [zona, setZona] = useState(null);
  const [zonasDisponibles, setZonasDisponibles] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorZona, setErrorZona] = useState(false);

  const nameRef = useRef(null);
  const zonaRef = useRef(null);

  // 🔒 Solo PROPIETARIO debe poder usar esta pantalla
  useEffect(() => {
    if (role && role !== "PROPIETARIO") {
      navigate("/");
    }
  }, [role, navigate]);

  // Cargar zonas (endpoint es público, pero no molesta mandar el token)
  useEffect(() => {
    const fetchZonas = async () => {
      try {
        const response = await fetch(`${API_URL}/lugares/zonas`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        });
        const data = await response.json();
        setZonasDisponibles(data);
      } catch (error) {
        console.error("Error al cargar zonas:", error);
      }
    };
    fetchZonas();
  }, [token]);

  // Ocultar mensaje de éxito
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Cierra dropdown al clicar fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (zonaRef.current && !zonaRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!zona) {
      setErrorZona(true);
      return;
    }

    const nuevoLugar = {
      nombre,
      direccion,
      codigo: parseInt(codigo),
      zona: zona.id,
    };

    try {
      const response = await fetch(`${API_URL}/lugares`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // solo propietario tiene permiso en backend
        },
        body: JSON.stringify(nuevoLugar),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/propietario/lugares"); // redirecciona tras éxito
        }, 1000);
      } else {
        const textoError = await response.text();
        console.error("Error al crear el lugar:", textoError);
      }
    } catch (error) {
      console.error("Error en POST:", error);
    }
  };

  const handleCancel = () => {
    setNombre("");
    setCodigo("");
    setDireccion("");
    setZona(null);
    setSuccess(false);
    setErrorZona(false);
    nameRef.current?.focus();
    navigate("/lugares");
  };

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const selectZona = (zonaSeleccionada) => {
    setZona(zonaSeleccionada);
    setErrorZona(false);
    setIsOpen(false);
  };

  return (
    <div className="m-12">
      <div className="w-full bg-white rounded-xl p-6 space-y-6">
        <h1 className="text-2xl font-semibold text-[#213A58]">
          Agregar un nuevo establecimiento
        </h1>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-2 rounded">
            Lugar creado exitosamente.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[#213A58] font-medium mb-1">
              Nombre del lugar o establecimiento *
            </label>
            <input
              ref={nameRef}
              type="text"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ingrese nombre"
              className="w-full border border-black rounded-xl px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-[#213A58] font-medium mb-1">
              Código del establecimiento *
            </label>
            <input
              type="number"
              required
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Ingrese código"
              className="w-full border border-gray-400 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-[#213A58] font-medium mb-1">
              Dirección exacta del lugar *
            </label>
            <input
              type="text"
              required
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              placeholder="Ingrese dirección"
              className="w-full border border-gray-400 rounded px-3 py-2"
            />
          </div>

          <div ref={zonaRef}>
            <label className="block text-[#213A58] font-medium mb-1">
              Zona *
            </label>
            <div
              onClick={toggleDropdown}
              className="w-full border border-gray-400 rounded px-3 py-2 flex justify-between items-center cursor-pointer"
            >
              <span>{zona ? zona.nombre : "Seleccione una zona"}</span>
              <svg
                className={`h-4 w-4 ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            {isOpen && (
              <ul className="mt-1 max-h-48 overflow-auto border border-gray-300 rounded bg-white">
                {zonasDisponibles.map((z) => (
                  <li
                    key={z.id}
                    onClick={() => selectZona(z)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {z.nombre}
                  </li>
                ))}
              </ul>
            )}
            {errorZona && (
              <p className="text-red-600 text-sm mt-1">
                Por favor seleccione una zona.
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 bg-white border border-gray-400 text-[#213A58] rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#213A58] text-white rounded"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
