
import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
const API_URL = import.meta.env.VITE_API_URL;  

import registro1 from '../assets/futbol-americano.png'
import registro2 from '../assets/futbol-americano-negro.png'

function Registro() {

    const [mostrarContrasena, setMostrarContrasena] = useState(false);
    const navigate = useNavigate();

    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [errores, setErrores] = useState({});

    const handleRegistro = async () => {
        const nuevosErrores = {};

        if (!nombre.trim()) nuevosErrores.nombre = "El nombre es obligatorio.";
        if (!apellido.trim()) nuevosErrores.apellido = "El apellido es obligatorio.";
        if (!correo.trim()) {
            nuevosErrores.correo = "El correo es obligatorio.";
        } else if (!/\S+@\S+\.\S+/.test(correo)) {
            nuevosErrores.correo = "El correo no es válido.";
        }

        if (!contrasena.trim()) {
            nuevosErrores.contrasena = "La contraseña es obligatoria.";
        } else if (contrasena.length < 6) {
            nuevosErrores.contrasena = "Debe tener al menos 6 caracteres.";
        }

        if (Object.keys(nuevosErrores).length > 0) {
            setErrores(nuevosErrores);
            return;
        }

        setErrores({});

        //llamada al back
        try {
            const response = await fetch(`${API_URL}/usuarios`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nombre: nombre,
                    apellido: apellido,
                    correo: correo,
                    contrasena: contrasena,
                    rolId: 2 //cliente
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error al registrar:", errorData);
                alert("Hubo un error al registrar. Verifica los datos.");
                return;
            }

            const data = await response.json();
            navigate("/login");

        } catch (error) {
            console.error("Error de red:", error);
            alert("Error de red al intentar registrar.");
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
                    src={registro1}
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
                                src={registro2}
                                alt="Logo"
                                className="w-8 h-8"
                            />
                        </Link>
                        <h2 className="text-2xl font-semibold text-[#213A58]">Crear una cuenta</h2>
                    </div>


                    {/* Formulario */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm mb-1 text-[#213A58]">Nombre</label>
                            <input
                                type="text"
                                value={nombre}
                                maxLength={30}
                                onChange={(e) => setNombre(e.target.value)}
                                className="input bg-transparent text-[#213A58] border-black input-bordered w-full pr-10"
                            />
                            {errores.nombre && <p className="text-red-500 text-sm">{errores.nombre}</p>}
                        </div>

                        <div>
                            <label className="block text-sm mb-1 text-[#213A58]">Apellido</label>
                            <input
                                type="text"
                                value={apellido}
                                maxLength={30}
                                onChange={(e) => setApellido(e.target.value)}
                                className="input bg-transparent text-[#213A58] border-black input-bordered w-full pr-10"
                            />
                            {errores.nombre && <p className="text-red-500 text-sm">{errores.nombre}</p>}
                        </div>

                        <div>
                            <label className="block text-sm mb-1 text-[#213A58]">Correo</label>
                            <input
                                type="email"
                                value={correo}
                                maxLength={30}
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
                                    maxLength={50}
                                    onChange={(e) => setContrasena(e.target.value)}
                                    className="input bg-transparent text-[#213A58] border-black input-bordered w-full pr-10"
                                />
                                {errores.contrasena && <p className="text-red-500 text-sm">{errores.contrasena}</p>}
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center">
                            <button onClick={handleRegistro} className="btn bg-[#213A58] text-white rounded-full w-64 justify-center">
                                Regístrate
                            </button>


                            <p className="text-xs text-gray-600 text-center mt-2">
                                Cuando pinches sobre el botón "Regístrate", crearás una cuenta en Canchitas y,
                                por lo tanto, estarás aceptando nuestros Términos de Uso y Política de Privacidad
                            </p>

                            <p className="text-center text-black text-sm mt-4">
                                ¿Ya tienes una cuenta?
                            </p>
                            <Link to="/login" className="text-black underline">Inicia sesión</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Registro;
