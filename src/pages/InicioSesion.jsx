
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
const API_URL = import.meta.env.VITE_API_URL;  

import iniciosesion1 from '../assets/futbol-americano.png'
import iniciosesion2 from '../assets/futbol-americano-negro.png'

function InicioSesion() {

    const { login } = useAuth();
    const navigate = useNavigate();

    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const [errores, setErrores] = useState({});

    const handleInicioSesion = async () => {
        const nuevosErrores = {};

        if (!correo.trim()) {
            nuevosErrores.correo = "El correo es obligatorio.";
        } else if (!/\S+@\S+\.\S+/.test(correo)) {
            nuevosErrores.correo = "El correo no es válido.";
        }

        if (!contrasena.trim()) {
            nuevosErrores.contrasena = "La contraseña es obligatoria.";
        } else if (contrasena.length < 6) {
            nuevosErrores.contrasena = "La contraseña debe tener al menos 6 caracteres.";
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        setErrores({});
        try {
            await login(correo, contrasena);
            navigate("/", { replace: true });
        } catch (err) {
            alert(err.message || "Error al iniciar sesión");
        }
    };


    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

            {/* Parte izquierda */}
            <button
                onClick={() => navigate(-1)}
                className="absolute top-4 left-4 p-2 rounded-full bg-[#213A58] text-white hover:bg-[#1a2f47] z-50"
                aria-label="Volver"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" strokeWidth={1.5}
                    stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                </svg>
            </button>


            <div className="bg-[#213A58] flex items-center justify-center p-10">
                <img
                    src={iniciosesion1}
                    alt="Fútbol americano"
                    className="w-64 md:w-80 lg:w-96"
                />
            </div>

            {/* Parte derecha */}
            <div className="bg-[#E4EFFD] flex items-center justify-center p-6">
                <div className="w-full max-w-md">
                    {/* Logo y título */}
                    <div className="flex flex-col items-center justify-center mb-6">
                        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
                            <h1 className="text-xl font-bold text-[#213A58]">Canchitas</h1>
                            <img
                                src={iniciosesion2}
                                alt="Logo"
                                className="w-8 h-8"
                            />
                        </Link>
                        <p className="text-black ">¡Hola de nuevo!</p>
                        <h2 className="text-2xl font-semibold text-[#213A58]">Inicia Sesión</h2>
                    </div>


                    {/* Formulario */}
                    <div className="space-y-4">

                        <div>
                            <label className="block text-sm mb-1 text-[#213A58]">Correo</label>
                            <input
                                type="email"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                className="input bg-transparent text-[#213A58] border-black input-bordered w-full pr-10"
                            />
                            {errores.correo && <p className="text-red-500 text-sm">{errores.correo}</p>}

                        </div>

                        <div>
                            <label className="block text-sm mb-1 text-[#213A58]">Contraseña</label>
                            <div className="relative">
                                <input
                                    type={mostrarContrasena ? "text" : "password"}
                                    value={contrasena}
                                    onChange={(e) => setContrasena(e.target.value)}
                                    className="input bg-transparent text-[#213A58] border-black input-bordered w-full pr-10"
                                />
                                {errores.contrasena && <p className="text-red-500 text-sm">{errores.contrasena}</p>}
                                <div
                                    onClick={() => setMostrarContrasena(!mostrarContrasena)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-[#213A58]"
                                >
                                    {mostrarContrasena ? (

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>

                                    ) : (

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg>


                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                            <button onClick={handleInicioSesion} className="btn text-white bg-[#213A58] rounded-full w-64 justify-center">
                                Iniciar sesión
                            </button>

                            <p className="text-center text-black text-sm mt-4">
                                ¿Todavía no tienes una cuenta?
                            </p>
                            <Link to="/registro" className="text-black underline">Registrate</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InicioSesion;