import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthProvider";
const API_URL = import.meta.env.VITE_API_URL;

function Solicitud() {
    const { token, user } = useAuth();

    const [zonas, setZonas] = useState([]);
    const [success, setSuccess] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [telefono, setTelefono] = useState("");
    const [dui, setDui] = useState("");
    const [telefonoLugar, setTelefonoLugar] = useState("");
    const [nitEstablecimiento, setNitEstablecimiento] = useState("");


    // Teléfono: 0000-0000
    const formatTelefono = (value) => {
        const cleaned = value.replace(/\D/g, "");
        if (cleaned.length <= 4) return cleaned;
        return cleaned.slice(0, 4) + "-" + cleaned.slice(4, 8);
    };

    // DUI: 00000000-0
    const formatDUI = (value) => {
        const cleaned = value.replace(/\D/g, "");
        if (cleaned.length <= 8) return cleaned;
        return cleaned.slice(0, 8) + "-" + cleaned.slice(8, 9);
    };

    // NIT: 0000-000000-000-0
    const formatNIT = (value) => {
        const cleaned = value.replace(/\D/g, "");

        if (cleaned.length <= 4) return cleaned;
        if (cleaned.length <= 10) return cleaned.slice(0, 4) + "-" + cleaned.slice(4, 10);
        if (cleaned.length <= 13)
            return cleaned.slice(0, 4) + "-" + cleaned.slice(4, 10) + "-" + cleaned.slice(10, 13);

        return (
            cleaned.slice(0, 4) +
            "-" +
            cleaned.slice(4, 10) +
            "-" +
            cleaned.slice(10, 13) +
            "-" +
            cleaned.slice(13, 14)
        );
    };

    // Regex correctos
    const duiRegex = /^\d{8}-\d{1}$/;                 // 00000000-0
    const telRegex = /^\d{4}-\d{4}$/;                 // 0000-0000
    const nitRegex = /^\d{4}-\d{6}-\d{3}-\d{1}$/;     // 0000-000000-000-0


    // Campos del formulario
    const [form, setForm] = useState({
        nombreCompleto: "",
        correo: "",
        telefono: "",
        dui: "",
        direccionUsuario: "",
        nombreLugar: "",
        numeroLugar: "",
        nitLugar: "",
        direccionLugar: "",
        zonaId: ""
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    useEffect(() => {
        const fetchZonas = async () => {
            try {
                const res = await fetch(`${API_URL}/lugares/zonas`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setZonas(data.map(z => ({ value: z.id, label: z.nombre })));
            } catch (err) {
                console.error("Error cargando zonas:", err);
            }
        };
        fetchZonas();
    }, [token]);

    const handleSubmit = async () => {

        if (!duiRegex.test(dui)) {
            return setErrorMsg("El DUI debe tener el formato 00000000-0");
        }

        if (!telRegex.test(telefono)) {
            return setErrorMsg("El teléfono debe tener el formato 0000-0000");
        }

        if (!telRegex.test(telefonoLugar)) {
            return setErrorMsg("El teléfono del lugar debe tener el formato 0000-0000");
        }

        if (!nitRegex.test(nitEstablecimiento)) {
            return setErrorMsg("El NIT debe tener el formato 0000-000000-000-0");
        }


        setErrorMsg(null);
        try {
            const response = await fetch(`${API_URL}/solicitudes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    idUsuario: user.id,
                    nombreCompleto: form.nombreCompleto,
                    direccion: form.direccionUsuario,
                    dui,
                    telefono,
                    correo: form.correo,
                    nombreLugar: form.nombreLugar,
                    direccionLugar: form.direccionLugar,
                    nit: nitEstablecimiento,
                    telefonoLugar,
                    idZona: form.zonaId,
                })


            });

            if (!response.ok) {
                throw new Error("Error al enviar la solicitud");
            }



            setSuccess(true);
            setErrorMsg(null);

            setForm({
                nombreCompleto: "",
                correo: "",
                telefono: "",
                dui: "",
                direccionUsuario: "",
                nombreLugar: "",
                numeroLugar: "",
                nitLugar: "",
                direccionLugar: "",
                zonaId: ""
            });
            setTelefono("");
            setDui("");
            setTelefonoLugar("");
            setNitEstablecimiento("");

        } catch (error) {
            console.error(error);
            setErrorMsg("Hubo un error al enviar la solicitud");
            setSuccess(false);
        }
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const handleCancel = () => {
        window.history.back();
    };


    return (
        <div className="m-12 bg-[#E4EFFD] min-h-screen flex justify-center">
            <div className="w-full bg-white rounded-xl p-6 space-y-6">
                <h1 className="justify-center flex text-2xl font-semibold text-[#213A58]">
                    Solicitud para ser propietario
                </h1>

                <p className="text-black">
                    Si eres dueño de un espacio de canchas de fútbol y deseas gestionarlo a través de nuestra
                    plataforma, primero debes enviarnos una solicitudes con los datos pertinentes,
                    para convertir tu cuenta de usuario en cuenta de propietario.
                </p>

                <p>¿Qué debes hacer?</p>

                <ol type="1">
                    <li className="text-pretty text-black">Llena el formulario con la información requerida.</li>
                    <li className="text-pretty text-black">Verifica que los datos estén correctos.</li>
                    <li className="text-pretty text-black">Súbelo usando el botón que aparece abajo.</li>
                </ol>

                {/* DATOS PERSONALES */}
                <p className="font-semibold text-[#213A58] mt-6">Datos personales *</p>
                <div className="space-y-4">
                    {/* Nombre completo */}
                    <div>
                        <label className="block mb-1 font-medium">Nombre completo</label>
                        <input
                            name="nombreCompleto"
                            type="text"
                            className="input input-bordered w-full bg-white border-gray-300"
                            value={form.nombreCompleto}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Correo y Teléfono */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Correo</label>
                            <input
                                name="correo"
                                type="email"
                                className="input input-bordered w-full bg-white border-gray-300"
                                value={form.correo}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Número de teléfono</label>
                            <input
                                type="text"
                                value={telefono}
                                onChange={(e) => setTelefono(formatTelefono(e.target.value))}
                                maxLength={9}
                                className="input input-bordered w-full bg-white border-gray-300"
                            />


                        </div>

                        {/* DUI y Dirección */}
                        <div>
                            <label className="block mb-1 font-medium">DUI</label>
                            <input
                                type="text"
                                value={dui}
                                onChange={(e) => setDui(formatDUI(e.target.value))}
                                maxLength={10}
                                className="input input-bordered w-full bg-white border-gray-300"
                            />

                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Dirección personal</label>
                            <input
                                name="direccionUsuario"
                                type="text"
                                className="input input-bordered w-full bg-white border-gray-300"
                                value={form.direccionUsuario}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                </div>


                <p className="font-semibold text-[#213A58] mt-6">Datos del lugar *</p>

                {/* DATOS DEL LUGAR */}
                <div className="space-y-4">
                    <div>
                        <label className="block mb-1 font-medium">Nombre del lugar o establecimiento</label>
                        <input
                            name="nombreLugar"
                            type="text"
                            className="input input-bordered w-full bg-white border-gray-300"
                            value={form.nombreLugar}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Número de teléfono del lugar</label>
                            <input
                                name="numeroLugar"
                                type="text"
                                value={telefonoLugar}
                                onChange={(e) => setTelefonoLugar(formatTelefono(e.target.value))}
                                maxLength={9}
                                className="input input-bordered  w-full bg-white border-gray-300"
                            />

                        </div>
                        <div>
                            <label className="block mb-1 font-medium">NIT del establecimiento</label>
                            <input
                                name="nitLugar"
                                type="text"
                                value={nitEstablecimiento}
                                onChange={(e) => setNitEstablecimiento(formatNIT(e.target.value))}
                                maxLength={17}
                                className="input input-bordered  w-full bg-white border-gray-300"
                            />

                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Dirección exacta del lugar</label>
                            <input
                                name="direccionLugar"
                                type="text"
                                className="input input-bordered  w-full bg-white border-gray-300 col-span-2"

                                value={form.direccionLugar}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block mb-1 font-medium">Zona</label>
                            <select
                                name="zonaId"
                                className="select select-bordered  w-full bg-white border-gray-300"
                                value={form.zonaId}
                                onChange={handleChange}
                            >
                                <option value="">Seleccione una zona</option>
                                {zonas.map(z => (
                                    <option key={z.value} value={z.value}>
                                        {z.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div>
                    <p>Importante:</p>
                    <p>El formulario debe contener información esencial sobre ti (como dueño) y sobre el lugar físico donde se encuentra la cancha. Esto nos ayuda a validar que todo esté en orden antes de permitirte administrar reservas y pagos en nuestra plataforma.
                        Una vez recibida tu solicitud, nuestro equipo la revisará y validará lo antes posible. Te notificaremos cuando tu cuenta haya sido aprobada como propietario.</p>
                    <p>¡Gracias por confiar en nosotros para impulsar tu negocio!</p>
                </div>

                {/* BOTONES */}
                <div className="flex justify-end gap-4 mt-6">
                    <button className="btn btn-outline" onClick={handleCancel}>
                        Cancelar
                    </button>

                    <button className="btn btn-primary bg-[#213A58]" onClick={handleSubmit}>
                        Enviar solicitud
                    </button>
                </div>
                {success && (
                    <div role="alert" className="alert alert-success mt-4 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 0 0 0118 0z" />
                        </svg>
                        <span>Solicitud enviada correctamente</span>
                    </div>
                )}

                {errorMsg && (
                    <div role="alert" className="alert alert-error mt-4 shadow-lg">
                        <span>{errorMsg}</span>
                    </div>
                )}

            </div>
        </div>
    );
}

export default Solicitud;
