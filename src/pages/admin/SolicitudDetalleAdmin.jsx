// src/pages/admin/SolicitudDetalleAdmin.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const API_URL = import.meta.env.VITE_API_URL;

function SolicitudDetalleAdmin() {
  const { token, role } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  const [solicitud, setSolicitud] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [modalTipo, setModalTipo] = useState(null); // "aprobar" | "rechazar" | null

  // Solo ADMIN puede ver esta pantalla
  useEffect(() => {
    if (role && role !== "ADMIN") {
      navigate("/");
    }
  }, [role, navigate]);

  // Traer solicitud
  useEffect(() => {
    const fetchSolicitud = async () => {
      try {
        const res = await fetch(`${API_URL}/solicitudes/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("No se pudo cargar la solicitud");
        }

        const data = await res.json();
        setSolicitud(data);
        setErrorMsg(null);
      } catch (err) {
        console.error("Error cargando solicitud:", err);

        // Datos de ejemplo si falla el backend
        setSolicitud({
          idSolicitud: id,
          nombreCompleto: "Juan Pérez de Ejemplo",
          correo: "juan.ejemplo@correo.com",
          telefono: "7777-8888",
          direccion: "Col. Ejemplo, San Salvador",
          dui: "01234567-8",
          nombreLugar: "Cancha Ejemplo",
          telefonoLugar: "2222-3333",
          nit: "1234-567890-123-4",
          direccionLugar: "Calle Ejemplo #123, San Salvador",
          zona: "Zona Central (Ejemplo)",
          fechaSolicitud: "2025-01-01",
          estadoSolicitud: "PENDIENTE",
        });

        setErrorMsg(
          "No se pudo cargar la solicitud real. Mostrando datos de ejemplo."
        );
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchSolicitud();
    }
  }, [id, token]);

  // Llamar endpoint aprobar/rechazar
  const handleAccion = async (tipo) => {
    if (!solicitud) return false;

    setProcessing(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`${API_URL}/solicitudes/${id}/${tipo}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const text = await res.text();

      if (!res.ok) {
        throw new Error(text || "Error al procesar la solicitud");
      }

      const nuevoEstado = tipo === "aprobar" ? "APROBADA" : "RECHAZADA";

      setSolicitud((prev) =>
        prev ? { ...prev, estadoSolicitud: nuevoEstado } : prev
      );

      return true;
    } catch (err) {
      console.error(`Error al ${tipo} la solicitud:`, err);
      setErrorMsg(err.message || "Ocurrió un error");
      return false;
    } finally {
      setProcessing(false);
    }
  };

  // Confirmar desde el modal
  const handleConfirmAccion = async () => {
    if (!modalTipo) return;
    const ok = await handleAccion(modalTipo);
    if (ok) {
      setModalTipo(null);
      navigate("/admin/solicitudes");
    }
  };

  if (loading) {
    return (
      <div className="m-12">
        <div className="w-full bg-white rounded-xl p-6">
          <p>Cargando solicitud...</p>
        </div>
      </div>
    );
  }

  if (!solicitud) {
    return (
      <div className="m-12">
        <div className="w-full bg-white rounded-xl p-6 space-y-4">
          <p className="text-red-600">No se encontró la solicitud.</p>
          <button
            className="btn bg-[#213A58] text-white"
            onClick={() => navigate("/admin/solicitudes")}
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  const isPendiente = solicitud.estadoSolicitud === "PENDIENTE";
  return (
    <>
      <div className="m-12 bg-[#E4EFFD] min-h-screen flex justify-center">
        <div className="w-full bg-white rounded-xl p-6 space-y-6">
          <h1 className="text-2xl font-semibold text-[#213A58]">
            Detalle de solicitud #{solicitud.idSolicitud}
          </h1>

          {errorMsg && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-2 rounded">
              {errorMsg}
            </div>
          )}

          {/* Info general */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-semibold text-gray-700">
                Fecha de solicitud:{" "}
              </span>
              <span>{solicitud.fechaSolicitud || "—"}</span>
            </div>
            <div>
              <span className="font-semibold text-gray-700">Estado: </span>
              <span className="font-semibold">
                {solicitud.estadoSolicitud || "PENDIENTE"}
              </span>
            </div>
          </div>

          {/* DATOS PERSONALES */}
          <p className="font-semibold text-[#213A58] mt-4">Datos personales</p>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Nombre completo</label>
              <p className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                {solicitud.nombreCompleto}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">Correo</label>
                <p className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                  {solicitud.correo}
                </p>
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Número de teléfono
                </label>
                <p className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                  {solicitud.telefono}
                </p>
              </div>

              <div>
                <label className="block mb-1 font-medium">DUI</label>
                <p className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                  {solicitud.dui}
                </p>
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Dirección personal
                </label>
                <p className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                  {solicitud.direccion}
                </p>
              </div>
            </div>
          </div>

          {/* DATOS DEL LUGAR */}
          <p className="font-semibold text-[#213A58] mt-6">Datos del lugar</p>
          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">
                Nombre del lugar o establecimiento
              </label>
              <p className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                {solicitud.nombreLugar}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 font-medium">
                  Número de teléfono del lugar
                </label>
                <p className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                  {solicitud.telefonoLugar}
                </p>
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  NIT del establecimiento
                </label>
                <p className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                  {solicitud.nit}
                </p>
              </div>
              <div className="col-span-2">
                <label className="block mb-1 font-medium">
                  Dirección exacta del lugar
                </label>
                <p className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                  {solicitud.direccionLugar}
                </p>
              </div>
              <div>
                <label className="block mb-1 font-medium">Zona</label>
                <p className="border border-gray-300 rounded px-3 py-2 bg-gray-50">
                  {solicitud.zona}
                </p>
              </div>
            </div>
          </div>

          {/* BOTONES CENTRADOS */}
          <div className="flex justify-center gap-4 mt-6">
        <button
    className="btn bg-[#213A58] text-white"
    onClick={() => navigate("/admin/solicitudes")}
    disabled={processing}
  >
    Volver
  </button>



             {isPendiente && (
    <>
      <button
        className="btn bg-green-600 text-white"
        disabled={processing}
        onClick={() => setModalTipo("aprobar")}
      >
        Aprobar solicitud
      </button>

      <button
        className="btn bg-red-600 text-white"
        disabled={processing}
        onClick={() => setModalTipo("rechazar")}
      >
        Rechazar solicitud
      </button>
    </>
  )}
          </div>
        </div>
      </div>

      {/* MODAL DE CONFIRMACIÓN */}
{modalTipo && isPendiente && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4">
            <h2 className="text-lg font-semibold text-[#213A58]">
              {modalTipo === "aprobar"
                ? "Aprobar solicitud"
                : "Rechazar solicitud"}
            </h2>
            <p>
              ¿Estás seguro de que deseas{" "}
              {modalTipo === "aprobar" ? "aprobar" : "rechazar"} esta solicitud?
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="btn btn-outline"
                onClick={() => setModalTipo(null)}
                disabled={processing}
              >
                No, cancelar
              </button>
              <button
                className={`btn text-white ${
                  modalTipo === "aprobar" ? "bg-green-600" : "bg-red-600"
                }`}
                onClick={handleConfirmAccion}
                disabled={processing}
              >
                {processing ? "Procesando..." : "Sí, confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SolicitudDetalleAdmin;
