import { useEffect, useState } from "react";
import Dropdown from "../../components/Dropdown";
import CalendarioReservas from "../../components/CalendarioReservas";
import SelectorHoras from "../../components/SelectorHoras";
import { useAuth } from "../../context/AuthProvider";
const API_URL = import.meta.env.VITE_API_URL;

function Reservacion() {
    const { token, user } = useAuth();

    const [zona, setZona] = useState("");
    const [zonasDisponibles, setZonasDisponibles] = useState([]);


    const [lugar, setLugar] = useState("");
    const [lugaresDisponibles, setLugaresDisponibles] = useState([]);


    const [tipoCancha, setTipoCancha] = useState("");
    const [tiposCanchasDisponibles, setTiposCanchasDisponibles] = useState([]);

    const [cancha, setCancha] = useState("");
    const [canchasDisponibles, setCanchasDisponibles] = useState([]);
    const [canchaSeleccionada, setCanchaSeleccionada] = useState(null);

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedHours, setSelectedHours] = useState([]);
    const [horasDisponibles, setHorasDisponibles] = useState([]);      // Horarios que el campo ofrece según Jornada
    const [horasReservadas, setHorasReservadas] = useState([]);
    const [mapHourToJornada, setMapHourToJornada] = useState({});

    const [jornadasDisponibles, setJornadasDisponibles] = useState([]);
    const [metodoPago, setMetodoPago] = useState("");


    const [numeroTarjeta, setNumeroTarjeta] = useState("");
    const [vencimiento, setVencimiento] = useState("");
    const [cvv, setCvv] = useState("");
    const [formularioValido, setFormularioValido] = useState(false);
    const [pagoExitoso, setPagoExitoso] = useState(false);

    const zonaLabel = zonasDisponibles.find(
        z => z.value === (typeof zona === "string" ? parseInt(zona, 10) : zona)
    )?.label || "";

    const lugarLabel = lugaresDisponibles.find(
        l => l.value === (typeof lugar === "string" ? parseInt(lugar, 10) : lugar)
    )?.label || "";

    //Para calificar canchas
    const [rating, setRating] = useState(null);
    const [userRating, setUserRating] = useState(0);





    // Variables de detalle, con valores por defecto
    let hInicio = null;
    let numBloques = 0;
    let totalReal = 0;
    let horaSalida = "";

    if (selectedHours.length > 0) {
        // 1) Hora de inicio
        hInicio = parseInt(selectedHours[0].split(':')[0], 10);

        // 2) Última hora
        const hFin = parseInt(
            selectedHours[selectedHours.length - 1].split(':')[0],
            10
        );

        // 3) Número de bloques (mínimo 1)
        numBloques = Math.max(hFin - hInicio, 1);

        // 4) Calcular total
        const precioPorHora = mapHourToJornada[selectedHours[0]]?.precioPorHora || 0;
        totalReal = precioPorHora * numBloques;

        // 5) Formar cadena de salida
        horaSalida = `${String(hInicio + numBloques).padStart(2, '0')}:00`;
    }

    useEffect(() => {
        const fetchZonas = async () => {
            try {
                const response = await fetch(`${API_URL}/lugares/zonas`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await response.json();
                setZonasDisponibles(data.map(z => ({ value: z.id, label: z.nombre })));
            } catch (error) {
                console.error("Error al cargar zonas:", error);
            }
        };
        fetchZonas();
    }, [token]);

    useEffect(() => {
        if (!zona) return;
        const fetchLugares = async () => {
            try {
                const res = await fetch(`${API_URL}/zonas/${zona}/lugares`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (Array.isArray(data)) {
                    setLugaresDisponibles(data.map(l => ({ value: l.id, label: l.nombre })));
                } else {
                    console.error("El backend no devolvió una lista de lugares:", data);
                    setLugaresDisponibles([]);
                }
            } catch (error) {
                console.error("Error cargando lugares:", error);
            }
        };
        fetchLugares();
    }, [zona, token]);

    useEffect(() => {
        if (!lugar) return;
        const fetchCanchas = async () => {
            try {
                const res = await fetch(`${API_URL}/lugares/${lugar}/canchas`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                setCanchasDisponibles(data.map(c => ({
                    value: c.id,
                    label: c.nombre,
                    tipo: c.tipoCancha,
                    imagen: c.imagenes?.[0] || ""
                })));
                const tiposUnicos = [...new Set(data.map(c => c.tipoCancha))];
                setTiposCanchasDisponibles(tiposUnicos.map(t => ({ value: t, label: t })));
                setTipoCancha("");
                setCancha("");
            } catch (error) {
                console.error("Error cargando canchas:", error);
            }
        };
        fetchCanchas();
    }, [lugar, token]);

    useEffect(() => {
        if (!cancha || !selectedDate) return;
        const dia = selectedDate
            .toLocaleDateString('es-ES', { weekday: 'long' })
            .toUpperCase();

        const norm = (h12) => {
            const [time, period] = h12.split(' ');
            if (!time || !period) return null;
            let h = parseInt(time.split(':')[0], 10);
            const ampm = period[0].toLowerCase();
            if (ampm === 'p' && h < 12) h += 12;
            if (ampm === 'a' && h === 12) h = 0;
            return `${String(h).padStart(2, '0')}:00`;
        };

        const fetchJornadas = async () => {
            try {
                const res = await fetch(
                    `${API_URL}/canchas/${cancha}/jornadas?dia=${dia}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                const data = await res.json();
                const disponibles = data.filter(j => j.estadoDisponibilidad === "DISPONIBLE");
                setJornadasDisponibles(disponibles);

                // Construye el mapa hora→jornada
                const mapa = {};
                disponibles.forEach(j => {
                    const h = norm(j.horaInicio);
                    if (h) {
                        mapa[h] = j;
                    }
                });
                setMapHourToJornada(mapa);

                // Y las horas disponibles para el selector:
                const horasNorm = Object.keys(mapa);
                setHorasDisponibles(horasNorm);

                // Limpia reservas
                setHorasReservadas([]);
            } catch (err) {
                console.error("Error cargando jornadas:", err);
            }
        };

        fetchJornadas();
    }, [cancha, selectedDate, token]);

    //Calificar canchas
    useEffect(() => {
        if (!cancha) return;

        const fetchRating = async () => {
            try {
                const res = await fetch(
                    `${API_URL}/calificaciones/promedio/${cancha}`,
                    {
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    }
                );
                const prom = await res.text();
                setRating(Number(prom));
            } catch (error) {
                console.error("Error obteniendo rating:", error);
            }
        };

        fetchRating();
    }, [cancha]);

    //Const para calificar
    const renderStars = (ratingValue) => {
        if (ratingValue === null) return null;

        const filledStars = Math.floor(ratingValue);
        const halfStar = ratingValue % 1 >= 0.5;
        const emptyStars = 5 - filledStars - (halfStar ? 1 : 0);

        return (
            <div className="flex items-center gap-2 mt-2">
                <div className="text-3xl text-white flex">
                    {Array(filledStars).fill("⭐")}
                    {halfStar && "⭐"}
                    {Array(emptyStars).fill("☆")}
                </div>

                <span className="text-white text-lg">
                    {ratingValue.toFixed(1)}
                </span>
            </div>
        );
    };
    const renderRatingInput = () => {
        return (
            <div className="flex gap-2 mt-4">
                {[1, 2, 3, 4, 5].map((value) => (
                    <span
                        key={value}
                        onClick={() => setUserRating(value)}
                        className="cursor-pointer text-4xl transition"
                        style={{ color: value <= userRating ? "#FFD700" : "#777" }}
                    >
                        ★
                    </span>
                ))}
            </div>
        );
    };


    const enviarCalificacion = async () => {
        if (!cancha) {
            alert("Debe seleccionar una cancha.");
            return;
        }

        if (!user?.id) {
            alert("Error: no se encontró el usuario.");
            return;
        }

        const payload = {
            idUsuario: user.id,
            idCancha: cancha,
            puntaje: userRating
        };

        console.log("Payload enviado:", payload);

        try {
            const res = await fetch(`${API_URL}/calificaciones`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Error al enviar calificación");

            alert("Calificación enviada con éxito");

            // refrescar promedio
            const resProm = await fetch(
                `${API_URL}/calificaciones/promedio/${cancha}`,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            const prom = await resProm.text();
            setRating(Number(prom));

        } catch (e) {
            console.error("Error enviando calificación", e);
            alert("Ya has calificado esta cancha");
        }
    };





    //Fin de calificacion de cancha


    const handleSeleccionCancha = (id) => {
        const idNum = typeof id === "string" ? parseInt(id, 10) : id;
        setCancha(idNum);
        const encontrada = canchasDisponibles.find(c => c.value === idNum);
        setCanchaSeleccionada(encontrada);
    };


    const toggleHora = (hora) => {
        setSelectedHours((prev) =>
            prev.includes(hora) ? prev.filter((h) => h !== hora) : [...prev, hora].sort()
        );
    };

    // Validaciones de formulario
    const validarNumeroTarjeta = (num) => /^\d{16}$/.test(num);
    const validarVencimiento = (v) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(v);
    const validarCVV = (c) => /^\d{3}$/.test(c);

    useEffect(() => {
        const esValido =
            validarNumeroTarjeta(numeroTarjeta) &&
            validarVencimiento(vencimiento) &&
            validarCVV(cvv);
        setFormularioValido(esValido);
    }, [numeroTarjeta, vencimiento, cvv]);


    const handlePagar = async () => {
        if (!formularioValido || !selectedDate || !canchaSeleccionada || selectedHours.length === 0)
            return;

        const fechaReserva = selectedDate.toISOString().split("T")[0];

        // Empareja directamente:
        const bloques = selectedHours.map(h => mapHourToJornada[h]);

        if (bloques.some(b => !b)) {
            return alert("Alguna hora no coincide con las jornadas disponibles.");
        }

        try {
            await Promise.all(bloques.map(bloque => {
                const body = {
                    canchaId: canchaSeleccionada.value,
                    lugarId: parseInt(lugar, 10),
                    usuarioId: user.id,
                    fechaReserva,
                    horaEntrada: bloque.horaInicio,
                    horaSalida: bloque.horaFin,
                    metodoPagoId: parseInt(metodoPago, 10),
                };
                return fetch(`${API_URL}/reservas`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(body)
                })
                    .then(res => res.json().then(data => {
                        if (!res.ok) throw new Error(data.message || "Error en reserva");
                        return data;
                    }));
            }));

            setPagoExitoso(true);
            limpiarFormulario();
        } catch (err) {
            console.error("Error en alguna reserva:", err);
            alert(err.message);
        }

    };



    const limpiarFormulario = () => {
        setNumeroTarjeta("");
        setVencimiento("");
        setCvv("");
        setSelectedDate(null);
        setSelectedHours([]);
        setZona("");
        setLugar("");
        setTipoCancha("");
        setCancha("");
        setCanchaSeleccionada(null);
        setMetodoPago("");

        setTimeout(() => {
            setPagoExitoso(false);
        }, 5000);
    };

    const puedeReservar = formularioValido && selectedDate && selectedHours.length > 0 && canchaSeleccionada && metodoPago;

    const metodosPago = [
        { label: "Tarjeta de débito", value: 1 },
        { label: "Tarjeta de crédito", value: 2 },
    ];


    return (
        <div>
            <div className="m-12">
                <div className="w-full bg-white rounded-xl p-6 space-y-6">
                    <h2 className="text-[#213A58] text-2xl flex justify-center font-bold">Crear reservación</h2>

                    <ul>
                        <li className="text-pretty text-black font-semibold">Pasos para reservar tu cancha</li>
                        <li className="text-pretty text-black ">Selecciona tu zona o ciudad:
                            Elige la ubicación donde deseas alquilar una cancha.</li>
                        <li className="text-pretty text-black ">Escoge el lugar disponible:
                            Verás una lista de complejos o centros deportivos registrados en esa zona.</li>
                        <li className="text-pretty text-black ">Filtra por tipo de cancha:
                            Puedes elegir entre canchas de futboll rapido o canchas de grama articifial.</li>
                        <li className="text-pretty text-black "> Elige la cancha específica:
                            Selecciona la cancha que mejor se adapte a lo que estás buscando</li>
                        <li className="text-pretty text-black ">Selecciona la fecha y el horario:
                            Revisa la disponibilidad y escoge el día y hora que prefieras. Solo se mostrarán los horarios habilitados. </li>
                        <li className="text-pretty text-black "> Ingresa tu método de pago:
                            Completa el pago con tu tarjeta de crédito o débito de forma segura desde la plataforma.</li>
                        <li className="text-black font-medium">¡Listo! Solo te queda llegar a jugar.</li>
                    </ul>

                </div>
            </div>
            <div className="m-12">
                <div className="w-full bg-[#213A58] border-2 rounded-xl p-6 space-y-6">
                    <h2 className="text-2xl text-white flex justify-center font-bold">Reservar Cancha</h2>

                    <div className="grid grid-cols-2">
                        <div className="grid grid-rows-4 m-6">
                            <Dropdown label="Zona" options={zonasDisponibles} value={zona} onChange={setZona} />
                            <Dropdown label="Lugar" options={lugaresDisponibles} value={lugar} onChange={setLugar} />
                            <Dropdown label="Tipo de Cancha" options={tiposCanchasDisponibles} value={tipoCancha} onChange={setTipoCancha} />

                            <Dropdown
                                label="Cancha"
                                options={canchasDisponibles.filter(c => !tipoCancha || c.tipo === tipoCancha)}
                                value={cancha}
                                onChange={handleSeleccionCancha}
                            />
                        </div>
                        <div className="m-6 flex flex-col items-center justify-center">

                            {/* ⭐ Mostrar SOLO si hay cancha seleccionada */}
                            {canchaSeleccionada && canchaSeleccionada.value && (
                                <>

                                    {/* ⭐ Promedio */}
                                    <div className="text-yellow-400 text-2xl mb-2">
                                        {renderStars(rating)}
                                    </div>

                                    {/* ⭐ Imagen */}
                                    {canchaSeleccionada.imagen && (
                                        <img
                                            src={canchaSeleccionada.imagen}
                                            alt={`Foto de cancha ${canchaSeleccionada.label}`}
                                            className="w-full h-full object-cover rounded-lg shadow-lg mt-2"
                                        />
                                    )}

                                    {/* ⭐ Calificación del usuario */}
                                    <h3 className="text-white text-xl mt-4">Calificar esta cancha</h3>

                                    {renderRatingInput()}

                                    <button
                                        onClick={enviarCalificacion}
                                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                                    >
                                        Enviar calificación
                                    </button>
                                </>
                            )}
                        </div>
                    </div>


                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5" >
                            <CalendarioReservas
                                fechasOcupadas={[]}
                                selectedDate={selectedDate}
                                onDateChange={setSelectedDate}
                            />


                        </div>
                        <div className="p-5">
                            {selectedDate && cancha && horasDisponibles.length > 0 && (
                                <SelectorHoras
                                    horasDisponibles={horasDisponibles}
                                    horasReservadas={horasReservadas} // o []
                                    horasSeleccionadas={selectedHours}
                                    onHoraClick={toggleHora}
                                />
                            )}
                        </div>

                    </div>

                    {user && (
                        <div className="p-5 bg-[#213A58] rounded-lg shadow text-white mb-6">
                            <label className="label">
                                <span className="font-bold mb-2">Datos personales</span>
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p><strong>Usuario:</strong></p>
                                    <p>{user.nombre}</p>
                                </div>
                                <div>
                                    <p><strong>Correo:</strong></p>
                                    <p>{user.correo}</p>
                                </div>
                            </div>
                        </div>
                    )}



                    <Dropdown label="Método de pago" options={metodosPago} value={metodoPago} onChange={setMetodoPago} />
                    {!metodoPago && (
                        <p className="text-white text-sm">
                            Selecciona un método de pago.
                        </p>
                    )}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <input
                                type="text"
                                maxLength={16}
                                className="input input-bordered bg-transparent border-white w-full  text-white placeholder:text-white"
                                placeholder="Número de tarjeta"
                                value={numeroTarjeta}
                                onChange={(e) => setNumeroTarjeta(e.target.value.replace(/\D/g, ""))}
                            />
                        </div>
                        <div>
                            <input
                                type="text"
                                className="input input-bordered bg-transparent border-white w-full text-white placeholder:text-white"
                                placeholder="MM/AA"
                                maxLength={5}
                                value={vencimiento}
                                onChange={(e) => setVencimiento(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="CVV"
                                value={cvv}
                                className="input input-bordered bg-transparent border-white w-full  text-white placeholder:text-white"
                                maxLength={3}
                                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3">
                        {!validarNumeroTarjeta(numeroTarjeta) && (
                            <span className="text-white text-sm">Debe tener 16 dígitos</span>
                        )}
                        {!validarVencimiento(vencimiento) && (
                            <span className="text-white text-sm">Formato MM/AA</span>
                        )}
                        {!validarCVV(cvv) && (
                            <span className="text-white text-sm">3 dígitos</span>
                        )}
                    </div>

                    {canchaSeleccionada && selectedHours.length > 0 && (
                        <div className="border-emerald-400 border p-4 rounded-lg shadow text-white bg-[#213A58] mt-6">
                            <h2 className="font-bold text-xl mb-4">Detalles de compra</h2>


                            <div className="grid grid-cols-2">
                                <div>
                                    <p><strong>Zona:</strong> {zonaLabel}</p>
                                    <p><strong>Lugar:</strong> {lugarLabel}</p>
                                    <p><strong>Cancha:</strong> {canchaSeleccionada.label}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p><strong>Fecha:</strong> {selectedDate.toLocaleDateString()}</p>
                                        <p><strong>Entrada:</strong> {`${String(hInicio).padStart(2, '0')}:00`}</p>
                                        <p><strong>Salida:</strong> {horaSalida}</p>
                                    </div>

                                </div>
                            </div>
                            <div>
                                <p className="text-lg">
                                    <strong>Precio Total:</strong> ${totalReal.toFixed(2)}
                                </p>
                            </div>
                        </div>

                    )}

                    <button
                        className="btn btn-success mt-4 w-full"
                        disabled={!puedeReservar}
                        onClick={handlePagar}>
                        Confirmar y pagar ${totalReal.toFixed(2)}
                    </button>

                    {pagoExitoso && (
                        <div role="alert" className="alert alert-success mt-4 shadow-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>¡Pago realizado con éxito! Tu reservación ha sido confirmada.</span>
                        </div>

                    )}
                </div>

            </div>
        </div >
    );
}

export default Reservacion;
