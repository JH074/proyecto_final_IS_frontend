import { Link } from "react-router-dom";

import infochanchitas1 from '../assets/Infocanchas1.png'
import infochanchitas2 from  '../assets/Infocanchas2.png'
import infochanchitas3 from '../assets/Infocanchas3.png'
const API_URL = import.meta.env.VITE_API_URL;  

function InfoCanchitas() {
    return (
        <div className="bg-[#E4EFFD] min-h-screen flex flex-col justify-between">

            <main className="flex-grow px-6 py-10 space-y-10">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-[#213A58]">Canchas</h1>

                {/* Beneficios de nuestras canchas */}
                <div className="bg-[#213A58] text-white rounded-lg p-6 flex flex-col md:flex-row items-center gap-6">
                    <img
                        src={infochanchitas1}
                        alt="Cancha 1"
                        className="w-full md:w-1/3 rounded-md"
                    />
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Beneficios de nuestras canchas</h2>
                        <p className="text-sm">
                            Disfruta de canchas en excelente estado, con superficies ideales para jugar sintéticas.
                            Todos los espacios están verificados, bien iluminados y equipados con lo necesario para que te enfoques solo en lo más importante: jugar y disfrutar.
                        </p>
                    </div>
                </div>

                {/* como funciona  */}
                <div className="bg-[#168B9D] text-white rounded-lg p-6 flex flex-col md:flex-row-reverse items-center gap-6">
                    <img
                        src={infochanchitas2}
                        alt="Cancha 2"
                        className="w-full md:w-1/3 rounded-md"
                    />
                    <div>
                        <h2 className="text-xl font-semibold mb-2">¿Cómo funciona?</h2>
                        <p className="text-sm">
                            Reservar nunca fue tan simple. Solo seleccionas tu zona, eliges la cancha, escoges el horario que prefieras y pagas con tarjeta desde tu computadora.
                            En segundos, tu espacio queda reservado y confirmado.
                        </p>
                    </div>
                </div>

                {/* Beneficios de nuestra pagina */}
                <div className="bg-[#168B9D] text-white rounded-lg p-6 flex flex-col md:flex-row items-center gap-6">
                    <img
                        src={infochanchitas3}
                        alt="Cancha 3"
                        className="w-full md:w-1/3 rounded-md"
                    />
                    <div>
                        <h2 className="text-xl font-semibold mb-2">Beneficios de nuestra página</h2>
                        <p className="text-sm">
                            Nuestra página conecta jugadores con los mejores espacios deportivos de la zona.
                            Ahorras tiempo, evitas llamadas y garantizas tu lugar sin complicaciones.
                            Además, al usar nuestro sistema ayudas a que nuestros centros deportivos crezcan y mejoren su servicio.
                        </p>
                    </div>
                </div>

                {/* el boton reserva ya */}
                <div className="flex justify-center">
                    <button className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800">
                         <Link to={"/reservar"}>
                         Reserva ya
                        </Link>
                    </button>
                </div>
            </main>
        </div>
    );
}

export default InfoCanchitas;
