//Importar cada imagen desde assets 
import home1 from '../assets/Canchitas-home2.png'
import home2 from '../assets/Cachitas-home1.png'
import home3 from '../assets/Canchitas-home3.png'

function Home() {
  return (
    <div className="bg-white text-[#213A58]">


      {/* parte final con los botones */}
      <div className="bg-[#6CF9C3] text-center py-12 space-y-4">
        <h2 className="text-3xl font-bold text-[#213A58]">¡TU DECISIÓN <br /> INICIA YA!</h2>
        <div className="flex justify-center gap-4 mt-4">
          <a
            href="/login"
            className="bg-black text-white px-6 py-2 rounded-full hover:bg-emerald-400 transition"
          >
            Inicia sesión
          </a>
          <br />
          <a
            href="/registro"
            className="bg-black text-white px-6 py-2 rounded-full hover:bg-emerald-400 transition"
          >
            Regístrate
          </a>
        </div>
      </div>

      {/* primera imagen en el home */}
      <div className="w-full">
        <img
          src={home2}
          alt="Niños jugando fútbol"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* Inicia tu temporada de deporte */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-[#213A58] px-6 py-10">
        <h2 className="text-white text-3xl font-semibold text-center md:text-left">
          INICIA TU TEMPORADA DE DEPORTE
        </h2>
        <img
          src={home1}
          alt="Jugador fútbol"
          className="w-full md:w-1/2 lg:w-1/3 rounded"
        />
      </div>

      {/* Canchas bien cuidadas */}
      <div className="flex flex-col md:flex-row-reverse items-center justify-between bg-[#50BFC3] px-6 py-10">
        <h2 className="text-white text-3xl font-semibold text-center md:text-left">
          CANCHAS BIEN CUIDADAS
        </h2>
        <img
          src={home3}
          alt="Cancha de fútbol"
          className="w-full md:w-1/2 lg:w-1/3 rounded"
        />
      </div>

    </div>
  );
}

export default Home;
